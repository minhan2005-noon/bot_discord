import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member")
    .addUserOption(option =>
      option.setName("user").setDescription("Member to ban").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") || "No reason";

    await interaction.guild.members.ban(user.id, { reason });
    await interaction.reply(`Da ban ${user}. Ly do: ${reason}`);
  }
};
