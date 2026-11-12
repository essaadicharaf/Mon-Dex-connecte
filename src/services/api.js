const BASE_URL = "https://digi-api.com/api/v1";
export const toCreature = (raw) => {
  const type = raw.attributes && raw.attributes.length > 0 ? raw.attributes[0].attribute : "Data";
  const level = raw.levels && raw.levels.length > 0 ? raw.levels[0].level : "Rookie";
  const image = raw.images && raw.images.length > 0 ? raw.images[0].href : raw.image || "";
  const formattedId = `#${String(raw.id).padStart(3, "0")}`;
  const enDesc = raw.descriptions && raw.descriptions.find((d) => d.language === "en_us");
  const description = enDesc ? enDesc.description : "Aucune description disponible.";
  const attackStat = ((raw.id * 37) % 500) + 350;
  const defenceStat = ((raw.id * 53) % 450) + 300;
  const speedStat = ((raw.id * 29) % 480) + 320;
  return {
    id: formattedId,
    name: raw.name,
    type: type,
    level: level,
    image: image,
    description: description,
    stats: {
      attack: attackStat,
      defence: defenceStat,
      speed: speedStat,
    },
  };
};
// get creature by name in fetch
export const getCreatureByName = async (query) => {
  const text = String(query).toLowerCase().trim().replace("#", "");
  const cleanQuery = Number(text) || text;
  const response = await fetch(`${BASE_URL}/digimon/${cleanQuery}`);
  if (!response.ok) {
    throw new Error(`Erreur HTTP : ${response.status}`);
  }
  const data = await response.json();
  return toCreature(data);
};
export const getCreatures = async (pageSize = 20, page = 0) => {
  const response = await fetch(`${BASE_URL}/digimon?pageSize=${pageSize}&page=${page}`);
  if (!response.ok) {
    throw new Error(`Erreur HTTP : ${response.status}`);
  }
  const data = await response.json();
  const rawList = data.content || [];
  const creatures = await Promise.all(
    rawList.map(async (item) => {
      try {
        const res = await fetch(`${BASE_URL}/digimon/${item.id}`);
        if (!res.ok) return toCreature(item);
        const detail = await res.json();
        return toCreature(detail);
      } catch {
        return toCreature(item);
      }
    }),
  );
  return creatures;
};
