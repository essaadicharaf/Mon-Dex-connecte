import { getCreatures } from "./services/api.js";
import { renderGrid, updateCounter } from "./ui.js";
let allCreaturesLoad = [];
let currentPage = 0;
let currentFilter = "all";
const btnLoadMore = document.getElementById("load-more-btn");
const allBtnFilters = document.querySelectorAll("#filters button");
//
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
loadBatch()



