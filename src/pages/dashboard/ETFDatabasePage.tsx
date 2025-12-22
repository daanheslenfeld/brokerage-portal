import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Plus,
  Info,
  X
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { ETF_DATABASE, CATEGORIES, SUBCATEGORIES, type ETFData } from '../../data/etfDatabase';

export function ETFDatabasePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedDistribution, setSelectedDistribution] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'ter' | 'ytd' | 'fundSize'>('fundSize');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedETF, setSelectedETF] = useState<ETFData | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredETFs = useMemo(() => {
    let filtered = [...ETF_DATABASE];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        etf =>
          etf.name.toLowerCase().includes(term) ||
          etf.isin.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(etf => etf.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubcategory) {
      filtered = filtered.filter(etf => etf.subcategory === selectedSubcategory);
    }

    // Distribution filter
    if (selectedDistribution) {
      filtered = filtered.filter(etf => etf.distribution === selectedDistribution);
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'ter':
          comparison = parseFloat(a.ter) - parseFloat(b.ter);
          break;
        case 'ytd':
          comparison = parseFloat(a.ytd) - parseFloat(b.ytd);
          break;
        case 'fundSize':
          comparison = parseFloat(a.fundSize) - parseFloat(b.fundSize);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedSubcategory, selectedDistribution, sortBy, sortOrder]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedDistribution('');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedCategory || selectedSubcategory || selectedDistribution || searchTerm;

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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">ETF Database</h1>
          <p className="text-gray-400 mt-1">
            {filteredETFs.length} ETF's gevonden
          </p>
        </div>

        {/* Search and filters */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Zoek op naam of ISIN..."
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Filter toggle button (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-gray-300"
            >
              <Filter className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-primary rounded-full" />
              )}
            </button>

            {/* Desktop filters */}
            <div className="hidden md:flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
              >
                <option value="">Alle categorieën</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedDistribution}
                onChange={(e) => setSelectedDistribution(e.target.value)}
                className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
              >
                <option value="">Uitkering</option>
                <option value="Accumulating">Accumulating</option>
                <option value="Distributing">Distributing</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
                className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
              >
                <option value="fundSize-desc">Grootste eerst</option>
                <option value="fundSize-asc">Kleinste eerst</option>
                <option value="ter-asc">Laagste TER</option>
                <option value="ter-desc">Hoogste TER</option>
                <option value="ytd-desc">Beste YTD</option>
                <option value="ytd-asc">Slechtste YTD</option>
                <option value="name-asc">A-Z</option>
              </select>
            </div>
          </div>

          {/* Mobile filters dropdown */}
          {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-dark-border grid grid-cols-2 gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:outline-none"
              >
                <option value="">Categorie</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedDistribution}
                onChange={(e) => setSelectedDistribution(e.target.value)}
                className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:outline-none"
              >
                <option value="">Uitkering</option>
                <option value="Accumulating">Acc</option>
                <option value="Distributing">Dist</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
                className="col-span-2 bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:outline-none"
              >
                <option value="fundSize-desc">Grootste eerst</option>
                <option value="ter-asc">Laagste TER</option>
                <option value="ytd-desc">Beste YTD</option>
              </select>
            </div>
          )}

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-dark-border">
              <span className="text-sm text-gray-500">Actieve filters:</span>
              {selectedCategory && (
                <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs flex items-center">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('')} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedDistribution && (
                <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs flex items-center">
                  {selectedDistribution}
                  <button onClick={() => setSelectedDistribution('')} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-400 hover:text-primary"
              >
                Wis alles
              </button>
            </div>
          )}
        </div>

        {/* ETF List */}
        <div className="space-y-3">
          {filteredETFs.map((etf) => {
            const ytdValue = parseFloat(etf.ytd);
            const isPositive = ytdValue >= 0;

            return (
              <div
                key={etf.isin}
                className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => setSelectedETF(etf)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between md:justify-start gap-2">
                      <h3 className="font-semibold text-white">{etf.name}</h3>
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
                      <span>{etf.subcategory}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">TER</p>
                      <p className="text-white font-medium">{etf.ter}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">YTD</p>
                      <p className={`font-medium flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {etf.ytd}
                      </p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-xs text-gray-500">Fund Size</p>
                      <p className="text-white font-medium">€{(parseFloat(etf.fundSize)).toLocaleString()}M</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to portfolio logic here
                      }}
                      className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredETFs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Geen ETF's gevonden met deze filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-primary hover:text-primary-dark"
            >
              Wis alle filters
            </button>
          </div>
        )}
      </main>

      {/* ETF Detail Modal */}
      {selectedETF && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedETF.name}</h2>
                  <p className="text-gray-500">{selectedETF.isin}</p>
                </div>
                <button
                  onClick={() => setSelectedETF(null)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-dark-surface rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500">TER</p>
                  <p className="text-xl font-bold text-primary">{selectedETF.ter}</p>
                </div>
                <div className="bg-dark-surface rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500">YTD</p>
                  <p className={`text-xl font-bold ${parseFloat(selectedETF.ytd) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedETF.ytd}
                  </p>
                </div>
                <div className="bg-dark-surface rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500">Fund Size</p>
                  <p className="text-xl font-bold text-white">€{parseFloat(selectedETF.fundSize).toLocaleString()}M</p>
                </div>
              </div>

              {/* Historical returns */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Historisch Rendement</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { year: '2024', value: selectedETF.return2024 },
                    { year: '2023', value: selectedETF.return2023 },
                    { year: '2022', value: selectedETF.return2022 },
                    { year: '2021', value: selectedETF.return2021 },
                  ].map(item => (
                    <div key={item.year} className="bg-dark-surface rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">{item.year}</p>
                      <p className={`font-bold ${parseFloat(item.value) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Categorie</span>
                    <span className="text-white">{selectedETF.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subcategorie</span>
                    <span className="text-white">{selectedETF.subcategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valuta</span>
                    <span className="text-white">{selectedETF.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Uitkering</span>
                    <span className="text-white">{selectedETF.distribution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Holdings</span>
                    <span className="text-white">{selectedETF.holdings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Replicatie</span>
                    <span className="text-white">{selectedETF.replication}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Volatiliteit 1Y</span>
                    <span className="text-white">{selectedETF.volatility1y}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start datum</span>
                    <span className="text-white">{selectedETF.inceptionDate}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedETF(null)}
                  className="flex-1 py-3 border border-dark-border text-gray-300 rounded-lg hover:border-gray-600 transition-colors font-medium"
                >
                  Sluiten
                </button>
                <Link
                  to={`/dashboard/portfolio-builder?add=${selectedETF.isin}`}
                  className="flex-1 py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold text-center flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Toevoegen aan Portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
