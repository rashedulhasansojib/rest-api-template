import { z } from 'zod';

/**
 * Common reusable schemas
 * These can be shared across multiple validation objects
 */

// Email validation schema
const emailSchema = z
  .string()
  .min(5, { message: 'Email must be at least 5 characters long' })
  .max(255, { message: 'Email cannot exceed 255 characters' })
  .trim()
  .toLowerCase()
  .refine((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
    message: 'Invalid email address',
  });

// Name validation schema
const nameSchema = z
  .string()
  .min(2, { message: 'Name must be at least 2 characters long' })
  .max(50, { message: 'Name cannot exceed 50 characters' })
  .regex(/^[a-zA-Z\s'-]+$/, {
    message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  })
  .trim();

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  });

// MongoDB ObjectId validation schema
const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB ObjectId' });

/**
 * User validation schemas
 */

// Create user validation
export const createUserValidation = {
  body: z
    .object({
      name: nameSchema,
      email: emailSchema,
      password: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
};

// Update user validation
export const updateUserValidation = {
  body: z
    .object({
      name: nameSchema.optional(),
      email: emailSchema.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
  params: z.object({
    id: mongoIdSchema,
  }),
};

// Get user validation
export const getUserValidation = {
  params: z.object({
    id: mongoIdSchema,
  }),
};

// Delete user validation
export const deleteUserValidation = {
  params: z.object({
    id: mongoIdSchema,
  }),
};

/**
 * Type exports (inferred from schemas)
 */
export type CreateUserInput = z.infer<typeof createUserValidation.body>;
export type UpdateUserInput = z.infer<typeof updateUserValidation.body>;
export type GetUserParams = z.infer<typeof getUserValidation.params>;
export type DeleteUserParams = z.infer<typeof deleteUserValidation.params>;
