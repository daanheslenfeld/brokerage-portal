import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  FileCheck,
  FileX,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Download,
  X,
  ChevronRight,
  Flag,
  Calendar,
  User,
  Building,
  Shield,
  Check
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { MOCK_ONBOARDING_APPLICATIONS, type OnboardingApplication } from '../../data/mockAdminData';

const STATUS_OPTIONS = ['Alle', 'pending_review', 'documents_required', 'approved', 'rejected'] as const;

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'pending_review':
      return {
        label: 'Wacht op review',
        className: 'bg-amber-500/20 text-amber-400',
        icon: Clock,
      };
    case 'documents_required':
      return {
        label: 'Documenten nodig',
        className: 'bg-red-500/20 text-red-400',
        icon: FileX,
      };
    case 'approved':
      return {
        label: 'Goedgekeurd',
        className: 'bg-green-500/20 text-green-400',
        icon: CheckCircle,
      };
    case 'rejected':
      return {
        label: 'Afgewezen',
        className: 'bg-red-500/20 text-red-400',
        icon: XCircle,
      };
    default:
      return {
        label: status,
        className: 'bg-gray-500/20 text-gray-400',
        icon: FileCheck,
      };
  }
};

const getDocStatusIcon = (status: string) => {
  switch (status) {
    case 'verified':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'rejected':
      return <XCircle className="w-4 h-4 text-red-400" />;
    default:
      return <Clock className="w-4 h-4 text-amber-400" />;
  }
};

const getRiskColor = (score: number) => {
  if (score <= 30) return 'text-green-400';
  if (score <= 60) return 'text-amber-400';
  return 'text-red-400';
};

const getRiskBg = (score: number) => {
  if (score <= 30) return 'bg-green-500';
  if (score <= 60) return 'bg-amber-500';
  return 'bg-red-500';
};

export function AdminOnboardingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_OPTIONS[number]>('Alle');
  const [selectedApplication, setSelectedApplication] = useState<OnboardingApplication | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredApplications = useMemo(() => {
    return MOCK_ONBOARDING_APPLICATIONS.filter(app => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const fullName = `${app.firstName} ${app.lastName}`.toLowerCase();
        if (!fullName.includes(term) && !app.email.toLowerCase().includes(term)) {
          return false;
        }
      }

      if (statusFilter !== 'Alle' && app.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [searchTerm, statusFilter]);

  const pendingCount = MOCK_ONBOARDING_APPLICATIONS.filter(
    a => a.status === 'pending_review'
  ).length;
  const docsRequiredCount = MOCK_ONBOARDING_APPLICATIONS.filter(
    a => a.status === 'documents_required'
  ).length;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} dag${days > 1 ? 'en' : ''} geleden`;
    if (hours > 0) return `${hours} uur geleden`;
    return 'Zojuist';
  };

  return (
    <AdminLayout title="Onboarding Aanvragen" subtitle="Review en goedkeuring van nieuwe klanten">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{pendingCount}</p>
            <p className="text-sm text-gray-500">Wachtend op review</p>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <FileX className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{docsRequiredCount}</p>
            <p className="text-sm text-gray-500">Documenten nodig</p>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">
              {MOCK_ONBOARDING_APPLICATIONS.filter(a => a.status === 'approved').length}
            </p>
            <p className="text-sm text-gray-500">Goedgekeurd</p>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{MOCK_ONBOARDING_APPLICATIONS.length}</p>
            <p className="text-sm text-gray-500">Totaal aanvragen</p>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Zoek op naam of email..."
              className="w-full bg-dark-surface border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            {STATUS_OPTIONS.filter(s => s !== 'Alle').map((status) => {
              const config = getStatusConfig(status);
              const count = MOCK_ONBOARDING_APPLICATIONS.filter(a => a.status === status).length;

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(statusFilter === status ? 'Alle' : status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    statusFilter === status
                      ? 'bg-primary text-dark-bg'
                      : 'bg-dark-surface text-gray-400 hover:text-white'
                  }`}
                >
                  {config.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    statusFilter === status ? 'bg-dark-bg/20' : 'bg-dark-border'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Applications list */}
      <div className="space-y-4">
        {filteredApplications.map((app) => {
          const statusConfig = getStatusConfig(app.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={app.id}
              className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left side - User info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-dark-surface rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {app.firstName[0]}{app.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white">
                          {app.firstName} {app.lastName}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.className}`}>
                          {statusConfig.label}
                        </span>
                        {app.accountType === 'business' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            Zakelijk
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{app.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatTimeAgo(app.submittedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileCheck className="w-3 h-3" />
                          {app.documents.length} documenten
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Risk score and actions */}
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <div className="text-center sm:text-right">
                      <p className="text-xs text-gray-500 mb-1">Risico score</p>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-dark-surface rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getRiskBg(app.riskScore)}`}
                            style={{ width: `${app.riskScore}%` }}
                          />
                        </div>
                        <span className={`font-bold ${getRiskColor(app.riskScore)}`}>
                          {app.riskScore}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="px-4 py-2 bg-primary text-dark-bg rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </button>
                  </div>
                </div>

                {/* Flags */}
                {app.flags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-dark-border">
                    <div className="flex flex-wrap gap-2">
                      {app.flags.map((flag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 flex items-center gap-1"
                        >
                          <Flag className="w-3 h-3" />
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents preview */}
                <div className="mt-4 pt-4 border-t border-dark-border">
                  <p className="text-sm text-gray-400 mb-2">Documenten:</p>
                  <div className="flex flex-wrap gap-2">
                    {app.documents.map((doc, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1.5 rounded-lg bg-dark-surface text-gray-300 flex items-center gap-2"
                      >
                        {getDocStatusIcon(doc.status)}
                        {doc.type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredApplications.length === 0 && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-400">Geen aanvragen gevonden</p>
          {statusFilter !== 'Alle' && (
            <button
              onClick={() => setStatusFilter('Alle')}
              className="mt-2 text-primary hover:text-primary-dark"
            >
              Toon alle aanvragen
            </button>
          )}
        </div>
      )}

      {/* Application detail modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-dark-surface rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-primary">
                      {selectedApplication.firstName[0]}{selectedApplication.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedApplication.firstName} {selectedApplication.lastName}
                    </h2>
                    <p className="text-gray-400">{selectedApplication.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status and risk */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-dark-surface rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Status</p>
                  <span className={`text-sm px-3 py-1 rounded-full ${getStatusConfig(selectedApplication.status).className}`}>
                    {getStatusConfig(selectedApplication.status).label}
                  </span>
                </div>
                <div className="bg-dark-surface rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Risico score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-dark-border rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getRiskBg(selectedApplication.riskScore)}`}
                        style={{ width: `${selectedApplication.riskScore}%` }}
                      />
                    </div>
                    <span className={`font-bold ${getRiskColor(selectedApplication.riskScore)}`}>
                      {selectedApplication.riskScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-dark-border">
                  <span className="text-gray-400">Account type</span>
                  <span className="text-white capitalize flex items-center gap-2">
                    {selectedApplication.accountType === 'business' ? (
                      <><Building className="w-4 h-4" /> Zakelijk</>
                    ) : (
                      <><User className="w-4 h-4" /> Particulier</>
                    )}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-dark-border">
                  <span className="text-gray-400">Ingediend</span>
                  <span className="text-white">{formatDate(selectedApplication.submittedAt)}</span>
                </div>
                {selectedApplication.reviewedAt && (
                  <>
                    <div className="flex justify-between py-2 border-b border-dark-border">
                      <span className="text-gray-400">Beoordeeld</span>
                      <span className="text-white">{formatDate(selectedApplication.reviewedAt)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-dark-border">
                      <span className="text-gray-400">Beoordeeld door</span>
                      <span className="text-white">{selectedApplication.reviewedBy}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Flags */}
              {selectedApplication.flags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Aandachtspunten
                  </h3>
                  <div className="space-y-2">
                    {selectedApplication.flags.map((flag, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm flex items-center gap-2"
                      >
                        <Flag className="w-4 h-4 flex-shrink-0" />
                        {flag}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-3">Documenten</h3>
                <div className="space-y-2">
                  {selectedApplication.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-dark-surface rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getDocStatusIcon(doc.status)}
                        <div>
                          <p className="text-white text-sm">{doc.type}</p>
                          <p className="text-xs text-gray-500">
                            Geüpload: {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          doc.status === 'verified' ? 'bg-green-500/20 text-green-400' :
                          doc.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {doc.status === 'verified' ? 'Geverifieerd' :
                           doc.status === 'rejected' ? 'Afgewezen' : 'Wacht op review'}
                        </span>
                        <button className="p-1.5 text-gray-400 hover:text-primary">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedApplication.notes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white mb-3">Notities</h3>
                  <div className="space-y-2">
                    {selectedApplication.notes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-dark-surface rounded-lg text-sm text-gray-300"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add note */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Notitie toevoegen
                </label>
                <textarea
                  rows={2}
                  placeholder="Typ een notitie..."
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedApplication.status === 'pending_review' && (
                  <>
                    <button className="flex-1 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-medium hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Afwijzen
                    </button>
                    <button className="flex-1 py-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg font-medium hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-2">
                      <FileX className="w-5 h-5" />
                      Docs opvragen
                    </button>
                    <button className="flex-1 py-3 bg-green-500 text-dark-bg rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Goedkeuren
                    </button>
                  </>
                )}
                {selectedApplication.status === 'documents_required' && (
                  <button className="flex-1 py-3 bg-primary text-dark-bg rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Herinnering sturen
                  </button>
                )}
                {(selectedApplication.status === 'approved' || selectedApplication.status === 'rejected') && (
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="flex-1 py-3 bg-dark-surface border border-dark-border rounded-lg text-gray-300 font-medium hover:border-primary transition-colors"
                  >
                    Sluiten
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
