import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  ShoppingCart,
  X,
  ChevronDown,
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { usePortfolio } from '../../context/PortfolioContext';
import { OrderModal } from '../../components/trading/OrderModal';
import type { ETF } from '../../types';

const categories = ['Alle', 'Aandelen', 'Obligaties', 'Grondstoffen', 'Sectoren'];
const regions = ['Alle', 'Wereldwijd', 'Verenigde Staten', 'Europa', 'Opkomende markten', 'ESG Wereldwijd'];

export function ETFDatabasePage() {
  const { etfs, getHoldingByISIN } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [selectedRegion, setSelectedRegion] = useState('Alle');
  const [sortBy, setSortBy] = useState<'name' | 'ter' | 'ytd' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedETF, setSelectedETF] = useState<ETF | null>(null);

  const filteredETFs = useMemo(() => {
    let result = [...etfs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        etf =>
          etf.name.toLowerCase().includes(query) ||
          etf.isin.toLowerCase().includes(query) ||
          etf.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'Alle') {
      result = result.filter(etf => etf.category === selectedCategory);
    }

    // Region filter
    if (selectedRegion !== 'Alle') {
      result = result.filter(etf => etf.subcategory === selectedRegion);
    }

    // Sorting
    result.sort((a, b) => {
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
        case 'price':
          comparison = (a.price || 0) - (b.price || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [etfs, searchQuery, selectedCategory, selectedRegion, sortBy, sortOrder]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">ETF Database</h1>
          <p className="text-gray-400 mt-1">
            Ontdek en investeer in {etfs.length}+ ETFs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op naam of ISIN..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-gray-300"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Filters */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Categorie</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Regio</label>
              <select
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
              >
                {regions.map(reg => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 lg:col-span-2 flex items-end gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('Alle');
                  setSelectedRegion('Alle');
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Reset filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-400">
          {filteredETFs.length} ETFs gevonden
        </div>

        {/* ETF Table */}
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-dark-border text-sm text-gray-400 font-medium">
            <button
              onClick={() => toggleSort('name')}
              className="col-span-4 flex items-center gap-1 hover:text-white transition-colors text-left"
            >
              Naam
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <div className="col-span-2">Categorie</div>
            <button
              onClick={() => toggleSort('ter')}
              className="col-span-1 flex items-center gap-1 hover:text-white transition-colors"
            >
              TER
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSort('price')}
              className="col-span-2 flex items-center gap-1 hover:text-white transition-colors"
            >
              Koers
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSort('ytd')}
              className="col-span-1 flex items-center gap-1 hover:text-white transition-colors"
            >
              YTD
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <div className="col-span-2 text-right">Actie</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-dark-border">
            {filteredETFs.map(etf => {
              const holding = getHoldingByISIN(etf.isin);
              const ytdValue = parseFloat(etf.ytd);
              const isPositive = ytdValue >= 0;

              return (
                <div
                  key={etf.isin}
                  className="p-4 hover:bg-dark-surface transition-colors"
                >
                  {/* Desktop View */}
                  <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <Link
                        to={`/etfs/${etf.isin}`}
                        className="font-medium text-white hover:text-primary transition-colors"
                      >
                        {etf.name}
                      </Link>
                      <p className="text-sm text-gray-500">{etf.isin}</p>
                      {holding && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">
                          In portfolio
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 text-gray-400">
                      <div>{etf.category}</div>
                      <div className="text-sm text-gray-500">{etf.subcategory}</div>
                    </div>
                    <div className="col-span-1 text-gray-300">{etf.ter}%</div>
                    <div className="col-span-2">
                      <div className="text-white font-medium">
                        €{etf.price?.toFixed(2) || '-'}
                      </div>
                      <div className={`text-sm flex items-center gap-1 ${(etf.change1d || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {(etf.change1d || 0) >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {(etf.change1d || 0) >= 0 ? '+' : ''}{etf.change1d?.toFixed(2) || 0}%
                      </div>
                    </div>
                    <div className={`col-span-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {etf.ytd}
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedETF(etf)}
                        className="px-4 py-2 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Kopen
                      </button>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="lg:hidden space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          to={`/etfs/${etf.isin}`}
                          className="font-medium text-white hover:text-primary transition-colors"
                        >
                          {etf.name}
                        </Link>
                        <p className="text-sm text-gray-500">{etf.isin}</p>
                        {holding && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">
                            In portfolio
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">
                          €{etf.price?.toFixed(2) || '-'}
                        </div>
                        <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {etf.ytd}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        {etf.category} • TER {etf.ter}%
                      </div>
                      <button
                        onClick={() => setSelectedETF(etf)}
                        className="px-4 py-2 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm"
                      >
                        Kopen
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredETFs.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <p>Geen ETFs gevonden die aan je zoekcriteria voldoen.</p>
              <button
                onClick={() => {
                  setSelectedCategory('Alle');
                  setSelectedRegion('Alle');
                  setSearchQuery('');
                }}
                className="mt-4 text-primary hover:text-primary-dark"
              >
                Reset alle filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Order Modal */}
      {selectedETF && (
        <OrderModal
          etf={selectedETF}
          onClose={() => setSelectedETF(null)}
        />
      )}
    </div>
  );
}
