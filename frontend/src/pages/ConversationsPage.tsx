import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, CircleDot, CheckCircle2, Archive, Search, KeyRound, MessageCircle, ChevronRight } from 'lucide-react';
import type { ConversationStatus } from '../types';

import { useApplications } from '../hooks/useApplications';
import { useConversations } from '../hooks/useConversations';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ConversationStatus | string }) {
  const map: Record<string, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-900 border-emerald-700',
    COMPLETED: 'bg-primary-container text-on-primary-container border-primary',
    ARCHIVED: 'bg-surface-container text-on-surface-variant border-outline',
  };
  return (
    <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border ${map[status] ?? ''}`}>
      {status}
    </span>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConversationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedAppIdState, setSelectedAppIdState] = useState<string>('');

  const { data: applications = [] } = useApplications();
  const selectedAppId = selectedAppIdState || (applications.length > 0 ? applications[0].id : '');
  const selectedApp = applications.find(a => a.id === selectedAppId);

  const { data, isLoading } = useConversations(selectedAppId, {
    ...(statusFilter !== 'ALL' && { status: statusFilter }),
    ...(search && { search })
  });

  const filtered = data?.conversations || [];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-geist text-2xl font-extrabold tracking-tight">Conversations</h2>
          <div className="mt-2">
            <select
              value={selectedAppId}
              onChange={e => setSelectedAppIdState(e.target.value)}
              className="px-3 py-1.5 bg-white border-2 border-on-surface font-mono text-[11px] font-bold outline-none focus:ring-2 focus:ring-primary cursor-pointer min-w-[250px]"
            >
              <option value="" disabled>Select an Application</option>
              {applications.map(app => (
                <option key={app.id} value={app.id}>{app.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: filtered.length, icon: MessageSquare, color: '' },
          { label: 'Active', value: filtered.filter(c => c.status === 'ACTIVE').length, icon: CircleDot, color: 'text-emerald-600' },
          { label: 'Completed', value: filtered.filter(c => c.status === 'COMPLETED').length, icon: CheckCircle2, color: 'text-primary' },
          { label: 'Archived', value: filtered.filter(c => c.status === 'ARCHIVED').length, icon: Archive, color: 'text-on-surface-variant' },
        ].map(s => (
          <div key={s.label} className="bg-white border-2 border-on-surface p-4 neo-shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={16} className={s.color || 'text-on-surface-variant'} />
              <p className="font-mono text-[10px] font-bold uppercase text-on-surface-variant">{s.label}</p>
            </div>
            <p className="font-geist text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center text-on-surface-variant">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, title or app..."
            className="pl-8 pr-3 py-1.5 bg-white border-2 border-on-surface font-mono text-[11px] outline-none focus:ring-2 focus:ring-primary w-64"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-white border-2 border-on-surface font-mono text-[11px] font-bold outline-none focus:ring-2 focus:ring-primary cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <p className="font-mono text-[11px] text-on-surface-variant ml-auto">
          {filtered.length} conversation{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="bg-white border-2 border-on-surface neo-shadow flex flex-col items-center justify-center py-20 gap-4">
          <p className="font-geist text-base font-bold text-on-surface-variant animate-pulse">Loading conversations...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border-2 border-on-surface neo-shadow flex flex-col items-center justify-center py-20 gap-4">
          <MessageSquare size={60} className="text-outline-variant" strokeWidth={1} />
          <h3 className="font-geist text-lg font-bold text-on-surface-variant">No conversations found</h3>
          <p className="font-geist text-sm text-on-surface-variant max-w-md text-center">
            Conversations appear here when your external AI application sends requests to the <code className="font-mono bg-surface-container px-1">POST /api/v1/ingest</code> endpoint.
          </p>
          <Link
            to="/api-integration"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary border-2 border-on-surface neo-shadow font-mono text-xs font-bold hover:neo-shadow-active transition-all"
          >
            <KeyRound size={16} />
            Set Up Integration
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(c => (
            <div
              key={c.id}
              onClick={() => navigate(`/conversations/${c.id}`)}
              className="bg-white border-2 border-on-surface p-4 neo-shadow-sm hover:translate-y-[-1px] hover:neo-shadow transition-all cursor-pointer group flex items-center gap-4"
            >
              {/* Icon */}
              <div className="w-10 h-10 border-2 border-on-surface bg-surface-container flex items-center justify-center shrink-0">
                <MessageCircle size={20} className="text-on-surface-variant" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs font-bold text-primary">{c.externalId}</span>
                  <StatusBadge status={c.status} />
                  <span className="font-mono text-[10px] text-on-surface-variant bg-surface-container-low px-1.5 border border-outline-variant">{selectedApp?.name || 'Application'}</span>
                </div>
                <p className="font-geist text-sm font-bold truncate">
                  {c.title ?? <span className="text-on-surface-variant italic font-normal">Untitled conversation</span>}
                </p>
              </div>

              {/* Meta */}
              <div className="shrink-0 text-right hidden md:block">
                <p className="font-mono text-[11px] text-on-surface-variant">{c.messageCount ?? 0} messages</p>
                <p className="font-mono text-[11px] text-on-surface-variant mt-0.5">
                  {c.lastMessageAt ? timeAgo(c.lastMessageAt) : '—'}
                </p>
              </div>

              <ChevronRight size={18} className="text-on-surface-variant group-hover:text-primary transition-colors shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
