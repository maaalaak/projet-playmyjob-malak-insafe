import type { Request, Response } from 'express';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../models/user.ts';
import { authService } from '../services/auth.service.ts';

export async function register(
  req: Request<Record<string, never>, AuthResponse, RegisterRequest>,
  res: Response<AuthResponse>,
): Promise<void> {
  res.status(201).json(await authService.register(req.body));
}

export async function login(
  req: Request<Record<string, never>, AuthResponse, LoginRequest>,
  res: Response<AuthResponse>,
): Promise<void> {
  res.json(await authService.login(req.body));
}
