export default function TabBar({ active, onNavigate, badge, colors, favoritesCount }) {
  const items = [
    { key: "search", label: "Поиск", icon: "🔍" },
    { key: "favorites", label: "Избранное", icon: "❤️" },
    { key: "apps", label: "Заявки", icon: "📋" },
    { key: "profile", label: "Профиль", icon: "👤" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: colors.white,
        borderTop: `1px solid ${colors.border}`,
        display: "flex",
        height: 60,
        zIndex: 100,
        boxShadow: "0 -2px 12px rgba(0,0,0,0.04)",
        maxWidth: 430,
        margin: "0 auto",
      }}
    >
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onNavigate(it.key)}
          style={{
            flex: 1,
            border: "none",
            background: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            position: "relative",
          }}
        >
          <span style={{ fontSize: 20 }}>{it.icon}</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: active === it.key ? colors.blue : colors.t3,
            }}
          >
            {it.label}
          </span>
          {it.key === "apps" && badge > 0 && (
            <span
              style={{
                position: "absolute",
                top: 6,
                right: "calc(50% - 18px)",
                background: colors.red,
                color: colors.white,
                fontSize: 9,
                fontWeight: 700,
                borderRadius: 10,
                padding: "1px 5px",
                minWidth: 14,
                textAlign: "center",
              }}
            >
              {badge}
            </span>
          )}
          {it.key === "favorites" && favoritesCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: 6,
                right: "calc(50% - 18px)",
                background: "#ffeff2",
                color: colors.red,
                fontSize: 9,
                fontWeight: 700,
                borderRadius: 10,
                padding: "1px 5px",
                minWidth: 14,
                textAlign: "center",
              }}
            >
              {favoritesCount}
            </span>
          )}
          {active === it.key && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "30%",
                right: "30%",
                height: 3,
                borderRadius: "3px 3px 0 0",
                background: `linear-gradient(90deg, ${colors.blue}, ${colors.accent})`,
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
