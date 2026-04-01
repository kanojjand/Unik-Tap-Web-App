import PhoneAuth from "./PhoneAuth.jsx";
import { useTelegramUser } from "../hooks/useTelegramUser.js";

function SkeletonLine({ width = "100%" }) {
  return (
    <div
      style={{
        height: 12,
        width,
        borderRadius: 8,
        background: "#e9eef7",
      }}
    />
  );
}

export default function Profile({ applicationsCount = 0, colors }) {
  const {
    profile,
    tgUser,
    tgAvailable,
    loading,
    requestingContact,
    requestContact,
  } = useTelegramUser();

  const displayName =
    [tgUser?.first_name, tgUser?.last_name].filter(Boolean).join(" ") ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    "Пользователь Telegram";

  const username = tgUser?.username || profile?.username || "";
  const avatarUrl = profile?.avatar_url || tgUser?.photo_url || "";
  const phone = profile?.phone || null;
  const telegramId = tgUser?.id || profile?.telegram_id;

  const handleRequestContact = async () => {
    try {
      const updated = await requestContact();
      if (!updated?.phone) {
        alert("Контакт отправлен. Если номер не подтянулся автоматически, повторите запрос позже.");
      }
    } catch (e) {
      alert("Не удалось получить контакт: " + e.message);
    }
  };

  if (loading) {
    return (
      <div style={{ paddingBottom: 80 }}>
        <div style={{ padding: "20px 16px" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#e9eef7",
              margin: "20px auto 16px",
            }}
          />
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <SkeletonLine width={180} />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SkeletonLine width={120} />
          </div>
          <div
            style={{
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 14,
              padding: 14,
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <SkeletonLine width="60%" />
            <SkeletonLine width="70%" />
            <SkeletonLine width="50%" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "20px 16px" }}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
              margin: "20px auto 16px",
              display: "block",
              border: `2px solid ${colors.bluePale}`,
            }}
          />
        ) : (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: colors.bluePale,
              margin: "20px auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
            }}
          >
            👤
          </div>
        )}

        <div style={{ fontSize: 16, fontWeight: 700, color: colors.t1, textAlign: "center" }}>
          {displayName}
        </div>
        <div style={{ fontSize: 13, color: colors.t3, marginTop: 6, textAlign: "center" }}>
          {username ? `@${username}` : "Username не указан"}
        </div>

        <div
          style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 14,
            padding: 14,
            marginTop: 16,
          }}
        >
          <div style={{ fontSize: 13, color: colors.t2 }}>
            Telegram ID: <strong>{telegramId || "—"}</strong>
          </div>
          <div style={{ fontSize: 13, color: colors.t2, marginTop: 6 }}>
            Телефон: <strong>{phone || "Не указан"}</strong>
          </div>
          <div style={{ fontSize: 13, color: colors.t2, marginTop: 6 }}>
            Мои заявки: <strong>{applicationsCount}</strong>
          </div>
        </div>

        {!phone && (
          <PhoneAuth
            tgAvailable={tgAvailable}
            requestingContact={requestingContact}
            onRequestContact={handleRequestContact}
            colors={colors}
            phone={phone}
          />
        )}
      </div>
    </div>
  );
}
