const metrics = [
  { title: 'Avg Quality Score', value: '0.94', change: '+2.4%', icon: 'grade', isGood: true },
  { title: 'Safety Violations', value: '12', change: '-5', icon: 'security', isGood: true },
  { title: 'Hallucination Rate', value: '1.2%', change: '+0.3%', icon: 'psychology_alt', isGood: false },
  { title: 'Total Tokens Processed', value: '42.8M', change: '+12%', icon: 'toll', isGood: true },
];

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
            <span className="material-symbols-outlined text-[18px]">download</span> Export Report
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(m => (
          <div key={m.title} className="bg-white border-2 border-on-surface p-6 neo-shadow hover:translate-y-[-4px] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <p className="font-mono text-xs font-bold text-on-surface-variant uppercase">{m.title}</p>
              <span className="material-symbols-outlined text-outline-variant">{m.icon}</span>
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
            <h3 className="font-geist text-xl font-bold">Quality vs Volume Trend</h3>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">more_horiz</span>
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
            <h3 className="font-geist text-xl font-bold">Issue Breakdown</h3>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">more_horiz</span>
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
          <span className="material-symbols-outlined text-primary">lightbulb</span>
          Automated Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-on-surface p-6 hover:bg-primary-container hover:text-on-primary-container transition-colors group cursor-pointer">
            <h4 className="font-geist text-lg font-bold mb-2 group-hover:text-primary-fixed">Prompt Optimization</h4>
            <p className="font-geist text-sm text-on-surface-variant group-hover:text-on-primary-container mb-4">Adding explicit format instructions to &quot;Support-Bot-v4&quot; could reduce formatting errors by an estimated 15%.</p>
            <span className="font-mono text-xs font-bold flex items-center gap-1 group-hover:text-primary-fixed">View Details <span className="material-symbols-outlined text-[14px]">arrow_forward</span></span>
          </div>
          <div className="bg-white border-2 border-on-surface p-6 hover:bg-error-container hover:text-on-error-container transition-colors group cursor-pointer">
            <h4 className="font-geist text-lg font-bold mb-2 group-hover:text-error">Latency Alert</h4>
            <p className="font-geist text-sm text-on-surface-variant group-hover:text-on-error-container mb-4">P99 latency has increased by 400ms during peak hours (14:00-16:00 UTC) over the last 3 days.</p>
            <span className="font-mono text-xs font-bold flex items-center gap-1 group-hover:text-error">Investigate <span className="material-symbols-outlined text-[14px]">arrow_forward</span></span>
          </div>
          <div className="bg-white border-2 border-on-surface p-6 hover:bg-tertiary-container hover:text-on-tertiary-container transition-colors group cursor-pointer">
            <h4 className="font-geist text-lg font-bold mb-2 group-hover:text-tertiary-fixed">Knowledge Base Stale</h4>
            <p className="font-geist text-sm text-on-surface-variant group-hover:text-on-tertiary-container mb-4">High rate of grounding failures detected for queries related to &quot;Q3 Financials&quot;. Consider updating vector DB.</p>
            <span className="font-mono text-xs font-bold flex items-center gap-1 group-hover:text-tertiary-fixed">Manage Data <span className="material-symbols-outlined text-[14px]">arrow_forward</span></span>
          </div>
        </div>
      </div>

    </div>
  );
}
