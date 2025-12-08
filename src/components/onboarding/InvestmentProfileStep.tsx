import React from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import type { InvestmentProfile } from '../../types';

const EXPERIENCE_OPTIONS = [
  { value: 'none', label: 'Geen ervaring', desc: 'Ik heb nog nooit belegd' },
  { value: 'beginner', label: 'Beginner', desc: '0-2 jaar ervaring' },
  { value: 'intermediate', label: 'Gemiddeld', desc: '2-5 jaar ervaring' },
  { value: 'experienced', label: 'Ervaren', desc: '5+ jaar ervaring' },
];

const RISK_OPTIONS = [
  { value: 'conservative', label: 'Conservatief', desc: 'Kapitaalbehoud is prioriteit', color: 'text-green-400' },
  { value: 'moderate', label: 'Gematigd', desc: 'Balans tussen groei en risico', color: 'text-yellow-400' },
  { value: 'aggressive', label: 'Agressief', desc: 'Maximale groei accepteert risico', color: 'text-red-400' },
];

const GOAL_OPTIONS = [
  { value: 'retirement', label: 'Pensioen' },
  { value: 'wealth_building', label: 'Vermogensopbouw' },
  { value: 'income', label: 'Passief inkomen' },
  { value: 'education', label: 'Studie kinderen' },
  { value: 'house', label: 'Huis kopen' },
  { value: 'other', label: 'Anders' },
];

const HORIZON_OPTIONS = [
  { value: '0-2', label: '0-2 jaar' },
  { value: '2-5', label: '2-5 jaar' },
  { value: '5-10', label: '5-10 jaar' },
  { value: '10+', label: '10+ jaar' },
];

export function InvestmentProfileStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvestmentProfile>({
    defaultValues: data.investmentProfile || {},
  });

  const selectedRisk = watch('riskTolerance');

  const onSubmit = (formData: InvestmentProfile) => {
    updateData({ investmentProfile: formData });
    nextStep();
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
          <TrendingUp className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Beleggingsprofiel</h2>
        <p className="text-gray-400 text-sm">
          Help ons een geschikt beleggingsprofiel voor u op te stellen
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Wat is uw ervaring met beleggen? *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {EXPERIENCE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  watch('experience') === opt.value
                    ? 'border-primary bg-primary/10'
                    : 'border-dark-border hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register('experience', { required: 'Selecteer uw ervaring' })}
                  className="sr-only"
                />
                <span className="font-medium text-white text-sm">{opt.label}</span>
                <p className="text-xs text-gray-400">{opt.desc}</p>
              </label>
            ))}
          </div>
          {errors.experience && (
            <p className="text-red-400 text-xs mt-1">{errors.experience.message}</p>
          )}
        </div>

        {/* Risk Tolerance */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Wat is uw risicotolerantie? *
          </label>
          <div className="space-y-3">
            {RISK_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedRisk === opt.value
                    ? 'border-primary bg-primary/10'
                    : 'border-dark-border hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register('riskTolerance', { required: 'Selecteer uw risicoprofiel' })}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`font-medium ${opt.color}`}>{opt.label}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                  </div>
                  {selectedRisk === opt.value && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-dark-bg" />
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
          {errors.riskTolerance && (
            <p className="text-red-400 text-xs mt-1">{errors.riskTolerance.message}</p>
          )}
        </div>

        {/* Risk Warning */}
        {selectedRisk === 'aggressive' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300">
                Een agressief risicoprofiel betekent dat u bereid bent grote verliezen te accepteren
                in ruil voor potentieel hogere rendementen. Dit is alleen geschikt voor ervaren beleggers.
              </p>
            </div>
          </div>
        )}

        {/* Investment Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Wat zijn uw beleggingsdoelen? *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {GOAL_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                  watch('investmentGoals')?.includes(opt.value)
                    ? 'border-primary bg-primary/10'
                    : 'border-dark-border hover:border-gray-600'
                }`}
              >
                <input
                  type="checkbox"
                  value={opt.value}
                  {...register('investmentGoals', { required: 'Selecteer minimaal één doel' })}
                  className="sr-only"
                />
                <span className="text-sm text-white">{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.investmentGoals && (
            <p className="text-red-400 text-xs mt-1">{errors.investmentGoals.message}</p>
          )}
        </div>

        {/* Investment Horizon */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Wat is uw beleggingshorizon? *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {HORIZON_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                  watch('investmentHorizon') === opt.value
                    ? 'border-primary bg-primary/10'
                    : 'border-dark-border hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register('investmentHorizon', { required: 'Selecteer uw horizon' })}
                  className="sr-only"
                />
                <span className="text-sm text-white">{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.investmentHorizon && (
            <p className="text-red-400 text-xs mt-1">{errors.investmentHorizon.message}</p>
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
