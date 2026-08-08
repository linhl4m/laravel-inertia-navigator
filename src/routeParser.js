/**
 * Extracts the controller class and method from a Laravel
 * `[Controller::class, 'method']` route action string.
 * @param {string} line
 * @returns {{ controller: string, method: string } | null}
 */
function parseRoute(line) {
    const match = line.match(
        /\[(\w+)::class,\s*['"](\w+)['"]\]/
    );

    if (!match) {
        return null;
    }

    return {
        controller: match[1],
        method: match[2]
    };
}

/**
 * Collects the full text of the `Route::get(...)` statement surrounding
 * the given line, since a route definition may span multiple lines.
 * @param {import('vscode').TextDocument} document
 * @param {number} currentLine
 * @returns {string | null}
 */
function getRouteText(document, currentLine) {
    let startLine = currentLine;
    let endLine = currentLine;

    while (startLine >= 0) {
        const line = document.lineAt(startLine).text;

        if (line.includes('Route::get')) {
            break;
        }

        if (line.includes('Route::')) {
            return null;
        }

        startLine--;
    }

    if (startLine < 0) {
        return null;
    }

    while (endLine < document.lineCount) {
        const line = document.lineAt(endLine).text;

        if (line.includes(';')) {
            break;
        }

        endLine++;
    }

    if (endLine >= document.lineCount) {
        return null;
    }

    const lines = [];

    for (let i = startLine; i <= endLine; i++) {
        lines.push(document.lineAt(i).text);
    }

    return lines.join(' ');
}

module.exports = {
    parseRoute,
    getRouteText
};