import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { getServiceById } from "../../api/services";
import { FiCode, FiCpu, FiActivity, FiHome, FiClock, FiUsers } from "react-icons/fi";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServiceById(id)
      .then(setService)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-gray-400">Loading...</div>;
  if (!service) return <div className="p-10 text-3xl font-black">Service not found</div>;

  const image = service.imageUrl || FALLBACK_IMAGE;
  const rating = service.expertRating != null ? service.expertRating.toFixed(1) : "—";

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-[#111331]">
      <section className="mx-auto grid max-w-[1180px] grid-cols-[1fr_280px] gap-8 px-8 py-10">
        <div>
          <div className="mb-5 flex items-center gap-2 text-sm">
            <Link to="/services" className="font-medium text-slate-500 transition hover:text-orange-500">
              Services
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-black text-[#111331]">Service Details</span>
          </div>

          <h1 className="max-w-[680px] text-5xl font-black leading-tight tracking-tight">
            {service.title}
          </h1>

          <div className="mt-5 flex flex-wrap gap-2">
            {(service.tags ?? []).map((tag, i) => (
              <Badge key={tag} className={i === 0 ? "" : "bg-[#eef2ff] text-[#111331]"}>
                {tag}
              </Badge>
            ))}
          </div>

          <Section title="Description">
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
          </Section>

          <Section title="What's Included">
            <div className="grid grid-cols-2 gap-5">
              <Requirement icon={<FiCode />} title="Advanced AI Development" text="Production-ready AI system built to spec." />
              <Requirement icon={<FiCpu />} title="Model Optimization" text="Fine-tuned for performance and reliability." />
              <Requirement icon={<FiActivity />} title="System Integration" text="Seamlessly integrated into your workflows." />
              <Requirement icon={<FiHome />} title="Business Domain Fit" text="Tailored to your specific industry needs." />
            </div>
          </Section>

          <Section title="Deliverables">
            <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
                Working AI solution based on the requested service scope.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
                Technical documentation and setup instructions.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
                Final deployment-ready package or API handoff.
              </li>
            </ul>
          </Section>

          <Section title="Preview">
            <div className="overflow-hidden rounded-3xl">
              <img src={image} alt={service.title} className="h-[220px] w-full object-cover" />
            </div>
          </Section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-7 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
            <InfoRow label="Price" value={`$${Number(service.price ?? 0).toLocaleString()}`} />
            <InfoRow label="Delivery" value={`${service.deliveryDays ?? "—"} days`} />
            <InfoRow label="Category" value={service.category ?? "—"} orange />

            <Button className="mt-6 w-full rounded-full py-4 text-base">Order Now</Button>
            <Button className="mt-6 w-full rounded-full py-4 text-base" variant="secondary">Save for later</Button>


            <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <p className="flex items-center gap-2"><FiClock /> Available now</p>
              <p className="flex items-center gap-2"><FiUsers /> Instant booking</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
            <h3 className="mb-5 text-sm font-black">About the Expert</h3>
            <div className="flex items-center gap-3">
              {service.expertAvatarUrl ? (
                <img src={service.expertAvatarUrl} alt={service.expertName} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-base">
                  {service.expertName?.slice(0, 2).toUpperCase() ?? "??"}
                </div>
              )}
              <div>
                <p className="text-sm font-black">{service.expertName ?? "Expert"}</p>
                <p className="text-[11px] text-slate-400">{rating} / 5.0 rating</p>
              </div>
            </div>
            <button className="mt-6 text-xs font-black text-orange-500">View Profile</button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-12">
      <h2 className="mb-5 border-b border-slate-200 pb-3 text-2xl font-black">{title}</h2>
      <div className="text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

function Requirement({ icon, title, text }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-3 text-lg text-orange-500">{icon}</div>
      <h3 className="text-sm font-black text-[#111331]">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">{text}</p>
    </div>
  );
}

function InfoRow({ label, value, orange }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`font-black ${orange ? "text-orange-500" : "text-[#111331]"}`}>{value}</span>
    </div>
  );
}