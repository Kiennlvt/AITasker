import Button from "../../components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useState } from "react";
import { HiSparkles } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please enter email and password"); return; }
    setLoading(true);
    try {
      const data = await login(email, password);
      setAuth(data);
      toast.success(`Welcome back, ${data.fullName}!`);
      // Redirect based on role
      if (data.role === "EXPERT") navigate("/dashboard-expert");
      else navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center bg-[#1f3348] px-8 py-12">
      <div className="w-full max-w-[430px]">
        <div className="mb-5">
          <h1 className="flex items-center gap-2 text-2xl font-black text-white">
            <HiSparkles className="text-[22px] text-orange-500" />
            AI-Tasker
          </h1>
          <p className="mt-3 text-sm font-bold text-orange-500">
            Welcome back. Enter your credentials to access
            <br />
            the marketplace.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-xs font-black text-orange-500">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-md border border-slate-300 bg-[#f7f7fb] px-4 py-3 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-black text-orange-500">Password</label>
              <Link to="/forgot-password" className="text-xs font-black text-orange-500">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-slate-300 bg-[#f7f7fb] px-4 py-3 pr-10 text-sm outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 3l18 18" />
                    <path d="M10.5 10.5a2 2 0 0 0 3 3" />
                    <path d="M9.88 5.09A9.77 9.77 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.16 2.94" />
                    <path d="M6.61 6.61A17.3 17.3 0 0 0 2 12s3.5 7 10 7a9.76 9.76 0 0 0 5.39-1.61" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <Button
            className="w-full rounded-md"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : <>Sign In <span className="ml-1">↪</span></>}
          </Button>
        </form>

        <div className="my-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-400" />
          <span className="text-[10px] font-bold text-slate-400">OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-slate-400" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-3 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-sm">
            <FcGoogle className="text-xl" /> Sign up with Google
          </button>
          <button className="flex items-center justify-center gap-3 bg-[#2f6df6] px-4 py-3 text-xs font-bold text-white shadow-sm">
            <FaFacebook className="text-xl text-white" /> Sign up with Facebook
          </button>
        </div>

        <p className="mt-7 text-center text-xs text-slate-400">
          New to the marketplace?{" "}
          <Link to="/register" className="font-bold text-orange-500">Sign Up</Link>
        </p>
      </div>
    </section>
  );
}
