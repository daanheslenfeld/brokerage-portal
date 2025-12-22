import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Leaf,
  Zap,
  PiggyBank,
  BarChart3,
  Filter,
  Check,
  Info
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { MODEL_PORTFOLIOS, calculatePortfolioMetrics } from '../../data/modelPortfolios';

const RISK_FILTERS = ['Alle', 'Laag', 'Medium', 'Hoog'] as const;

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

export function ModelPortfoliosPage() {
  const [riskFilter, setRiskFilter] = useState<typeof RISK_FILTERS[number]>('Alle');
  const [sortBy, setSortBy] = useState<'return' | 'risk' | 'fee'>('return');

  const filteredPortfolios = MODEL_PORTFOLIOS
    .filter(p => riskFilter === 'Alle' || p.risk === riskFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'return':
          return b.historicalReturns[0].value - a.historicalReturns[0].value;
        case 'risk':
          const riskOrder = { 'Laag': 1, 'Medium': 2, 'Hoog': 3 };
          return riskOrder[a.risk] - riskOrder[b.risk];
        case 'fee':
          return parseFloat(a.managementFee) - parseFloat(b.managementFee);
        default:
          return 0;
      }
    });

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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Model Portfolios</h1>
          <p className="text-gray-400 mt-1">
            Professioneel samengestelde portfolios voor elk beleggersprofiel
          </p>
        </div>

        {/* Info banner */}
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-white mb-1">Waarom Model Portfolios?</h3>
            <p className="text-sm text-gray-400">
              Onze model portfolios zijn samengesteld door experts en bieden een gediversifieerde mix van ETF's
              afgestemd op verschillende risicoprofielen. Ze worden regelmatig geherbalanceerd en geoptimaliseerd.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Risk filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Risico:</span>
              <div className="flex gap-2">
                {RISK_FILTERS.map((risk) => (
                  <button
                    key={risk}
                    onClick={() => setRiskFilter(risk)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      riskFilter === risk
                        ? 'bg-primary text-dark-bg'
                        : 'bg-dark-surface text-gray-400 hover:text-white'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sorteer:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-dark-surface border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:border-primary focus:outline-none"
              >
                <option value="return">Hoogste rendement</option>
                <option value="risk">Laagste risico</option>
                <option value="fee">Laagste kosten</option>
              </select>
            </div>
          </div>
        </div>

        {/* Portfolio grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((portfolio) => {
            const Icon = getPortfolioIcon(portfolio.id);
            const metrics = calculatePortfolioMetrics(portfolio);
            const latestReturn = portfolio.historicalReturns[0];
            const isPositive = latestReturn.value >= 0;

            return (
              <div
                key={portfolio.id}
                className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group"
              >
                {/* Header */}
                <div className="p-5 border-b border-dark-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      portfolio.risk === 'Laag' ? 'bg-green-500/20' :
                      portfolio.risk === 'Medium' ? 'bg-amber-500/20' :
                      'bg-red-500/20'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        portfolio.risk === 'Laag' ? 'text-green-400' :
                        portfolio.risk === 'Medium' ? 'text-amber-400' :
                        'text-red-400'
                      }`} />
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      portfolio.risk === 'Laag' ? 'bg-green-500/20 text-green-400' :
                      portfolio.risk === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {portfolio.risk} risico
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{portfolio.name}</h3>
                  <p className="text-sm text-gray-400">{portfolio.description}</p>
                </div>

                {/* Metrics */}
                <div className="p-5 space-y-4">
                  {/* Returns */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Rendement {latestReturn.year}</p>
                      <p className={`text-xl font-bold flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {isPositive ? '+' : ''}{latestReturn.value.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Verwacht rendement</p>
                      <p className="text-xl font-bold text-primary">{portfolio.expectedReturn}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">TER (gewogen)</span>
                      <span className="text-white">{metrics.weightedTER.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Beheerkosten</span>
                      <span className="text-white">{portfolio.managementFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min. inleg</span>
                      <span className="text-white">€{portfolio.minInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Herbalancering</span>
                      <span className="text-white">{portfolio.rebalancingFrequency}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="pt-3 border-t border-dark-border">
                    <div className="flex flex-wrap gap-2">
                      {portfolio.features.slice(0, 2).map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-dark-surface text-gray-400 px-2 py-1 rounded-full flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-primary" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="p-5 pt-0">
                  <Link
                    to={`/dashboard/model-portfolios/${portfolio.id}`}
                    className="w-full py-3 bg-dark-surface border border-dark-border rounded-lg text-gray-300 hover:border-primary hover:text-primary transition-colors font-medium flex items-center justify-center gap-2 group-hover:bg-primary/10"
                  >
                    Bekijk details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPortfolios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Geen portfolios gevonden met deze filters</p>
            <button
              onClick={() => setRiskFilter('Alle')}
              className="mt-4 text-primary hover:text-primary-dark"
            >
              Toon alle portfolios
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Liever je eigen portfolio samenstellen?
          </h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Gebruik onze Portfolio Builder om een volledig gepersonaliseerd portfolio samen te stellen
            uit onze database van 500+ ETF's.
          </p>
          <Link
            to="/dashboard/portfolio-builder"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-dark-bg rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Open Portfolio Builder
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
