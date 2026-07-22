import { SlashCommandBuilder } from "discord.js";
import { askAI, hasAI } from "../../services/aiService.js";
import { splitMessage } from "../../utils/splitMessage.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ai")
    .setDescription("Ask AI a question")
    .addStringOption(option =>
      option.setName("prompt").setDescription("Your question").setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName("public").setDescription("Show the answer publicly")
    ),

  async execute(interaction) {
    if (!hasAI()) {
      await interaction.reply({
        content: "Chua co AI key trong `.env`. Dat `GROQ_API_KEY` hoac `OPENAI_API_KEY`.",
        ephemeral: true
      });
      return;
    }

    const prompt = interaction.options.getString("prompt", true);
    const isPublic = interaction.options.getBoolean("public") || false;

    await interaction.deferReply({ ephemeral: !isPublic });

    try {
      const answer = await askAI(prompt);
      const chunks = splitMessage(answer);
      await interaction.editReply(chunks[0]);

      for (const chunk of chunks.slice(1)) {
        await interaction.followUp({ content: chunk, ephemeral: !isPublic });
      }
    } catch (error) {
      console.error("AI command failed", error);
      await interaction.editReply("AI API loi, het quota, hoac key/model khong hop le.");
    }
  }
};
