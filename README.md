# Help Embed Discord Bot

Bot Discord slash command bang Python.

## Lenh dang co

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

Neu key bat dau bang `gsk_`, do la Groq key. Dung cau hinh nay:

```env
AI_PROVIDER=groq
GROQ_API_KEY=api_key_groq
GROQ_MODEL=openai/gpt-oss-20b
```

Neu dung OpenAI key, dung cau hinh nay:

1. Vao OpenAI Platform:

```text
https://platform.openai.com/api-keys
```

2. Tao API key moi.
3. Dan key vao `.env`:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=api_key_openai
OPENAI_MODEL=gpt-5.6-terra
```

4. Restart bot.

Dung lenh AI trong Discord:

```text
/ai prompt: viet gi do
```

Mac dinh cau tra loi chi hien voi nguoi goi lenh. Chon `public: True` neu muon hien cho ca kenh.

## Cai dat tren may

```bash
cd /Users/hoangminhan/discord-bot
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

## Chay bot

Chay foreground de xem log truc tiep:

```bash
cd /Users/hoangminhan/discord-bot
source .venv/bin/activate
python bot.py
```

Chay nen va ghi log:

```bash
cd /Users/hoangminhan/discord-bot
.venv/bin/python -u bot.py >> bot.log 2>&1 &
```

Kiem tra log:

```bash
tail -f bot.log
```

Tat bot:

```bash
pkill -f "python.*bot.py"
```

## Luu y

- Khong gui token cho nguoi khac.
- Neu token Discord tung bi dua vao `.env.example` hoac chat/log, hay reset token trong Discord Developer Portal.
- Khong commit file `.env`.
- Neu bot khong hien slash command ngay, doi 1-5 phut roi thu lai.
- Lenh `/clear` can bot co quyen **Manage Messages** trong server.
