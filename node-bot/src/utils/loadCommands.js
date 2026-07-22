import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commandsDir = path.join(__dirname, "..", "commands");

async function findCommandFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findCommandFiles(fullPath));
    } else if (entry.name.endsWith(".js")) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function getCommandModules() {
  const files = await findCommandFiles(commandsDir);
  const modules = [];

  for (const file of files) {
    const mod = await import(pathToFileURL(file));
    if (!mod.default?.data || !mod.default?.execute) {
      throw new Error(`Command file missing data/execute: ${file}`);
    }
    modules.push(mod.default);
  }

  return modules;
}

export async function getCommandData() {
  const commands = await getCommandModules();
  return commands.map(command => command.data.toJSON());
}

export async function loadCommands(client) {
  const commands = await getCommandModules();
  for (const command of commands) {
    client.commands.set(command.data.name, command);
  }
  console.log(`Loaded ${commands.length} commands`);
}
