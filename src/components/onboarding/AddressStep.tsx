import React from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import type { AddressData } from '../../types';

export function AddressStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressData>({
    defaultValues: data.addressData || { country: 'NL' },
  });

  const onSubmit = (formData: AddressData) => {
    updateData({ addressData: formData });
    nextStep();
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
          <MapPin className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Woonadres</h2>
        <p className="text-gray-400 text-sm">
          Vul je huidige woonadres in
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Street and House Number */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Straat *
            </label>
            <input
              {...register('street', { required: 'Straat is verplicht' })}
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              placeholder="Keizersgracht"
            />
            {errors.street && (
              <p className="text-red-400 text-xs mt-1">{errors.street.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nummer *
            </label>
            <input
              {...register('houseNumber', { required: 'Huisnummer is verplicht' })}
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              placeholder="123"
            />
            {errors.houseNumber && (
              <p className="text-red-400 text-xs mt-1">{errors.houseNumber.message}</p>
            )}
          </div>
        </div>

        {/* Addition */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Toevoeging (optioneel)
          </label>
          <input
            {...register('houseNumberAddition')}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
            placeholder="A, 2-hoog, etc."
          />
        </div>

        {/* Postal Code and City */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Postcode *
            </label>
            <input
              {...register('postalCode', {
                required: 'Postcode is verplicht',
                pattern: {
                  value: /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/,
                  message: 'Ongeldige postcode (bijv. 1234 AB)',
                },
              })}
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              placeholder="1234 AB"
            />
            {errors.postalCode && (
              <p className="text-red-400 text-xs mt-1">{errors.postalCode.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Plaats *
            </label>
            <input
              {...register('city', { required: 'Plaats is verplicht' })}
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              placeholder="Amsterdam"
            />
            {errors.city && (
              <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Land *
          </label>
          <select
            {...register('country', { required: 'Land is verplicht' })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
          >
            <option value="NL">Nederland</option>
            <option value="BE">België</option>
            <option value="DE">Duitsland</option>
            <option value="FR">Frankrijk</option>
          </select>
          {errors.country && (
            <p className="text-red-400 text-xs mt-1">{errors.country.message}</p>
          )}
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
