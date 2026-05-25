import React from "react";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  return (
    <section className="flex items-center justify-center bg-[#1f3348] px-8 py-10">
      <div className="w-full max-w-[430px]">
        <div className="mb-7">
          <h1 className="text-3xl font-black text-orange-500">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Enter the email address associated with your account and
            <br />
            we will send you a link to reset your password.
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-black text-orange-500">
              Email
            </label>

            <input
              type="email"
              placeholder="name@company.ai"
              className="w-full rounded-md border border-slate-300 bg-[#f7f7fb] px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-orange-500"
            />
          </div>

          <Button className="w-full rounded-md">
            Send Reset Link <span className="ml-2 text-lg">→</span>
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-sm font-semibold text-slate-400">
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
}
