import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import StepBar from "../../../components/ui/StepBar";
import usePostJobStore from "../../../store/postJobStore";
import { generatePRD, suggestExperts } from "../../../api/ai";
import { createJob, saveDraft, updateJob, publishDraft } from "../../../api/jobs";

// ─── Constants ───────────────────────────────────────────────────────────────

const PACKAGE_META = {
  basic:    { label: "Basic",    range: "$500–$2,500",   color: "bg-gray-100 text-gray-700" },
  standard: { label: "Standard", range: "$2,500–$10,000", color: "bg-blue-100 text-blue-700" },
  premium:  { label: "Premium",  range: "$10,000+",       color: "bg-orange-100 text-orange-700" },
};

// ─── Dynamic PRD helpers (package-aware) ─────────────────────────────────────

const SCOPE_BY_PACKAGE = {
  basic: (cat) =>
    `1. Requirements scoping and environment setup\n` +
    `2. Core ${cat} implementation\n` +
    `3. Basic testing and bug fixes\n` +
    `4. Delivery with brief documentation`,

  standard: (cat) =>
    `1. Requirements analysis and solution architecture design\n` +
    `2. Iterative ${cat} development with bi-weekly milestone reviews\n` +
    `3. Integration and performance optimization\n` +
    `4. User acceptance testing (UAT) and feedback cycles\n` +
    `5. Documentation, knowledge transfer, and deployment support`,

  premium: (cat) =>
    `1. Discovery workshop: in-depth requirements gathering, feasibility study, and architecture design\n` +
    `2. Prototype / proof-of-concept with stakeholder sign-off\n` +
    `3. Iterative ${cat} development with weekly check-ins and demos\n` +
    `4. Comprehensive testing: unit, integration, load, and security testing\n` +
    `5. Compliance review (data privacy, security standards) and risk mitigation\n` +
    `6. Production deployment with CI/CD pipeline setup\n` +
    `7. Full technical documentation, team training, and 30-day post-launch support`,
};

const EXPECTATIONS_BY_PACKAGE = {
  basic: (cat) =>
    `Competent ${cat} practitioner with 1–2 years of hands-on experience. ` +
    `Ability to work independently and deliver within the agreed timeline.`,

  standard: (cat) =>
    `Experienced ${cat} specialist with 3+ years of proven project delivery. ` +
    `Strong communication skills, bi-weekly progress updates, and a prior work portfolio are required. ` +
    `Familiarity with modern tooling and best practices in the domain is expected.`,

  premium: (cat) =>
    `Senior ${cat} expert with 5+ years of enterprise-grade project experience. ` +
    `Must demonstrate deep technical expertise, strong stakeholder communication, and the ability to lead architecture decisions independently. ` +
`A portfolio of large-scale projects, prior publications, or notable open-source contributions are strongly preferred. ` +
    `Experience with compliance, security standards, and cross-functional team collaboration is required.`,
};

const TECH_REQS_BY_PACKAGE = {
  basic: (d) =>
    `• Domain: ${d.category}\n` +
    `• Timeline: ${d.timeline || "To be determined"}\n` +
    `• Package: Basic (${PACKAGE_META.basic.range})`,

  standard: (d) =>
    `• Domain: ${d.category}\n` +
    `• Timeline: ${d.timeline || "To be determined"}\n` +
    `• Package: Standard (${PACKAGE_META.standard.range})\n` +
    `• Progress cadence: bi-weekly milestone reports\n` +
    `• Communication: async + weekly sync call`,

  premium: (d) =>
    `• Domain: ${d.category}\n` +
    `• Timeline: ${d.timeline || "To be determined"}\n` +
    `• Package: Premium (${PACKAGE_META.premium.range})\n` +
    `• Deliverables: full technical documentation, production deployment, post-launch support\n` +
    `• Performance benchmarks: defined during discovery workshop\n` +
    `• Compliance: data privacy and security standards adherence required\n` +
    `• Communication: weekly sync calls + dedicated project channel`,
};

function buildDynamicPRD({ title, category, objective, scope, expectations, pkg, timeline }) {
  const pkgKey = pkg || "basic";
  const generatedScope       = scope?.trim()        || SCOPE_BY_PACKAGE[pkgKey](category);
  const generatedExpectations = expectations?.trim() || EXPECTATIONS_BY_PACKAGE[pkgKey](category);
  const techReqs             = TECH_REQS_BY_PACKAGE[pkgKey]({ category, timeline });

  let doc =
    `# Project Requirements Document\n` +
    `## ${title || "AI Project"}\n\n` +
    `---\n\n` +
    `## 🎯 Objective\n` +
    `${objective?.trim() || `Seeking an experienced ${category} specialist to deliver a high-quality AI-powered solution tailored to our business needs.`}\n\n` +
    `## ⚙️ Technical Requirements\n${techReqs}\n\n` +
    `## 📋 Scope of Work\n${generatedScope}\n\n` +
    `## 👤 Candidate Expectations\n${generatedExpectations}\n`;

  if (pkgKey === "standard" || pkgKey === "premium") {
    doc +=
      `\n## 📊 Success Metrics\n` +
      `- All deliverables pass defined acceptance criteria\n` +
      `- Performance benchmarks achieved within the agreed timeline\n` +
      `- Clear handover documentation and knowledge transfer completed\n`;
  }

  if (pkgKey === "premium") {
    doc +=
      `\n## ⚠️ Risk & Mitigation\n` +
      `- Data privacy and security handled per applicable compliance standards\n` +
      `- Defined rollback / fallback plan in case of integration issues\n` +
      `- Weekly risk review and escalation process during project lifecycle\n`;
  }

  return doc;
}

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

function ExpertCard({ expert, isFallback }) {
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
      <button
        disabled={isFallback}
        title={isFallback ? "Expert suggestions are illustrative only" : undefined}
        className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-colors ${
          isFallback
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#15153d] hover:bg-[#1f1f5a] text-white"
        }`}
      >
        {isFallback ? "AI Suggestion Only" : "Invite to Apply"}
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
  const [isFallback,   setIsFallback]   = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // ── Initialize sections from store on mount ──
  const initialPRD        = store.generatedPRD;
  const initialExperts    = store.suggestedExperts;
  const initialDesc       = store.description;
  const initialCategory   = store.category;
  const initialTimeline   = store.timelineAmount
    ? `${store.timelineAmount} ${store.timelineUnit}`
    : null;
  const initialPkg        = PACKAGE_META[store.selectedPackage] || PACKAGE_META.basic;

  useEffect(() => {
    if (initialPRD) {
      setAiContent(initialPRD);
      setExperts(initialExperts || []);
      setIsAIMode(true);
      setIsGenerated(true);
    } else {
      setObjective(initialDesc);
      setRequirements(
        `• Domain: ${initialCategory}\n• Timeline: ${initialTimeline || "To be determined"}\n• Budget Package: ${initialPkg.label} (${initialPkg.range})`
      );
      // Scope and Expectations are left empty — AI will generate them on Optimize
    }
  }, [initialPRD, initialExperts, initialDesc, initialCategory, initialTimeline, initialPkg.label, initialPkg.range]);

  // ── Build full document text from structured sections ──
  const buildDocumentFromSections = () =>
    `# Project Overview: ${store.title || "Untitled Project"}\n\n` +
    `## Objective\n${objective}\n\n` +
    `## Technical Requirements\n${requirements}\n\n` +
    `## Scope of Work\n${scope}\n\n` +
    `## Candidate Expectations\n${expectations}`;

  // A description that is itself a previously-generated PRD (starts with a
  // markdown heading) must never be fed back in as the "objective" for a new
  // generation — doing so nests the whole old document inside the new one.
  const looksGenerated = (s) => /^#{1,3}\s/.test((s || "").trim());

  const extractObjective = (doc) => {
    const match = (doc || "").match(/##[^\n]*Objective\s*\n([\s\S]*?)(\n##|\n---|$)/i);
    return match ? match[1].trim() : "";
  };

  // ── AI generation ──
  const handleOptimizeWithAI = async () => {
    setIsGenerating(true);
    try {
      const seedObjective =
        objective ||
        extractObjective(aiContent) ||
        (looksGenerated(store.description) ? "" : store.description);

      const jobData = {
        title: store.title,
        category: store.category,
        timelineAmount: store.timelineAmount,
        timelineUnit: store.timelineUnit,
description: seedObjective,
        scope,
        expectations,
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
        setIsFallback(false);
      } catch {
        await new Promise((r) => setTimeout(r, 1500));
        const timelineStr = store.timelineAmount
          ? `${store.timelineAmount} ${store.timelineUnit}`
          : null;
        prd = buildDynamicPRD({
          title:        store.title,
          category:     store.category,
          objective:    seedObjective,
          scope,
          expectations,
          pkg:          store.selectedPackage,
          timeline:     timelineStr,
        });
        expertList = EXPERT_POOL[store.category] || EXPERT_POOL["Natural Language Processing"];
        setIsFallback(true);
      }

      // Sync generated scope/expectations back to form fields so user can edit
      setScope("");
      setExpectations("");
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

  const handlePostJobNow = async () => {
    try {
      const BUDGET_MAP = { basic: 1000, standard: 5000, premium: 15000 };

      const TIMELINE_UNIT_MAP = { Months: "months", Weeks: "weeks", Days: "days" };
      let deadline = null;
      if (store.timelineAmount && store.timelineUnit) {
        const d = new Date();
        const amount = parseInt(store.timelineAmount, 10);
        const unit = TIMELINE_UNIT_MAP[store.timelineUnit] ?? "months";
        if (unit === "months") d.setMonth(d.getMonth() + amount);
        else if (unit === "weeks") d.setDate(d.getDate() + amount * 7);
        else d.setDate(d.getDate() + amount);
        deadline = d.toISOString().split("T")[0];
      }

      const payload = {
        title: store.title,
        description: isAIMode ? aiContent : buildDocumentFromSections(),
        budget: BUDGET_MAP[store.selectedPackage] ?? 1000,
        deadline,
        category: store.category,
        skills: [store.category],
      };

      if (store.draftId) {
        // Editing existing draft or open job → update
        await updateJob(store.draftId, payload);
        if (store.jobStatus === 'DRAFT') {
          await publishDraft(store.draftId);
        }
      } else {
        await createJob(payload);
      }
      
      if (store.draftId && store.jobStatus !== 'DRAFT') {
        toast.success("Project updated successfully!");
      } else {
        toast.success("Project posted successfully!");
      }
      
      store.reset();
navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to post job. Please try again.");
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const BUDGET_MAP = { basic: 1000, standard: 5000, premium: 15000 };

      const TIMELINE_UNIT_MAP = { Months: "months", Weeks: "weeks", Days: "days" };
      let deadline = null;
      if (store.timelineAmount && store.timelineUnit) {
        const d = new Date();
        const amount = parseInt(store.timelineAmount, 10);
        const unit = TIMELINE_UNIT_MAP[store.timelineUnit] ?? "months";
        if (unit === "months") d.setMonth(d.getMonth() + amount);
        else if (unit === "weeks") d.setDate(d.getDate() + amount * 7);
        else d.setDate(d.getDate() + amount);
        deadline = d.toISOString().split("T")[0];
      }

      const payload = {
        title: store.title,
        description: isAIMode ? aiContent : buildDocumentFromSections(),
        budget: BUDGET_MAP[store.selectedPackage] ?? 1000,
        deadline,
        category: store.category,
        skills: [store.category],
      };

      if (store.draftId) {
        // Editing existing draft → update it
        await updateJob(store.draftId, payload);
      } else {
        await saveDraft(payload);
      }
      toast.success("Draft saved successfully!");
      store.reset();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save draft. Please try again.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <>
      <StepBar currentStep={3} />

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">

        {/* ── CARD HEADER ── */}
        <div className="bg-[#f4f6ff] px-8 py-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#15153d]">
              {store.draftId ? "Edit Draft" : "Review & Publish"}
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              {store.draftId
                ? "Continue editing your draft. Publish when ready."
                : "Review the details auto-filled from your form. Optionally let AI enhance it."}
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
                  placeholder="Leave blank and click ✨ Optimize with AI — we'll generate this based on your package level. Or type your own deliverables here."
                />

                <SectionField
                  icon="👤"
                  label="Candidate Expectations"
                  value={expectations}
                  onChange={setExpectations}
                  rows={3}
                  placeholder="Leave blank and click ✨ Optimize with AI — we'll generate this based on your package level. Or describe the ideal expert profile here."
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
                {experts.map((e) => <ExpertCard key={e.id} expert={e} isFallback={isFallback} />)}
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
              {(!store.draftId || store.jobStatus === 'DRAFT') && (
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg px-4 py-2"
                >
                  {isSavingDraft ? "Saving..." : "Save as Draft"}
                </button>
              )}
              <Button
                variant="primary"
                onClick={handlePostJobNow}
                className="!px-8 flex items-center gap-2"
              >
                {store.draftId && store.jobStatus !== 'DRAFT' ? "Update Job 📝" : "Post Job Now 🚀"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
