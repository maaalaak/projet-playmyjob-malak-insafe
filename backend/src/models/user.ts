import { z } from 'zod';

export const PASSWORD_MIN_LENGTH: number = 8;

const emailSchema = z.email().trim().toLowerCase();

const profileFieldsSchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  email: emailSchema,
});

export const registerRequestSchema = profileFieldsSchema.extend({
  password: z.string().min(PASSWORD_MIN_LENGTH).max(100),
});

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const updateProfileRequestSchema = profileFieldsSchema;

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;

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

export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser }: User = user;
  return publicUser;
}
