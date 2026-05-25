import { Star, MapPin, MessageSquare, CheckCircle, Award } from "lucide-react";

export default function ProfileExpert() {
  const skills = ["LLM Fine-tuning", "Neural Networks", "PyTorch", "TensorFlow", "NLP", "Reinforcement Learning", "Kubernetes", "AWS Sagemaker"];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      
      {/* CỘT TRÁI CHÍNH (2 PHẦN) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* AVATAR HERO CARD */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start relative">
          <div className="relative shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" 
              alt="Alex Rivera"
              className="w-32 h-32 rounded-2xl object-cover border border-gray-100"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
              ✓ Verified
            </span>
          </div>
          
          <div className="flex-1 text-center sm:text-left space-y-3 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <h2 className="text-2xl font-bold text-[#15153d]">Alex Rivera</h2>
                <p className="text-orange-600 text-xs font-bold mt-0.5">Elite AI Researcher</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none h-9 px-4 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1.5">
                  <MessageSquare size={14} /> Message
                </button>
                <button className="flex-1 sm:flex-none h-9 px-4 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 shadow-sm flex items-center justify-center">
                  Hire Alex
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-medium text-gray-400 pt-1">
              <span className="flex items-center gap-1 text-amber-500"><Star size={14} className="fill-amber-500" /> 4.9/5.0 (128 reviews)</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> Palo Alto, CA</span>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-4 text-center sm:text-left">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Jobs Completed</span>
                <p className="text-lg font-bold text-[#15153d] mt-0.5">342</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Total Earnings</span>
                <p className="text-lg font-bold text-[#15153d] mt-0.5">$450k+</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Response Time</span>
                <p className="text-lg font-bold text-[#15153d] mt-0.5">&lt; 2 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT ME */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="font-bold text-base text-[#15153d]">About Me</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            With over a decade of experience at the intersection of machine learning and large-scale enterprise systems, I specialize in architecting neural networks that solve complex data problems. My approach combines rigorous academic research with pragmatic engineering, ensuring that AI solutions are not just innovative but scalable and production-ready. I have led teams in fine-tuning massive language models for specialized industries including FinTech and BioTech.
          </p>
        </div>

        {/* PORTFOLIO PROJECTS */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-[#15153d]">Portfolio</h3>
            <button className="text-xs font-bold text-orange-500 hover:underline">View all projects →</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:scale-[1.01] transition-transform">
              <div className="h-32 bg-[#0d1527]"></div>
              <div className="p-4 space-y-1 bg-white">
                <h4 className="font-bold text-xs text-[#15153d]">Quantum-Optimized Transformer</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">Reducing latency in transformer models by 45% using novel attention pruning techniques.</p>
              </div>
            </div>
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:scale-[1.01] transition-transform">
              <div className="h-32 bg-[#092224]"></div>
              <div className="p-4 space-y-1 bg-white">
                <h4 className="font-bold text-xs text-[#15153d]">Predictive Ledger Analytics</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">AI-driven predictive engine for real-time anomaly detection in high-frequency trading ledgers.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CỘT PHẢI SIDEBAR PROFILE (1 PHẦN) */}
      <div className="space-y-6">
        
        {/* TECHNICAL SKILLS */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-[#15153d]">Technical Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span key={skill} className="bg-blue-50/60 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-blue-100/50">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* CERTIFICATIONS */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[#15153d]">Certifications</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-xs">
              <div className="p-2 bg-orange-50 rounded-xl text-orange-500 shrink-0"><Award size={16} /></div>
              <div>
                <p className="font-bold text-[#15153d]">AWS Certified Machine Learning</p>
                <p className="text-gray-400 text-[10px] mt-0.5">Specialty • 2023</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-xs">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-500 shrink-0"><CheckCircle size={16} /></div>
              <div>
                <p className="font-bold text-[#15153d]">Stanford Deep Learning</p>
                <p className="text-gray-400 text-[10px] mt-0.5">Professional • 2021</p>
              </div>
            </div>
          </div>
        </div>

        {/* AVAILABILITY CALENDAR CARD */}
        <div className="bg-[#15153d] p-6 rounded-3xl text-white shadow-xl space-y-4">
          <h3 className="font-bold text-sm">Availability</h3>
          <p className="text-[11px] text-gray-300 leading-relaxed">Currently accepting high-priority technical consultations and project-based work.</p>
          <div className="space-y-2 text-xs font-semibold text-gray-200">
            <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> 15-20 hours / week</p>
            <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> $250 / hour base rate</p>
          </div>
          <button className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md transition-all">
            Schedule Consultation
          </button>
        </div>

      </div>
    </div>
  );
}