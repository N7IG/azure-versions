async function readFile(inputElem) {
    return new Promise(function (resolve) {
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
            resolve(JSON.parse(event.target.result));
        });
        reader.onerror = (e) => {
            alert("Error reading file", e);
        };
        reader.readAsText(inputElem.files[0], "UTF-8");
    });
}
