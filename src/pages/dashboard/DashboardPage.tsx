import React from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  Layers,
  Package,
  TrendingUp,
  ArrowRight,
  Search,
  Sparkles,
  Shield,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

const FEATURED_PORTFOLIOS = [
  {
    id: 'conservative',
    name: 'Defensief Portfolio',
    description: 'Laag risico, stabiel rendement',
    expectedReturn: '4-6%',
    risk: 'Laag',
    riskColor: 'text-green-400',
    allocation: [
      { name: 'Obligaties', percentage: 60 },
      { name: 'Aandelen', percentage: 30 },
      { name: 'Cash', percentage: 10 },
    ],
  },
  {
    id: 'balanced',
    name: 'Gebalanceerd Portfolio',
    description: 'Balans tussen groei en stabiliteit',
    expectedReturn: '6-8%',
    risk: 'Medium',
    riskColor: 'text-amber-400',
    allocation: [
      { name: 'Aandelen', percentage: 50 },
      { name: 'Obligaties', percentage: 40 },
      { name: 'Alternatieven', percentage: 10 },
    ],
  },
  {
    id: 'growth',
    name: 'Groei Portfolio',
    description: 'Focus op kapitaalgroei',
    expectedReturn: '8-12%',
    risk: 'Hoog',
    riskColor: 'text-red-400',
    allocation: [
      { name: 'Aandelen', percentage: 80 },
      { name: 'Obligaties', percentage: 15 },
      { name: 'Crypto', percentage: 5 },
    ],
  },
];

export function DashboardPage() {
  const { user } = useAuth();

  // Get user details from localStorage
  const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
  const firstName = userDetails.firstName || user?.firstName || 'Belegger';

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welkom, {firstName}!
          </h1>
          <p className="text-gray-400 mt-1">
            Wat wil je vandaag doen?
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* ETF Database */}
          <Link
            to="/dashboard/etf-database"
            className="group bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <Database className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">ETF Database</h2>
            <p className="text-gray-400 text-sm mb-4">
              Bekijk onze volledige database met ETF's. Filter op categorie, rendement, kosten en meer.
            </p>
            <div className="flex items-center text-primary font-medium">
              <Search className="w-4 h-4 mr-2" />
              Database verkennen
              <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Portfolio Builder */}
          <Link
            to="/dashboard/portfolio-builder"
            className="group bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <Layers className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Portfolio Samenstellen</h2>
            <p className="text-gray-400 text-sm mb-4">
              Stel je eigen portfolio samen uit onze ETF selectie. Simuleer rendement en risico.
            </p>
            <div className="flex items-center text-primary font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Start builder
              <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pre-made Portfolios */}
          <Link
            to="/dashboard/model-portfolios"
            className="group bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <Package className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Model Portfolios</h2>
            <p className="text-gray-400 text-sm mb-4">
              Bekijk vooraf samengestelde portfolios door experts. Direct klaar om te beleggen.
            </p>
            <div className="flex items-center text-primary font-medium">
              <BarChart3 className="w-4 h-4 mr-2" />
              Portfolios bekijken
              <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Featured Model Portfolios Preview */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Populaire Model Portfolios</h2>
              <p className="text-gray-400 text-sm">Samengesteld door onze experts</p>
            </div>
            <Link
              to="/dashboard/model-portfolios"
              className="text-primary hover:text-primary-dark flex items-center text-sm font-medium"
            >
              Alle portfolios
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {FEATURED_PORTFOLIOS.map((portfolio) => (
              <div
                key={portfolio.id}
                className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{portfolio.name}</h3>
                    <p className="text-gray-500 text-sm">{portfolio.description}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    portfolio.risk === 'Laag' ? 'bg-green-500/20 text-green-400' :
                    portfolio.risk === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {portfolio.risk}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Verwacht rendement</p>
                    <p className="text-lg font-bold text-primary">{portfolio.expectedReturn}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Per jaar</p>
                    <p className="text-sm text-gray-400">historisch</p>
                  </div>
                </div>

                {/* Allocation bars */}
                <div className="space-y-2">
                  {portfolio.allocation.map((item, idx) => (
                    <div key={idx} className="flex items-center text-xs">
                      <span className="w-20 text-gray-400">{item.name}</span>
                      <div className="flex-1 h-2 bg-dark-border rounded-full mx-2 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-gray-400">{item.percentage}%</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/dashboard/model-portfolios/${portfolio.id}`}
                  className="mt-4 w-full py-2 border border-dark-border text-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors font-medium flex items-center justify-center text-sm"
                >
                  Bekijk details
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats / Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-dark-card border border-dark-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-xs text-gray-500">ETF's beschikbaar</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0.07%</p>
                <p className="text-xs text-gray-500">Laagste TER</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">AFM</p>
                <p className="text-xs text-gray-500">Gereguleerd</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
