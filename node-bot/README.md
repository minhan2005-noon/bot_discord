# Advanced Discord Bot - Node.js

Bot Discord nang cao bang Node.js + discord.js.

## Tinh nang

- Utility: `/ping`, `/help`, `/serverinfo`, `/userinfo`, `/avatar`, `/uptime`
- Message tools: `/say`, `/embed`
- AI chat: `/ai`
- Moderation: `/clear`, `/timeout`, `/kick`, `/ban`
- Server config: `/config log-channel`, `/config welcome-channel`, `/config ticket-category`, `/config view`
- Ticket system: `/ticket setup`, `/ticket close`, button tao ticket
- Events: welcome member moi, log message deleted
- Storage: JSON database trong `data/db.json`

## Cau truc file

```txt
src/
├─ index.js                 # Dang nhap bot, load command/event
├─ deploy-commands.js       # Dang ky slash command len Discord
├─ config.js                # Doc bien moi truong tu .env
├─ commands/                # Moi file la mot slash command
├─ events/                  # Xu ly Discord events
├─ services/aiService.js    # Goi Groq/OpenAI API
├─ storage/database.js      # Luu config server bang JSON
└─ utils/                   # Helper loader, split message
```

## Tao bot tren Discord

1. Vao `https://discord.com/developers/applications`
2. Bam **New Application**
3. Vao **Bot** -> **Add Bot** -> copy token
4. Vao **OAuth2** -> **URL Generator**
5. Tick scopes:

```text
bot
applications.commands
```

6. Tick permissions:

```text
Send Messages
Embed Links
Read Message History
Manage Messages
Moderate Members
Kick Members
Ban Members
Manage Channels
View Channels
Use Slash Commands
```

7. Copy link va moi bot vao server.

## Cai dat

```bash
cd /Users/hoangminhan/discord-bot/node-bot
npm install
cp .env.example .env
```

Sua `.env`:

```env
DISCORD_TOKEN=token_discord
CLIENT_ID=application_client_id
GUILD_ID=server_id_test

AI_PROVIDER=groq
GROQ_API_KEY=gsk_key_cua_ban
GROQ_MODEL=openai/gpt-oss-20b
```

## Chay

Dang ky slash commands:

```bash
npm run deploy
```

Chay bot:

```bash
npm start
```

Chay nen:

```bash
nohup npm start > bot.log 2>&1 &
```

Tat bot:

```bash
pkill -f "node --env-file=.env src/index.js"
```

## Hoc de thuan thuc

1. Hoc JavaScript: object, array, function, async/await, import/export.
2. Hoc Node.js: npm, package.json, env, fs, module.
3. Hoc discord.js: Client, intents, events, slash commands, embeds, permissions.
4. Hoc API integration: Groq/OpenAI, error handling, rate limit.
5. Hoc database: bat dau JSON, sau do len SQLite/PostgreSQL.
6. Hoc deploy: VPS, PM2, Docker, log, restart.

## Luu y bao mat

- Khong commit `.env`.
- Token Discord va API key phai xem nhu mat khau.
- Neu key da bi paste vao chat/log, hay revoke/rotate key.
