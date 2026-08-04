// --- Reusable "Sample Data" pill ---

function SampleDataPill() {
  return (
    <span
      title="This record is a static demo and is not connected to real backend data."
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 7px",
        fontSize: "9px",
        fontFamily: "monospace",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#92400e",
        background: "#fef3c7",
        border: "1.5px solid #d97706",
        borderRadius: "2px",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "10px", lineHeight: 1 }}>
        science
      </span>
      Sample Data
    </span>
  );
}

export default function EvaluationDetailsPage() {
  return (
    <main className="p-6 max-w-[1400px] mx-auto w-full space-y-5">

      {/* Demo Data Notice */}
      <div
        role="note"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          padding: "12px 16px",
          background: "#fffbeb",
          border: "2px solid #d97706",
          boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
        }}
      >
        <span className="material-symbols-outlined" style={{ color: "#b45309", fontSize: "20px", flexShrink: 0, marginTop: "1px" }}>
          science
        </span>
        <div>
          <p style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>
            Page Not Active — Demo Data Only
          </p>
          <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#78350f", lineHeight: 1.5 }}>
            This page is currently not active. This evaluation record (EVAL-8291) is static sample data for demonstration purposes only. Real evaluation results will appear here once the evaluation pipeline is connected.
          </p>
        </div>
      </div>

      {/* Hero Section: Header Details */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b-2 border-outline-variant">
        <div className="space-y-2">
          <nav className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-on-surface-variant uppercase">
            <span>Evaluations</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-on-surface">EVAL-8291</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-geist text-2xl font-extrabold tracking-tight">EVAL-8291</h2>
            <div className="flex gap-1.5">
              <span className="px-2 py-0.5 bg-emerald-500 text-white border-2 border-emerald-700 font-mono text-[10px] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                COMPLETED
              </span>
              <span className="px-2 py-0.5 bg-amber-400 text-on-surface border-2 border-amber-600 font-mono text-[10px] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                MEDIUM RISK
              </span>
              <span className="px-2 py-0.5 bg-primary-container text-on-primary-container border-2 border-primary font-mono text-[10px] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                REVIEW
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-on-surface neo-shadow-lg flex flex-col items-center justify-center min-w-[140px]">
          <span className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
            Overall Score
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-geist text-3xl font-extrabold text-primary">72</span>
            <span className="font-geist text-lg font-bold text-on-surface-variant">/100</span>
          </div>
        </div>
      </section>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Main Data Column */}
        <div className="col-span-1 lg:col-span-8 space-y-6">

          {/* Score Breakdown Bento */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="font-mono text-[10px] font-bold text-on-surface-variant uppercase">Score Breakdown</p>
              <SampleDataPill />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white border-2 border-on-surface neo-shadow">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-[10px] font-bold uppercase text-on-surface-variant">Quality</span>
                  <span className="font-geist text-xl font-bold">72</span>
                </div>
                <div className="h-3 bg-surface-container border-2 border-on-surface">
                  <div className="h-full bg-primary" style={{ width: "72%" }} />
                </div>
              </div>

              <div className="p-4 bg-white border-2 border-on-surface neo-shadow">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-[10px] font-bold uppercase text-on-surface-variant">Safety</span>
                  <span className="font-geist text-xl font-bold">100</span>
                </div>
                <div className="h-3 bg-surface-container border-2 border-on-surface">
                  <div className="h-full bg-emerald-500" style={{ width: "100%" }} />
                </div>
              </div>

              <div className="p-4 bg-white border-2 border-on-surface neo-shadow">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-[10px] font-bold uppercase text-on-surface-variant">Trust</span>
                  <span className="font-geist text-xl font-bold">45</span>
                </div>
                <div className="h-3 bg-surface-container border-2 border-on-surface">
                  <div className="h-full bg-error" style={{ width: "45%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Criteria Table */}
          <div className="bg-white border-2 border-on-surface neo-shadow overflow-hidden">
            <div className="p-3 border-b-2 border-on-surface bg-surface-container-low flex items-center gap-3">
              <h3 className="font-geist text-lg font-bold">Individual Criteria</h3>
              <SampleDataPill />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface font-mono text-[10px] font-bold text-on-surface-variant uppercase">
                  <tr>
                    <th className="px-4 py-2.5 border-b-2 border-on-surface">Criterion</th>
                    <th className="px-4 py-2.5 border-b-2 border-on-surface">Score</th>
                    <th className="px-4 py-2.5 border-b-2 border-on-surface">Status</th>
                    <th className="px-4 py-2.5 border-b-2 border-on-surface">Reasoning</th>
                  </tr>
                </thead>
                <tbody className="font-geist text-sm">
                  <tr className="hover:bg-surface-container-lowest">
                    <td className="px-4 py-3 border-b border-outline-variant font-bold">Correctness</td>
                    <td className="px-4 py-3 border-b border-outline-variant">72/100</td>
                    <td className="px-4 py-3 border-b border-outline-variant">
                      <span className="px-1.5 py-0.5 border border-amber-600 bg-amber-50 text-amber-800 text-[10px] font-bold">
                        REVIEW
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-outline-variant text-on-surface-variant text-xs">
                      Inconsistent with provided context in section 3.
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-lowest">
                    <td className="px-4 py-3 border-b border-outline-variant font-bold">Relevance</td>
                    <td className="px-4 py-3 border-b border-outline-variant">95/100</td>
                    <td className="px-4 py-3 border-b border-outline-variant">
                      <span className="px-1.5 py-0.5 border border-emerald-600 bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                        PASS
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-outline-variant text-on-surface-variant text-xs">
                      Highly aligned with user intent.
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-lowest">
                    <td className="px-4 py-3 border-b border-outline-variant font-bold">Hallucination</td>
                    <td className="px-4 py-3 border-b border-outline-variant text-error font-bold">45/100</td>
                    <td className="px-4 py-3 border-b border-outline-variant">
                      <span className="px-1.5 py-0.5 border border-error bg-error-container text-on-error-container text-[10px] font-bold">
                        BLOCK
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-outline-variant text-on-surface-variant text-xs">
                      Generated unverified statistics regarding GDP growth.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Judge Reasoning */}
          <div className="p-5 bg-white border-2 border-on-surface neo-shadow space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              <h3 className="font-geist text-lg font-bold">Judge Reasoning</h3>
              <SampleDataPill />
            </div>
            <p className="font-geist text-sm text-on-surface-variant leading-relaxed">
              The evaluation of EVAL-8291 highlights a critical divergence between safety and factual integrity.
              While the model successfully adhered to all safety protocols—exhibiting zero toxic content or PII leakage—it failed
              the Trust threshold due to hallucinations in the analytical summary. Specifically, the model cited a
              &quot;3.4% increase in regional stability&quot; which does not appear in the source grounding documents.
              This represents a moderate risk for production deployment without human-in-the-loop verification.
            </p>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="col-span-1 lg:col-span-4 space-y-6">

          {/* Metadata Panel */}
          <div className="bg-surface-container-low border-2 border-on-surface p-4 space-y-4">
            <h4 className="font-mono text-[10px] font-bold uppercase text-on-surface-variant border-b border-outline-variant pb-2">
              Technical Metadata
            </h4>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <p className="text-on-surface-variant text-[10px] uppercase mb-0.5 font-bold">Model Node</p>
                <p className="font-bold">GPT-4-Turbo-0409</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-[10px] uppercase mb-0.5 font-bold">Timestamp</p>
                <p className="font-bold">2023-10-24 14:22:01 UTC</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-[10px] uppercase mb-0.5 font-bold">Input Type</p>
                <p className="font-bold">JSON Payload (RAG)</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-[10px] uppercase mb-0.5 font-bold">Latency</p>
                <p className="font-bold text-primary">842ms</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white border-2 border-on-surface neo-shadow p-4">
            <h4 className="font-geist text-lg font-bold mb-3">Recommendations</h4>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">check_circle</span>
                <p className="font-geist text-sm">Increase grounding weight for factual queries in the prompt template.</p>
              </li>
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">check_circle</span>
                <p className="font-geist text-sm">Enable &apos;Strict&apos; citation mode to ensure all numbers are linked to source.</p>
              </li>
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">check_circle</span>
                <p className="font-geist text-sm">Add a second-pass verification step for high-risk economic data.</p>
              </li>
            </ul>
            <button className="w-full mt-4 py-2 bg-on-surface text-white text-sm font-bold border-2 border-on-surface hover:bg-primary transition-all cursor-pointer neo-shadow-sm hover:neo-shadow-active active:translate-y-0.5">
              RETRAIN MODEL
            </button>
          </div>

          {/* Illustration/Visual Asset */}
          <div className="relative h-36 border-2 border-on-surface overflow-hidden group">
            <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110 bg-slate-200 flex items-center justify-center dot-grid">
              <span className="material-symbols-outlined text-slate-400 text-5xl">schema</span>
            </div>
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
            <div className="absolute bottom-3 left-3 bg-white px-2 py-0.5 border-2 border-on-surface font-mono text-[10px] font-bold">
              S-X/01 SCHEMATIC
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
