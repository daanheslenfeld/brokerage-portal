import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Building, CheckCircle, AlertCircle } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import type { BankAccountData } from '../../types';

// Simple IBAN validation
function validateIBAN(iban: string): boolean {
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();

  // Check basic format (starts with 2 letters, then 2 digits, then more chars)
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,}$/.test(cleanIban)) {
    return false;
  }

  // Check length (NL IBANs are 18 characters)
  if (cleanIban.startsWith('NL') && cleanIban.length !== 18) {
    return false;
  }

  return true;
}

// Format IBAN with spaces
function formatIBAN(iban: string): string {
  const clean = iban.replace(/\s/g, '').toUpperCase();
  return clean.replace(/(.{4})/g, '$1 ').trim();
}

export function BankAccountStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BankAccountData>({
    defaultValues: data.bankAccount || {
      iban: '',
      accountHolder: '',
      verified: false,
    },
  });

  const ibanValue = watch('iban');

  const onIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatIBAN(e.target.value);
    setValue('iban', formatted);
  };

  const onSubmit = async (formData: BankAccountData) => {
    setIsVerifying(true);
    setVerificationStatus('idle');

    // Simulate IBAN verification
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validate IBAN format
    if (!validateIBAN(formData.iban)) {
      setVerificationStatus('error');
      setIsVerifying(false);
      return;
    }

    setVerificationStatus('success');

    // Wait a bit then proceed
    await new Promise(resolve => setTimeout(resolve, 500));

    updateData({
      bankAccount: {
        ...formData,
        verified: true,
      },
    });

    setIsVerifying(false);
    nextStep();
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
          <Building className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Bankrekening</h2>
        <p className="text-gray-400 text-sm">
          Koppel je bankrekening voor stortingen en opnames
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Info Box */}
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="text-primary font-medium">Waarom hebben we dit nodig?</p>
              <p className="text-gray-400 mt-1">
                Je bankrekening wordt gebruikt voor het storten en opnemen van geld.
                De rekening moet op jouw naam staan.
              </p>
            </div>
          </div>
        </div>

        {/* Account Holder */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Naam rekeninghouder *
          </label>
          <input
            {...register('accountHolder', { required: 'Naam rekeninghouder is verplicht' })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
            placeholder="Jan Jansen"
          />
          {errors.accountHolder && (
            <p className="text-red-400 text-xs mt-1">{errors.accountHolder.message}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            De naam moet exact overeenkomen met je identiteitsbewijs
          </p>
        </div>

        {/* IBAN */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            IBAN *
          </label>
          <input
            {...register('iban', {
              required: 'IBAN is verplicht',
              validate: (value) => validateIBAN(value) || 'Ongeldig IBAN formaat',
            })}
            onChange={onIbanChange}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none font-mono tracking-wider"
            placeholder="NL00 BANK 0000 0000 00"
            maxLength={27}
          />
          {errors.iban && (
            <p className="text-red-400 text-xs mt-1">{errors.iban.message}</p>
          )}
        </div>

        {/* Verification Status */}
        {verificationStatus === 'success' && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-500">Bankrekening geverifieerd!</span>
            </div>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-500">IBAN kon niet geverifieerd worden. Controleer je gegevens.</span>
            </div>
          </div>
        )}

        {/* Terms */}
        <div className="p-4 bg-dark-surface rounded-xl border border-dark-border">
          <p className="text-gray-400 text-sm">
            Door verder te gaan bevestig je dat:
          </p>
          <ul className="text-gray-400 text-sm mt-2 space-y-1">
            <li>• De bankrekening op jouw naam staat</li>
            <li>• Je gemachtigd bent om deze rekening te gebruiken</li>
            <li>• Het IBAN correct is ingevoerd</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={prevStep}
            disabled={isVerifying}
            className="flex-1 py-3 border border-dark-border text-gray-300 rounded-lg hover:border-gray-600 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Terug
          </button>
          <button
            type="submit"
            disabled={isVerifying}
            className="flex-1 py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <div className="w-5 h-5 border-2 border-dark-bg/30 border-t-dark-bg rounded-full animate-spin mr-2" />
                Verifiëren...
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
