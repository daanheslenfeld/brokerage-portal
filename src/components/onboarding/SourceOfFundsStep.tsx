import React from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Wallet, Info } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import type { SourceOfFunds } from '../../types';

const SOURCE_OPTIONS = [
  { value: 'salary', label: 'Salaris / Inkomen' },
  { value: 'savings', label: 'Spaargeld' },
  { value: 'inheritance', label: 'Erfenis' },
  { value: 'sale_property', label: 'Verkoop onroerend goed' },
  { value: 'sale_business', label: 'Verkoop onderneming' },
  { value: 'investment_returns', label: 'Beleggingsopbrengsten' },
  { value: 'other', label: 'Anders' },
];

const INCOME_RANGES = [
  { value: '0-25000', label: '€0 - €25.000' },
  { value: '25000-50000', label: '€25.000 - €50.000' },
  { value: '50000-100000', label: '€50.000 - €100.000' },
  { value: '100000-250000', label: '€100.000 - €250.000' },
  { value: '250000+', label: '€250.000+' },
];

const NETWORTH_RANGES = [
  { value: '0-50000', label: '€0 - €50.000' },
  { value: '50000-100000', label: '€50.000 - €100.000' },
  { value: '100000-500000', label: '€100.000 - €500.000' },
  { value: '500000-1000000', label: '€500.000 - €1.000.000' },
  { value: '1000000+', label: '€1.000.000+' },
];

export function SourceOfFundsStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SourceOfFunds>({
    defaultValues: data.sourceOfFunds || {},
  });

  const onSubmit = (formData: SourceOfFunds) => {
    updateData({ sourceOfFunds: formData });
    nextStep();
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
          <Wallet className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Bron van Vermogen</h2>
        <p className="text-gray-400 text-sm">
          Wij zijn wettelijk verplicht te weten waar uw geld vandaan komt
        </p>
      </div>

      {/* Info box */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            Deze informatie wordt gebruikt om te voldoen aan de Wet ter voorkoming van witwassen (Wwft).
            Uw gegevens worden vertrouwelijk behandeld.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Primary Source */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Primaire bron van uw vermogen *
          </label>
          <select
            {...register('primarySource', { required: 'Dit veld is verplicht' })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
          >
            <option value="">Selecteer een optie</option>
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.primarySource && (
            <p className="text-red-400 text-xs mt-1">{errors.primarySource.message}</p>
          )}
        </div>

        {/* Monthly Income */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Geschat jaarlijks inkomen *
          </label>
          <select
            {...register('monthlyIncome', { required: 'Dit veld is verplicht' })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
          >
            <option value="">Selecteer een range</option>
            {INCOME_RANGES.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.monthlyIncome && (
            <p className="text-red-400 text-xs mt-1">{errors.monthlyIncome.message}</p>
          )}
        </div>

        {/* Net Worth */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Geschat totaal vermogen *
          </label>
          <select
            {...register('netWorth', { required: 'Dit veld is verplicht' })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
          >
            <option value="">Selecteer een range</option>
            {NETWORTH_RANGES.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.netWorth && (
            <p className="text-red-400 text-xs mt-1">{errors.netWorth.message}</p>
          )}
        </div>

        {/* Expected Investment */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Verwachte initiële investering *
          </label>
          <select
            {...register('expectedInvestment', { required: 'Dit veld is verplicht' })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
          >
            <option value="">Selecteer een bedrag</option>
            <option value="0-1000">€0 - €1.000</option>
            <option value="1000-5000">€1.000 - €5.000</option>
            <option value="5000-25000">€5.000 - €25.000</option>
            <option value="25000-100000">€25.000 - €100.000</option>
            <option value="100000+">€100.000+</option>
          </select>
          {errors.expectedInvestment && (
            <p className="text-red-400 text-xs mt-1">{errors.expectedInvestment.message}</p>
          )}
        </div>

        {/* Funding Source */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hoe financiert u uw stortingen? *
          </label>
          <select
            {...register('fundingSource', { required: 'Dit veld is verplicht' })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
          >
            <option value="">Selecteer een optie</option>
            <option value="own_bank">Eigen bankrekening</option>
            <option value="business_account">Zakelijke rekening</option>
            <option value="third_party">Rekening van derden</option>
          </select>
          {errors.fundingSource && (
            <p className="text-red-400 text-xs mt-1">{errors.fundingSource.message}</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-3 border border-dark-border text-gray-300 rounded-lg hover:border-gray-600 transition-colors font-medium flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Terug
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center"
          >
            Verder
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
}
