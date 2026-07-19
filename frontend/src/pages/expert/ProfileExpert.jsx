import { useState, useEffect } from "react";
import { Star, MapPin, MessageSquare, CheckCircle, Pencil, X, Plus, AlertCircle, Loader2, Award } from "lucide-react";
import { getMe, updateMe, getUserPublicStats } from "../../api/users";
import { getMyProjects } from "../../api/projects";
import { getExpertDashboard } from "../../api/dashboard";
import toast from "react-hot-toast";

export default function ProfileExpert() {
  const [profile, setProfile] = useState(null);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [ratingStats, setRatingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ bio: "", location: "", hourlyRate: "", skills: [] });
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    const load = async () => {
      let me;
      try {
        me = await getMe();
        setProfile(me);
        setForm({
          bio: me.bio || "",
          location: me.location || "",
          hourlyRate: me.hourlyRate?.toString() || "",
          skills: me.skills || [],
        });
        if (!me.bio) setIsEdit(true);
      } catch {
        toast.error("Failed to load profile");
        setLoading(false);
        return;
      }

      // Load projects — non-critical, won't crash page if fails
      try {
        const myProjects = await getMyProjects();
        setCompletedProjects(myProjects.filter(p => p.status === "COMPLETED"));
      } catch {
        // silent fail — projects section stays empty
      }

      // Load dashboard stats — non-critical
      try {
        const dashboard = await getExpertDashboard();
        setStats(dashboard);
      } catch {
        // silent fail — stats section shows 0
      }

      // Load rating stats — non-critical
      try {
        const userRatingStats = await getUserPublicStats(me.id);
        setRatingStats(userRatingStats);
      } catch {
        // silent fail — rating section stays hidden
      }

      setLoading(false);
    };
    load();
  }, []);

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || form.skills.includes(s)) return;
    setForm(f => ({ ...f, skills: [...f.skills, s] }));
    setSkillInput("");
  };

  const removeSkill = (s) => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateMe({
        bio: form.bio,
        location: form.location,
        hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : null,
        skills: form.skills,
      });
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
  const rating = ratingStats?.averageRating ?? 0;
  const hasRating = ratingStats?.reviewCount > 0;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 animate-fadeIn">

      {!isComplete && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <AlertCircle size={18} className="text-amber-500 shrink-0" />
          <div className="flex-1 text-sm">
            <span className="font-bold text-amber-700">Complete your profile</span>
            <span className="text-amber-600 ml-2">Add your bio and skills so clients can find you.</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* HERO CARD */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="relative shrink-0">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-32 h-32 rounded-2xl object-cover border border-gray-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-[#15153d] flex items-center justify-center text-white font-black text-5xl">
                  {(profile?.fullName || "?")[0].toUpperCase()}
                </div>
              )}
              {profile?.isVerified && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                  ✓ Verified
                </span>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-3 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-[#15153d]">{profile?.fullName}</h2>
                  {hasRating && (
                    <div className="flex items-center gap-1 mt-1 justify-center sm:justify-start">
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
                  <p className="text-gray-400 text-xs mt-0.5">{profile?.email}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {isEdit ? (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 sm:flex-none h-9 px-4 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                      Save Profile
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEdit(true)}
                      className="flex-1 sm:flex-none h-9 px-4 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1.5"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                  )}
                </div>
              </div>

              {isEdit ? (
                <label className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={14} />
                  <input
                    value={form.location}
                    onChange={handleChange("location")}
                    placeholder="Your location"
                    className="border-b border-gray-200 outline-none bg-transparent focus:border-orange-400 text-xs"
                  />
                </label>
              ) : profile?.location ? (
                <p className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={14} /> {profile.location}
                </p>
              ) : null}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-gray-50 pt-4 text-center sm:text-left">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Jobs Completed</span>
                  <p className="text-lg font-bold text-[#15153d] mt-0.5">{completedProjects.length}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Total Earnings</span>
                  <p className="text-lg font-bold text-[#15153d] mt-0.5">
                    ${(stats?.totalEarnings ?? 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Active Projects</span>
                  <p className="text-lg font-bold text-[#15153d] mt-0.5">{stats?.activeProjects ?? 0}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Rating</span>
                  <p className="text-lg font-bold text-[#15153d] mt-0.5">{hasRating ? rating.toFixed(1) : "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ABOUT ME */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-bold text-base text-[#15153d]">About Me</h3>
            {isEdit ? (
              <textarea
                value={form.bio}
                onChange={handleChange("bio")}
                placeholder="Tell clients about your experience and what makes you stand out..."
                rows={5}
                className="w-full text-sm text-gray-500 border border-gray-200 rounded-xl p-3 outline-none resize-none focus:border-orange-400"
              />
            ) : profile?.bio ? (
              <p className="text-xs text-gray-500 leading-relaxed font-medium">{profile.bio}</p>
            ) : (
              <p className="text-xs text-gray-300 italic">No bio yet. Click Edit to add one.</p>
            )}
          </div>

          {/* COMPLETED PROJECTS */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#15153d]">Completed Projects</h3>
            {completedProjects.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No completed projects yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {completedProjects.map(p => (
                  <div key={p.id} className="border border-gray-100 rounded-2xl p-5 space-y-2 hover:border-orange-100 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="bg-green-50 text-green-700 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-green-100">
                        Completed
                      </span>
                      <span className="text-xs font-bold text-[#1a1a3c]">
                        ${p.totalBudget?.toLocaleString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-[#15153d]">{p.jobTitle}</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">{p.jobDescription}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 pt-1 border-t border-gray-50">
                      <span>Client:</span>
                      <strong className="text-[#1a1a3c]">{p.clientName}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RECENT REVIEWS */}
          {ratingStats?.recentReviews?.length > 0 && (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#15153d]">Recent Reviews</h3>
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

          {/* TECHNICAL SKILLS */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#15153d]">Technical Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {form.skills.length > 0 ? (
                form.skills.map(s => (
                  <span key={s} className="flex items-center gap-1 bg-blue-50/60 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-blue-100/50">
                    {s}
                    {isEdit && (
                      <button onClick={() => removeSkill(s)} className="ml-0.5 text-blue-400 hover:text-red-400 transition-colors">
                        <X size={10} />
                      </button>
                    )}
                  </span>
                ))
              ) : (
                <p className="text-xs text-gray-300 italic">No skills added yet.</p>
              )}
            </div>
            {isEdit && (
              <div className="flex gap-2 mt-2">
                <input
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill..."
                  className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400"
                />
                <button
                  onClick={addSkill}
                  className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 flex items-center gap-1"
                >
                  <Plus size={12} /> Add
                </button>
              </div>
            )}
          </div>

          {/* ACCOUNT INFO */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#15153d] uppercase tracking-wider text-gray-400">Account Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Role</span>
                <span className="font-bold text-[#1a1a3c]">Expert</span>
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

          {/* AVAILABILITY & RATE */}
          <div className="bg-[#15153d] p-6 rounded-3xl text-white shadow-xl space-y-4">
            <h3 className="font-bold text-sm">Availability & Rate</h3>
            {isEdit ? (
              <div className="space-y-2">
                <p className="text-[11px] text-gray-300">Hourly rate (USD)</p>
                <input
                  value={form.hourlyRate}
                  onChange={handleChange("hourlyRate")}
                  placeholder="e.g. 150"
                  type="number"
                  min="0"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm outline-none placeholder:text-white/30 focus:border-orange-400"
                />
              </div>
            ) : (
              <>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  {isComplete
                    ? "Currently accepting projects and consultations."
                    : "Complete your profile to start receiving offers."}
                </p>
                <div className="space-y-2 text-xs font-semibold text-gray-200">
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {profile?.hourlyRate ? `$${profile.hourlyRate} / hour` : "Rate not set"}
                  </p>
                </div>
              </>
            )}
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
          <div className="w-9 h-9 rounded-full bg-[#15153d] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initials}
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-[#15153d]">{review.giverName}</p>
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