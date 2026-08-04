import { Star, Shield, Brain, Coins, FlaskConical, Download, MoreHorizontal, Lightbulb, ArrowRight } from 'lucide-react';

const metrics = [
  { title: 'Avg Quality Score', value: '0.94', change: '+2.4%', icon: Star, isGood: true },
  { title: 'Safety Violations', value: '12', change: '-5', icon: Shield, isGood: true },
  { title: 'Hallucination Rate', value: '1.2%', change: '+0.3%', icon: Brain, isGood: false },
  { title: 'Total Tokens Processed', value: '42.8M', change: '+12%', icon: Coins, isGood: true },
];

// ─── Reusable "Sample Data" pill ─────────────────────────────────────────────

function SampleDataPill() {
  return (
    <span
      title="This data is for demonstration purposes only and is not connected to real backend data."
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 7px',
        fontSize: '9px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#92400e',
        background: '#fef3c7',
        border: '1.5px solid #d97706',
        borderRadius: '2px',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      <FlaskConical size={12} strokeWidth={2.5} />
      Sample Data
    </span>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-12 h-full overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-on-surface pb-6">
        <div>
          <h2 className="font-geist text-5xl font-extrabold tracking-tight mb-2">Performance Analytics</h2>
          <p className="font-geist text-lg text-on-surface-variant">Deep dive into model behaviors, quality metrics, and operational trends.</p>
        </div>
        <div className="flex gap-4">
          <select className="px-4 py-2 border-2 border-on-surface bg-white font-mono text-sm font-bold neo-shadow-sm cursor-pointer outline-none">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 24 Hours</option>
          </select>
          <button className="px-4 py-2 border-2 border-on-surface bg-on-surface text-surface font-mono text-sm font-bold neo-shadow hover:neo-shadow-active transition-all cursor-pointer flex items-center gap-2">
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      {/* ── Demo Data Notice ─────────────────────────────────────────────────── */}
      <div
        role="note"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '12px 16px',
          background: '#fffbeb',
          border: '2px solid #d97706',
          boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)',
          marginTop: '-24px',  // pull up closer to header divider
        }}
      >
        <FlaskConical size={20} className="text-[#b45309] shrink-0 mt-[1px]" />
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
            Page Not Active — Demo Data Only
          </p>
          <p style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#78350f', lineHeight: 1.5 }}>
            This page is currently not active. All metrics, charts, and insights on this page are static sample data for demonstration purposes only. Real analytics will appear here once backend data ingestion is connected.
          </p>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(m => (
          <div key={m.title} className="bg-white border-2 border-on-surface p-6 neo-shadow hover:translate-y-[-4px] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <p className="font-mono text-xs font-bold text-on-surface-variant uppercase">{m.title}</p>
              <div className="flex items-center gap-2">
                <SampleDataPill />
                <m.icon size={18} className="text-outline-variant" />
              </div>
            </div>
            <p className="font-geist text-4xl font-extrabold mb-2">{m.value}</p>
            <div className="flex items-center gap-1">
              <span className={`font-mono text-sm font-bold ${m.isGood ? 'text-emerald-600' : 'text-red-600'}`}>
                {m.change}
              </span>
              <span className="font-geist text-xs text-on-surface-variant">vs previous period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white border-2 border-on-surface neo-shadow flex flex-col h-[400px]">
          <div className="p-6 border-b-2 border-on-surface flex justify-between items-center bg-surface-container-low">
            <div className="flex items-center gap-3">
              <h3 className="font-geist text-xl font-bold">Quality vs Volume Trend</h3>
              <SampleDataPill />
            </div>
            <MoreHorizontal size={24} className="text-on-surface-variant cursor-pointer" />
          </div>
          <div className="flex-1 p-6 flex flex-col justify-end gap-2 relative dot-grid">
            {/* Mock Chart representation */}
            <div className="absolute inset-x-6 top-6 bottom-16 border-b border-l border-outline-variant flex items-end justify-between px-4 pb-2">
              {[40, 60, 45, 70, 55, 80, 65, 90, 75, 85].map((h, i) => (
                <div key={i} className="w-[8%] bg-primary border-t-2 border-r-2 border-primary-fixed-dim opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
              ))}
            </div>
            {/* X-Axis labels */}
            <div className="flex justify-between font-mono text-[10px] text-on-surface-variant mt-auto">
              <span>Oct 01</span>
              <span>Oct 15</span>
              <span>Oct 30</span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-on-surface neo-shadow flex flex-col h-[400px]">
          <div className="p-6 border-b-2 border-on-surface flex justify-between items-center bg-surface-container-low">
            <div className="flex items-center gap-3">
              <h3 className="font-geist text-xl font-bold">Issue Breakdown</h3>
              <SampleDataPill />
            </div>
            <MoreHorizontal size={24} className="text-on-surface-variant cursor-pointer" />
          </div>
          <div className="flex-1 p-6 flex items-center justify-center gap-12">
            <div className="w-48 h-48 rounded-full border-[16px] border-surface-container relative">
              <div className="absolute inset-[-16px] rounded-full border-[16px] border-error" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 80% 100%)' }}></div>
              <div className="absolute inset-[-16px] rounded-full border-[16px] border-amber-500" style={{ clipPath: 'polygon(50% 50%, 80% 100%, 0 100%, 0 70%)' }}></div>
              <div className="absolute inset-[-16px] rounded-full border-[16px] border-primary" style={{ clipPath: 'polygon(50% 50%, 0 70%, 0 0, 50% 0)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="font-geist text-2xl font-bold">142</span>
                <span className="font-mono text-[10px] uppercase text-on-surface-variant">Issues</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-error border-2 border-on-surface"></div>
                <div>
                  <p className="font-geist text-sm font-bold">Hallucinations</p>
                  <p className="font-mono text-xs text-on-surface-variant">42% (60 cases)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-amber-500 border-2 border-on-surface"></div>
                <div>
                  <p className="font-geist text-sm font-bold">Tone/Formatting</p>
                  <p className="font-mono text-xs text-on-surface-variant">33% (47 cases)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-primary border-2 border-on-surface"></div>
                <div>
                  <p className="font-geist text-sm font-bold">Safety Flags</p>
                  <p className="font-mono text-xs text-on-surface-variant">25% (35 cases)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Insights Section */}
      <div className="bg-surface-container-low border-2 border-on-surface p-8 neo-shadow-sm">
        <h3 className="font-geist text-2xl font-bold mb-6 flex items-center gap-2">
          <Lightbulb size={24} className="text-primary" />
          Automated Insights
          <SampleDataPill />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-on-surface p-6 hover:bg-primary-container hover:text-on-primary-container transition-colors group cursor-pointer">
            <h4 className="font-geist text-lg font-bold mb-2 group-hover:text-primary-fixed">Prompt Optimization</h4>
            <p className="font-geist text-sm text-on-surface-variant group-hover:text-on-primary-container mb-4">Adding explicit format instructions to &quot;Support-Bot-v4&quot; could reduce formatting errors by an estimated 15%.</p>
            <span className="font-mono text-xs font-bold flex items-center gap-1 group-hover:text-primary-fixed">View Details <ArrowRight size={14} /></span>
          </div>
          <div className="bg-white border-2 border-on-surface p-6 hover:bg-error-container hover:text-on-error-container transition-colors group cursor-pointer">
            <h4 className="font-geist text-lg font-bold mb-2 group-hover:text-error">Latency Alert</h4>
            <p className="font-geist text-sm text-on-surface-variant group-hover:text-on-error-container mb-4">P99 latency has increased by 400ms during peak hours (14:00-16:00 UTC) over the last 3 days.</p>
            <span className="font-mono text-xs font-bold flex items-center gap-1 group-hover:text-error">Investigate <ArrowRight size={14} /></span>
          </div>
          <div className="bg-white border-2 border-on-surface p-6 hover:bg-tertiary-container hover:text-on-tertiary-container transition-colors group cursor-pointer">
            <h4 className="font-geist text-lg font-bold mb-2 group-hover:text-tertiary-fixed">Knowledge Base Stale</h4>
            <p className="font-geist text-sm text-on-surface-variant group-hover:text-on-tertiary-container mb-4">High rate of grounding failures detected for queries related to &quot;Q3 Financials&quot;. Consider updating vector DB.</p>
            <span className="font-mono text-xs font-bold flex items-center gap-1 group-hover:text-tertiary-fixed">Manage Data <ArrowRight size={14} /></span>
          </div>
        </div>
      </div>

    </div>
  );
}


