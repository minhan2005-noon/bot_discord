import { EmbedBuilder, Events } from "discord.js";
import { getGuildConfig } from "../storage/database.js";

export default {
  name: Events.MessageDelete,
  async execute(message) {
    if (!message.guild || message.author?.bot) return;

    const config = await getGuildConfig(message.guild.id);
    if (!config.logChannelId) return;

    const channel = await message.guild.channels.fetch(config.logChannelId).catch(() => null);
    if (!channel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle("Message Deleted")
      .addFields(
        { name: "Author", value: message.author ? `${message.author}` : "Unknown", inline: true },
        { name: "Channel", value: `${message.channel}`, inline: true },
        { name: "Content", value: message.content?.slice(0, 1000) || "*No text content*" }
      )
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
};
