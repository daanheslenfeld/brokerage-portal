import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ShoppingCart,
  TrendingDown,
  Filter,
  Calendar,
  Download,
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { usePortfolio } from '../../context/PortfolioContext';
import type { Transaction } from '../../types';

const transactionTypeIcons = {
  deposit: ArrowDownToLine,
  withdrawal: ArrowUpFromLine,
  buy: ShoppingCart,
  sell: TrendingDown,
  dividend: ArrowDownToLine,
};

const transactionTypeLabels = {
  deposit: 'Storting',
  withdrawal: 'Opname',
  buy: 'Aankoop',
  sell: 'Verkoop',
  dividend: 'Dividend',
};

const transactionTypeColors = {
  deposit: 'text-green-500 bg-green-500/20',
  withdrawal: 'text-orange-500 bg-orange-500/20',
  buy: 'text-blue-500 bg-blue-500/20',
  sell: 'text-red-500 bg-red-500/20',
  dividend: 'text-primary bg-primary/20',
};

export function TransactionsPage() {
  const { transactions } = usePortfolio();
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell' | 'deposit' | 'withdrawal'>('all');

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAmountColor = (type: Transaction['type']) => {
    return ['deposit', 'sell', 'dividend'].includes(type) ? 'text-green-500' : 'text-red-500';
  };

  const getAmountPrefix = (type: Transaction['type']) => {
    return ['deposit', 'sell', 'dividend'].includes(type) ? '+' : '-';
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Transacties</h1>
            <p className="text-gray-400 mt-1">
              Bekijk al je transacties en ordergeschiedenis
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-gray-300 hover:text-white transition-colors">
            <Download className="w-4 h-4" />
            Exporteer
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Alles' },
            { value: 'buy', label: 'Aankopen' },
            { value: 'sell', label: 'Verkopen' },
            { value: 'deposit', label: 'Stortingen' },
            { value: 'withdrawal', label: 'Opnames' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-primary text-dark-bg'
                  : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          {filteredTransactions.length > 0 ? (
            <div className="divide-y divide-dark-border">
              {filteredTransactions.map(transaction => {
                const Icon = transactionTypeIcons[transaction.type];
                const label = transactionTypeLabels[transaction.type];
                const colorClass = transactionTypeColors[transaction.type];

                return (
                  <div
                    key={transaction.id}
                    className="p-4 sm:p-6 hover:bg-dark-surface transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`p-3 rounded-xl ${colorClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Details */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">{label}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              transaction.status === 'completed'
                                ? 'bg-green-500/20 text-green-500'
                                : transaction.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-500'
                                : 'bg-red-500/20 text-red-500'
                            }`}>
                              {transaction.status === 'completed' ? 'Voltooid' : transaction.status === 'pending' ? 'In behandeling' : 'Geannuleerd'}
                            </span>
                          </div>

                          {transaction.etf && (
                            <Link
                              to={`/etfs/${transaction.etf.isin}`}
                              className="text-gray-400 hover:text-primary transition-colors text-sm"
                            >
                              {transaction.etf.name}
                            </Link>
                          )}

                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(transaction.date)}
                            </span>
                            {transaction.shares && (
                              <span>{transaction.shares.toFixed(4)} aandelen</span>
                            )}
                            {transaction.price && (
                              <span>@ €{transaction.price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <span className={`text-lg font-bold ${getAmountColor(transaction.type)}`}>
                          {getAmountPrefix(transaction.type)}€{transaction.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Geen transacties gevonden</p>
              <p className="text-gray-500 text-sm">
                {filter === 'all'
                  ? 'Je hebt nog geen transacties gedaan.'
                  : 'Er zijn geen transacties van dit type.'}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {transactions.length > 0 && (
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-dark-card border border-dark-border rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Totaal gestort</p>
              <p className="text-xl font-bold text-green-500">
                €{transactions
                  .filter(t => t.type === 'deposit')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Totaal opgenomen</p>
              <p className="text-xl font-bold text-orange-500">
                €{transactions
                  .filter(t => t.type === 'withdrawal')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Totaal gekocht</p>
              <p className="text-xl font-bold text-blue-500">
                €{transactions
                  .filter(t => t.type === 'buy')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Totaal verkocht</p>
              <p className="text-xl font-bold text-red-500">
                €{transactions
                  .filter(t => t.type === 'sell')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
