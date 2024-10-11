import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { favorites } from '../db/schema';
import { assertAuthenticated } from '../lib/auth-utils';

export async function getFavorites() {
  const userId = await assertAuthenticated();

  const allFavorites = await db.query.favorites.findMany({
    where: eq(favorites.userId, userId),
  });

  return allFavorites;
}
