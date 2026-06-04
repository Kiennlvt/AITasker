import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiSparkles } from "react-icons/hi2";
import useAuthStore from "../../store/authStore";
import { getMe } from "../../api/auth";
import toast from "react-hot-toast";

export default function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");

    if (!token) {
      toast.error("OAuth2 login failed. Please try again.");
      navigate("/login");
      return;
    }

    // Pre-store token so axios interceptor sends it with getMe()
    localStorage.setItem("accessToken", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

    getMe()
      .then((user) => {
        setAuth({
          accessToken: token,
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          avatarUrl: user.avatarUrl,
        });
        toast.success(`Welcome, ${user.fullName}!`);
        if (user.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (user.role === "EXPERT") {
          navigate("/dashboard-expert");
        } else {
          navigate("/dashboard");
        }
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        toast.error("Failed to retrieve user info. Please try again.");
        navigate("/login");
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#1f3348]">
      <h1 className="flex items-center gap-2 text-xl font-black text-white">
        <HiSparkles className="text-[20px] text-[#f97316]" />
        AI-Tasker
      </h1>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f97316] border-t-transparent" />
      <p className="text-sm text-slate-400">Signing you in...</p>
    </div>
  );
}
