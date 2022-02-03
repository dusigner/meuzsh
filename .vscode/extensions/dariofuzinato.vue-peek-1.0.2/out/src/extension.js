'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const PeekFileDefinitionProvider_1 = require("./PeekFileDefinitionProvider");
const languageConfiguration = {
    wordPattern: /(\w+((-\w+)+)?)/
};
function activate(context) {
    const configParams = vscode.workspace.getConfiguration('vue-peek');
    const supportedLanguages = configParams.get('supportedLanguages');
    const targetFileExtensions = configParams.get('targetFileExtensions');
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(supportedLanguages, new PeekFileDefinitionProvider_1.default(targetFileExtensions)));
    /* Provides way to get selected text even if there is dash
     * ( must have fot retrieving component name )
     */
    context.subscriptions.push(vscode.languages.setLanguageConfiguration('vue', languageConfiguration));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map