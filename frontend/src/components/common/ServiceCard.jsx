import React from "react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_40px_rgba(15,23,42,0.10)]">
      <div className="relative h-[155px]">
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-black">
          ⭐ {service.rating}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3 flex gap-2">
          {service.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <h3 className="min-h-[56px] text-xl font-black leading-tight text-[#0b1b2f]">
          {service.title}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-800" />
          <p className="text-xs text-slate-500">{service.author}</p>
          <span className="text-xs text-orange-500">●</span>
        </div>

        <div className="mt-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-medium text-slate-400">
              Starting at
            </p>
            <p className="text-xl font-black text-[#0b1b2f]">{service.price}</p>
          </div>
          <Link to={`/services/${service.id}`}>
            <Button size="icon" className="flex items-center justify-center">
              →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
