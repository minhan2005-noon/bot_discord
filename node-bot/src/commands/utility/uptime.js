import { SlashCommandBuilder } from "discord.js";

function formatUptime(ms) {
  let seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  return [
    days && `${days}d`,
    hours && `${hours}h`,
    minutes && `${minutes}m`,
    `${seconds}s`
  ].filter(Boolean).join(" ");
}

export default {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Show bot uptime"),

  async execute(interaction, client) {
    await interaction.reply(`Bot da chay: \`${formatUptime(Date.now() - client.startedAt)}\``);
  }
};
