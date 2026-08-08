/**
 * @param {string} line
 * @returns {{ controller: string, action: string } | null}
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
        action: match[2]
    };
}

module.exports = {
    parseRoute
};