import { EmbedBuilder, Events } from "discord.js";
import { getGuildConfig } from "../storage/database.js";

export default {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const config = await getGuildConfig(member.guild.id);
    if (!config.welcomeChannelId) return;

    const channel = await member.guild.channels.fetch(config.welcomeChannelId).catch(() => null);
    if (!channel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("Welcome!")
      .setDescription(`Chao mung ${member} den voi **${member.guild.name}**.`)
      .setThumbnail(member.displayAvatarURL())
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
};
