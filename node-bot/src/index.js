import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { config, requireEnv } from "./config.js";
import { loadCommands } from "./utils/loadCommands.js";
import { loadEvents } from "./utils/loadEvents.js";

requireEnv("DISCORD_TOKEN", config.discordToken);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember]
});

client.commands = new Collection();
client.startedAt = Date.now();

await loadCommands(client);
await loadEvents(client);

await client.login(config.discordToken);
