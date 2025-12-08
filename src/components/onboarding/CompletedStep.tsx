import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, ArrowRight, Mail } from 'lucide-react';

export function CompletedStep() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Aanvraag Ingediend!
        </h1>

        <p className="text-gray-400 mb-8">
          Je verificatie is succesvol ingediend. We controleren je gegevens en nemen
          zo snel mogelijk contact met je op.
        </p>

        {/* Status Card */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-amber-400 mr-2" />
            <span className="text-amber-400 font-medium">In behandeling</span>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-dark-bg" />
              </div>
              <div>
                <p className="text-white font-medium">Gegevens ontvangen</p>
                <p className="text-gray-500 text-sm">Je aanvraag is succesvol ingediend</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Clock className="w-4 h-4 text-dark-bg" />
              </div>
              <div>
                <p className="text-white font-medium">Verificatie</p>
                <p className="text-gray-500 text-sm">We controleren je gegevens (1-2 werkdagen)</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-dark-border flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-xs text-gray-500">3</span>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Account activeren</p>
                <p className="text-gray-600 text-sm">Na goedkeuring kun je direct beleggen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Notice */}
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <Mail className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-300 text-left">
              Je ontvangt een e-mail zodra je account is geverifieerd.
              Controleer ook je spam folder.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/dashboard"
            className="w-full py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center"
          >
            Naar Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>

          <Link
            to="/"
            className="w-full py-3 border border-dark-border text-gray-300 rounded-lg hover:border-gray-600 transition-colors font-medium flex items-center justify-center"
          >
            Terug naar Home
          </Link>
        </div>
      </div>
    </div>
  );
}
