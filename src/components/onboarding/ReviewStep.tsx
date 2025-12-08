import React, { useState } from 'react';
import { ArrowLeft, Check, ClipboardCheck, Edit2, Loader2 } from 'lucide-react';
import { useOnboarding, OnboardingStep } from '../../context/OnboardingContext';

export function ReviewStep() {
  const { data, prevStep, goToStep, submitOnboarding, isLoading } = useOnboarding();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitOnboarding();
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderSection = (title: string, content: React.ReactNode, editStep: OnboardingStep) => (
    <div className="bg-dark-surface rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-white">{title}</h3>
        <button
          onClick={() => goToStep(editStep)}
          className="text-primary hover:text-primary-dark flex items-center text-sm"
        >
          <Edit2 className="w-4 h-4 mr-1" />
          Wijzigen
        </button>
      </div>
      <div className="text-gray-400 text-sm space-y-1">{content}</div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
          <ClipboardCheck className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Controleer je gegevens</h2>
        <p className="text-gray-400 text-sm">
          Controleer of alle gegevens correct zijn voordat je je aanvraag indient
        </p>
      </div>

      {/* Personal Data */}
      {data.personalData &&
        renderSection(
          'Persoonlijke Gegevens',
          <>
            <p>
              <span className="text-gray-500">Naam:</span>{' '}
              {data.personalData.firstName} {data.personalData.lastName}
            </p>
            <p>
              <span className="text-gray-500">Geboortedatum:</span>{' '}
              {data.personalData.dateOfBirth}
            </p>
            <p>
              <span className="text-gray-500">E-mail:</span> {data.personalData.email}
            </p>
            <p>
              <span className="text-gray-500">Telefoon:</span> {data.personalData.phone}
            </p>
          </>,
          OnboardingStep.PERSONAL_DATA
        )}

      {/* Address */}
      {data.addressData &&
        renderSection(
          'Adres',
          <>
            <p>
              {data.addressData.street} {data.addressData.houseNumber}
              {data.addressData.houseNumberAddition}
            </p>
            <p>
              {data.addressData.postalCode} {data.addressData.city}
            </p>
            <p>{data.addressData.country}</p>
          </>,
          OnboardingStep.ADDRESS
        )}

      {/* Tax Status */}
      {data.taxStatus &&
        renderSection(
          'Belastingstatus',
          <>
            <p>
              <span className="text-gray-500">PEP:</span>{' '}
              {data.taxStatus.isPEP ? 'Ja' : 'Nee'}
            </p>
            <p>
              <span className="text-gray-500">US Person:</span>{' '}
              {data.taxStatus.isUSPerson ? 'Ja' : 'Nee'}
            </p>
            <p>
              <span className="text-gray-500">Belastinglanden:</span>{' '}
              {data.taxStatus.taxCountries?.map((c) => c.country).join(', ')}
            </p>
          </>,
          OnboardingStep.TAX_STATUS
        )}

      {/* Source of Funds */}
      {data.sourceOfFunds &&
        renderSection(
          'Bron van Vermogen',
          <>
            <p>
              <span className="text-gray-500">Primaire bron:</span>{' '}
              {data.sourceOfFunds.primarySource}
            </p>
            <p>
              <span className="text-gray-500">Jaarlijks inkomen:</span>{' '}
              {data.sourceOfFunds.monthlyIncome}
            </p>
            <p>
              <span className="text-gray-500">Verwachte investering:</span>{' '}
              {data.sourceOfFunds.expectedInvestment}
            </p>
          </>,
          OnboardingStep.SOURCE_OF_FUNDS
        )}

      {/* Investment Profile */}
      {data.investmentProfile &&
        renderSection(
          'Beleggingsprofiel',
          <>
            <p>
              <span className="text-gray-500">Ervaring:</span>{' '}
              {data.investmentProfile.experience}
            </p>
            <p>
              <span className="text-gray-500">Risicotolerantie:</span>{' '}
              {data.investmentProfile.riskTolerance}
            </p>
            <p>
              <span className="text-gray-500">Horizon:</span>{' '}
              {data.investmentProfile.investmentHorizon}
            </p>
          </>,
          OnboardingStep.INVESTMENT_PROFILE
        )}

      {/* Agreement Confirmation */}
      {data.agreement && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white font-medium">Voorwaarden geaccepteerd</p>
              <p className="text-sm text-gray-400 mt-1">
                Je hebt de algemene voorwaarden, privacyverklaring en beleggingsvoorwaarden geaccepteerd.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={prevStep}
          disabled={isLoading || submitting}
          className="flex-1 py-3 border border-dark-border text-gray-300 rounded-lg hover:border-gray-600 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Terug
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || submitting}
          className="flex-1 py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Indienen...
            </>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Aanvraag Indienen
            </>
          )}
        </button>
      </div>
    </div>
  );
}
