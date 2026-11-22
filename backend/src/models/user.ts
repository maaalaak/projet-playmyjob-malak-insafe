import { z } from 'zod';

export const PASSWORD_MIN_LENGTH: number = 8;

const emailSchema = z.email().trim().toLowerCase();

export const registerRequestSchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  email: emailSchema,
  password: z.string().min(PASSWORD_MIN_LENGTH).max(100),
});

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export type PublicUser = Omit<User, 'passwordHash'>;

export interface AuthResponse {
  token: string;
  user: PublicUser;
}
