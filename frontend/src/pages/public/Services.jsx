import { useEffect, useState } from "react";
import ServiceCard from "../../components/common/ServiceCard";
import FeaturedServiceCard from "../../components/common/FeaturedServiceCard";
import Button from "../../components/ui/Button";
import { getServices } from "../../api/services";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800";
const PAGE_SIZE = 12;

function toCardShape(svc) {
  return {
    id: svc.id,
    title: svc.title,
    author: svc.expertName ?? "Unknown Expert",
    rating: svc.expertRating != null ? svc.expertRating.toFixed(1) : "—",
    image: svc.imageUrl || FALLBACK_IMAGE,
    price: `$${Number(svc.price ?? 0).toLocaleString()}`,
    tags: svc.tags ?? [],
  };
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getServices(page, PAGE_SIZE)
      .then((data) => {
        setServices(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const cards = services.map(toCardShape);

  return (
    <div>
      <section className="px-14 py-10 max-w-[1500px] mx-auto">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs text-slate-500">
              Services / <span className="font-black text-slate-800">All Services</span>
            </p>
            <h1 className="text-4xl font-black tracking-tight text-[#0b1b2f]">
              AI Expert Services
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-500">
              Browse ready-made AI solutions offered by vetted experts. Hire directly for
              LLM fine-tuning, computer vision, data pipelines, and more.
            </p>
          </div>
          <Button variant="ghost">Sort by: Featured⌄</Button>
        </div>

        {loading && <p className="text-sm text-gray-400 py-8">Loading services...</p>}

        {!loading && cards.length === 0 && (
          <p className="text-sm text-gray-400 py-8">No services available.</p>
        )}

        {!loading && cards.length > 0 && (
          <div className="grid grid-cols-4 gap-8">
            {cards.slice(0, 4).map((svc) => (
              <ServiceCard key={svc.id} service={svc} />
            ))}

            <FeaturedServiceCard />

            {cards.slice(4).map((svc) => (
              <ServiceCard key={svc.id} service={svc} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-3 text-xs font-bold">
              {Array.from({ length: Math.min(totalPages, 12) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-8 w-8 rounded-full transition-all ${
                    page === i
                      ? "bg-orange-500 text-white"
                      : "bg-white text-slate-600 hover:bg-orange-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {totalPages > 12 && <span className="text-slate-500">...</span>}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}