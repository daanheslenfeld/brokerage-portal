import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import type { ETF } from '../../types';

interface OrderModalProps {
  etf: ETF;
  onClose: () => void;
  initialType?: 'buy' | 'sell';
}

export function OrderModal({ etf, onClose, initialType = 'buy' }: OrderModalProps) {
  const { cashBalance, buyETF, sellETF, getHoldingByISIN } = usePortfolio();
  const [orderType, setOrderType] = useState<'buy' | 'sell'>(initialType);
  const [orderMethod, setOrderMethod] = useState<'amount' | 'shares'>('amount');
  const [orderAmount, setOrderAmount] = useState(1000);
  const [orderShares, setOrderShares] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderResult, setOrderResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const holding = getHoldingByISIN(etf.isin);
  const price = etf.price || 100;
  const estimatedShares = orderAmount / price;
  const estimatedCost = orderShares * price;
  const transactionFee = 2.00;

  const totalCost = orderMethod === 'amount' ? orderAmount + transactionFee : estimatedCost + transactionFee;
  const canAfford = orderType === 'buy' ? totalCost <= cashBalance : true;
  const hasEnoughShares = orderType === 'sell' && holding
    ? (orderMethod === 'shares' ? orderShares <= holding.shares : estimatedShares <= holding.shares)
    : orderType === 'buy';

  const handleSubmit = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let success = false;

    if (orderType === 'buy') {
      const amount = orderMethod === 'amount' ? orderAmount : orderShares;
      success = buyETF(etf, amount, orderMethod);
      if (!success) {
        setErrorMessage('Onvoldoende saldo om deze order uit te voeren.');
      }
    } else {
      const amount = orderMethod === 'amount' ? orderAmount : orderShares;
      success = sellETF(etf.isin, amount, orderMethod);
      if (!success) {
        setErrorMessage('Je hebt niet genoeg aandelen om te verkopen.');
      }
    }

    setIsProcessing(false);
    setOrderResult(success ? 'success' : 'error');

    if (success) {
      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  if (orderResult === 'success') {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div className="bg-dark-card border border-dark-border rounded-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Order Uitgevoerd!</h2>
            <p className="text-gray-400">
              Je hebt succesvol {orderType === 'buy' ? 'gekocht' : 'verkocht'}:
            </p>
            <p className="text-white font-medium mt-2">
              {orderMethod === 'shares'
                ? `${orderShares.toFixed(4)} aandelen`
                : `€${orderAmount.toLocaleString()}`} van {etf.name}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-card border border-dark-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Order Plaatsen</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-surface rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* ETF Info */}
          <div className="mb-6 p-4 bg-dark-surface rounded-xl">
            <h3 className="font-medium text-white mb-1">{etf.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{etf.isin}</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Huidige koers:</span>
              <div className="text-right">
                <span className="text-white font-medium">€{price.toFixed(2)}</span>
                <div className={`text-sm flex items-center gap-1 ${(etf.change1d || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {(etf.change1d || 0) >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {(etf.change1d || 0) >= 0 ? '+' : ''}{etf.change1d?.toFixed(2) || 0}%
                </div>
              </div>
            </div>
            {holding && (
              <div className="mt-2 pt-2 border-t border-dark-border flex justify-between text-sm">
                <span className="text-gray-400">In bezit:</span>
                <span className="text-white">{holding.shares.toFixed(4)} aandelen (€{holding.value.toLocaleString()})</span>
              </div>
            )}
          </div>

          {/* Order Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Order type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOrderType('buy')}
                className={`p-3 text-sm rounded-lg border transition-all ${
                  orderType === 'buy'
                    ? 'bg-green-500/20 border-green-500 text-green-500'
                    : 'bg-dark-surface border-dark-border text-gray-400 hover:border-gray-500'
                }`}
              >
                Kopen
              </button>
              <button
                onClick={() => setOrderType('sell')}
                disabled={!holding}
                className={`p-3 text-sm rounded-lg border transition-all ${
                  orderType === 'sell'
                    ? 'bg-red-500/20 border-red-500 text-red-500'
                    : 'bg-dark-surface border-dark-border text-gray-400 hover:border-gray-500'
                } ${!holding ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Verkopen
              </button>
            </div>
          </div>

          {/* Order Method */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Order methode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOrderMethod('amount')}
                className={`p-3 text-sm rounded-lg border transition-all ${
                  orderMethod === 'amount'
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-dark-surface border-dark-border text-gray-400 hover:border-gray-500'
                }`}
              >
                Bedrag (€)
              </button>
              <button
                onClick={() => setOrderMethod('shares')}
                className={`p-3 text-sm rounded-lg border transition-all ${
                  orderMethod === 'shares'
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-dark-surface border-dark-border text-gray-400 hover:border-gray-500'
                }`}
              >
                Aantal aandelen
              </button>
            </div>
          </div>

          {/* Amount/Shares Input */}
          {orderMethod === 'amount' ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Bedrag (€)</label>
              <input
                type="number"
                value={orderAmount}
                onChange={e => setOrderAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                min="0"
                step="100"
              />
              <p className="text-sm text-gray-500 mt-1">
                ≈ {estimatedShares.toFixed(4)} aandelen
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Aantal aandelen</label>
              <input
                type="number"
                value={orderShares}
                onChange={e => setOrderShares(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
                min="0"
                step="0.0001"
              />
              <p className="text-sm text-gray-500 mt-1">
                ≈ €{estimatedCost.toFixed(2)}
              </p>
            </div>
          )}

          {/* Quick Amount Buttons */}
          {orderMethod === 'amount' && orderType === 'buy' && (
            <div className="mb-4 flex gap-2">
              {[100, 500, 1000, 2500].map(amount => (
                <button
                  key={amount}
                  onClick={() => setOrderAmount(amount)}
                  className="flex-1 py-2 text-sm bg-dark-surface border border-dark-border rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                >
                  €{amount}
                </button>
              ))}
            </div>
          )}

          {/* Order Summary */}
          <div className="mb-6 p-4 bg-dark-surface rounded-xl">
            <h4 className="font-medium text-white mb-3">Order samenvatting</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Koers per aandeel:</span>
                <span className="text-white">€{price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Aantal aandelen:</span>
                <span className="text-white">
                  {orderMethod === 'shares' ? orderShares.toFixed(4) : estimatedShares.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Orderwaarde:</span>
                <span className="text-white">
                  €{(orderMethod === 'amount' ? orderAmount : estimatedCost).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transactiekosten:</span>
                <span className="text-white">€{transactionFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">TER (jaarlijks):</span>
                <span className="text-white">{etf.ter}%</span>
              </div>
              <div className="pt-2 border-t border-dark-border flex justify-between font-medium">
                <span className="text-white">Totaal:</span>
                <span className={orderType === 'buy' ? 'text-red-400' : 'text-green-400'}>
                  {orderType === 'buy' ? '-' : '+'}€{totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Available Balance */}
          <div className="mb-4 flex justify-between text-sm">
            <span className="text-gray-400">Beschikbaar saldo:</span>
            <span className={`font-medium ${canAfford ? 'text-white' : 'text-red-500'}`}>
              €{cashBalance.toLocaleString()}
            </span>
          </div>

          {/* Error Message */}
          {(orderResult === 'error' || (!canAfford && orderType === 'buy') || (!hasEnoughShares && orderType === 'sell')) && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">
                {errorMessage || (orderType === 'buy'
                  ? 'Onvoldoende saldo. Stort geld om te kunnen beleggen.'
                  : 'Je hebt niet genoeg aandelen om te verkopen.')}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isProcessing || (orderType === 'buy' && !canAfford) || (orderType === 'sell' && !hasEnoughShares)}
            className={`w-full py-4 rounded-xl font-semibold transition-colors ${
              orderType === 'buy'
                ? 'bg-green-500 hover:bg-green-600 text-white disabled:bg-green-500/50'
                : 'bg-red-500 hover:bg-red-600 text-white disabled:bg-red-500/50'
            } disabled:cursor-not-allowed`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verwerken...
              </span>
            ) : (
              `${orderType === 'buy' ? 'Kopen' : 'Verkopen'} - €${totalCost.toFixed(2)}`
            )}
          </button>

          {/* Disclaimer */}
          <p className="mt-4 text-xs text-gray-500 text-center">
            Door te klikken ga je akkoord met de handelsvoorwaarden.
            Beleggen brengt risico's met zich mee.
          </p>
        </div>
      </div>
    </div>
  );
}
