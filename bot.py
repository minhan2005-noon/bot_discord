import logging
import os
import asyncio
from datetime import UTC, datetime

import certifi

os.environ.setdefault("SSL_CERT_FILE", certifi.where())
os.environ.setdefault("REQUESTS_CA_BUNDLE", certifi.where())

import discord
from openai import APIError, APIStatusError, AsyncOpenAI, RateLimitError
from dotenv import load_dotenv


load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

TOKEN = os.getenv("DISCORD_TOKEN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-5.6-terra")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
AI_PROVIDER = os.getenv("AI_PROVIDER", "groq" if GROQ_API_KEY else "openai").lower()
BOT_COLOR = discord.Color.blurple()
STARTED_AT = datetime.now(UTC)
MAX_DISCORD_MESSAGE_LENGTH = 2000

intents = discord.Intents.default()


class DiscordBot(discord.Client):
    def __init__(self):
        super().__init__(intents=intents)
        self.tree = discord.app_commands.CommandTree(self)

    async def setup_hook(self):
        try:
            await asyncio.wait_for(self.tree.sync(), timeout=20)
            logging.info("Slash commands synced")
        except TimeoutError:
            logging.warning("Slash command sync timed out; commands may appear after the next restart")


bot = DiscordBot()

if AI_PROVIDER == "groq" and GROQ_API_KEY:
    ai_client = AsyncOpenAI(
        api_key=GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1",
    )
    AI_MODEL = GROQ_MODEL
elif OPENAI_API_KEY:
    ai_client = AsyncOpenAI(api_key=OPENAI_API_KEY)
    AI_MODEL = OPENAI_MODEL
else:
    ai_client = None
    AI_MODEL = ""


def make_embed(title: str, description: str | None = None) -> discord.Embed:
    return discord.Embed(
        title=title,
        description=description,
        color=BOT_COLOR,
        timestamp=datetime.now(UTC),
    )


def format_uptime() -> str:
    seconds = int((datetime.now(UTC) - STARTED_AT).total_seconds())
    days, seconds = divmod(seconds, 86400)
    hours, seconds = divmod(seconds, 3600)
    minutes, seconds = divmod(seconds, 60)

    parts = []
    if days:
        parts.append(f"{days}d")
    if hours:
        parts.append(f"{hours}h")
    if minutes:
        parts.append(f"{minutes}m")
    parts.append(f"{seconds}s")
    return " ".join(parts)


def split_discord_message(text: str, limit: int = MAX_DISCORD_MESSAGE_LENGTH) -> list[str]:
    if len(text) <= limit:
        return [text]

    chunks = []
    remaining = text
    while remaining:
        if len(remaining) <= limit:
            chunks.append(remaining)
            break

        split_at = remaining.rfind("\n", 0, limit)
        if split_at < limit // 2:
            split_at = remaining.rfind(" ", 0, limit)
        if split_at < limit // 2:
            split_at = limit

        chunks.append(remaining[:split_at].strip())
        remaining = remaining[split_at:].strip()

    return chunks


async def ask_ai(prompt: str) -> str:
    if ai_client is None:
        raise RuntimeError("Missing AI API key")

    response = await ai_client.responses.create(
        model=AI_MODEL,
        input=[
            {
                "role": "system",
                "content": (
                    "You are a helpful Discord bot assistant. "
                    "Answer in Vietnamese by default, keep responses concise, "
                    "and use Markdown that renders well in Discord."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        max_output_tokens=800,
    )
    return response.output_text.strip() or "AI khong tra ve noi dung."


@bot.event
async def on_ready():
    await bot.change_presence(
        activity=discord.Game(name="/help"),
        status=discord.Status.online,
    )
    logging.info("Bot online as %s (ID: %s)", bot.user, bot.user.id)


@bot.tree.command(name="ping", description="Check bot latency")
async def ping(interaction: discord.Interaction):
    latency_ms = round(bot.latency * 1000)
    await interaction.response.send_message(f"Pong! `{latency_ms}ms`")


@bot.tree.command(name="help", description="Show all bot commands")
async def help_command(interaction: discord.Interaction):
    embed = make_embed("Help Embed Bot", "Danh sach lenh dang co:")
    embed.add_field(name="/ping", value="Kiem tra bot co online khong.", inline=False)
    embed.add_field(name="/embed", value="Gui tin nhan embed dep.", inline=False)
    embed.add_field(name="/say", value="Bot gui tin nhan thuong.", inline=False)
    embed.add_field(name="/clear", value="Xoa tin nhan trong kenh.", inline=False)
    embed.add_field(name="/userinfo", value="Xem thong tin thanh vien.", inline=False)
    embed.add_field(name="/serverinfo", value="Xem thong tin server.", inline=False)
    embed.add_field(name="/avatar", value="Lay avatar cua thanh vien.", inline=False)
    embed.add_field(name="/uptime", value="Xem bot da chay bao lau.", inline=False)
    embed.add_field(name="/ai", value="Hoi AI va nhan cau tra loi.", inline=False)
    await interaction.response.send_message(embed=embed)


@bot.tree.command(name="ai", description="Ask AI a question")
@discord.app_commands.describe(
    prompt="Question or request for AI",
    public="Show the answer publicly in this channel",
)
async def ai(interaction: discord.Interaction, prompt: str, public: bool = False):
    if ai_client is None:
        await interaction.response.send_message(
            "Chua co AI key trong `.env`. Dat `GROQ_API_KEY` hoac `OPENAI_API_KEY` roi restart bot.",
            ephemeral=True,
        )
        return

    await interaction.response.defer(ephemeral=not public, thinking=True)

    try:
        answer = await ask_ai(prompt)
    except RateLimitError:
        await interaction.followup.send(
            "AI provider dang bao rate limit/quota. Kiem tra billing/quota hoac thu lai sau.",
            ephemeral=True,
        )
        return
    except APIStatusError as error:
        logging.exception("AI API returned an error", exc_info=error)
        await interaction.followup.send(
            f"AI API loi `{error.status_code}`. Xem `bot.log` de biet chi tiet.",
            ephemeral=True,
        )
        return
    except APIError as error:
        logging.exception("AI API request failed", exc_info=error)
        await interaction.followup.send(
            "Khong ket noi duoc AI API. Xem `bot.log` de biet chi tiet.",
            ephemeral=True,
        )
        return
    except Exception as error:
        logging.exception("AI command failed", exc_info=error)
        await interaction.followup.send(
            "Co loi khi xu ly lenh AI. Xem `bot.log` de biet chi tiet.",
            ephemeral=True,
        )
        return

    chunks = split_discord_message(answer)
    await interaction.followup.send(chunks[0], ephemeral=not public)
    for chunk in chunks[1:]:
        await interaction.followup.send(chunk, ephemeral=not public)


@bot.tree.command(name="embed", description="Send a custom embed")
@discord.app_commands.describe(
    title="Embed title",
    message="Embed message",
    color_hex="Optional hex color, example: #5865F2",
)
async def embed_command(
    interaction: discord.Interaction,
    title: str,
    message: str,
    color_hex: str | None = None,
):
    color = BOT_COLOR
    if color_hex:
        clean_hex = color_hex.strip().removeprefix("#")
        try:
            color = discord.Color(int(clean_hex, 16))
        except ValueError:
            await interaction.response.send_message(
                "Mau khong hop le. Vi du dung: `#5865F2`",
                ephemeral=True,
            )
            return

    embed = discord.Embed(
        title=title,
        description=message,
        color=color,
        timestamp=datetime.now(UTC),
    )
    embed.set_footer(text=f"Sent by {interaction.user.display_name}")
    await interaction.response.send_message(embed=embed)


@bot.tree.command(name="say", description="Make the bot send a normal message")
@discord.app_commands.describe(message="Message to send")
async def say(interaction: discord.Interaction, message: str):
    await interaction.response.send_message(message)


@bot.tree.command(name="clear", description="Delete messages in this channel")
@discord.app_commands.describe(amount="Number of messages to delete, 1-100")
@discord.app_commands.checks.has_permissions(manage_messages=True)
async def clear(interaction: discord.Interaction, amount: int):
    if amount < 1 or amount > 100:
        await interaction.response.send_message(
            "So luong phai tu `1` den `100`.",
            ephemeral=True,
        )
        return

    if not isinstance(interaction.channel, discord.TextChannel):
        await interaction.response.send_message(
            "Lenh nay chi dung trong text channel.",
            ephemeral=True,
        )
        return

    await interaction.response.defer(ephemeral=True)
    deleted = await interaction.channel.purge(limit=amount)
    await interaction.followup.send(f"Da xoa `{len(deleted)}` tin nhan.", ephemeral=True)


@clear.error
async def clear_error(interaction: discord.Interaction, error: discord.app_commands.AppCommandError):
    if isinstance(error, discord.app_commands.MissingPermissions):
        await interaction.response.send_message(
            "Ban can quyen `Manage Messages` de dung lenh nay.",
            ephemeral=True,
        )
        return

    logging.exception("Clear command failed", exc_info=error)
    if not interaction.response.is_done():
        await interaction.response.send_message("Co loi khi xoa tin nhan.", ephemeral=True)


@bot.tree.command(name="userinfo", description="Show user information")
@discord.app_commands.describe(member="Member to inspect")
async def userinfo(
    interaction: discord.Interaction,
    member: discord.Member | None = None,
):
    member = member or interaction.user
    embed = make_embed(f"User Info: {member.display_name}")
    embed.set_thumbnail(url=member.display_avatar.url)
    embed.add_field(name="Username", value=str(member), inline=True)
    embed.add_field(name="User ID", value=str(member.id), inline=True)
    embed.add_field(name="Joined", value=discord.utils.format_dt(member.joined_at, "R"), inline=True)
    embed.add_field(name="Created", value=discord.utils.format_dt(member.created_at, "R"), inline=True)
    embed.add_field(name="Top Role", value=member.top_role.mention, inline=True)
    await interaction.response.send_message(embed=embed)


@bot.tree.command(name="serverinfo", description="Show server information")
async def serverinfo(interaction: discord.Interaction):
    guild = interaction.guild
    if guild is None:
        await interaction.response.send_message(
            "Lenh nay chi dung trong server.",
            ephemeral=True,
        )
        return

    embed = make_embed(f"Server Info: {guild.name}")
    if guild.icon:
        embed.set_thumbnail(url=guild.icon.url)
    embed.add_field(name="Server ID", value=str(guild.id), inline=True)
    embed.add_field(name="Owner", value=guild.owner.mention if guild.owner else "Unknown", inline=True)
    embed.add_field(name="Members", value=str(guild.member_count), inline=True)
    embed.add_field(name="Channels", value=str(len(guild.channels)), inline=True)
    embed.add_field(name="Roles", value=str(len(guild.roles)), inline=True)
    embed.add_field(name="Created", value=discord.utils.format_dt(guild.created_at, "R"), inline=True)
    await interaction.response.send_message(embed=embed)


@bot.tree.command(name="avatar", description="Show a user's avatar")
@discord.app_commands.describe(member="Member avatar to show")
async def avatar(
    interaction: discord.Interaction,
    member: discord.Member | None = None,
):
    member = member or interaction.user
    embed = make_embed(f"Avatar: {member.display_name}")
    embed.set_image(url=member.display_avatar.url)
    await interaction.response.send_message(embed=embed)


@bot.tree.command(name="uptime", description="Show bot uptime")
async def uptime(interaction: discord.Interaction):
    await interaction.response.send_message(f"Bot da chay: `{format_uptime()}`")


def main():
    if not TOKEN:
        raise RuntimeError(
            "Missing DISCORD_TOKEN. Create a .env file from .env.example and add your bot token."
        )

    bot.run(TOKEN)


if __name__ == "__main__":
    main()
