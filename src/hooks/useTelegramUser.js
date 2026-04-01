import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { sbFetch } from "../supabase.js";

async function upsertProfile(payload) {
  const existing = await sbFetch(`profiles?telegram_id=eq.${payload.telegram_id}&select=*`);
  if (existing?.length > 0) {
    await sbFetch(`profiles?telegram_id=eq.${payload.telegram_id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...payload,
        updated_at: new Date().toISOString(),
      }),
      prefer: "return=minimal",
    });
    return { ...existing[0], ...payload };
  }

  const created = await sbFetch("profiles", {
    method: "POST",
    body: JSON.stringify(payload),
    prefer: "return=representation",
  });
  return Array.isArray(created) ? created[0] : payload;
}

export function useTelegramUser() {
  const [profile, setProfile] = useState(null);
  const [tgUser, setTgUser] = useState(null);
  const [requestingContact, setRequestingContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const tgAvailable = typeof window !== "undefined" && !!window.Telegram?.WebApp;

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!tgAvailable) {
        setLoading(false);
        return;
      }
      try {
        WebApp.ready();
        WebApp.expand();

        const user = WebApp.initDataUnsafe?.user;
        if (!user) return;

        console.log("Telegram User:", user);
        if (!mounted) return;
        setTgUser(user);

        if (!user.id) return;
        const savedProfile = await upsertProfile({
          telegram_id: user.id,
          first_name: user.first_name || null,
          last_name: user.last_name || null,
          username: user.username || null,
        });
        if (!mounted) return;
        setProfile(savedProfile);
      } catch (e) {
        console.error("Telegram user init error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tgAvailable]);

  const requestContact = async () => {
    if (!tgAvailable || !profile?.telegram_id) return null;
    setRequestingContact(true);
    try {
      await WebApp.requestContact?.();
      const tgData = window.Telegram?.WebApp?.initDataUnsafe || {};
      const phone =
        tgData?.user?.phone_number ||
        tgData?.user?.phone ||
        tgData?.receiver?.phone_number ||
        null;

      if (!phone) return null;

      const updated = await upsertProfile({
        telegram_id: profile.telegram_id,
        first_name: profile.first_name || null,
        last_name: profile.last_name || null,
        username: profile.username || null,
        phone,
      });
      setProfile(updated);
      return updated;
    } finally {
      setRequestingContact(false);
    }
  };

  return {
    profile,
    tgUser,
    tgAvailable,
    loading,
    requestingContact,
    requestContact,
    setProfile,
  };
}
