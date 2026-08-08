const vscode = require('vscode');
const {
    resolveControllerPath,
    findControllerMethodLine,
    findInertiaPage
} = require('./controllerResolver');
const {
    resolveInertiaPagePath
} = require('./pageResolver');

/**
 * Navigates from a route action to the Inertia page it renders: opens
 * the controller, locates the method, resolves the rendered page, and
 * opens that file in the editor.
 * @param {{ controller: string, method: string }} route
 */
async function goToPage(route) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage(
            'No file is currently open.'
        );
        return;
    }

    const workspaceFolder =
        vscode.workspace.getWorkspaceFolder(
            editor.document.uri
        );

    if (!workspaceFolder) {
        vscode.window.showErrorMessage(
            'Current file is not inside a workspace.'
        );
        return;
    }

    try {
        const controllerPath =
            resolveControllerPath(route.controller);

        const controllerUri = vscode.Uri.joinPath(
            workspaceFolder.uri,
            controllerPath
        );

        const controllerDocument =
            await vscode.workspace.openTextDocument(
                controllerUri
            );

        const methodLine = findControllerMethodLine(
            controllerDocument.getText(),
            route.method
        );

        if (methodLine === null) {
            vscode.window.showErrorMessage(
                `Method "${route.method}" not found.`
            );
            return;
        }

        const inertiaPage = findInertiaPage(
            controllerDocument.getText(),
            methodLine
        );

        if (!inertiaPage) {
            vscode.window.showErrorMessage(
                'No Inertia page found in controller method.'
            );
            return;
        }

        const pagePath =
            resolveInertiaPagePath(inertiaPage);

        const pageUri = vscode.Uri.joinPath(
            workspaceFolder.uri,
            pagePath
        );

        const pageDocument =
            await vscode.workspace.openTextDocument(pageUri);

        await vscode.window.showTextDocument(pageDocument);

    } catch (error) {
        console.error(error);

        vscode.window.showErrorMessage(
            'Could not navigate to Inertia page.'
        );
    }
}

module.exports = {
    goToPage
};