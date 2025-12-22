import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Shield, Upload, Check, AlertTriangle, FileText, X } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import { calculateRiskScore, getRiskColor, getRiskBgColor, getRiskLabel } from '../../utils/riskAssessment';

interface EnhancedDueDiligenceData {
  sourceOfWealthExplanation: string;
  employerName?: string;
  employerAddress?: string;
  annualIncomeProof?: File;
  wealthSourceProof?: File;
  additionalInfo?: string;
}

const DOCUMENT_TYPES = [
  { id: 'salary_slip', label: 'Salarisstrook (laatste 3 maanden)', icon: FileText },
  { id: 'tax_return', label: 'Belastingaangifte', icon: FileText },
  { id: 'bank_statement', label: 'Bankafschriften (6 maanden)', icon: FileText },
  { id: 'business_docs', label: 'Bedrijfsdocumenten / Jaarrekening', icon: FileText },
  { id: 'inheritance_proof', label: 'Erfenisbewijs / Notariële akte', icon: FileText },
  { id: 'property_sale', label: 'Verkoopakte onroerend goed', icon: FileText },
];

export function EnhancedDueDiligenceStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const riskAssessment = calculateRiskScore(data);

  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File>>({});
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnhancedDueDiligenceData>({
    defaultValues: {
      sourceOfWealthExplanation: '',
      employerName: '',
      employerAddress: '',
      additionalInfo: '',
    },
  });

  const handleFileUpload = useCallback((docType: string, file: File) => {
    setUploadedDocs(prev => ({ ...prev, [docType]: file }));
  }, []);

  const removeFile = useCallback((docType: string) => {
    setUploadedDocs(prev => {
      const newDocs = { ...prev };
      delete newDocs[docType];
      return newDocs;
    });
  }, []);

  const onSubmit = async (formData: EnhancedDueDiligenceData) => {
    setVerificationStatus('verifying');

    // Simulate document verification
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Store enhanced due diligence data
    updateData({
      enhancedDueDiligence: {
        ...formData,
        documents: Object.keys(uploadedDocs),
        verifiedAt: new Date().toISOString(),
        riskLevel: riskAssessment.riskLevel,
      },
    } as any);

    setVerificationStatus('verified');

    // Short delay then proceed
    setTimeout(() => {
      nextStep();
    }, 1000);
  };

  // Determine required documents based on risk factors
  const requiredDocs = riskAssessment.riskLevel === 'high' ? 2 : 1;
  const hasEnoughDocs = Object.keys(uploadedDocs).length >= requiredDocs;

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500/20 rounded-full mb-4">
          <Shield className="w-7 h-7 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Uitgebreide Verificatie</h2>
        <p className="text-gray-400 text-sm">
          Op basis van uw profiel hebben we aanvullende informatie nodig
        </p>
      </div>

      {/* Risk Assessment Summary */}
      <div className={`${getRiskBgColor(riskAssessment.riskLevel)} border rounded-xl p-4 mb-6`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${getRiskColor(riskAssessment.riskLevel)}`} />
            <span className={`font-medium ${getRiskColor(riskAssessment.riskLevel)}`}>
              {getRiskLabel(riskAssessment.riskLevel)}
            </span>
          </div>
          <span className="text-gray-400 text-sm">Score: {riskAssessment.overallScore}/100</span>
        </div>
        <p className="text-sm text-gray-300">
          {riskAssessment.riskLevel === 'high' ? (
            'Vanwege uw risicoprofiel vragen wij om extra documentatie ter verificatie van uw vermogensbron.'
          ) : (
            'Wij vragen om aanvullende documentatie om uw aanvraag sneller te kunnen verwerken.'
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Source of Wealth Explanation */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Toelichting vermogensbron *
          </label>
          <textarea
            {...register('sourceOfWealthExplanation', {
              required: 'Toelichting is verplicht',
              minLength: { value: 50, message: 'Minimaal 50 karakters vereist' }
            })}
            rows={4}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none resize-none"
            placeholder="Beschrijf hoe u uw vermogen heeft opgebouwd (bijv. salaris over de jaren, verkoop van een woning, erfenis, etc.)"
          />
          {errors.sourceOfWealthExplanation && (
            <p className="text-red-400 text-xs mt-1">{errors.sourceOfWealthExplanation.message}</p>
          )}
        </div>

        {/* Employer Info (if salary is source) */}
        {data.sourceOfFunds?.primarySource?.toLowerCase().includes('salaris') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Werkgever
              </label>
              <input
                {...register('employerName')}
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                placeholder="Naam werkgever"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vestigingsplaats
              </label>
              <input
                {...register('employerAddress')}
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                placeholder="Stad"
              />
            </div>
          </div>
        )}

        {/* Document Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload bewijsstukken * <span className="text-gray-500">(minimaal {requiredDocs})</span>
          </label>
          <div className="space-y-3">
            {DOCUMENT_TYPES.map((docType) => {
              const isUploaded = !!uploadedDocs[docType.id];
              const Icon = docType.icon;

              return (
                <div
                  key={docType.id}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    isUploaded
                      ? 'border-green-500/50 bg-green-500/5'
                      : 'border-dark-border hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isUploaded ? 'bg-green-500/20' : 'bg-dark-surface'
                      }`}>
                        {isUploaded ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Icon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{docType.label}</p>
                        {isUploaded && (
                          <p className="text-green-400 text-xs">{uploadedDocs[docType.id].name}</p>
                        )}
                      </div>
                    </div>

                    {isUploaded ? (
                      <button
                        type="button"
                        onClick={() => removeFile(docType.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    ) : (
                      <label className="px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-sm text-gray-300 hover:border-primary cursor-pointer transition-colors flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(docType.id, file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {!hasEnoughDocs && (
            <p className="text-amber-400 text-xs mt-2">
              Upload minimaal {requiredDocs} document{requiredDocs > 1 ? 'en' : ''} om door te gaan
            </p>
          )}
        </div>

        {/* Additional Info */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Aanvullende informatie <span className="text-gray-500">(optioneel)</span>
          </label>
          <textarea
            {...register('additionalInfo')}
            rows={2}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none resize-none"
            placeholder="Overige relevante informatie..."
          />
        </div>

        {/* Verification Status */}
        {verificationStatus === 'verified' && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-green-400 font-medium">Documenten ontvangen en geverifieerd</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={prevStep}
            disabled={verificationStatus === 'verifying'}
            className="flex-1 py-3 border border-dark-border text-gray-300 rounded-lg hover:border-gray-600 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Terug
          </button>
          <button
            type="submit"
            disabled={!hasEnoughDocs || verificationStatus === 'verifying'}
            className="flex-1 py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verificationStatus === 'verifying' ? (
              <>
                <div className="w-5 h-5 border-2 border-dark-bg border-t-transparent rounded-full animate-spin mr-2" />
                Verifiëren...
              </>
            ) : verificationStatus === 'verified' ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Geverifieerd
              </>
            ) : (
              <>
                Verder
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
