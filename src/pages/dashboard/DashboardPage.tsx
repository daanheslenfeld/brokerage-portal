import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Wallet,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
  Plus,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  MoreHorizontal,
  ShoppingCart,
  Rocket,
  CheckCircle,
  Beaker,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { OrderModal } from '../../components/trading/OrderModal';
import { DepositWithdrawModal } from '../../components/trading/DepositWithdrawModal';
import type { ETF } from '../../types';

type ChartPeriod = '1M' | '3M' | '6M' | '1J' | 'Max';

// Generate portfolio history data based on period
function generatePortfolioData(period: ChartPeriod, currentValue: number) {
  const now = new Date();
  const data: { date: string; value: number }[] = [];

  let days: number;
  let interval: number;

  switch (period) {
    case '1M':
      days = 30;
      interval = 1; // Daily
      break;
    case '3M':
      days = 90;
      interval = 3; // Every 3 days
      break;
    case '6M':
      days = 180;
      interval = 7; // Weekly
      break;
    case '1J':
      days = 365;
      interval = 14; // Bi-weekly
      break;
    case 'Max':
      days = 730; // 2 years
      interval = 30; // Monthly
      break;
    default:
      days = 180;
      interval = 7;
  }

  // Calculate starting value (work backwards from current)
  const volatility = 0.015; // Daily volatility
  const trend = 0.0003; // Slight upward trend

  // Generate data points
  const numPoints = Math.floor(days / interval);
  let value = currentValue;

  // First, generate values going backwards
  const values: number[] = [value];
  for (let i = 1; i <= numPoints; i++) {
    // Random walk with slight downward bias (going backwards means less value)
    const change = (Math.random() - 0.52) * volatility * value;
    value = value - change - (trend * value * interval);
    values.unshift(Math.max(value, currentValue * 0.7)); // Don't go below 70% of current
  }

  // Now create data points with dates
  for (let i = 0; i <= numPoints; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (numPoints - i) * interval);

    const dateStr = date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short'
    });

    data.push({
      date: dateStr,
      value: Math.round(values[i] * 100) / 100,
    });
  }

  return data;
}

export function DashboardPage() {
  const { user } = useAuth();
  const { portfolio, cashBalance, transactions, isDemoMode, enableDemoMode, disableDemoMode } = usePortfolio();
  const isFreeTier = user?.accountType === 'free';
  const needsOnboarding = !user?.onboardingCompleted;
  const awaitingApproval = user?.onboardingCompleted && !user?.onboardingApproved;

  // Check if user is a new user with empty portfolio
  const isNewUser = portfolio.holdings.length === 0 && cashBalance === 0 && !isDemoMode;

  const [selectedETF, setSelectedETF] = useState<ETF | null>(null);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositType, setDepositType] = useState<'deposit' | 'withdraw'>('deposit');
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('6M');

  // Generate chart data based on selected period
  const portfolioHistory = useMemo(() => {
    return generatePortfolioData(chartPeriod, portfolio.totalValue);
  }, [chartPeriod, portfolio.totalValue]);

  // Calculate allocation for pie chart
  const allocation = portfolio.holdings.map(holding => ({
    name: holding.etf.category,
    value: holding.weight,
    color: getColorForCategory(holding.etf.category),
  }));

  // Add cash to allocation
  const cashPercentage = (cashBalance / portfolio.totalValue) * 100;
  if (cashPercentage > 0) {
    allocation.push({
      name: 'Cash',
      value: cashPercentage,
      color: '#6B7280',
    });
  }

  function getColorForCategory(category: string): string {
    const colors: Record<string, string> = {
      'Aandelen': '#28EBCF',
      'Obligaties': '#20D4BA',
      'Grondstoffen': '#F59E0B',
      'Sectoren': '#8B5CF6',
    };
    return colors[category] || '#1A9E8B';
  }

  const handleOpenOrder = (etf: ETF, type: 'buy' | 'sell') => {
    setSelectedETF(etf);
    setOrderType(type);
  };

  const handleOpenDeposit = (type: 'deposit' | 'withdraw') => {
    setDepositType(type);
    setShowDepositModal(true);
  };

  // Recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welkom{user?.firstName ? `, ${user.firstName}` : ''}!
            </h1>
            <p className="text-gray-400 mt-1">
              {isFreeTier ? 'Gratis Account' : 'Premium Account'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleOpenDeposit('deposit')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              <ArrowDownToLine className="w-4 h-4" />
              Storten
            </button>
            <button
              onClick={() => handleOpenDeposit('withdraw')}
              className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border text-gray-300 rounded-lg hover:text-white hover:border-gray-500 transition-colors font-medium"
            >
              <ArrowUpFromLine className="w-4 h-4" />
              Opnemen
            </button>
          </div>
        </div>

        {/* Onboarding Alert */}
        {needsOnboarding && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-white">Rond je verificatie af</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Voltooi de KYC verificatie om volledig te kunnen beleggen.
                </p>
              </div>
              <Link
                to="/onboarding"
                className="px-4 py-2 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold text-sm"
              >
                Start Verificatie
              </Link>
            </div>
          </div>
        )}

        {/* Awaiting Approval Alert */}
        {awaitingApproval && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Verificatie in behandeling</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Je account wordt momenteel geverifieerd. Dit duurt meestal 1-2 werkdagen.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Beaker className="w-6 h-6 text-purple-400 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white">Demo Modus Actief</h3>
                  <p className="text-gray-400 text-sm">
                    Je bekijkt demo data. Dit is geen echt geld.
                  </p>
                </div>
              </div>
              <button
                onClick={disableDemoMode}
                className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm font-medium"
              >
                Stop Demo
              </button>
            </div>
          </div>
        )}

        {/* Getting Started for New Users */}
        {isNewUser && !needsOnboarding && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-primary/20 to-primary-dark/10 border border-primary/30 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Begin met Beleggen</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Je account is klaar! Volg deze stappen om te beginnen met beleggen.
                </p>
              </div>

              {/* Steps */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">
                  <div className="w-10 h-10 bg-primary text-dark-bg rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-white font-semibold mb-2">Stort Geld</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Maak een storting vanaf je bankrekening naar je PIGG account.
                  </p>
                  <button
                    onClick={() => handleOpenDeposit('deposit')}
                    className="w-full py-2 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold text-sm"
                  >
                    Geld Storten
                  </button>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center opacity-60">
                  <div className="w-10 h-10 bg-dark-surface text-gray-400 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 border border-dark-border">
                    2
                  </div>
                  <h3 className="text-white font-semibold mb-2">Kies ETFs</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Bekijk onze ETF database en kies waarin je wilt beleggen.
                  </p>
                  <Link
                    to="/etfs"
                    className="block w-full py-2 border border-dark-border text-gray-400 rounded-lg hover:border-gray-500 transition-colors font-medium text-sm"
                  >
                    Bekijk ETFs
                  </Link>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center opacity-60">
                  <div className="w-10 h-10 bg-dark-surface text-gray-400 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 border border-dark-border">
                    3
                  </div>
                  <h3 className="text-white font-semibold mb-2">Start met Beleggen</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Koop je eerste ETF en bouw aan je portfolio.
                  </p>
                  <span className="block w-full py-2 border border-dark-border text-gray-500 rounded-lg text-sm">
                    Eerst geld storten
                  </span>
                </div>
              </div>

              {/* Demo Mode Option */}
              <div className="text-center pt-6 border-t border-dark-border">
                <p className="text-gray-500 text-sm mb-3">
                  Wil je eerst rondkijken zonder echt geld?
                </p>
                <button
                  onClick={enableDemoMode}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-dark-surface border border-dark-border text-gray-300 rounded-lg hover:text-white hover:border-gray-500 transition-colors text-sm"
                >
                  <Beaker className="w-4 h-4" />
                  Probeer Demo Modus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Totale Waarde</span>
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-white">€{portfolio.totalValue.toLocaleString()}</p>
            <div className={`flex items-center mt-1 ${portfolio.totalReturnPercentage >= 0 ? 'text-green-500' : 'text-red-500'} text-sm`}>
              {portfolio.totalReturnPercentage >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {portfolio.totalReturnPercentage >= 0 ? '+' : ''}{portfolio.totalReturnPercentage.toFixed(1)}%
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Beschikbaar</span>
              <PiggyBank className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-white">€{cashBalance.toLocaleString()}</p>
            <p className="text-gray-500 text-sm mt-1">Cash saldo</p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Rendement</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className={`text-2xl font-bold ${portfolio.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolio.totalReturn >= 0 ? '+' : ''}€{portfolio.totalReturn.toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {portfolio.totalReturnPercentage >= 0 ? '+' : ''}{portfolio.totalReturnPercentage.toFixed(1)}% totaal
            </p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">ETFs</span>
              <span className="text-primary font-bold">{portfolio.holdings.length}</span>
            </div>
            <p className="text-2xl font-bold text-white">{portfolio.holdings.length}</p>
            <p className="text-gray-500 text-sm mt-1">
              {isFreeTier ? `van 5 gratis` : 'Onbeperkt'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Portfolio Chart */}
          <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Portfolio Waarde</h2>
              <div className="flex gap-2">
                {(['1M', '3M', '6M', '1J', 'Max'] as ChartPeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => setChartPeriod(period)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      chartPeriod === period
                        ? 'bg-primary text-dark-bg'
                        : 'text-gray-400 hover:text-white hover:bg-dark-surface'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioHistory}>
                  <defs>
                    <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#28EBCF" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#28EBCF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#9CA3AF' }}
                    formatter={(value: number) => [`€${value.toLocaleString()}`, 'Waarde']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#28EBCF"
                    strokeWidth={2}
                    fill="url(#colorPortfolio)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Asset Allocatie</h2>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {allocation.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {allocation.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Holdings */}
        <div className="mt-6 bg-dark-card border border-dark-border rounded-xl">
          <div className="p-6 border-b border-dark-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Je Holdings</h2>
            <Link to="/etfs" className="text-primary hover:text-primary-dark text-sm flex items-center">
              <Plus className="w-4 h-4 mr-1" />
              ETF Toevoegen
            </Link>
          </div>
          <div className="divide-y divide-dark-border">
            {portfolio.holdings.length > 0 ? (
              portfolio.holdings.map((holding) => (
                <div
                  key={holding.etf.isin}
                  className="p-4 flex items-center justify-between hover:bg-dark-surface transition-colors group"
                >
                  <Link to={`/etfs/${holding.etf.isin}`} className="flex-1">
                    <p className="text-white font-medium group-hover:text-primary transition-colors">
                      {holding.etf.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {holding.etf.isin} • {holding.shares.toFixed(4)} aandelen
                    </p>
                  </Link>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white font-medium">€{holding.value.toLocaleString()}</p>
                      <p className={`text-sm ${holding.returnPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {holding.returnPercentage >= 0 ? '+' : ''}{holding.returnPercentage.toFixed(1)}%
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenOrder(holding.etf, 'buy')}
                        className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors"
                        title="Bijkopen"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenOrder(holding.etf, 'sell')}
                        className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                        title="Verkopen"
                      >
                        <TrendingDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <PiggyBank className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Je hebt nog geen beleggingen</p>
                <Link
                  to="/etfs"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Begin met beleggen
                </Link>
              </div>
            )}
          </div>
          {portfolio.holdings.length > 0 && (
            <div className="p-4 border-t border-dark-border">
              <Link
                to="/etfs"
                className="w-full flex items-center justify-center gap-2 py-3 bg-dark-surface rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                Bekijk ETF Database
              </Link>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="mt-6 bg-dark-card border border-dark-border rounded-xl">
          <div className="p-6 border-b border-dark-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Recente Transacties
            </h2>
            <Link to="/transactions" className="text-primary hover:text-primary-dark text-sm flex items-center">
              Bekijk alles
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-dark-border">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'deposit' ? 'bg-green-500/20 text-green-500' :
                      tx.type === 'withdrawal' ? 'bg-orange-500/20 text-orange-500' :
                      tx.type === 'buy' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {tx.type === 'deposit' && <ArrowDownToLine className="w-4 h-4" />}
                      {tx.type === 'withdrawal' && <ArrowUpFromLine className="w-4 h-4" />}
                      {tx.type === 'buy' && <ShoppingCart className="w-4 h-4" />}
                      {tx.type === 'sell' && <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {tx.type === 'deposit' ? 'Storting' :
                         tx.type === 'withdrawal' ? 'Opname' :
                         tx.type === 'buy' ? 'Aankoop' : 'Verkoop'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {tx.etf?.name || new Date(tx.date).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                  </div>
                  <span className={`font-medium ${
                    ['deposit', 'sell'].includes(tx.type) ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {['deposit', 'sell'].includes(tx.type) ? '+' : '-'}€{tx.amount.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                Nog geen transacties
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Banner (for free users) */}
        {isFreeTier && (
          <div className="mt-6 bg-gradient-to-r from-primary/20 to-primary-dark/10 border border-primary/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Sparkles className="w-8 h-8 text-primary mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Upgrade naar Premium</h3>
                  <p className="text-gray-400 text-sm">
                    Onbeperkt ETFs, geavanceerde analyses en meer
                  </p>
                </div>
              </div>
              <Link
                to="/upgrade"
                className="px-6 py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold"
              >
                Upgrade Nu
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Order Modal */}
      {selectedETF && (
        <OrderModal
          etf={selectedETF}
          onClose={() => setSelectedETF(null)}
          initialType={orderType}
        />
      )}

      {/* Deposit/Withdraw Modal */}
      {showDepositModal && (
        <DepositWithdrawModal
          onClose={() => setShowDepositModal(false)}
          initialType={depositType}
        />
      )}
    </div>
  );
}
