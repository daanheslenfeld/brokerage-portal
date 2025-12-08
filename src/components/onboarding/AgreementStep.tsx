import React from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, FileText, Check, ExternalLink } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import type { AgreementData } from '../../types';

export function AgreementStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AgreementData>({
    defaultValues: data.agreement || {
      termsAccepted: false,
      privacyAccepted: false,
      investmentAgreementAccepted: false,
      marketingOptIn: false,
    },
  });

  const termsAccepted = watch('termsAccepted');
  const privacyAccepted = watch('privacyAccepted');
  const investmentAccepted = watch('investmentAgreementAccepted');

  const allRequired = termsAccepted && privacyAccepted && investmentAccepted;

  const onSubmit = (formData: AgreementData) => {
    updateData({
      agreement: {
        ...formData,
        signedAt: new Date().toISOString(),
      },
    });
    nextStep();
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
          <FileText className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Overeenkomsten</h2>
        <p className="text-gray-400 text-sm">
          Lees en accepteer de voorwaarden om door te gaan
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Terms and Conditions */}
        <label
          className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
            termsAccepted ? 'border-primary bg-primary/10' : 'border-dark-border hover:border-gray-600'
          }`}
        >
          <div className="flex items-start">
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
              termsAccepted ? 'bg-primary border-primary' : 'border-gray-500'
            }`}>
              {termsAccepted && <Check className="w-4 h-4 text-dark-bg" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">Algemene Voorwaarden *</span>
                <a
                  href="#"
                  className="text-primary hover:text-primary-dark flex items-center text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Lezen
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Ik heb de algemene voorwaarden gelezen en ga hiermee akkoord.
              </p>
              <input
                type="checkbox"
                {...register('termsAccepted', { required: true })}
                className="sr-only"
              />
            </div>
          </div>
        </label>

        {/* Privacy Policy */}
        <label
          className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
            privacyAccepted ? 'border-primary bg-primary/10' : 'border-dark-border hover:border-gray-600'
          }`}
        >
          <div className="flex items-start">
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
              privacyAccepted ? 'bg-primary border-primary' : 'border-gray-500'
            }`}>
              {privacyAccepted && <Check className="w-4 h-4 text-dark-bg" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">Privacyverklaring *</span>
                <a
                  href="#"
                  className="text-primary hover:text-primary-dark flex items-center text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Lezen
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Ik ga akkoord met de verwerking van mijn persoonsgegevens conform het privacybeleid.
              </p>
              <input
                type="checkbox"
                {...register('privacyAccepted', { required: true })}
                className="sr-only"
              />
            </div>
          </div>
        </label>

        {/* Investment Agreement */}
        <label
          className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
            investmentAccepted ? 'border-primary bg-primary/10' : 'border-dark-border hover:border-gray-600'
          }`}
        >
          <div className="flex items-start">
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
              investmentAccepted ? 'bg-primary border-primary' : 'border-gray-500'
            }`}>
              {investmentAccepted && <Check className="w-4 h-4 text-dark-bg" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">Beleggingsvoorwaarden *</span>
                <a
                  href="#"
                  className="text-primary hover:text-primary-dark flex items-center text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Lezen
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Ik begrijp dat beleggen risico's met zich meebrengt en dat ik mijn inleg kan verliezen.
              </p>
              <input
                type="checkbox"
                {...register('investmentAgreementAccepted', { required: true })}
                className="sr-only"
              />
            </div>
          </div>
        </label>

        {/* Marketing Opt-in (optional) */}
        <label
          className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
            watch('marketingOptIn') ? 'border-primary bg-primary/10' : 'border-dark-border hover:border-gray-600'
          }`}
        >
          <div className="flex items-start">
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
              watch('marketingOptIn') ? 'bg-primary border-primary' : 'border-gray-500'
            }`}>
              {watch('marketingOptIn') && <Check className="w-4 h-4 text-dark-bg" />}
            </div>
            <div className="flex-1">
              <span className="font-medium text-white">Nieuwsbrief & Updates</span>
              <p className="text-sm text-gray-400 mt-1">
                Ik wil graag nieuws en updates ontvangen over beleggingen en productverbeteringen.
              </p>
              <input
                type="checkbox"
                {...register('marketingOptIn')}
                className="sr-only"
              />
            </div>
          </div>
        </label>

        {/* Error message */}
        {(errors.termsAccepted || errors.privacyAccepted || errors.investmentAgreementAccepted) && (
          <p className="text-red-400 text-sm text-center">
            Je moet alle verplichte voorwaarden accepteren om door te gaan.
          </p>
        )}

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
            disabled={!allRequired}
            className="flex-1 py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verder
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
}
