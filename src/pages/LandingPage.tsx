import React from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp, Shield, PieChart, ArrowRight, Check } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

// Sample chart data
const chartData = [
  { month: 'Jan', value: 10000 },
  { month: 'Feb', value: 10450 },
  { month: 'Mar', value: 10200 },
  { month: 'Apr', value: 11100 },
  { month: 'May', value: 11800 },
  { month: 'Jun', value: 12300 },
  { month: 'Jul', value: 11900 },
  { month: 'Aug', value: 12800 },
  { month: 'Sep', value: 13200 },
  { month: 'Oct', value: 13900 },
  { month: 'Nov', value: 14500 },
  { month: 'Dec', value: 15200 },
];

const features = [
  {
    icon: PieChart,
    title: 'ETF Database',
    description: 'Toegang tot 1000+ ETFs met gedetailleerde analyses en vergelijkingen.',
  },
  {
    icon: TrendingUp,
    title: 'Portfolio Tracking',
    description: 'Volg je beleggingen in real-time met duidelijke grafieken en statistieken.',
  },
  {
    icon: Shield,
    title: 'Veilig & Compliant',
    description: 'AFM gereguleerd met strenge KYC/AML procedures voor je veiligheid.',
  },
];

const pricingPlans = [
  {
    name: 'Gratis',
    price: '€0',
    description: 'Perfect om te starten',
    features: [
      'ETF Database toegang',
      'Portfolio overzicht (max 5 ETFs)',
      'Basis analyses',
      'E-mail support',
    ],
    cta: 'Gratis Starten',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '€9,99',
    period: '/maand',
    description: 'Voor serieuze beleggers',
    features: [
      'Alles van Gratis',
      'Onbeperkt ETFs',
      'Geavanceerde analyses',
      'Automatisch herbalanceren',
      'Prioriteit support',
      'Geen transactiekosten*',
    ],
    cta: 'Start Premium',
    highlighted: true,
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0B0D]">
      <Header />

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Beleggen in ETFs.
                <br />
                <span className="text-[#28EBCF]">Simpel en slim.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-400 max-w-lg">
                Open in minuten een beleggingsrekening en start met het opbouwen van je vermogen.
                Laagste kosten, beste tools.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-[#28EBCF] text-[#0A0B0D] rounded-lg hover:bg-[#20D4BA] transition-all font-bold text-lg inline-flex items-center justify-center"
                >
                  Gratis Starten
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 border-2 border-gray-600 text-white rounded-lg hover:border-[#28EBCF] transition-all font-semibold text-lg inline-flex items-center justify-center"
                >
                  Inloggen
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Geen creditcard nodig • Binnen 5 minuten starten
              </p>
            </div>

            {/* Chart Preview - ETF-test style */}
            <div className="relative">
              <div className="bg-[#1A1B1F] border border-[#28EBCF]/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Portfolio Waarde</p>
                    <p className="text-3xl font-bold text-white">€15.200</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#28EBCF] font-semibold">+52%</p>
                    <p className="text-gray-500 text-sm">dit jaar</p>
                  </div>
                </div>
                <div style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#28EBCF" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#28EBCF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 11 }}
                      />
                      <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#28EBCF"
                        strokeWidth={2}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-[#0F1014] border border-[#28EBCF]/20 rounded-lg p-2 text-center">
                    <div className="text-[#28EBCF] text-xs font-bold">+12.5%</div>
                    <div className="text-gray-500 text-xs">YTD</div>
                  </div>
                  <div className="bg-[#0F1014] border border-[#28EBCF]/20 rounded-lg p-2 text-center">
                    <div className="text-[#28EBCF] text-xs font-bold">€450</div>
                    <div className="text-gray-500 text-xs">Dividend</div>
                  </div>
                  <div className="bg-[#0F1014] border border-[#28EBCF]/20 rounded-lg p-2 text-center">
                    <div className="text-[#28EBCF] text-xs font-bold">5</div>
                    <div className="text-gray-500 text-xs">ETFs</div>
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#28EBCF] opacity-20 blur-3xl rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#1A1B1F]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Alles wat je nodig hebt
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Een complete platform voor het beheren van je ETF beleggingen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900/95 backdrop-blur-sm border border-[#28EBCF]/30 rounded-2xl p-8 text-center hover:border-[#28EBCF] hover:shadow-lg hover:shadow-[#28EBCF]/20 transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-[#28EBCF]/20 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-[#28EBCF]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              In 3 stappen van start
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Open snel en eenvoudig je beleggingsrekening
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Registreer', desc: 'Maak gratis een account aan met je e-mailadres' },
              { step: '2', title: 'Verificatie', desc: 'Doorloop ons snelle KYC proces' },
              { step: '3', title: 'Start met beleggen', desc: 'Kies je ETFs en begin met investeren' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#28EBCF] to-[#20D4BA] text-[#0A0B0D] rounded-full flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#1A1B1F]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Transparante tarieven
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Start gratis en upgrade wanneer je klaar bent
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 flex flex-col relative ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-[#28EBCF]/10 to-[#20D4BA]/5 border-2 border-[#28EBCF]'
                    : 'bg-[#1A1B1F] border border-gray-800'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#28EBCF] text-[#0A0B0D] px-4 py-1 rounded-full text-sm font-bold">
                    Populair
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-400">{plan.period}</span>}
                </div>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <span className="text-[#28EBCF] text-xl mr-3">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`w-full py-3 rounded-lg font-semibold text-center transition-all block ${
                    plan.highlighted
                      ? 'bg-[#28EBCF] text-[#0A0B0D] hover:bg-[#20D4BA]'
                      : 'border-2 border-gray-600 text-white hover:border-[#28EBCF]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            * Transactiekosten van €0,50 per transactie bij orders onder €1.000
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Klaar om te beginnen?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Open vandaag nog je beleggingsrekening en maak je eerste stap naar financiële vrijheid.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-10 py-4 bg-[#28EBCF] text-[#0A0B0D] rounded-lg hover:bg-[#20D4BA] transition-all font-bold text-lg"
          >
            Gratis Account Openen
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
