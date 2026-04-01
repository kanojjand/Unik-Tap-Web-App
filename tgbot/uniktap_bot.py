"""
UnikTap Telegram Bot
Точка входа для пользователей — показывает приветствие,
ссылку на канал и кнопку для открытия Web App.

Запуск: python uniktap_bot.py
"""

import asyncio
import logging
import os

from aiogram import Bot, Dispatcher, Router, F
from aiogram.types import (
    Message,
    CallbackQuery,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    WebAppInfo,
)
from aiogram.filters import CommandStart

# ─── Конфигурация ───────────────────────────────────────
# Токен бота от @BotFather
# ВАЖНО: замени на свой токен!
BOT_TOKEN = os.getenv("BOT_TOKEN", "8615692112:AAG8Uf5UWhYL74AuH2IHCWh0JIp28ug-3Kg")

# Ссылка на ваш Telegram-канал
CHANNEL_URL = "https://t.me/Uniktap"

# URL вашего Web App (React-приложение)
# После деплоя на Vercel/Netlify замени на свой URL
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://uniktap.vercel.app/")

# ─── Логирование ────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
log = logging.getLogger("uniktap")

# ─── Роутер ─────────────────────────────────────────────
router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message) -> None:
    """
    Обработчик команды /start
    Показывает приветствие + кнопку на канал + кнопку "Далее"
    """
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="📢 Наш Telegram-канал", url=CHANNEL_URL)],
            [InlineKeyboardButton(text="Далее ➡️", callback_data="open_app")],
        ]
    )

    await message.answer(
        "👋 <b>Добро пожаловать в UnikTap!</b>\n\n"
        "🎓 Все университеты Шымкента — в одном месте.\n"
        "Цены, гранты, специальности, баллы ЕНТ — всё здесь.\n\n"
        "📢 Подпишись на наш канал, а потом нажми <b>Далее</b> 👇",
        parse_mode="HTML",
        reply_markup=keyboard,
    )


@router.callback_query(F.data == "open_app")
async def show_webapp(callback: CallbackQuery) -> None:
    """
    Обработчик нажатия кнопки "Далее"
    Показывает кнопку для открытия Web App внутри Telegram
    """
    await callback.answer()

    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🎓 Открыть UnikTap",
                    web_app=WebAppInfo(url=WEBAPP_URL),
                )
            ]
        ]
    )

    await callback.message.answer(
        "🚀 Нажми кнопку ниже, чтобы открыть <b>UnikTap</b> 👇",
        parse_mode="HTML",
        reply_markup=keyboard,
    )


# ─── Запуск бота ────────────────────────────────────────

async def main() -> None:
    """Инициализация и запуск polling"""

    if BOT_TOKEN == "ВСТАВЬ_СЮДА_СВОЙ_ТОКЕН":
        log.error("❌ Токен не указан! Открой uniktap_bot.py и замени BOT_TOKEN")
        return

    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()
    dp.include_router(router)

    log.info("🚀 UnikTap бот запущен!")
    log.info(f"   Web App URL: {WEBAPP_URL}")
    log.info(f"   Канал: {CHANNEL_URL}")

    try:
        await dp.start_polling(bot)
    finally:
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())