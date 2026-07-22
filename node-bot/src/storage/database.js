import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "..", "data");
const dbPath = path.join(dataDir, "db.json");

const defaultDb = {
  guilds: {},
  tickets: {}
};

async function ensureDb() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify(defaultDb, null, 2));
  }
}

export async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(dbPath, "utf8");
  return JSON.parse(raw);
}

export async function writeDb(db) {
  await ensureDb();
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

export async function getGuildConfig(guildId) {
  const db = await readDb();
  db.guilds[guildId] ||= {};
  await writeDb(db);
  return db.guilds[guildId];
}

export async function updateGuildConfig(guildId, patch) {
  const db = await readDb();
  db.guilds[guildId] = {
    ...(db.guilds[guildId] || {}),
    ...patch
  };
  await writeDb(db);
  return db.guilds[guildId];
}
