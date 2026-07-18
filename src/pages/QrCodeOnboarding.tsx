import React, { useState, useRef, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence,motion } from 'framer-motion';
import { 
  Check, 
  ArrowRight, 
  AlertCircle, 
} from 'lucide-react';
import { SUPPORTED_BANKS } from '@/bank/data';
import { getBankLogo } from '@/components/BankLogos';
import { Contract, contractsService } from '@/services/contracts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth';

export default function QrCodeOnboarding() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState<string>('');
  const [selectedBankName, setSelectedBankName] = useState<string | null>(null);
  const [step] = useState<'input' | 'connecting' | 'success'>('input');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const location = useLocation();
  const contractId = (location.state as { contractId?: string } | null)?.contractId;
  const [contract, setContract ] = useState<Contract>()
  const { qrCodeSignIn, isAuthenticated } = useAuth()


  // Reference elements
  const inputRef = useRef<HTMLInputElement>(null);


  //////////////////////////
  //////////////////////////
  /////// Use effect ///////
  //////////////////////////
  //////////////////////////

    useEffect(() => {
      if (isAuthenticated) {
        navigate('/app/qr-code/loading-new-profile',
          {replace:true})
      }
      if (! contractId) return;

      const findContract = async () => {
        const currentContract = await contractsService.getContract(contractId)
        setContract(currentContract)
      }
      findContract()
    }, [isAuthenticated,navigate])


  //////////////////////////
  //////////////////////////
  /////// Handlers /////////
  //////////////////////////
  //////////////////////////


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
    
  };

  // Select Bank Handler
  const handleBankSelect = (bankName: string) => {

    setSelectedBankName(bankName);
    setValidationError(null);

  };

  const handleSubmit = async (
      contractId:string,
      amount:number,
      bank:string

  ) => {
     if (!contractId) {
        setValidationError('Missing contract ID')
        return
      }

   try {
      await contractsService.newAUserQRcode({
          contractId,
          decision:true,
          amount:amount,
          bank:bank
      })
      const response = await authService.newAUserFromQRcode({ contractId, decision:true ,amount,bank })
      qrCodeSignIn(response.token,response.user)
      // navigate('/app/qr-code/loading-new-profile',{
      //   state:{ bank: bank}
      // })
      console.log('contract accepted', contractId)
      } catch (error) {
          console.log('QR code contract accepted', error)
      }
  }

  /////////////////////////
  /////////////////////////
  /////// formats /////////
  /////////////////////////
  /////////////////////////


  // Format amount with commas
  const formatValue = (val: string): string => {
    if (!val) return '';
    const parts = val.split('.');
    const formattedInt = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length === 2 ? `${formattedInt}.${parts[1]}` : formattedInt;
  };


  // Quick references
  const currentSelectedBank = SUPPORTED_BANKS.find(b => b.id === selectedBankName);

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
        { contract?.contract_status ==="accepted" ?(

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
                  <div className="flex-1 flex flex-col justify-center mb-24">
                    
                    {/* 1. Header Section */}
                    <div className="text-center " id="onboarding-header">
                      <h1 className="text-3xl font-bold  text-neutral-900 font-display">
                        Onboarding
                      </h1>
                      <p className="text-sm font-medium tracking-wide text-neutral-400 uppercase mt-14">
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
                          <div className="mt-5 flex justify-center items-center gap-1.5 text-xs text-neutral-400 pointer-events-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
                            <span>Tap number to edit</span>
                          </div>
                        </div>

                        {/* 3. Bank Selection Title and Component */}
                        <div>
                          <p className="text-center text-sm font-medium text-neutral-500 mt-7 mb-12">
                            Select your current bank
                          </p>

                          {/* Bank Logos Horizontal Row */}
                          <div className="flex justify-center items-center gap-3 py-1" id="bank-list">
                            {SUPPORTED_BANKS.map((bank) => {
                              const isSelected = selectedBankName === bank.name;
                              return (
                                <button
                                  key={bank.id}
                                  id={`bank-btn-${bank.id}`}
                                  onClick={() => handleBankSelect(bank.name)}
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
                        onClick={() => handleSubmit(
                          contractId ?? '',
                          Number(amount),
                          selectedBankName ?? ''
                        )}
                        className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 font-sans hover:shadow-md cursor-pointer"
                        id="submit-onboarding-btn"
                      >
                        <span>Submit</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
              <div className="mt-12 text-center text-xs text-neutral-400 select-none">
                <p>© 2026 TransAct Inc. Authorised and Regulated by the Financial Conduct Authority (FCA).</p>
              </div>
            </AnimatePresence>
        ):(
           <div className="text-white/60 text-sm py-4">No recipients found</div>
        )}

    </div>
  );
}
