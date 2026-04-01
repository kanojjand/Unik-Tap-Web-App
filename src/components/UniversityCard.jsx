export default function UniversityCard({
  university,
  colors,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) {
  return (
    <div
      onClick={() => onSelect(university)}
      style={{
        background: colors.card,
        borderRadius: 14,
        padding: "16px 18px",
        border: `1px solid ${colors.border}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 14,
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(45,127,249,0.1)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: colors.bluePale,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        🎓
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{ fontWeight: 700, fontSize: 14, color: colors.t1, lineHeight: 1.3 }}
        >
          {university.name}
        </div>
        <div
          style={{
            fontSize: 12,
            color: colors.t3,
            marginTop: 4,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span>📍 {university.city}</span>
          {university.dormitory && <span>🏠 Общежитие</span>}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(university);
        }}
        style={{
          border: `1px solid ${isFavorite ? "#f6c0c0" : colors.border}`,
          background: isFavorite ? "#fff1f1" : "#f7f9fc",
          color: isFavorite ? colors.red : colors.t3,
          borderRadius: 10,
          padding: "6px 8px",
          fontSize: 18,
          lineHeight: 1,
          cursor: "pointer",
          flexShrink: 0,
        }}
        aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
        title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <div
        style={{
          background: university.ent_min >= 70 ? "#fff0e0" : colors.bluePale,
          color: university.ent_min >= 70 ? "#e67e22" : colors.blue,
          padding: "4px 10px",
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        ЕНТ ≥ {university.ent_min}
      </div>
    </div>
  );
}
