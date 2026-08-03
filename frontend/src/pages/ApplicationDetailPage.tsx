import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Bot, Terminal, BrainCircuit, Webhook, Grid, MessageSquare, Zap, ClipboardCheck, KeyRound, Search, TriangleAlert, Check, Copy, X, Plus, Pencil, ChevronRight, LayoutDashboard } from 'lucide-react';
import type {
  Application,
  ApplicationType, ApplicationEnvironment
} from '../types';
import { useApplication } from '../hooks/useApplications';
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from '../hooks/useApiKeys';
import { useConversations } from '../hooks/useConversations';
import { useEvaluations } from '../hooks/useEvaluations';
// ─── Helpers ──────────────────────────────────────────────────────────────────

const ENV_COLORS: Record<ApplicationEnvironment, string> = {
  PRODUCTION: 'bg-emerald-100 text-emerald-900 border-emerald-700',
  STAGING: 'bg-amber-100 text-amber-900 border-amber-700',
  DEVELOPMENT: 'bg-surface-container text-on-surface-variant border-outline',
};

const TYPE_ICONS: Record<ApplicationType, any> = {
  CHATBOT: Bot, CODE_ASSISTANT: Terminal, AI_AGENT: BrainCircuit, API: Webhook, OTHER: Grid,
};

function DecisionBadge({ decision }: { decision?: string | null }) {
  if (!decision) return <span className="text-on-surface-variant font-mono text-[10px]">—</span>;
  const map: Record<string, string> = {
    PASS: 'bg-emerald-100 text-emerald-900 border-emerald-700',
    REVIEW: 'bg-amber-100 text-amber-900 border-amber-700',
    REJECT: 'bg-error-container text-on-error-container border-error',
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
    FAILED: 'bg-error-container text-on-error-container border-error',
    ACTIVE: 'bg-emerald-100 text-emerald-900 border-emerald-700',
    ARCHIVED: 'bg-surface-container text-on-surface-variant border-outline',
  };
  return (
    <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border ${map[status] ?? 'bg-surface-container text-on-surface-variant border-outline'}`}>
      {status}
    </span>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab({ app }: { app: Application }) {
  const metrics = [
    { icon: MessageSquare, label: 'Conversations', value: (app._count?.conversations ?? 0).toLocaleString(), color: 'text-primary' },
    { icon: Zap, label: 'Events', value: (app._count?.events ?? 0).toLocaleString(), color: 'text-tertiary' },
    { icon: ClipboardCheck, label: 'Evaluations', value: (app._count?.evaluations ?? 0).toLocaleString(), color: 'text-on-surface' },
    { icon: KeyRound, label: 'API Keys', value: app._count?.apiKeys ?? 0, color: 'text-on-surface-variant' },
  ];

  return (
    <div className="space-y-6">
      {/* App metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border-2 border-on-surface p-5 neo-shadow space-y-4">
          <h3 className="font-geist text-lg font-bold">Application Details</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: 'Application ID', value: app.id, mono: true },
              { label: 'Type', value: app.type.replace('_', ' ') },
              { label: 'Environment', value: app.environment },
              { label: 'Status', value: app.status },
              { label: 'Created', value: new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
              { label: 'Last Updated', value: new Date(app.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
            ].map(item => (
              <div key={item.label}>
                <p className="font-mono text-[10px] font-bold text-on-surface-variant uppercase mb-0.5">{item.label}</p>
                <p className={`text-sm font-bold ${item.mono ? 'font-mono text-primary text-xs' : 'font-geist'}`}>{item.value}</p>
              </div>
            ))}
          </div>
          {app.description && (
            <div className="pt-2 border-t border-outline-variant">
              <p className="font-mono text-[10px] font-bold text-on-surface-variant uppercase mb-1">Description</p>
              <p className="font-geist text-sm text-on-surface-variant">{app.description}</p>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          {metrics.map(m => (
            <div key={m.label} className="bg-white border-2 border-on-surface p-4 neo-shadow-sm flex items-center gap-3">
              <m.icon size={24} className={m.color} />
              <div>
                <p className="font-mono text-[10px] font-bold text-on-surface-variant uppercase">{m.label}</p>
                <p className="font-geist text-xl font-bold">{m.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Guide */}
      <div className="bg-surface-container-low border-l-4 border-l-primary p-4">
        <p className="font-mono text-[10px] font-bold uppercase text-primary mb-1">Integration Endpoint</p>
        <code className="font-mono text-xs text-on-surface">POST {import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'}/api/v1/ingest</code>
        <p className="font-mono text-[10px] text-on-surface-variant mt-1">Use your API key as a Bearer token in the Authorization header. Navigate to the Evaluations tab to view results.</p>
      </div>
    </div>
  );
}

// ─── Tab: Conversations ───────────────────────────────────────────────────────

function ConversationsTab({ appId }: { appId: string }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useConversations(appId);
  const conversations = data?.conversations || [];

  const filtered = conversations.filter(c =>
    search === '' ||
    (c.externalId.includes(search)) ||
    (c.title?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center text-on-surface-variant">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID or title..."
            className="pl-8 pr-3 py-1.5 bg-white border-2 border-on-surface font-mono text-[11px] outline-none focus:ring-2 focus:ring-primary w-56"
          />
        </div>
      </div>

      <div className="bg-white border-2 border-on-surface neo-shadow overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="font-geist text-base font-bold text-on-surface-variant animate-pulse">Loading conversations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <MessageSquare size={48} className="text-outline-variant" strokeWidth={1} />
            <p className="font-geist text-base font-bold text-on-surface-variant">No conversations found</p>
            <p className="font-geist text-sm text-on-surface-variant">Conversations will appear here once your application sends /ingest requests.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-surface-container border-b-2 border-on-surface">
                {['External ID', 'Title', 'Status', 'Messages', 'Last Activity'].map(h => (
                  <th key={h} className="px-4 py-3 font-mono text-[10px] font-bold uppercase text-on-surface-variant">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y border-on-surface">
              {filtered.map(c => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/conversations/${c.id}`)}
                  className="hover:bg-surface-container-lowest transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold text-primary group-hover:underline">{c.externalId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-geist text-sm">{c.title ?? <span className="text-on-surface-variant italic">No title</span>}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 font-mono text-xs font-bold">{c.messageCount ?? 0}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-on-surface-variant">
                    {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Evaluations ─────────────────────────────────────────────────────────

function EvaluationsTab({ appId }: { appId: string }) {
  const navigate = useNavigate();
  const { data, isLoading } = useEvaluations({ applicationId: appId, limit: 50 });
  const evaluations = data?.evaluations ?? [];

  return (
    <div className="bg-white border-2 border-on-surface neo-shadow overflow-hidden">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <p className="font-geist text-base font-bold text-on-surface-variant animate-pulse">Loading evaluations…</p>
        </div>
      ) : evaluations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <ClipboardCheck size={48} className="text-outline-variant" strokeWidth={1} />
          <p className="font-geist text-base font-bold text-on-surface-variant">No evaluations yet</p>
          <p className="font-geist text-sm text-on-surface-variant">Evaluations appear once your application sends conversations via /ingest.</p>
        </div>
      ) : (
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-surface-container border-b-2 border-on-surface">
              {['Evaluation ID', 'Conversation', 'Status', 'Score', 'Risk', 'Decision', 'Created'].map(h => (
                <th key={h} className="px-4 py-3 font-mono text-[10px] font-bold uppercase text-on-surface-variant">{h}</th>
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
                <td className="px-4 py-3 font-mono text-xs font-bold text-primary group-hover:underline">
                  {ev.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">
                  {ev.conversation?.externalId?.slice(0, 14) ?? ev.conversationId.slice(0, 8)}…
                </td>
                <td className="px-4 py-3"><StatusBadge status={ev.status} /></td>
                <td className="px-4 py-3">
                  {ev.overallScore !== undefined && ev.overallScore !== null ? (
                    <span className={`font-geist text-sm font-bold ${ev.overallScore >= 80 ? 'text-emerald-600' : ev.overallScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {Math.round(ev.overallScore)}<span className="text-on-surface-variant text-xs">/100</span>
                    </span>
                  ) : <span className="text-on-surface-variant font-mono text-[10px]">—</span>}
                </td>
                <td className="px-4 py-3"><RiskBadge risk={ev.riskLevel} /></td>
                <td className="px-4 py-3"><DecisionBadge decision={ev.decision} /></td>
                <td className="px-4 py-3 font-mono text-[11px] text-on-surface-variant">
                  {new Date(ev.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Tab: API Keys ────────────────────────────────────────────────────────────

function ApiKeysTab({ appId }: { appId: string }) {
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiry, setNewKeyExpiry] = useState('');
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: keys = [], isLoading } = useApiKeys(appId);
  const { mutate: createKey, isPending: isCreating } = useCreateApiKey(appId);
  const { mutate: revokeKey, isPending: isRevoking } = useRevokeApiKey(appId);

  const handleCreate = () => {
    createKey(
      { 
        name: newKeyName, 
        ...(newKeyExpiry ? { expiresAt: new Date(newKeyExpiry).toISOString() } : {}) 
      },
      {
        onSuccess: (data) => {
          setCreatedSecret(data.data.secret);
          setShowCreate(false);
          setNewKeyName('');
          setNewKeyExpiry('');
        }
      }
    );
  };

  const handleRevoke = (id: string) => {
    revokeKey(id, {
      onSuccess: () => setRevokeId(null)
    });
  };

  const handleCopy = () => {
    if (createdSecret) {
      navigator.clipboard.writeText(createdSecret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* One-time secret reveal */}
      {createdSecret && (
        <div className="bg-amber-50 border-2 border-amber-600 p-4 neo-shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <TriangleAlert size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-geist font-bold text-amber-900">Save this API key now</p>
              <p className="font-mono text-xs text-amber-800 mt-0.5">You will not be able to view the secret again after closing this notice.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border-2 border-amber-600 p-2.5">
            <code className="font-mono text-sm flex-1 text-on-surface break-all">{createdSecret}</code>
            <button
              onClick={handleCopy}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white font-mono text-[11px] font-bold cursor-pointer hover:bg-amber-700 transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={() => setCreatedSecret(null)}
              className="shrink-0 text-amber-600 hover:text-amber-900 cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Revoke confirm dialog */}
      {revokeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40">
          <div className="bg-surface border-2 border-on-surface neo-shadow p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-2 text-error">
              <TriangleAlert size={22} />
              <h3 className="font-geist font-bold text-lg">Revoke API Key?</h3>
            </div>
            <p className="font-geist text-sm text-on-surface-variant">
              This action cannot be undone. Any application using this key will lose access immediately.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setRevokeId(null)} className="px-4 py-2 border-2 border-on-surface font-mono text-xs font-bold hover:bg-surface-container cursor-pointer">Cancel</button>
              <button
                onClick={() => handleRevoke(revokeId)}
                disabled={isRevoking}
                className="px-4 py-2 bg-error text-on-error border-2 border-on-surface font-mono text-xs font-bold neo-shadow hover:neo-shadow-active transition-all cursor-pointer disabled:opacity-50"
              >
                {isRevoking ? 'Revoking...' : 'Revoke Key'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="font-mono text-[11px] text-on-surface-variant">{keys.filter(k => k.status === 'ACTIVE').length} active key(s)</p>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary border-2 border-on-surface font-mono text-[11px] font-bold neo-shadow hover:neo-shadow-active transition-all cursor-pointer"
        >
          <Plus size={16} />
          Generate API Key
        </button>
      </div>

      {/* Create form (inline) */}
      {showCreate && (
        <div className="bg-surface-container-low border-2 border-on-surface p-4 space-y-3">
          <h4 className="font-geist font-bold text-sm">New API Key</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant block">Key Name *</label>
              <input
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
                placeholder="e.g. Production Key"
                className="w-full border-2 border-on-surface px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant flex justify-between">
                <span>Expires At</span><span className="text-primary">Optional</span>
              </label>
              <input
                type="date"
                value={newKeyExpiry}
                onChange={e => setNewKeyExpiry(e.target.value)}
                className="w-full border-2 border-on-surface px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 border-2 border-on-surface font-mono text-[11px] font-bold cursor-pointer hover:bg-surface-container">Cancel</button>
            <button
              onClick={handleCreate}
              disabled={!newKeyName.trim() || isCreating}
              className="px-3 py-1.5 bg-primary text-on-primary border-2 border-on-surface font-mono text-[11px] font-bold neo-shadow hover:neo-shadow-active transition-all cursor-pointer disabled:opacity-50"
            >
              {isCreating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      )}

      {/* Key list */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-outline-variant gap-3">
          <p className="font-geist text-base font-bold text-on-surface-variant animate-pulse">Loading API keys...</p>
        </div>
      ) : keys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-outline-variant gap-3">
          <KeyRound size={48} className="text-outline-variant" strokeWidth={1} />
          <p className="font-geist text-base font-bold text-on-surface-variant">No API keys generated</p>
          <p className="font-geist text-sm text-on-surface-variant">Generate an API key to connect an external application.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {keys.map(key => (
            <div key={key.id} className={`bg-white border-2 border-on-surface p-4 flex items-center justify-between gap-4 ${key.status === 'REVOKED' ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <KeyRound size={20} className={key.status === 'ACTIVE' ? 'text-emerald-600' : 'text-on-surface-variant'} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-geist text-sm font-bold">{key.name}</span>
                    <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border ${
                      key.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-900 border-emerald-700' :
                      key.status === 'EXPIRED' ? 'bg-amber-100 text-amber-900 border-amber-700' :
                      'bg-surface-container text-on-surface-variant border-outline'
                    }`}>{key.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-1">
                    <span className="font-mono text-xs text-on-surface-variant">Prefix: <span className="font-bold text-on-surface">{key.keyPrefix}••••</span></span>
                    <span className="font-mono text-xs text-on-surface-variant">Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                    {key.lastUsedAt && <span className="font-mono text-xs text-on-surface-variant">Last used: {new Date(key.lastUsedAt).toLocaleDateString()}</span>}
                    {key.expiresAt && <span className="font-mono text-xs text-on-surface-variant">Expires: {new Date(key.expiresAt).toLocaleDateString()}</span>}
                  </div>
                </div>
              </div>
              {key.status === 'ACTIVE' && (
                <button
                  onClick={() => setRevokeId(key.id)}
                  className="shrink-0 px-3 py-1.5 border-2 border-error text-error font-mono text-[11px] font-bold hover:bg-error-container transition-colors cursor-pointer"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Integration hint */}
      <div className="bg-surface-container-low border-l-4 border-l-primary p-4">
        <p className="font-mono text-[10px] font-bold uppercase text-primary mb-1">Integration Endpoint</p>
        <code className="font-mono text-xs text-on-surface">POST {import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'}/api/v1/ingest</code>
        <p className="font-mono text-[10px] text-on-surface-variant mt-1">Use your API key as a Bearer token in the Authorization header.</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'conversations', label: 'Conversations', icon: MessageSquare },
  { key: 'evaluations', label: 'Evaluations', icon: ClipboardCheck },
  { key: 'api-keys', label: 'API Keys', icon: KeyRound },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function ApplicationDetailPage() {
  const { applicationId } = useParams();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const { data: app, isLoading, isError } = useApplication(applicationId);

  if (isLoading) {
    return <div className="p-6 text-on-surface-variant font-mono font-bold">Loading application...</div>;
  }

  if (isError || !app) {
    return <div className="p-6 text-error font-mono font-bold">Application not found</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-on-surface-variant uppercase">
        <Link to="/applications" className="hover:text-primary transition-colors">Applications</Link>
        <ChevronRight size={12} />
        <span className="text-on-surface">{app.name}</span>
      </nav>

      {/* App Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 border-2 border-on-surface flex items-center justify-center shrink-0 bg-secondary-container text-on-secondary-container`}>
            {(() => {
              const AppIcon = TYPE_ICONS[app.type as ApplicationType] || Grid;
              return <AppIcon size={28} />;
            })()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-geist text-2xl font-extrabold tracking-tight">{app.name}</h2>
              <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border ${ENV_COLORS[app.environment as ApplicationEnvironment]}`}>{app.environment}</span>
              <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border-2 ${
                app.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-900 border-emerald-700' : 'bg-surface-container text-on-surface-variant border-outline'
              }`}>{app.status}</span>
            </div>
            <p className="font-mono text-[11px] text-on-surface-variant">{app.type.replace('_', ' ')} · ID: {app.id.slice(0, 8)}…</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 border-2 border-on-surface font-mono text-[11px] font-bold hover:bg-surface-container transition-colors cursor-pointer">
            <Pencil size={16} />
            Edit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b-2 border-on-surface">
        <div className="flex gap-0">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer border-r-2 border-on-surface ${
                activeTab === tab.key
                  ? 'bg-primary-container text-on-primary-container border-b-2 border-b-primary-container'
                  : 'hover:bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab app={app} />}
      {activeTab === 'conversations' && <ConversationsTab appId={applicationId ?? ''} />}
      {activeTab === 'evaluations' && <EvaluationsTab appId={applicationId ?? ''} />}
      {activeTab === 'api-keys' && <ApiKeysTab appId={applicationId ?? ''} />}
    </div>
  );
}
