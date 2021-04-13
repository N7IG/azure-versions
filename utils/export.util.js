function downloadFile(name, content) {
    console.log("name", name);
    console.log("content", content);
    var element = document.createElement("a");
    element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," +
            encodeURIComponent(JSON.stringify(content, null, 2))
    );
    element.setAttribute("download", name);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
