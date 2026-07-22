import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Send a custom embed")
    .addStringOption(option =>
      option.setName("title").setDescription("Embed title").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("message").setDescription("Embed message").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("color").setDescription("Hex color, example #5865F2")
    ),

  async execute(interaction) {
    const title = interaction.options.getString("title", true);
    const message = interaction.options.getString("message", true);
    const colorInput = interaction.options.getString("color") || "#5865F2";
    const color = Number.parseInt(colorInput.replace("#", ""), 16);

    if (Number.isNaN(color)) {
      await interaction.reply({ content: "Mau khong hop le. Vi du: `#5865F2`", ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(message)
      .setFooter({ text: `Sent by ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
