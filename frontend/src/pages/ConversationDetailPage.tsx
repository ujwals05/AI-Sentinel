import { Link, useParams } from 'react-router-dom';
import { User, Bot, Settings, Wrench, CheckCircle2, ShieldAlert, Shield, ChevronRight, ClipboardCheck } from 'lucide-react';
import type { Message, Evaluation, JudgeExecution } from '../types';
import { useConversation } from '../hooks/useConversations';

// ─── Mock Data ────────────────────────────────────────────────────────────────


const MOCK_EVALUATION: Evaluation & { judgeExecutions: JudgeExecution[] } = {
  id: 'e1', applicationId: '111', conversationId: 'c1', status: 'COMPLETED',
  overallScore: 92, riskLevel: 'LOW', decision: 'PASS',
  summary: 'The response demonstrates high quality customer service. It correctly identified the order issue, provided accurate refund information, and maintained a professional, empathetic tone throughout the interaction. No safety or trust concerns detected.',
  createdAt: '2026-08-03T08:24:30Z', completedAt: '2026-08-03T08:24:58Z',
  judgeExecutions: [
    {
      id: 'je1', evaluationId: 'e1', judgeType: 'QUALITY', status: 'COMPLETED',
      score: 94, riskLevel: 'LOW',
      reasoning: 'Response is highly relevant to the user query. Complete resolution provided with clear next steps. Tone is empathetic and professional. Minor deduction for not proactively offering the correct item as an exchange option.',
      createdAt: '2026-08-03T08:24:30Z', completedAt: '2026-08-03T08:24:42Z', latencyMs: 1240,
    },
    {
      id: 'je2', evaluationId: 'e1', judgeType: 'SAFETY', status: 'COMPLETED',
      score: 98, riskLevel: 'LOW',
      reasoning: 'No harmful content detected. No PII exposure beyond what was provided by the user. No policy violations. Response adheres to customer data handling guidelines.',
      createdAt: '2026-08-03T08:24:42Z', completedAt: '2026-08-03T08:24:52Z', latencyMs: 980,
    },
    {
      id: 'je3', evaluationId: 'e1', judgeType: 'TRUST', status: 'COMPLETED',
      score: 84, riskLevel: 'LOW',
      reasoning: 'Claims about refund timeline (3-5 business days) and $89.99 refund amount align with the order data retrieved. Tool call result was properly used. Slight uncertainty around 14-day return window which was not confirmed by the order data.',
      createdAt: '2026-08-03T08:24:52Z', completedAt: '2026-08-03T08:24:58Z', latencyMs: 860,
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_STYLES = {
  USER: {
    container: 'justify-end',
    bubble: 'bg-primary text-on-primary border-2 border-on-surface ml-10 md:ml-20',
    label: 'text-right text-primary',
    icon: User,
    iconColor: 'text-primary',
  },
  ASSISTANT: {
    container: 'justify-start',
    bubble: 'bg-white text-on-surface border-2 border-on-surface mr-10 md:mr-20 neo-shadow-sm',
    label: 'text-left text-on-surface-variant',
    icon: Bot,
    iconColor: 'text-on-surface-variant',
  },
  SYSTEM: {
    container: 'justify-center',
    bubble: 'bg-surface-container-high text-on-surface-variant border border-outline-variant text-xs italic max-w-[90%]',
    label: 'text-center text-on-surface-variant',
    icon: Settings,
    iconColor: 'text-on-surface-variant',
  },
  TOOL: {
    container: 'justify-start',
    bubble: 'bg-[#1e1e2e] text-[#cdd6f4] border-2 border-on-surface mr-10 md:mr-20 font-mono text-xs',
    label: 'text-left text-tertiary',
    icon: Wrench,
    iconColor: 'text-tertiary',
  },
};

const JUDGE_COLORS: Record<string, { icon: any; iconColor: string; scoreBg: string }> = {
  QUALITY: { icon: CheckCircle2, iconColor: 'text-primary', scoreBg: 'bg-secondary-container' },
  SAFETY: { icon: ShieldAlert, iconColor: 'text-emerald-600', scoreBg: 'bg-emerald-100' },
  TRUST: { icon: Shield, iconColor: 'text-tertiary', scoreBg: 'bg-tertiary-fixed' },
};

function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
}

function DecisionBadge({ decision }: { decision: string }) {
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

function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, string> = {
    LOW: 'text-emerald-700',
    MEDIUM: 'text-amber-700',
    HIGH: 'text-red-700',
    CRITICAL: 'text-error',
  };
  return <span className={`font-mono text-xs font-bold ${map[risk] ?? ''}`}>{risk}</span>;
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const style = ROLE_STYLES[message.role];

  if (message.role === 'SYSTEM') {
    return (
      <div className="flex justify-center my-2">
        <div className="flex items-center gap-2 bg-surface-container border border-outline-variant px-3 py-1.5 max-w-[85%]">
          <Settings size={14} className="text-on-surface-variant" />
          <p className="font-mono text-[10px] text-on-surface-variant font-bold uppercase">System Prompt</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${style.container} gap-2 group`}>
      {(message.role === 'ASSISTANT' || message.role === 'TOOL') && (
        <div className="w-7 h-7 border-2 border-on-surface flex items-center justify-center shrink-0 mt-0.5 bg-surface-container-low">
          <style.icon size={14} className={style.iconColor} />
        </div>
      )}

      <div className="flex flex-col max-w-[75%]">
        <div className={`font-mono text-[9px] font-bold uppercase mb-1 ${style.label}`}>
          {message.role}{message.role === 'TOOL' && ' response'}
        </div>
        <div className={`px-4 py-3 ${style.bubble}`}>
          {message.role === 'TOOL' ? (
            <pre className="whitespace-pre-wrap text-[11px] leading-relaxed overflow-x-auto">
              {message.content}
            </pre>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        <div className={`font-mono text-[9px] text-on-surface-variant mt-1 ${message.role === 'USER' ? 'text-right' : 'text-left'}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {message.role === 'USER' && (
        <div className="w-7 h-7 border-2 border-on-surface flex items-center justify-center shrink-0 mt-0.5 bg-primary-container">
          <User size={14} className="text-on-primary-container" />
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConversationDetailPage() {
  const { conversationId } = useParams();
  
  const { data: conversation, isLoading, isError } = useConversation(conversationId);
  const ev = MOCK_EVALUATION;

  if (isLoading) {
    return <div className="p-6 font-mono text-on-surface-variant font-bold">Loading conversation...</div>;
  }

  if (isError || !conversation) {
    return <div className="p-6 font-mono text-error font-bold">Conversation not found</div>;
  }

  const messages = conversation.messages || [];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-48px)] overflow-hidden">

      {/* ── Chat Panel ─────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden border-r-2 border-on-surface">
        {/* Chat Header */}
        <div className="shrink-0 px-5 py-4 border-b-2 border-on-surface bg-surface">
          <div className="flex items-start justify-between gap-3">
            <div>
              <nav className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-on-surface-variant uppercase mb-1">
                <Link to="/conversations" className="hover:text-primary transition-colors">Conversations</Link>
                <ChevronRight size={12} />
                <span className="text-on-surface">{conversation.externalId}</span>
              </nav>
              <h2 className="font-geist text-lg font-bold">{conversation.title || 'Untitled conversation'}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="font-mono text-[10px] font-bold text-primary">{conversation.externalId}</span>
                <span className="font-mono text-[10px] text-on-surface-variant">ID: {conversation.id}</span>
                <span className="font-mono text-[10px] text-on-surface-variant">·</span>
                <span className="font-mono text-[10px] text-on-surface-variant">{messages.length} messages</span>
                <span className="font-mono text-[10px] bg-primary-container text-on-primary-container px-2 py-0.5 border border-primary uppercase">{conversation.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-surface-container-lowest">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-on-surface-variant">
              <p className="font-geist text-sm">No messages in this conversation yet.</p>
            </div>
          ) : (
            messages.map((msg: any) => (
              <MessageBubble key={msg.id} message={msg as Message} />
            ))
          )}
        </div>
      </div>

      {/* ── Evaluation Panel ─────────────────────────────────────────── */}
      <div className="w-full lg:w-96 shrink-0 flex flex-col overflow-hidden bg-surface">
        <div className="shrink-0 px-5 py-4 border-b-2 border-on-surface">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={18} className="text-primary" />
            <h3 className="font-geist text-base font-bold">Evaluation</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {/* Overall Score */}
          <div className="bg-white border-2 border-on-surface neo-shadow p-4 text-center">
            <p className="font-mono text-[10px] font-bold uppercase text-on-surface-variant mb-2">Overall Score</p>
            <p className={`font-geist text-5xl font-extrabold ${scoreColor(ev.overallScore ?? 0)}`}>
              {ev.overallScore}
              <span className="text-lg text-on-surface-variant">/100</span>
            </p>
          </div>

          {/* Risk + Decision */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border-2 border-on-surface p-3 text-center">
              <p className="font-mono text-[10px] font-bold uppercase text-on-surface-variant mb-1.5">Risk Level</p>
              {ev.riskLevel && <RiskBadge risk={ev.riskLevel} />}
            </div>
            <div className="bg-white border-2 border-on-surface p-3 text-center">
              <p className="font-mono text-[10px] font-bold uppercase text-on-surface-variant mb-1.5">Decision</p>
              {ev.decision && <DecisionBadge decision={ev.decision} />}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-surface-container-low border-2 border-on-surface p-3">
            <p className="font-mono text-[10px] font-bold uppercase text-on-surface-variant mb-2">AI Summary</p>
            <p className="font-geist text-xs text-on-surface leading-relaxed">{ev.summary}</p>
          </div>

          {/* Judge Results */}
          <div className="space-y-2">
            <p className="font-mono text-[10px] font-bold uppercase text-on-surface-variant">Judge Results</p>
            {ev.judgeExecutions.map(je => {
              const jc = JUDGE_COLORS[je.judgeType];
              return (
                <div key={je.id} className="bg-white border-2 border-on-surface neo-shadow-sm">
                  <div className="p-3 border-b border-outline-variant flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <jc.icon size={18} className={jc.iconColor} />
                      <span className="font-geist text-sm font-bold">{je.judgeType} Judge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-geist text-lg font-extrabold ${scoreColor(je.score ?? 0)}`}>{je.score}</span>
                      {je.riskLevel && (
                        <span className="font-mono text-[9px] font-bold text-on-surface-variant">{je.riskLevel}</span>
                      )}
                    </div>
                  </div>
                  {/* Score Bar */}
                  <div className="h-1.5 bg-surface-container">
                    <div
                      className={`h-full ${(je.score ?? 0) >= 80 ? 'bg-emerald-500' : (je.score ?? 0) >= 60 ? 'bg-amber-400' : 'bg-red-500'}`}
                      style={{ width: `${je.score ?? 0}%` }}
                    />
                  </div>
                  {/* Reasoning */}
                  {je.reasoning && (
                    <div className="p-3">
                      <p className="font-geist text-xs text-on-surface-variant leading-relaxed">{je.reasoning}</p>
                      {je.latencyMs && (
                        <p className="font-mono text-[9px] text-on-surface-variant mt-2">Latency: {je.latencyMs}ms</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Timing */}
          <div className="bg-surface-container border border-outline-variant p-3 space-y-1">
            <p className="font-mono text-[10px] font-bold uppercase text-on-surface-variant">Timing</p>
            <div className="flex justify-between font-mono text-xs">
              <span className="text-on-surface-variant">Evaluated</span>
              <span className="font-bold">{new Date(ev.createdAt).toLocaleString()}</span>
            </div>
            {ev.completedAt && (
              <div className="flex justify-between font-mono text-xs">
                <span className="text-on-surface-variant">Completed</span>
                <span className="font-bold">{new Date(ev.completedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
