import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useContracts } from '../../context/ContractContext';
import { useAuth } from '../../context/AuthContext';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { SendContractDto, SplitAgreement, ContractType } from '../../types/contract.types';
import { formatDate, formatDuration } from '../../utils/formatters';
import { Colors } from '../../constants/colors';

const TOTAL_STEPS = 5;
const STEP_LABELS = ['Parties', 'Split', 'Time', 'Conditions', 'Review'];

// ------ Step components ------

function Step1Parties({
  senderUsername,
  receivers,
  contractType,
  onReceiversChange,
  onContractTypeChange,
  errors,
}: {
  senderUsername: string;
  receivers: string[];
  contractType: ContractType;
  onReceiversChange: (r: string[]) => void;
  onContractTypeChange: (t: ContractType) => void;
  errors: Record<string, string>;
}) {
  const updateReceiver = (idx: number, val: string) => {
    const updated = [...receivers];
    updated[idx] = val;
    onReceiversChange(updated);
  };
  const addReceiver = () => onReceiversChange([...receivers, '']);
  const removeReceiver = (idx: number) => {
    const updated = receivers.filter((_, i) => i !== idx);
    onReceiversChange(updated.length ? updated : ['']);
  };

  return (
    <View className="gap-5">
      {/* Sender */}
      <View>
        <Text className="text-gray-400 text-xs mb-1.5 ml-1" style={{ fontFamily: 'Inter_500Medium' }}>
          From (You)
        </Text>
        <View className="bg-slate-700/50 border border-blue-500/30 rounded-xl px-4 py-3.5 flex-row items-center gap-2">
          <Text className="text-blue-400 text-base" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>
            🔒 {senderUsername}
          </Text>
        </View>
      </View>

      {/* Receivers */}
      <View>
        <Text className="text-gray-400 text-xs mb-1.5 ml-1" style={{ fontFamily: 'Inter_500Medium' }}>
          To (Receivers)
        </Text>
        {receivers.map((r, i) => (
          <View key={i} className="flex-row items-center gap-2 mb-2">
            <View className="flex-1">
              <Input
                placeholder="Enter username"
                value={r}
                onChangeText={(v) => updateReceiver(i, v)}
                error={errors[`receiver_${i}`]}
                autoCapitalize="none"
              />
            </View>
            {receivers.length > 1 && (
              <TouchableOpacity
                onPress={() => removeReceiver(i)}
                className="w-9 h-9 rounded-full bg-red-500/20 items-center justify-center"
              >
                <Text className="text-red-400 text-base">−</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity
          onPress={addReceiver}
          className="flex-row items-center gap-2 mt-1"
        >
          <Text className="text-blue-400 text-sm" style={{ fontFamily: 'Inter_500Medium' }}>
            + Add another receiver
          </Text>
        </TouchableOpacity>
        {errors.receivers && (
          <Text className="text-red-400 text-xs mt-1" style={{ fontFamily: 'Inter_400Regular' }}>
            {errors.receivers}
          </Text>
        )}
      </View>

      {/* Contract type */}
      <View>
        <Text className="text-gray-400 text-xs mb-2 ml-1" style={{ fontFamily: 'Inter_500Medium' }}>
          Contract Type
        </Text>
        <View className="flex-row gap-2">
          {(['one_time', 'existing_user'] as ContractType[]).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => onContractTypeChange(t)}
              className={`flex-1 py-3 rounded-xl border items-center ${
                contractType === t
                  ? 'bg-blue-600/20 border-blue-500'
                  : 'border-white/20 bg-transparent'
              }`}
            >
              <Text
                className={`text-sm ${contractType === t ? 'text-blue-400' : 'text-gray-400'}`}
                style={{ fontFamily: contractType === t ? 'SpaceGrotesk_600SemiBold' : 'Inter_400Regular' }}
              >
                {t === 'one_time' ? 'One-Time' : 'Existing User'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

function Step2Split({
  splitType,
  receiverCount,
  senderValue,
  receiverValues,
  onSplitTypeChange,
  onSenderValueChange,
  onReceiverValueChange,
  errors,
}: {
  splitType: SplitAgreement;
  receiverCount: number;
  senderValue: string;
  receiverValues: string[];
  onSplitTypeChange: (t: SplitAgreement) => void;
  onSenderValueChange: (v: string) => void;
  onReceiverValueChange: (i: number, v: string) => void;
  errors: Record<string, string>;
}) {
  const isPercent = splitType === 'percentage';
  const senderNum = parseFloat(senderValue) || 0;
  const receiverNums = receiverValues.map((v) => parseFloat(v) || 0);
  const total = senderNum + receiverNums.reduce((a, b) => a + b, 0);
  const senderRatio = total > 0 ? (senderNum / total) * 100 : 0;

  return (
    <View className="gap-5">
      {/* Split type toggle */}
      <View>
        <Text className="text-gray-400 text-xs mb-2 ml-1" style={{ fontFamily: 'Inter_500Medium' }}>
          Split by
        </Text>
        <View className="flex-row bg-slate-800 rounded-xl p-1">
          {(['percentage', 'amount'] as SplitAgreement[]).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => onSplitTypeChange(t)}
              className={`flex-1 py-2.5 rounded-lg items-center ${splitType === t ? 'bg-blue-600' : ''}`}
            >
              <Text
                className={`text-sm capitalize ${splitType === t ? 'text-white' : 'text-gray-400'}`}
                style={{ fontFamily: splitType === t ? 'SpaceGrotesk_600SemiBold' : 'Inter_400Regular' }}
              >
                {t === 'percentage' ? 'Percentage' : 'Amount'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sender input */}
      <Input
        label={`Your share (${isPercent ? '%' : '£'})`}
        placeholder={isPercent ? 'e.g. 25' : 'e.g. 100.00'}
        keyboardType="numeric"
        value={senderValue}
        onChangeText={onSenderValueChange}
        error={errors.senderValue}
      />

      {/* Receiver inputs */}
      {Array.from({ length: receiverCount }, (_, i) => (
        <Input
          key={i}
          label={`Receiver ${i + 1} share (${isPercent ? '%' : '£'})`}
          placeholder={isPercent ? 'e.g. 75' : 'e.g. 300.00'}
          keyboardType="numeric"
          value={receiverValues[i] ?? ''}
          onChangeText={(v) => onReceiverValueChange(i, v)}
          error={errors[`receiverValue_${i}`]}
        />
      ))}

      {/* Visual split bar */}
      {isPercent && total > 0 && (
        <View>
          <View className="h-3 rounded-full bg-slate-700 overflow-hidden">
            <View
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${senderRatio}%` }}
            />
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-blue-400 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>
              You {senderNum}%
            </Text>
            <Text className="text-purple-400 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>
              Others {(100 - senderRatio).toFixed(0)}%
            </Text>
          </View>
        </View>
      )}

      {errors.split && (
        <Text className="text-red-400 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>
          {errors.split}
        </Text>
      )}
    </View>
  );
}

function Step3Time({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  errors,
}: {
  startDate: Date | null;
  endDate: Date | null;
  onStartChange: (d: Date) => void;
  onEndChange: (d: Date) => void;
  errors: Record<string, string>;
}) {
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const duration =
    startDate && endDate && endDate > startDate
      ? formatDuration(startDate, endDate)
      : null;

  return (
    <View className="gap-5">
      {/* Start date */}
      <View>
        <Text className="text-gray-400 text-xs mb-1.5 ml-1" style={{ fontFamily: 'Inter_500Medium' }}>
          From (Start Date)
        </Text>
        <TouchableOpacity
          onPress={() => setShowStart(true)}
          className="bg-slate-800 border border-white/10 rounded-xl px-4 py-4 flex-row justify-between items-center"
          style={{ borderColor: errors.startDate ? '#F87171' : undefined }}
        >
          <Text className={`text-base ${startDate ? 'text-white' : 'text-gray-500'}`} style={{ fontFamily: 'Inter_400Regular' }}>
            📅 {startDate ? formatDate(startDate) : 'Select start date'}
          </Text>
          <Text className="text-blue-400 text-sm" style={{ fontFamily: 'Inter_500Medium' }}>Pick</Text>
        </TouchableOpacity>
        {errors.startDate && (
          <Text className="text-red-400 text-xs mt-1 ml-1" style={{ fontFamily: 'Inter_400Regular' }}>
            {errors.startDate}
          </Text>
        )}
      </View>

      {showStart && (
        <DateTimePicker
          value={startDate ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => {
            setShowStart(Platform.OS === 'ios');
            if (date) onStartChange(date);
          }}
        />
      )}

      {/* End date */}
      <View>
        <Text className="text-gray-400 text-xs mb-1.5 ml-1" style={{ fontFamily: 'Inter_500Medium' }}>
          To (End Date)
        </Text>
        <TouchableOpacity
          onPress={() => setShowEnd(true)}
          className="bg-slate-800 border border-white/10 rounded-xl px-4 py-4 flex-row justify-between items-center"
          style={{ borderColor: errors.endDate ? '#F87171' : undefined }}
        >
          <Text className={`text-base ${endDate ? 'text-white' : 'text-gray-500'}`} style={{ fontFamily: 'Inter_400Regular' }}>
            📅 {endDate ? formatDate(endDate) : 'Select end date'}
          </Text>
          <Text className="text-blue-400 text-sm" style={{ fontFamily: 'Inter_500Medium' }}>Pick</Text>
        </TouchableOpacity>
        {errors.endDate && (
          <Text className="text-red-400 text-xs mt-1 ml-1" style={{ fontFamily: 'Inter_400Regular' }}>
            {errors.endDate}
          </Text>
        )}
      </View>

      {showEnd && (
        <DateTimePicker
          value={endDate ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={startDate ?? new Date()}
          onChange={(_, date) => {
            setShowEnd(Platform.OS === 'ios');
            if (date) onEndChange(date);
          }}
        />
      )}

      {/* Duration */}
      {duration && (
        <View className="bg-blue-600/10 border border-blue-500/20 rounded-xl px-4 py-3">
          <Text className="text-blue-300 text-sm text-center" style={{ fontFamily: 'Inter_500Medium' }}>
            Duration: {duration}
          </Text>
        </View>
      )}
    </View>
  );
}

function Step4Conditions({
  repayment,
  event,
  location,
  onRepaymentChange,
  onEventChange,
  onLocationChange,
}: {
  repayment: string;
  event: string;
  location: string;
  onRepaymentChange: (v: string) => void;
  onEventChange: (v: string) => void;
  onLocationChange: (v: string) => void;
}) {
  const [repaymentEnabled, setRepaymentEnabled] = useState(!!repayment);
  const [eventEnabled, setEventEnabled] = useState(!!event);
  const [locationEnabled, setLocationEnabled] = useState(!!location);

  return (
    <View className="gap-5">
      <Text className="text-gray-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
        All conditions are optional. Toggle to enable.
      </Text>

      <ConditionRow
        label="Repayment Condition"
        enabled={repaymentEnabled}
        onToggle={() => {
          setRepaymentEnabled((v) => !v);
          if (repaymentEnabled) onRepaymentChange('');
        }}
        value={repayment}
        onChange={onRepaymentChange}
        placeholder="e.g. Monthly on the 1st"
      />
      <ConditionRow
        label="Event Trigger"
        enabled={eventEnabled}
        onToggle={() => {
          setEventEnabled((v) => !v);
          if (eventEnabled) onEventChange('');
        }}
        value={event}
        onChange={onEventChange}
        placeholder="e.g. Invoice received"
      />
      <ConditionRow
        label="Location"
        enabled={locationEnabled}
        onToggle={() => {
          setLocationEnabled((v) => !v);
          if (locationEnabled) onLocationChange('');
        }}
        value={location}
        onChange={onLocationChange}
        placeholder="e.g. UK only"
      />
    </View>
  );
}

function ConditionRow({
  label, enabled, onToggle, value, onChange, placeholder,
}: {
  label: string; enabled: boolean; onToggle: () => void;
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <View className="bg-slate-800 border border-white/10 rounded-2xl p-4 gap-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-sm" style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }}>{label}</Text>
        <TouchableOpacity
          onPress={onToggle}
          className={`w-11 h-6 rounded-full ${enabled ? 'bg-blue-600' : 'bg-slate-600'}`}
          style={{ justifyContent: 'center', paddingHorizontal: 2 }}
        >
          <View
            className="w-5 h-5 rounded-full bg-white"
            style={{ alignSelf: enabled ? 'flex-end' : 'flex-start' }}
          />
        </TouchableOpacity>
      </View>
      {enabled && (
        <Input
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
        />
      )}
    </View>
  );
}

function Step5Review({
  senderUsername,
  receivers,
  contractType,
  splitType,
  senderValue,
  receiverValues,
  startDate,
  endDate,
  repayment,
  event,
  location,
}: any) {
  return (
    <View className="gap-4">
      <ReviewSection title="Parties">
        <ReviewRow label="From" value={senderUsername} />
        <ReviewRow label="To" value={receivers.filter(Boolean).join(', ')} />
        <ReviewRow label="Type" value={contractType === 'one_time' ? 'One-Time' : 'Existing User'} />
      </ReviewSection>

      <ReviewSection title="Split Agreement">
        <ReviewRow label="Split by" value={splitType === 'percentage' ? 'Percentage' : 'Amount'} />
        <ReviewRow label="Your share" value={`${senderValue}${splitType === 'percentage' ? '%' : ' GBP'}`} />
        {receivers.filter(Boolean).map((r: string, i: number) => (
          <ReviewRow key={i} label={`${r}'s share`} value={`${receiverValues[i] ?? 0}${splitType === 'percentage' ? '%' : ' GBP'}`} />
        ))}
      </ReviewSection>

      {startDate && endDate && (
        <ReviewSection title="Time Agreement">
          <ReviewRow label="From" value={formatDate(startDate)} />
          <ReviewRow label="To" value={formatDate(endDate)} />
          <ReviewRow label="Duration" value={formatDuration(startDate, endDate)} />
        </ReviewSection>
      )}

      {(repayment || event || location) && (
        <ReviewSection title="Conditions">
          {repayment && <ReviewRow label="Repayment" value={repayment} />}
          {event && <ReviewRow label="Event" value={event} />}
          {location && <ReviewRow label="Location" value={location} />}
        </ReviewSection>
      )}
    </View>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="bg-slate-800 border border-white/10 rounded-2xl p-4 gap-3">
      <Text className="text-blue-400 text-xs uppercase tracking-widest" style={{ fontFamily: 'Inter_600SemiBold' }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-gray-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>{label}</Text>
      <Text className="text-white text-sm flex-shrink ml-4 text-right" style={{ fontFamily: 'Inter_500Medium' }}>{value}</Text>
    </View>
  );
}

// ------ Main screen ------

export default function CreateContractScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { sendContract, isLoading } = useContracts();

  const [step, setStep] = useState(0);
  const [receivers, setReceivers] = useState(['']);
  const [contractType, setContractType] = useState<ContractType>('one_time');
  const [splitType, setSplitType] = useState<SplitAgreement>('percentage');
  const [senderValue, setSenderValue] = useState('');
  const [receiverValues, setReceiverValues] = useState<string[]>(['']);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [repayment, setRepayment] = useState('');
  const [event, setEvent] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const senderUsername = user?.user_name ?? user?.name ?? 'You';

  const updateReceiverValue = (i: number, v: string) => {
    const updated = [...receiverValues];
    updated[i] = v;
    setReceiverValues(updated);
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      const valid = receivers.filter(Boolean);
      if (valid.length === 0) newErrors.receivers = 'Add at least one receiver.';
      receivers.forEach((r, i) => {
        if (!r.trim()) newErrors[`receiver_${i}`] = 'Username required.';
      });
    }

    if (step === 1) {
      if (!senderValue || isNaN(parseFloat(senderValue))) {
        newErrors.senderValue = 'Enter a valid sender share.';
      }
      receiverValues.forEach((v, i) => {
        if (!v || isNaN(parseFloat(v))) {
          newErrors[`receiverValue_${i}`] = 'Enter a valid receiver share.';
        }
      });
      if (splitType === 'percentage') {
        const total =
          (parseFloat(senderValue) || 0) +
          receiverValues.reduce((s, v) => s + (parseFloat(v) || 0), 0);
        if (Math.abs(total - 100) > 0.01) {
          newErrors.split = `Percentages must total 100%. Current total: ${total.toFixed(1)}%.`;
        }
      }
    }

    if (step === 2) {
      if (!startDate) newErrors.startDate = 'Select a start date.';
      if (!endDate) newErrors.endDate = 'Select an end date.';
      if (startDate && endDate && endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setApiError(null);
    const validReceivers = receivers.filter(Boolean);

    const payload: SendContractDto = {
      sender: senderUsername,
      receiver: validReceivers,
      contract_type: contractType,
      split_agreement: splitType,
      time_agreement: [startDate!.toISOString(), endDate!.toISOString()],
      ...(splitType === 'percentage'
        ? {
            sender_percentage: parseFloat(senderValue),
            receiver_percentage: receiverValues.map((v) => parseFloat(v)),
          }
        : {
            sender_amount: parseFloat(senderValue),
            receiver_amount: receiverValues.map((v) => parseFloat(v)),
          }),
      ...(repayment && { repayment_agreement: repayment }),
      ...(event && { event_agreement: event }),
      ...(location && { location_agreement: location }),
    };

    try {
      await sendContract(payload);
      navigation.navigate('ContractsList');
    } catch (e: any) {
      setApiError(e?.response?.data?.message ?? 'Failed to send contract.');
    }
  };

  return (
    <View className="flex-1 bg-app-bg">
      {/* Header */}
      <View className="px-5 pt-12 pb-4 border-b border-white/10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
          <Text className="text-blue-400 text-sm" style={{ fontFamily: 'Inter_500Medium' }}>✕ Cancel</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl mb-4" style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>
          New Contract
        </Text>

        {/* Step dots */}
        <View className="flex-row items-center gap-2">
          {STEP_LABELS.map((label, i) => (
            <React.Fragment key={i}>
              <View className="items-center">
                <View
                  className={`w-7 h-7 rounded-full items-center justify-center ${
                    i < step
                      ? 'bg-blue-600'
                      : i === step
                      ? 'bg-blue-600 border-2 border-blue-300'
                      : 'bg-slate-700'
                  }`}
                >
                  {i < step ? (
                    <Text className="text-white text-xs">✓</Text>
                  ) : (
                    <Text
                      className={`text-xs ${i === step ? 'text-white' : 'text-gray-500'}`}
                      style={{ fontFamily: 'Inter_600SemiBold' }}
                    >
                      {i + 1}
                    </Text>
                  )}
                </View>
              </View>
              {i < TOTAL_STEPS - 1 && (
                <View className={`flex-1 h-0.5 ${i < step ? 'bg-blue-600' : 'bg-slate-700'}`} />
              )}
            </React.Fragment>
          ))}
        </View>

        <Text className="text-blue-400 text-xs mt-2" style={{ fontFamily: 'Inter_500Medium' }}>
          Step {step + 1} of {TOTAL_STEPS}: {STEP_LABELS[step]}
        </Text>
      </View>

      {/* Step content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-5 pt-6"
          contentContainerStyle={{ paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 0 && (
            <Step1Parties
              senderUsername={senderUsername}
              receivers={receivers}
              contractType={contractType}
              onReceiversChange={setReceivers}
              onContractTypeChange={setContractType}
              errors={errors}
            />
          )}
          {step === 1 && (
            <Step2Split
              splitType={splitType}
              receiverCount={receivers.filter(Boolean).length}
              senderValue={senderValue}
              receiverValues={receiverValues}
              onSplitTypeChange={setSplitType}
              onSenderValueChange={setSenderValue}
              onReceiverValueChange={updateReceiverValue}
              errors={errors}
            />
          )}
          {step === 2 && (
            <Step3Time
              startDate={startDate}
              endDate={endDate}
              onStartChange={setStartDate}
              onEndChange={setEndDate}
              errors={errors}
            />
          )}
          {step === 3 && (
            <Step4Conditions
              repayment={repayment}
              event={event}
              location={location}
              onRepaymentChange={setRepayment}
              onEventChange={setEvent}
              onLocationChange={setLocation}
            />
          )}
          {step === 4 && (
            <Step5Review
              senderUsername={senderUsername}
              receivers={receivers}
              contractType={contractType}
              splitType={splitType}
              senderValue={senderValue}
              receiverValues={receiverValues}
              startDate={startDate}
              endDate={endDate}
              repayment={repayment}
              event={event}
              location={location}
            />
          )}

          {apiError && (
            <View className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
              <Text className="text-red-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>{apiError}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom navigation */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-4 bg-app-bg border-t border-white/10 flex-row gap-3">
        {step > 0 && (
          <View className="flex-1">
            <Button label="← Back" variant="ghost" fullWidth onPress={handleBack} />
          </View>
        )}
        <View className="flex-1">
          {step < TOTAL_STEPS - 1 ? (
            <Button label="Next →" fullWidth onPress={handleNext} />
          ) : (
            <Button
              label="Send Contract"
              fullWidth
              loading={isLoading}
              onPress={handleSubmit}
            />
          )}
        </View>
      </View>
    </View>
  );
}
