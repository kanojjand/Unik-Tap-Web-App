export default function PhoneAuth({
  tgAvailable,
  requestingContact,
  onRequestContact,
  colors,
  phone,
}) {
  return (
    <div style={{ marginTop: 14 }}>
      <button
        onClick={onRequestContact}
        disabled={requestingContact || !tgAvailable}
        style={{
          width: "100%",
          padding: "12px 14px",
          border: "none",
          borderRadius: 12,
          cursor: requestingContact || !tgAvailable ? "not-allowed" : "pointer",
          background:
            requestingContact || !tgAvailable
              ? colors.border
              : `linear-gradient(135deg, ${colors.blue}, ${colors.accent})`,
          color: requestingContact || !tgAvailable ? colors.t3 : colors.white,
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        {requestingContact ? "Запрашиваем номер..." : "📱 Поделиться номером"}
      </button>
      {!tgAvailable && (
        <div style={{ marginTop: 8, fontSize: 12, color: colors.t3, textAlign: "center" }}>
          Кнопка доступна только внутри Telegram Web App
        </div>
      )}
      {phone && (
        <div style={{ marginTop: 8, fontSize: 12, color: colors.t2, textAlign: "center" }}>
          Номер подтвержден: {phone}
        </div>
      )}
    </div>
  );
}
