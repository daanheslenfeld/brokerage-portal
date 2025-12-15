import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Info,
  ShoppingCart,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { usePortfolio } from '../../context/PortfolioContext';
import { OrderModal } from '../../components/trading/OrderModal';

// Generate mock performance data
const generatePerformanceData = () => {
  const data = [];
  let value = 100;
  for (let i = 0; i < 365; i++) {
    value = value * (1 + (Math.random() - 0.48) * 0.02);
    data.push({
      date: new Date(Date.now() - (365 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL', { month: 'short', day: 'numeric' }),
      value: value,
    });
  }
  return data;
};

export function ETFDetailPage() {
  const { isin } = useParams<{ isin: string }>();
  const navigate = useNavigate();
  const { getETFByISIN, getHoldingByISIN } = usePortfolio();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('1J');

  const etf = getETFByISIN(isin || '');
  const holding = getHoldingByISIN(isin || '');

  if (!etf) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">ETF niet gevonden</h1>
            <p className="text-gray-400 mb-6">De ETF met ISIN {isin} bestaat niet.</p>
            <Link
              to="/etfs"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar ETF Database
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const performanceData = generatePerformanceData();
  const price = etf.price || 100;
  const isPositive = (etf.change1d || 0) >= 0;

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug
        </button>

        {/* ETF Header */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                  {etf.category}
                </span>
                <span className="px-2 py-1 bg-dark-surface text-gray-400 text-xs rounded">
                  {etf.distribution}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{etf.name}</h1>
              <p className="text-gray-400">{etf.isin}</p>
              {holding && (
                <div className="mt-3 p-3 bg-primary/10 border border-primary/30 rounded-lg inline-block">
                  <p className="text-primary text-sm font-medium">
                    In je portfolio: {holding.shares.toFixed(4)} aandelen (€{holding.value.toLocaleString()})
                  </p>
                </div>
              )}
            </div>
            <div className="text-left lg:text-right">
              <div className="text-3xl font-bold text-white mb-1">€{price.toFixed(2)}</div>
              <div className={`flex items-center gap-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <span className="text-lg font-medium">
                  {isPositive ? '+' : ''}{etf.change1d?.toFixed(2) || 0}% vandaag
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">YTD: {etf.ytd}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setShowOrderModal(true)}
              className="flex-1 sm:flex-none px-6 py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Kopen
            </button>
            {holding && (
              <button
                onClick={() => setShowOrderModal(true)}
                className="flex-1 sm:flex-none px-6 py-3 bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors font-semibold"
              >
                Verkopen
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Koersverloop
              </h2>
              <div className="flex gap-2">
                {['1M', '3M', '6M', '1J', 'Max'].map(period => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedPeriod === period
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
                <AreaChart data={performanceData.slice(-90)}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
                    itemStyle={{ color: '#28EBCF' }}
                    formatter={(value: number) => [`€${value.toFixed(2)}`, 'Waarde']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#28EBCF"
                    strokeWidth={2}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Stats */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Kerncijfers
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-dark-border">
                <span className="text-gray-400">TER (kosten)</span>
                <span className="text-white font-medium">{etf.ter}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dark-border">
                <span className="text-gray-400">Fondsvermogen</span>
                <span className="text-white font-medium">{etf.fundSize}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dark-border">
                <span className="text-gray-400">Valuta</span>
                <span className="text-white font-medium">{etf.currency}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dark-border">
                <span className="text-gray-400">Distributie</span>
                <span className="text-white font-medium">{etf.distribution}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dark-border">
                <span className="text-gray-400">Replicatie</span>
                <span className="text-white font-medium">{etf.replication}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dark-border">
                <span className="text-gray-400">Holdings</span>
                <span className="text-white font-medium">{etf.holdings}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dark-border">
                <span className="text-gray-400">Volatiliteit</span>
                <span className="text-white font-medium">{etf.volatility}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">YTD rendement</span>
                <span className={`font-medium ${parseFloat(etf.ytd) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {etf.ytd}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Info */}
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Over dit ETF</h2>
            <p className="text-gray-400 leading-relaxed">
              {etf.name} is een {etf.distribution === 'Accumulating' ? 'accumulerend' : 'distribuerend'} ETF
              die belegt in {etf.category.toLowerCase()} met focus op {etf.subcategory.toLowerCase()}.
              Het fonds gebruikt {etf.replication.toLowerCase()} replicatie en beheert een vermogen van {etf.fundSize}.
              De lopende kosten (TER) bedragen {etf.ter}% per jaar.
            </p>
            <div className="mt-4 pt-4 border-t border-dark-border">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Meer informatie op de website van de aanbieder
              </p>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Regio allocatie
            </h2>
            <div className="space-y-3">
              {[
                { region: 'Verenigde Staten', percentage: 62 },
                { region: 'Europa', percentage: 18 },
                { region: 'Japan', percentage: 8 },
                { region: 'Azië (excl. Japan)', percentage: 7 },
                { region: 'Overig', percentage: 5 },
              ].map(item => (
                <div key={item.region}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{item.region}</span>
                    <span className="text-white">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-dark-surface rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Warning */}
        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <p className="text-amber-500 text-sm">
            <strong>Let op:</strong> Beleggen brengt risico's met zich mee. Je kunt je inleg verliezen.
            In het verleden behaalde resultaten bieden geen garantie voor de toekomst.
          </p>
        </div>
      </main>

      <Footer />

      {/* Order Modal */}
      {showOrderModal && (
        <OrderModal
          etf={etf}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </div>
  );
}
