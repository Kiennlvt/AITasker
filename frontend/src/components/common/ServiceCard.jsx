import React from "react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Link } from "react-router-dom";

const techImages = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80",
];

export default function ServiceCard({ service, index = 0 }) {
  if (!service) return null;

  // Chỉ dùng ảnh mặc định khi service không có sẵn URL ảnh; gán theo vị trí để 2 card liền kề không trùng nhau
  const imageSrc = service.image || techImages[index % techImages.length];

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_40px_rgba(15,23,42,0.10)]">
      <div className="relative h-[155px]">
        <img
          src={imageSrc}
          alt={service.title || "AI Service"}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.src = techImages[0];
          }}
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
