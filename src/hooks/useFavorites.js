import { useEffect, useMemo, useState } from "react";

const FAVORITES_STORAGE_KEY = "uniktap_favorite_universities";

function readFavoritesFromStorage() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => readFavoritesFromStorage());

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore storage errors (private mode/quota/etc.)
    }
  }, [favorites]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((uni) => String(uni.id))),
    [favorites]
  );

  const isFavorite = (universityId) => favoriteIds.has(String(universityId));

  const toggleFavorite = (university) => {
    setFavorites((prev) => {
      const uniId = String(university.id);
      const exists = prev.some((item) => String(item.id) === uniId);
      if (exists) {
        return prev.filter((item) => String(item.id) !== uniId);
      }
      return [university, ...prev];
    });
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
}
