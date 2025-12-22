// Compliance API Service
// Calls the compliance backend to check eligibility and handle manual reviews

import type { OnboardingData } from '../types';

const COMPLIANCE_API_URL = import.meta.env.VITE_COMPLIANCE_API_URL || 'http://127.0.0.1:8001';
const COMPLIANCE_API_KEY = import.meta.env.VITE_COMPLIANCE_API_KEY || 'sk_admin_compliance_2024_xK9mP2vL8nQ4wR6y';

export type ComplianceStatus = 'APPROVED' | 'MANUAL_REVIEW' | 'REJECTED';
export type DecisionType = 'APPROVED' | 'REJECTED';

export interface ComplianceResult {
  status: ComplianceStatus;
  eligible?: boolean;
  reason?: string;
  checked_at: string;
  risk_score?: number;
  risk_level?: string;
}

// Manual Review Types
export interface ManualReviewCustomer {
  id: number;
  external_id: string | null;
  name: string;
  date_of_birth: string;
  nationality: string;
  country_of_residence: string;
  is_pep: boolean;
  source_of_wealth: string;
  created_at: string;
  workflow_status: string;
  review_reason: string | null;
  risk_score: number | null;
  risk_level: number | null;
  submitted_at: string | null;
  submitted_by: string | null;
}

export interface ManualReviewAuditEntry {
  timestamp: string;
  action: string;
  user: string;
  role: string;
  reason: string | null;
  old_status: string | null;
  new_status: string | null;
}

export interface ManualReviewDocument {
  id: number;
  type: string;
  status: string;
  uploaded_at: string | null;
  verified: boolean;
}

export interface ManualReviewScreening {
  id: number;
  type: string;
  result: string;
  status: string;
  screened_at: string | null;
}

export interface ManualReviewListResponse {
  customers: ManualReviewCustomer[];
  total: number;
}

export interface ManualReviewDetailResponse {
  customer: ManualReviewCustomer;
  audit_trail: ManualReviewAuditEntry[];
  documents: ManualReviewDocument[];
  screening_results: ManualReviewScreening[];
}

export interface ManualReviewDecisionRequest {
  decision: DecisionType;
  reason: string;
  reviewer_name: string;
}

export interface ManualReviewDecisionResponse {
  customer_id: number;
  decision: string;
  reason: string;
  reviewer: string;
  decided_at: string;
  previous_status: string;
  new_status: string;
}

// Map frontend source of funds to backend enum
function mapSourceOfWealth(primarySource: string): string {
  const source = primarySource?.toLowerCase() || '';

  // Direct mappings for frontend values
  if (source === 'salary' || source.includes('salaris') || source.includes('loon')) return 'SALARY';
  if (source === 'savings' || source.includes('spaar')) return 'SALARY'; // Savings treated as salary/regular income
  if (source === 'inheritance' || source.includes('erfenis')) return 'INHERITANCE';
  if (source === 'sale_business' || source.includes('bedrijf') || source.includes('business') || source.includes('onderneming')) return 'BUSINESS';
  if (source === 'investment_returns' || source.includes('belegging') || source.includes('investment')) return 'INVESTMENTS';
  if (source === 'sale_property' || source.includes('vastgoed') || source.includes('real_estate') || source.includes('onroerend')) return 'REAL_ESTATE';
  if (source.includes('loterij') || source.includes('lottery')) return 'LOTTERY';
  if (source.includes('crypto')) return 'CRYPTO';
  if (source === 'other' || source.includes('anders')) return 'OTHER'; // HIGH RISK - requires review

  console.warn(`Unknown source of wealth: "${primarySource}" - defaulting to OTHER (high risk)`);
  return 'OTHER'; // Unknown sources are high risk by default
}

// Map country name to ISO 2-letter code
function mapCountryToISO(country: string): string {
  const mapping: Record<string, string> = {
    'nederland': 'NL', 'netherlands': 'NL', 'the netherlands': 'NL',
    'belgie': 'BE', 'belgium': 'BE', 'belgië': 'BE',
    'duitsland': 'DE', 'germany': 'DE',
    'frankrijk': 'FR', 'france': 'FR',
    'verenigd koninkrijk': 'GB', 'united kingdom': 'GB', 'uk': 'GB', 'england': 'GB',
    'spanje': 'ES', 'spain': 'ES',
    'italië': 'IT', 'italy': 'IT', 'italie': 'IT',
    'portugal': 'PT',
    'oostenrijk': 'AT', 'austria': 'AT',
    'zwitserland': 'CH', 'switzerland': 'CH',
    'polen': 'PL', 'poland': 'PL',
    'turkije': 'TR', 'turkey': 'TR',
    'rusland': 'RU', 'russia': 'RU',
    'china': 'CN',
    'india': 'IN',
    'japan': 'JP',
    'verenigde staten': 'US', 'united states': 'US', 'usa': 'US', 'america': 'US',
    'iran': 'IR',
    'afghanistan': 'AF',
    'noord-korea': 'KP', 'north korea': 'KP',
    'syrië': 'SY', 'syria': 'SY',
  };
  const normalized = country?.toLowerCase().trim() || '';
  return mapping[normalized] || 'NL'; // Default to NL if not found
}

/**
 * Submit onboarding data and check eligibility with the compliance backend.
 * This is the main function for new onboarding submissions.
 *
 * Flow:
 * 1. Create customer in backend (POST /customers/)
 * 2. Submit for workflow (POST /workflow/submit)
 * 3. Return compliance status
 *
 * LOW_RISK → APPROVED (account direct actief)
 * MEDIUM/HIGH_RISK or PEP → MANUAL_REVIEW
 *
 * @param customerId - The unique customer identifier (external_id)
 * @param onboardingData - Complete onboarding form data
 * @returns ComplianceResult with status (APPROVED, MANUAL_REVIEW, or REJECTED)
 */
export async function submitOnboardingForCompliance(
  customerId: string,
  onboardingData: Partial<OnboardingData>
): Promise<ComplianceResult> {
  try {
    // Step 1: Create customer in backend
    const personalData = onboardingData.personalData;
    const addressData = onboardingData.addressData;
    const taxStatus = onboardingData.taxStatus;
    const sourceOfFunds = onboardingData.sourceOfFunds;

    // Log raw input data for debugging
    console.log('=== RISK ASSESSMENT INPUT ===');
    console.log('Raw taxStatus:', taxStatus);
    console.log('Raw sourceOfFunds:', sourceOfFunds);
    console.log('Raw personalData nationality:', personalData?.nationality);
    console.log('Raw addressData country:', addressData?.country);

    // Map values with logging
    const mappedNationality = mapCountryToISO(personalData?.nationality || 'Nederland');
    const mappedCountry = mapCountryToISO(addressData?.country || 'Nederland');
    const mappedSourceOfWealth = mapSourceOfWealth(sourceOfFunds?.primarySource || 'salary');
    const isPEP = taxStatus?.isPEP === true; // Explicit boolean check

    console.log('=== MAPPED VALUES ===');
    console.log('Mapped nationality:', mappedNationality);
    console.log('Mapped country_of_residence:', mappedCountry);
    console.log('Mapped source_of_wealth:', mappedSourceOfWealth);
    console.log('Is PEP:', isPEP, '(raw value:', taxStatus?.isPEP, ')');

    // Risk factors preview
    console.log('=== RISK FACTORS PREVIEW ===');
    const EU_COUNTRIES = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
    const HIGH_RISK_SOURCES = ['LOTTERY', 'CRYPTO', 'OTHER'];
    const pepScore = isPEP ? 50 : 0;
    const countryScore = !EU_COUNTRIES.includes(mappedCountry) ? 30 : 0;
    const sourceScore = HIGH_RISK_SOURCES.includes(mappedSourceOfWealth) ? 20 : 0;
    const totalScore = pepScore + countryScore + sourceScore;
    console.log(`PEP Score: ${pepScore} (is_pep: ${isPEP})`);
    console.log(`Country Score: ${countryScore} (${mappedCountry} in EU: ${EU_COUNTRIES.includes(mappedCountry)})`);
    console.log(`Source Score: ${sourceScore} (${mappedSourceOfWealth} high risk: ${HIGH_RISK_SOURCES.includes(mappedSourceOfWealth)})`);
    console.log(`TOTAL SCORE: ${totalScore} → ${totalScore < 40 ? 'APPROVED' : totalScore < 70 ? 'MANUAL_REVIEW' : 'REJECTED'}`);

    // Prepare customer create payload (matching backend CustomerCreate schema)
    const customerPayload = {
      name: personalData ? `${personalData.firstName} ${personalData.lastName}` : 'Unknown',
      date_of_birth: personalData?.dateOfBirth ? new Date(personalData.dateOfBirth).toISOString() : new Date().toISOString(),
      nationality: mappedNationality,
      country_of_residence: mappedCountry,
      source_of_wealth: mappedSourceOfWealth,
      is_pep: isPEP,
      external_id: customerId,
    };

    console.log('=== CUSTOMER PAYLOAD ===');
    console.log('Creating customer in compliance backend:', customerPayload);

    // Create customer
    const createResponse = await fetch(
      `${COMPLIANCE_API_URL}/customers/`,
      {
        method: 'POST',
        headers: {
          'X-API-Key': COMPLIANCE_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerPayload),
      }
    );

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Failed to create customer:', createResponse.status, errorText);
      return {
        status: 'MANUAL_REVIEW',
        eligible: false,
        reason: 'Klant aanmaken mislukt. Handmatige review vereist.',
        checked_at: new Date().toISOString(),
      };
    }

    const createdCustomer = await createResponse.json();
    console.log('Customer created:', createdCustomer);

    // Step 2: Submit workflow (triggers risk calculation and returns status)
    const submitPayload = {
      customer_id: customerId,
    };

    console.log('Submitting workflow for customer:', submitPayload);

    const submitResponse = await fetch(
      `${COMPLIANCE_API_URL}/workflow/submit`,
      {
        method: 'POST',
        headers: {
          'X-API-Key': COMPLIANCE_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitPayload),
      }
    );

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error('Failed to submit workflow:', submitResponse.status, errorText);
      return {
        status: 'MANUAL_REVIEW',
        eligible: false,
        reason: 'Workflow indienen mislukt. Handmatige review vereist.',
        checked_at: new Date().toISOString(),
      };
    }

    const workflowResult = await submitResponse.json();
    console.log('Workflow result:', workflowResult);

    // Step 3: Run risk assessment
    const riskPayload = {
      customer_id: createdCustomer.id,
      assessed_by: 'Portal',
    };

    console.log('Running risk assessment:', riskPayload);

    const riskResponse = await fetch(
      `${COMPLIANCE_API_URL}/risk/assess`,
      {
        method: 'POST',
        headers: {
          'X-API-Key': COMPLIANCE_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(riskPayload),
      }
    );

    let riskResult = { result: 'MANUAL_REVIEW', total_score: 0 };
    if (riskResponse.ok) {
      riskResult = await riskResponse.json();
      console.log('Risk assessment result:', riskResult);
    } else {
      console.error('Risk assessment failed:', riskResponse.status);
    }

    // Step 4: Update workflow status based on risk result
    // APPROVED (low risk) → APPROVED
    // MANUAL_REVIEW (medium/high risk) → MANUAL_REVIEW
    const newStatus = riskResult.result === 'APPROVED' ? 'APPROVED' : 'MANUAL_REVIEW';
    const statusReason = riskResult.result === 'APPROVED'
      ? 'Laag risico - automatisch goedgekeurd'
      : 'Handmatige review vereist op basis van risicoprofiel';

    const statusPayload = {
      customer_id: String(createdCustomer.id),
      new_status: newStatus,
      reason: statusReason,
    };

    console.log('Updating workflow status:', statusPayload);

    const statusResponse = await fetch(
      `${COMPLIANCE_API_URL}/workflow/status`,
      {
        method: 'POST',
        headers: {
          'X-API-Key': COMPLIANCE_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusPayload),
      }
    );

    if (!statusResponse.ok) {
      console.error('Failed to update workflow status:', statusResponse.status);
    } else {
      const statusResult = await statusResponse.json();
      console.log('Status update result:', statusResult);
    }

    // Determine risk level from score
    const riskScore = riskResult.total_score || 0;
    let riskLevel: string;
    if (riskScore < 40) {
      riskLevel = 'low';
    } else if (riskScore < 70) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'high';
    }

    return {
      status: newStatus as ComplianceStatus,
      eligible: newStatus === 'APPROVED',
      reason: statusReason,
      checked_at: new Date().toISOString(),
      risk_score: riskScore,
      risk_level: riskLevel,
    };
  } catch (error) {
    console.error('Compliance API call failed:', error);
    return {
      status: 'MANUAL_REVIEW',
      eligible: false,
      reason: 'Verbinding met compliance systeem mislukt. Handmatige review vereist.',
      checked_at: new Date().toISOString(),
    };
  }
}

/**
 * Check customer eligibility status (for existing customers).
 * Use this for checking status after initial submission.
 *
 * @param customerId - The unique customer identifier
 * @returns ComplianceResult with current status
 */
export async function checkComplianceEligibility(customerId: string): Promise<ComplianceResult> {
  try {
    const response = await fetch(
      `${COMPLIANCE_API_URL}/portal/eligibility/${customerId}`,
      {
        method: 'GET',
        headers: {
          'X-API-Key': COMPLIANCE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Compliance API error:', response.status, response.statusText);
      return {
        status: 'MANUAL_REVIEW',
        eligible: false,
        reason: 'Compliance check kon niet worden uitgevoerd. Handmatige review vereist.',
        checked_at: new Date().toISOString(),
      };
    }

    const data = await response.json();

    return {
      status: data.status as ComplianceStatus,
      eligible: data.status === 'APPROVED',
      reason: data.reason || data.message,
      checked_at: data.checked_at || new Date().toISOString(),
      risk_score: data.risk_score,
      risk_level: data.risk_level,
    };
  } catch (error) {
    console.error('Compliance API call failed:', error);
    return {
      status: 'MANUAL_REVIEW',
      eligible: false,
      reason: 'Verbinding met compliance systeem mislukt. Handmatige review vereist.',
      checked_at: new Date().toISOString(),
    };
  }
}

/**
 * Poll customer status (for checking if admin has approved).
 */
export async function getCustomerStatus(customerId: string): Promise<{
  status: ComplianceStatus;
  is_active: boolean;
}> {
  try {
    const response = await fetch(
      `${COMPLIANCE_API_URL}/portal/customer/${customerId}/status`,
      {
        method: 'GET',
        headers: {
          'X-API-Key': COMPLIANCE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return { status: 'MANUAL_REVIEW', is_active: false };
    }

    const data = await response.json();
    return {
      status: data.status as ComplianceStatus,
      is_active: data.is_active,
    };
  } catch {
    return { status: 'MANUAL_REVIEW', is_active: false };
  }
}

/**
 * Generate a unique customer ID for compliance tracking.
 * Uses a combination of timestamp and random string.
 */
export function generateCustomerId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `cust_${timestamp}_${randomPart}`;
}

// ============== Manual Review API Methods ==============

/**
 * Get all customers with MANUAL_REVIEW status.
 * For account managers to review and make decisions.
 */
export async function getManualReviews(): Promise<ManualReviewListResponse> {
  try {
    const response = await fetch(
      `${COMPLIANCE_API_URL}/portal/manual-reviews`,
      {
        method: 'GET',
        headers: {
          'X-API-Key': COMPLIANCE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch manual reviews:', response.status, response.statusText);
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching manual reviews:', error);
    throw error;
  }
}

/**
 * Get detailed information about a specific customer in manual review.
 * Includes audit trail, documents, and screening results.
 */
export async function getManualReviewDetail(customerId: number): Promise<ManualReviewDetailResponse> {
  try {
    const response = await fetch(
      `${COMPLIANCE_API_URL}/portal/manual-reviews/${customerId}`,
      {
        method: 'GET',
        headers: {
          'X-API-Key': COMPLIANCE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch manual review detail:', response.status, response.statusText);
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching manual review detail:', error);
    throw error;
  }
}

/**
 * Get ALL customers (regardless of status).
 * For admin panel to show complete customer list.
 */
export async function getAllCustomers(): Promise<ManualReviewListResponse> {
  try {
    const response = await fetch(
      `${COMPLIANCE_API_URL}/portal/customers`,
      {
        method: 'GET',
        headers: {
          'X-API-Key': COMPLIANCE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch all customers:', response.status, response.statusText);
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching all customers:', error);
    throw error;
  }
}

/**
 * Make a decision (APPROVED or REJECTED) on a customer in manual review.
 * Requires a reason (min 10 characters) for audit trail.
 */
export async function decideManualReview(
  customerId: number,
  decision: ManualReviewDecisionRequest
): Promise<ManualReviewDecisionResponse> {
  try {
    const response = await fetch(
      `${COMPLIANCE_API_URL}/portal/manual-reviews/${customerId}/decide`,
      {
        method: 'POST',
        headers: {
          'X-API-Key': COMPLIANCE_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(decision),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to submit decision:', response.status, errorData);
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting manual review decision:', error);
    throw error;
  }
}
