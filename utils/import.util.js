async function readConfigFile(inputElem) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
            const result = JSON.parse(event.target.result);
            if (!isConfigValid(result)) {
                reject("File is not valid.");
            }
            resolve(result);
        });
        reader.onerror = (e) => {
            reject("Error reading file:" + e);
        };
        reader.readAsText(inputElem.files[0], "UTF-8");
    });
}

function isConfigValid(config) {
    return (
        Array.isArray(config) &&
        config.every((item) => item.name && item.pageUrl)
    );
}
