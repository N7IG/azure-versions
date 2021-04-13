/**
 * Checks if config has item with item's url
 * @returns {boolean}
 */
function isDuplicateByUrl(itemToCheck, config) {
    return config.some(
        (configItem) => configItem.downloadPath === itemToCheck.downloadPath
    );
}
