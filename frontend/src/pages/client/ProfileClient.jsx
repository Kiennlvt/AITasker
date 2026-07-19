import { useState, useEffect } from "react";
import { Sparkles, Star, Clock, ArrowRight, ShieldCheck, Pencil, CheckCircle, AlertCircle, Loader2, MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";
import { getMe, updateMe, getUserPublicStats } from "../../api/users";
import { getMyJobs } from "../../api/jobs";
import { getMyProjects } from "../../api/projects";
import { getClientDashboard } from "../../api/dashboard";
import toast from "react-hot-toast";

export default function ProfileClient() {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [ratingStats, setRatingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ fullName: "", bio: "", location: "" });

  useEffect(() => {
    getMe()
      .then((me) => {
        setProfile(me);
        setForm({ fullName: me.fullName || "", bio: me.bio || "", location: me.location || "" });
        if (!me.bio) setIsEdit(true);
        return Promise.all([getMyJobs(), getMyProjects(), getClientDashboard(), getUserPublicStats(me.id)]);
      })
      .then(([myJobs, myProjects, dashboard, userRatingStats]) => {
        setJobs(myJobs.filter(j => j.status === "OPEN" || j.status === "IN_PROGRESS"));
        setCompletedProjects(myProjects.filter(p => p.status === "COMPLETED"));
        setStats(dashboard);
        setRatingStats(userRatingStats);
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.fullName.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const updated = await updateMe({ fullName: form.fullName, bio: form.bio, location: form.location });
      setProfile(updated);
      setIsEdit(false);
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  const isComplete = !!profile?.bio;
  const initials = (profile?.fullName || "?")[0].toUpperCase();
  const rating = ratingStats?.averageRating ?? 0;
  const hasRating = ratingStats?.reviewCount > 0;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 animate-fadeIn text-[#1a1a3c]">

      {!isComplete && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <AlertCircle size={18} className="text-amber-500 shrink-0" />
          <div className="flex-1 text-sm">
            <span className="font-bold text-amber-700">Complete your profile</span>
            <span className="text-amber-600 ml-2">Add your details to get started on AI Tasker.</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-[#1a1a3c] rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-md shrink-0">
            {initials}
          </div>
          <div className="space-y-1.5">
            {isEdit ? (
              <div className="space-y-2">
                <input
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  placeholder="Your name / Company name *"
                  className="text-xl font-bold border-b border-orange-300 outline-none bg-transparent w-full focus:border-orange-500"
                />
                <input
                  value={form.location}
                  onChange={handleChange("location")}
                  placeholder="Location (e.g. Ho Chi Minh City)"
                  className="text-xs text-gray-400 border-b border-gray-200 outline-none bg-transparent w-full focus:border-orange-400"
                />
                <p className="text-xs text-gray-300">{profile?.email}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight">{profile?.fullName}</h1>
                  {profile?.isVerified && <ShieldCheck size={18} className="text-orange-500" fill="currentColor" />}
                </div>
                {hasRating && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={13}
                        className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                      />
                    ))}
                    <span className="ml-1 text-xs font-bold text-[#1a1a3c]">{rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({ratingStats.reviewCount} reviews)</span>
                  </div>
                )}
                {profile?.location && (
                  <p className="text-gray-400 text-xs font-semibold flex items-center gap-1">
                    <MapPin size={12} /> {profile.location}
                  </p>
                )}
                <p className="text-gray-400 text-xs">{profile?.email}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isEdit ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              Save Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEdit(true)}
                className="flex-1 sm:flex-none flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50 transition-all shadow-sm"
              >
                <Pencil size={14} /> Edit Profile
              </button>
              <Link
                to="/post-job/step-1"
                className="flex-1 sm:flex-none text-center px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Post a Job
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 2 COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* ABOUT */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-3.5">
            <h3 className="font-bold text-lg">About</h3>
            {isEdit ? (
              <textarea
                value={form.bio}
                onChange={handleChange("bio")}
                placeholder="Describe yourself or your company, mission, and what kind of AI projects you work on..."
                rows={5}
                className="w-full text-sm text-gray-500 border border-gray-200 rounded-xl p-3 outline-none resize-none focus:border-orange-400"
              />
            ) : profile?.bio ? (
              <p className="text-gray-500 text-sm leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-gray-300 text-sm italic">No description yet. Click Edit Profile to add one.</p>
            )}
          </div>

          {/* ACTIVE JOB POSTS */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Active Job Posts</h3>
              <Link to="/projects" className="flex items-center gap-1 text-sm font-bold text-black hover:text-orange-500 transition-colors">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            {jobs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No active jobs.{" "}
                <Link to="/post-job/step-1" className="text-orange-500 font-bold">Post your first job →</Link>
              </p>
            ) : (
              <div className="space-y-3">
                {jobs.map(job => (
                  <div key={job.id} className="border border-gray-100 rounded-2xl p-4 flex justify-between items-center gap-4 hover:border-orange-100 transition-all">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm hover:text-orange-500 transition-colors cursor-pointer">{job.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                        <span className="text-[#1a1a3c] font-bold">${job.budget?.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-3 py-1 rounded-full border border-orange-100 shrink-0">
                      {job.proposalCount ?? 0} Proposals
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PROJECT HISTORY */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-lg">Project History</h3>
            {completedProjects.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No completed projects yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedProjects.map(p => (
                  <div key={p.id} className="border border-gray-100 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="bg-green-50 text-green-700 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-green-100">Completed</span>
                      <h4 className="font-bold text-sm">{p.jobTitle}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{p.jobDescription}</p>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-[11px] text-gray-400 font-medium border-t border-gray-50">
                      <div className="w-4 h-4 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                        {p.expertAvatarUrl
                          ? <img src={p.expertAvatarUrl} alt="" className="w-full h-full object-cover" />
                          : <User size={10} />}
                      </div>
                      <span>Expert: <strong className="text-[#1a1a3c]">{p.expertName}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RECENT REVIEWS */}
          {ratingStats?.recentReviews?.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-lg">Recent Reviews</h3>
              <div className="space-y-3">
                {ratingStats.recentReviews.map((r, i) => (
                  <ReviewCard key={i} review={r} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* ACCOUNT PERFORMANCE */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl p-6 shadow-md space-y-6 relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-90">
              <Sparkles size={14} fill="currentColor" /> Account Performance
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-75">Total Spend</p>
              <h2 className="text-3xl font-black tracking-tight">
                ${(stats?.totalSpend ?? 0).toLocaleString()}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-75 mb-0.5">Active Jobs</p>
                <span className="text-xl font-black">{stats?.activeJobs ?? 0}</span>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-75 mb-0.5">Proposals</p>
                <span className="text-xl font-black">{stats?.pendingProposals ?? 0}</span>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-75 mb-0.5">Rating</p>
                <span className="text-xl font-black">{hasRating ? rating.toFixed(1) : "—"}</span>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-75 mb-0.5">Reviews</p>
                <span className="text-xl font-black">{ratingStats?.reviewCount ?? 0}</span>
              </div>
            </div>
          </div>

          {/* ACCOUNT INFO */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400">Account Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Role</span>
                <span className="font-bold text-[#1a1a3c]">Client</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span className="font-bold text-[#1a1a3c] text-xs truncate max-w-[150px]">{profile?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Member since</span>
                <span className="font-bold text-[#1a1a3c]">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-green-600 font-bold text-xs">✓ Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  const initials = (review.giverName || "?")[0].toUpperCase();
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : null;

  return (
    <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
      <div className="flex items-center gap-3">
        {review.giverAvatarUrl ? (
          <img src={review.giverAvatarUrl} alt={review.giverName} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#1a1a3c] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initials}
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-[#1a1a3c]">{review.giverName}</p>
          {date && <p className="text-[11px] text-gray-400">{date}</p>}
        </div>
        <div className="ml-auto flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={12}
              className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
            />
          ))}
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-gray-500 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}