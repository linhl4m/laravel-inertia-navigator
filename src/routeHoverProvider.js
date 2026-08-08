const vscode = require('vscode');
const {
    getRouteText,
    parseRoute
} = require('./routeParser');

/**
 * Creates a HoverProvider that shows a link to jump to the associated
 * Inertia page when hovering over a line containing a route call.
 * @returns {vscode.HoverProvider}
 */
function createRouteHoverProvider() {
    return {
        /**
         * Called by VS Code when the cursor hovers over a line.
         * Checks whether the line contains a recognizable route and
         * otherwise returns null so no hover is shown.
         */
        provideHover(document, position) {
            console.log("Hover!");
            const routeText = getRouteText(
                document,
                position.line
            );

            if (!routeText) {
                return null;
            }

            const route = parseRoute(routeText);

            if (!route) {
                return null;
            }

            const markdown = new vscode.MarkdownString();

            markdown.appendMarkdown(
                `[→ Go to Inertia Page](command:laravel-inertia-navigator.goToPage)`
            );

            markdown.isTrusted = true;

                const line = document.lineAt(position.line);

            const range = new vscode.Range(
                position.line,
                0,
                position.line,
                line.text.length
            );

            return new vscode.Hover(markdown, range);
        }
    };
}

module.exports = {
    createRouteHoverProvider
};