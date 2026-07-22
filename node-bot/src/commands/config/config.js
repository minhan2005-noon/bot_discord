import {
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder
} from "discord.js";
import { getGuildConfig, updateGuildConfig } from "../../storage/database.js";

export default {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure this server")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
      subcommand
        .setName("log-channel")
        .setDescription("Set log channel")
        .addChannelOption(option =>
          option
            .setName("channel")
            .setDescription("Log channel")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("welcome-channel")
        .setDescription("Set welcome channel")
        .addChannelOption(option =>
          option
            .setName("channel")
            .setDescription("Welcome channel")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("ticket-category")
        .setDescription("Set ticket category")
        .addChannelOption(option =>
          option
            .setName("category")
            .setDescription("Ticket category")
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("view")
        .setDescription("View current config")
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "log-channel") {
      const channel = interaction.options.getChannel("channel", true);
      await updateGuildConfig(interaction.guild.id, { logChannelId: channel.id });
      await interaction.reply({ content: `Log channel da dat thanh ${channel}.`, ephemeral: true });
      return;
    }

    if (subcommand === "welcome-channel") {
      const channel = interaction.options.getChannel("channel", true);
      await updateGuildConfig(interaction.guild.id, { welcomeChannelId: channel.id });
      await interaction.reply({ content: `Welcome channel da dat thanh ${channel}.`, ephemeral: true });
      return;
    }

    if (subcommand === "ticket-category") {
      const category = interaction.options.getChannel("category", true);
      await updateGuildConfig(interaction.guild.id, { ticketCategoryId: category.id });
      await interaction.reply({ content: `Ticket category da dat thanh **${category.name}**.`, ephemeral: true });
      return;
    }

    const config = await getGuildConfig(interaction.guild.id);
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("Server Config")
      .addFields(
        { name: "Log Channel", value: config.logChannelId ? `<#${config.logChannelId}>` : "Not set", inline: true },
        { name: "Welcome Channel", value: config.welcomeChannelId ? `<#${config.welcomeChannelId}>` : "Not set", inline: true },
        { name: "Ticket Category", value: config.ticketCategoryId ? `<#${config.ticketCategoryId}>` : "Not set", inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
