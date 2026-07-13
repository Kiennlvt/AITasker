import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ServiceCard from "../../components/common/ServiceCard";
import FeaturedServiceCard from "../../components/common/FeaturedServiceCard";
import { getServices } from "../../api/services";
import useCategories from "../../hooks/useCategories";

const PAGE_SIZE = 12;

function matchesCategory(tags, cat, mainCategories) {
  if (cat === "Other") {
    return !mainCategories.some((mc) =>
      tags.some((t) => t.toLowerCase().includes(mc.toLowerCase()))
    );
  }
  return tags.some((t) => t.toLowerCase().includes(cat.toLowerCase()));
}

const SORT_OPTIONS = [
  { label: "Featured",             value: "createdAt,desc"   },
  { label: "Price: Low to High",   value: "price,asc"        },
  { label: "Price: High to Low",   value: "price,desc"       },
  { label: "Fastest Delivery",     value: "deliveryDays,asc" },
  { label: "Oldest",               value: "createdAt,asc"    },
];

function toCardShape(svc, index) {
  
  let rawRating = svc.expertRating ?? svc.rating ?? svc.averageRating ?? svc.averageStars;

  if (!rawRating || isNaN(Number(rawRating)) || Number(rawRating) === 0) {
    rawRating = 5.0; 
  }

  return {
    id: svc.id,
    title: svc.title || svc.name || "AI Service",
    author: svc.expertName || svc.author || "Unknown Expert",
    rating: Number(rawRating).toFixed(1), 
    image: svc.imageUrl || null,
    price: typeof svc.price === "number" ? `$${svc.price.toLocaleString()}` : (svc.price || "$2,500"),
    tags: svc.tags && svc.tags.length > 0 ? svc.tags : ["AI Expert"],
  };
}

export default function Services() {
  const { categories: allCategories } = useCategories();
  const mainCategories = allCategories.filter((c) => c.name !== "Other").map((c) => c.name);
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [searchParams] = useSearchParams();
  const selectedCategories = searchParams.getAll("category");
  const maxPrice = Number(searchParams.get("maxPrice") || 1000000);
  
  const searchTxt = searchParams.get("search") || "";
  const ratingType = searchParams.get("rating") || ""; 

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setLoading(true);

    const params = {
    page,
    size: PAGE_SIZE,
    sort: sort.value,
  };

  if (ratingType) {
    params.rating = ratingType;
  }
getServices(page, PAGE_SIZE, sort.value, ratingType) 
    .then((data) => {
      setServices(data.content ?? []);
setTotalPages(data.totalPages ?? 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

  }, [page, sort, ratingType]);

  function handleSort(option) {
    setSort(option);
    setPage(0);
    setOpen(false);
  }

  const allCards = services.map((svc, idx) => toCardShape(svc, idx));
  
  const cards = allCards.filter((card) => {
    // 1. Lọc từ khóa tìm kiếm (theo tên hoặc category/tags)
    const matchesSearch = !searchTxt ||
      card.title.toLowerCase().includes(searchTxt.toLowerCase()) ||
      card.author.toLowerCase().includes(searchTxt.toLowerCase()) ||
      (card.tags ?? []).some((t) => t.toLowerCase().includes(searchTxt.toLowerCase()));

    // 2. Lọc theo danh mục
    const catOk = selectedCategories.length === 0 ||
      selectedCategories.some((cat) => matchesCategory(card.tags ?? [], cat, mainCategories));
    
    // 3. Lọc khoảng giá tiền
    const priceValue = Number(String(card.price).replace(/[$,]/g, ""));
    const priceOk = isNaN(priceValue) || priceValue <= maxPrice;
    
    // 4. Lọc khoảng số sao đánh giá (Rating) từ SidebarMarketplace đẩy lên
    const cardRatingNum = Number(card.rating);
    let ratingOk = true;

    if (ratingType) {
      if (ratingType === "4.0") {
        ratingOk = cardRatingNum >= 4.0 && cardRatingNum < 4.5;
      } else if (ratingType === "4.5-5.0") {
        ratingOk = cardRatingNum >= 4.5 && cardRatingNum <= 5.0;
      }
    }
    
    return matchesSearch && catOk && priceOk && ratingOk;
  });

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

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:border-orange-300 hover:text-orange-600 transition-all"
            >
              Sort by: {sort.label}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
<div className="absolute right-0 top-full mt-2 z-50 min-w-[210px] rounded-2xl border border-slate-100 bg-white py-2 shadow-xl">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
onClick={() => handleSort(opt)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-orange-50 ${
                      sort.value === opt.value
                        ? "font-bold text-orange-500"
                        : "text-slate-600"
                    }`}
                  >
                    {opt.label}
                    {sort.value === opt.value && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading && <p className="text-sm text-gray-400 py-8">Loading services...</p>}

        {!loading && cards.length === 0 && (
          <p className="text-sm text-gray-400 py-8">
            No services match the current filters.
          </p>
        )}

        {!loading && cards.length > 0 && (
          <div className="grid grid-cols-4 gap-8">
            {cards.slice(0, 4).map((svc, i) => (
              <ServiceCard key={svc.id} service={svc} index={i} />
            ))}

            {}
            {!searchTxt && !ratingType && <FeaturedServiceCard />}

            {cards.slice(4).map((svc, i) => (
              <ServiceCard key={svc.id} service={svc} index={i + 4} />
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
