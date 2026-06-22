/**
 * Database layer — backed by Upstash Redis (no GCP credentials needed).
 * All routes import { db, FieldValue } from '@/lib/firestore' unchanged.
 */
export { db, FieldValue } from '@/lib/redis-db';
