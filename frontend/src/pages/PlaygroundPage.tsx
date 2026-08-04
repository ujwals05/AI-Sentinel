import { useState } from 'react';
import { Loader2, LineChart, CheckCircle2, ChevronDown, Gavel, Shield, TriangleAlert, Lightbulb } from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import { useEvaluatePlayground } from '../hooks/usePlayground';
import type { PlaygroundEvaluationResponse } from '../services/api.service';

export default function PlaygroundPage() {
  const [activeCriteria, setActiveCriteria] = useState(['Correctness', 'Safety']);
  const [inputType, setInputType] = useState('Chat');
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const [selectedAppId, setSelectedAppId] = useState('');
  const [userInput, setUserInput] = useState('');
  const [output, setOutput] = useState('');
  const [metadata, setMetadata] = useState('');
  
  const [results, setResults] = useState<PlaygroundEvaluationResponse | null>(null);

  const { data: applications = [] } = useApplications();
  const { mutate: evaluate, isPending: isEvaluating } = useEvaluatePlayground();

  const handleRunEvaluation = () => {
    if (!selectedAppId || !userInput || !output) return;

    let parsedMetadata;
    try {
      parsedMetadata = metadata ? JSON.parse(metadata) : undefined;
    } catch {
      parsedMetadata = { context: metadata };
    }

    evaluate(
      {
        applicationId: selectedAppId,
        input: userInput,
        output,
        metadata: parsedMetadata
      },
      {
        onSuccess: (res) => {
          setResults(res.data);
        }
      }
    );
  };

  const toggleCriteria = (criteria: string) => {
    setActiveCriteria((prev) =>
      prev.includes(criteria) ? prev.filter((c) => c !== criteria) : [...prev, criteria]
    );
  };

  const toggleDetails = (id: string) => {
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 overflow-hidden p-6 flex flex-col h-[calc(100vh-48px)]">
      <div className="max-w-[1400px] mx-auto w-full h-full flex flex-col gap-4">
        <div className="flex flex-col gap-1 shrink-0">
          <h2 className="font-geist text-2xl font-extrabold text-on-surface tracking-tight">
            Evaluation Playground
          </h2>
          <p className="font-geist text-sm text-on-surface-variant">
            Test and audit LLM responses manually against your governance frameworks.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">
          {/* Left Panel: Configuration */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 lg:pr-4">
            <section className="bg-surface border-2 border-on-surface p-5 neo-shadow flex flex-col gap-5">
              <h3 className="font-geist text-lg font-bold border-b-2 border-on-surface pb-2">
                Configuration
              </h3>

              {/* Application Selector */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant block">
                  Target Application
                </label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="w-full border-2 border-on-surface p-2.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                >
                  <option value="" disabled>Select an Application</option>
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>{app.name}</option>
                  ))}
                </select>
              </div>

              {/* Input Type */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant block">
                  Input Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Chat', 'Text', 'Code'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setInputType(type)}
                      className={`py-1.5 text-sm border-2 border-on-surface font-bold transition-colors cursor-pointer ${inputType === type
                          ? 'bg-primary-container text-on-primary-container neo-shadow-sm'
                          : 'bg-surface text-on-surface hover:bg-surface-container-low'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evaluation Criteria */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant block">
                  Evaluation Criteria
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'Correctness', activeClass: 'bg-secondary-container border-secondary text-on-secondary-container' },
                    { id: 'Safety', activeClass: 'bg-error-container border-error text-on-error-container' },
                    { id: 'Hallucination', activeClass: 'bg-primary-container border-primary text-on-primary-container' },
                    { id: 'Bias', activeClass: 'bg-tertiary-container border-tertiary text-on-tertiary-container' },
                    { id: 'Tone', activeClass: 'bg-primary-fixed border-on-primary-fixed-variant text-on-primary-fixed-variant' },
                  ].map((c) => {
                    const isActive = activeCriteria.includes(c.id);
                    return (
                      <span
                        key={c.id}
                        onClick={() => toggleCriteria(c.id)}
                        className={`px-2.5 py-1 font-bold text-[10px] uppercase cursor-pointer transition-colors border-2 ${isActive
                            ? `${c.activeClass} neo-shadow-sm`
                            : 'bg-surface border-on-surface text-on-surface-variant hover:bg-surface-container'
                          }`}
                      >
                        {c.id}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Text Areas */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant block">
                    User Prompt
                  </label>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full border-2 border-on-surface p-2.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest custom-scrollbar"
                    placeholder="Enter the user's input..."
                    rows={3}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant block">
                    AI Response
                  </label>
                  <textarea
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    className="w-full border-2 border-on-surface p-2.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest custom-scrollbar"
                    placeholder="Paste the AI's response here..."
                    rows={3}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant flex justify-between">
                    <span>Grounding Context</span>
                    <span className="text-[10px] text-primary">Optional</span>
                  </label>
                  <textarea
                    value={metadata}
                    onChange={(e) => setMetadata(e.target.value)}
                    className="w-full border-2 border-on-surface p-2.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest custom-scrollbar"
                    placeholder='{"context": "...", "policy": "..."}'
                    rows={2}
                  />
                </div>
              </div>

              <button
                onClick={handleRunEvaluation}
                disabled={isEvaluating || !selectedAppId || !userInput || !output}
                className={`mt-2 w-full bg-primary py-2.5 text-on-primary font-geist text-sm font-bold border-2 border-on-surface transition-all uppercase tracking-wide ${(isEvaluating || !selectedAppId || !userInput || !output)
                    ? 'neo-shadow-active opacity-90 cursor-not-allowed'
                    : 'neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:neo-shadow-active cursor-pointer'
                  }`}
              >
                {isEvaluating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    EVALUATING...
                  </span>
                ) : (
                  'RUN EVALUATION'
                )}
              </button>
            </section>
          </div>

          {/* Right Panel: Results */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 lg:pr-4">
            {!results ? (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-xl p-10 text-center bg-surface-container-low min-h-[300px]">
                <LineChart size={48} className="text-outline-variant mb-3" />
                <h3 className="font-geist text-lg font-bold text-on-surface-variant mb-1.5">
                  Submit an AI response to begin
                </h3>
                <p className="font-geist text-sm text-on-surface-variant max-w-md">
                  Our judge models will analyze the input and output based on your selected criteria
                  to generate scores and risk assessments.
                </p>
              </div>
            ) : (
              /* Results View */
              <div className="flex flex-col gap-4 pb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface border-2 border-on-surface p-5 neo-shadow flex flex-col items-center justify-center gap-1.5">
                    <p className="font-mono text-[10px] font-bold uppercase text-on-surface-variant">
                      Overall Score
                    </p>
                    <p className="font-geist text-4xl font-extrabold text-primary leading-none">
                      {results.overallScore}<span className="text-lg">/100</span>
                    </p>
                  </div>
                  <div className="bg-surface border-2 border-on-surface p-5 neo-shadow flex flex-col items-center justify-center gap-1.5">
                    <p className="font-mono text-[10px] font-bold uppercase text-on-surface-variant">
                      Risk Level
                    </p>
                    <div className={`px-4 py-1.5 border-2 border-on-surface font-geist text-lg font-bold uppercase neo-shadow-sm ${
                      results.riskLevel === 'LOW' ? 'bg-emerald-100 text-emerald-900 border-emerald-700' :
                      results.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-900 border-amber-700' :
                      'bg-error-container text-on-error-container border-error'
                    }`}>
                      {results.riskLevel}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-mono text-[10px] font-bold uppercase text-on-surface-variant">
                    Judge Metrics
                  </h4>

                  {/* Quality Judge */}
                  <div className="bg-surface border-2 border-on-surface neo-shadow cursor-pointer group">
                    <div
                      className="p-3 flex items-center justify-between border-b-2 border-on-surface group-hover:bg-surface-container-low transition-colors"
                      onClick={() => toggleDetails('quality')}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-primary" />
                        <span className="font-geist text-sm font-bold">Quality Judge</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs bg-secondary-container px-2 border-2 border-on-surface font-bold">
                          92%
                        </span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${expandedDetails['quality'] ? 'rotate-180' : ''
                            }`}
                        />
                      </div>
                    </div>
                    {expandedDetails['quality'] && (
                      <div className="p-3 space-y-2.5 bg-surface-container-lowest">
                        <div className="flex justify-between items-center text-xs font-mono font-bold">
                          <span>Completeness</span>
                          <div className="w-28 h-1.5 bg-surface border-2 border-on-surface">
                            <div className="h-full bg-primary" style={{ width: '95%' }} />
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono font-bold">
                          <span>Grammar &amp; Flow</span>
                          <div className="w-28 h-1.5 bg-surface border-2 border-on-surface">
                            <div className="h-full bg-primary" style={{ width: '88%' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Safety Judge */}
                  <div className="bg-surface border-2 border-on-surface neo-shadow cursor-pointer group">
                    <div
                      className="p-3 flex items-center justify-between border-b-2 border-on-surface group-hover:bg-surface-container-low transition-colors"
                      onClick={() => toggleDetails('safety')}
                    >
                      <div className="flex items-center gap-2">
                        <Gavel size={20} className="text-error" />
                        <span className="font-geist text-sm font-bold">Safety Judge</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs bg-error-container px-2 border-2 border-on-surface font-bold">
                          100%
                        </span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${expandedDetails['safety'] ? 'rotate-180' : ''
                            }`}
                        />
                      </div>
                    </div>
                    {expandedDetails['safety'] && (
                      <div className="p-3 space-y-2.5 bg-surface-container-lowest">
                        <div className="flex justify-between items-center text-xs font-mono font-bold">
                          <span>Hate Speech</span>
                          <span className="text-emerald-600 font-bold">CLEAN</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono font-bold">
                          <span>PII Exposure</span>
                          <span className="text-emerald-600 font-bold">CLEAN</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Trust Judge */}
                  <div className="bg-surface border-2 border-on-surface neo-shadow cursor-pointer group">
                    <div
                      className="p-3 flex items-center justify-between border-b-2 border-on-surface group-hover:bg-surface-container-low transition-colors"
                      onClick={() => toggleDetails('trust')}
                    >
                      <div className="flex items-center gap-2">
                        <Shield size={20} className="text-tertiary" />
                        <span className="font-geist text-sm font-bold">Trust Judge</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs bg-tertiary-fixed px-2 border-2 border-on-surface font-bold">
                          61%
                        </span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${expandedDetails['trust'] ? 'rotate-180' : ''
                            }`}
                        />
                      </div>
                    </div>
                    {expandedDetails['trust'] && (
                      <div className="p-3 space-y-2.5 bg-surface-container-lowest">
                        <div className="flex justify-between items-center text-xs font-mono font-bold">
                          <span>Grounding Alignment</span>
                          <div className="w-28 h-1.5 bg-surface border-2 border-on-surface">
                            <div className="h-full bg-tertiary-container" style={{ width: '45%' }} />
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono font-bold">
                          <span>Source Attribution</span>
                          <div className="w-28 h-1.5 bg-surface border-2 border-on-surface">
                            <div className="h-full bg-primary" style={{ width: '78%' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant block">
                    Judge Explanation
                  </label>
                  <div className="bg-surface-container-low border-2 border-on-surface p-3 font-geist text-sm leading-relaxed neo-shadow-sm">
                    {results.summary}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] font-bold uppercase text-error block">
                      Detected Issues
                    </label>
                    <ul className="space-y-1.5">
                      {[...(results.judges.quality?.issues || []), ...(results.judges.safety?.issues || []), ...(results.judges.trust?.issues || [])].map((issue, idx) => (
                        <li key={idx} className="flex gap-2 font-mono text-[11px] font-bold text-on-surface bg-error-container p-2 border-2 border-error">
                          <TriangleAlert size={14} />
                          {issue}
                        </li>
                      ))}
                      {[...(results.judges.quality?.issues || []), ...(results.judges.safety?.issues || []), ...(results.judges.trust?.issues || [])].length === 0 && (
                        <li className="font-mono text-xs text-on-surface-variant italic">No major issues detected.</li>
                      )}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] font-bold uppercase text-primary block">
                      Recommendations
                    </label>
                    <ul className="space-y-1.5">
                      {[...(results.judges.quality?.recommendations || []), ...(results.judges.safety?.recommendations || []), ...(results.judges.trust?.recommendations || [])].map((rec, idx) => (
                        <li key={idx} className="flex gap-2 font-mono text-[11px] font-bold text-on-surface bg-secondary-container p-2 border-2 border-secondary">
                          <Lightbulb size={14} />
                          {rec}
                        </li>
                      ))}
                      {[...(results.judges.quality?.recommendations || []), ...(results.judges.safety?.recommendations || []), ...(results.judges.trust?.recommendations || [])].length === 0 && (
                        <li className="font-mono text-xs text-on-surface-variant italic">No recommendations.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
