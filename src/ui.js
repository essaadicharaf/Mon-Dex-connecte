const grid = document.querySelector("#grid");
const creatureCount = document.querySelector("#creature-count");
const getBadgeStyle = (type) => {
  if (type === "Data") return "border-blue-800 text-attribute-data";
  if (type === "Virus") return "border-red-800 text-attribute-virus";
  if (type === "Free") return "border-fuchsia-800 text-attribute-free";
  return "border-green-800 text-attribute-vaccine";
};
const createCardElement = (creature) => {
  const badgeStyle = getBadgeStyle(creature.type);
  const article = document.createElement("article");
  article.setAttribute("data-id", creature.id);
  article.className =
    "flex h-full flex-col justify-between gap-3 rounded-xl bg-surface p-3 pb-4 border-2 border-line shadow-md hover:-translate-y-1 hover:border-brand transition-all duration-200 cursor-pointer";

  article.innerHTML = `
    <div class="flex flex-col gap-2 justify-between">
      <div class="relative flex h-54 w-full items-center justify-center rounded-xl bg-slate-300 border border-line/50 overflow-hidden p-1">
        <img src="${creature.image}" alt="${creature.name}" class=" max-h-50 w-full object-cover rounded-lg pointer-events-none" />
        <span class="absolute left-3 top-2 font-mono text-xs text-ink font-bold">${creature.id}</span>
      </div>
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-display text-base font-bold text-ink leading-snug line-clamp-2">${creature.name}</h3>
        <span class="shrink-0 rounded-full px-3 py-1 bg-white border ${badgeStyle} text-xs font-bold">${creature.type}</span>
      </div>
      <p class="text-xs text-muted">${creature.level} · Attaque ${creature.stats.attack}</p>
    </div>
    <button type="button" data-action="add-team" data-id="${creature.id}" class="btn-outline mt-auto pt-1 text-sm py-2 text-white bg-brand border-none rounded-lg hover:opacity-90">
      Ajouter à l'équipe
    </button>
  `;
  return article;
};
export const renderGrid = (creaturesList, append = false) => {
  if (!grid) return;
  if (!append) {
    grid.innerHTML = "";
  }
  if (creaturesList.length === 0 && !append) {
    grid.innerHTML = `
      <p class="col-span-full py-12 text-center text-muted text-sm border-2 border-dashed border-line rounded-xl">
        Aucun Digimon trouvé.
      </p>
    `;
    return;
  }
  const fragment = document.createDocumentFragment();
  creaturesList.forEach((creature) => {
    fragment.appendChild(createCardElement(creature));
  });
  grid.appendChild(fragment);
};
export const updateCounter = (count) => {
  if (creatureCount) {
    creatureCount.textContent = String(count).padStart(2, "0");
  }
};
