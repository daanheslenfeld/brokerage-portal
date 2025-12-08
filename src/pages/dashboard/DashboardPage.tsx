import React from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Wallet,
  ArrowUpRight,
  Lock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

// Sample data
const portfolioHistory = [
  { date: 'Jan', value: 10000 },
  { date: 'Feb', value: 10300 },
  { date: 'Mar', value: 10150 },
  { date: 'Apr', value: 10800 },
  { date: 'May', value: 11200 },
  { date: 'Jun', value: 11500 },
];

const allocation = [
  { name: 'Aandelen', value: 60, color: '#28EBCF' },
  { name: 'Obligaties', value: 25, color: '#20D4BA' },
  { name: 'Grondstoffen', value: 10, color: '#1A9E8B' },
  { name: 'Cash', value: 5, color: '#6B7280' },
];

const holdings = [
  { name: 'iShares Core S&P 500 UCITS ETF', isin: 'IE00B5BMR087', value: 4500, return: 12.5 },
  { name: 'iShares Core MSCI World UCITS ETF', isin: 'IE00B4L5Y983', value: 3200, return: 8.3 },
  { name: 'iShares Core Euro Government Bond', isin: 'IE00B4WXJJ64', value: 2000, return: 2.1 },
];

export function DashboardPage() {
  const { user } = useAuth();
  const isFreeTier = user?.accountType === 'free';
  const needsOnboarding = !user?.onboardingCompleted;
  const awaitingApproval = user?.onboardingCompleted && !user?.onboardingApproved;

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welkom{user?.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="text-gray-400 mt-1">
            {isFreeTier ? 'Gratis Account' : 'Premium Account'}
          </p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Totale Waarde</span>
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-white">€11.500</p>
            <div className="flex items-center mt-1 text-green-500 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15.0%
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Ingelegd</span>
              <PiggyBank className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-white">€10.000</p>
            <p className="text-gray-500 text-sm mt-1">Totaal gestort</p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Rendement</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500">€1.500</p>
            <p className="text-gray-500 text-sm mt-1">+15.0% totaal</p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">ETFs</span>
              <span className="text-primary font-bold">5</span>
            </div>
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-gray-500 text-sm mt-1">
              {isFreeTier ? 'van 5 gratis' : 'Onbeperkt'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Portfolio Chart */}
          <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Portfolio Waarde</h2>
              <div className="flex gap-2">
                {['1M', '3M', '6M', '1J', 'Max'].map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-1 text-sm rounded ${
                      period === '6M'
                        ? 'bg-primary text-dark-bg'
                        : 'text-gray-400 hover:text-white'
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
                  />
                  <YAxis hide />
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
                  <span className="text-white font-medium">{item.value}%</span>
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
              Bekijk ETF Database
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-dark-border">
            {holdings.map((holding, index) => (
              <div key={index} className="p-4 flex items-center justify-between hover:bg-dark-surface transition-colors">
                <div>
                  <p className="text-white font-medium">{holding.name}</p>
                  <p className="text-gray-500 text-sm">{holding.isin}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">€{holding.value.toLocaleString()}</p>
                  <p className={`text-sm ${holding.return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {holding.return >= 0 ? '+' : ''}{holding.return}%
                  </p>
                </div>
              </div>
            ))}
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
    </div>
  );
}
