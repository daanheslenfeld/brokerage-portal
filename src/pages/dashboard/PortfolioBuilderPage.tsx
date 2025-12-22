import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Trash2,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Info,
  AlertTriangle,
  Check,
  Save,
  Download,
  RefreshCw,
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { ETF_DATABASE, CATEGORIES, type ETFData } from '../../data/etfDatabase';

interface PortfolioItem {
  etf: ETFData;
  allocation: number;
}

export function PortfolioBuilderPage() {
  const [searchParams] = useSearchParams();
  const addIsin = searchParams.get('add');

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    // Check if there's an ETF to add from URL
    if (addIsin) {
      const etf = ETF_DATABASE.find(e => e.isin === addIsin);
      if (etf) {
        return [{ etf, allocation: 100 }];
      }
    }
    return [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showETFSelector, setShowETFSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [investmentAmount, setInvestmentAmount] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [investmentYears, setInvestmentYears] = useState<number>(10);
  const [showProjection, setShowProjection] = useState(false);
  const [portfolioName, setPortfolioName] = useState('Mijn Portfolio');

  // Filter ETFs for selector
  const filteredETFs = useMemo(() => {
    let filtered = ETF_DATABASE.filter(
      etf => !portfolio.some(p => p.etf.isin === etf.isin)
    );

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        etf =>
          etf.name.toLowerCase().includes(term) ||
          etf.isin.toLowerCase().includes(term)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(etf => etf.category === selectedCategory);
    }

    return filtered.slice(0, 10);
  }, [searchTerm, selectedCategory, portfolio]);

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    if (portfolio.length === 0) {
      return {
        totalAllocation: 0,
        weightedTER: 0,
        weightedYTD: 0,
        expectedReturn: 0,
        volatility: 0,
        riskLevel: 'N/A' as const,
      };
    }

    const totalAllocation = portfolio.reduce((sum, p) => sum + p.allocation, 0);

    const weightedTER = portfolio.reduce((sum, p) => {
      const ter = parseFloat(p.etf.ter.replace('%', ''));
      return sum + (ter * p.allocation / 100);
    }, 0);

    const weightedYTD = portfolio.reduce((sum, p) => {
      const ytd = parseFloat(p.etf.ytd.replace('%', ''));
      return sum + (ytd * p.allocation / 100);
    }, 0);

    // Simple expected return based on historical averages
    const expectedReturn = portfolio.reduce((sum, p) => {
      const returns = [
        parseFloat(p.etf.return2024),
        parseFloat(p.etf.return2023),
        parseFloat(p.etf.return2022),
        parseFloat(p.etf.return2021),
      ];
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      return sum + (avgReturn * p.allocation / 100);
    }, 0);

    const volatility = portfolio.reduce((sum, p) => {
      const vol = parseFloat(p.etf.volatility1y.replace('%', ''));
      return sum + (vol * p.allocation / 100);
    }, 0);

    let riskLevel: 'Laag' | 'Medium' | 'Hoog' = 'Laag';
    if (volatility > 18) riskLevel = 'Hoog';
    else if (volatility > 12) riskLevel = 'Medium';

    return {
      totalAllocation,
      weightedTER,
      weightedYTD,
      expectedReturn,
      volatility,
      riskLevel,
    };
  }, [portfolio]);

  // Calculate future value projection
  const projectedValue = useMemo(() => {
    const monthlyRate = portfolioMetrics.expectedReturn / 100 / 12;
    const months = investmentYears * 12;

    // Future value of initial investment
    const fvInitial = investmentAmount * Math.pow(1 + monthlyRate, months);

    // Future value of monthly contributions (annuity)
    const fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    const totalContributed = investmentAmount + (monthlyContribution * months);
    const totalValue = fvInitial + fvContributions;
    const totalProfit = totalValue - totalContributed;

    return {
      totalValue,
      totalContributed,
      totalProfit,
      profitPercentage: (totalProfit / totalContributed) * 100,
    };
  }, [investmentAmount, monthlyContribution, investmentYears, portfolioMetrics.expectedReturn]);

  const addETF = (etf: ETFData) => {
    setPortfolio(prev => [...prev, { etf, allocation: 0 }]);
    setShowETFSelector(false);
    setSearchTerm('');
  };

  const removeETF = (isin: string) => {
    setPortfolio(prev => prev.filter(p => p.etf.isin !== isin));
  };

  const updateAllocation = (isin: string, allocation: number) => {
    setPortfolio(prev =>
      prev.map(p =>
        p.etf.isin === isin ? { ...p, allocation: Math.max(0, Math.min(100, allocation)) } : p
      )
    );
  };

  const equalizeAllocations = () => {
    const equalAllocation = Math.floor(100 / portfolio.length);
    const remainder = 100 - (equalAllocation * portfolio.length);

    setPortfolio(prev =>
      prev.map((p, idx) => ({
        ...p,
        allocation: equalAllocation + (idx === 0 ? remainder : 0),
      }))
    );
  };

  const isValidPortfolio = portfolioMetrics.totalAllocation === 100 && portfolio.length > 0;

  // Category allocation for pie chart visualization
  const categoryAllocation = useMemo(() => {
    const categories: Record<string, number> = {};
    portfolio.forEach(p => {
      const cat = p.etf.category;
      categories[cat] = (categories[cat] || 0) + p.allocation;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [portfolio]);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button and title */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-400 hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Portfolio Builder</h1>
              <p className="text-gray-400 mt-1">
                Stel je eigen ETF portfolio samen
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowProjection(!showProjection)}
                className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-gray-300 hover:border-primary transition-colors flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Projectie
              </button>
              <button
                disabled={!isValidPortfolio}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  isValidPortfolio
                    ? 'bg-primary text-dark-bg hover:bg-primary-dark'
                    : 'bg-dark-border text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                Opslaan
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Portfolio composition */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio name */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-4">
              <label className="block text-sm text-gray-400 mb-2">Portfolio naam</label>
              <input
                type="text"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="Geef je portfolio een naam"
              />
            </div>

            {/* Allocation status */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Totale allocatie</span>
                <div className="flex items-center gap-2">
                  {portfolio.length > 1 && (
                    <button
                      onClick={equalizeAllocations}
                      className="text-xs text-primary hover:text-primary-dark flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Gelijk verdelen
                    </button>
                  )}
                  <span className={`font-bold ${
                    portfolioMetrics.totalAllocation === 100
                      ? 'text-green-500'
                      : portfolioMetrics.totalAllocation > 100
                        ? 'text-red-500'
                        : 'text-amber-500'
                  }`}>
                    {portfolioMetrics.totalAllocation}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    portfolioMetrics.totalAllocation === 100
                      ? 'bg-green-500'
                      : portfolioMetrics.totalAllocation > 100
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(portfolioMetrics.totalAllocation, 100)}%` }}
                />
              </div>
              {portfolioMetrics.totalAllocation !== 100 && portfolio.length > 0 && (
                <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {portfolioMetrics.totalAllocation < 100
                    ? `Nog ${100 - portfolioMetrics.totalAllocation}% toe te wijzen`
                    : `${portfolioMetrics.totalAllocation - 100}% te veel toegewezen`
                  }
                </p>
              )}
            </div>

            {/* ETF List */}
            <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-dark-border">
                <h2 className="font-semibold text-white">ETF's in portfolio ({portfolio.length})</h2>
              </div>

              {portfolio.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4">
                    <PieChart className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Nog geen ETF's toegevoegd</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Voeg ETF's toe om je portfolio samen te stellen
                  </p>
                  <button
                    onClick={() => setShowETFSelector(true)}
                    className="px-4 py-2 bg-primary text-dark-bg rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    ETF toevoegen
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-dark-border">
                  {portfolio.map((item) => {
                    const ytdValue = parseFloat(item.etf.ytd);
                    const isPositive = ytdValue >= 0;

                    return (
                      <div key={item.etf.isin} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-white truncate">{item.etf.name}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                                item.etf.distribution === 'Accumulating'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-green-500/20 text-green-400'
                              }`}>
                                {item.etf.distribution === 'Accumulating' ? 'Acc' : 'Dist'}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <span>{item.etf.isin}</span>
                              <span>TER: {item.etf.ter}</span>
                              <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                {item.etf.ytd}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Allocation input */}
                            <div className="flex items-center bg-dark-surface rounded-lg">
                              <button
                                onClick={() => updateAllocation(item.etf.isin, item.allocation - 5)}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <input
                                type="number"
                                value={item.allocation}
                                onChange={(e) => updateAllocation(item.etf.isin, parseInt(e.target.value) || 0)}
                                className="w-14 bg-transparent text-center text-white font-medium focus:outline-none"
                              />
                              <span className="text-gray-400 pr-2">%</span>
                              <button
                                onClick={() => updateAllocation(item.etf.isin, item.allocation + 5)}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              onClick={() => removeETF(item.etf.isin)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Allocation bar */}
                        <div className="mt-3">
                          <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${item.allocation}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add more button */}
                  <div className="p-4">
                    <button
                      onClick={() => setShowETFSelector(true)}
                      className="w-full py-3 border border-dashed border-dark-border rounded-lg text-gray-400 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      ETF toevoegen
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Metrics & Projection */}
          <div className="space-y-6">
            {/* Portfolio metrics */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-5">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Portfolio Statistieken
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Gewogen TER</span>
                  <span className="text-white font-medium">{portfolioMetrics.weightedTER.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">YTD Rendement</span>
                  <span className={`font-medium ${portfolioMetrics.weightedYTD >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {portfolioMetrics.weightedYTD >= 0 ? '+' : ''}{portfolioMetrics.weightedYTD.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Gem. historisch rendement</span>
                  <span className={`font-medium ${portfolioMetrics.expectedReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {portfolioMetrics.expectedReturn >= 0 ? '+' : ''}{portfolioMetrics.expectedReturn.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Volatiliteit (1Y)</span>
                  <span className="text-white font-medium">{portfolioMetrics.volatility.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Risico niveau</span>
                  <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                    portfolioMetrics.riskLevel === 'Laag' ? 'bg-green-500/20 text-green-400' :
                    portfolioMetrics.riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                    portfolioMetrics.riskLevel === 'Hoog' ? 'bg-red-500/20 text-red-400' :
                    'bg-dark-border text-gray-500'
                  }`}>
                    {portfolioMetrics.riskLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Category allocation */}
            {categoryAllocation.length > 0 && (
              <div className="bg-dark-card border border-dark-border rounded-xl p-5">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Verdeling per categorie
                </h2>
                <div className="space-y-3">
                  {categoryAllocation.map((cat, idx) => (
                    <div key={cat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{cat.name}</span>
                        <span className="text-white">{cat.value}%</span>
                      </div>
                      <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${cat.value}%`,
                            opacity: 1 - (idx * 0.2)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Investment projection */}
            {showProjection && (
              <div className="bg-dark-card border border-dark-border rounded-xl p-5">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Rendement Projectie
                </h2>

                <div className="space-y-4 mb-6">
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

                <div className="bg-dark-surface rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Totaal ingelegd</span>
                    <span className="text-white font-medium">
                      €{projectedValue.totalContributed.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Verwacht rendement</span>
                    <span className="text-green-500 font-medium">
                      +€{projectedValue.totalProfit.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="border-t border-dark-border pt-3 flex justify-between">
                    <span className="text-white font-medium">Geschatte waarde</span>
                    <span className="text-primary font-bold text-lg">
                      €{projectedValue.totalValue.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-3 flex items-start gap-1">
                  <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Gebaseerd op historisch gemiddeld rendement van {portfolioMetrics.expectedReturn.toFixed(1)}%.
                  Dit is geen garantie voor toekomstig rendement.
                </p>
              </div>
            )}

            {/* Validation messages */}
            {portfolio.length > 0 && (
              <div className={`rounded-xl p-4 ${
                isValidPortfolio ? 'bg-green-500/10 border border-green-500/30' : 'bg-amber-500/10 border border-amber-500/30'
              }`}>
                {isValidPortfolio ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Portfolio is geldig en klaar om op te slaan</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-amber-400">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Portfolio nog niet compleet</span>
                      <p className="text-sm text-amber-400/80 mt-1">
                        Zorg dat de totale allocatie exact 100% is
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ETF Selector Modal */}
      {showETFSelector && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">ETF Toevoegen</h2>
                <button
                  onClick={() => {
                    setShowETFSelector(false);
                    setSearchTerm('');
                  }}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Zoek op naam of ISIN..."
                    className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                    autoFocus
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                >
                  <option value="">Alle categorieën</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredETFs.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  Geen ETF's gevonden
                </div>
              ) : (
                <div className="divide-y divide-dark-border">
                  {filteredETFs.map((etf) => {
                    const ytdValue = parseFloat(etf.ytd);
                    const isPositive = ytdValue >= 0;

                    return (
                      <div
                        key={etf.isin}
                        className="p-4 hover:bg-dark-surface cursor-pointer transition-colors"
                        onClick={() => addETF(etf)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-white truncate">{etf.name}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                etf.distribution === 'Accumulating'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-green-500/20 text-green-400'
                              }`}>
                                {etf.distribution === 'Accumulating' ? 'Acc' : 'Dist'}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <span>{etf.isin}</span>
                              <span>{etf.category}</span>
                              <span>TER: {etf.ter}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`font-medium flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                              {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                              {etf.ytd}
                            </span>
                            <Plus className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-dark-border">
              <Link
                to="/dashboard/etf-database"
                className="text-primary hover:text-primary-dark text-sm flex items-center justify-center gap-1"
              >
                Bekijk alle ETF's in de database
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
