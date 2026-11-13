const BASE_URL = "https://digi-api.com/api/v1";
//
export const toCreature = (raw) => {
  const formattedId = `#${String(raw.id).padStart(3, "0")}`;
  const type = raw.attributes && raw.attributes.length > 0 ? raw.attributes[0].attribute : "Data";
  const level = raw.levels && raw.levels.length > 0 ? raw.levels[0].level : "Rookie";
  const image = raw.images && raw.images.length > 0 ? raw.images[0].href : raw.image || "";
  const enDesc = raw.descriptions && raw.descriptions.find((d) => d.language === "en_us");
  const description = enDesc ? enDesc.description : "Aucune description disponible.";
  const levelBase = {
    "Baby I": 100,
    "Baby II": 180,
    Child: 320,
    Rookie: 320,
    Adult: 500,
    Champion: 500,
    Perfect: 680,
    Ultimate: 820,
    Mega: 850,
  };
  const base = levelBase[level] || 300;
  const skillsCount = raw.skills ? raw.skills.length : 0;
  const fieldsCount = raw.fields ? raw.fields.length : 0;
  const nextEvoCount = raw.nextEvolutions ? raw.nextEvolutions.length : 0;
  const attackStat = Math.min(999, base + skillsCount * 15);
  const defenceStat = Math.min(999, base + fieldsCount * 25 + (raw.id % 50));
  const speedStat = Math.min(999, base + nextEvoCount * 4 + (raw.id % 40));
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
    const error = new Error(`Erreur HTTP : ${response.status}`);
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  return toCreature(data);
};
// get 20 creatures in api
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
//
