import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import type { OnboardingData, AccountType, RiskAssessment, ComplianceResult } from '../types';
import { calculateRiskScore } from '../utils/riskAssessment';
import { submitOnboardingForCompliance, generateCustomerId } from '../services/compliance';

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
  ENHANCED_DUE_DILIGENCE = 'enhanced_due_diligence',
  AGREEMENT = 'agreement',
  REVIEW = 'review',
  COMPLETED = 'completed',
}

// Steps for individual vs business
// Full automated KYC/CDD flow
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
  riskAssessment: RiskAssessment | null;
  complianceResult: ComplianceResult | null;
  customerId: string | null;
  setAccountType: (type: AccountType) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  updateData: (stepData: Partial<OnboardingData>) => void;
  submitOnboarding: () => Promise<void>;
  getProgress: () => number;
  getSteps: () => OnboardingStep[];
  calculateRisk: () => RiskAssessment;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.ACCOUNT_TYPE);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [accountType, setAccountTypeState] = useState<AccountType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [complianceResult, setComplianceResult] = useState<ComplianceResult | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);

  // Ref to track if compliance check has been done (prevents double calls)
  const complianceCheckDone = useRef(false);

  const calculateRisk = useCallback((): RiskAssessment => {
    const assessment = calculateRiskScore(data);
    setRiskAssessment(assessment);
    return assessment;
  }, [data]);

  const getSteps = useCallback((): OnboardingStep[] => {
    const baseSteps = accountType === 'zakelijk' ? BUSINESS_STEPS : INDIVIDUAL_STEPS;

    // Calculate risk to determine if EDD step is needed
    const risk = calculateRiskScore(data);

    // Insert EDD step after BANK_ACCOUNT if medium or high risk
    if (risk.riskLevel === 'medium' || risk.riskLevel === 'high') {
      const bankAccountIndex = baseSteps.indexOf(OnboardingStep.BANK_ACCOUNT);
      if (bankAccountIndex !== -1 && !baseSteps.includes(OnboardingStep.ENHANCED_DUE_DILIGENCE)) {
        const stepsWithEDD = [...baseSteps];
        stepsWithEDD.splice(bankAccountIndex + 1, 0, OnboardingStep.ENHANCED_DUE_DILIGENCE);
        return stepsWithEDD;
      }
    }

    return baseSteps;
  }, [accountType, data]);

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
    // Prevent double compliance checks
    if (complianceCheckDone.current) {
      console.warn('Compliance check already performed, skipping duplicate call');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Submitting onboarding data:', data);

      // Generate customer ID if not already set
      let currentCustomerId = customerId;
      if (!currentCustomerId) {
        currentCustomerId = generateCustomerId();
        setCustomerId(currentCustomerId);
      }

      // Submit onboarding data AND get compliance decision in one call
      // Backend determines: LOW_RISK → APPROVED, MEDIUM/HIGH_RISK → MANUAL_REVIEW
      console.log('Submitting onboarding to compliance backend:', currentCustomerId);
      const complianceCheckResult = await submitOnboardingForCompliance(currentCustomerId, data);

      // Mark compliance check as done (prevents duplicate calls)
      complianceCheckDone.current = true;

      // Store the compliance result from backend
      setComplianceResult(complianceCheckResult);

      console.log('Backend compliance decision:', complianceCheckResult);

      // Move to completed step (the CompletedStep will handle the display based on compliance status)
      setCurrentStep(OnboardingStep.COMPLETED);
    } catch (err) {
      console.error('Onboarding submission error:', err);
      setError('Er is een fout opgetreden. Probeer het opnieuw.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [data, customerId]);

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        data,
        accountType,
        isLoading,
        error,
        riskAssessment,
        complianceResult,
        customerId,
        setAccountType,
        nextStep,
        prevStep,
        goToStep,
        updateData,
        submitOnboarding,
        getProgress,
        getSteps,
        calculateRisk,
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
