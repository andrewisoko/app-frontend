import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(10, 'Max 10 characters'),
    surname: z.string().min(1, 'Surname is required').max(10, 'Max 10 characters'),
    email: z.string().email('Invalid email address'),
    mobile_number: z
      .string()
      .regex(/^\+?[0-9\s\-().]{7,20}$/, 'Invalid phone number')
      .optional()
      .or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const contractSchema = z.object({
  sender: z.string().min(1, 'Sender is required'),
  receiver: z.array(z.string().min(1, 'Receiver username required')).min(1, 'Add at least one receiver'),
  contract_type: z.enum(['one_time', 'existing_user']),
  split_agreement: z.enum(['percentage', 'amount']),
  sender_percentage: z.number().min(0).max(100).optional(),
  receiver_percentage: z.array(z.number().min(0).max(100)).optional(),
  sender_amount: z.number().min(0).optional(),
  receiver_amount: z.array(z.number().min(0)).optional(),
  start_date: z.date({ message: 'Start date is required' }),
  end_date: z.date({ message: 'End date is required' }),
  repayment_agreement: z.string().optional(),
  event_agreement: z.string().optional(),
  location_agreement: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ContractFormData = z.infer<typeof contractSchema>;
