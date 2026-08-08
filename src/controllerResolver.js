/**
 * Maps a controller class name to its file path within the Laravel
 * project's default controller directory.
 * @param {string} controller
 * @returns {string}
 */
function resolveControllerPath(controller) {
    return `app/Http/Controllers/${controller}.php`;
}

/**
 * Finds the line number where the given method is declared in the
 * controller's source, by matching its `function` signature.
 * @param {string} controllerText
 * @param {string} method
 * @returns {number | null}
 */
function findControllerMethodLine(controllerText, method) {
    const lines = controllerText.split('\n');

    const pattern = new RegExp(
        `function\\s+${method}\\s*\\(`
    );

    const index = lines.findIndex((line) =>
        pattern.test(line)
    );

    return index === -1 ? null : index;
}

/**
 * Scans forward from a method's declaration line for its
 * `Inertia::render('Page')` call, stopping once the next method
 * declaration is reached so it doesn't match a page from another method.
 * @param {string} controllerText
 * @param {number} methodLine
 * @returns {string | null}
 */
function findInertiaPage(controllerText, methodLine) {
    const lines = controllerText.split('\n');

    for (let i = methodLine; i < lines.length; i++) {
        const line = lines[i];

        const match = line.match(
            /Inertia::render\(['"]([^'"]+)['"]/
        );

        if (match) {
            return match[1];
        }

        const isNextMethod =
            i > methodLine &&
            /^\s*public function\s+/.test(line);

        if (isNextMethod) {
            break;
        }
    }

    return null;
}

module.exports = {
    resolveControllerPath,
    findControllerMethodLine,
    findInertiaPage
};