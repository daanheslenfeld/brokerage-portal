import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles, TrendingUp, Shield, Gift } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function CompletedStep() {
  const { user, updateUser } = useAuth();

  // Mark onboarding as completed when this step is shown
  useEffect(() => {
    if (user && !user.onboardingCompleted) {
      updateUser({
        onboardingCompleted: true,
        onboardingApproved: true, // Auto-approve for demo purposes
      });
    }
  }, [user, updateUser]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Celebration Animation */}
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
          <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full">
            <CheckCircle className="w-12 h-12 text-dark-bg" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Welkom bij PIGG! 🎉
        </h1>

        <p className="text-xl text-primary font-medium mb-2">
          Je account is geactiveerd
        </p>

        <p className="text-gray-400 mb-8">
          Gefeliciteerd! Je bent nu officieel klant bij PIGG.
          Je kunt direct beginnen met beleggen.
        </p>

        {/* Benefits Card */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Dit kun je nu doen:</h3>

          <div className="space-y-4 text-left">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4 flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-medium">Direct beginnen met beleggen</p>
                <p className="text-gray-400 text-sm">Kies uit 15+ ETFs</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4 flex-shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-medium">Je geld is veilig</p>
                <p className="text-gray-400 text-sm">Beschermd tot €100.000</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4 flex-shrink-0">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-medium">Geen transactiekosten*</p>
                <p className="text-gray-400 text-sm">Op je eerste 5 trades</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Step CTA */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 mb-6">
          <p className="text-white font-medium mb-2">
            🚀 Volgende stap: Stort je eerste geld
          </p>
          <p className="text-gray-400 text-sm">
            Maak een storting naar je PIGG account om te kunnen beginnen met beleggen.
            Je kunt al vanaf €50 starten!
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/dashboard"
            className="w-full py-4 bg-primary text-dark-bg rounded-xl hover:bg-primary-dark transition-colors font-bold text-lg flex items-center justify-center shadow-lg shadow-primary/25"
          >
            Ga naar Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>

          <Link
            to="/etfs"
            className="w-full py-3 border border-primary/50 text-primary rounded-xl hover:bg-primary/10 transition-colors font-medium flex items-center justify-center"
          >
            Bekijk beschikbare ETFs
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-gray-500 text-xs mt-6">
          *Actievoorwaarden van toepassing. Beleggen kent risico's, je kunt je inleg verliezen.
        </p>
      </div>
    </div>
  );
}
