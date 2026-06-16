import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, BookmarkX, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { getSavedServices, unsaveService } from "../../api/savedService";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800";

export default function SavedServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    getSavedServices()
      .then(setServices)
      .catch(() => toast.error("Unable to load saved list"))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (serviceId) => {
    setRemoving(serviceId);
    try {
      await unsaveService(serviceId);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      toast.success("Removed from saved list");
    } catch {
      toast.error("An error occurred, please try again.");
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 animate-fadeIn text-[#1a1a3c]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Saved service</h1>
          <p className="text-sm text-gray-400 mt-1">{services.length} Service</p>
        </div>
        <Link
          to="/services"
          className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
        >
          Explore more →
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 shadow-sm text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookmarkX size={28} className="text-orange-400" />
          </div>
          <h3 className="font-bold text-lg text-[#1a1a3c] mb-2">No services have been saved yet.</h3>
          <p className="text-sm text-gray-400 mb-6">
            Nhấn "Save for later" Visit the service details page to save the services you are interested in./</p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              Explore services
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {services.map((service) => (
            <SavedServiceCard
              key={service.id}
              service={service}
              removing={removing === service.id}
              onRemove={() => handleRemove(service.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SavedServiceCard({ service, removing, onRemove }) {
  const image = service.imageUrl || FALLBACK_IMAGE;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-orange-100 transition-all flex flex-col">
      <div className="relative h-44 overflow-hidden">
        <img src={image} alt={service.title} className="w-full h-full object-cover" />
        <button
          onClick={onRemove}
          disabled={removing}
          title="Xóa khỏi danh sách đã lưu"
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-xl flex items-center justify-center shadow-sm transition-all disabled:opacity-60"
        >
          {removing ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <BookmarkX size={14} />
          )}
        </button>
        {service.category && (
          <span className="absolute bottom-3 left-3 bg-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
            {service.category}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          {service.expertAvatarUrl ? (
            <img
              src={service.expertAvatarUrl}
              alt={service.expertName}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
              {service.expertName?.slice(0, 2).toUpperCase() ?? "??"}
            </div>
          )}
          <span className="text-xs font-semibold text-gray-500">{service.expertName}</span>
        </div>

        <h3 className="font-black text-sm text-[#1a1a3c] leading-snug line-clamp-2 flex-1">
          {service.title}
        </h3>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Price from</p>
            <p className="text-lg font-black text-orange-500">
              ${Number(service.price ?? 0).toLocaleString()}
            </p>
          </div>
          <Link
            to={`/services/${service.id}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1a1a3c] hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all"
          >
            <ExternalLink size={12} />
            See details
          </Link>
        </div>
      </div>
    </div>
  );
}