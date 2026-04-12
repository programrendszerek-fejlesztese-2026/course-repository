const dbModule = require('../db');
const { ObjectId } = require('mongodb');

async function collection() {
  const db = dbModule.getDb();
  return db.collection('ratings');
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

    if (doc.recipeId) {
      const rOid = toObjectId(doc.recipeId);
      if (rOid) doc.recipeId = rOid;
    }
    if (doc.userId) {
      const uOid = toObjectId(doc.userId);
      if (uOid) doc.userId = uOid;
    }

    const res = await col.insertOne(doc);
    const created = await col.findOne({ _id: res.insertedId });
    return toPublic(created);
  },
  async update(id, data) {
    const col = await collection();
    const oid = toObjectId(id);
    if (!oid) return null;

    const patch = { ...data };
    if (patch.recipeId) {
      const rOid = toObjectId(patch.recipeId);
      if (rOid) patch.recipeId = rOid;
      else delete patch.recipeId;
    }
    if (patch.userId) {
      const uOid = toObjectId(patch.userId);
      if (uOid) patch.userId = uOid;
      else delete patch.userId;
    }

    const res = await col.findOneAndUpdate(
      { _id: oid },
      { $set: patch },
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
  async findByRecipeId(recipeId) {
    const col = await collection();
    const rOid = toObjectId(recipeId);
    if (rOid) {
      const docs = await col.find({ recipeId: rOid }).toArray();
      if (docs && docs.length) return docs.map(toPublic);
    }
    // fallback to legacy string recipeId
    const docs2 = await col.find({ recipeId: String(recipeId) }).toArray();
    return docs2.map(toPublic);
  },
  async findByUserId(userId) {
    const col = await collection();
    const uOid = toObjectId(userId);
    if (uOid) {
      const docs = await col.find({ userId: uOid }).toArray();
      if (docs && docs.length) return docs.map(toPublic);
    }
    // fallback to legacy string userId
    const docs2 = await col.find({ userId: String(userId) }).toArray();
    return docs2.map(toPublic);
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
  if (out.recipeId && out.recipeId._bsontype === 'ObjectID') out.recipeId = out.recipeId.toString();
  if (out.userId && out.userId._bsontype === 'ObjectID') out.userId = out.userId.toString();
  return out;
}

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch (e) {
    return null;
  }
}
