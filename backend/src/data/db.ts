import { fileURLToPath } from 'node:url';
import { JSONFilePreset } from 'lowdb/node';
import type { Low } from 'lowdb';
import type { Favorite } from '../models/favorite.ts';

export interface DbSchema {
  favorites: Favorite[];
}

const DB_FILE: string = fileURLToPath(new URL('./db.json', import.meta.url));
const DEFAULT_DATA: DbSchema = { favorites: [] };

export const db: Low<DbSchema> = await JSONFilePreset<DbSchema>(DB_FILE, DEFAULT_DATA);
