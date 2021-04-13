const azureBaseUrl = "https://dev.azure.com/slb1-swt/";
const swtBaseUrl = "https://slb1-swt.visualstudio.com/";

const tableRef = document.querySelector(".main-versions-table");
const settingsButton = document.querySelector(".settings-button");

settingsButton.addEventListener("click", () => {
    chrome.tabs.create({ url: "../options/options.html" });
});

function showAlert(message, tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(tab.id, {
            code: `alert('${message}');`
        });
    });
}

async function onFetchVersion(name, source) {
    // Create a promise that resolves when chrome.runtime.onMessage fires
    const versionPromise = new Promise((resolve) => {
        const listener = (message) => {
            if (message.source === source) {
                chrome.runtime.onMessage.removeListener(listener);
                console.log("message", message);
                resolve(message.version);
            }
        };
        chrome.runtime.onMessage.addListener(listener);
    });
    const versionTd = createAndAttachVersionRowElement(name);
    const version = await versionPromise;

    versionTd.innerText = version.replace("{{", "").replace("}}", "");
}

function getFetchAndSendFunctionCode(downloadPath) {
    console.log("downloadPath", downloadPath);
    return `
        (async function() { 
            const version = await fetch("${downloadPath}", {credentials: "include"})
                .then((response) => response.json())
                .then((file) => file.version);

            chrome.runtime.sendMessage({version, source: "${downloadPath}"});
        })()`;
}

function fetchAndRenderVersionForSource(tab, source, name) {
    chrome.tabs.executeScript(
        tab.id,
        {
            code: getFetchAndSendFunctionCode(source)
        },
        () => onFetchVersion(name, source)
    );
}

/**
 * Returns base url of current tab for info.json request if it is Azure DevOps domain. Else returns "other".
 * @returns {string} azureBaseUrl | swtBaseUrl | "other"
 */
function getBaseUrl(url) {
    if (!url) {
        return undefined;
    }
    return url.includes(azureBaseUrl)
        ? azureBaseUrl
        : url.includes(swtBaseUrl)
        ? swtBaseUrl
        : "other";
}

function getAzureTab(tabs) {
    return tabs.find((tab) => isAzureUrl(tab.url));
}

function isAzureUrl(url) {
    return url && getBaseUrl(url) !== "other";
}

function getActiveTab(tabs) {
    return tabs.find((tab) => !!tab.active);
}

function getTabWithCredentials(tabs) {
    const activeTab = getActiveTab(tabs);

    if (isAzureUrl(activeTab.url)) {
        return activeTab;
    }

    return getAzureTab(tabs);
}

function setSourcesConfig() {
    chrome.storage.sync.get(["sourcesConfig"], function (result) {
        const sourcesConfig = JSON.parse(result.sourcesConfig);

        if (!sourcesConfig || sourcesConfig.length === 0) {
            createImportButton();
        }

        startExecution(sourcesConfig);
    });
}

function createImportButton() {
    const buttonEl = document.createElement("button");
    buttonEl.className = "import-button";
    buttonEl.innerText = "Import config file";

    tableRef.appendChild(buttonEl);
}

function createAndAttachVersionRowElement(name) {
    const newRow = document.createElement("tr");
    newRow.className = "version-row";
    const nameTd = document.createElement("td");
    const versionTd = document.createElement("td");

    nameTd.innerText = name;
    versionTd.innerText = "Loading...";

    newRow.appendChild(nameTd);
    newRow.appendChild(versionTd);
    tableRef.appendChild(newRow);

    return versionTd;
}

function startExecution(sourcesConfig) {
    chrome.tabs.query({}, function (tabs) {
        const tab = getTabWithCredentials(tabs);
        const baseUrl = getBaseUrl(tab.url);

        sourcesConfig.forEach((config) =>
            fetchAndRenderVersionForSource(
                tab,
                baseUrl + config.downloadPath,
                config.name
            )
        );
    });
}

setSourcesConfig();

// TODO: add url validation: info.json + version
// TODO: import validation
// TODO: handle errors
// TODO: improve UI
// TODO: add hints
