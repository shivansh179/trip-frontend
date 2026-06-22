/**
 * Database layer — uses Upstash Redis if configured, otherwise MongoDB.
 * Both backends expose the same Firestore-compatible API.
 */

const hasRedis = !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
);

// Dynamically re-export from whichever backend is available.
// Using a module-level conditional keeps this tree-shakeable.
export { FieldValue } from './mongo-db';

import { db as redisDd, FieldValue as RedisFieldValue } from './redis-db';
import { db as mongoDd, FieldValue as MongoFieldValue } from './mongo-db';

export function db() {
  return hasRedis ? redisDd() : mongoDd();
}

export const _backend = hasRedis ? 'redis' : 'mongodb';
