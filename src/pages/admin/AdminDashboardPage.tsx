import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  FileCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  MOCK_ADMIN_STATS,
  MOCK_ACTIVITY_LOG,
  MOCK_ONBOARDING_APPLICATIONS
} from '../../data/mockAdminData';

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'user_registered':
      return { icon: UserPlus, color: 'text-blue-400', bg: 'bg-blue-500/20' };
    case 'onboarding_completed':
      return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' };
    case 'onboarding_started':
      return { icon: FileText, color: 'text-primary', bg: 'bg-primary/20' };
    case 'document_uploaded':
      return { icon: FileCheck, color: 'text-purple-400', bg: 'bg-purple-500/20' };
    case 'application_approved':
      return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' };
    case 'application_rejected':
      return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' };
    case 'deposit':
      return { icon: ArrowDownRight, color: 'text-green-400', bg: 'bg-green-500/20' };
    case 'withdrawal':
      return { icon: ArrowUpRight, color: 'text-amber-400', bg: 'bg-amber-500/20' };
    default:
      return { icon: FileText, color: 'text-gray-400', bg: 'bg-gray-500/20' };
  }
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

export function AdminDashboardPage() {
  const stats = MOCK_ADMIN_STATS;
  const pendingApplications = MOCK_ONBOARDING_APPLICATIONS.filter(
    a => a.status === 'pending_review' || a.status === 'documents_required'
  );

  return (
    <AdminLayout title="Dashboard" subtitle="Overzicht van je brokerage platform">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">
              +{stats.newUsersThisMonth}
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
          <p className="text-sm text-gray-500">Totaal gebruikers</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
              Actie vereist
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.pendingOnboarding}</p>
          <p className="text-sm text-gray-500">Wachtend op review</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            €{(stats.totalAUM / 1000000).toFixed(1)}M
          </p>
          <p className="text-sm text-gray-500">Assets Under Management</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.conversionRate}%</p>
          <p className="text-sm text-gray-500">Onboarding conversie</p>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{stats.activeUsers}</p>
            <p className="text-sm text-gray-500">Actieve gebruikers</p>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <FileCheck className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{stats.completedOnboardingThisMonth}</p>
            <p className="text-sm text-gray-500">Onboarding voltooid (maand)</p>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{stats.averageOnboardingTime} dagen</p>
            <p className="text-sm text-gray-500">Gem. onboarding tijd</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending applications */}
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-dark-border flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Wachtende Aanvragen ({pendingApplications.length})
            </h2>
            <Link
              to="/admin/onboarding"
              className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
            >
              Alle bekijken
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {pendingApplications.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p>Geen wachtende aanvragen</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-border">
              {pendingApplications.slice(0, 4).map((app) => (
                <Link
                  key={app.id}
                  to={`/admin/onboarding/${app.id}`}
                  className="p-4 flex items-center justify-between hover:bg-dark-surface transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-dark-surface rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {app.firstName[0]}{app.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {app.firstName} {app.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{app.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      app.status === 'pending_review'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {app.status === 'pending_review' ? 'Review nodig' : 'Docs nodig'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(app.submittedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-dark-border">
            <h2 className="font-semibold text-white">Recente Activiteit</h2>
          </div>

          <div className="divide-y divide-dark-border max-h-[400px] overflow-y-auto">
            {MOCK_ACTIVITY_LOG.map((activity) => {
              const { icon: Icon, color, bg } = getActivityIcon(activity.type);

              return (
                <div key={activity.id} className="p-4 flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      <span className="font-medium">{activity.userName}</span>
                    </p>
                    <p className="text-sm text-gray-400">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/users"
          className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-primary/50 transition-colors group"
        >
          <Users className="w-6 h-6 text-primary mb-2" />
          <p className="font-medium text-white">Gebruikers beheren</p>
          <p className="text-sm text-gray-500">Bekijk en bewerk gebruikers</p>
        </Link>

        <Link
          to="/admin/onboarding"
          className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-primary/50 transition-colors group"
        >
          <FileCheck className="w-6 h-6 text-primary mb-2" />
          <p className="font-medium text-white">Onboarding aanvragen</p>
          <p className="text-sm text-gray-500">Review en goedkeuren</p>
        </Link>

        <Link
          to="/admin/settings"
          className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-primary/50 transition-colors group"
        >
          <TrendingUp className="w-6 h-6 text-primary mb-2" />
          <p className="font-medium text-white">Rapportages</p>
          <p className="text-sm text-gray-500">Exporteer data en rapporten</p>
        </Link>

        <Link
          to="/admin/settings"
          className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-primary/50 transition-colors group"
        >
          <Clock className="w-6 h-6 text-primary mb-2" />
          <p className="font-medium text-white">Audit log</p>
          <p className="text-sm text-gray-500">Bekijk alle systeemactiviteit</p>
        </Link>
      </div>
    </AdminLayout>
  );
}
