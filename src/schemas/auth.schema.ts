import { z } from 'zod';

/**
 * Authentication validation schemas
 */

// Login validation
export const loginValidation = {
  body: z.object({
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email address' })
      .trim()
      .toLowerCase(),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
};

/**
 * Type exports (inferred from schemas)
 */
export type LoginInput = z.infer<typeof loginValidation.body>;
