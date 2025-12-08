import React from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import type { PersonalData } from '../../types';

export function PersonalDataStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalData>({
    defaultValues: data.personalData || {},
  });

  const onSubmit = (formData: PersonalData) => {
    updateData({ personalData: formData });
    nextStep();
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
          <User className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Persoonlijke Gegevens</h2>
        <p className="text-gray-400 text-sm">
          Vul je gegevens in zoals vermeld op je identiteitsbewijs
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Voornaam *
            </label>
            <input
              {...register('firstName', { required: 'Voornaam is verplicht' })}
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              placeholder="Jan"
            />
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Achternaam *
            </label>
            <input
              {...register('lastName', { required: 'Achternaam is verplicht' })}
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              placeholder="Jansen"
            />
            {errors.lastName && (
              <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Geboortedatum *
          </label>
          <input
            type="date"
            {...register('dateOfBirth', { required: 'Geboortedatum is verplicht' })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
          />
          {errors.dateOfBirth && (
            <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nationaliteit *
          </label>
          <select
            {...register('nationality', { required: 'Nationaliteit is verplicht' })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
          >
            <option value="">Selecteer nationaliteit</option>
            <option value="NL">Nederlands</option>
            <option value="BE">Belgisch</option>
            <option value="DE">Duits</option>
            <option value="FR">Frans</option>
            <option value="other">Anders</option>
          </select>
          {errors.nationality && (
            <p className="text-red-400 text-xs mt-1">{errors.nationality.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Telefoonnummer *
          </label>
          <input
            type="tel"
            {...register('phone', { required: 'Telefoonnummer is verplicht' })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
            placeholder="+31 6 12345678"
          />
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            E-mailadres *
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'E-mail is verplicht',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Ongeldig e-mailadres',
              },
            })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
            placeholder="jan@voorbeeld.nl"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
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
