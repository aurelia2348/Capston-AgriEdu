import { openDB } from 'idb';

const DB_NAME = 'agriEduDB';
const DB_VERSION = 1;
const STORE_NAME = 'setupData';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('name', 'name', { unique: false });
      }
    },
  });
}

export async function saveSetupData(data) {
  const db = await initDB();
  return db.put(STORE_NAME, data);
}

export async function getSetupData(id) {
  const db = await initDB();
  return db.get(STORE_NAME, id);
}

export async function getAllSetupData() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}
