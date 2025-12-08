import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { OnboardingData, AccountType } from '../types';

// Onboarding steps
export enum OnboardingStep {
  ACCOUNT_TYPE = 'account_type',
  PERSONAL_DATA = 'personal_data',
  BUSINESS_DATA = 'business_data',
  ADDRESS = 'address',
  ID_VERIFICATION = 'id_verification',
  ADDRESS_PROOF = 'address_proof',
  TAX_STATUS = 'tax_status',
  SOURCE_OF_FUNDS = 'source_of_funds',
  INVESTMENT_PROFILE = 'investment_profile',
  BANK_ACCOUNT = 'bank_account',
  AGREEMENT = 'agreement',
  REVIEW = 'review',
  COMPLETED = 'completed',
}

// Steps for individual vs business
export const INDIVIDUAL_STEPS = [
  OnboardingStep.ACCOUNT_TYPE,
  OnboardingStep.PERSONAL_DATA,
  OnboardingStep.ADDRESS,
  OnboardingStep.ID_VERIFICATION,
  OnboardingStep.ADDRESS_PROOF,
  OnboardingStep.TAX_STATUS,
  OnboardingStep.SOURCE_OF_FUNDS,
  OnboardingStep.INVESTMENT_PROFILE,
  OnboardingStep.BANK_ACCOUNT,
  OnboardingStep.AGREEMENT,
  OnboardingStep.REVIEW,
];

export const BUSINESS_STEPS = [
  OnboardingStep.ACCOUNT_TYPE,
  OnboardingStep.BUSINESS_DATA,
  OnboardingStep.PERSONAL_DATA,
  OnboardingStep.ADDRESS,
  OnboardingStep.ID_VERIFICATION,
  OnboardingStep.ADDRESS_PROOF,
  OnboardingStep.TAX_STATUS,
  OnboardingStep.SOURCE_OF_FUNDS,
  OnboardingStep.INVESTMENT_PROFILE,
  OnboardingStep.BANK_ACCOUNT,
  OnboardingStep.AGREEMENT,
  OnboardingStep.REVIEW,
];

interface OnboardingContextType {
  currentStep: OnboardingStep;
  data: Partial<OnboardingData>;
  accountType: AccountType | null;
  isLoading: boolean;
  error: string | null;
  setAccountType: (type: AccountType) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  updateData: (stepData: Partial<OnboardingData>) => void;
  submitOnboarding: () => Promise<void>;
  getProgress: () => number;
  getSteps: () => OnboardingStep[];
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.ACCOUNT_TYPE);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [accountType, setAccountTypeState] = useState<AccountType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSteps = useCallback((): OnboardingStep[] => {
    return accountType === 'zakelijk' ? BUSINESS_STEPS : INDIVIDUAL_STEPS;
  }, [accountType]);

  const setAccountType = useCallback((type: AccountType) => {
    setAccountTypeState(type);
    setData((prev) => ({ ...prev, accountType: type }));
  }, []);

  const nextStep = useCallback(() => {
    const steps = getSteps();
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep, getSteps]);

  const prevStep = useCallback(() => {
    const steps = getSteps();
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep, getSteps]);

  const goToStep = useCallback((step: OnboardingStep) => {
    setCurrentStep(step);
  }, []);

  const updateData = useCallback((stepData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...stepData }));
  }, []);

  const getProgress = useCallback((): number => {
    const steps = getSteps();
    const currentIndex = steps.indexOf(currentStep);
    return Math.round((currentIndex / (steps.length - 1)) * 100);
  }, [currentStep, getSteps]);

  const submitOnboarding = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In production, this would submit to the backend
      console.log('Submitting onboarding data:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Move to completed step
      setCurrentStep(OnboardingStep.COMPLETED);
    } catch (err) {
      setError('Er is een fout opgetreden. Probeer het opnieuw.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        data,
        accountType,
        isLoading,
        error,
        setAccountType,
        nextStep,
        prevStep,
        goToStep,
        updateData,
        submitOnboarding,
        getProgress,
        getSteps,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
