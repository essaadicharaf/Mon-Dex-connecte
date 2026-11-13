import { getCreatureByName, getCreatures } from "./services/api.js";
import { clearLastSearch, getFavorites, getLastSearch, saveLastSearch, toggleFavorite } from "./storage.js";
import {
  renderDetail,
  renderDetailError,
  renderDetailLoading,
  renderGrid,
  renderGridEmpty,
  renderGridError,
  renderGridLoading,
  resetDetail,
  updateCounter,
} from "./ui.js";
//-----------------------------------------------//
// part 1  - display creature and add btn to add 20 creature more
//-----------------------------------------------//
let allCreaturesLoad = [];
let currentPage = 0;
let currentFilter = "all";
const btnLoadMore = document.getElementById("load-more-btn");
const allBtnFilters = document.querySelectorAll("#filters button");
const grid = document.querySelector("#grid");
let currentSearchedCreature = null;
// fillter by type
function filter() {
  if (currentFilter === "favorites") {
    if (btnLoadMore) btnLoadMore.classList.add("hidden");
    const favorites = getFavorites();
    renderGrid(favorites, false);
    return;
  } else {
    const filtered = allCreaturesLoad.filter((c) => {
      const matchType = currentFilter === "all" || c.type === currentFilter;
      return matchType;
    });
    renderGrid(filtered, false);
    if (btnLoadMore) btnLoadMore.classList.remove("hidden");
  }
}
//
allBtnFilters.forEach((btn) => {
  btn.addEventListener("click", () => {
    allBtnFilters.forEach((b) => b.classList.remove("bg-brand", "border-brand", "text-white"));
    btn.classList.add("bg-brand", "border-brand", "text-white");
    currentFilter = btn.getAttribute("data-type") || "all";

    if (searchInput) searchInput.value = "";
    clearLastSearch();
    currentSearchedCreature = null;

    if (currentFilter !== "favorites" && allCreaturesLoad.length === 0) {
      load();
    } else {
      filter();
    }
  });
});
// get 20 creatures in fetch and current page + 1
async function load() {
  if (btnLoadMore) {
    btnLoadMore.disabled = true;
    btnLoadMore.textContent = "Chargement...";
  }
  if (currentPage === 0) {
    renderGridLoading();
  }
  try {
    const newCreatures = await getCreatures(20, currentPage);
    allCreaturesLoad.push(...newCreatures);
    updateCounter(allCreaturesLoad.length);
    if (currentFilter === "all") {
      renderGrid(newCreatures, currentPage > 0);
    } else {
      filter();
    }
    currentPage++;
  } catch (error) {
    console.error("error :", error);
    if (currentPage === 0) {
      renderGridError();
    }
  } finally {
    if (btnLoadMore) {
      btnLoadMore.disabled = false;
      btnLoadMore.textContent = "Charger plus";
    }
  }
}
if (btnLoadMore) {
  btnLoadMore.addEventListener("click", load);
}
// load();
//-----------------------------------------------------//
// part 2 - search by name and detailes of creature
//----------------------------------------------------//
//searching by name in input
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search");
const clearSearchBtn = document.querySelector("#btn-clear-search");
async function searchDigimon() {
  const query = searchInput.value.trim();
  if (query === "") {
    clearLastSearch();
    currentSearchedCreature = null;
    if (btnLoadMore) btnLoadMore.classList.remove("hidden");
    filter();
    return;
  }
  saveLastSearch(query);
  if (btnLoadMore) btnLoadMore.classList.add("hidden");
  renderGridLoading();
  const submitBtn = searchForm?.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  try {
    const creature = await getCreatureByName(query);
    currentSearchedCreature = creature;
    renderGrid([creature], false);
  } catch (error) {
    currentSearchedCreature = null;
    if (error.status === 404) {
      renderGridEmpty(query);
    } else {
      renderGridError();
    }
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchDigimon();
  });
}
if (clearSearchBtn) {
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearLastSearch();
    currentSearchedCreature = null;
    if (btnLoadMore) btnLoadMore.classList.remove("hidden");
    if (allCreaturesLoad.length === 0) {
      load();
    } else {
      filter();
    }
  });
}
if (searchInput) {
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      clearLastSearch();
      currentSearchedCreature = null;
      if (btnLoadMore) btnLoadMore.classList.remove("hidden");

      if (allCreaturesLoad.length === 0) {
        load();
      } else {
        filter();
      }
    }
  });
}
// detail pannel
const detailPanel = document.querySelector("#detail");

// load creature
if (grid) {
  grid.addEventListener("click", (e) => {
    if (e.target.closest("#btn-retry-grid")) {
      if (searchInput && searchInput.value.trim() !== "") {
        searchDigimon();
      } else {
        load();
      }
      return;
    }

    const favBtn = e.target.closest('[data-action="toggle-fav"]');
    if (favBtn) {
      const id = favBtn.getAttribute("data-id");
      const creature =
        allCreaturesLoad.find((c) => c.id === id) ||
        getFavorites().find((c) => c.id === id) ||
        (currentSearchedCreature && currentSearchedCreature.id === id ? currentSearchedCreature : null);

      if (creature) {
        toggleFavorite(creature);
        if (searchInput && searchInput.value.trim() !== "" && currentSearchedCreature) {
          renderGrid([currentSearchedCreature], false);
        } else {
          filter();
        }
      }
      return;
    }

    if (e.target.closest('[data-action="add-team"]')) return;

    const card = e.target.closest("article");
    if (!card) return;

    const creatureId = card.getAttribute("data-id");
    openDetail(creatureId);
  });
}
//
if (detailPanel) {
  detailPanel.addEventListener("click", (e) => {
    if (e.target.closest("#btn-close-detail")) {
      resetDetail();
      return;
    }

    const retryBtn = e.target.closest("#btn-retry-detail");
    if (retryBtn) {
      const id = retryBtn.getAttribute("data-id");
      openDetail(id);
    }
  });
}
//

const savedSearch = getLastSearch();
if (savedSearch) {
  if (searchInput) searchInput.value = savedSearch;
  searchDigimon();
} else {
  load();
}
//
let isLoadingDetail = false;

async function openDetail(creatureId) {
  if (isLoadingDetail) return;
  isLoadingDetail = true;
  renderDetailLoading();
  try {
    const creature = await getCreatureByName(creatureId);
    renderDetail(creature);
  } catch (error) {
    renderDetailError(creatureId);
  } finally {
    isLoadingDetail = false;
  }
}
