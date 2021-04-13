// functions that work with HTML layout and can modify it

const tableRef = document.querySelector(".config-table");
const newNameInputRef = document.querySelector(".new-name-input");
const newPathInputRef = document.querySelector(".new-path-input");

function createAddVersionRow(name, pageUrl) {
    const newRow = document.createElement("tr");
    const buttonTd = document.createElement("td");
    const deleteButton = document.createElement("button");

    deleteButton.className = "config-tr delete-button hide-unhovered";
    deleteButton.innerText = "Delete";
    newRow.className = "delete-tr";
    newRow.innerHTML = `
        <td class="caret-td hide-unhovered">${getCaretsComponent(
            name,
            pageUrl
        )}</td>
        <td class="name-td"><input disabled type="text" value="${name}" /></td>
        <td class="path-td"><input disabled type="text" value="${pageUrl}"/></td>
    `;
    buttonTd.appendChild(deleteButton);
    newRow.appendChild(buttonTd);

    deleteButton.onclick = () =>
        removeVersionFromConfig({
            name,
            pageUrl
        });

    tableRef.appendChild(newRow);
}

/**
 * Clears main table from version rows
 */
function clearTable() {
    tableRef.innerHTML = getMainTableHeader();
}

/**
 * Clears user inputs for adding new version row
 */
function clearNewRowInputs() {
    newNameInputRef.value = "";
    newPathInputRef.value = "";
}

/**
 * Get user inputs for adding new version row
 */
function getNewRowInputs() {
    return {
        name: newNameInputRef.value,
        pageUrl: newPathInputRef.value
    };
}
