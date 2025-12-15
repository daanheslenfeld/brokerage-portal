import React, { useState } from 'react';
import { X, ArrowDownToLine, ArrowUpFromLine, CheckCircle, AlertCircle, Building } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface DepositWithdrawModalProps {
  onClose: () => void;
  initialType?: 'deposit' | 'withdraw';
}

export function DepositWithdrawModal({ onClose, initialType = 'deposit' }: DepositWithdrawModalProps) {
  const { cashBalance, deposit, withdraw } = usePortfolio();
  const [type, setType] = useState<'deposit' | 'withdraw'>(initialType);
  const [amount, setAmount] = useState(1000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const canWithdraw = type === 'withdraw' ? amount <= cashBalance : true;

  const handleSubmit = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let success = false;

    if (type === 'deposit') {
      deposit(amount);
      success = true;
    } else {
      success = withdraw(amount);
      if (!success) {
        setErrorMessage('Onvoldoende saldo om op te nemen.');
      }
    }

    setIsProcessing(false);
    setResult(success ? 'success' : 'error');

    if (success) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  if (result === 'success') {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div className="bg-dark-card border border-dark-border rounded-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {type === 'deposit' ? 'Storting Geslaagd!' : 'Opname Aangevraagd!'}
            </h2>
            <p className="text-gray-400">
              {type === 'deposit'
                ? `€${amount.toLocaleString()} is toegevoegd aan je account.`
                : `€${amount.toLocaleString()} wordt binnen 1-2 werkdagen overgemaakt.`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-card border border-dark-border rounded-2xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {type === 'deposit' ? 'Geld Storten' : 'Geld Opnemen'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-surface rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              onClick={() => setType('deposit')}
              className={`p-4 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                type === 'deposit'
                  ? 'bg-green-500/20 border-green-500 text-green-500'
                  : 'bg-dark-surface border-dark-border text-gray-400 hover:border-gray-500'
              }`}
            >
              <ArrowDownToLine className="w-5 h-5" />
              Storten
            </button>
            <button
              onClick={() => setType('withdraw')}
              className={`p-4 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                type === 'withdraw'
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-dark-surface border-dark-border text-gray-400 hover:border-gray-500'
              }`}
            >
              <ArrowUpFromLine className="w-5 h-5" />
              Opnemen
            </button>
          </div>

          {/* Current Balance */}
          <div className="mb-6 p-4 bg-dark-surface rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Huidig saldo</span>
              <span className="text-white font-bold text-xl">€{cashBalance.toLocaleString()}</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Bedrag (€)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white text-xl font-medium focus:outline-none focus:border-primary"
              min="0"
              step="100"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-6 grid grid-cols-4 gap-2">
            {[500, 1000, 2500, 5000].map(amt => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`py-2 text-sm rounded-lg border transition-colors ${
                  amount === amt
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-dark-surface border-dark-border text-gray-400 hover:border-gray-500'
                }`}
              >
                €{amt.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Bank Account Info */}
          {type === 'deposit' && (
            <div className="mb-6 p-4 bg-dark-surface rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Building className="w-5 h-5 text-primary" />
                <span className="text-white font-medium">Storten via iDEAL</span>
              </div>
              <p className="text-gray-400 text-sm">
                Na bevestiging word je doorgestuurd naar je bank om de betaling te voltooien.
                Het bedrag is direct beschikbaar.
              </p>
            </div>
          )}

          {type === 'withdraw' && (
            <div className="mb-6 p-4 bg-dark-surface rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Building className="w-5 h-5 text-primary" />
                <span className="text-white font-medium">Opnemen naar je bankrekening</span>
              </div>
              <p className="text-gray-400 text-sm">
                Het bedrag wordt overgemaakt naar je gekoppelde bankrekening.
                Dit duurt 1-2 werkdagen.
              </p>
              <div className="mt-3 pt-3 border-t border-dark-border">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Naar rekening:</span>
                  <span className="text-white">NL12 INGB **** 4567</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {(result === 'error' || !canWithdraw) && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">
                {errorMessage || 'Je kunt niet meer opnemen dan je beschikbare saldo.'}
              </p>
            </div>
          )}

          {/* New Balance Preview */}
          <div className="mb-6 flex justify-between text-sm">
            <span className="text-gray-400">Nieuw saldo na {type === 'deposit' ? 'storting' : 'opname'}:</span>
            <span className="text-white font-medium">
              €{(type === 'deposit' ? cashBalance + amount : cashBalance - amount).toLocaleString()}
            </span>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isProcessing || amount <= 0 || (type === 'withdraw' && !canWithdraw)}
            className={`w-full py-4 rounded-xl font-semibold transition-colors ${
              type === 'deposit'
                ? 'bg-green-500 hover:bg-green-600 text-white disabled:bg-green-500/50'
                : 'bg-primary hover:bg-primary-dark text-dark-bg disabled:bg-primary/50'
            } disabled:cursor-not-allowed`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verwerken...
              </span>
            ) : type === 'deposit' ? (
              `Stort €${amount.toLocaleString()}`
            ) : (
              `Neem €${amount.toLocaleString()} op`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
