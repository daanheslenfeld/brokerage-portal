import React from 'react';
import { User, Building2, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import type { AccountType } from '../../types';

export function AccountTypeStep() {
  const { accountType, setAccountType, nextStep } = useOnboarding();

  const handleSelect = (type: AccountType) => {
    setAccountType(type);
  };

  const handleContinue = () => {
    if (accountType) {
      nextStep();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Welkom bij PIGG
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Om te voldoen aan wet- en regelgeving (KYC/AML) hebben wij enkele gegevens van je nodig.
          Dit proces duurt ongeveer 5-10 minuten.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-dark-surface rounded-lg p-3 text-center">
          <CheckCircle className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-gray-300">Directe verificatie</p>
        </div>
        <div className="bg-dark-surface rounded-lg p-3 text-center">
          <CheckCircle className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-gray-300">Veilig & AVG-proof</p>
        </div>
        <div className="bg-dark-surface rounded-lg p-3 text-center">
          <CheckCircle className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-gray-300">Snelle activatie</p>
        </div>
      </div>

      {/* Account Type Selection */}
      <div className="space-y-4 mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Ik open een rekening als:
        </label>

        <button
          type="button"
          onClick={() => handleSelect('particulier')}
          className={`w-full relative flex items-center p-4 border-2 rounded-xl transition-all text-left ${
            accountType === 'particulier'
              ? 'border-primary bg-primary/10'
              : 'border-dark-border hover:border-gray-600'
          }`}
        >
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
            accountType === 'particulier' ? 'bg-primary/20' : 'bg-dark-surface'
          }`}>
            <User className={`w-6 h-6 ${accountType === 'particulier' ? 'text-primary' : 'text-gray-400'}`} />
          </div>
          <div>
            <span className="font-semibold text-white">Particulier</span>
            <p className="text-sm text-gray-400">Persoonlijke beleggingsrekening</p>
          </div>
          {accountType === 'particulier' && (
            <CheckCircle className="w-6 h-6 text-primary absolute top-4 right-4" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSelect('zakelijk')}
          className={`w-full relative flex items-center p-4 border-2 rounded-xl transition-all text-left ${
            accountType === 'zakelijk'
              ? 'border-primary bg-primary/10'
              : 'border-dark-border hover:border-gray-600'
          }`}
        >
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
            accountType === 'zakelijk' ? 'bg-primary/20' : 'bg-dark-surface'
          }`}>
            <Building2 className={`w-6 h-6 ${accountType === 'zakelijk' ? 'text-primary' : 'text-gray-400'}`} />
          </div>
          <div>
            <span className="font-semibold text-white">Zakelijk</span>
            <p className="text-sm text-gray-400">Bedrijfsrekening (BV, VOF, etc.)</p>
          </div>
          {accountType === 'zakelijk' && (
            <CheckCircle className="w-6 h-6 text-primary absolute top-4 right-4" />
          )}
        </button>
      </div>

      {/* Terms notice */}
      <p className="text-xs text-gray-500 mb-6 text-center">
        Door verder te gaan ga je akkoord met onze{' '}
        <a href="#" className="text-primary hover:underline">algemene voorwaarden</a>{' '}
        en{' '}
        <a href="#" className="text-primary hover:underline">privacyverklaring</a>.
      </p>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!accountType}
        className="w-full py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        Start verificatie
        <ArrowRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
}
