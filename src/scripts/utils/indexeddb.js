import { openDB } from "idb";

const DB_NAME = "AgriEduDB";
const DB_VERSION = 1;
const SETUP_STORE = "setupState";

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(SETUP_STORE)) {
        const store = db.createObjectStore(SETUP_STORE, { keyPath: "userId" });
        store.createIndex("name", "name", { unique: false });
        store.createIndex("experience", "experience", { unique: false });
        store.createIndex("completedAt", "completedAt", { unique: false });
      }
    };
  });
};

export const hasCompletedSetup = async (userId) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SETUP_STORE, "readonly");
      const store = transaction.objectStore(SETUP_STORE);
      const request = store.get(userId);

      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error checking setup status:", error);
    return false;
  }
};

export const markSetupCompleted = async (userId) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SETUP_STORE, "readwrite");
      const store = transaction.objectStore(SETUP_STORE);
      const request = store.put({
        userId,
        completedAt: new Date().toISOString(),
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error marking setup as completed:", error);
    throw error;
  }
};

export const getSetupCompletionDate = async (userId) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SETUP_STORE, "readonly");
      const store = transaction.objectStore(SETUP_STORE);
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result?.completedAt);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error getting setup completion date:", error);
    return null;
  }
};

export async function saveSetupData(data) {
  try {
    if (!data.userId) {
      throw new Error("userId is required");
    }

    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SETUP_STORE, "readwrite");
      const store = transaction.objectStore(SETUP_STORE);

      const setupData = {
        userId: data.userId,
        name: data.name,
        interest: data.interest,
        experience: data.experience,
        lat: data.lat,
        lon: data.lon,
        completedAt: data.completedAt || new Date().toISOString(),
      };

      const request = store.put(setupData);

      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        console.error("Error saving setup data:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Error in saveSetupData:", error);
    throw error;
  }
}

export async function getSetupData(userId) {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SETUP_STORE, "readonly");
      const store = transaction.objectStore(SETUP_STORE);
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error getting setup data:", error);
    throw error;
  }
}

export async function getAllSetupData() {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SETUP_STORE, "readonly");
      const store = transaction.objectStore(SETUP_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error getting all setup data:", error);
    throw error;
  }
}
