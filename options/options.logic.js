// functions that contain logic

/**
 * Handler for clicking up/down arrows for moving table rows
 * @param {MouseEvent} event
 */
function upDownHandler(event) {
    let target = event.target;

    if (target.tagName === "path") {
        // if user clicks on path inside svg - select svg
        target = target.parentElement;
    }
    if (target.classList.contains("bi-caret-up")) {
        moveUp(target.dataset.id);
    }
    if (target.classList.contains("bi-caret-down")) {
        moveDown(target.dataset.id);
    }
}

/**
 * Handler for export button click
 */
async function onExportFile() {
    const sourcesConfig = await getConfigFromStorage();
    downloadFile(
        "azure-versions-config.json",
        sourcesConfig.map(({ name, pageUrl }) => ({ name, pageUrl }))
    );
}

/**
 * Handler for import button click
 */
async function onImportFile() {
    const inputElement = this;
    const sourcesConfigRead = await readFile(inputElement);
    await setConfigAndUpdate(sourcesConfigRead.map(mapToStorableItem));
}

function renderExistingConfig(sourcesConfig) {
    clearTable();

    sourcesConfig.forEach((config) =>
        createAddVersionRow(config.name, config.pageUrl)
    );
}

/**
 * Add new version row from user inputs
 */
async function addVersion() {
    try {
        const newConfigItem = mapToStorableItem(getNewRowInputs());
        const sourcesConfig = await getConfigFromStorage();
        if (isDuplicateByUrl(newConfigItem, sourcesConfig)) {
            throw new Error("This file already exists in the configuration.");
        }

        await setConfigAndUpdate([...sourcesConfig, newConfigItem]);
        clearNewRowInputs();
    } catch (error) {
        alert(error);
    }
}

/**
 * Remove config item passed as parameter to the end of stored config array
 * @param {{name: string, pageUrl: string, downloadPath: string}} itemToDelete
 */
async function removeVersionFromConfig(itemToDelete) {
    const sourcesConfig = await getConfigFromStorage();
    const newSourcesConfig = sourcesConfig.filter(
        (configItem) =>
            configItem.name !== itemToDelete.name &&
            configItem.pageUrl !== itemToDelete.pageUrl
    );
    await setConfigAndUpdate(newSourcesConfig);
}

/**
 * Moves row with passed data down by incrementing its position is stored config
 * @param {string} data - name + pageUrl concatenation used as id
 */
async function moveDown(data) {
    const sourcesConfig = await getConfigFromStorage();
    const elementToReplace = sourcesConfig.find((el) => {
        return el.name + el.pageUrl === data;
    });
    const replaceIndex = sourcesConfig.indexOf(elementToReplace);

    if (replaceIndex < sourcesConfig.length - 1) {
        const newSourcesConfig = [...sourcesConfig];
        newSourcesConfig.splice(replaceIndex, 1);
        newSourcesConfig.splice(replaceIndex + 1, 0, elementToReplace);
        await setConfigAndUpdate(newSourcesConfig);
    }
}

/**
 * Moves row with passed data up by decrementing its position is stored config
 * @param {string} data - name + pageUrl concatenation used as id
 */
async function moveUp(data) {
    const sourcesConfig = await getConfigFromStorage();
    const elementToReplace = sourcesConfig.find((el) => {
        return el.name + el.pageUrl === data;
    });
    const replaceIndex = sourcesConfig.indexOf(elementToReplace);

    if (replaceIndex > 0) {
        const newSourcesConfig = [...sourcesConfig];
        newSourcesConfig.splice(replaceIndex, 1);
        newSourcesConfig.splice(replaceIndex - 1, 0, elementToReplace);
        await setConfigAndUpdate(newSourcesConfig);
    }
}

/**
 * Sets new config to storage and re-renders the table
 * @param {{name: string, pageUrl: string, downloadPath: string}} config
 */
async function setConfigAndUpdate(config) {
    await setConfigToStorage(config);
    renderExistingConfig(config);
}

/**
 * Initial config render
 */
async function displaySourcesConfig() {
    const sourcesConfig = await getConfigFromStorage();
    if (!sourcesConfig || sourcesConfig.length === 0) {
        // import
    }

    renderExistingConfig(sourcesConfig);
}

displaySourcesConfig();
