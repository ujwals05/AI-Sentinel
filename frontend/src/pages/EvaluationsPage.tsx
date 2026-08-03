import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { Evaluation, RiskLevel, EvaluationDecision, EvaluationStatus } from '../types';
import { useEvaluations } from '../hooks/useEvaluations';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function DecisionBadge({ decision }: { decision: EvaluationDecision | string }) {
  const map: Record<string, string> = {
    PASS: 'bg-emerald-100 text-emerald-900 border-emerald-700',
    REVIEW: 'bg-amber-100 text-amber-900 border-amber-700',
    REJECT: 'bg-error-container text-on-error-container border-error',
  };
  return <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border-2 ${map[decision] ?? 'bg-surface-container text-on-surface-variant border-outline'}`}>{decision}</span>;
}

function RiskBadge({ risk }: { risk: RiskLevel | string }) {
  const map: Record<string, string> = {
    LOW: 'bg-emerald-100 text-emerald-900 border-emerald-700',
    MEDIUM: 'bg-amber-100 text-amber-900 border-amber-700',
    HIGH: 'bg-red-100 text-red-900 border-red-700',
    CRITICAL: 'bg-error-container text-on-error-container border-error',
  };
  return <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border ${map[risk] ?? 'bg-surface-container text-on-surface-variant border-outline'}`}>{risk}</span>;
}

function StatusBadge({ status }: { status: EvaluationStatus | string }) {
  const map: Record<string, string> = {
    COMPLETED: 'bg-emerald-100 text-emerald-900 border-emerald-700',
    RUNNING: 'bg-primary-container text-on-primary-container border-primary',
    PENDING: 'bg-surface-container text-on-surface-variant border-outline',
    FAILED: 'bg-error-container text-on-error-container border-error',
  };
  return (
    <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border flex items-center gap-1 w-fit ${map[status] ?? ''}`}>
      {status === 'RUNNING' && <span className="material-symbols-outlined text-[12px] animate-spin">autorenew</span>}
      {status}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-400' : 'bg-red-500';
  const textColor = score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-amber-700' : 'text-red-700';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-surface-container border border-on-surface overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`font-mono text-xs font-bold ${textColor}`}>{score}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EvaluationsPage() {
  const navigate = useNavigate();
  const [decisionFilter, setDecisionFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useEvaluations();
  const evaluations = data?.evaluations || [];

  const filtered = evaluations.filter(ev => {
    if (decisionFilter !== 'ALL' && ev.decision !== decisionFilter) return false;
    if (riskFilter !== 'ALL' && ev.riskLevel !== riskFilter) return false;
    if (statusFilter !== 'ALL' && ev.status !== statusFilter) return false;
    const appName = ev.application?.name || '';
    const convId = ev.conversation?.externalId || '';
    if (search && !appName.toLowerCase().includes(search.toLowerCase()) && !convId.includes(search) && !ev.id.includes(search)) return false;
    return true;
  });

  const validScores = evaluations.filter(e => e.overallScore !== undefined && e.overallScore !== null);
  const stats = {
    total: evaluations.length,
    pass: evaluations.filter(e => e.decision === 'PASS').length,
    review: evaluations.filter(e => e.decision === 'REVIEW').length,
    reject: evaluations.filter(e => e.decision === 'REJECT').length,
    avgScore: validScores.length > 0 
      ? Math.round(validScores.reduce((s, e) => s + (e.overallScore ?? 0), 0) / validScores.length) 
      : 0,
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div>
        <h2 className="font-geist text-2xl font-extrabold tracking-tight">Evaluations</h2>
        <p className="font-geist text-sm text-on-surface-variant mt-1">
          AI judge evaluation history across all applications and conversations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: '' },
          { label: 'Passed', value: stats.pass, color: 'text-emerald-600' },
          { label: 'Review', value: stats.review, color: 'text-amber-600' },
          { label: 'Rejected', value: stats.reject, color: 'text-red-600' },
          { label: 'Avg Score', value: `${stats.avgScore}/100`, color: 'text-primary' },
        ].map(s => (
          <div key={s.label} className="bg-white border-2 border-on-surface p-4 neo-shadow-sm">
            <p className="font-mono text-[10px] font-bold uppercase text-on-surface-variant mb-1">{s.label}</p>
            <p className={`font-geist text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[16px]">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, app or conversation..."
            className="pl-8 pr-3 py-1.5 bg-white border-2 border-on-surface font-mono text-[11px] outline-none focus:ring-2 focus:ring-primary w-64"
          />
        </div>
        {[
          { label: 'Decision', value: decisionFilter, setter: setDecisionFilter, options: ['ALL', 'PASS', 'REVIEW', 'REJECT'] },
          { label: 'Risk', value: riskFilter, setter: setRiskFilter, options: ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
          { label: 'Status', value: statusFilter, setter: setStatusFilter, options: ['ALL', 'COMPLETED', 'RUNNING', 'PENDING', 'FAILED'] },
        ].map(f => (
          <select
            key={f.label}
            value={f.value}
            onChange={e => f.setter(e.target.value)}
            className="px-3 py-1.5 bg-white border-2 border-on-surface font-mono text-[11px] font-bold outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {f.options.map(o => <option key={o} value={o}>{o === 'ALL' ? `All ${f.label}s` : o}</option>)}
          </select>
        ))}
        <p className="font-mono text-[11px] text-on-surface-variant ml-auto">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-on-surface neo-shadow overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="material-symbols-outlined text-4xl animate-spin text-primary">autorenew</span>
            <p className="font-geist text-sm font-bold text-on-surface-variant">Loading evaluations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="material-symbols-outlined text-6xl text-outline-variant">fact_check</span>
            <h3 className="font-geist text-lg font-bold text-on-surface-variant">No evaluations found</h3>
            <p className="font-geist text-sm text-on-surface-variant text-center max-w-sm">
              Evaluations are automatically triggered when external applications send data through <code className="font-mono bg-surface-container px-1">/api/v1/ingest</code>.
            </p>
            <Link
              to="/api-integration"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary border-2 border-on-surface neo-shadow font-mono text-xs font-bold hover:neo-shadow-active transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">key</span>
              Set Up Integration
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-surface-container border-b-2 border-on-surface">
                  {['Evaluation ID', 'Application', 'Conversation', 'Status', 'Score', 'Risk', 'Decision', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y border-on-surface">
                {filtered.map(ev => {
                  const appName = ev.application?.name || 'Unknown Application';
                  const convId = ev.conversation?.externalId || 'Unknown Conversation';
                  
                  return (
                  <tr
                    key={ev.id}
                    onClick={() => navigate(`/evaluations/${ev.id}`)}
                    className="hover:bg-surface-container-lowest transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-bold text-primary group-hover:underline">
                      {ev.id.toUpperCase().slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 font-geist text-sm">{appName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{convId}</td>
                    <td className="px-4 py-3"><StatusBadge status={ev.status} /></td>
                    <td className="px-4 py-3">
                      {ev.overallScore !== undefined && ev.overallScore !== null ? <ScoreBar score={ev.overallScore} /> : <span className="text-on-surface-variant">—</span>}
                    </td>
                    <td className="px-4 py-3">{ev.riskLevel ? <RiskBadge risk={ev.riskLevel} /> : '—'}</td>
                    <td className="px-4 py-3">{ev.decision ? <DecisionBadge decision={ev.decision} /> : '—'}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-on-surface-variant">
                      {new Date(ev.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
