const dbModule = require('../db');
const { ObjectId } = require('mongodb');

async function collection() {
  const db = dbModule.getDb(); 
  return db.collection('users');
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
    if (!oid) return null;
    const doc = await col.findOne({ _id: oid });
    return toPublic(doc);
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
  },
  async findByEmail(email) {
    const col = await collection();
    const doc = await col.findOne({ email });
    return toPublic(doc);
  }
};

function toPublic(doc) {
  if (!doc) return null;
  const out = { ...doc };
  out.id = out._id.toString();
  delete out._id;
  return out;
}

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch (e) {
    return null;
  }
}
