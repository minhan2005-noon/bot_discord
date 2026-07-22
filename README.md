# bot_discord

Bot Discord slash command bang Python va ban nang cao bang Node.js.

## Ban Python

File chinh:

```text
bot.py
```

Lenh dang co:

- `/ping` - kiem tra bot online va latency.
- `/help` - xem danh sach lenh.
- `/embed` - gui tin nhan embed tuy chinh.
- `/say` - bot gui tin nhan thuong.
- `/clear` - xoa 1-100 tin nhan, can quyen Manage Messages.
- `/userinfo` - xem thong tin thanh vien.
- `/serverinfo` - xem thong tin server.
- `/avatar` - xem avatar thanh vien.
- `/uptime` - xem bot da chay bao lau.
- `/ai` - hoi AI bang Groq hoac OpenAI API.

## Ban Node.js nang cao

Nam trong:

```text
node-bot/
```

Co 15 slash commands:

```text
/ping
/help
/ai
/embed
/say
/serverinfo
/userinfo
/avatar
/uptime
/clear
/timeout
/kick
/ban
/config
/ticket
```

Doc huong dan chi tiet trong:

```text
node-bot/README.md
```

## Quy trinh tao bot tu dau

1. Vao Discord Developer Portal:

```text
https://discord.com/developers/applications
```

2. Bam **New Application**, dat ten bot.
3. Vao **Bot** -> **Add Bot**.
4. Bam **Reset Token** hoac **View Token**, copy token.
5. Tao file `.env` trong thu muc project:

```env
DISCORD_TOKEN=token_cua_bot
AI_PROVIDER=groq
GROQ_API_KEY=api_key_groq
GROQ_MODEL=openai/gpt-oss-20b
OPENAI_API_KEY=api_key_openai
OPENAI_MODEL=gpt-5.6-terra
```

6. Vao **OAuth2** -> **URL Generator**.
7. Tick scopes:

```text
bot
applications.commands
```

8. Tick bot permissions nen co:

```text
Send Messages
Embed Links
Read Message History
Manage Messages
Use Slash Commands
```

9. Copy link OAuth2, mo tren trinh duyet, moi bot vao server.

## Them AI API key

Neu key bat dau bang `gsk_`, do la Groq key:

```env
AI_PROVIDER=groq
GROQ_API_KEY=api_key_groq
GROQ_MODEL=openai/gpt-oss-20b
```

Neu dung OpenAI key:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=api_key_openai
OPENAI_MODEL=gpt-5.6-terra
```

## Chay ban Python

```bash
cd /Users/hoangminhan/discord-bot
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python bot.py
```

## Chay ban Node.js

```bash
cd /Users/hoangminhan/discord-bot/node-bot
npm install
npm run deploy
npm start
```

## Luu y

- Khong gui token/API key cho nguoi khac.
- Neu token/API key tung bi dua vao chat/log, hay revoke/rotate key.
- Khong commit file `.env`.
- Neu bot khong hien slash command ngay, doi 1-5 phut roi thu lai.
