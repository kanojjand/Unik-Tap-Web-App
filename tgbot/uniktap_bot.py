"""
UnikTap Telegram Bot - Webhook версия для Vercel
"""

import json
import os
import urllib.request
import urllib.parse

# ─── Конфигурация ───────────────────────────────────────
BOT_TOKEN = os.getenv("BOT_TOKEN", "")
CHANNEL_URL = "https://t.me/Uniktap"
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://uniktap.vercel.app/")

TELEGRAM_API = f"https://api.telegram.org/bot{BOT_TOKEN}"


def send_message(chat_id: int, text: str, reply_markup: dict = None) -> None:
    """Отправка сообщения через Telegram API"""
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
    }
    if reply_markup:
        payload["reply_markup"] = json.dumps(reply_markup)

    data = urllib.parse.urlencode(payload).encode("utf-8")
    req = urllib.request.Request(f"{TELEGRAM_API}/sendMessage", data=data)
    urllib.request.urlopen(req)


def answer_callback(callback_id: str) -> None:
    """Ответ на callback query"""
    data = urllib.parse.urlencode({"callback_query_id": callback_id}).encode("utf-8")
    req = urllib.request.Request(f"{TELEGRAM_API}/answerCallbackQuery", data=data)
    urllib.request.urlopen(req)


def handle_start(chat_id: int) -> None:
    """Обработчик команды /start"""
    keyboard = {
        "inline_keyboard": [
            [{"text": "Наш Telegram-канал", "url": CHANNEL_URL}],
            [{"text": "Далее", "callback_data": "open_app"}],
        ]
    }

    send_message(
        chat_id,
        "<b>Добро пожаловать в UnikTap!</b>\n\n"
        "Все университеты Шымкента — в одном месте.\n"
        "Цены, гранты, специальности, баллы ЕНТ — всё здесь.\n\n"
        "Подпишись на наш канал, а потом нажми <b>Далее</b>",
        keyboard,
    )


def handle_open_app(chat_id: int, callback_id: str) -> None:
    """Обработчик нажатия кнопки 'Далее'"""
    answer_callback(callback_id)

    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "Открыть UnikTap",
                    "web_app": {"url": WEBAPP_URL},
                }
            ]
        ]
    }

    send_message(
        chat_id,
        "Нажми кнопку ниже, чтобы открыть <b>UnikTap</b>",
        keyboard,
    )


# ─── Vercel Handler ─────────────────────────────────────

from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Обработка входящих webhook-запросов от Telegram"""
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            update = json.loads(body.decode("utf-8"))

            # Обработка сообщений
            if "message" in update:
                message = update["message"]
                chat_id = message["chat"]["id"]
                text = message.get("text", "")

                if text.startswith("/start"):
                    handle_start(chat_id)

            # Обработка callback (нажатие на кнопки)
            elif "callback_query" in update:
                callback = update["callback_query"]
                chat_id = callback["message"]["chat"]["id"]
                callback_id = callback["id"]
                data = callback.get("data", "")

                if data == "open_app":
                    handle_open_app(chat_id, callback_id)

            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write(b"OK")

        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write(str(e).encode())

    def do_GET(self):
        """Проверка что endpoint работает"""
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"UnikTap Bot Webhook is running!")
