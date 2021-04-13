function setConfigToStorage(sourcesConfig) {
    return new Promise(function (resolve) {
        chrome.storage.sync.set(
            {
                sourcesConfig: JSON.stringify(sourcesConfig)
            },
            () => resolve()
        );
    });
}
