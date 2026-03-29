
const dbModule = require('../db');
const { ObjectId } = require('mongodb');

async function collection() {
  const db = dbModule.getDb();
  return db.collection('categories');
}

module.exports = {
  async findAll() {
    const col = await collection();
    const docs = await col.find({}).toArray();
    return docs.map(toPublic);
  },
  async findById(id) {
    const col = await collection();
    const oid = toObjectId(id);
    if (oid) {
      const doc = await col.findOne({ _id: oid });
      if (doc) return toPublic(doc);
    }
    // fallback to legacy string `id` field
    const doc2 = await col.findOne({ id: String(id) });
    return toPublic(doc2);
  },
  async create(data) {
    const col = await collection();
    const now = new Date();
    const doc = { ...data, createdAt: data.createdAt || now };
    const res = await col.insertOne(doc);
    const created = await col.findOne({ _id: res.insertedId });
    return toPublic(created);
  },
  async update(id, data) {
    const col = await collection();
    const oid = toObjectId(id);
    if (!oid) return null;
    const res = await col.findOneAndUpdate(
      { _id: oid },
      { $set: data },
      { returnDocument: 'after' }
    );
    return toPublic(res.value);
  },
  async delete(id) {
    const col = await collection();
    const oid = toObjectId(id);
    if (!oid) return false;
    const res = await col.deleteOne({ _id: oid });
    return res.deletedCount > 0;
  }
};

function toPublic(doc) {
  if (!doc) return null;
  const out = { ...doc };
  if (out._id) {
    out.id = out._id.toString();
    delete out._id;
  } else if (out.id) {
    out.id = String(out.id);
  }
  return out;
}

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch (e) {
    return null;
  }
}
