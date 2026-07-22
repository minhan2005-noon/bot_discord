import { REST, Routes } from "discord.js";
import { config, requireEnv } from "./config.js";
import { getCommandData } from "./utils/loadCommands.js";

requireEnv("DISCORD_TOKEN", config.discordToken);
requireEnv("CLIENT_ID", config.clientId);

const commands = await getCommandData();
const rest = new REST({ version: "10" }).setToken(config.discordToken);

if (config.guildId) {
  await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.guildId),
    { body: commands }
  );
  console.log(`Deployed ${commands.length} guild commands to ${config.guildId}`);
} else {
  await rest.put(
    Routes.applicationCommands(config.clientId),
    { body: commands }
  );
  console.log(`Deployed ${commands.length} global commands`);
}
