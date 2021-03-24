const azureBaseUrl = "https://dev.azure.com/slb1-swt/";
const swtBaseUrl = "https://slb1-swt.visualstudio.com/";

const sourcesConfig = [
    {
        name: "web-apps",
        versionContainerRef: document.getElementById("apps-version"),
        downloadPath:
            "a7e47f75-3058-4e37-85a8-4f7806df1f73/_apis/git/repositories/8486e446-ff57-4681-a956-75d537a37c16/items?path=%2Fweb-apps%2Finfo.json&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=master&resolveLfs=true&%24format=octetStream&api-version=5.0&download=true"
    },
    {
        name: "web-core",
        versionContainerRef: document.getElementById("core-version"),
        downloadPath:
            "a7e47f75-3058-4e37-85a8-4f7806df1f73/_apis/git/repositories/8486e446-ff57-4681-a956-75d537a37c16/items?path=%2Fweb-core%2Finfo.json&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=master&resolveLfs=true&%24format=octetStream&api-version=5.0&download=true"
    },
    {
        name: "core-identity-service",
        versionContainerRef: document.getElementById("identity-version"),
        downloadPath:
            "a7e47f75-3058-4e37-85a8-4f7806df1f73/_apis/git/repositories/8486e446-ff57-4681-a956-75d537a37c16/items?path=%2Fcore-identity-service%2Finfo.json&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=master&resolveLfs=true&%24format=octetStream&api-version=5.0&download=true"
    }
];

function showAlert(message, tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(tab.id, {
            code: `alert('${message}');`
        });
    });
}

async function onFetchVersion(versionContainerRef, source) {
    // Create a promise that resolves when chrome.runtime.onMessage fires
    const version = new Promise((resolve) => {
        const listener = (message) => {
            if (message.source === source) {
                chrome.runtime.onMessage.removeListener(listener);
                resolve(message.version);
            }
        };
        chrome.runtime.onMessage.addListener(listener);
    });

    versionContainerRef.innerText = await version;
}

function getFetchAndSendFunctionCode(downloadPath) {
    return `
    (async function() { 
        const version = await fetch("${downloadPath}", {credentials: "include"})
            .then((response) => response.json())
            .then((file) => file.version);

        chrome.runtime.sendMessage({version, source: "${downloadPath}"});
    })()
    `;
}

function fetchAndRenderVersionForSource(tab, source, versionContainerRef) {
    chrome.tabs.executeScript(
        tab.id,
        {
            code: getFetchAndSendFunctionCode(source)
        },
        () => onFetchVersion(versionContainerRef, source)
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

chrome.tabs.query({}, function (tabs) {
    const tab = getTabWithCredentials(tabs);
    const baseUrl = getBaseUrl(tab.url);

    sourcesConfig.forEach((config) =>
        fetchAndRenderVersionForSource(
            tab,
            baseUrl + config.downloadPath,
            config.versionContainerRef
        )
    );
});

// TODO: handle png transparent
