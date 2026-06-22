/**
 * Firestore-compatible database API backed by MongoDB (native driver).
 * Uses MONGODB_URI which is already set in Vercel.
 */
import { MongoClient, Collection as MongoCollection, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME     = process.env.MONGODB_DB || 'ylootrips';

// ── Connection singleton ─────────────────────────────────────────────────────
let _client: MongoClient | null = null;
let _db: Db | null = null;

async function getDb(): Promise<Db> {
  if (_db) return _db;
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not set');
  if (!_client) {
    _client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 8000,
    });
    await _client.connect();
  }
  _db = _client.db(DB_NAME);
  return _db;
}

// ── FieldValue ───────────────────────────────────────────────────────────────
class IncrementValue {
  constructor(public n: number) {}
}

export const FieldValue = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  increment: (n: number) => new IncrementValue(n) as any,
};

// ── DocumentSnapshot ─────────────────────────────────────────────────────────
export class DocumentSnapshot {
  readonly id: string;
  readonly ref: DocumentReference;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _data: Record<string, any> | null;

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

// ── DocumentReference ────────────────────────────────────────────────────────
export class DocumentReference {
  readonly id: string;
  private col: string;

  constructor(id: string, col: string) {
    this.id  = id;
    this.col = col;
  }

  private async mongo(): Promise<MongoCollection> {
    const d = await getDb();
    return d.collection(this.col);
  }

  async get(): Promise<DocumentSnapshot> {
    const c = await this.mongo();
    const doc = await c.findOne({ _docId: this.id });
    if (!doc) return new DocumentSnapshot(this.id, null, this.col);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, _docId, ...rest } = doc;
    return new DocumentSnapshot(this.id, rest, this.col);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async set(data: Record<string, any>, options?: { merge?: boolean }): Promise<void> {
    const c = await this.mongo();
    // Resolve FieldValue.increment sentinels
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const $inc: Record<string, any> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const $set: Record<string, any> = { _docId: this.id };
    let hasInc = false;

    for (const [k, v] of Object.entries(data)) {
      if (v instanceof IncrementValue) {
        $inc[k] = v.n;
        hasInc = true;
      } else {
        $set[k] = v;
      }
    }

    const update: Record<string, unknown> = { $set };
    if (hasInc) update.$inc = $inc;

    if (options?.merge) {
      await c.updateOne({ _docId: this.id }, update, { upsert: true });
    } else {
      // Replace entire document (non-merge set)
      await c.replaceOne(
        { _docId: this.id },
        { _docId: this.id, ...Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, v instanceof IncrementValue ? 0 : v])
          )
        },
        { upsert: true }
      );
      // Then apply increments if any
      if (hasInc) await c.updateOne({ _docId: this.id }, { $inc });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(data: Record<string, any>): Promise<void> {
    const c = await this.mongo();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const $inc: Record<string, any> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const $set: Record<string, any> = {};
    let hasInc = false;

    for (const [k, v] of Object.entries(data)) {
      if (v instanceof IncrementValue) {
        $inc[k] = v.n;
        hasInc = true;
      } else {
        $set[k] = v;
      }
    }

    const update: Record<string, unknown> = {};
    if (Object.keys($set).length) update.$set = $set;
    if (hasInc) update.$inc = $inc;

    await c.updateOne({ _docId: this.id }, update);
  }

  async delete(): Promise<void> {
    const c = await this.mongo();
    await c.deleteOne({ _docId: this.id });
  }
}

// ── QueryDocumentSnapshot ────────────────────────────────────────────────────
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

// ── QueryBuilder ─────────────────────────────────────────────────────────────
interface WhereClause { field: string; op: string; value: unknown }

class QueryBuilder {
  private _wheres:  WhereClause[] = [];
  private _orderBy: { field: string; dir: number } | null = null;
  private _limit:   number = 5000;
  private col: string;

  constructor(col: string) { this.col = col; }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where(field: string, op: string, value: any): this {
    this._wheres.push({ field, op, value });
    return this;
  }

  orderBy(field: string, dir: string = 'asc'): this {
    this._orderBy = { field, dir: dir === 'desc' ? -1 : 1 };
    return this;
  }

  limit(n: number): this {
    this._limit = n;
    return this;
  }

  async get(): Promise<QuerySnapshot> {
    const d = await getDb();
    const c = d.collection(this.col);

    // Build MongoDB filter from where clauses
    const filter: Record<string, unknown> = {};
    for (const { field, op, value } of this._wheres) {
      switch (op) {
        case '==': filter[field] = value; break;
        case '!=': filter[field] = { $ne: value }; break;
        case '>=': filter[field] = { ...filter[field] as object, $gte: value }; break;
        case '<=': filter[field] = { ...filter[field] as object, $lte: value }; break;
        case '>':  filter[field] = { ...filter[field] as object, $gt:  value }; break;
        case '<':  filter[field] = { ...filter[field] as object, $lt:  value }; break;
      }
    }

    const sort = this._orderBy
      ? { [this._orderBy.field]: this._orderBy.dir }
      : { _id: -1 };

    const results = await c.find(filter).sort(sort as Record<string, 1 | -1>).limit(this._limit).toArray();

    const docs = results.map(doc => {
      const { _id, _docId, ...rest } = doc;
      const id = (_docId as string) || String(_id);
      return new QueryDocumentSnapshot(id, rest, this.col);
    });

    return new QuerySnapshot(docs);
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

  orderBy(field: string, dir?: string): QueryBuilder {
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
