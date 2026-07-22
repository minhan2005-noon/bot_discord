import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eventsDir = path.join(__dirname, "..", "events");

export async function loadEvents(client) {
  const files = await fs.readdir(eventsDir);
  let count = 0;

  for (const file of files) {
    if (!file.endsWith(".js")) continue;
    const mod = await import(pathToFileURL(path.join(eventsDir, file)));
    const event = mod.default;
    if (!event?.name || !event?.execute) {
      throw new Error(`Event file missing name/execute: ${file}`);
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    count++;
  }

  console.log(`Loaded ${count} events`);
}
