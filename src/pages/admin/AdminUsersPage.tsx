import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Mail,
  Calendar,
  Shield,
  Eye,
  Edit,
  Trash2,
  Download,
  X,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getAllCustomers, type ManualReviewCustomer } from '../../services/compliance';

const STATUS_OPTIONS = ['Alle', 'APPROVED', 'MANUAL_REVIEW', 'REJECTED', 'SUBMITTED', 'DRAFT'] as const;

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return { label: 'Goedgekeurd', className: 'bg-green-500/20 text-green-400', icon: CheckCircle };
    case 'MANUAL_REVIEW':
      return { label: 'In Review', className: 'bg-amber-500/20 text-amber-400', icon: Clock };
    case 'REJECTED':
      return { label: 'Afgewezen', className: 'bg-red-500/20 text-red-400', icon: XCircle };
    case 'SUBMITTED':
      return { label: 'Ingediend', className: 'bg-blue-500/20 text-blue-400', icon: FileText };
    case 'DRAFT':
      return { label: 'Concept', className: 'bg-gray-500/20 text-gray-400', icon: FileText };
    default:
      return { label: status || 'Onbekend', className: 'bg-gray-500/20 text-gray-400', icon: FileText };
  }
};

const getRiskBadge = (riskLevel: number | null) => {
  if (riskLevel === null) return { label: '-', className: 'text-gray-500' };
  if (riskLevel <= 2) return { label: 'Laag', className: 'bg-green-500/20 text-green-400' };
  if (riskLevel <= 3) return { label: 'Medium', className: 'bg-amber-500/20 text-amber-400' };
  return { label: 'Hoog', className: 'bg-red-500/20 text-red-400' };
};

export function AdminUsersPage() {
  const [customers, setCustomers] = useState<ManualReviewCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_OPTIONS[number]>('Alle');
  const [selectedCustomer, setSelectedCustomer] = useState<ManualReviewCustomer | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCustomers();
      setCustomers(response.customers);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      setError('Kon klanten niet ophalen. Controleer of de backend draait.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!customer.name.toLowerCase().includes(term) &&
            !(customer.external_id?.toLowerCase().includes(term))) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'Alle' && customer.workflow_status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [customers, searchTerm, statusFilter]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const clearFilters = () => {
    setStatusFilter('Alle');
    setSearchTerm('');
  };

  const hasActiveFilters = statusFilter !== 'Alle';

  if (loading) {
    return (
      <AdminLayout title="Klanten" subtitle="Laden...">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Klanten" subtitle="Fout">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchCustomers}
            className="inline-flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white hover:bg-dark-surface transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Opnieuw proberen
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Klanten" subtitle={`${filteredCustomers.length} klanten gevonden`}>
      {/* Search and filters */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Zoek op naam of ID..."
              className="w-full bg-dark-surface border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-gray-300"
          >
            <Filter className="w-5 h-5" />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
          </button>

          {/* Desktop filters */}
          <div className="hidden lg:flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none"
            >
              <option value="Alle">Alle statussen</option>
              <option value="APPROVED">Goedgekeurd</option>
              <option value="MANUAL_REVIEW">In Review</option>
              <option value="SUBMITTED">Ingediend</option>
              <option value="REJECTED">Afgewezen</option>
              <option value="DRAFT">Concept</option>
            </select>
          </div>

          {/* Refresh button */}
          <button
            onClick={fetchCustomers}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-gray-300 hover:border-primary hover:text-primary transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Vernieuwen
          </button>

          {/* Export button */}
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-gray-300 hover:border-primary hover:text-primary transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Mobile filters */}
        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-dark-border">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            >
              <option value="Alle">Alle statussen</option>
              <option value="APPROVED">Goedgekeurd</option>
              <option value="MANUAL_REVIEW">In Review</option>
              <option value="SUBMITTED">Ingediend</option>
              <option value="REJECTED">Afgewezen</option>
              <option value="DRAFT">Concept</option>
            </select>
          </div>
        )}

        {/* Active filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-dark-border">
            <span className="text-sm text-gray-500">Actieve filters:</span>
            {statusFilter !== 'Alle' && (
              <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs flex items-center gap-1">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('Alle')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-primary">
              Wis alles
            </button>
          </div>
        )}
      </div>

      {/* Customers table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left p-4 text-sm font-medium text-gray-400">Klant</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Risico</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">PEP</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Land</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Aangemaakt</th>
                <th className="text-right p-4 text-sm font-medium text-gray-400">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredCustomers.map((customer) => {
                const statusBadge = getStatusBadge(customer.workflow_status);
                const riskBadge = getRiskBadge(customer.risk_level);
                const StatusIcon = statusBadge.icon;

                return (
                  <tr key={customer.id} className="hover:bg-dark-surface/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-dark-surface rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{customer.name}</p>
                          <p className="text-sm text-gray-500">
                            {customer.external_id || `ID: ${customer.id}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${statusBadge.className}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="p-4">
                      {customer.risk_score !== null ? (
                        <span className={`text-xs px-2 py-1 rounded-full ${riskBadge.className}`}>
                          {riskBadge.label} ({customer.risk_score})
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {customer.is_pep ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                          <Shield className="w-3 h-3" />
                          PEP
                        </span>
                      ) : (
                        <span className="text-gray-500">Nee</span>
                      )}
                    </td>
                    <td className="p-4 text-white">
                      {customer.country_of_residence}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {formatDate(customer.created_at)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-dark-surface rounded-lg transition-colors"
                          title="Bekijken"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {customer.workflow_status === 'MANUAL_REVIEW' && (
                          <Link
                            to={`/admin/manual-reviews/${customer.id}`}
                            className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                            title="Review"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Geen klanten gevonden</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-2 text-primary hover:text-primary-dark">
                Filters wissen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Customer detail modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-dark-surface rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-primary">
                      {selectedCustomer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedCustomer.name}</h2>
                    <p className="text-gray-400">{selectedCustomer.external_id || `ID: ${selectedCustomer.id}`}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-dark-surface rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(selectedCustomer.workflow_status).className}`}>
                    {getStatusBadge(selectedCustomer.workflow_status).label}
                  </span>
                </div>
                <div className="bg-dark-surface rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Risico Score</p>
                  <p className="text-white font-medium">
                    {selectedCustomer.risk_score !== null ? selectedCustomer.risk_score : '-'}
                  </p>
                </div>
                <div className="bg-dark-surface rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">PEP Status</p>
                  {selectedCustomer.is_pep ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                      Ja - PEP
                    </span>
                  ) : (
                    <span className="text-gray-400">Nee</span>
                  )}
                </div>
                <div className="bg-dark-surface rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Bron Vermogen</p>
                  <p className="text-white capitalize">{selectedCustomer.source_of_wealth}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-dark-border">
                  <span className="text-gray-400">Nationaliteit</span>
                  <span className="text-white">{selectedCustomer.nationality}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-dark-border">
                  <span className="text-gray-400">Woonland</span>
                  <span className="text-white">{selectedCustomer.country_of_residence}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-dark-border">
                  <span className="text-gray-400">Geboortedatum</span>
                  <span className="text-white">{formatDate(selectedCustomer.date_of_birth)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-dark-border">
                  <span className="text-gray-400">Aangemaakt</span>
                  <span className="text-white">{formatDate(selectedCustomer.created_at)}</span>
                </div>
                {selectedCustomer.review_reason && (
                  <div className="flex justify-between py-2 border-b border-dark-border">
                    <span className="text-gray-400">Review Reden</span>
                    <span className="text-amber-400 text-sm text-right max-w-[200px]">
                      {selectedCustomer.review_reason}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="flex-1 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-gray-300 hover:border-primary transition-colors font-medium"
                >
                  Sluiten
                </button>
                {selectedCustomer.workflow_status === 'MANUAL_REVIEW' && (
                  <Link
                    to={`/admin/manual-reviews/${selectedCustomer.id}`}
                    className="flex-1 py-2.5 bg-primary text-dark-bg rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Review
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
