import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Make the bot say something")
    .addStringOption(option =>
      option.setName("message").setDescription("Message to send").setRequired(true)
    ),

  async execute(interaction) {
    const message = interaction.options.getString("message", true);
    await interaction.reply(message);
  }
};
