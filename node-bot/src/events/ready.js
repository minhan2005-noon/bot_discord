import { ActivityType, Events } from "discord.js";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    client.user.setPresence({
      activities: [{ name: "/help", type: ActivityType.Playing }],
      status: "online"
    });
    console.log(`Bot online as ${client.user.tag}`);
  }
};
