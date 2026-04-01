import UniversityCard from "./UniversityCard.jsx";

export default function UniversityList({
  universities,
  loading,
  colors,
  isFavorite,
  onToggleFavorite,
  onSelectUni,
}) {
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "16px 16px 8px" }}>
        <div style={{ fontSize: 14, color: colors.t2, marginBottom: 10 }}>
          Найди свой университет в Шымкенте
        </div>
        <div style={{ fontSize: 12, color: colors.t3, marginTop: 10 }}>
          {loading ? "Загрузка..." : `Все университеты (${universities.length})`}
        </div>
      </div>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {universities.map((uni) => (
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
    </div>
  );
}
