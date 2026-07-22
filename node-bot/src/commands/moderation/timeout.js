import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a member")
    .addUserOption(option =>
      option.setName("user").setDescription("Member to timeout").setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("minutes").setDescription("Timeout minutes").setRequired(true).setMinValue(1).setMaxValue(10080)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("user", true);
    const minutes = interaction.options.getInteger("minutes", true);
    const reason = interaction.options.getString("reason") || "No reason";
    const member = await interaction.guild.members.fetch(user.id);

    await member.timeout(minutes * 60 * 1000, reason);
    await interaction.reply(`Da timeout ${user} trong \`${minutes}\` phut. Ly do: ${reason}`);
  }
};
