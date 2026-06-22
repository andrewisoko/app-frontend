import { ArrowLeftRight, Smartphone, Monitor, ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { useNavigate } from 'react-router-dom'



// type Experience = "user" | "terminal";

// interface Props {
//   onSelect: (e: Experience) => void;
// }

export function LandingPage() {
  const navigate  = useNavigate()
  return (
    <div className="min-h-screen w-full bg-[#0c0618] flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">

      {/* Ambient glow blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-80 h-80 bg-purple-700/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-60px] w-72 h-72 bg-indigo-600/20 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo + brand */}
      <div className="relative z-10 flex flex-col items-center mb-12">
        <div className="size-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/50 mb-4">
          <ArrowLeftRight className="size-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">TransAct</h1>
        <p className="text-purple-300/70 text-sm font-medium tracking-wide"> 360 Payment methods</p>
      </div>

      {/* Sub-heading */}
      <div className="relative z-10 text-center mb-10">
        <p className="text-white/90 text-xl font-semibold mb-1">Choose your experience</p>
        <p className="text-white/40 text-sm">Select how you'd like to interact with TransAct today</p>
      </div>

      {/* Experience cards */}
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-4">

        {/* User Experience */}
        <button
          onClick={() => navigate("/onboarding")}
          className="group relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#1f0f38] via-[#1a0d30] to-[#130828] p-6 text-left transition-all duration-300 hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-900/40 active:scale-[0.98]"
        >
          {/* Glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-indigo-600/0 group-hover:from-purple-600/10 group-hover:to-indigo-600/10 transition-all duration-300 rounded-3xl" />

          <div className="relative z-10 flex items-start gap-4">
            {/* Icon */}
            <div className="size-14 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-900/50">
              <Smartphone className="size-7 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-white font-bold text-lg">User Experience</h2>
                <ArrowRight className="size-4 text-purple-400 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              <p className="text-purple-200/60 text-xs leading-relaxed">
                Full mobile banking dashboard — send money, manage contracts, track transactions.
              </p>
              <div className="flex gap-2 mt-3">
                {["Dashboard", "Cards", "Contracts"].map((tag) => (
                  <span key={tag} className="text-[10px] font-medium text-purple-300/70 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom decorative strip */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </button>

        {/* Terminal Experience */}
        <button
          onClick={() => navigate("/terminal")}
          className="group relative overflow-hidden rounded-3xl border border-slate-600/20 bg-gradient-to-br from-[#0f1923] via-[#0d1720] to-[#081219] p-6 text-left transition-all duration-300 hover:border-slate-500/40 hover:shadow-xl hover:shadow-slate-900/40 active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-teal-600/0 group-hover:from-cyan-600/8 group-hover:to-teal-600/8 transition-all duration-300 rounded-3xl" />

          <div className="relative z-10 flex items-start gap-4">
            {/* Icon */}
            <div className="size-14 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center flex-shrink-0 shadow-lg border border-slate-500/20">
              <Monitor className="size-7 text-slate-200" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-white font-bold text-lg">Terminal Experience</h2>
                <ArrowRight className="size-4 text-slate-400 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              <p className="text-slate-300/50 text-xs leading-relaxed">
                Point-of-sale terminal — accept card and QR payments like a real retail device.
              </p>
              <div className="flex gap-2 mt-3">
                {["QR Pay", "Keypad", "POS"].map((tag) => (
                  <span key={tag} className="text-[10px] font-medium text-slate-400/70 bg-slate-500/10 border border-slate-500/20 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent" />
        </button>
      </div>

      {/* Footer trust badges */}
      <div className="relative z-10 flex items-center gap-6 mt-12">
        {[
          { icon: <Shield className="size-3.5" />, label: "Bank-grade Security" },
          { icon: <Zap className="size-3.5" />, label: "Instant Transfers" },
          { icon: <Globe className="size-3.5" />, label: "Global Payments" },
        ].map((b) => (
          <div key={b.label} className="flex items-center gap-1.5 text-white/25">
            {b.icon}
            <span className="text-[10px] font-medium">{b.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
