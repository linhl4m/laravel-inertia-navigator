const vscode = require('vscode');
const { goToPage } = require('./src/goToPage');
const {
    parseRoute,
    getRouteText
} = require('./src/routeParser');
const {
    createRouteHoverProvider
} = require('./src/routeHoverProvider');

/**
 * Registers the "go to page" command and the route hover provider
 * when the extension is activated.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const disposable = vscode.commands.registerCommand(
        'laravel-inertia-navigator.goToPage',
        async () => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showErrorMessage(
                    'No file is currently open.'
                );
                return;
            }

            const routeText = getRouteText(
                editor.document,
                editor.selection.active.line
            );

			if (!routeText) {
                return;
            }

            const route = parseRoute(routeText);

            if (!route) {
                vscode.window.showErrorMessage(
                    'No Laravel controller route found.'
                );
                return;
            }

            await goToPage(route);
        }
    );

	const hoverProvider =
		vscode.languages.registerHoverProvider(
			'php',
			createRouteHoverProvider()
		);

    context.subscriptions.push(disposable, hoverProvider);
}

/** Called by VS Code when the extension is deactivated. */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};