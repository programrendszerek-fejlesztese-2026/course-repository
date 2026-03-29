const { MongoClient } = require('mongodb');

const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || '27017';
const MONGO_DB = process.env.MONGO_DB || 'receptdb';
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;

let client = null;
let db = null;

function buildUri() {
  if (MONGO_USER && MONGO_PASS) {
    return `mongodb://${encodeURIComponent(MONGO_USER)}:${encodeURIComponent(MONGO_PASS)}@${MONGO_HOST}:${MONGO_PORT}/?authSource=admin`;
  }
  return `mongodb://${MONGO_HOST}:${MONGO_PORT}`;
}

async function connect() {
  if (db) return db;
  const uri = buildUri();
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(MONGO_DB);
  return db;
}

function getDb() {
  if (!db) throw new Error('Database not connected. Call connect() first.');
  return db;
}

async function close() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = { connect, getDb, close };
