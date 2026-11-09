//
let team = [];

function getTeamButtonState(creatureId) {
  const isAlreadyInTeam = team.some((c) => c.id === creatureId);
  const isTeamFull = team.length >= 6;
  const isDisabled = isAlreadyInTeam || isTeamFull;

  let text = "Ajouter à l'équipe";
  if (isAlreadyInTeam) {
    text = "Déjà dans l'équipe";
  } else if (isTeamFull) {
    text = "Équipe complète";
  }

  return { isDisabled, text };
}

//
function updateTeamButtons() {
  const allAddButtons = document.querySelectorAll('[data-action="add-team"]');

  allAddButtons.forEach((btn) => {
    const creatureId = btn.getAttribute("data-id");
    if (!creatureId) return;

    const { isDisabled, text } = getTeamButtonState(creatureId);

    btn.disabled = isDisabled;
    btn.textContent = text;

    if (isDisabled) {
      btn.classList.add("opacity-50", "cursor-not-allowed");
      btn.classList.remove("hover:opacity-90");
    } else {
      btn.classList.remove("opacity-50", "cursor-not-allowed");
      btn.classList.add("hover:opacity-90");
    }
  });
}

//1
const grid = document.querySelector("#grid");
const creatureCount = document.querySelector("#creature-count");

function renderGrid(list = creatures) {
  if (!grid) return;
  grid.innerHTML = "";

  if (creatureCount) {
    creatureCount.textContent = String(creatures.length).padStart(2, "0");
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <p class="col-span-full py-12 text-center bg-white text-muted text-base border-2  border-line rounded-xl">
        Aucun Digimon ne correspond à votre recherche.
      </p>
    `;
    return;
  }

  list.forEach((creature) => {
    let badgeStyle = "border-green-800 text-attribute-vaccine";
    if (creature.type === "Data") {
      badgeStyle = "border-blue-800 text-attribute-data";
    } else if (creature.type === "Virus") {
      badgeStyle = "border-red-800 text-attribute-virus";
    }

    const { isDisabled, text } = getTeamButtonState(creature.id);
    const disabledStyle = isDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90";

    const cardHTML = `
      <article data-id="${creature.id}" class="flex flex-col gap-3 rounded-xl bg-surface p-3 pb-4 border-2 border-3 border-[#264653] shadow-md hover:-translate-y-1 hover:border-brand transition-all duration-200 cursor-pointer">
        <div class="relative flex h-50 w-full items-center justify-center rounded-xl bg-brand-light border border-line/50 overflow-hidden">
          <img src="${creature.image}" alt="${creature.name}" class="rounded-xl p-[1px] object-cover pointer-events-none" />
          <span class="absolute left-3 top-2 font-mono text-xs text-muted font-bold">${creature.id}</span>
        </div>
        <div class="flex items-center justify-between gap-2">
          <h3 class="font-display text-lg font-bold text-ink">${creature.name}</h3>
          <span class="rounded-full px-3 py-1 bg-white border ${badgeStyle} text-xs font-bold">${creature.type}</span>
        </div>
        <p class="text-xs text-muted">${creature.level} · Attaque ${creature.stats.attack}</p>
        <button
          type="button"
          data-action="add-team"
          data-id="${creature.id}"
          ${isDisabled ? "disabled" : ""}
          class="btn-outline mt-1 text-sm py-2 text-white bg-brand border-none rounded-lg transition-all ${disabledStyle}">
          ${text}
        </button>
      </article>
    `;

    grid.innerHTML += cardHTML;
  });
}

renderGrid();

//3
const detailPanel = document.querySelector("#detail");

function resetDetail() {
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
}

function showDetail(creature) {
  if (!creature || !detailPanel) return;

  let badgeColor = "border-green-800 text-attribute-vaccine";
  if (creature.type === "Data") {
    badgeColor = "border-blue-800 text-attribute-data";
  } else if (creature.type === "Virus") {
    badgeColor = "border-red-800 text-attribute-virus";
  }

  const atkPercent = Math.min(100, Math.round((creature.stats.attack / 999) * 100));
  const defPercent = Math.min(100, Math.round((creature.stats.defence / 999) * 100));
  const spdPercent = Math.min(100, Math.round((creature.stats.speed / 999) * 100));
  const { isDisabled, text } = getTeamButtonState(creature.id);
  const disabledStyle = isDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90";

  detailPanel.className = "flex flex-col gap-4 rounded-xl border border-line bg-surface p-8 shadow-sm w-full";

  detailPanel.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="font-mono text-sm text-muted font-bold">${creature.id} · Détail</span>
      <button type="button" id="btn-close-detail" aria-label="Fermer le détail" class="btn-outline w-8 h-8 flex items-center justify-center p-0 rounded-lg text-muted hover:text-ink hover:bg-line transition-colors">
        ✕
      </button>
    </div>

    <div class="flex h-auto w-full items-center justify-center rounded-xl bg-brand-light border border-line/40 overflow-hidden">
      <img src="${creature.image}" alt="${creature.name}" class=" rounded-xl h-full w-full object-cover p-1.5 pointer-events-none" />
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
      ${isDisabled ? "disabled" : ""}
      class="btn-primary w-full py-2.5 text-sm font-bold mt-2  ${disabledStyle}">
      ${text}
    </button>
  `;

  const closeBtn = document.querySelector("#btn-close-detail");
  if (closeBtn) {
    closeBtn.addEventListener("click", resetDetail);
  }
}

//4
const searchInput = document.querySelector("#search");
const filterButtons = document.querySelectorAll("#filters button");
let activeType = "all";

function applySearchAndFilter() {
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const filtered = creatures.filter((c) => {
    const matchName = c.name.toLowerCase().includes(searchTerm);
    const matchType = activeType === "all" || c.type === activeType;
    return matchName && matchType;
  });

  renderGrid(filtered);
}

if (searchInput) {
  searchInput.addEventListener("input", applySearchAndFilter);
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("bg-brand", "border-brand", "text-white"));
    btn.classList.add("bg-brand", "border-brand", "text-white");

    activeType = btn.getAttribute("data-type") || "all";
    applySearchAndFilter();
  });
});

//
const creatureForm = document.querySelector("#creature-form");
const idInput = document.querySelector('input[name="id"]');
const nameInput = document.querySelector('input[name="name"]');
const typeSelect = document.querySelector('select[name="type"]');
const levelSelect = document.querySelector('select[name="level"]');
const stat1Input = document.querySelechtor('input[name="stat1"]');
const stat2Input = document.querySelector('input[name="stat2"]');
const stat3Input = document.querySelector('input[name="stat3"]');
const imageInput = document.querySelector('input[name="image"]');
const descriptionInput = document.querySelector('textarea[name="description"]');

const REGEX_RULES = {
  id: /^#\d{3}$/,
  name: /^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9 .'-]{1,29}$/,
  stat: /^\d{1,3}$/,
  image: /^https:\/\/\S+\.(png|jpe?g|webp|gif)$/i,
  description: /^[\s\S]{10,200}$/,
};

function validateField(input) {
  if (!input) return true;

  const value = input.value.trim();
  const errorSpan = input.parentElement.querySelector(".error-message");
  let isValid = true;
  let message = "";

  switch (input.name) {
    case "id":
      if (!REGEX_RULES.id.test(value)) {
        isValid = false;
        message = "Format attendu : # suivi de 3 chiffres (ex: #013).";
      } else if (creatures.some((c) => c.id.toLowerCase() === value.toLowerCase())) {
        isValid = false;
        message = "Ce numéro existe déjà dans le Dex.";
      }
      break;

    case "name":
      if (!REGEX_RULES.name.test(value)) {
        isValid = false;
        message = "2 à 30 caractères (lettres, chiffres, espaces, ., ', -).";
      }
      break;

    case "type":
      if (value === "") {
        isValid = false;
        message = "Veuillez choisir un attribut.";
      }
      break;

    case "level":
      if (value === "") {
        isValid = false;
        message = "Veuillez choisir un niveau.";
      }
      break;

    case "stat1":
    case "stat2":
    case "stat3":
      const statNum = parseInt(value, 10);
      if (!REGEX_RULES.stat.test(value) || isNaN(statNum) || statNum < 0 || statNum > 999) {
        isValid = false;
        message = "Nombre entier entre 0 et 999.";
      }
      break;

    case "image":
      if (!REGEX_RULES.image.test(value)) {
        isValid = false;
        message = "Lien https valide (.png, .jpg, .jpeg, .webp, .gif).";
      }
      break;

    case "description":
      if (!REGEX_RULES.description.test(value)) {
        isValid = false;
        message = "La description doit contenir entre 10 et 200 caractères.";
      }
      break;
  }

  if (!isValid) {
    input.classList.add("!border-attribute-virus");
    input.classList.remove("!border-attribute-vaccine");
    if (errorSpan) errorSpan.textContent = message;
  } else {
    input.classList.remove("!border-attribute-virus");
    input.classList.add("!border-attribute-vaccine");
    if (errorSpan) errorSpan.textContent = "";
  }

  return isValid;
}

const formFields = [
  idInput,
  nameInput,
  typeSelect,
  levelSelect,
  stat1Input,
  stat2Input,
  stat3Input,
  imageInput,
  descriptionInput,
];

formFields.forEach((field) => {
  if (!field) return;

  field.addEventListener("keyup", () => {
    validateField(field);
  });

  field.addEventListener("input", () => {
    if (field.classList.contains("!border-attribute-virus")) {
      validateField(field);
    }
  });

  if (field.tagName === "SELECT") {
    field.addEventListener("change", () => {
      validateField(field);
    });
  }
});

if (creatureForm) {
  creatureForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let isAllValid = true;
    formFields.forEach((field) => {
      if (!validateField(field)) {
        isAllValid = false;
      }
    });

    if (!isAllValid) {
      alert("Veuillez corriger les champs invalides avant d'ajouter le Digimon.");
      return;
    }

    const newCreature = {
      id: idInput.value.trim(),
      name: nameInput.value.trim(),
      type: typeSelect.value,
      level: levelSelect.value.trim(),
      stats: {
        attack: parseInt(stat1Input.value.trim(), 10),
        defence: parseInt(stat2Input.value.trim(), 10),
        speed: parseInt(stat3Input.value.trim(), 10),
      },
      image: imageInput.value.trim(),
      description: descriptionInput.value.trim(),
    };
    // add local Storage
    window.localStorage.setItem("newCreature", JSON.stringify(newCreature));
    creatures.push(newCreature);
    applySearchAndFilter();
    showDetail(JSON.parse(localStorage.getItem("newCreature")));

    creatureForm.reset();
    formFields.forEach((field) => {
      field.classList.remove("!border-attribute-vaccine", "!border-attribute-virus");
      const errorSpan = field.parentElement.querySelector(".error-message");
      if (errorSpan) errorSpan.textContent = "";
    });

    alert(`Le Digimon ${newCreature.name} (${newCreature.id}) a été créé avec succès !`);
  });

  creatureForm.addEventListener("reset", () => {
    setTimeout(() => {
      formFields.forEach((field) => {
        field.classList.remove("!border-attribute-vaccine", "!border-attribute-virus");
        const errorSpan = field.parentElement.querySelector(".error-message");
        if (errorSpan) errorSpan.textContent = "";
      });
    }, 10);
  });
}

//
const teamList = document.querySelector("#team-list");
const teamCounter = document.querySelector("#team-counter");
const teamCountHeader = document.querySelector("#team-count");

function renderTeam() {
  if (teamCounter) teamCounter.textContent = team.length;
  if (teamCountHeader) teamCountHeader.textContent = team.length;

  if (!teamList) return;

  if (team.length === 0) {
    teamList.innerHTML = `
      <p id="empty-team-msg" class="py-6 text-center text-xs text-muted border-2 border-dashed border-line rounded-xl">
        Votre équipe est vide. Cliquez sur "Ajouter à l'équipe".
      </p>
    `;
  } else {
    teamList.innerHTML = team
      .map(
        (creature) => `
      <div class="flex items-center justify-between gap-3 p-2 bg-ground rounded-xl border border-line">
        <div class="flex items-center gap-2 min-w-0">
          <img src="${creature.image}" alt="${creature.name}" class="w-10 h-10 object-cover rounded-lg bg-brand-light p-1" />
          <div class="truncate">
            <p class="text-xs font-bold text-ink truncate">${creature.name}</p>
            <p class="font-mono text-[10px] text-muted">${creature.id} · ${creature.type}</p>
          </div>
        </div>
        <button
          type="button"
          data-action="remove-team"
          data-id="${creature.id}"
          aria-label="Retirer ${creature.name} de l'équipe"
          class="text-muted hover:text-attribute-virus font-bold p-1 rounded transition-colors">
          ✕
        </button>
      </div>
    `,
      )
      .join(" ");
  }

  updateTeamButtons();
}

function addToTeam(creatureId) {
  if (team.length >= 6) {
    // alert("Action refusée : Votre équipe est déjà complète (6 Digimon au maximum).");
    return;
  }

  const isAlreadyInTeam = team.some((c) => c.id === creatureId);
  if (isAlreadyInTeam) {
    // alert("Action refusée : Ce Digimon fait déjà partie de votre équipe (doublon interdit).");
    return;
  }

  const creatureToAdd = creatures.find((c) => c.id === creatureId);
  if (creatureToAdd) {
    team.push(creatureToAdd);
    renderTeam();
  }
}

function removeFromTeam(creatureId) {
  team = team.filter((c) => c.id !== creatureId);
  renderTeam();
}
//
if (grid) {
  grid.addEventListener("click", (e) => {
    const addBtn = e.target.closest('[data-action="add-team"]');
    if (addBtn) {
      if (addBtn.disabled) return;
      const creatureId = addBtn.getAttribute("data-id");
      addToTeam(creatureId);
      return;
    }

    const card = e.target.closest("article");
    if (card) {
      const creatureId = card.getAttribute("data-id");
      const selected = creatures.find((c) => c.id === creatureId);
      if (selected) {
        showDetail(selected);
      }
    }
  });
}

if (teamList) {
  teamList.addEventListener("click", (e) => {
    const removeBtn = e.target.closest('[data-action="remove-team"]');
    if (removeBtn) {
      const creatureId = removeBtn.getAttribute("data-id");
      removeFromTeam(creatureId);
    }
  });
}

if (detailPanel) {
  detailPanel.addEventListener("click", (e) => {
    const addBtn = e.target.closest('[data-action="add-team"]');
    if (addBtn) {
      if (addBtn.disabled) return;
      const creatureId = addBtn.getAttribute("data-id");
      addToTeam(creatureId);
    }
  });
}

renderTeam();
