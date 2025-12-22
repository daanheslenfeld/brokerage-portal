import type { OnboardingData, RiskAssessment, RiskFactor } from '../types';

// Risk scoring weights
const WEIGHTS = {
  PEP: 30,
  US_PERSON: 15,
  HIGH_RISK_COUNTRY: 25,
  SOURCE_OF_FUNDS: 20,
  INVESTMENT_AMOUNT: 15,
  AGE: 5,
  EXPERIENCE: 10,
};

// High risk countries (simplified list - in production use official EU/FATF lists)
const HIGH_RISK_COUNTRIES = [
  'Afghanistan', 'Iran', 'North Korea', 'Syria', 'Yemen',
  'Myanmar', 'Russia', 'Belarus', 'Venezuela', 'Zimbabwe'
];

const MEDIUM_RISK_COUNTRIES = [
  'United Arab Emirates', 'Saudi Arabia', 'Turkey', 'China',
  'India', 'Brazil', 'South Africa', 'Nigeria'
];

// High risk sources of funds
const HIGH_RISK_SOURCES = ['inheritance', 'crypto', 'gambling', 'gift'];
const MEDIUM_RISK_SOURCES = ['business', 'investments', 'real_estate'];

export function calculateRiskScore(data: Partial<OnboardingData>): RiskAssessment {
  const factors: RiskFactor[] = [];
  let totalScore = 0;

  // 1. PEP Check (highest risk factor)
  if (data.taxStatus?.isPEP) {
    factors.push({
      category: 'PEP Status',
      score: 40,
      description: 'Klant is een Politically Exposed Person',
      weight: WEIGHTS.PEP,
    });
    totalScore += 40;
  } else {
    factors.push({
      category: 'PEP Status',
      score: 0,
      description: 'Geen PEP status',
      weight: WEIGHTS.PEP,
    });
  }

  // 2. US Person Check (FATCA compliance)
  if (data.taxStatus?.isUSPerson) {
    factors.push({
      category: 'US Person',
      score: 25,
      description: 'Klant is US Person (FATCA verplichting)',
      weight: WEIGHTS.US_PERSON,
    });
    totalScore += 25;
  } else {
    factors.push({
      category: 'US Person',
      score: 0,
      description: 'Geen US Person',
      weight: WEIGHTS.US_PERSON,
    });
  }

  // 3. Country Risk (nationality + tax countries)
  const allCountries = [
    data.personalData?.nationality,
    data.addressData?.country,
    ...(data.taxStatus?.taxCountries?.map(tc => tc.country) || [])
  ].filter(Boolean) as string[];

  const hasHighRiskCountry = allCountries.some(c =>
    HIGH_RISK_COUNTRIES.some(hr => c.toLowerCase().includes(hr.toLowerCase()))
  );
  const hasMediumRiskCountry = allCountries.some(c =>
    MEDIUM_RISK_COUNTRIES.some(mr => c.toLowerCase().includes(mr.toLowerCase()))
  );

  if (hasHighRiskCountry) {
    factors.push({
      category: 'Land Risico',
      score: 35,
      description: 'Connectie met hoog-risico land',
      weight: WEIGHTS.HIGH_RISK_COUNTRY,
    });
    totalScore += 35;
  } else if (hasMediumRiskCountry) {
    factors.push({
      category: 'Land Risico',
      score: 15,
      description: 'Connectie met medium-risico land',
      weight: WEIGHTS.HIGH_RISK_COUNTRY,
    });
    totalScore += 15;
  } else {
    factors.push({
      category: 'Land Risico',
      score: 0,
      description: 'Alleen laag-risico landen',
      weight: WEIGHTS.HIGH_RISK_COUNTRY,
    });
  }

  // 4. Source of Funds Risk
  const primarySource = data.sourceOfFunds?.primarySource?.toLowerCase() || '';
  const isHighRiskSource = HIGH_RISK_SOURCES.some(s => primarySource.includes(s));
  const isMediumRiskSource = MEDIUM_RISK_SOURCES.some(s => primarySource.includes(s));

  if (isHighRiskSource) {
    factors.push({
      category: 'Bron van Vermogen',
      score: 30,
      description: `Hoog-risico bron: ${data.sourceOfFunds?.primarySource}`,
      weight: WEIGHTS.SOURCE_OF_FUNDS,
    });
    totalScore += 30;
  } else if (isMediumRiskSource) {
    factors.push({
      category: 'Bron van Vermogen',
      score: 10,
      description: `Medium-risico bron: ${data.sourceOfFunds?.primarySource}`,
      weight: WEIGHTS.SOURCE_OF_FUNDS,
    });
    totalScore += 10;
  } else {
    factors.push({
      category: 'Bron van Vermogen',
      score: 0,
      description: 'Laag-risico bron (salaris/pensioen)',
      weight: WEIGHTS.SOURCE_OF_FUNDS,
    });
  }

  // 5. Investment Amount Risk
  const expectedInvestment = data.sourceOfFunds?.expectedInvestment || '';
  let investmentScore = 0;

  if (expectedInvestment.includes('100000') || expectedInvestment.includes('100.000') ||
      expectedInvestment.includes('>') || expectedInvestment.toLowerCase().includes('meer')) {
    investmentScore = 20;
    factors.push({
      category: 'Investeringsbedrag',
      score: 20,
      description: 'Hoog investeringsbedrag (>€100.000)',
      weight: WEIGHTS.INVESTMENT_AMOUNT,
    });
  } else if (expectedInvestment.includes('50000') || expectedInvestment.includes('50.000')) {
    investmentScore = 10;
    factors.push({
      category: 'Investeringsbedrag',
      score: 10,
      description: 'Medium investeringsbedrag (€50.000-€100.000)',
      weight: WEIGHTS.INVESTMENT_AMOUNT,
    });
  } else {
    factors.push({
      category: 'Investeringsbedrag',
      score: 0,
      description: 'Standaard investeringsbedrag (<€50.000)',
      weight: WEIGHTS.INVESTMENT_AMOUNT,
    });
  }
  totalScore += investmentScore;

  // 6. Experience Level (lower experience = slightly higher risk for suitability)
  const experience = data.investmentProfile?.experience || '';
  if (experience === 'none') {
    factors.push({
      category: 'Ervaring',
      score: 5,
      description: 'Geen beleggingservaring',
      weight: WEIGHTS.EXPERIENCE,
    });
    totalScore += 5;
  } else {
    factors.push({
      category: 'Ervaring',
      score: 0,
      description: 'Heeft beleggingservaring',
      weight: WEIGHTS.EXPERIENCE,
    });
  }

  // Calculate risk level
  let riskLevel: 'low' | 'medium' | 'high';
  let requiresManualReview = false;
  let autoApproved = false;

  if (totalScore >= 50) {
    riskLevel = 'high';
    requiresManualReview = false; // We'll ask for enhanced due diligence instead
  } else if (totalScore >= 25) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
    autoApproved = true;
  }

  // PEP always requires extra verification regardless of score
  if (data.taxStatus?.isPEP) {
    riskLevel = 'high';
  }

  return {
    overallScore: totalScore,
    riskLevel,
    factors,
    requiresManualReview,
    autoApproved,
  };
}

export function getRiskColor(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low': return 'text-green-400';
    case 'medium': return 'text-amber-400';
    case 'high': return 'text-red-400';
  }
}

export function getRiskBgColor(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low': return 'bg-green-500/10 border-green-500/30';
    case 'medium': return 'bg-amber-500/10 border-amber-500/30';
    case 'high': return 'bg-red-500/10 border-red-500/30';
  }
}

export function getRiskLabel(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low': return 'Laag Risico';
    case 'medium': return 'Medium Risico';
    case 'high': return 'Hoog Risico';
  }
}
