import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Ticket system")
    .addSubcommand(subcommand =>
      subcommand
        .setName("setup")
        .setDescription("Create ticket panel")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("close")
        .setDescription("Close this ticket")
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "setup") {
      if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
        await interaction.reply({ content: "Ban can quyen Manage Server de setup ticket.", ephemeral: true });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle("Support Ticket")
        .setDescription("Bam nut ben duoi de tao ticket ho tro.")
        .setTimestamp();

      const button = new ButtonBuilder()
        .setCustomId("ticket:create")
        .setLabel("Create Ticket")
        .setStyle(ButtonStyle.Primary);

      await interaction.reply({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(button)]
      });
      return;
    }

    if (!interaction.channel?.name?.startsWith("ticket-")) {
      await interaction.reply({ content: "Lenh nay chi dung trong ticket channel.", ephemeral: true });
      return;
    }

    await interaction.reply("Ticket se dong sau 3 giay...");
    setTimeout(() => interaction.channel.delete().catch(console.error), 3000);
  }
};
