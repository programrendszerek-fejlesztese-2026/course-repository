const dbModule = require('../db');
const { ObjectId } = require('mongodb');

async function collection() {
  const db = dbModule.getDb();
  return db.collection('recipes');
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

    if (doc.categoryId) {
      const cOid = toObjectId(doc.categoryId);
      if (cOid) doc.categoryId = cOid;
    }
    if (doc.createdBy) {
      const uOid = toObjectId(doc.createdBy);
      if (uOid) doc.createdBy = uOid;
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
    if (patch.categoryId) {
      const cOid = toObjectId(patch.categoryId);
      if (cOid) patch.categoryId = cOid;
      else delete patch.categoryId;
    }
    if (patch.createdBy) {
      const uOid = toObjectId(patch.createdBy);
      if (uOid) patch.createdBy = uOid;
      else delete patch.createdBy;
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
  async findByCategoryId(categoryId) {
    const col = await collection();
    const cOid = toObjectId(categoryId);
    if (cOid) {
      const docs = await col.find({ categoryId: cOid }).toArray();
      if (docs && docs.length) return docs.map(toPublic);
    }
    // fallback to legacy string categoryId
    const docs2 = await col.find({ categoryId: String(categoryId) }).toArray();
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
  if (out.categoryId && out.categoryId._bsontype === 'ObjectID') out.categoryId = out.categoryId.toString();
  if (out.createdBy && out.createdBy._bsontype === 'ObjectID') out.createdBy = out.createdBy.toString();
  return out;
}

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch (e) {
    return null;
  }
}
