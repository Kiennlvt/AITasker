import React, { useMemo } from "react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Link } from "react-router-dom";

const techImages = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  "https://plus.unsplash.com/premium_photo-1726079247110-5e593660c7b2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1725985758331-e1b46919d8cf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80",
];

export default function ServiceCard({ service }) {
  const randomImage = useMemo(
    () => techImages[Math.floor(Math.random() * techImages.length)],
    []
  );

  if (!service) return null;

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_40px_rgba(15,23,42,0.10)]">
      <div className="relative h-[155px]">
        <img
          src={randomImage}
          alt={service.title || "AI Service"}
          className="h-full w-full object-cover"
        />

        <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-black flex items-center gap-1 shadow-sm text-slate-800">
          <span>⭐</span> <span>{service.rating || "4.5"}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3 flex gap-2">
          {(service.tags || ["AI"]).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <h3 className="min-h-[56px] text-xl font-black leading-tight text-[#0b1b2f] line-clamp-2">
          {service.title || "AI Solutions Service"}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-800" />
          <p className="text-xs text-slate-500">{service.author || "Expert"}</p>
          <span className="text-xs text-orange-500">●</span>
        </div>

        <div className="mt-8 flex items-end justify-between">
          <div>
<p className="text-[10px] font-medium text-slate-400">
              Starting at
            </p>
            <p className="text-xl font-black text-[#0b1b2f]">{service.price || "$1,500"}</p>
          </div>
          <Link to={`/services/${service.id || 1}`}>
            <Button size="icon" className="flex items-center justify-center">
              →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}