import React from "react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { servicesJobDetails } from "../../data/servicesJobDetails";
import { Link, useParams } from "react-router-dom";
import {
  FiCode,
  FiCpu,
  FiActivity,
  FiHome,
  FiClock,
  FiUsers,
} from "react-icons/fi";

export default function JobDetail() {
  const { id } = useParams();
  const job = servicesJobDetails.find((item) => item.id === Number(id));

  if (!job) {
    return <div className="p-10 text-3xl font-black">Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-[#111331]">
      <section className="mx-auto grid max-w-[1180px] grid-cols-[1fr_280px] gap-8 px-8 py-10">
        <div>
          <div className="mb-5 flex items-center gap-2 text-sm">
            <Link
              to="/marketplace"
              className="font-medium text-slate-500 transition hover:text-orange-500"
            >
              Marketplace
            </Link>

            <span className="text-slate-400">/</span>

            <span className="font-black text-[#111331]">
              Job Details
            </span>
          </div>

          <h1 className="max-w-[680px] text-5xl font-black leading-tight tracking-tight">
            {job.title}
          </h1>

          <div className="mt-5 flex flex-wrap gap-2">
            {job.tags.map((tag, index) => (
              <Badge
                key={tag}
                className={index === 0 ? "" : "bg-[#eef2ff] text-[#111331]"}
              >
                {tag}
              </Badge>
            ))}
          </div>

          <Section title="Detailed Description">
            {job.description.map((text) => (
              <p key={text} className="mt-5 first:mt-0">
                {text}
              </p>
            ))}
          </Section>

          <Section title="Technical Requirements">
            <div className="grid grid-cols-2 gap-5">
              <Requirement icon={<FiCode />} title="Advanced AI Development" text="Strong experience in building production-ready AI systems." />
              <Requirement icon={<FiCpu />} title="Model Optimization" text="Ability to optimize AI models for performance and reliability." />
              <Requirement icon={<FiActivity />} title="System Integration" text="Experience integrating AI services into real business workflows." />
              <Requirement icon={<FiHome />} title="Business Domain Fit" text="Understanding client requirements and translating them into AI solutions." />
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

          <Section title="About the Project">
            <div className="overflow-hidden rounded-3xl">
              <img
                src={job.image}
                alt={job.title}
                className="h-[220px] w-full object-cover"
              />
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-600">
              This project is part of the client&apos;s AI automation roadmap and requires a reliable expert to deliver a practical, scalable solution.
            </p>
          </Section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-7 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
            <InfoRow label="Budget" value={job.budget} />
            <InfoRow label="Duration" value={job.duration} />
            <InfoRow label="Experience Level" value={job.level} orange />

            <Button className="mt-6 w-full rounded-full py-4 text-base">
              Apply Now
            </Button>

            <button className="mt-4 w-full rounded-full border border-slate-200 bg-white py-4 text-sm font-black text-[#111331]">
              Save for Later
            </button>

            <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <p className="flex items-center gap-2">
                <FiClock /> Posted 4 hours ago
              </p>
              <p className="flex items-center gap-2">
                <FiUsers /> 12 Applications received
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
            <h3 className="mb-5 text-sm font-black">About the Expert</h3>

            <div className="flex items-center gap-3">
              <img
                src={job.image}
                alt={job.author}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-black">{job.author}</p>
                <p className="text-[11px] text-slate-400">{job.rating} / 5.0 rating</p>
              </div>
            </div>

            <button className="mt-6 text-xs font-black text-orange-500">
              View Profile
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-12">
      <h2 className="mb-5 border-b border-slate-200 pb-3 text-2xl font-black">
        {title}
      </h2>
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
      <span className={`font-black ${orange ? "text-orange-500" : "text-[#111331]"}`}>
        {value}
      </span>
    </div>
  );
}