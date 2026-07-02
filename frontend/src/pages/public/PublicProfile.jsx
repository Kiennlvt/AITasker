import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, CheckCircle, Loader2, Clock, Briefcase, Award, MessageSquare, ChevronRight } from "lucide-react";
import { getUserById, getUserPublicStats } from "../../api/users";
import { getServicesByExpert } from "../../api/services";
import { findOrCreateDirect } from "../../api/conversations";
import toast from "react-hot-toast";

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messaging, setMessaging] = useState(false);

  const isLoggedIn = !!localStorage.getItem("accessToken");

  useEffect(() => {
    Promise.all([
      getUserById(id),
      getUserPublicStats(id),
    ])
      .then(([user, userStats]) => {
        setProfile(user);
        setStats(userStats);
        if (user.role === "EXPERT") {
          return getServicesByExpert(id).then(setServices).catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleMessage = async () => {
    if (!isLoggedIn) {
      toast("Please log in to send a message", { icon: "🔒" });
      navigate("/login");
      return;
    }
    setMessaging(true);
    try {
      const result = await findOrCreateDirect(id);
      navigate(`/messages?conversationId=${result.conversationId}`);
    } catch {
      toast.error("Could not open conversation");
    } finally {
      setMessaging(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (!profile) return <div className="p-10 text-3xl font-black">User not found</div>;

  const isExpert = profile.role === "EXPERT";
  const initials = (profile.fullName || "?")[0].toUpperCase();
  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;
  const rating = stats?.averageRating ?? 0;
  const hasRating = stats?.reviewCount > 0;

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-[#111331]">
      <section className="mx-auto max-w-[1100px] px-8 py-10">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link
            to={isExpert ? "/services" : "/marketplace"}
            className="font-medium text-slate-500 transition hover:text-orange-500"
          >
            {isExpert ? "Services" : "Marketplace"}
          </Link>
          <span className="text-slate-400">/</span>
          <span className="font-black text-[#111331]">Profile</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-6">

            {/* HERO CARD */}
            <div className="rounded-3xl bg-white p-8 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                {/* Avatar */}
                <div className="relative shrink-0">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-28 h-28 rounded-2xl object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-2xl bg-[#15153d] flex items-center justify-center text-white font-black text-5xl">
                      {initials}
                    </div>
                  )}
                  {profile.isVerified && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow">
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h1 className="text-2xl font-black text-[#15153d]">{profile.fullName}</h1>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-orange-500 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full">
                      {isExpert ? "Expert" : "Client"}
                    </span>
                  </div>

                  {/* Star rating */}
                  {hasRating && (
                    <div className="flex items-center justify-center sm:justify-start gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                        />
                      ))}
                      <span className="ml-1 text-xs font-bold text-[#15153d]">{rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({stats.reviewCount} reviews)</span>
                    </div>
                  )}

                  {profile.location && (
                    <p className="flex items-center justify-center sm:justify-start gap-1 text-xs text-gray-400">
                      <MapPin size={13} /> {profile.location}
                    </p>
                  )}

                  {memberSince && (
                    <p className="flex items-center justify-center sm:justify-start gap-1 text-xs text-gray-400">
                      <Clock size={13} /> Member since {memberSince}
                    </p>
                  )}

                  {isExpert && profile.hourlyRate && (
                    <p className="text-sm font-black text-[#15153d]">
                      ${profile.hourlyRate}
                      <span className="font-normal text-gray-400 text-xs ml-1">/ hour</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Stats strip */}
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-50 pt-5">
                <StatBox
                  value={stats?.completedProjectsCount ?? 0}
                  label="Jobs Completed"
                  accent
                />
                {isExpert ? (
                  <>
                    <StatBox
                      value={hasRating ? rating.toFixed(1) : "—"}
                      label="Avg Rating"
                    />
                    <StatBox
                      value={services.length}
                      label="Services"
                    />
                  </>
                ) : (
                  <>
                    <StatBox
                      value={stats?.jobsPostedCount ?? 0}
                      label="Jobs Posted"
                    />
                    <StatBox
                      value={stats?.reviewCount ?? 0}
                      label="Reviews"
                    />
                  </>
                )}
              </div>
            </div>

            {/* ABOUT */}
            {profile.bio && (
              <div className="rounded-3xl bg-white p-8 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
                <h2 className="mb-4 text-lg font-black text-[#15153d]">About</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* SKILLS (Expert only) */}
            {isExpert && profile.skills?.length > 0 && (
              <div className="rounded-3xl bg-white p-8 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
                <h2 className="mb-4 text-lg font-black text-[#15153d]">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <span
                      key={s}
                      className="bg-blue-50 text-blue-600 text-[11px] font-bold px-3 py-1 rounded-lg border border-blue-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* SERVICES (Expert only) */}
            {isExpert && services.length > 0 && (
              <div className="rounded-3xl bg-white p-8 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
                <h2 className="mb-5 text-lg font-black text-[#15153d]">Services Offered</h2>
                <div className="space-y-3">
                  {services.map((svc) => (
                    <Link
                      key={svc.id}
                      to={`/services/${svc.id}`}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 p-4 hover:border-orange-200 hover:bg-orange-50/30 transition-all group"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-[#15153d] group-hover:text-orange-500 transition-colors">
                          {svc.title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          {svc.category && <span>{svc.category}</span>}
                          <span>{svc.deliveryDays} days delivery</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-black text-[#15153d]">
                          ${Number(svc.price).toLocaleString()}
                        </span>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-400 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {stats?.recentReviews?.length > 0 && (
              <div className="rounded-3xl bg-white p-8 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
                <h2 className="mb-5 text-lg font-black text-[#15153d]">Recent Reviews</h2>
                <div className="space-y-5">
                  {stats.recentReviews.map((r, i) => (
                    <ReviewCard key={i} review={r} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-5">

            {/* CTA CARD */}
            <div className="rounded-3xl bg-white p-7 shadow-[0_14px_35px_rgba(15,23,42,0.08)] space-y-3">
              <button
                onClick={handleMessage}
                disabled={messaging}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-orange-500 py-4 text-sm font-bold text-white hover:bg-orange-600 transition-all disabled:opacity-60"
              >
                <MessageSquare size={16} />
                {messaging ? "Opening..." : `Message ${isExpert ? "Expert" : "Client"}`}
              </button>
              {isExpert && services.length > 0 && (
                <Link
                  to={`/services/${services[0].id}`}
                  className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-200 py-4 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  View Services
                </Link>
              )}
            </div>

            {/* TRUST INDICATORS */}
            <div className="rounded-3xl bg-white p-7 shadow-[0_14px_35px_rgba(15,23,42,0.08)] space-y-4">
              <h3 className="text-sm font-black text-[#15153d] uppercase tracking-wider text-gray-400">
                Trust & Safety
              </h3>
              <TrustRow
                icon={<CheckCircle size={15} className="text-green-500" />}
                label="Identity Verified"
                active={profile.isVerified}
              />
              <TrustRow
                icon={<Award size={15} className="text-orange-500" />}
                label="Completed Projects"
                value={stats?.completedProjectsCount ?? 0}
                active={(stats?.completedProjectsCount ?? 0) > 0}
              />
              <TrustRow
                icon={<Star size={15} className="text-amber-400" />}
                label="Avg Rating"
                value={hasRating ? `${rating.toFixed(1)} / 5.0` : "No reviews yet"}
                active={hasRating}
              />
              <TrustRow
                icon={<Clock size={15} className="text-blue-400" />}
                label="Member since"
                value={memberSince}
                active={!!memberSince}
              />
            </div>

            {/* ACCOUNT INFO */}
            <div className="rounded-3xl bg-white p-7 shadow-[0_14px_35px_rgba(15,23,42,0.08)] space-y-3">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider">Account</h3>
              <div className="text-sm space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Role</span>
                  <span className="font-bold">{isExpert ? "Expert" : "Client"}</span>
                </div>
                {isExpert && profile.hourlyRate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rate</span>
                    <span className="font-bold">${profile.hourlyRate}/hr</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-600 font-bold text-xs">✓ Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatBox({ value, label, accent }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-black ${accent ? "text-orange-500" : "text-[#15153d]"}`}>{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

function TrustRow({ icon, label, value, active }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={active ? "" : "opacity-30"}>{icon}</span>
      <div className="flex-1">
        <span className={`font-semibold ${active ? "text-[#15153d]" : "text-gray-300"}`}>{label}</span>
        {value !== undefined && (
          <span className="ml-1 text-gray-400 text-xs">{active ? value : ""}</span>
        )}
      </div>
      {active ? (
        <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">✓</span>
      ) : (
        <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">—</span>
      )}
    </div>
  );
}

function ReviewCard({ review }) {
  const initials = (review.giverName || "?")[0].toUpperCase();
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : null;

  return (
    <div className="rounded-2xl border border-gray-100 p-5 space-y-3">
      <div className="flex items-center gap-3">
        {review.giverAvatarUrl ? (
          <img src={review.giverAvatarUrl} alt={review.giverName} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#15153d] flex items-center justify-center text-white font-bold text-sm">
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
