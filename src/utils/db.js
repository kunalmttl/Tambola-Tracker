import { openDB } from 'idb';

const DB_NAME = 'tambola-db';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('tickets')) {
        db.createObjectStore('tickets', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('matchConfig')) {
        db.createObjectStore('matchConfig', { keyPath: 'id' });
      }
    },
  });
}

export async function getTickets() {
  const db = await initDB();
  return db.getAll('tickets');
}

export async function addTicket(ticket) {
  const db = await initDB();
  await db.put('tickets', ticket);
  return ticket;
}

export async function updateTicket(id, patch) {
  const db = await initDB();
  const tx = db.transaction('tickets', 'readwrite');
  const existing = await tx.objectStore('tickets').get(id);
  if (!existing) throw new Error('Ticket not found');
  const updated = { ...existing, ...patch };
  await tx.objectStore('tickets').put(updated);
  await tx.done;
  return updated;
}

export async function deleteTicket(id) {
  const db = await initDB();
  await db.delete('tickets', id);
}

export async function saveMatchConfig(config) {
  const db = await initDB();
  // We'll store a single object with id: 'default'
  await db.put('matchConfig', { id: 'default', ...config });
}

export async function getMatchConfig() {
  const db = await initDB();
  return db.get('matchConfig', 'default');
}
