import { useState,useEffect } from "react";
import { SUPPORTED_BANKS } from "@/bank/data";
import { motion } from 'framer-motion'
import { 
  Smartphone, 
  Sparkles, 

  Lock, 
} from 'lucide-react';
import { getBankLogo } from "@/components/BankLogos";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";




export default function  LoadingNewProfile(){

    const navigate = useNavigate()
    const [progress, setProgress] = useState<number>(0);
    const [step, setStep] = useState<'input' | 'processing' | 'dashboard'>('input');
    const [processingMessage, setProcessingMessage] = useState<string>('Connecting to your bank...');
    const location = useLocation();
    const bank = (location.state as { bank: string } | null)?.bank;
    const currentSelectedBank = SUPPORTED_BANKS.find(b => b.name === bank);
 


useEffect(() => {
  if (step === 'processing') {
    setProgress(0);
    setProcessingMessage('Connecting to your bank...');
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Smooth message updates at key progress thresholds
        if (next === 25) {
          setProcessingMessage('Authorizing open banking route...');
        } else if (next === 55) {
          setProcessingMessage('Transferring your funds...');

        } else if (next === 82) {
          setProcessingMessage('Processing your deposit...');
        }
        
        return next;
      });
    }, 45); // ~4.5 seconds total
    
    return () => clearInterval(interval);
  }
}, [step]);

// Automatically transition to the Dashboard once process hits 100%
useEffect(() => {
  if (progress === 100 && step === 'processing') {
    
    const timeout = setTimeout(() => {
      setStep('dashboard');
    }, 800);
    
    return () => clearTimeout(timeout);
  }
}, [progress, step]);

    return(
<motion.div 
    key="processing-view"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.05 }}
    transition={{ duration: 0.4 }}
    className="flex-1 flex flex-col justify-between py-6 text-white"
  >
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
      
      {/* Smooth, premium transaction transfer animation */}
      <div className="w-full max-w-[280px] h-[190px] relative flex flex-col items-center justify-between mb-8">
        
        {/* 1. Top Source: User Selected Bank inside a glowing glass orb */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="z-10 flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center relative shadow-[0_0_20px_rgba(255,255,255,0.08)]">
            {currentSelectedBank ? getBankLogo(currentSelectedBank.id, "w-9 h-9 rounded-full") : <Smartphone className="w-6 h-6 text-white" />}
            <motion.span 
              animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-1.5 rounded-full border border-white/10"
            />
          </div>
          <span className="text-[10px] font-semibold text-neutral-400 tracking-wide uppercase mt-1.5">
            {currentSelectedBank?.name || "My Bank"}
          </span>
        </motion.div>

        {/* 2. Vertical Flow Tube & Connecting Line */}
        <div className="absolute top-14 bottom-14 left-1/2 -translate-x-1/2 w-4 flex flex-col items-center overflow-hidden">
          <svg className="w-2 h-full" xmlns="http://www.w3.org/2000/svg">
            <line 
              x1="50%" y1="0%" x2="50%" y2="100%" 
              stroke="rgba(255, 255, 255, 0.15)" 
              strokeWidth="2" 
              strokeDasharray="6 4" 
            />
          </svg>

          {/* Moving currency / particle nodes representing the transfer */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ y: -5, opacity: 0, scale: 0.6 }}
              animate={{ 
                y: 75, 
                opacity: [0, 1, 1, 0],
                scale: [0.6, 1.1, 1.1, 0.6]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: i * 0.55,
                ease: "easeInOut"
              }}
              className="absolute w-6 h-6 bg-white/10 backdrop-blur-md rounded-full border border-white/25 flex items-center justify-center text-[9px] font-bold text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.35)]"
            >
              £
            </motion.div>
          ))}
        </div>

        {/* 3. Bottom Target: TransAct Vault App inside a vibrant neon gradient circle */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="z-10 flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 border border-white/20 flex items-center justify-center relative shadow-[0_0_25px_rgba(147,51,234,0.45)]">
            <Sparkles className="w-7 h-7 text-white" />
            <motion.span 
              animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="absolute -inset-3 rounded-full border border-purple-500/20"
            />
          </div>
          <span className="text-[10px] font-bold text-white tracking-wide uppercase mt-1.5">
            TransAct App
          </span>
        </motion.div>

      </div>

      {/* Title and message */}
      <h2 className="text-xl font-bold tracking-tight font-display mb-1 text-white">
        {processingMessage}
      </h2>
      <p className="text-xs text-neutral-400 max-w-xs mb-8">
        Authorized via FCA Regulated PSD2 Open Banking.
      </p>

      {/* Beautiful Progress Bar & Percentage display */}
      <div className="w-full max-w-[260px] bg-white/5 border border-white/10 p-3.5 rounded-2xl flex flex-col gap-2.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-neutral-400 font-medium">Securing Deposit Route</span>
          <span className="font-mono font-bold text-emerald-400">{progress}%</span>
        </div>
        
        {/* Progress track */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-100 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

    </div>

    {/* Footer Protection Info */}
    <div className="flex items-center justify-center gap-1.5 text-neutral-500 text-xs">
      <Lock className="w-3.5 h-3.5" />
      <span>FCA Cryptographic Transfer Gate</span>
    </div>
  </motion.div>
    )
}