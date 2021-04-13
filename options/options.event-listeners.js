const exportElem = document.querySelector(".export");
const importElem = document.querySelector(".import");
const fileElem = document.querySelector(".file-input");
const tableRefElem = document.querySelector(".config-table");
const addButtonRef = document.querySelector(".add-button");

fileElem.addEventListener("change", onImportFile, false);
importElem.addEventListener("click", () => fileElem.click(), false);
exportElem.addEventListener("click", onExportFile, false);
tableRefElem.addEventListener("click", upDownHandler);
addButtonRef.addEventListener("click", addVersion);
