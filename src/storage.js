const favoritesKey = "favorites";
const lastSearchKey = "last_search";
// LocalStorage Favorites
export const getFavorites = () => {
  try {
    const data = localStorage.getItem(favoritesKey);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};
export const isFavorite = (id) => {
  const favorites = getFavorites();
  return favorites.some((fav) => fav.id === id);
};
export const toggleFavorite = (creature) => {
  let favorites = getFavorites();
  if (isFavorite(creature.id)) {
    favorites = favorites.filter((fav) => fav.id !== creature.id);
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    return false;
  } else {
    favorites.push(creature);
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    return true;
  }
};
export const getLastSearch = () => {
  return sessionStorage.getItem(lastSearchKey) || "";
};
export const saveLastSearch = (query) => {
  const clean = query.trim();
  if (!clean) {
    clearLastSearch();
    return;
  }
  sessionStorage.setItem(lastSearchKey, clean);
};
export const clearLastSearch = () => {
  sessionStorage.removeItem(lastSearchKey);
};
