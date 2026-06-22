/**
 * Firestore-compatible database API backed by Upstash Redis.
 * Drop-in replacement that requires no GCP credentials.
 */

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL  || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';

// ── Sentinel for FieldValue.increment ──────────────────────────────────────
class IncrementValue {
  constructor(public n: number) {}
}

export const FieldValue = {
  increment: (n: number) => new IncrementValue(n),
};

// ── Low-level Redis call ────────────────────────────────────────────────────
async function rc<T = unknown>(...args: (string | number)[]): Promise<T> {
  if (!REDIS_URL || !REDIS_TOKEN) throw new Error('Upstash Redis env vars not set');
  const res = await fetch(REDIS_URL, {
    method:  'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(args),
  });
  const json = await res.json() as { result: T; error?: string };
  if (json.error) throw new Error(`Redis error: ${json.error}`);
  return json.result;
}

// ── Key helpers ─────────────────────────────────────────────────────────────
const docKey  = (col: string, id: string) => `db2:${col}:doc:${id}`;
const zsetKey = (col: string)             => `db2:${col}:zset`;

// ── DocumentSnapshot ────────────────────────────────────────────────────────
export class DocumentSnapshot {
  readonly id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _data: Record<string, any> | null;
  readonly ref: DocumentReference;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(id: string, data: Record<string, any> | null, col: string) {
    this.id    = id;
    this._data = data;
    this.ref   = new DocumentReference(id, col);
  }

  get exists() { return this._data !== null; }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data(): Record<string, any> | undefined { return this._data ?? undefined; }
}

// ── DocumentReference ───────────────────────────────────────────────────────
export class DocumentReference {
  readonly id: string;
  private col: string;

  constructor(id: string, col: string) {
    this.id  = id;
    this.col = col;
  }

  async get(): Promise<DocumentSnapshot> {
    const raw = await rc<string | null>('GET', docKey(this.col, this.id));
    if (!raw) return new DocumentSnapshot(this.id, null, this.col);
    try {
      return new DocumentSnapshot(this.id, JSON.parse(raw), this.col);
    } catch {
      return new DocumentSnapshot(this.id, null, this.col);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async set(data: Record<string, any>, options?: { merge?: boolean }): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let toStore: Record<string, any> = {};

    if (options?.merge) {
      const snap = await this.get();
      if (snap.exists) toStore = { ...(snap.data() ?? {}) };
    }

    // Apply fields, resolving FieldValue.increment sentinels
    for (const [k, v] of Object.entries(data)) {
      if (v instanceof IncrementValue) {
        toStore[k] = Number(toStore[k] ?? 0) + v.n;
      } else {
        toStore[k] = v;
      }
    }

    const score = Date.now();
    await rc('SET', docKey(this.col, this.id), JSON.stringify(toStore));
    await rc('ZADD', zsetKey(this.col), score, this.id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(data: Record<string, any>): Promise<void> {
    const snap = await this.get();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing: Record<string, any> = snap.exists ? (snap.data() ?? {}) : {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merged: Record<string, any> = { ...existing };

    for (const [k, v] of Object.entries(data)) {
      if (v instanceof IncrementValue) {
        merged[k] = Number(existing[k] ?? 0) + v.n;
      } else {
        merged[k] = v;
      }
    }

    await rc('SET', docKey(this.col, this.id), JSON.stringify(merged));
    // Keep existing zset entry (don't update score so insertion order is preserved)
    await rc('ZADD', zsetKey(this.col), 'NX', Date.now(), this.id);
  }

  async delete(): Promise<void> {
    await rc('DEL', docKey(this.col, this.id));
    await rc('ZREM', zsetKey(this.col), this.id);
  }
}

// ── QueryDocumentSnapshot (a doc returned inside a query result) ─────────────
class QueryDocumentSnapshot {
  readonly id: string;
  readonly ref: DocumentReference;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _data: Record<string, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(id: string, data: Record<string, any>, col: string) {
    this.id    = id;
    this._data = data;
    this.ref   = new DocumentReference(id, col);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data(): Record<string, any> { return this._data; }
}

// ── QuerySnapshot ────────────────────────────────────────────────────────────
class QuerySnapshot {
  readonly docs: QueryDocumentSnapshot[];
  readonly size: number;
  readonly empty: boolean;

  constructor(docs: QueryDocumentSnapshot[]) {
    this.docs  = docs;
    this.size  = docs.length;
    this.empty = docs.length === 0;
  }
}

// ── WhereClause ──────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface WhereClause { field: string; op: string; value: any }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyWhere(data: Record<string, any>, clauses: WhereClause[]): boolean {
  return clauses.every(({ field, op, value }) => {
    const v = data[field];
    switch (op) {
      case '==': return v === value;
      case '!=': return v !== value;
      case '>=': return v >= value;
      case '<=': return v <= value;
      case '>':  return v >  value;
      case '<':  return v <  value;
      default:   return true;
    }
  });
}

// ── QueryBuilder ─────────────────────────────────────────────────────────────
class QueryBuilder {
  private _wheres:  WhereClause[] = [];
  private _orderBy: { field: string; dir: string } | null = null;
  private _limit:   number = 5000;
  private col: string;

  constructor(col: string) { this.col = col; }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where(field: string, op: string, value: any): this {
    this._wheres.push({ field, op, value });
    return this;
  }

  orderBy(field: string, dir: string = 'asc'): this {
    this._orderBy = { field, dir };
    return this;
  }

  limit(n: number): this {
    this._limit = n;
    return this;
  }

  async get(): Promise<QuerySnapshot> {
    // 1. Fetch all IDs from sorted set (most recently inserted first)
    const ids = await rc<string[]>('ZREVRANGE', zsetKey(this.col), 0, -1);
    if (!ids || ids.length === 0) return new QuerySnapshot([]);

    // 2. Batch-fetch all documents with MGET
    const keys = ids.map(id => docKey(this.col, id));
    const rawVals = await rc<(string | null)[]>('MGET', ...keys);

    const docs: QueryDocumentSnapshot[] = [];
    for (let i = 0; i < ids.length; i++) {
      const raw = rawVals[i];
      if (!raw) continue;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = JSON.parse(raw) as Record<string, any>;
        if (applyWhere(data, this._wheres)) {
          docs.push(new QueryDocumentSnapshot(ids[i], data, this.col));
        }
      } catch { /* skip malformed */ }
    }

    // 3. Sort by orderBy field if specified
    if (this._orderBy) {
      const { field, dir } = this._orderBy;
      docs.sort((a, b) => {
        const va = a.data()[field];
        const vb = b.data()[field];
        if (va == null && vb == null) return 0;
        if (va == null) return 1;
        if (vb == null) return -1;
        if (va < vb) return dir === 'desc' ? 1  : -1;
        if (va > vb) return dir === 'desc' ? -1 : 1;
        return 0;
      });
    }

    // 4. Apply limit
    return new QuerySnapshot(docs.slice(0, this._limit));
  }
}

// ── CollectionReference ──────────────────────────────────────────────────────
class CollectionReference {
  private name: string;

  constructor(name: string) { this.name = name; }

  doc(id: string): DocumentReference {
    return new DocumentReference(id, this.name);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where(field: string, op: string, value: any): QueryBuilder {
    return new QueryBuilder(this.name).where(field, op, value);
  }

  orderBy(field: string, dir: string = 'asc'): QueryBuilder {
    return new QueryBuilder(this.name).orderBy(field, dir);
  }

  limit(n: number): QueryBuilder {
    return new QueryBuilder(this.name).limit(n);
  }

  async get(): Promise<QuerySnapshot> {
    return new QueryBuilder(this.name).get();
  }
}

// ── Public API ───────────────────────────────────────────────────────────────
export function db() {
  return {
    collection: (name: string) => new CollectionReference(name),
  };
}
