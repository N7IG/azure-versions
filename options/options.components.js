// functions that build return UI components as HTML strings without knowing where they will be used

/**
 * Returns table row with headers as HTML string
 */
function getMainTableHeader() {
    return `
    <tr>
        <th class="move-td"></th>
        <th class="name-td">Name</th>
        <th class="path-td">File URL</th>
        <th class="action-td"></th>
    </tr>`;
}

/**
 * Returns up/down arrows component as HTML string
 * Takes name and pageUrl to attach id for buttons
 */
function getCaretsComponent(name, pageUrl) {
    return `<div>${getCaretUp(name + pageUrl)}${getCaretDown(
        name + pageUrl
    )}</div>`;
}

/**
 * Returns up arrow component as HTML string
 * @param {string} data - name + pageUrl used as id
 */
function getCaretUp(data) {
    return `<svg
        data-id="${data}"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        class="bi bi-caret-up"
        viewBox="0 0 16 16"
    >
        <path d="M3.204 11h9.592L8 5.519 3.204 11zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659z" />
    </svg>`;
}

/**
 * Returns down arrow component as HTML string
 * @param {string} data - name + pageUrl used as id
 */
function getCaretDown(data) {
    return `<svg
        data-id="${data}"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        class="bi bi-caret-down"
        viewBox="0 0 16 16"
    >
        <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z" />
    </svg>`;
}
