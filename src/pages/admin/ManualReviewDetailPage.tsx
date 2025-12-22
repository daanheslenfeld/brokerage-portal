import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Flag,
  Shield,
  FileText,
  History,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  Wallet,
  Search as SearchIcon
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  getManualReviewDetail,
  decideManualReview,
  type ManualReviewDetailResponse,
  type DecisionType
} from '../../services/compliance';

const getRiskLevelConfig = (level: number | null) => {
  switch (level) {
    case 1:
      return { label: 'Zeer laag risico', className: 'bg-green-500/20 text-green-400', barColor: 'bg-green-500' };
    case 2:
      return { label: 'Laag risico', className: 'bg-green-500/20 text-green-400', barColor: 'bg-green-500' };
    case 3:
      return { label: 'Gemiddeld risico', className: 'bg-amber-500/20 text-amber-400', barColor: 'bg-amber-500' };
    case 4:
      return { label: 'Hoog risico', className: 'bg-orange-500/20 text-orange-400', barColor: 'bg-orange-500' };
    case 5:
      return { label: 'Zeer hoog risico', className: 'bg-red-500/20 text-red-400', barColor: 'bg-red-500' };
    default:
      return { label: 'Onbekend', className: 'bg-gray-500/20 text-gray-400', barColor: 'bg-gray-500' };
  }
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatShortDate = (dateString: string | null) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getActionIcon = (action: string) => {
  if (action.includes('APPROVED')) return <CheckCircle className="w-4 h-4 text-green-400" />;
  if (action.includes('REJECTED')) return <XCircle className="w-4 h-4 text-red-400" />;
  if (action.includes('SUBMIT')) return <FileText className="w-4 h-4 text-blue-400" />;
  if (action.includes('CREATE')) return <User className="w-4 h-4 text-primary" />;
  return <History className="w-4 h-4 text-gray-400" />;
};

export function ManualReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<ManualReviewDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Decision form state
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionType, setDecisionType] = useState<DecisionType | null>(null);
  const [reason, setReason] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getManualReviewDetail(parseInt(id));
      setData(response);
    } catch (err) {
      console.error('Failed to fetch detail:', err);
      setError('Kon klantgegevens niet ophalen.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleOpenDecision = (type: DecisionType) => {
    setDecisionType(type);
    setReason('');
    setSubmitError(null);
    setShowDecisionModal(true);
  };

  const handleSubmitDecision = async () => {
    if (!decisionType || !id) return;

    if (reason.length < 10) {
      setSubmitError('Reden moet minimaal 10 karakters bevatten.');
      return;
    }

    if (!reviewerName.trim()) {
      setSubmitError('Vul je naam in.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await decideManualReview(parseInt(id), {
        decision: decisionType,
        reason: reason.trim(),
        reviewer_name: reviewerName.trim()
      });

      setShowDecisionModal(false);
      // Redirect back to list with success message
      navigate('/admin/manual-reviews', {
        state: { message: `Klant succesvol ${decisionType === 'APPROVED' ? 'goedgekeurd' : 'afgewezen'}.` }
      });
    } catch (err: any) {
      console.error('Failed to submit decision:', err);
      setSubmitError(err.message || 'Kon beslissing niet opslaan.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Manual Review" subtitle="Details laden...">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout title="Manual Review" subtitle="Fout">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error || 'Klant niet gevonden.'}</p>
          <Link
            to="/admin/manual-reviews"
            className="inline-flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white hover:bg-dark-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar overzicht
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const { customer, audit_trail, documents, screening_results } = data;
  const riskConfig = getRiskLevelConfig(customer.risk_level);

  return (
    <AdminLayout
      title={customer.name}
      subtitle={`Klant ID: ${customer.external_id || customer.id}`}
    >
      {/* Back Button */}
      <Link
        to="/admin/manual-reviews"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar overzicht
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Klantgegevens
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Naam</p>
                <p className="text-white font-medium">{customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Geboortedatum</p>
                <p className="text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {formatShortDate(customer.date_of_birth)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Woonland</p>
                <p className="text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {customer.country_of_residence}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Nationaliteit</p>
                <p className="text-white">{customer.nationality}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Bron van vermogen</p>
                <p className="text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-gray-500" />
                  {customer.source_of_wealth}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">PEP Status</p>
                {customer.is_pep ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                    <Flag className="w-4 h-4" />
                    Politically Exposed Person
                  </span>
                ) : (
                  <span className="text-gray-400">Geen PEP</span>
                )}
              </div>
            </div>
          </div>

          {/* Risk Assessment Card */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Risicobeoordeling
            </h3>

            <div className="flex items-center gap-4 mb-4">
              <div className={`px-4 py-2 rounded-lg ${riskConfig.className}`}>
                <p className="text-2xl font-bold">{customer.risk_score ?? '-'}</p>
                <p className="text-sm">{riskConfig.label}</p>
              </div>
              <div className="flex-1">
                <div className="h-3 bg-dark-surface rounded-full overflow-hidden">
                  <div
                    className={`h-full ${riskConfig.barColor} transition-all`}
                    style={{ width: `${Math.min(customer.risk_score ?? 0, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {customer.review_reason && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-sm text-amber-400 font-medium mb-1">Reden voor manual review:</p>
                <p className="text-white">{customer.review_reason}</p>
              </div>
            )}
          </div>

          {/* Documents Card */}
          {documents.length > 0 && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Documenten ({documents.length})
              </h3>

              <div className="space-y-3">
                {documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-dark-surface rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white text-sm font-medium">{doc.type}</p>
                        <p className="text-gray-400 text-xs">{formatShortDate(doc.uploaded_at)}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      doc.verified
                        ? 'bg-green-500/20 text-green-400'
                        : doc.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {doc.verified ? 'Geverifieerd' : doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Screening Results */}
          {screening_results.length > 0 && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <SearchIcon className="w-5 h-5 text-primary" />
                Screening Resultaten ({screening_results.length})
              </h3>

              <div className="space-y-3">
                {screening_results.map((screening: any) => (
                  <div
                    key={screening.id}
                    className="flex items-center justify-between p-3 bg-dark-surface rounded-lg"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{screening.type}</p>
                      <p className="text-gray-400 text-xs">{formatShortDate(screening.screened_at)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      screening.result === 'CLEAR'
                        ? 'bg-green-500/20 text-green-400'
                        : screening.result === 'HIT'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {screening.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions Card */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Beslissing</h3>

            <div className="space-y-3">
              <button
                onClick={() => handleOpenDecision('APPROVED')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                Goedkeuren
              </button>
              <button
                onClick={() => handleOpenDecision('REJECTED')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors font-medium"
              >
                <XCircle className="w-5 h-5" />
                Afwijzen
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-dark-border">
              <p className="text-sm text-gray-400">
                Ingediend op: <span className="text-white">{formatDate(customer.submitted_at)}</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Door: <span className="text-white">{customer.submitted_by || 'Onbekend'}</span>
              </p>
            </div>
          </div>

          {/* Audit Trail Card */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Audit Trail
            </h3>

            {audit_trail.length === 0 ? (
              <p className="text-gray-400 text-sm">Geen audit logs gevonden.</p>
            ) : (
              <div className="space-y-4">
                {audit_trail.slice(0, 10).map((entry, index) => (
                  <div key={index} className="relative pl-6 pb-4 border-l-2 border-dark-border last:pb-0">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 bg-dark-card rounded-full border-2 border-dark-border flex items-center justify-center">
                      {getActionIcon(entry.action)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{entry.action}</p>
                      <p className="text-gray-400 text-xs">
                        {entry.user} ({entry.role})
                      </p>
                      {entry.reason && (
                        <p className="text-gray-300 text-sm mt-1 italic">"{entry.reason}"</p>
                      )}
                      <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      {showDecisionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              {decisionType === 'APPROVED' ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  Klant goedkeuren
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-400" />
                  Klant afwijzen
                </>
              )}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Je naam (voor audit trail) *
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Bijv. Jan de Vries"
                  className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Reden voor {decisionType === 'APPROVED' ? 'goedkeuring' : 'afwijzing'} *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Geef een duidelijke toelichting (min. 10 karakters)..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {reason.length}/10 karakters minimum
                </p>
              </div>

              {submitError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{submitError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDecisionModal(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-white hover:bg-dark-border transition-colors disabled:opacity-50"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleSubmitDecision}
                  disabled={submitting || reason.length < 10 || !reviewerName.trim()}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                    decisionType === 'APPROVED'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {submitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : decisionType === 'APPROVED' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Goedkeuren
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Afwijzen
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
