import React, { useState, useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Leaf,
  Zap,
  PiggyBank,
  BarChart3,
  Check,
  Info,
  Calendar,
  RefreshCw,
  Users,
  PieChart,
  LineChart,
  Download,
  Share2,
  Bell,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { MODEL_PORTFOLIOS, getPortfolioETFs, calculatePortfolioMetrics } from '../../data/modelPortfolios';

const getPortfolioIcon = (id: string) => {
  switch (id) {
    case 'conservative':
      return Shield;
    case 'balanced':
      return Target;
    case 'growth':
      return TrendingUp;
    case 'dividend':
      return PiggyBank;
    case 'sustainable':
      return Leaf;
    case 'tech-focus':
      return Zap;
    default:
      return BarChart3;
  }
};

export function ModelPortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const portfolio = MODEL_PORTFOLIOS.find(p => p.id === id);

  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [investmentYears, setInvestmentYears] = useState(10);
  const [showProjection, setShowProjection] = useState(false);

  if (!portfolio) {
    return <Navigate to="/dashboard/model-portfolios" replace />;
  }

  const Icon = getPortfolioIcon(portfolio.id);
  const metrics = calculatePortfolioMetrics(portfolio);
  const holdingsWithETF = getPortfolioETFs(portfolio);

  // Calculate average return from historical data
  const avgReturn = portfolio.historicalReturns.reduce((sum, r) => sum + r.value, 0) / portfolio.historicalReturns.length;

  // Projection calculation
  const projectedValue = useMemo(() => {
    const monthlyRate = avgReturn / 100 / 12;
    const months = investmentYears * 12;

    const fvInitial = investmentAmount * Math.pow(1 + monthlyRate, months);
    const fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    const totalContributed = investmentAmount + (monthlyContribution * months);
    const totalValue = fvInitial + fvContributions;
    const totalProfit = totalValue - totalContributed;

    return {
      totalValue,
      totalContributed,
      totalProfit,
    };
  }, [investmentAmount, monthlyContribution, investmentYears, avgReturn]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const categories: Record<string, number> = {};
    holdingsWithETF.forEach(h => {
      if (h.etf) {
        const cat = h.etf.category;
        categories[cat] = (categories[cat] || 0) + h.allocation;
      }
    });
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [holdingsWithETF]);

  const latestReturn = portfolio.historicalReturns[0];
  const isPositive = latestReturn.value >= 0;

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <Link
          to="/dashboard/model-portfolios"
          className="inline-flex items-center text-gray-400 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug naar Model Portfolios
        </Link>

        {/* Header section */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                portfolio.risk === 'Laag' ? 'bg-green-500/20' :
                portfolio.risk === 'Medium' ? 'bg-amber-500/20' :
                'bg-red-500/20'
              }`}>
                <Icon className={`w-8 h-8 ${
                  portfolio.risk === 'Laag' ? 'text-green-400' :
                  portfolio.risk === 'Medium' ? 'text-amber-400' :
                  'text-red-400'
                }`} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{portfolio.name}</h1>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    portfolio.risk === 'Laag' ? 'bg-green-500/20 text-green-400' :
                    portfolio.risk === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {portfolio.risk} risico
                  </span>
                </div>
                <p className="text-gray-400 max-w-2xl">{portfolio.longDescription}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="p-3 bg-dark-surface border border-dark-border rounded-lg text-gray-400 hover:text-white hover:border-primary transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-3 bg-dark-surface border border-dark-border rounded-lg text-gray-400 hover:text-white hover:border-primary transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-3 bg-dark-surface border border-dark-border rounded-lg text-gray-400 hover:text-white hover:border-primary transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-dark-border">
            <div>
              <p className="text-xs text-gray-500 mb-1">Rendement {latestReturn.year}</p>
              <p className={`text-2xl font-bold flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{latestReturn.value.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Verwacht rendement</p>
              <p className="text-2xl font-bold text-primary">{portfolio.expectedReturn}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Gewogen TER</p>
              <p className="text-2xl font-bold text-white">{metrics.weightedTER.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Min. investering</p>
              <p className="text-2xl font-bold text-white">€{portfolio.minInvestment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Beheerkosten</p>
              <p className="text-2xl font-bold text-white">{portfolio.managementFee}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Historical returns */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-primary" />
                Historisch Rendement
              </h2>

              <div className="grid grid-cols-5 gap-3 mb-6">
                {portfolio.historicalReturns.map((item) => {
                  const positive = item.value >= 0;
                  return (
                    <div key={item.year} className="bg-dark-surface rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">{item.year}</p>
                      <p className={`text-lg font-bold ${positive ? 'text-green-500' : 'text-red-500'}`}>
                        {positive ? '+' : ''}{item.value.toFixed(1)}%
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Simple bar chart visualization */}
              <div className="flex items-end justify-between h-32 gap-2 px-4">
                {portfolio.historicalReturns.slice().reverse().map((item) => {
                  const positive = item.value >= 0;
                  const maxAbs = Math.max(...portfolio.historicalReturns.map(r => Math.abs(r.value)));
                  const height = (Math.abs(item.value) / maxAbs) * 100;

                  return (
                    <div key={item.year} className="flex-1 flex flex-col items-center">
                      {positive ? (
                        <>
                          <div
                            className="w-full bg-green-500/50 rounded-t"
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-xs text-gray-500 mt-2">{item.year}</span>
                        </>
                      ) : (
                        <>
                          <div
                            className="w-full bg-red-500/50 rounded-b mt-auto"
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-xs text-gray-500 mt-2">{item.year}</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500 mt-4 flex items-start gap-1">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                Historische rendementen zijn geen garantie voor toekomstige resultaten.
              </p>
            </div>

            {/* Portfolio holdings */}
            <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-dark-border">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Portfolio Samenstelling ({holdingsWithETF.length} ETF's)
                </h2>
              </div>

              <div className="divide-y divide-dark-border">
                {holdingsWithETF.map((holding) => {
                  if (!holding.etf) return null;
                  const ytdValue = parseFloat(holding.etf.ytd);
                  const ytdPositive = ytdValue >= 0;

                  return (
                    <div key={holding.isin} className="p-4 hover:bg-dark-surface/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white truncate">{holding.etf.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                              holding.etf.distribution === 'Accumulating'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {holding.etf.distribution === 'Accumulating' ? 'Acc' : 'Dist'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span>{holding.isin}</span>
                            <span>{holding.etf.category}</span>
                            <span>TER: {holding.etf.ter}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">YTD</p>
                            <p className={`font-medium flex items-center justify-end ${ytdPositive ? 'text-green-500' : 'text-red-500'}`}>
                              {ytdPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                              {holding.etf.ytd}
                            </p>
                          </div>
                          <div className="w-20 text-right">
                            <p className="text-xs text-gray-500">Allocatie</p>
                            <p className="text-lg font-bold text-primary">{holding.allocation}%</p>
                          </div>
                        </div>
                      </div>

                      {/* Allocation bar */}
                      <div className="mt-3 h-1.5 bg-dark-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${holding.allocation}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Category breakdown */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Verdeling per categorie
              </h2>
              <div className="space-y-3">
                {categoryBreakdown.map((cat, idx) => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{cat.name}</span>
                      <span className="text-white font-medium">{cat.value}%</span>
                    </div>
                    <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${cat.value}%`,
                          opacity: 1 - (idx * 0.15)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Portfolio Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Herbalancering</span>
                  <span className="text-white flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    {portfolio.rebalancingFrequency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Doelgroep</span>
                  <span className="text-white flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {portfolio.targetInvestor.split(',')[0]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Laatst bijgewerkt</span>
                  <span className="text-white flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(portfolio.lastUpdated).toLocaleDateString('nl-NL')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Totaal holdings</span>
                  <span className="text-white">{metrics.totalHoldings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4">Kenmerken</h2>
              <ul className="space-y-2">
                {portfolio.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Projection calculator */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Rendement Calculator
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Startbedrag</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(parseInt(e.target.value) || 0)}
                      className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 pl-8 text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Maandelijkse inleg</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <input
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(parseInt(e.target.value) || 0)}
                      className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 pl-8 text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Looptijd: {investmentYears} jaar</label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={investmentYears}
                    onChange={(e) => setInvestmentYears(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 jaar</span>
                    <span>30 jaar</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-surface rounded-lg p-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Totaal ingelegd</span>
                  <span className="text-white">
                    €{projectedValue.totalContributed.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Verwacht rendement</span>
                  <span className="text-green-500">
                    +€{projectedValue.totalProfit.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="border-t border-dark-border pt-2 flex justify-between">
                  <span className="text-white font-medium">Geschatte waarde</span>
                  <span className="text-primary font-bold text-lg">
                    €{projectedValue.totalValue.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3 flex items-start gap-1">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                Gebaseerd op gemiddeld historisch rendement van {avgReturn.toFixed(1)}%.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-5 text-center">
              <h3 className="font-bold text-white mb-2">Klaar om te starten?</h3>
              <p className="text-sm text-gray-400 mb-4">
                Begin vandaag nog met beleggen in dit portfolio
              </p>
              <button className="w-full py-3 bg-primary text-dark-bg rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                Investeer in dit portfolio
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
