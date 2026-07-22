import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Events,
  PermissionFlagsBits
} from "discord.js";
import { getGuildConfig } from "../storage/database.js";

async function handleTicketCreate(interaction) {
  if (!interaction.guild) {
    await interaction.reply({ content: "Lenh nay chi dung trong server.", ephemeral: true });
    return;
  }

  const config = await getGuildConfig(interaction.guild.id);
  const category = config.ticketCategoryId || null;
  const channelName = `ticket-${interaction.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 90);

  const existing = interaction.guild.channels.cache.find(channel =>
    channel.name === channelName && channel.type === ChannelType.GuildText
  );

  if (existing) {
    await interaction.reply({ content: `Ban da co ticket: ${existing}`, ephemeral: true });
    return;
  }

  const channel = await interaction.guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: category,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.everyone,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory
        ]
      },
      {
        id: interaction.client.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.ReadMessageHistory
        ]
      }
    ]
  });

  const closeButton = new ButtonBuilder()
    .setCustomId("ticket:close")
    .setLabel("Close Ticket")
    .setStyle(ButtonStyle.Danger);

  await channel.send({
    content: `${interaction.user}, ticket cua ban da duoc tao. Hay mo ta van de can ho tro.`,
    components: [new ActionRowBuilder().addComponents(closeButton)]
  });

  await interaction.reply({ content: `Da tao ticket: ${channel}`, ephemeral: true });
}

async function handleTicketClose(interaction) {
  if (!interaction.channel?.name?.startsWith("ticket-")) {
    await interaction.reply({ content: "Day khong phai ticket channel.", ephemeral: true });
    return;
  }

  await interaction.reply("Ticket se dong sau 3 giay...");
  setTimeout(() => interaction.channel.delete().catch(console.error), 3000);
}

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isButton()) {
      if (interaction.customId === "ticket:create") return handleTicketCreate(interaction);
      if (interaction.customId === "ticket:close") return handleTicketClose(interaction);
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Command failed: ${interaction.commandName}`, error);
      const message = "Co loi khi chay lenh nay.";

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content: message, ephemeral: true });
      } else {
        await interaction.reply({ content: message, ephemeral: true });
      }
    }
  }
};
