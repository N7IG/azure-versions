function getConfigFromStorage() {
    return new Promise(function (resolve) {
        chrome.storage.sync.get(["sourcesConfig"], function (result) {
            try {
                const sourcesConfig = JSON.parse(result.sourcesConfig);
                resolve(sourcesConfig);
            } catch (error) {
                resolve([]);
            }
        });
    });
}
