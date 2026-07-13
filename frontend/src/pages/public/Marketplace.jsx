import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import JobCard from "../../components/common/JobCard";
import { getJobs } from "../../api/jobs";
import useCategories from "../../hooks/useCategories";

const PAGE_SIZE = 12;

function matchesCategory(jobCategory, cat, mainCategories) {
  if (cat === "Other") {
    return !jobCategory || !mainCategories.some((mc) => mc.toLowerCase() === jobCategory.toLowerCase());
  }
  return jobCategory?.toLowerCase() === cat.toLowerCase();
}

const SORT_OPTIONS = [
  { label: "Latest",              value: "createdAt,desc" },
  { label: "Oldest",              value: "createdAt,asc"  },
  { label: "Budget: High to Low", value: "budget,desc"    },
  { label: "Budget: Low to High", value: "budget,asc"     },
  { label: "Deadline: Soonest",   value: "deadline,asc"   },
];

export default function Marketplace() {
  const { categories: allCategories } = useCategories();
  const mainCategories = allCategories.filter((c) => c.name !== "Other").map((c) => c.name);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchParams] = useSearchParams();
  const selectedCategories = searchParams.getAll("category");
  const maxPriceParam = searchParams.get("maxPrice");
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : Infinity;
  const searchTxt = searchParams.get("search") || "";

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
    getJobs(page, PAGE_SIZE, sort.value)
      .then((data) => {
        setJobs(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, sort]);

  function handleSort(option) {
    setSort(option);
    setPage(0);
    setOpen(false);
  }

  return (
    <div>
      <section className="px-14 py-10 max-w-[1500px] mx-auto">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs text-slate-500">
              Marketplace / <span className="font-black text-slate-800">All Jobs</span>
            </p>
            <h1 className="text-4xl font-black tracking-tight text-[#0b1b2f]">
              AI Job Marketplace
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-500">
Browse open AI projects posted by clients. Find your next opportunity in LLM fine-tuning,
              computer vision, data engineering, and more.
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

        {loading && <p className="text-sm text-gray-400 py-8">Loading jobs...</p>}

        {!loading && jobs.length === 0 && (
          <p className="text-sm text-gray-400 py-8">No open jobs at the moment.</p>
        )}

        {!loading && jobs.length > 0 && (() => {
          const filtered = jobs.filter((job) => {
            const matchesSearch = !searchTxt ||
              job.title?.toLowerCase().includes(searchTxt.toLowerCase()) ||
              job.category?.toLowerCase().includes(searchTxt.toLowerCase());
            const catOk = selectedCategories.length === 0 ||
              selectedCategories.some((cat) => matchesCategory(job.category, cat, mainCategories));
            const priceOk = (job.budget ?? 0) <= maxPrice;
            return matchesSearch && catOk && priceOk;
          });
          return filtered.length === 0 ? (
            <p className="text-sm text-gray-400 py-8">No jobs match the current filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
            </div>
          );
        })()}

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
