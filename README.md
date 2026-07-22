# bot_discord

Bot Discord dùng slash command, gồm một bản Python đơn giản và một bản Node.js nâng cao.

## Bản Python

File chính:

```text
bot.py
```

Lệnh đang có:

- `/ping` - kiểm tra bot có đang online không và xem độ trễ.
- `/help` - xem danh sách lệnh.
- `/embed` - gửi tin nhắn embed tùy chỉnh.
- `/say` - bot gửi tin nhắn thường.
- `/clear` - xóa 1-100 tin nhắn, cần quyền Manage Messages.
- `/userinfo` - xem thông tin thành viên.
- `/serverinfo` - xem thông tin server.
- `/avatar` - xem avatar thành viên.
- `/uptime` - xem bot đã chạy bao lâu.
- `/ai` - hỏi AI bằng Groq hoặc OpenAI API.

## Bản Node.js nâng cao

Nằm trong:

```text
node-bot/
```

Có 15 slash commands:

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

Đọc hướng dẫn chi tiết trong:

```text
node-bot/README.md
```

## Quy trình tạo bot từ đầu

1. Vào Discord Developer Portal:

```text
https://discord.com/developers/applications
```

2. Bấm **New Application**, đặt tên bot.
3. Vào **Bot** -> **Add Bot**.
4. Bấm **Reset Token** hoặc **View Token**, sau đó copy token.
5. Tạo file `.env` trong thư mục project:

```env
DISCORD_TOKEN=token_cua_bot
AI_PROVIDER=groq
GROQ_API_KEY=api_key_groq
GROQ_MODEL=openai/gpt-oss-20b
OPENAI_API_KEY=api_key_openai
OPENAI_MODEL=gpt-5.6-terra
```

6. Vào **OAuth2** -> **URL Generator**.
7. Tick scopes:

```text
bot
applications.commands
```

8. Tick các quyền bot nên có:

```text
Send Messages
Embed Links
Read Message History
Manage Messages
Use Slash Commands
```

9. Copy link OAuth2, mở trên trình duyệt, rồi mời bot vào server.

## Thêm AI API key

Nếu key bắt đầu bằng `gsk_`, đó là Groq key:

```env
AI_PROVIDER=groq
GROQ_API_KEY=api_key_groq
GROQ_MODEL=openai/gpt-oss-20b
```

Nếu dùng OpenAI key:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=api_key_openai
OPENAI_MODEL=gpt-5.6-terra
```

## Chạy bản Python

```bash
cd /Users/hoangminhan/discord-bot
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python bot.py
```

## Chạy bản Node.js

```bash
cd /Users/hoangminhan/discord-bot/node-bot
npm install
npm run deploy
npm start
```

## Lưu ý

- Không gửi token/API key cho người khác.
- Nếu token/API key từng bị đưa vào chat hoặc log, hãy revoke/rotate key.
- Không commit file `.env`.
- Nếu bot chưa hiện slash command ngay, đợi 1-5 phút rồi thử lại.
