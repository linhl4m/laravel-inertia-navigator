/**
 * @param {string} controller
 * @returns {string}
 */
function resolveControllerPath(controller) {
    return `app/Http/Controllers/${controller}.php`;
}

/**
 * @param {string} controllerText
 * @param {string} action
 * @returns {number | null}
 */
function findControllerActionLine(controllerText, action) {
    const lines = controllerText.split('\n');

    const pattern = new RegExp(
        `function\\s+${action}\\s*\\(`
    );

    const index = lines.findIndex((line) =>
        pattern.test(line)
    );

    return index === -1 ? null : index;
}

/**
 * @param {string} controllerText
 * @param {number} actionLine
 * @returns {string | null}
 */
function findInertiaPage(controllerText, actionLine) {
    const lines = controllerText.split('\n');

    for (let i = actionLine; i < lines.length; i++) {
        const line = lines[i];

        const match = line.match(
            /Inertia::render\(['"]([^'"]+)['"]/
        );

        if (match) {
            return match[1];
        }

        const isNextMethod =
            i > actionLine &&
            /^\s*public function\s+/.test(line);

        if (isNextMethod) {
            break;
        }
    }

    return null;
}

module.exports = {
    resolveControllerPath,
    findControllerActionLine,
    findInertiaPage
};