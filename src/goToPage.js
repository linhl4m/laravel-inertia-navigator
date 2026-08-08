const vscode = require('vscode');
const {
    resolveControllerPath,
    findControllerActionLine,
    findInertiaPage
} = require('./controllerResolver');
const {
    resolveInertiaPagePath
} = require('./pageResolver');
const { parseRoute } = require('./routeParser');

async function goToPage() {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage(
            'No file is currently open.'
        );
        return;
    }

    const currentLine = editor.document.lineAt(
        editor.selection.active.line
    ).text;

    const route = parseRoute(currentLine);

    if (!route) {
        vscode.window.showErrorMessage(
            'No Laravel controller route found.'
        );
        return;
    }

    const workspaceFolder =
        vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
        vscode.window.showErrorMessage(
            'No workspace folder is open.'
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

        const actionLine = findControllerActionLine(
            controllerDocument.getText(),
            route.action
        );

        if (actionLine === null) {
            vscode.window.showErrorMessage(
                `Action "${route.action}" not found.`
            );
            return;
        }

        const inertiaPage = findInertiaPage(
            controllerDocument.getText(),
            actionLine
        );

        if (!inertiaPage) {
            vscode.window.showErrorMessage(
                'No Inertia page found in controller action.'
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

        await vscode.window.showTextDocument(
            pageDocument
        );

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