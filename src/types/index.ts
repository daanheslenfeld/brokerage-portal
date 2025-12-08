// User types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  accountType: 'free' | 'paid';
  role: 'customer' | 'admin' | 'accountmanager';
  onboardingCompleted: boolean;
  onboardingApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Account types
export type AccountType = 'particulier' | 'zakelijk';

// Onboarding types
export interface OnboardingData {
  // Step 1: Account type
  accountType: AccountType;

  // Step 2: Personal data
  personalData: PersonalData;

  // Step 3: Business data (only for zakelijk)
  businessData?: BusinessData;

  // Step 4: Address
  addressData: AddressData;

  // Step 5: ID Document
  idDocument: DocumentData;

  // Step 6: Address Proof
  addressProof: DocumentData;

  // Step 7: Tax Status
  taxStatus: TaxStatus;

  // Step 8: Source of Funds
  sourceOfFunds: SourceOfFunds;

  // Step 9: Investment Profile
  investmentProfile: InvestmentProfile;

  // Step 10: Bank Account
  bankAccount: BankAccountData;

  // Step 11: Agreement
  agreement: AgreementData;
}

export interface PersonalData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  phone: string;
  email: string;
}

export interface BusinessData {
  companyName: string;
  kvkNumber: string;
  vatNumber?: string;
  legalForm: string;
  incorporationDate: string;
  industry: string;
}

export interface AddressData {
  street: string;
  houseNumber: string;
  houseNumberAddition?: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface DocumentData {
  type: string;
  file?: File;
  uploadedAt?: string;
  status: 'pending' | 'verified' | 'rejected';
  ocrResult?: Record<string, unknown>;
}

export interface TaxStatus {
  isPEP: boolean;
  pepDetails?: string;
  isUSPerson: boolean;
  usTin?: string;
  taxCountries: TaxCountry[];
}

export interface TaxCountry {
  country: string;
  tin: string;
}

export interface SourceOfFunds {
  primarySource: string;
  monthlyIncome: string;
  netWorth: string;
  expectedInvestment: string;
  fundingSource: string;
}

export interface InvestmentProfile {
  experience: string;
  riskTolerance: string;
  investmentGoals: string[];
  investmentHorizon: string;
  knowledgeLevel: string;
}

export interface BankAccountData {
  iban: string;
  accountHolder: string;
  verified: boolean;
}

export interface AgreementData {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  investmentAgreementAccepted: boolean;
  marketingOptIn: boolean;
  signedAt?: string;
}

// Risk Assessment
export interface RiskAssessment {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: RiskFactor[];
  requiresManualReview: boolean;
  autoApproved: boolean;
}

export interface RiskFactor {
  category: string;
  score: number;
  description: string;
  weight: number;
}

// Portfolio types
export interface ETF {
  isin: string;
  name: string;
  category: string;
  subcategory: string;
  currency: string;
  ter: string;
  ytd: string;
  volatility: string;
  fundSize: string;
  holdings: string;
  distribution: 'Accumulating' | 'Distributing';
  replication: string;
}

export interface PortfolioHolding {
  etf: ETF;
  shares: number;
  value: number;
  weight: number;
  costBasis: number;
  return: number;
  returnPercentage: number;
}

export interface Portfolio {
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  totalReturnPercentage: number;
  holdings: PortfolioHolding[];
  lastUpdated: string;
}

// Transaction types
export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'dividend' | 'deposit' | 'withdrawal';
  etf?: ETF;
  shares?: number;
  amount: number;
  price?: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

// Admin types
export interface CustomerReview {
  id: string;
  customer: User;
  onboardingData: OnboardingData;
  riskAssessment: RiskAssessment;
  status: 'pending' | 'approved' | 'rejected' | 'info_requested';
  priority: 'low' | 'medium' | 'high';
  reviewReason: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  notes: ReviewNote[];
}

export interface ReviewNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}
