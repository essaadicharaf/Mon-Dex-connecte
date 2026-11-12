import { getCreatureByName, getCreatures } from "./services/api.js";
import { renderGrid, updateCounter } from "./ui.js";
//-----------------------------------------------//
// part 1  - display creature and add btn to add 20 creature more
//-----------------------------------------------//
let allCreaturesLoad = [];
let currentPage = 0;
let currentFilter = "all";
const btnLoadMore = document.getElementById("load-more-btn");
const allBtnFilters = document.querySelectorAll("#filters button");
// fillter by type
function filter() {
  const filtered = allCreaturesLoad.filter((c) => {
    const matchType = currentFilter === "all" || c.type === currentFilter;
    return matchType;
  });
  renderGrid(filtered, false);
}
//
allBtnFilters.forEach((btn) => {
  btn.addEventListener("click", () => {
    allBtnFilters.forEach((b) => b.classList.remove("bg-brand", "border-brand", "text-white"));
    btn.classList.add("bg-brand", "border-brand", "text-white");
    currentFilter = btn.getAttribute("data-type") || "all";
    filter();
  });
});
// get 20 creatures in fetch and current page + 1
async function loadBatch() {
  if (btnLoadMore) {
    btnLoadMore.disabled = true;
    btnLoadMore.textContent = "Chargement...";
  }
  try {
    const newCreatures = await getCreatures(20, currentPage);
    allCreaturesLoad.push(...newCreatures);
    updateCounter(allCreaturesLoad.length);
    if (currentFilter === "all") {
      renderGrid(newCreatures, true);
    } else {
      filter();
    }
    currentPage++;
  } catch (error) {
    console.error("error :", error);
  } finally {
    if (btnLoadMore) {
      btnLoadMore.disabled = false;
      btnLoadMore.textContent = "Charger plus";
    }
  }
}
if (btnLoadMore) {
  btnLoadMore.addEventListener("click", loadBatch);
}
loadBatch();
//-----------------------------------------------------//
// part 2 - search by name and detailes of creature
//----------------------------------------------------//
//searching by name in input
const searchInput = document.querySelector("#search");
if (searchInput) {
  searchInput.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;
    const query = searchInput.value.trim();
    if (query === "") {
      if (btnLoadMore) btnLoadMore.classList.remove("hidden");
      filter();
      return;
    }
    if (btnLoadMore) btnLoadMore.classList.add("hidden");
    try {
      const creature = await getCreatureByName(query);
      renderGrid([creature], false);
    } catch (error) {
      renderGrid([], false);
    }
  });
}
// getCreatureByName("Agumon").then((data) => console.log(data));
