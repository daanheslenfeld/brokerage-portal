// Mock data for Admin Portal

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'accountmanager';
  status: 'active' | 'pending' | 'suspended';
  onboardingStatus: 'not_started' | 'in_progress' | 'completed' | 'rejected';
  createdAt: string;
  lastLogin: string | null;
  portfolioValue: number;
  accountType: 'individual' | 'business';
  riskProfile: 'conservative' | 'balanced' | 'aggressive' | null;
}

export interface OnboardingApplication {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'individual' | 'business';
  status: 'pending_review' | 'documents_required' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  riskScore: number;
  documents: {
    type: string;
    status: 'uploaded' | 'verified' | 'rejected';
    uploadedAt: string;
  }[];
  flags: string[];
  notes: string[];
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingOnboarding: number;
  totalAUM: number;
  newUsersThisMonth: number;
  completedOnboardingThisMonth: number;
  averageOnboardingTime: number;
  conversionRate: number;
}

export const MOCK_USERS: AdminUser[] = [
  {
    id: '1',
    email: 'jan.devries@email.nl',
    firstName: 'Jan',
    lastName: 'de Vries',
    role: 'user',
    status: 'active',
    onboardingStatus: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-12-08T14:22:00Z',
    portfolioValue: 45000,
    accountType: 'individual',
    riskProfile: 'balanced',
  },
  {
    id: '2',
    email: 'maria.bakker@email.nl',
    firstName: 'Maria',
    lastName: 'Bakker',
    role: 'user',
    status: 'active',
    onboardingStatus: 'completed',
    createdAt: '2024-02-20T09:15:00Z',
    lastLogin: '2024-12-09T08:45:00Z',
    portfolioValue: 125000,
    accountType: 'individual',
    riskProfile: 'aggressive',
  },
  {
    id: '3',
    email: 'pieter.jansen@company.nl',
    firstName: 'Pieter',
    lastName: 'Jansen',
    role: 'user',
    status: 'active',
    onboardingStatus: 'in_progress',
    createdAt: '2024-11-01T14:00:00Z',
    lastLogin: '2024-12-07T16:30:00Z',
    portfolioValue: 0,
    accountType: 'business',
    riskProfile: null,
  },
  {
    id: '4',
    email: 'anna.smit@email.nl',
    firstName: 'Anna',
    lastName: 'Smit',
    role: 'user',
    status: 'pending',
    onboardingStatus: 'in_progress',
    createdAt: '2024-12-01T11:20:00Z',
    lastLogin: '2024-12-05T13:15:00Z',
    portfolioValue: 0,
    accountType: 'individual',
    riskProfile: 'conservative',
  },
  {
    id: '5',
    email: 'robert.meijer@email.nl',
    firstName: 'Robert',
    lastName: 'Meijer',
    role: 'user',
    status: 'suspended',
    onboardingStatus: 'rejected',
    createdAt: '2024-06-10T08:00:00Z',
    lastLogin: '2024-08-15T10:00:00Z',
    portfolioValue: 0,
    accountType: 'individual',
    riskProfile: null,
  },
  {
    id: '6',
    email: 'lisa.visser@business.nl',
    firstName: 'Lisa',
    lastName: 'Visser',
    role: 'user',
    status: 'active',
    onboardingStatus: 'completed',
    createdAt: '2024-03-05T16:45:00Z',
    lastLogin: '2024-12-08T09:00:00Z',
    portfolioValue: 75000,
    accountType: 'business',
    riskProfile: 'balanced',
  },
  {
    id: '7',
    email: 'koen.degraaf@email.nl',
    firstName: 'Koen',
    lastName: 'de Graaf',
    role: 'accountmanager',
    status: 'active',
    onboardingStatus: 'completed',
    createdAt: '2023-06-01T09:00:00Z',
    lastLogin: '2024-12-09T08:00:00Z',
    portfolioValue: 0,
    accountType: 'individual',
    riskProfile: null,
  },
  {
    id: '8',
    email: 'emma.vandijk@email.nl',
    firstName: 'Emma',
    lastName: 'van Dijk',
    role: 'user',
    status: 'active',
    onboardingStatus: 'not_started',
    createdAt: '2024-12-08T20:30:00Z',
    lastLogin: null,
    portfolioValue: 0,
    accountType: 'individual',
    riskProfile: null,
  },
  {
    id: '9',
    email: 'thomas.peters@email.nl',
    firstName: 'Thomas',
    lastName: 'Peters',
    role: 'user',
    status: 'active',
    onboardingStatus: 'completed',
    createdAt: '2024-04-12T13:30:00Z',
    lastLogin: '2024-12-06T17:45:00Z',
    portfolioValue: 32000,
    accountType: 'individual',
    riskProfile: 'conservative',
  },
  {
    id: '10',
    email: 'sophie.vanderberg@email.nl',
    firstName: 'Sophie',
    lastName: 'van der Berg',
    role: 'user',
    status: 'pending',
    onboardingStatus: 'in_progress',
    createdAt: '2024-12-05T10:00:00Z',
    lastLogin: '2024-12-09T07:30:00Z',
    portfolioValue: 0,
    accountType: 'individual',
    riskProfile: 'aggressive',
  },
];

export const MOCK_ONBOARDING_APPLICATIONS: OnboardingApplication[] = [
  {
    id: 'app-1',
    userId: '3',
    firstName: 'Pieter',
    lastName: 'Jansen',
    email: 'pieter.jansen@company.nl',
    accountType: 'business',
    status: 'pending_review',
    submittedAt: '2024-12-07T16:30:00Z',
    reviewedAt: null,
    reviewedBy: null,
    riskScore: 65,
    documents: [
      { type: 'ID Document', status: 'verified', uploadedAt: '2024-12-05T14:00:00Z' },
      { type: 'Adresbewijs', status: 'verified', uploadedAt: '2024-12-05T14:05:00Z' },
      { type: 'KvK Uittreksel', status: 'uploaded', uploadedAt: '2024-12-06T10:00:00Z' },
      { type: 'UBO Verklaring', status: 'uploaded', uploadedAt: '2024-12-07T16:30:00Z' },
    ],
    flags: ['Business account', 'Hoge investering gepland'],
    notes: [],
  },
  {
    id: 'app-2',
    userId: '4',
    firstName: 'Anna',
    lastName: 'Smit',
    email: 'anna.smit@email.nl',
    accountType: 'individual',
    status: 'documents_required',
    submittedAt: '2024-12-03T11:20:00Z',
    reviewedAt: '2024-12-04T09:00:00Z',
    reviewedBy: 'Koen de Graaf',
    riskScore: 25,
    documents: [
      { type: 'ID Document', status: 'verified', uploadedAt: '2024-12-01T11:25:00Z' },
      { type: 'Adresbewijs', status: 'rejected', uploadedAt: '2024-12-02T08:00:00Z' },
    ],
    flags: [],
    notes: ['Adresbewijs is verlopen, nieuw document aangevraagd'],
  },
  {
    id: 'app-3',
    userId: '10',
    firstName: 'Sophie',
    lastName: 'van der Berg',
    email: 'sophie.vanderberg@email.nl',
    accountType: 'individual',
    status: 'pending_review',
    submittedAt: '2024-12-08T15:00:00Z',
    reviewedAt: null,
    reviewedBy: null,
    riskScore: 45,
    documents: [
      { type: 'ID Document', status: 'uploaded', uploadedAt: '2024-12-08T14:50:00Z' },
      { type: 'Adresbewijs', status: 'uploaded', uploadedAt: '2024-12-08T14:55:00Z' },
      { type: 'Bron van Vermogen', status: 'uploaded', uploadedAt: '2024-12-08T15:00:00Z' },
    ],
    flags: ['PEP check vereist'],
    notes: [],
  },
  {
    id: 'app-4',
    userId: '5',
    firstName: 'Robert',
    lastName: 'Meijer',
    email: 'robert.meijer@email.nl',
    accountType: 'individual',
    status: 'rejected',
    submittedAt: '2024-07-15T10:00:00Z',
    reviewedAt: '2024-07-20T14:30:00Z',
    reviewedBy: 'Koen de Graaf',
    riskScore: 95,
    documents: [
      { type: 'ID Document', status: 'rejected', uploadedAt: '2024-07-14T09:00:00Z' },
      { type: 'Adresbewijs', status: 'rejected', uploadedAt: '2024-07-14T09:05:00Z' },
    ],
    flags: ['Verdachte documenten', 'Sanctielijst match'],
    notes: [
      'Documenten lijken gemanipuleerd',
      'Naam komt voor op sanctielijst - verificatie vereist',
      'Aanvraag afgewezen na compliance review',
    ],
  },
];

export const MOCK_ADMIN_STATS: AdminStats = {
  totalUsers: 156,
  activeUsers: 124,
  pendingOnboarding: 12,
  totalAUM: 4250000,
  newUsersThisMonth: 23,
  completedOnboardingThisMonth: 18,
  averageOnboardingTime: 3.5,
  conversionRate: 78,
};

// Activity log for dashboard
export interface ActivityLogItem {
  id: string;
  type: 'user_registered' | 'onboarding_completed' | 'onboarding_started' | 'document_uploaded' | 'application_approved' | 'application_rejected' | 'deposit' | 'withdrawal';
  userId: string;
  userName: string;
  description: string;
  timestamp: string;
}

export const MOCK_ACTIVITY_LOG: ActivityLogItem[] = [
  {
    id: 'act-1',
    type: 'user_registered',
    userId: '8',
    userName: 'Emma van Dijk',
    description: 'Nieuwe gebruiker geregistreerd',
    timestamp: '2024-12-08T20:30:00Z',
  },
  {
    id: 'act-2',
    type: 'document_uploaded',
    userId: '10',
    userName: 'Sophie van der Berg',
    description: 'Bron van Vermogen document geüpload',
    timestamp: '2024-12-08T15:00:00Z',
  },
  {
    id: 'act-3',
    type: 'onboarding_completed',
    userId: '6',
    userName: 'Lisa Visser',
    description: 'Onboarding voltooid en goedgekeurd',
    timestamp: '2024-12-07T11:30:00Z',
  },
  {
    id: 'act-4',
    type: 'deposit',
    userId: '2',
    userName: 'Maria Bakker',
    description: 'Storting van €5.000 ontvangen',
    timestamp: '2024-12-07T09:15:00Z',
  },
  {
    id: 'act-5',
    type: 'document_uploaded',
    userId: '3',
    userName: 'Pieter Jansen',
    description: 'UBO Verklaring geüpload',
    timestamp: '2024-12-07T16:30:00Z',
  },
  {
    id: 'act-6',
    type: 'onboarding_started',
    userId: '10',
    userName: 'Sophie van der Berg',
    description: 'Onboarding proces gestart',
    timestamp: '2024-12-05T10:00:00Z',
  },
  {
    id: 'act-7',
    type: 'withdrawal',
    userId: '1',
    userName: 'Jan de Vries',
    description: 'Opname van €2.500 verwerkt',
    timestamp: '2024-12-06T14:00:00Z',
  },
  {
    id: 'act-8',
    type: 'application_rejected',
    userId: '5',
    userName: 'Robert Meijer',
    description: 'Onboarding aanvraag afgewezen',
    timestamp: '2024-07-20T14:30:00Z',
  },
];
