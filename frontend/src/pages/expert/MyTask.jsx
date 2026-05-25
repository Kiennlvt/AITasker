import { CheckCircle2, Circle, Clock, UploadCloud, Info } from "lucide-react";

export default function MyTask() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* CỘT TRÁI: MILESTONES & UPLOAD */}
      <div className="lg:col-span-2 space-y-8">
        {/* MILESTONES LIST */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-[#15153d] mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-orange-500" /> Project Milestones
          </h3>
          
          <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
            {/* Milestone 1 - Done */}
            <div className="flex gap-6 relative">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 z-10">
                <CheckCircle2 size={18} />
              </div>
              <div className="flex-1 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-[#15153d]">Milestone 1: Data Preparation</h4>
                  <p className="text-sm text-gray-400 mt-1">Preprocessing 50TB of raw server telemetry for training ingestion.</p>
                  <span className="text-[10px] font-bold text-gray-400 block mt-2">Oct 12, 2023</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#15153d]">$1,500.00</span>
                  <span className="block text-[10px] text-emerald-500 font-bold">Released</span>
                </div>
              </div>
            </div>

            {/* Milestone 2 - Active */}
            <div className="flex gap-6 relative">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-orange-500 text-orange-500 flex items-center justify-center shrink-0 z-10">
                <Clock size={18} />
              </div>
              <div className="flex-1 p-5 border border-orange-100 bg-orange-50/30 rounded-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-orange-600">Milestone 2: Model Training</h4>
                    <p className="text-sm text-gray-500 mt-1">Hyperparameter tuning and validation on the primary cluster.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-orange-600">$9,000.00</span>
                    <span className="block text-[10px] text-orange-500 font-bold uppercase italic">In review</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 shadow-sm">Submit Deliverable</button>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-sm">Request Extension</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UPLOAD AREA */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-[#15153d] mb-4">Submit Deliverables</h3>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-gray-50/30">
            <UploadCloud size={48} className="text-orange-400 mb-4" />
            <p className="text-sm font-bold text-gray-600">Drag and drop related weights or reports here</p>
            <p className="text-xs text-gray-400 mt-1">Supports PDF, ZIP, JSON (Max 5GB)</p>
          </div>
          <div className="mt-6">
            <label className="text-xs font-bold text-gray-400 uppercase">Submission Notes</label>
            <textarea className="w-full mt-2 p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 min-h-[100px]" placeholder="Describe the contents..."></textarea>
          </div>
          <button className="w-full mt-6 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all">Submit for Approval</button>
        </div>
      </div>

      {/* CỘT PHẢI: HISTORY & ESCROW */}
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#15153d] mb-4">History & Audit</h3>
          <div className="space-y-6">
            <div className="text-sm">
              <p className="font-bold text-gray-800">Milestone Approved</p>
              <p className="text-gray-500 text-xs mt-1">Data Preparation approved by Nexus AI.</p>
              <span className="text-[10px] text-gray-400">2 days ago</span>
            </div>
            <div className="text-sm">
              <p className="font-bold text-gray-800">New Version Uploaded</p>
              <p className="text-gray-500 text-xs mt-1">Model weights v1.2 uploaded.</p>
              <span className="text-[10px] text-gray-400">3 days ago</span>
            </div>
          </div>
          <button className="w-full mt-8 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50">View Full Audit Log</button>
        </div>

        <div className="bg-[#1e1b4b] p-6 rounded-3xl text-white shadow-xl">
          <h3 className="font-bold uppercase text-[10px] tracking-widest text-blue-300 mb-4">Escrow Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-blue-100/60">Released to Date:</span>
              <span className="font-bold">$1,500.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-100/60">Currently Held:</span>
              <span className="font-bold text-orange-400">$9,000.00</span>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
           <div className="flex items-start gap-4">
              <Info className="text-orange-500 shrink-0" size={20} />
              <div>
                <p className="text-sm font-bold text-orange-900">Need help?</p>
                <p className="text-xs text-orange-700 mt-1 leading-relaxed">Dispute resolution & help desk are available 24/7.</p>
                <button className="mt-3 text-xs font-bold text-orange-600 underline">Contact Case Manager</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}