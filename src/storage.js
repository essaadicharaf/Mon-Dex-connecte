export const getFavorites = () => {
  JSON.parse(localStorage.getItem("mondex_favorites")) || [];
};
export const isFavorite = (id) => {};
