import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { OnboardingProvider, useOnboarding, OnboardingStep } from '../../context/OnboardingContext';

// Step components
import { AccountTypeStep } from '../../components/onboarding/AccountTypeStep';
import { PersonalDataStep } from '../../components/onboarding/PersonalDataStep';
import { AddressStep } from '../../components/onboarding/AddressStep';
import { IDVerificationStep } from '../../components/onboarding/IDVerificationStep';
import { AddressProofStep } from '../../components/onboarding/AddressProofStep';
import { TaxStatusStep } from '../../components/onboarding/TaxStatusStep';
import { SourceOfFundsStep } from '../../components/onboarding/SourceOfFundsStep';
import { InvestmentProfileStep } from '../../components/onboarding/InvestmentProfileStep';
import { BankAccountStep } from '../../components/onboarding/BankAccountStep';
import { AgreementStep } from '../../components/onboarding/AgreementStep';
import { ReviewStep } from '../../components/onboarding/ReviewStep';
import { CompletedStep } from '../../components/onboarding/CompletedStep';

const STEP_NAMES: Record<OnboardingStep, string> = {
  [OnboardingStep.ACCOUNT_TYPE]: 'Account Type',
  [OnboardingStep.PERSONAL_DATA]: 'Persoonlijke Gegevens',
  [OnboardingStep.BUSINESS_DATA]: 'Bedrijfsgegevens',
  [OnboardingStep.ADDRESS]: 'Adres',
  [OnboardingStep.ID_VERIFICATION]: 'ID Verificatie',
  [OnboardingStep.ADDRESS_PROOF]: 'Adresbewijs',
  [OnboardingStep.TAX_STATUS]: 'Belastingstatus',
  [OnboardingStep.SOURCE_OF_FUNDS]: 'Bron van Vermogen',
  [OnboardingStep.INVESTMENT_PROFILE]: 'Beleggingsprofiel',
  [OnboardingStep.BANK_ACCOUNT]: 'Bankrekening',
  [OnboardingStep.AGREEMENT]: 'Overeenkomst',
  [OnboardingStep.REVIEW]: 'Controle',
  [OnboardingStep.COMPLETED]: 'Voltooid',
};

function OnboardingContent() {
  const { currentStep, getProgress, getSteps } = useOnboarding();
  const progress = getProgress();
  const steps = getSteps();
  const navigate = useNavigate();

  // Render current step component
  const renderStep = () => {
    switch (currentStep) {
      case OnboardingStep.ACCOUNT_TYPE:
        return <AccountTypeStep />;
      case OnboardingStep.PERSONAL_DATA:
        return <PersonalDataStep />;
      case OnboardingStep.ADDRESS:
        return <AddressStep />;
      case OnboardingStep.ID_VERIFICATION:
        return <IDVerificationStep />;
      case OnboardingStep.ADDRESS_PROOF:
        return <AddressProofStep />;
      case OnboardingStep.TAX_STATUS:
        return <TaxStatusStep />;
      case OnboardingStep.SOURCE_OF_FUNDS:
        return <SourceOfFundsStep />;
      case OnboardingStep.INVESTMENT_PROFILE:
        return <InvestmentProfileStep />;
      case OnboardingStep.BANK_ACCOUNT:
        return <BankAccountStep />;
      case OnboardingStep.AGREEMENT:
        return <AgreementStep />;
      case OnboardingStep.REVIEW:
        return <ReviewStep />;
      case OnboardingStep.COMPLETED:
        return <CompletedStep />;
      // Placeholder for unimplemented steps
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-white mb-2">
              {STEP_NAMES[currentStep]}
            </h2>
            <p className="text-gray-400">Deze stap wordt nog geïmplementeerd.</p>
          </div>
        );
    }
  };

  if (currentStep === OnboardingStep.COMPLETED) {
    return <CompletedStep />;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-dark-card border-b border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-400 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Opslaan & Later verder
            </button>
            <Link to="/" className="flex items-center">
              <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
                <path
                  d="M 12 20 Q 12 14 18 14 L 30 14 Q 36 14 36 20 L 36 28 Q 36 34 30 34 L 18 34 Q 12 34 12 28 Z"
                  fill="#28EBCF"
                />
              </svg>
            </Link>
            <div className="w-40" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-dark-card border-b border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Voortgang</span>
            <span className="text-sm text-primary font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-dark-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step indicators (desktop) */}
        <div className="hidden md:block max-w-4xl mx-auto px-4 pb-4">
          <div className="flex justify-between">
            {steps.slice(0, -1).map((step, index) => {
              const isActive = step === currentStep;
              const isCompleted = steps.indexOf(currentStep) > index;

              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      isCompleted
                        ? 'bg-primary text-dark-bg'
                        : isActive
                        ? 'bg-primary/20 text-primary border-2 border-primary'
                        : 'bg-dark-border text-gray-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      isActive ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    {STEP_NAMES[step].split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 md:p-8">
          {renderStep()}
        </div>
      </main>
    </div>
  );
}

export function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
}
