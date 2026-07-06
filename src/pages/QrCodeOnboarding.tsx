import React, { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
import { AnimatePresence,motion } from 'framer-motion';
import { 
  Check, 
  Smartphone, 
  Sparkles, 
  Info, 
  Lock, 
  RefreshCw, 
  ArrowRight, 
  Database, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Info as InfoIcon,
  HelpCircle
} from 'lucide-react';
import { SUPPORTED_BANKS } from '@/bank/data';
import { getBankLogo } from '@/components/BankLogos';
// import { OnboardingState, SimulationLog } from './types';
import { OnboardingState,SimulationLog } from '@/bank/types';

export default function QrCodeOnboarding() {
  // ----------------------------------------------------
  // State Management
  // ----------------------------------------------------
  const [amount, setAmount] = useState<string>('');
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'connecting' | 'success'>('input');
  
  // Interactive Simulator Controls
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [connectingStep, setConnectingStep] = useState<number>(0);
  const [logs, setLogs] = useState<SimulationLog[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      event: 'Onboarding session initialized.',
      type: 'info'
    }
  ]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [deviceColor, setDeviceColor] = useState<string>('midnight'); // midnight, silver, gold
  
  // Reference elements
  const inputRef = useRef<HTMLInputElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // ----------------------------------------------------
  // Logging Helper
  // ----------------------------------------------------
  const addLog = (event: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newLog: SimulationLog = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString(),
      event,
      type
    };
    setLogs(prev => [...prev, newLog]);
  };

  // Scroll logs to bottom
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Handle Amount Input Change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Strip everything except numbers and a single period
    let sanitized = rawVal.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimals
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = `${parts[0]}.${parts.slice(1).join('')}`;
    }
    
    // Limit decimal places to 2
    if (parts.length === 2 && parts[1].length > 2) {
      sanitized = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }

    // Limit overall digits to prevent integer overflow/overflowing layout
    if (parts[0].length > 8) {
      return;
    }

    setAmount(sanitized);
    setValidationError(null);
    
    if (sanitized) {
      addLog(`Amount updated to £${formatValue(sanitized)}`, 'info');
    } else {
      addLog('Amount input cleared', 'info');
    }
  };

  // Quick preset triggers
  const applyPreset = (presetValue: string) => {
    setAmount(presetValue);
    setValidationError(null);
    addLog(`Applied amount preset: £${formatValue(presetValue)}`, 'success');
    
    // Focus input for dynamic cursor effect
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Format amount with commas
  const formatValue = (val: string): string => {
    if (!val) return '';
    const parts = val.split('.');
    const formattedInt = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length === 2 ? `${formattedInt}.${parts[1]}` : formattedInt;
  };

  // Select Bank Handler
  const handleBankSelect = (bankId: string) => {
    const bank = SUPPORTED_BANKS.find(b => b.id === bankId);
    setSelectedBankId(bankId);
    setValidationError(null);
    if (bank) {
      addLog(`Selected partner bank: ${bank.name} (${bank.fullName})`, 'info');
    }
  };

  // Open Banking Link Simulation Flow
  const startConnectingFlow = () => {
    // Basic validation
    if (!amount || parseFloat(amount) <= 0) {
      setValidationError('Please enter an onboarding amount');
      addLog('Validation failed: Missing or invalid amount', 'warning');
      return;
    }
    if (!selectedBankId) {
      setValidationError('Please select your current bank');
      addLog('Validation failed: Bank selection required', 'warning');
      return;
    }

    const selectedBank = SUPPORTED_BANKS.find(b => b.id === selectedBankId);
    addLog(`Initiating secure Open Banking link with ${selectedBank?.name}...`, 'info');
    setStep('connecting');
    setConnectingStep(0);

    // Sequence through connection simulation steps
    const simulationSteps = [
      { text: `Establishing handshakes with ${selectedBank?.name} API nodes...`, time: 600 },
      { text: 'Verifying PSD2 regulations and cryptographic signatures...', time: 1300 },
      { text: `Provisioning initial funds route of £${formatValue(amount)}...`, time: 2000 },
      { text: 'Onboarding completed successfully!', time: 2700 }
    ];

    simulationSteps.forEach((s, idx) => {
      setTimeout(() => {
        setConnectingStep(idx + 1);
        addLog(s.text, idx === 3 ? 'success' : 'info');
        if (idx === 3) {
          setStep('success');
        }
      }, s.time);
    });
  };

  // Reset Onboarding Demo
  const resetFlow = () => {
    setAmount('');
    setSelectedBankId(null);
    setStep('input');
    setConnectingStep(0);
    setValidationError(null);
    addLog('Onboarding session reset. Clean slate ready.', 'info');
  };

  // Quick references
  const currentSelectedBank = SUPPORTED_BANKS.find(b => b.id === selectedBankId);

  // Auto-size typography logic depending on length of amount
  const getAmountFontSize = () => {
    const len = amount.length;
    if (len > 8) return 'text-4xl';
    if (len > 6) return 'text-5xl';
    if (len > 4) return 'text-6xl';
    return 'text-7xl';
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-0 md:p-6 lg:p-12 antialiased selection:bg-neutral-900 selection:text-white" id="main-container">
      
      {/* Upper Subtle Banner */}
      <div className="hidden lg:flex items-center gap-3 mb-8 max-w-6xl w-full justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-bold text-sm">£</div>
          <span className="font-display font-semibold text-lg tracking-tight">TransAct Premium Onboarding</span>
        </div>
        <div className="flex items-center gap-2 bg-white border border-neutral-200 py-1.5 px-3 rounded-full text-xs text-neutral-500 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Open Banking Sandbox v2.4 (Active)</span>
        </div>
      </div>

      {/* Main Dual-Column Sandbox Experience */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: THE PREMIUM MOBILE DEVICE FRAME              */}
        {/* ========================================================= */}
        <div className="col-span-1 lg:col-span-7 flex flex-col items-center justify-center">
          
          {/* Device Mockup Wrapper */}
          <div className="relative w-full max-w-[400px] bg-neutral-50 md:bg-transparent px-4 md:px-0">
            
            {/* Elegant Phone Shadows & Bezel (Visible on desktop) */}
            <div className="hidden md:block absolute -inset-3.5 bg-neutral-950 rounded-[48px] shadow-2xl border-4 border-neutral-800/80 z-0">
              {/* Dynamic Camera Cutout (Dynamic Island look) */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30 flex items-center justify-between px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-900/90 border border-neutral-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60"></div>
              </div>
            </div>

            {/* Inner Device Screen Panel */}
            <div className="relative bg-white md:rounded-[38px] overflow-hidden border border-neutral-200/50 md:border-none aspect-[9/19.5] w-full z-10 flex flex-col justify-between shadow-xs">
              
              {/* Top iOS Status Bar Simulator */}
              <div className="w-full h-11 pt-3.5 px-7 flex justify-between items-center text-xs font-semibold text-neutral-950 z-20 select-none bg-white">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  {/* Wifi icon */}
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.444 12.444 0 0 0 8 3 12.44 12.44 0 0 0 .663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049z"/>
                    <path d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.455 9.455 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.577 1.336c.205.132.48.108.652-.065zm-2.183 2.183c.226-.226.185-.605-.1-.75A6.473 6.473 0 0 0 8 9c-1.187 0-2.302.318-3.268.87-.285.165-.326.544-.1.75l.15.15c.16.16.407.19.6.085A5.478 5.478 0 0 1 8 10c1.224 0 2.365.4 3.318 1.07.194.137.45.1.61-.06l.118-.117zM9.028 12.572c.263-.263.16-.72-.21-.824A3.99 3.99 0 0 0 8 11c-.307 0-.61.034-.904.1-.371.104-.474.56-.21.824l.56.56c.312.312.818.312 1.13 0l.552-.512z"/>
                  </svg>
                  {/* Battery icon */}
                  <div className="w-5 h-2.5 border border-neutral-900 rounded-xs p-0.5 flex items-center">
                    <div className="h-full w-4/5 bg-neutral-900 rounded-2xs"></div>
                  </div>
                </div>
              </div>

              {/* Main Phone Canvas */}
              <div className="relative flex-1 bg-white flex flex-col justify-between px-6 pt-5 pb-8 z-10" id="onboarding-screen">
                
                <AnimatePresence mode="wait">
                  {/* STEP 1: INPUT CONTROLS SCREEN */}
                  {step === 'input' && (
                    <motion.div 
                      key="input-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      {/* Vertically Centered Aesthetic Layout */}
                      <div className="flex-1 flex flex-col justify-center py-6">
                        
                        {/* 1. Header Section */}
                        <div className="text-center mb-8" id="onboarding-header">
                          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-display">
                            Onboarding
                          </h1>
                          <p className="text-sm font-medium tracking-wide text-neutral-400 uppercase mt-1">
                            Amount
                          </p>
                        </div>

                        {/* 2. Beautiful Interactive Amount Input Area */}
                        <div className="text-center mb-10 relative">
                          {/* Hidden Real Native Input (Accessible via tap anywhere on target) */}
                          <input
                            ref={inputRef}
                            type="text"
                            inputMode="decimal"
                            value={amount}
                            onChange={handleAmountChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="0"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            id="amount-input"
                          />

                          {/* Render Styled Amount with Dynamic Caret and Currency Symbol */}
                          <div 
                            className="inline-flex items-center justify-center min-h-[5rem] cursor-text select-none group px-4 py-2"
                            onClick={() => inputRef.current?.focus()}
                          >
                            {/* British Pound Symbol - Fades and scales */}
                            {amount && (
                              <motion.span 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl md:text-5xl font-semibold text-neutral-900 mr-1.5 self-center font-display"
                              >
                                £
                              </motion.span>
                            )}

                            {/* Digits Display */}
                            <span className={`${getAmountFontSize()} font-bold tracking-tight font-display transition-all duration-200 ${amount ? 'text-neutral-950' : 'text-neutral-200/90'}`}>
                              {amount ? formatValue(amount) : '0'}
                            </span>

                            {/* Blinking Premium Cursor Line */}
                            {isFocused && (
                              <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                                className="w-[3px] h-12 bg-neutral-950 ml-1 rounded-full self-center"
                              ></motion.span>
                            )}
                          </div>

                          {/* Tap indicator helper */}
                          <div className="mt-2 flex justify-center items-center gap-1.5 text-xs text-neutral-400 pointer-events-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
                            <span>Tap number to edit</span>
                          </div>
                        </div>

                        {/* 3. Bank Selection Title and Component */}
                        <div className="mb-4">
                          <p className="text-center text-sm font-medium text-neutral-500 mb-5">
                            Select your current bank
                          </p>

                          {/* Bank Logos Horizontal Row */}
                          <div className="flex justify-center items-center gap-3 py-1" id="bank-list">
                            {SUPPORTED_BANKS.map((bank) => {
                              const isSelected = selectedBankId === bank.id;
                              return (
                                <button
                                  key={bank.id}
                                  id={`bank-btn-${bank.id}`}
                                  onClick={() => handleBankSelect(bank.id)}
                                  className="relative group transition-all duration-300"
                                  title={bank.name}
                                >
                                  {/* Circular Container with soft rounded corners & consistent spacing */}
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 relative ${
                                    isSelected 
                                      ? 'border-neutral-900 bg-white scale-110 shadow-md ring-4 ring-neutral-100' 
                                      : 'border-neutral-200/75 bg-neutral-50 hover:bg-neutral-100 hover:scale-105 hover:border-neutral-300'
                                  }`}>
                                    {getBankLogo(bank.id, "w-8 h-8 rounded-full")}

                                    {/* Tick Badge on Selection */}
                                    {isSelected && (
                                      <motion.div 
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neutral-900 flex items-center justify-center text-white"
                                      >
                                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                                      </motion.div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {/* Dynamic Name and Info display of selected bank */}
                          <div className="h-6 mt-4 text-center">
                            <AnimatePresence mode="wait">
                              {currentSelectedBank ? (
                                <motion.div
                                  key={currentSelectedBank.id}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="text-xs font-semibold text-neutral-700 tracking-wide inline-flex items-center gap-1.5 justify-center py-0.5 px-3 bg-neutral-100 rounded-full"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentSelectedBank.brandColor }}></span>
                                  <span>{currentSelectedBank.fullName}</span>
                                </motion.div>
                              ) : (
                                <p className="text-xs text-neutral-400 italic">No bank selected</p>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                      </div>

                      {/* Validation Error Message */}
                      <AnimatePresence>
                        {validationError && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="mb-4 bg-red-50 text-red-600 text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 border border-red-100"
                          >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span className="font-medium">{validationError}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit Button */}
                      <button
                        onClick={startConnectingFlow}
                        className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 font-sans hover:shadow-md cursor-pointer"
                        id="submit-onboarding-btn"
                      >
                        <span>Submit</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 2: OPEN BANKING CONNECTING LOADER SCREEN */}
                  {step === 'connecting' && (
                    <motion.div 
                      key="connecting-view"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      className="flex-1 flex flex-col justify-between py-12"
                    >
                      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                        
                        {/* Dynamic Floating Rings Loader */}
                        <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-4 border-neutral-100"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-t-neutral-900 animate-spin"></div>
                          <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center shadow-xs">
                            {currentSelectedBank ? getBankLogo(currentSelectedBank.id, "w-8 h-8") : <Smartphone className="w-6 h-6 text-neutral-400" />}
                          </div>
                        </div>

                        <h2 className="text-xl font-bold text-neutral-900 tracking-tight font-display mb-2">
                          Linking Secure Route
                        </h2>
                        <p className="text-sm text-neutral-400 max-w-xs mb-8">
                          Authorized via PSD2 Open Banking regulations. Establishing verified handshake.
                        </p>

                        {/* Interactive Steps Tick Display */}
                        <div className="w-full max-w-xs space-y-3.5 text-left bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                          {[
                            'Secure Token Handshake',
                            'Signature Verification',
                            'Provisioning £' + formatValue(amount),
                          ].map((text, idx) => {
                            const isDone = connectingStep > idx;
                            const isActive = connectingStep === idx;
                            return (
                              <div key={idx} className="flex items-center gap-3 text-xs">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                  isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-neutral-900 text-white animate-pulse' : 'bg-neutral-100 text-neutral-400'
                                }`}>
                                  {isDone ? (
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  ) : (
                                    <span className="font-semibold">{idx + 1}</span>
                                  )}
                                </div>
                                <span className={`font-medium transition-colors ${isDone ? 'text-neutral-900' : isActive ? 'text-neutral-800 font-semibold' : 'text-neutral-400'}`}>
                                  {text}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer Protection Info */}
                      <div className="flex items-center justify-center gap-1.5 text-neutral-400 text-xs">
                        <Lock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>256-bit AES Cryptographic Tunnel</span>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: SUCCESSFUL RECEIPT SCREEN */}
                  {step === 'success' && (
                    <motion.div 
                      key="success-view"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col justify-between py-2"
                    >
                      <div className="flex-1 flex flex-col justify-center py-6">
                        
                        {/* Animated Large Checkmark Badge */}
                        <div className="flex flex-col items-center text-center mb-6">
                          <motion.div
                            initial={{ scale: 0.4, opacity: 0 }}
                            animate={{ scale: [0.4, 1.1, 1], opacity: 1 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg mb-4"
                          >
                            <Check className="w-9 h-9 stroke-[3]" />
                          </motion.div>
                          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 font-display">
                            Link Successful
                          </h2>
                          <p className="text-sm text-neutral-400 mt-1 px-4">
                            Your secure account link has been initialized with the requested deposit.
                          </p>
                        </div>

                        {/* Premium Visual Receipt Card */}
                        <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 shadow-3xs space-y-4 mb-6">
                          <div className="flex justify-between items-center pb-3 border-b border-neutral-200/50">
                            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Onboarding Asset</span>
                            <span className="text-xs font-bold bg-neutral-900 text-white py-0.5 px-2.5 rounded-full">RECEIPT</span>
                          </div>

                          {/* Bank details row */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-500 font-medium">Institution</span>
                            <div className="flex items-center gap-2">
                              {currentSelectedBank && getBankLogo(currentSelectedBank.id, "w-6 h-6 rounded-full")}
                              <span className="text-sm font-semibold text-neutral-900">{currentSelectedBank?.name}</span>
                            </div>
                          </div>

                          {/* Reference ID row */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-500 font-medium">Reference Code</span>
                            <span className="text-sm font-mono font-medium text-neutral-800">TXN-7492-OB{amount.slice(0, 1)}</span>
                          </div>

                          {/* Settled Funds */}
                          <div className="flex items-center justify-between pt-3 border-t border-dashed border-neutral-200">
                            <span className="text-sm text-neutral-500 font-medium">Linked Capital</span>
                            <span className="text-xl font-bold text-neutral-950 font-display">
                              £{formatValue(amount)}
                            </span>
                          </div>
                        </div>

                        {/* Open Banking Authorization Confirmation */}
                        <div className="flex items-start gap-2 bg-neutral-100 p-3.5 rounded-xl border border-neutral-200/30 text-[11px] text-neutral-500">
                          <InfoIcon className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-neutral-700">FCA Regulated Handshake:</span> Your bank authorization credentials have been successfully exchanged and stored locally. You can revoke token access anytime inside your bank application.
                          </div>
                        </div>

                      </div>

                      {/* Restart Demo Button */}
                      <button
                        onClick={resetFlow}
                        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Configure New Onboarding</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Bottom iOS Home Indicator */}
              <div className="w-full h-8 flex justify-center items-center pb-2 z-20 select-none bg-white">
                <div className="w-32 h-1 bg-neutral-900 rounded-full"></div>
              </div>

            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: THE INTERACTIVE SANDBOX CONTROL PANEL        */}
        {/* ========================================================= */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 justify-between">
          
          {/* Controls Information Card */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-neutral-900" />
                <h3 className="font-display font-bold text-lg text-neutral-900">Interactive Sandbox</h3>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                Test the mobile interface flow immediately. Select presets below to see the interactive digital display dynamically adjust.
              </p>

              {/* Preset Amounts Grid */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-3">
                  Amount Presets
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {['50', '250', '1250', '5000'].map((val) => {
                    const isCurrent = amount === val;
                    return (
                      <button
                        key={val}
                        onClick={() => applyPreset(val)}
                        className={`py-2 px-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          isCurrent 
                            ? 'bg-neutral-950 text-white shadow-xs' 
                            : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200/50'
                        }`}
                      >
                        £{parseFloat(val).toLocaleString()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Bank Data Inspector */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-3">
                  Bank Connectivity Inspector
                </span>
                <div className="bg-neutral-50 border border-neutral-200/60 rounded-2xl p-4">
                  {currentSelectedBank ? (
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-medium">Institution</span>
                        <span className="font-bold text-neutral-800">{currentSelectedBank.fullName}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-medium">HQ Location</span>
                        <span className="text-neutral-700">{currentSelectedBank.hqLocation}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-medium">Founded</span>
                        <span className="text-neutral-700">{currentSelectedBank.founded}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-medium">Open Banking Status</span>
                        <span className="py-0.5 px-2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                          {currentSelectedBank.openBankingStatus}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                      <HelpCircle className="w-8 h-8 text-neutral-300 mb-2" />
                      <p className="text-xs text-neutral-400 italic">Select a bank icon on the phone interface to audit status metadata.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Quick Specs */}
            <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-4 text-center">
              <div className="bg-neutral-50 rounded-xl p-2 border border-neutral-200/20">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Input Validation</span>
                <span className="text-xs font-bold text-neutral-700">Protected Decimal</span>
              </div>
              <div className="bg-neutral-50 rounded-xl p-2 border border-neutral-200/20">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Aesthetic Layout</span>
                <span className="text-xs font-bold text-neutral-700">Minimalist Swiss</span>
              </div>
            </div>

          </div>

          {/* Simulated Activity Log Terminal (JSON Console feel) */}
          <div className="bg-neutral-900 rounded-3xl p-5 border border-neutral-800 shadow-md flex-1 flex flex-col justify-between min-h-[180px]">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-mono font-bold text-neutral-200">Simulation Terminal Logs</span>
              </div>
              <button 
                onClick={() => setLogs([])}
                className="text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors font-mono uppercase tracking-wide cursor-pointer"
              >
                Clear
              </button>
            </div>

            {/* Event lines list */}
            <div className="flex-1 overflow-y-auto max-h-[140px] text-[11px] font-mono space-y-2 no-scrollbar">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-1.5">
                    <span className="text-neutral-600 shrink-0">[{log.timestamp}]</span>
                    <span className={
                      log.type === 'success' ? 'text-emerald-400' :
                      log.type === 'warning' ? 'text-rose-400 font-semibold' :
                      'text-neutral-300'
                    }>
                      {log.event}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-neutral-600 italic">Terminal waiting for interaction events...</div>
              )}
              <div ref={logEndRef} />
            </div>

            {/* Simulation footer line */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-800 mt-2">
              <span className="text-[9px] font-mono text-neutral-600">STATE: {step.toUpperCase()}</span>
              <span className="text-[9px] font-mono text-neutral-600">INPUT: {amount ? `£${amount}` : 'NULL'}</span>
            </div>

          </div>

        </div>

      </div>

      {/* Aesthetic Footer Info */}
      <div className="mt-12 text-center text-xs text-neutral-400 select-none">
        <p>© 2026 TransAct Inc. Authorised and Regulated by the Financial Conduct Authority (FCA).</p>
      </div>

    </div>
  );
}
