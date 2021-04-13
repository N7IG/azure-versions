function getConfigFromStorage() {
    return new Promise(function (resolve) {
        chrome.storage.sync.get(["sourcesConfig"], function (result) {
            const sourcesConfig = JSON.parse(result.sourcesConfig);
            resolve(sourcesConfig);
        });
    });
}
