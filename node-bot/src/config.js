export const config = {
  discordToken: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  aiProvider: (process.env.AI_PROVIDER || (process.env.GROQ_API_KEY ? "groq" : "openai")).toLowerCase(),
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini"
};

export function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Missing ${name}. Add it to .env`);
  }
}
