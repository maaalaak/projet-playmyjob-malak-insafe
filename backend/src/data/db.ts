import { fileURLToPath } from 'node:url';
import { JSONFilePreset } from 'lowdb/node';
import type { Low } from 'lowdb';
import type { Favorite } from '../models/favorite.ts';
import type { Simulation } from '../models/simulation.ts';
import type { User } from '../models/user.ts';

export interface DbSchema {
  users: User[];
  favorites: Favorite[];
  simulations: Simulation[];
}

const DB_FILE: string = fileURLToPath(new URL('./db.json', import.meta.url));
const DEFAULT_DATA: DbSchema = { users: [], favorites: [], simulations: [] };

export const db: Low<DbSchema> = await JSONFilePreset<DbSchema>(DB_FILE, DEFAULT_DATA);

// Un fichier créé avant l'ajout d'une liste est complété avec les listes manquantes.
db.data = { ...DEFAULT_DATA, ...db.data };
