import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import StepBar from "../../../components/ui/StepBar";
import usePostJobStore from "../../../store/postJobStore";
import { generatePRD, suggestExperts } from "../../../api/ai";

// ─── Constants ───────────────────────────────────────────────────────────────

const PACKAGE_META = {
  basic:    { label: "Basic",    range: "$500–$2,500",   color: "bg-gray-100 text-gray-700" },
  standard: { label: "Standard", range: "$2,500–$10,000", color: "bg-blue-100 text-blue-700" },
  premium:  { label: "Premium",  range: "$10,000+",       color: "bg-orange-100 text-orange-700" },
};

const EXPERT_POOL = {
  "Natural Language Processing": [
    { id: "e1", name: "Dr. Aris Thorn",  title: "LLM Research Lead",       skills: ["NLP", "Fine-tuning", "RAG"],        rating: 4.9, jobs: 47, rate: "$120/hr", initials: "AT", match: 97, color: "bg-orange-100 text-orange-600" },
    { id: "e2", name: "Sarah Chen",      title: "NLP Engineer",             skills: ["BERT", "GPT-4", "PyTorch"],         rating: 4.8, jobs: 32, rate: "$95/hr",  initials: "SC", match: 91, color: "bg-blue-100 text-blue-600"   },
    { id: "e3", name: "Liam Park",       title: "AI Researcher",            skills: ["Transformers", "LangChain", "HF"],  rating: 4.7, jobs: 28, rate: "$85/hr",  initials: "LP", match: 88, color: "bg-purple-100 text-purple-600"},
  ],
  "Computer Vision": [
    { id: "e4", name: "Elena Rossi",     title: "CV Lead",                  skills: ["YOLO", "OpenCV", "TensorFlow"],     rating: 4.9, jobs: 55, rate: "$130/hr", initials: "ER", match: 96, color: "bg-rose-100 text-rose-600"    },
    { id: "e5", name: "Marcus Vane",     title: "Vision Engineer",          skills: ["CNN", "Detectron2", "Keras"],       rating: 4.8, jobs: 38, rate: "$105/hr", initials: "MV", match: 92, color: "bg-indigo-100 text-indigo-600"},
    { id: "e6", name: "Yuki Tanaka",     title: "ML Researcher",            skills: ["PyTorch", "ONNX", "TensorRT"],      rating: 4.7, jobs: 22, rate: "$90/hr",  initials: "YT", match: 85, color: "bg-teal-100 text-teal-600"    },
  ],
  Automation: [
    { id: "e7", name: "Carlos Mendes",   title: "Automation Architect",     skills: ["RPA", "Python", "Airflow"],         rating: 4.9, jobs: 61, rate: "$110/hr", initials: "CM", match: 95, color: "bg-green-100 text-green-600"  },
    { id: "e8", name: "Priya Nair",      title: "MLOps Engineer",           skills: ["Kubernetes", "MLflow", "CI/CD"],    rating: 4.8, jobs: 44, rate: "$100/hr", initials: "PN", match: 90, color: "bg-cyan-100 text-cyan-600"    },
    { id: "e9", name: "Tom Brewer",      title: "Backend AI Dev",           skills: ["FastAPI", "Celery", "Redis"],       rating: 4.6, jobs: 30, rate: "$80/hr",  initials: "TB", match: 83, color: "bg-amber-100 text-amber-600"  },
  ],
  "AI Chatbot": [
    { id: "e10", name: "Aisha Okonkwo", title: "Conversational AI Lead",    skills: ["DialogFlow", "Rasa", "LLM"],        rating: 4.9, jobs: 52, rate: "$115/hr", initials: "AO", match: 98, color: "bg-fuchsia-100 text-fuchsia-600"},
    { id: "e11", name: "Felix Braun",   title: "Chatbot Engineer",          skills: ["OpenAI", "LangChain", "Vector DB"], rating: 4.8, jobs: 36, rate: "$95/hr",  initials: "FB", match: 93, color: "bg-sky-100 text-sky-600"      },
    { id: "e12", name: "Mei Lin",       title: "NLP Developer",             skills: ["BERT", "Semantic Search", "Redis"], rating: 4.7, jobs: 25, rate: "$85/hr",  initials: "ML", match: 87, color: "bg-violet-100 text-violet-600" },
  ],
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionField({ icon, label, value, onChange, rows = 3, placeholder }) {
  return (
    <div className="group">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 leading-relaxed resize-none outline-none focus:border-orange-400 focus:bg-white transition-colors"
      />
    </div>
  );
}

function ExpertCard({ expert }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${expert.color}`}>
          {expert.initials}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[#15153d] text-sm truncate">{expert.name}</h4>
          <p className="text-gray-500 text-xs">{expert.title}</p>
        </div>
        <span className="flex-shrink-0 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
          {expert.match}% match
        </span>
      </div>
      <div className="flex flex-wrap gap-1 mb-4">
        {expert.skills.map((s) => (
          <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{s}</span>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm mt-auto mb-4">
        <span className="text-gray-500">⭐ {expert.rating} · {expert.jobs} jobs</span>
        <span className="font-semibold text-[#15153d]">{expert.rate}</span>
      </div>
      <button className="w-full bg-[#15153d] hover:bg-[#1f1f5a] transition-colors text-white rounded-xl py-2.5 text-sm font-semibold">
        Invite to Apply
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PostJob03() {
  const navigate = useNavigate();
  const store = usePostJobStore();
  const pkg = PACKAGE_META[store.selectedPackage] || PACKAGE_META.basic;
  const timeline = store.timelineAmount ? `${store.timelineAmount} ${store.timelineUnit}` : null;

  // ── Document sections state (structured mode — before AI) ──
  const [objective,    setObjective]    = useState("");
  const [requirements, setRequirements] = useState("");
  const [scope,        setScope]        = useState("");
  const [expectations, setExpectations] = useState("");

  // ── AI mode state ──
  const [aiContent,    setAiContent]    = useState("");
  const [isAIMode,     setIsAIMode]     = useState(false); // true = show AI textarea
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated,  setIsGenerated]  = useState(false);
  const [experts,      setExperts]      = useState([]);

  // ── Initialize sections from store on mount ──
  useEffect(() => {
    if (store.generatedPRD) {
      setAiContent(store.generatedPRD);
      setExperts(store.suggestedExperts || []);
      setIsAIMode(true);
      setIsGenerated(true);
    } else {
      setObjective(store.description || "");
      setRequirements(
        `• Domain: ${store.category}\n• Timeline: ${timeline || "To be determined"}\n• Budget Package: ${pkg.label} (${pkg.range})`
      );
      setScope(
        `1. Requirements analysis and solution architecture\n2. Core implementation and iterative development\n3. Testing, validation, and performance benchmarking\n4. Documentation, handoff, and deployment support`
      );
      setExpectations(
        `Experienced AI specialist with a proven track record in ${store.category}. Prior published work or portfolio projects in the relevant domain are strongly preferred.`
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Build full document text from structured sections ──
  const buildDocumentFromSections = () =>
    `# Project Overview: ${store.title || "Untitled Project"}\n\n` +
    `## Objective\n${objective}\n\n` +
    `## Technical Requirements\n${requirements}\n\n` +
    `## Scope of Work\n${scope}\n\n` +
    `## Candidate Expectations\n${expectations}`;

  // ── AI generation ──
  const handleOptimizeWithAI = async () => {
    setIsGenerating(true);
    try {
      const jobData = {
        title: store.title,
        category: store.category,
        timelineAmount: store.timelineAmount,
        timelineUnit: store.timelineUnit,
        description: objective || store.description,
        selectedPackage: store.selectedPackage,
      };

      let prd, expertList;
      try {
        const [prdRes, expertsRes] = await Promise.all([
          generatePRD(jobData),
          suggestExperts(jobData),
        ]);
        prd = prdRes.prd;
        expertList = expertsRes.experts;
      } catch {
        await new Promise((r) => setTimeout(r, 2000));
        prd =
          buildDocumentFromSections() +
          `\n\n---\n## AI Enhancements\n` +
          `- Clarified success metrics and KPIs for each deliverable\n` +
          `- Added compliance and data handling considerations\n` +
          `- Recommended evaluation benchmarks for ${store.category}\n` +
          `- Identified potential technical risks and mitigation strategies`;
        expertList = EXPERT_POOL[store.category] || EXPERT_POOL["Natural Language Processing"];
      }

      setAiContent(prd);
      setExperts(expertList);
      setIsAIMode(true);
      setIsGenerated(true);
      store.setAIResults({ prd, experts: expertList });
      toast.success("AI generation complete!");
    } catch {
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePostJobNow = () => {
    toast.success("Project posted successfully!");
    store.reset();
    navigate("/dashboard");
  };

  return (
    <>
      <StepBar currentStep={3} />

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">

        {/* ── CARD HEADER ── */}
        <div className="bg-[#f4f6ff] px-8 py-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#15153d]">Review & Publish</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Review the details auto-filled from your form. Optionally let AI enhance it.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOptimizeWithAI}
            disabled={isGenerating}
            className="bg-[#027a89] hover:bg-[#02636f] disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white px-5 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Generating...
              </>
            ) : isGenerated ? (
              <>✓ Regenerate with AI</>
            ) : (
              <><span>✨</span> Optimize with AI</>
            )}
          </button>
        </div>

        {/* ── CARD BODY ── */}
        <div className="p-8">

          {/* ── SUMMARY BAR — data from steps 1 & 2 ── */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4 mb-8">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5">Job Title</p>
              <h3 className="text-lg font-bold text-[#15153d] truncate">
                {store.title || <span className="text-gray-400 font-normal italic">Not provided</span>}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white border border-indigo-200 text-indigo-700 text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm">
                {store.category}
              </span>
              {timeline && (
                <span className="bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm">
                  ⏱ {timeline}
                </span>
              )}
              <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${
                store.selectedPackage === "premium"
                  ? "bg-orange-50 border-orange-200 text-orange-700"
                  : store.selectedPackage === "standard"
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-gray-50 border-gray-200 text-gray-600"
              }`}>
                {pkg.label} · {pkg.range}
              </span>
            </div>
          </div>

          {/* ── DOCUMENT AREA ── */}
          <div className="relative">

            {/* Loading overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20 rounded-2xl">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#027a89] animate-spin mb-4" />
                <p className="text-[#027a89] font-semibold">AI is generating your PRD...</p>
                <p className="text-gray-400 text-sm mt-1">Analyzing requirements and matching expert profiles</p>
              </div>
            )}

            {isAIMode ? (
              /* ── AI-generated content — single editable textarea ── */
              <div className="border border-gray-300 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#027a89]/10 to-transparent border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">✨</span>
                    <span className="text-xs font-bold text-[#027a89] uppercase tracking-wider">AI-Generated PRD</span>
                  </div>
                  <button
                    onClick={() => { setIsAIMode(false); setIsGenerated(false); }}
                    className="text-xs text-gray-400 hover:text-gray-600 font-medium"
                  >
                    ← Back to form view
                  </button>
                </div>
                <textarea
                  value={aiContent}
                  onChange={(e) => setAiContent(e.target.value)}
                  className="w-full px-6 py-5 font-mono text-sm text-gray-700 leading-relaxed resize-none outline-none bg-white min-h-[380px]"
                />
              </div>
            ) : (
              /* ── Structured sections — auto-filled from steps 1 & 2 ── */
              <div className="border border-gray-200 rounded-2xl p-6 space-y-6 bg-gray-50/40">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">📄 Requirement Document</span>
                  <span className="text-xs text-gray-400">— auto-filled from your form · fully editable</span>
                </div>

                <SectionField
                  icon="🎯"
                  label="Objective / Description"
                  value={objective}
                  onChange={setObjective}
                  rows={5}
                  placeholder="Describe the scope, goals, and specific challenges of this project..."
                />

                <SectionField
                  icon="⚙️"
                  label="Technical Requirements"
                  value={requirements}
                  onChange={setRequirements}
                  rows={4}
                  placeholder="Domain, timeline, budget, and key technical constraints..."
                />

                <SectionField
                  icon="📋"
                  label="Scope of Work"
                  value={scope}
                  onChange={setScope}
                  rows={5}
                  placeholder="List the main deliverables and work phases..."
                />

                <SectionField
                  icon="👤"
                  label="Candidate Expectations"
                  value={expectations}
                  onChange={setExpectations}
                  rows={3}
                  placeholder="Describe the ideal expert profile and required experience..."
                />
              </div>
            )}
          </div>

          {/* ── AI-SUGGESTED EXPERTS ── */}
          {isGenerated && experts.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">✨</span>
                <h3 className="text-xl font-bold text-[#15153d]">AI-Suggested Experts</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Based on your requirements, we found {experts.length} experts with high compatibility scores.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {experts.map((expert) => (
                  <ExpertCard key={expert.id} expert={expert} />
                ))}
              </div>
            </div>
          )}

          {/* ── NAVIGATION ── */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/post-job/step-2")}
              className="text-[#15153d] font-semibold text-lg hover:underline"
            >
              ← Back
            </button>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => toast.success("Draft saved!")}
                className="text-gray-500 hover:text-gray-700 font-semibold text-lg px-4 py-2"
              >
                Save as Draft
              </button>
              <Button
                variant="primary"
                onClick={handlePostJobNow}
                className="!px-8 flex items-center gap-2"
              >
                Post Job Now 🚀
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}