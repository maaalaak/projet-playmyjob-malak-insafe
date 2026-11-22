import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.ts';
import { db } from '../data/db.ts';
import { HttpError } from '../errors/http-error.ts';
import type { AuthResponse, LoginRequest, PublicUser, RegisterRequest, User } from '../models/user.ts';

const HASH_ROUNDS: number = 10;
const TOKEN_DURATION: jwt.SignOptions['expiresIn'] = '7d';

class AuthService {
  public async register(request: RegisterRequest): Promise<AuthResponse> {
    const emailTaken: boolean = db.data.users.some((user: User) => user.email === request.email);

    if (emailTaken) {
      throw new HttpError(409, 'Un compte existe déjà avec cet email');
    }

    const user: User = {
      id: randomUUID(),
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      passwordHash: await bcrypt.hash(request.password, HASH_ROUNDS),
      createdAt: new Date().toISOString(),
    };

    db.data.users.push(user);
    await db.write();

    return this.authenticate(user);
  }

  public async login(request: LoginRequest): Promise<AuthResponse> {
    const user: User | undefined = db.data.users.find((item: User) => item.email === request.email);
    const passwordMatches: boolean = user !== undefined && (await bcrypt.compare(request.password, user.passwordHash));

    if (!user || !passwordMatches) {
      throw new HttpError(401, 'Email ou mot de passe incorrect');
    }

    return this.authenticate(user);
  }

  public verifyToken(token: string): string {
    try {
      const payload: string | jwt.JwtPayload = jwt.verify(token, env.JWT_SECRET);

      if (typeof payload === 'string' || !payload.sub) {
        throw new Error('Jeton sans utilisateur');
      }

      return payload.sub;
    } catch {
      throw new HttpError(401, 'Session expirée, reconnecte-toi');
    }
  }

  private authenticate(user: User): AuthResponse {
    const token: string = jwt.sign({}, env.JWT_SECRET, { subject: user.id, expiresIn: TOKEN_DURATION });
    const { passwordHash: _passwordHash, ...publicUser }: User = user;

    return { token, user: publicUser satisfies PublicUser };
  }
}

export const authService: AuthService = new AuthService();
