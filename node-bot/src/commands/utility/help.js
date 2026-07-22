import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show command list"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("Advanced Discord Bot")
      .setDescription("Danh sach lenh dang co")
      .addFields(
        { name: "Utility", value: "`/ping`, `/help`, `/serverinfo`, `/userinfo`, `/avatar`, `/uptime`" },
        { name: "Messages", value: "`/say`, `/embed`" },
        { name: "AI", value: "`/ai`" },
        { name: "Moderation", value: "`/clear`, `/timeout`, `/kick`, `/ban`" },
        { name: "Config", value: "`/config log-channel`, `/config welcome-channel`, `/config ticket-category`, `/config view`" },
        { name: "Ticket", value: "`/ticket setup`, `/ticket close`" }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
