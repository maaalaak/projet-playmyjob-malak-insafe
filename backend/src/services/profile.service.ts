import { db } from '../data/db.ts';
import { HttpError } from '../errors/http-error.ts';
import { toPublicUser, type PublicUser, type UpdateProfileRequest, type User } from '../models/user.ts';

class ProfileService {
  public findById(userId: string): PublicUser {
    return toPublicUser(this.findUser(userId));
  }

  public async update(userId: string, request: UpdateProfileRequest): Promise<PublicUser> {
    const user: User = this.findUser(userId);
    const emailTaken: boolean = db.data.users.some((item: User) => item.email === request.email && item.id !== userId);

    if (emailTaken) {
      throw new HttpError(409, 'Un autre compte utilise déjà cet email');
    }

    user.firstName = request.firstName;
    user.lastName = request.lastName;
    user.email = request.email;
    await db.write();

    return toPublicUser(user);
  }

  private findUser(userId: string): User {
    const user: User | undefined = db.data.users.find((item: User) => item.id === userId);

    if (!user) {
      throw new HttpError(404, 'Compte introuvable');
    }

    return user;
  }
}

export const profileService: ProfileService = new ProfileService();
