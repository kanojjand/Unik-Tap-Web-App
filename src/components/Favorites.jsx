import UniversityCard from "./UniversityCard.jsx";

export default function Favorites({
  favorites,
  colors,
  isFavorite,
  onToggleFavorite,
  onSelectUni,
}) {
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "20px 16px 8px" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: colors.t3,
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          ИЗБРАННОЕ ({favorites.length})
        </div>
      </div>

      {favorites.length === 0 ? (
        <div style={{ padding: "0 16px" }}>
          <div
            style={{
              textAlign: "center",
              padding: "50px 20px",
              background: colors.card,
              borderRadius: 16,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🤍</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: colors.t1 }}>
              У вас пока нет избранных университетов.
            </div>
            <div style={{ fontSize: 13, color: colors.t3, marginTop: 6 }}>
              Добавьте их на вкладке Поиск
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {favorites.map((uni) => (
            <UniversityCard
              key={uni.id}
              university={uni}
              colors={colors}
              isFavorite={isFavorite(uni.id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectUni}
            />
          ))}
        </div>
      )}
    </div>
  );
}
