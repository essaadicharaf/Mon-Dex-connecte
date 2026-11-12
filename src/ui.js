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
      <p class="col-span-full py-12 text-center text-ink bg-surface text-sm border-2 border-dashed border-line rounded-xl">
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
// detail Panel
const detailPanel = document.querySelector("#detail");
export const renderDetail = (creature) => {
  if (!detailPanel) return;
  const atkPercent = Math.min(100, Math.round((creature.stats.attack / 999) * 100));
  const defPercent = Math.min(100, Math.round((creature.stats.defence / 999) * 100));
  const spdPercent = Math.min(100, Math.round((creature.stats.speed / 999) * 100));
  let badgeColor = "border-green-800 text-attribute-vaccine";
  if (creature.type === "Data") {
    badgeColor = "border-blue-800 text-attribute-data";
  } else if (creature.type === "Free") {
    badgeColor = "border-fuchsia-800 text-attribute-free";
  } else if (creature.type === "Virus") {
    badgeColor = "border-red-800 text-attribute-virus";
  }
  detailPanel.className = "flex flex-col gap-4 rounded-xl border border-line bg-surface p-8 shadow-sm w-full";
  detailPanel.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="font-mono text-sm text-muted font-bold">${creature.id} · Détail</span>
      <button type="button" id="btn-close-detail" aria-label="Fermer le détail" class="btn-outline w-8 h-8 flex items-center justify-center p-0 rounded-lg text-muted hover:text-ink hover:bg-line transition-colors">
        ✕
      </button>
    </div>
    <div class="flex h-auto w-full items-center justify-center rounded-xl bg-brand-light border border-line/40 overflow-hidden">
      <img src="${creature.image}" alt="${creature.name}" class="rounded-xl h-full w-full object-cover p-1.5 pointer-events-none" />
    </div>
    <div class="flex items-center justify-between">
      <h2 class="font-display text-2xl font-extrabold text-ink">${creature.name}</h2>
      <span class="rounded-full px-3 py-1 bg-white border ${badgeColor} text-xs font-bold">${creature.type}</span>
    </div>
    <p class="text-xs text-muted font-semibold">${creature.level}</p>
    <p class="text-xs text-muted leading-relaxed text-left">${creature.description}</p>
    <div class="flex flex-col gap-2.5 text-xs pt-2">
      <div class="grid grid-cols-[70px_1fr_40px] items-center gap-2">
        <span class="font-bold text-ink">Puissance</span>
        <div class="h-2.5 rounded-full bg-ground overflow-hidden border border-line">
          <div class="h-full rounded-full bg-brand" style="width: ${atkPercent}%"></div>
        </div>
        <span class="text-right font-mono font-bold text-ink">${creature.stats.attack}</span>
      </div>
      <div class="grid grid-cols-[70px_1fr_40px] items-center gap-2">
        <span class="font-bold text-ink">Défense</span>
        <div class="h-2.5 rounded-full bg-ground overflow-hidden border border-line">
          <div class="h-full rounded-full bg-attribute-data" style="width: ${defPercent}%"></div>
        </div>
        <span class="text-right font-mono font-bold text-ink">${creature.stats.defence}</span>
      </div>
      <div class="grid grid-cols-[70px_1fr_40px] items-center gap-2">
        <span class="font-bold text-ink">Vitesse</span>
        <div class="h-2.5 rounded-full bg-ground overflow-hidden border border-line">
          <div class="h-full rounded-full bg-attribute-vaccine" style="width: ${spdPercent}%"></div>
        </div>
        <span class="text-right font-mono font-bold text-ink">${creature.stats.speed}</span>
      </div>
    </div>
    <button
      type="button"
      data-action="add-team"
      data-id="${creature.id}"
      class="btn-primary w-full py-2.5 text-sm font-bold mt-2">
      Ajouter à l'équipe
    </button>
  `;
};
// reset panel
export const resetDetail = () => {
  if (!detailPanel) return;
  detailPanel.className =
    "flex flex-col items-center justify-center text-center gap-4 rounded-xl border-2 border-dashed border-line bg-surface p-8 min-h-[360px] shadow-sm";
  detailPanel.innerHTML = `
    <div class="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center text-brand">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </div>
    <div>
      <h3 class="font-display text-base font-bold text-ink">Aucun Digimon sélectionné</h3>
      <p class="text-xs text-muted m-1 max-w-[220px]">Cliquez sur une carte de la grille pour afficher ses détails et ses statistiques.</p>
    </div>
  `;
};
