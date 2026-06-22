import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';

export { FieldValue };

let _db: Firestore | null = null;

export function db(): Firestore {
  if (_db) return _db;
  if (!getApps().length) {
    const key = process.env.GCP_SERVICE_ACCOUNT_KEY;
    if (!key) throw new Error('GCP_SERVICE_ACCOUNT_KEY is not set');
    initializeApp({ credential: cert(JSON.parse(key)) });
  }
  _db = getFirestore();
  return _db;
}

export function docToObj<T>(snap: FirebaseFirestore.DocumentSnapshot): (T & { _id: string }) | null {
  if (!snap.exists) return null;
  return { _id: snap.id, ...(snap.data() as T) };
}

export function snapshotToArr<T>(snap: FirebaseFirestore.QuerySnapshot): (T & { _id: string })[] {
  return snap.docs.map(d => ({ _id: d.id, ...(d.data() as T) }));
}
