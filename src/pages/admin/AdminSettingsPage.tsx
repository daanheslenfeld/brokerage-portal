import React, { useState } from 'react';
import {
  Save,
  Shield,
  Bell,
  Mail,
  Lock,
  Globe,
  Palette,
  Database,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  Check,
  Info
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout title="Instellingen" subtitle="Beheer je platform configuratie">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="bg-dark-card border border-dark-border rounded-xl p-2 space-y-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'general'
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-dark-surface'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">Algemeen</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'security'
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-dark-surface'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Beveiliging</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-dark-surface'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="font-medium">Notificaties</span>
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'email'
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-dark-surface'
              }`}
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">Email</span>
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'compliance'
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-dark-surface'
              }`}
            >
              <Lock className="w-5 h-5" />
              <span className="font-medium">Compliance</span>
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'data'
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-dark-surface'
              }`}
            >
              <Database className="w-5 h-5" />
              <span className="font-medium">Data & Backup</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* General settings */}
          {activeTab === 'general' && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Algemene Instellingen
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Platform naam
                  </label>
                  <input
                    type="text"
                    defaultValue="Brokerage Portal"
                    className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Support email
                  </label>
                  <input
                    type="email"
                    defaultValue="support@brokerageportal.nl"
                    className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Standaard taal
                  </label>
                  <select className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none">
                    <option value="nl">Nederlands</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Tijdzone
                  </label>
                  <select className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none">
                    <option value="Europe/Amsterdam">Europe/Amsterdam (CET)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-surface rounded-lg">
                  <div>
                    <p className="font-medium text-white">Onderhoudsmodus</p>
                    <p className="text-sm text-gray-400">Tijdelijk toegang blokkeren voor gebruikers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security settings */}
          {activeTab === 'security' && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Beveiligingsinstellingen
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-dark-surface rounded-lg">
                  <div>
                    <p className="font-medium text-white">Twee-factor authenticatie verplicht</p>
                    <p className="text-sm text-gray-400">Vereis 2FA voor alle admin accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Sessie timeout (minuten)
                  </label>
                  <input
                    type="number"
                    defaultValue="30"
                    className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Maximum login pogingen
                  </label>
                  <input
                    type="number"
                    defaultValue="5"
                    className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Wachtwoord minimum lengte
                  </label>
                  <input
                    type="number"
                    defaultValue="12"
                    className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-surface rounded-lg">
                  <div>
                    <p className="font-medium text-white">IP whitelist actief</p>
                    <p className="text-sm text-gray-400">Beperk admin toegang tot specifieke IP's</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Notification settings */}
          {activeTab === 'notifications' && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notificatie Instellingen
              </h2>

              <div className="space-y-4">
                {[
                  { label: 'Nieuwe gebruiker registratie', default: true },
                  { label: 'Onboarding aanvraag ingediend', default: true },
                  { label: 'Document geüpload', default: false },
                  { label: 'Grote transactie (>€10.000)', default: true },
                  { label: 'Verdachte activiteit gedetecteerd', default: true },
                  { label: 'Dagelijkse samenvatting', default: true },
                  { label: 'Wekelijkse rapportage', default: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-dark-surface rounded-lg">
                    <span className="text-white">{item.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.default} />
                      <div className="w-11 h-6 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email settings */}
          {activeTab === 'email' && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Email Configuratie
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    SMTP Server
                  </label>
                  <input
                    type="text"
                    defaultValue="smtp.sendgrid.net"
                    className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      defaultValue="587"
                      className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Encryptie
                    </label>
                    <select className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none">
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                      <option value="none">Geen</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Afzender naam
                  </label>
                  <input
                    type="text"
                    defaultValue="Brokerage Portal"
                    className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Afzender email
                  </label>
                  <input
                    type="email"
                    defaultValue="noreply@brokerageportal.nl"
                    className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <button className="px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-300 hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Test email versturen
                </button>
              </div>
            </div>
          )}

          {/* Compliance settings */}
          {activeTab === 'compliance' && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Compliance Instellingen
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-400">Let op</p>
                    <p className="text-sm text-amber-400/80">
                      Wijzigingen in compliance instellingen kunnen invloed hebben op het onboarding proces.
                      Raadpleeg je compliance officer voor wijzigingen.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    KYC Verificatie niveau
                  </label>
                  <select className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none">
                    <option value="basic">Basis (ID + Adres)</option>
                    <option value="standard">Standaard (+ Bron van vermogen)</option>
                    <option value="enhanced">Uitgebreid (+ EDD voor hoog risico)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Risico drempel voor EDD
                  </label>
                  <input
                    type="number"
                    defaultValue="70"
                    className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Klanten met risicoscore boven deze waarde krijgen Enhanced Due Diligence
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-surface rounded-lg">
                  <div>
                    <p className="font-medium text-white">PEP screening actief</p>
                    <p className="text-sm text-gray-400">Automatische controle op politiek prominente personen</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-surface rounded-lg">
                  <div>
                    <p className="font-medium text-white">Sanctielijst controle</p>
                    <p className="text-sm text-gray-400">Automatische controle tegen internationale sanctielijsten</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Data settings */}
          {activeTab === 'data' && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Data & Backup
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-dark-surface rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-white">Laatste backup</p>
                      <p className="text-sm text-gray-400">9 december 2024, 03:00</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                      Succesvol
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-2 bg-dark-border rounded-lg text-gray-300 hover:bg-dark-card transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download backup
                    </button>
                    <button className="flex-1 py-2 bg-primary text-dark-bg rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Backup nu
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Automatische backup frequentie
                  </label>
                  <select className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none">
                    <option value="daily">Dagelijks</option>
                    <option value="weekly">Wekelijks</option>
                    <option value="monthly">Maandelijks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Data retentie periode (maanden)
                  </label>
                  <input
                    type="number"
                    defaultValue="84"
                    className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimaal 7 jaar vereist voor compliance (84 maanden)
                  </p>
                </div>

                <div className="border-t border-dark-border pt-6">
                  <h3 className="font-medium text-white mb-4">Export data</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 bg-dark-surface border border-dark-border rounded-lg text-gray-300 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Gebruikers (CSV)
                    </button>
                    <button className="py-3 bg-dark-surface border border-dark-border rounded-lg text-gray-300 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Transacties (CSV)
                    </button>
                    <button className="py-3 bg-dark-surface border border-dark-border rounded-lg text-gray-300 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Audit log (CSV)
                    </button>
                    <button className="py-3 bg-dark-surface border border-dark-border rounded-lg text-gray-300 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Compliance rapport
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="mt-6 flex items-center justify-end gap-4">
            {saved && (
              <span className="text-green-400 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Instellingen opgeslagen
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-primary text-dark-bg rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Opslaan
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
