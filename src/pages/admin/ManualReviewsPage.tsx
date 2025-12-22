import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  AlertTriangle,
  Clock,
  User,
  Flag,
  Shield,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  FileWarning
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  getManualReviews,
  type ManualReviewCustomer
} from '../../services/compliance';

const getRiskLevelConfig = (level: number | null) => {
  switch (level) {
    case 1:
      return { label: 'Zeer laag', className: 'bg-green-500/20 text-green-400' };
    case 2:
      return { label: 'Laag', className: 'bg-green-500/20 text-green-400' };
    case 3:
      return { label: 'Gemiddeld', className: 'bg-amber-500/20 text-amber-400' };
    case 4:
      return { label: 'Hoog', className: 'bg-orange-500/20 text-orange-400' };
    case 5:
      return { label: 'Zeer hoog', className: 'bg-red-500/20 text-red-400' };
    default:
      return { label: 'Onbekend', className: 'bg-gray-500/20 text-gray-400' };
  }
};

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

const formatTimeAgo = (timestamp: string | null) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} dag${days > 1 ? 'en' : ''} geleden`;
  if (hours > 0) return `${hours} uur geleden`;
  return 'Zojuist';
};

export function ManualReviewsPage() {
  const [reviews, setReviews] = useState<ManualReviewCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getManualReviews();
      setReviews(response.customers);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setError('Kon reviews niet ophalen. Controleer of de backend draait.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(review => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      review.name.toLowerCase().includes(term) ||
      (review.external_id?.toLowerCase().includes(term) ?? false)
    );
  });

  return (
    <AdminLayout
      title="Manual Reviews"
      subtitle="Klanten die handmatige beoordeling vereisen"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{reviews.length}</p>
            <p className="text-sm text-gray-400">Te reviewen</p>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <Flag className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">
              {reviews.filter(r => r.is_pep).length}
            </p>
            <p className="text-sm text-gray-400">PEP klanten</p>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">
              {reviews.filter(r => r.risk_level && r.risk_level >= 4).length}
            </p>
            <p className="text-sm text-gray-400">Hoog risico</p>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">
              {reviews.filter(r => {
                if (!r.submitted_at) return false;
                const days = Math.floor((Date.now() - new Date(r.submitted_at).getTime()) / (1000 * 60 * 60 * 24));
                return days > 3;
              }).length}
            </p>
            <p className="text-sm text-gray-400">&gt; 3 dagen wachtend</p>
          </div>
        </div>
      </div>

      {/* Search and Refresh */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Zoek op naam of klant ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
          />
        </div>
        <button
          onClick={fetchReviews}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-dark-card border border-dark-border rounded-lg text-white hover:bg-dark-surface transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Vernieuwen
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredReviews.length === 0 && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
          <FileWarning className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Geen reviews gevonden
          </h3>
          <p className="text-gray-400">
            {searchTerm
              ? 'Geen klanten gevonden die voldoen aan je zoekopdracht.'
              : 'Er zijn momenteel geen klanten die handmatige review vereisen.'
            }
          </p>
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && filteredReviews.length > 0 && (
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Klant</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Risico</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">PEP</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Land</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Ingediend</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Reden</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actie</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => {
                  const riskConfig = getRiskLevelConfig(review.risk_level);
                  return (
                    <tr
                      key={review.id}
                      className="border-b border-dark-border last:border-0 hover:bg-dark-surface/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{review.name}</p>
                            <p className="text-sm text-gray-400">
                              {review.external_id || `ID: ${review.id}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${riskConfig.className}`}>
                          {review.risk_score !== null && (
                            <span className="font-bold">{review.risk_score}</span>
                          )}
                          {riskConfig.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {review.is_pep ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                            <Flag className="w-3 h-3" />
                            PEP
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white">{review.country_of_residence}</span>
                        {review.nationality !== review.country_of_residence && (
                          <span className="text-gray-400 text-sm ml-1">
                            ({review.nationality})
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white text-sm">
                            {formatTimeAgo(review.submitted_at)}
                          </p>
                          <p className="text-gray-400 text-xs">
                            door {review.submitted_by || 'Onbekend'}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-300 text-sm max-w-[200px] truncate" title={review.review_reason || ''}>
                          {review.review_reason || '-'}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          to={`/admin/manual-reviews/${review.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm font-medium"
                        >
                          Bekijken
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
