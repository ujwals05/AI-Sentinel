import { useNavigate } from 'react-router-dom';
import {
  Bot, Terminal, BrainCircuit, Webhook, Grid,
  ChevronRight, ClipboardCheck, MessageSquare, KeyRound,
  RefreshCw, CheckCircle2, XCircle, AlertTriangle,
  TrendingUp, Zap,
} from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import { useEvaluations } from '../hooks/useEvaluations';
import type { ApplicationType } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<ApplicationType, any> = {
  CHATBOT: Bot,
  CODE_ASSISTANT: Terminal,
  AI_AGENT: BrainCircuit,
  API: Webhook,
  OTHER: Grid,
};

const TYPE_COLORS: Record<ApplicationType, string> = {
  CHATBOT: 'bg-secondary-container text-on-secondary-container',
  CODE_ASSISTANT: 'bg-surface-variant text-on-surface-variant',
  AI_AGENT: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  API: 'bg-primary-fixed text-on-primary-fixed-variant',
  OTHER: 'bg-surface-container text-on-surface',
};

function DecisionBadge({ decision }: { decision?: string | null }) {
  if (!decision) return <span className="text-on-surface-variant font-mono text-[10px]">—</span>;
  const map: Record<string, string> = {
    PASS: 'bg-emerald-100 text-emerald-900 border-emerald-700',
    REVIEW: 'bg-amber-100 text-amber-900 border-amber-700',
    REJECT: 'bg-red-100 text-red-900 border-red-700',
  };
  return (
    <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border-2 ${map[decision] ?? 'bg-surface-container text-on-surface-variant border-outline'}`}>
      {decision}
    </span>
  );
}

function RiskBadge({ risk }: { risk?: string | null }) {
  if (!risk) return <span className="text-on-surface-variant font-mono text-[10px]">—</span>;
  const map: Record<string, string> = {
    LOW: 'bg-emerald-100 text-emerald-900 border-emerald-700',
    MEDIUM: 'bg-amber-100 text-amber-900 border-amber-700',
    HIGH: 'bg-red-100 text-red-900 border-red-700',
    CRITICAL: 'bg-error-container text-on-error-container border-error',
  };
  return (
    <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border ${map[risk] ?? 'bg-surface-container text-on-surface-variant border-outline'}`}>
      {risk}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    COMPLETED: 'bg-emerald-100 text-emerald-900 border-emerald-700',
    RUNNING: 'bg-primary-container text-on-primary-container border-primary',
    PENDING: 'bg-surface-container text-on-surface-variant border-outline',
    FAILED: 'bg-red-100 text-red-900 border-red-700',
  };
  return (
    <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border ${map[status] ?? 'bg-surface-container text-on-surface-variant border-outline'}`}>
      {status}
    </span>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data: applications = [], isLoading: appsLoading, refetch: refetchApps } = useApplications();
  const { data: evalData, isLoading: evalsLoading, refetch: refetchEvals } = useEvaluations({ limit: 10 });

  const evaluations = evalData?.evaluations ?? [];

  const activeApps = applications.filter(a => a.status === 'ACTIVE').length;
  const totalConversations = applications.reduce((s, a) => s + (a._count?.conversations ?? 0), 0);
  const totalEvaluations = applications.reduce((s, a) => s + (a._count?.evaluations ?? 0), 0);
  const passedEvals = evaluations.filter(e => e.decision === 'PASS').length;
  const blockedEvals = evaluations.filter(e => e.decision === 'REJECT').length;

  const handleRefresh = () => {
    refetchApps();
    refetchEvals();
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-geist text-2xl font-extrabold tracking-tight leading-tight">
            AI Quality Overview
          </h2>
          <p className="font-geist text-sm text-on-surface-variant">
            Monitoring governance metrics across all production agents.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-on-surface text-surface text-sm font-bold border-2 border-on-surface neo-shadow hover:neo-shadow-active transition-all cursor-pointer"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'Total Applications',
            value: appsLoading ? '…' : applications.length,
            icon: Grid,
            color: 'text-on-surface-variant',
          },
          {
            label: 'Active Applications',
            value: appsLoading ? '…' : activeApps,
            icon: CheckCircle2,
            color: 'text-emerald-600',
          },
          {
            label: 'Total Conversations',
            value: appsLoading ? '…' : formatNumber(totalConversations),
            icon: MessageSquare,
            color: 'text-primary',
          },
          {
            label: 'Total Evaluations',
            value: appsLoading ? '…' : formatNumber(totalEvaluations),
            icon: ClipboardCheck,
            color: 'text-on-surface',
          },
          {
            label: 'Recent Blocks',
            value: evalsLoading ? '…' : blockedEvals,
            icon: XCircle,
            color: 'text-red-600',
            highlight: true,
          },
        ].map((m) => (
          <div
            key={m.label}
            className={`border-2 border-on-surface p-4 neo-shadow hover:translate-y-[-2px] transition-all ${m.highlight ? 'bg-red-50' : 'bg-white'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <m.icon size={16} className={m.color} />
              <p className="font-mono text-[10px] font-bold text-on-surface-variant uppercase">{m.label}</p>
            </div>
            <span className="font-geist text-2xl font-bold">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Main content: Applications + Recent Evaluations */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Applications List — 2/5 width */}
        <div className="lg:col-span-2 bg-white border-2 border-on-surface neo-shadow">
          <div className="p-4 border-b-2 border-on-surface flex justify-between items-center">
            <h3 className="font-geist text-lg font-bold">Applications</h3>
            <button
              onClick={() => navigate('/applications')}
              className="font-mono text-[11px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          {appsLoading ? (
            <div className="flex items-center justify-center py-16">
              <p className="font-geist text-sm text-on-surface-variant animate-pulse">Loading applications…</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 px-4 text-center">
              <Grid size={40} className="text-outline-variant" strokeWidth={1} />
              <p className="font-geist text-sm font-bold text-on-surface-variant">No applications yet</p>
              <p className="font-mono text-[10px] text-on-surface-variant">Create an application to start monitoring.</p>
              <button
                onClick={() => navigate('/applications')}
                className="mt-2 px-4 py-2 bg-primary text-on-primary border-2 border-on-surface font-mono text-[11px] font-bold neo-shadow hover:neo-shadow-active transition-all cursor-pointer"
              >
                Go to Applications
              </button>
            </div>
          ) : (
            <div className="divide-y border-on-surface">
              {applications.slice(0, 8).map(app => {
                const AppIcon = TYPE_ICONS[app.type];
                return (
                  <div
                    key={app.id}
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="flex items-center gap-3 p-3 hover:bg-surface-container-lowest cursor-pointer transition-colors group"
                  >
                    <div className={`w-9 h-9 border-2 border-on-surface flex items-center justify-center shrink-0 ${TYPE_COLORS[app.type]}`}>
                      <AppIcon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-geist text-sm font-bold truncate group-hover:text-primary transition-colors">{app.name}</p>
                      <div className="flex gap-3 mt-0.5">
                        <span className="font-mono text-[10px] text-on-surface-variant flex items-center gap-1">
                          <MessageSquare size={10} /> {app._count?.conversations ?? 0}
                        </span>
                        <span className="font-mono text-[10px] text-on-surface-variant flex items-center gap-1">
                          <ClipboardCheck size={10} /> {app._count?.evaluations ?? 0}
                        </span>
                        <span className="font-mono text-[10px] text-on-surface-variant flex items-center gap-1">
                          <KeyRound size={10} /> {app._count?.apiKeys ?? 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`font-mono text-[9px] font-bold uppercase px-1.5 py-0.5 border ${
                        app.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-700'
                          : 'bg-surface-container text-on-surface-variant border-outline'
                      }`}>{app.status}</span>
                      <ChevronRight size={14} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Evaluations — 3/5 width */}
        <div className="lg:col-span-3 bg-white border-2 border-on-surface neo-shadow">
          <div className="p-4 border-b-2 border-on-surface flex justify-between items-center">
            <h3 className="font-geist text-lg font-bold">Recent Evaluations</h3>
            <button
              onClick={() => navigate('/evaluations')}
              className="font-mono text-[11px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          {evalsLoading ? (
            <div className="flex items-center justify-center py-16">
              <p className="font-geist text-sm text-on-surface-variant animate-pulse">Loading evaluations…</p>
            </div>
          ) : evaluations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 px-4 text-center">
              <ClipboardCheck size={40} className="text-outline-variant" strokeWidth={1} />
              <p className="font-geist text-sm font-bold text-on-surface-variant">No evaluations yet</p>
              <p className="font-mono text-[10px] text-on-surface-variant">
                Evaluations will appear here once your applications start sending conversations.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[520px]">
                <thead className="bg-surface-container-low border-b-2 border-on-surface">
                  <tr>
                    {['Application', 'Score', 'Risk', 'Decision', 'Status', 'Time'].map(h => (
                      <th key={h} className="px-4 py-2.5 font-mono text-[10px] font-bold uppercase text-on-surface-variant">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y border-on-surface">
                  {evaluations.map(ev => (
                    <tr
                      key={ev.id}
                      onClick={() => navigate(`/evaluations/${ev.id}`)}
                      className="hover:bg-surface-container-lowest transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-2.5">
                        <div>
                          <p className="font-geist text-sm font-bold group-hover:text-primary transition-colors truncate max-w-[140px]">
                            {ev.application?.name ?? '—'}
                          </p>
                          <p className="font-mono text-[10px] text-on-surface-variant">
                            {ev.conversation?.externalId?.slice(0, 12) ?? ev.id.slice(0, 8)}…
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        {ev.overallScore !== undefined && ev.overallScore !== null ? (
                          <span className={`font-geist text-sm font-bold ${
                            ev.overallScore >= 80 ? 'text-emerald-600'
                              : ev.overallScore >= 60 ? 'text-amber-600'
                              : 'text-red-600'
                          }`}>
                            {Math.round(ev.overallScore)}
                            <span className="text-on-surface-variant text-[10px]">/100</span>
                          </span>
                        ) : <span className="text-on-surface-variant font-mono text-[10px]">—</span>}
                      </td>
                      <td className="px-4 py-2.5"><RiskBadge risk={ev.riskLevel} /></td>
                      <td className="px-4 py-2.5"><DecisionBadge decision={ev.decision} /></td>
                      <td className="px-4 py-2.5"><StatusBadge status={ev.status} /></td>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-on-surface-variant whitespace-nowrap">
                        {timeAgo(ev.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      {!evalsLoading && evaluations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: TrendingUp, iconBg: 'bg-primary-fixed', iconColor: 'text-on-primary-fixed-variant',
              label: 'Pass Rate (recent)',
              value: evaluations.length > 0
                ? `${Math.round((passedEvals / evaluations.length) * 100)}%`
                : '—',
            },
            {
              icon: AlertTriangle, iconBg: 'bg-amber-100', iconColor: 'text-amber-800',
              label: 'Under Review',
              value: evaluations.filter(e => e.decision === 'REVIEW').length,
            },
            {
              icon: Zap, iconBg: 'bg-secondary-container', iconColor: 'text-on-secondary-container',
              label: 'Avg Score (recent)',
              value: (() => {
                const scored = evaluations.filter(e => e.overallScore !== undefined && e.overallScore !== null);
                if (scored.length === 0) return '—';
                const avg = scored.reduce((s, e) => s + (e.overallScore ?? 0), 0) / scored.length;
                return `${Math.round(avg)}/100`;
              })(),
            },
          ].map(item => (
            <div
              key={item.label}
              className="bg-surface-container-low border-2 border-on-surface p-3 flex items-center gap-3"
            >
              <div className={`w-10 h-10 ${item.iconBg} border-2 border-on-surface flex items-center justify-center shrink-0`}>
                <item.icon size={20} className={item.iconColor} />
              </div>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase text-on-surface-variant">{item.label}</p>
                <p className="font-bold text-base">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
