const vscode = require('vscode');
const { goToPage } = require('./src/goToPage');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const disposable =
        vscode.commands.registerCommand(
            'laravel-inertia-navigator.goToPage',
            goToPage
        );

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};