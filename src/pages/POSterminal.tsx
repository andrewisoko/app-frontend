import { useState, useEffect, useRef } from "react";
import {
  Wifi,
  Battery,
  Delete,
  CheckCircle2,
  XCircle,
  RefreshCw,
  QrCode,
  ArrowLeft,
  NfcIcon,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";






const MERCHANT = "TransAct Retail";
const TID = "TID-4829";

type TerminalState = "entry" | "ready" | "scanning" | "processing" | "approved" | "declined";

function pad(n: string) {
  if (!n) return "0.00";
  const digits = n.replace(/\D/g, "");
  if (!digits) return "0.00";
  const cents = digits.padStart(3, "0");
  return `${parseInt(cents.slice(0, -2), 10).toLocaleString()}.${cents.slice(-2)}`;
}

export function POSTerminal() {
  const [state, setState] = useState<TerminalState>("entry");
  const [raw, setRaw] = useState("");
  const [scanY, setScanY] = useState(0);
  const [authCode] = useState(() => Math.random().toString(36).slice(2, 8).toUpperCase());
  const scanRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate()

  const amount = pad(raw);
  const hasAmount = parseFloat(amount) > 0;

  // scan line animation
  useEffect(() => {
    if (state === "scanning") {
      scanRef.current = setInterval(() => {
        setScanY((y) => (y >= 100 ? 0 : y + 1.8));
      }, 18);
      const timer = setTimeout(() => {
        clearInterval(scanRef.current!);
        setState("processing");
        setTimeout(() => {
          setState(Math.random() < 0.8 ? "approved" : "declined");
        }, 2000);
      }, 3000);
      return () => {
        clearInterval(scanRef.current!);
        clearTimeout(timer);
      };
    }
  }, [state]);

  const press = (key: string) => {
    if (state !== "entry" && state !== "ready") return;
    if (key === "C") { setRaw(""); setState("entry"); return; }
    if (key === "⌫") { const next = raw.slice(0, -1); setRaw(next); setState(next ? "ready" : "entry"); return; }
    if (key === "OK") { if (hasAmount) setState("scanning"); return; }
    if (raw.length >= 8) return;
    const next = raw + key;
    setRaw(next);
    setState("ready");
  };

  const reset = () => {
    setRaw("");
    setState("entry");
    setScanY(0);
  };

  const now = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen w-full bg-[#111] flex items-center justify-center ">
      {/* Back */}
      <button
        onClick={() => navigate('/landing')}
        className="absolute top-1 ml-4 left-5 z-20 flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-xs"
      >
        <ArrowLeft className="size-3.5" />
        Back
      </button>

      {/* Terminal device */}
      <div className="relative w-[340px] flex flex-col rounded-[32px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]"
        style={{ background: "linear-gradient(170deg,#2a2a2a 0%,#1a1a1a 40%,#141414 100%)" }}>

        {/* Top hardware notch */}
        <div className="flex items-center justify-center pt-3 pb-2 px-8">
          <div className="w-16 h-1 bg-[#333] rounded-full" />
        </div>

        {/* Screen area */}
        <div className="mx-3 rounded-2xl overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]"
          style={{ background: "#f0ede8" }}>

          {/* Screen header bar */}
          <div className="flex items-center justify-between px-4 py-2.5"
            style={{ background: "linear-gradient(90deg,#1a237e,#283593)" }}>
            <div className="flex items-center gap-2">
              <div className="size-5 rounded bg-white/20 flex items-center justify-center">
                <Zap className="size-3 text-yellow-300" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white leading-none">{MERCHANT}</p>
                <p className="text-[8px] text-white/50 mt-px">{TID}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <span className="text-[9px] font-mono">{now}</span>
              <Wifi className="size-3" />
              <Battery className="size-3.5" />
            </div>
          </div>

          {/* Amount display */}
          <div className="px-5 pt-5 pb-4 text-center border-b border-black/8"
            style={{ background: "linear-gradient(180deg,#f0ede8,#e8e4de)" }}>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Total Amount</p>
            <div className="flex items-start justify-center gap-1">
              <span className="text-2xl font-bold text-slate-500 mt-1.5">£</span>
              <span className={`text-5xl font-black tracking-tight leading-none ${hasAmount ? "text-slate-800" : "text-slate-300"}`}>
                {amount}
              </span>
            </div>
            {state === "ready" && (
              <p className="text-[10px] text-emerald-600 font-semibold mt-2 flex items-center justify-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Ready to accept payment
              </p>
            )}
            {state === "entry" && (
              <p className="text-[10px] text-slate-400 mt-2">Enter amount using keypad below</p>
            )}
          </div>

          {/* QR / Payment zone */}
          <div className="px-4 py-4">
            {/* Idle / Entry / Ready — scanner visible */}
            {(state === "entry" || state === "ready") && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-black/8" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Scan to Pay</p>
                  <div className="h-px flex-1 bg-black/8" />
                </div>

                <button
                  onClick={() => hasAmount && setState("scanning")}
                  disabled={!hasAmount}
                  className={`w-full rounded-xl overflow-hidden transition-all ${hasAmount ? "cursor-pointer active:scale-[0.98]" : "opacity-40 cursor-not-allowed"}`}
                >
                  <div className="relative bg-white rounded-xl flex items-center justify-center overflow-hidden border-2"
                    style={{ height: 120, borderColor: hasAmount ? "#1a237e" : "#ccc" }}>
                    {/* Corner markers */}
                    {[["top-0 left-0","border-t-2 border-l-2"],["top-0 right-0","border-t-2 border-r-2"],["bottom-0 left-0","border-b-2 border-l-2"],["bottom-0 right-0","border-b-2 border-r-2"]].map(([pos, border], i) => (
                      <div key={i} className={`absolute ${pos} size-5 ${border} m-1`} style={{ borderColor: "#1a237e" }} />
                    ))}
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <QrCode className="size-8 text-slate-300" />
                      <p className="text-[10px] font-medium">
                        {hasAmount ? "Tap to activate scanner" : "Enter amount first"}
                      </p>
                    </div>
                  </div>
                </button>

                {/* NFC hint */}
                <div className="flex items-center justify-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <NfcIcon className="size-3.5" />
                    <span className="text-[9px] font-medium">Tap card</span>
                  </div>
                  <div className="size-1 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <QrCode className="size-3.5" />
                    <span className="text-[9px] font-medium">Scan QR</span>
                  </div>
                  <div className="size-1 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <svg viewBox="0 0 24 24" className="size-3.5 fill-current"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                    <span className="text-[9px] font-medium">Insert card</span>
                  </div>
                </div>
              </div>
            )}

            {/* Scanning state */}
            {state === "scanning" && (
              <div className="flex flex-col items-center">
                <div className="relative bg-black rounded-xl overflow-hidden" style={{ width: "100%", height: 120 }}>
                  {/* Camera noise overlay */}
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.03) 2px,rgba(255,255,255,0.03) 4px)" }} />
                  {/* Corner markers */}
                  {[["top-0 left-0","border-t-2 border-l-2"],["top-0 right-0","border-t-2 border-r-2"],["bottom-0 left-0","border-b-2 border-l-2"],["bottom-0 right-0","border-b-2 border-r-2"]].map(([pos, border], i) => (
                    <div key={i} className={`absolute ${pos} size-5 ${border} m-2 border-green-400`} />
                  ))}
                  {/* Scan line */}
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_8px_2px_rgba(74,222,128,0.6)]"
                    style={{ top: `${scanY}%`, transition: "top 18ms linear" }}
                  />
                  {/* Center crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-8 border border-green-400/30 rounded-sm" />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-green-600 mt-2 animate-pulse">Scanning QR code...</p>
              </div>
            )}

            {/* Processing */}
            {state === "processing" && (
              <div className="flex flex-col items-center justify-center py-4 gap-3">
                <div className="relative size-14 rounded-full border-2 border-blue-200 flex items-center justify-center">
                  <RefreshCw className="size-6 text-blue-600 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700">Processing Payment</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Please do not remove card</p>
                </div>
                <div className="flex gap-1">
                  {[0,1,2].map((i) => (
                    <div key={i} className="size-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Approved */}
            {state === "approved" && (
              <div className="flex flex-col items-center justify-center py-3 gap-2">
                <div className="size-14 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="size-8 text-emerald-500" />
                </div>
                <div className="text-center">
                  <p className="text-base font-black text-emerald-600 tracking-wide">APPROVED</p>
                  <p className="text-xl font-black text-slate-800 mt-0.5">£{amount}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 text-center w-full">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">Auth Code</p>
                  <p className="text-sm font-black text-slate-700 font-mono mt-0.5">{authCode}</p>
                </div>
                <button onClick={reset} className="mt-1 text-[10px] font-semibold text-blue-600 underline">
                  New Transaction
                </button>
              </div>
            )}

            {/* Declined */}
            {state === "declined" && (
              <div className="flex flex-col items-center justify-center py-3 gap-2">
                <div className="size-14 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center">
                  <XCircle className="size-8 text-red-500" />
                </div>
                <div className="text-center">
                  <p className="text-base font-black text-red-600 tracking-wide">DECLINED</p>
                  <p className="text-xs text-slate-500 mt-0.5">Please try another payment method</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-center w-full">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Reason</p>
                  <p className="text-xs font-bold text-red-600 mt-0.5">Insufficient funds</p>
                </div>
                <button onClick={reset} className="mt-1 text-[10px] font-semibold text-blue-600 underline">
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Physical keypad */}
        <div className="px-4 pt-4 pb-5">
          <div className="grid grid-cols-3 gap-2.5">
            {["7","8","9","4","5","6","1","2","3","C","0","⌫"].map((k) => (
              <button
                key={k}
                onPointerDown={() => press(k)}
                className={`
                  h-12 rounded-xl text-sm font-bold tracking-wide
                  transition-all duration-75
                  active:translate-y-[1px] active:shadow-none
                  ${k === "C"
                    ? "bg-gradient-to-b from-red-500 to-red-700 text-white shadow-[0_3px_0_#7f1d1d]"
                    : k === "⌫"
                    ? "bg-gradient-to-b from-amber-400 to-amber-600 text-white shadow-[0_3px_0_#78350f]"
                    : "shadow-[0_3px_0_#111] text-[#1a1a2e]"}
                `}
                style={k !== "C" && k !== "⌫" ? {
                  background: "linear-gradient(180deg,#e8e4de 0%,#d0ccc6 100%)",
                } : undefined}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Enter / OK full-width */}
          <button
            onPointerDown={() => press("OK")}
            disabled={!hasAmount || (state !== "entry" && state !== "ready")}
            className="mt-2.5 w-full h-12 rounded-xl text-sm font-black tracking-widest uppercase text-white transition-all duration-75 active:translate-y-[1px] active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(180deg,#1e40af 0%,#1e3a8a 100%)",
              boxShadow: "0 3px 0 #1e2451",
            }}
          >
            ✓ Confirm
          </button>
        </div>

        {/* Card slot indicator at bottom */}
        <div className="flex items-center justify-center gap-3 pb-4 px-6">
          <div className="h-px flex-1 bg-white/5" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-1.5 rounded-sm bg-[#333] border border-[#444]" />
            <p className="text-[8px] text-white/20 font-medium uppercase tracking-widest">Card Slot</p>
            <div className="w-8 h-1.5 rounded-sm bg-[#333] border border-[#444]" />
          </div>
          <div className="h-px flex-1 bg-white/5" />
        </div>

      </div>
    </div>
  );
}
