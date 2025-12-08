import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Globe, Info, Plus, Trash2 } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import type { TaxStatus, TaxCountry } from '../../types';

interface TaxFormData {
  isPEP: string;
  pepDetails?: string;
  isUSPerson: string;
  usTin?: string;
  taxCountry1: string;
  taxTin1: string;
}

export function TaxStatusStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [additionalCountries, setAdditionalCountries] = useState<TaxCountry[]>(
    data.taxStatus?.taxCountries?.slice(1) || []
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaxFormData>({
    defaultValues: {
      isPEP: data.taxStatus?.isPEP ? 'yes' : 'no',
      pepDetails: data.taxStatus?.pepDetails || '',
      isUSPerson: data.taxStatus?.isUSPerson ? 'yes' : 'no',
      usTin: data.taxStatus?.usTin || '',
      taxCountry1: data.taxStatus?.taxCountries?.[0]?.country || 'NL',
      taxTin1: data.taxStatus?.taxCountries?.[0]?.tin || '',
    },
  });

  const isPEP = watch('isPEP');
  const isUSPerson = watch('isUSPerson');

  const addCountry = () => {
    setAdditionalCountries([...additionalCountries, { country: '', tin: '' }]);
  };

  const removeCountry = (index: number) => {
    setAdditionalCountries(additionalCountries.filter((_, i) => i !== index));
  };

  const updateCountry = (index: number, field: 'country' | 'tin', value: string) => {
    const updated = [...additionalCountries];
    updated[index][field] = value;
    setAdditionalCountries(updated);
  };

  const onSubmit = (formData: TaxFormData) => {
    const taxCountries: TaxCountry[] = [
      { country: formData.taxCountry1, tin: formData.taxTin1 },
      ...additionalCountries.filter((c) => c.country && c.tin),
    ];

    const taxStatus: TaxStatus = {
      isPEP: formData.isPEP === 'yes',
      pepDetails: formData.isPEP === 'yes' ? formData.pepDetails : undefined,
      isUSPerson: formData.isUSPerson === 'yes',
      usTin: formData.isUSPerson === 'yes' ? formData.usTin : undefined,
      taxCountries,
    };

    updateData({ taxStatus });
    nextStep();
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
          <Globe className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Belastingstatus</h2>
        <p className="text-gray-400 text-sm">
          Wij zijn wettelijk verplicht deze vragen te stellen
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* PEP Question */}
        <div className="bg-dark-surface rounded-xl p-4">
          <div className="flex items-start mb-3">
            <Info className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <label className="block text-sm font-medium text-white">
                Bent u een PEP (Politiek Prominent Persoon)?
              </label>
              <p className="text-xs text-gray-400 mt-1">
                Een PEP is iemand die een prominente publieke functie bekleedt of heeft bekleed.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <label className={`flex-1 p-3 border-2 rounded-lg cursor-pointer text-center ${
              isPEP === 'no' ? 'border-primary bg-primary/10' : 'border-dark-border'
            }`}>
              <input
                type="radio"
                value="no"
                {...register('isPEP')}
                className="sr-only"
              />
              <span className="text-white">Nee</span>
            </label>
            <label className={`flex-1 p-3 border-2 rounded-lg cursor-pointer text-center ${
              isPEP === 'yes' ? 'border-primary bg-primary/10' : 'border-dark-border'
            }`}>
              <input
                type="radio"
                value="yes"
                {...register('isPEP')}
                className="sr-only"
              />
              <span className="text-white">Ja</span>
            </label>
          </div>
          {isPEP === 'yes' && (
            <div className="mt-3">
              <input
                {...register('pepDetails', { required: isPEP === 'yes' })}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                placeholder="Beschrijf uw functie..."
              />
            </div>
          )}
        </div>

        {/* US Person Question */}
        <div className="bg-dark-surface rounded-xl p-4">
          <div className="flex items-start mb-3">
            <Info className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <label className="block text-sm font-medium text-white">
                Bent u een US Person?
              </label>
              <p className="text-xs text-gray-400 mt-1">
                US Person: Amerikaans staatsburger, Green Card houder, of belastingplichtig in de VS.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <label className={`flex-1 p-3 border-2 rounded-lg cursor-pointer text-center ${
              isUSPerson === 'no' ? 'border-primary bg-primary/10' : 'border-dark-border'
            }`}>
              <input
                type="radio"
                value="no"
                {...register('isUSPerson')}
                className="sr-only"
              />
              <span className="text-white">Nee</span>
            </label>
            <label className={`flex-1 p-3 border-2 rounded-lg cursor-pointer text-center ${
              isUSPerson === 'yes' ? 'border-primary bg-primary/10' : 'border-dark-border'
            }`}>
              <input
                type="radio"
                value="yes"
                {...register('isUSPerson')}
                className="sr-only"
              />
              <span className="text-white">Ja</span>
            </label>
          </div>
          {isUSPerson === 'yes' && (
            <div className="mt-3">
              <input
                {...register('usTin', { required: isUSPerson === 'yes' })}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                placeholder="US TIN (SSN of ITIN)"
              />
            </div>
          )}
        </div>

        {/* Tax Countries */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            In welk(e) land(en) bent u belastingplichtig?
          </label>

          {/* Primary country */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <select
              {...register('taxCountry1', { required: 'Land is verplicht' })}
              className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
            >
              <option value="NL">Nederland</option>
              <option value="BE">België</option>
              <option value="DE">Duitsland</option>
              <option value="FR">Frankrijk</option>
            </select>
            <input
              {...register('taxTin1', { required: 'BSN/TIN is verplicht' })}
              className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              placeholder="BSN / TIN"
            />
          </div>

          {/* Additional countries */}
          {additionalCountries.map((country, index) => (
            <div key={index} className="grid grid-cols-2 gap-3 mb-3 relative">
              <select
                value={country.country}
                onChange={(e) => updateCountry(index, 'country', e.target.value)}
                className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
              >
                <option value="">Selecteer land</option>
                <option value="NL">Nederland</option>
                <option value="BE">België</option>
                <option value="DE">Duitsland</option>
                <option value="FR">Frankrijk</option>
              </select>
              <div className="flex gap-2">
                <input
                  value={country.tin}
                  onChange={(e) => updateCountry(index, 'tin', e.target.value)}
                  className="flex-1 bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  placeholder="TIN"
                />
                <button
                  type="button"
                  onClick={() => removeCountry(index)}
                  className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCountry}
            className="w-full py-2 border border-dashed border-dark-border text-gray-400 rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Land toevoegen
          </button>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-3 border border-dark-border text-gray-300 rounded-lg hover:border-gray-600 transition-colors font-medium flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Terug
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center"
          >
            Verder
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
}
