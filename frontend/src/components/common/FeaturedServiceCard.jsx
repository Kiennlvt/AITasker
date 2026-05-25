import React from "react";

export default function FeaturedServiceCard() {
    return (
        <div className="col-span-2 grid overflow-hidden rounded-[28px] bg-[#08192b] text-white shadow-[0_20px_40px_rgba(15,23,42,0.14)] md:grid-cols-2">
            <img
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=900"
                alt="Robotics"
                className="h-full min-h-[300px] w-full object-cover"
            />

            <div className="flex flex-col justify-between p-8">
                <div>
                    <span className="rounded-full bg-orange-500 px-4 py-1 text-[10px] font-black text-white">
                        PREMIUM PARTNER
                    </span>

                    <h2 className="mt-4 text-3xl font-black leading-tight">
                        Reinforcement Learning for Industrial Robotics
                    </h2>

                    <p className="mt-4 text-sm leading-relaxed text-slate-300">
                        Bespoke RL agents optimized for complex manufacturing environments
                        and precision hardware control.
                    </p>
                </div>

                <div className="mt-8 flex items-end justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-600" />
                        <div>
                            <p className="text-xs font-semibold">Quantum Robotics Corp</p>
                            <p className="text-[10px] font-bold text-orange-400">
                                Elite Tier Agency
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] text-slate-400">Contracts from</p>
                        <p className="text-2xl font-black">$15,000</p>
                    </div>
                </div>
            </div>
        </div>
    );
}