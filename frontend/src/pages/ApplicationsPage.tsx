import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Terminal, BrainCircuit, Webhook, Grid, X, Plus, CheckCircle2, MessageSquare, ClipboardCheck, Search, ListFilter, Shapes, SearchX, ChevronRight } from 'lucide-react';
import { useApplications, useCreateApplication } from '../hooks/useApplications';
import type { ApplicationType, ApplicationEnvironment } from '../types';

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

const ENV_COLORS: Record<ApplicationEnvironment, string> = {
  PRODUCTION: 'bg-emerald-100 text-emerald-900 border-emerald-700',
  STAGING: 'bg-amber-100 text-amber-900 border-amber-700',
  DEVELOPMENT: 'bg-surface-container text-on-surface-variant border-outline',
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

// ─── Create Modal ─────────────────────────────────────────────────────────────

function CreateApplicationModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ApplicationType>('CHATBOT');
  const [environment, setEnvironment] = useState<ApplicationEnvironment>('DEVELOPMENT');

  const { mutate: createApplication, isPending } = useCreateApplication();
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!name.trim()) return;
    createApplication(
      { name, description, type, environment },
      { 
        onSuccess: (data) => {
          onClose();
          navigate(`/applications/${data.data.application.id}`);
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40">
      <div className="bg-surface border-2 border-on-surface neo-shadow-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-on-surface">
          <div>
            <h3 className="font-geist text-lg font-bold">New Application</h3>
            <p className="font-mono text-[10px] text-on-surface-variant mt-0.5">Register an AI application to monitor</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant block">Application Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Customer Support Bot"
              className="w-full border-2 border-on-surface px-3 py-2 font-geist text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant block">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What does this application do?"
              rows={2}
              className="w-full border-2 border-on-surface px-3 py-2 font-geist text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant block">Application Type *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as ApplicationType)}
                className="w-full border-2 border-on-surface px-3 py-2 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer"
              >
                <option value="CHATBOT">Chatbot</option>
                <option value="CODE_ASSISTANT">Code Assistant</option>
                <option value="AI_AGENT">AI Agent</option>
                <option value="API">API</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant block">Environment *</label>
              <select
                value={environment}
                onChange={e => setEnvironment(e.target.value as ApplicationEnvironment)}
                className="w-full border-2 border-on-surface px-3 py-2 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer"
              >
                <option value="DEVELOPMENT">Development</option>
                <option value="STAGING">Staging</option>
                <option value="PRODUCTION">Production</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 border-on-surface font-mono text-xs font-bold hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isPending || !name.trim()}
            className="px-4 py-2 bg-primary text-on-primary border-2 border-on-surface font-mono text-xs font-bold neo-shadow hover:neo-shadow-active transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Creating...' : 'Create Application'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const { data: applications = [], isLoading } = useApplications();

  const filtered = applications.filter(app => {
    if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && app.type !== typeFilter) return false;
    if (search && !app.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = applications.filter(a => a.status === 'ACTIVE').length;
  const totalConversations = applications.reduce((s, a) => s + (a._count?.conversations ?? 0), 0);
  const totalEvaluations = applications.reduce((s, a) => s + (a._count?.evaluations ?? 0), 0);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {showCreate && <CreateApplicationModal onClose={() => setShowCreate(false)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-geist text-2xl font-extrabold tracking-tight">Applications</h2>
          <p className="font-geist text-sm text-on-surface-variant mt-1">
            Manage and monitor your AI applications. Click any application to view its observability data.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary border-2 border-on-surface font-geist text-sm font-bold neo-shadow hover:neo-shadow-active transition-all cursor-pointer"
        >
          <Plus size={18} />
          New Application
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: applications.length, icon: Grid, color: '' },
          { label: 'Active Applications', value: activeCount, icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'Total Conversations', value: formatNumber(totalConversations), icon: MessageSquare, color: '' },
          { label: 'Total Evaluations', value: formatNumber(totalEvaluations), icon: ClipboardCheck, color: 'text-primary' },
        ].map(s => (
          <div key={s.label} className="bg-white border-2 border-on-surface p-4 neo-shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={18} className={s.color || 'text-on-surface-variant'} />
              <p className="font-mono text-[10px] font-bold text-on-surface-variant uppercase">{s.label}</p>
            </div>
            <p className="font-geist text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-2 border-on-surface neo-shadow overflow-hidden">
        <div className="p-3 border-b-2 border-on-surface bg-surface-container-low flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-3 items-center flex-wrap">
            {/* Search */}
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center text-on-surface-variant">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search applications..."
                className="pl-8 pr-3 py-1.5 bg-white border-2 border-on-surface font-mono text-[11px] outline-none focus:ring-2 focus:ring-primary w-52"
              />
            </div>
            {/* Status Filter */}
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center text-on-surface-variant">
                <ListFilter size={16} />
              </span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="pl-8 pr-6 py-1.5 bg-white border-2 border-on-surface font-mono text-[11px] font-bold appearance-none outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            {/* Type Filter */}
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center text-on-surface-variant">
                <Shapes size={16} />
              </span>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="pl-8 pr-6 py-1.5 bg-white border-2 border-on-surface font-mono text-[11px] font-bold appearance-none outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="CHATBOT">Chatbot</option>
                <option value="CODE_ASSISTANT">Code Assistant</option>
                <option value="AI_AGENT">AI Agent</option>
                <option value="API">API</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
          <p className="font-mono text-[11px] text-on-surface-variant">
            Showing {filtered.length} of {applications.length} applications
          </p>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="font-geist text-base font-bold text-on-surface-variant animate-pulse">Loading applications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <SearchX size={48} className="text-outline-variant" strokeWidth={1} />
            <p className="font-geist text-base font-bold text-on-surface-variant">No applications match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-surface-container border-b-2 border-on-surface">
                  {['Application', 'Type', 'Environment', 'Status', 'Conversations', 'Evaluations', 'Created', ''].map((h, i) => (
                    <th key={i} className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y border-on-surface">
                {filtered.map(app => (
                  <tr
                    key={app.id}
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="hover:bg-surface-container-lowest transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 border-2 border-on-surface flex items-center justify-center shrink-0 ${TYPE_COLORS[app.type]}`}>
                          {(() => {
                            const IconType = TYPE_ICONS[app.type];
                            return <IconType size={18} />;
                          })()}
                        </div>
                        <div>
                          <p className="font-geist text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{app.name}</p>
                          {app.description && (
                            <p className="font-mono text-[10px] text-on-surface-variant mt-0.5 max-w-[220px] truncate">{app.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] font-bold text-on-surface-variant uppercase bg-surface-container px-2 py-0.5 border border-outline-variant">
                        {app.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border ${ENV_COLORS[app.environment]}`}>
                        {app.environment}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border-2 ${
                        app.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-700'
                          : 'bg-surface-container text-on-surface-variant border-outline'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-bold">
                      {formatNumber(app._count?.conversations ?? 0)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-bold">
                      {formatNumber(app._count?.evaluations ?? 0)}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-on-surface-variant">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ChevronRight size={18} className="text-on-surface-variant group-hover:text-primary transition-colors inline-block" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
