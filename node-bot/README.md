# Advanced Discord Bot - Node.js

Bot Discord nâng cao bằng Node.js và discord.js.

## Tính năng

- Utility: `/ping`, `/help`, `/serverinfo`, `/userinfo`, `/avatar`, `/uptime`
- Công cụ tin nhắn: `/say`, `/embed`
- AI chat: `/ai`
- Moderation: `/clear`, `/timeout`, `/kick`, `/ban`
- Cấu hình server: `/config log-channel`, `/config welcome-channel`, `/config ticket-category`, `/config view`
- Ticket system: `/ticket setup`, `/ticket close`, button tạo ticket
- Events: chào mừng thành viên mới, log tin nhắn bị xóa
- Storage: lưu cấu hình bằng JSON trong `data/db.json`

## Cấu trúc file

```txt
src/
├─ index.js                 # Đăng nhập bot, load command/event
├─ deploy-commands.js       # Đăng ký slash command lên Discord
├─ config.js                # Đọc biến môi trường từ .env
├─ commands/                # Mỗi file là một slash command
├─ events/                  # Xử lý Discord events
├─ services/aiService.js    # Gọi Groq/OpenAI API
├─ storage/database.js      # Lưu cấu hình server bằng JSON
└─ utils/                   # Helper loader, split message
```

## Tạo bot trên Discord

1. Vào `https://discord.com/developers/applications`
2. Bấm **New Application**
3. Vào **Bot** -> **Add Bot** -> copy token
4. Vào **OAuth2** -> **URL Generator**
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

7. Copy link và mời bot vào server.

## Cài đặt

```bash
cd /Users/hoangminhan/discord-bot/node-bot
npm install
cp .env.example .env
```

Sửa `.env`:

```env
DISCORD_TOKEN=token_discord
CLIENT_ID=application_client_id
GUILD_ID=server_id_test

AI_PROVIDER=groq
GROQ_API_KEY=gsk_key_cua_ban
GROQ_MODEL=openai/gpt-oss-20b
```

## Chạy

Đăng ký slash commands:

```bash
npm run deploy
```

Chạy bot:

```bash
npm start
```

Chạy nền:

```bash
nohup npm start > bot.log 2>&1 &
```

Tắt bot:

```bash
pkill -f "node --env-file=.env src/index.js"
```
