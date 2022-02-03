"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = exports.deactivate = exports.onCommand = void 0;
const path_1 = require("path");
const vscode_1 = require("vscode");
const parse_lcov_1 = require("./parse-lcov");
const DEFAULT_SEARCH_CRITERIA = "coverage/lcov*.info";
exports.onCommand = noop;
function deactivate() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.onCommand = noop;
    });
}
exports.deactivate = deactivate;
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const packageInfo = require((0, path_1.join)(context.extensionPath, "package.json"));
        const diagnostics = vscode_1.languages.createDiagnosticCollection("coverage");
        const statusBar = vscode_1.window.createStatusBarItem();
        const hideCommand = vscode_1.commands.registerCommand(`${packageInfo.name}.hide`, onHideCoverage);
        const showCommand = vscode_1.commands.registerCommand(`${packageInfo.name}.show`, onShowCoverage);
        const coverageByFile = new Map();
        let showCoverage = true;
        const config = vscode_1.workspace.getConfiguration("markiscodecoverage");
        const configSearchCriteria = config.has("searchCriteria") && config.get("searchCriteria");
        const searchCriteria = configSearchCriteria && typeof configSearchCriteria === "string"
            ? configSearchCriteria
            : DEFAULT_SEARCH_CRITERIA;
        const workspaceFolders = vscode_1.workspace.workspaceFolders;
        // Register watchers for file changes on coverage files to re-run the coverage parser
        if (workspaceFolders) {
            for (const folder of workspaceFolders) {
                const pattern = new vscode_1.RelativePattern(folder.uri.fsPath, searchCriteria);
                const watcher = vscode_1.workspace.createFileSystemWatcher(pattern);
                watcher.onDidChange(() => findDiagnostics(folder));
                watcher.onDidCreate(() => findDiagnostics(folder));
                watcher.onDidDelete(() => findDiagnostics(folder));
            }
        }
        context.subscriptions.push(diagnostics, statusBar, showCommand, hideCommand);
        // Update status bar on changes to any open file
        vscode_1.workspace.onDidChangeTextDocument((e) => {
            if (e) {
                diagnostics.delete(e.document.uri);
                showStatus();
            }
        });
        vscode_1.workspace.onDidOpenTextDocument(() => {
            showStatus();
        });
        vscode_1.workspace.onDidCloseTextDocument(() => {
            showStatus();
        });
        vscode_1.window.onDidChangeActiveTextEditor(() => {
            showStatus();
        });
        // Run the main routine at activation time as well
        yield findDiagnosticsInWorkspace();
        exports.onCommand = function onCommand(cmd) {
            return __awaiter(this, void 0, void 0, function* () {
                switch (cmd) {
                    case `${packageInfo.name}.hide`:
                        return onHideCoverage();
                    case `${packageInfo.name}.show`:
                        return onShowCoverage();
                }
            });
        };
        function onHideCoverage() {
            return __awaiter(this, void 0, void 0, function* () {
                showCoverage = false;
                diagnostics.clear();
            });
        }
        function onShowCoverage() {
            return __awaiter(this, void 0, void 0, function* () {
                showCoverage = true;
                yield findDiagnosticsInWorkspace();
            });
        }
        function findDiagnosticsInWorkspace() {
            return __awaiter(this, void 0, void 0, function* () {
                if (workspaceFolders) {
                    yield Promise.all(workspaceFolders.map(findDiagnostics));
                }
            });
        }
        // Finds VSCode diagnostics to display based on a coverage file specified by the search pattern in each workspace folder
        function findDiagnostics(workspaceFolder) {
            return __awaiter(this, void 0, void 0, function* () {
                const searchPattern = new vscode_1.RelativePattern(workspaceFolder, searchCriteria);
                const files = yield vscode_1.workspace.findFiles(searchPattern);
                for (const file of files) {
                    const coverages = yield (0, parse_lcov_1.parse)(file.fsPath);
                    recordFileCoverage(coverages, workspaceFolder.uri.fsPath);
                    convertDiagnostics(coverages, workspaceFolder.uri.fsPath);
                }
            });
        }
        // Show the coverage in the VSCode status bar at the bottom
        function showStatus() {
            const activeTextEditor = vscode_1.window.activeTextEditor;
            if (!activeTextEditor) {
                statusBar.hide();
                return;
            }
            const file = activeTextEditor.document.uri.fsPath;
            if (coverageByFile.has(file)) {
                const coverage = coverageByFile.get(file);
                if (coverage) {
                    const { lines } = coverage;
                    statusBar.text = `Coverage: ${lines.hit}/${lines.found} lines`;
                    statusBar.show();
                }
            }
            else {
                statusBar.hide();
            }
        }
        function recordFileCoverage(coverages, workspaceFolder) {
            coverageByFile.clear();
            for (const coverage of coverages) {
                const fileName = !(0, path_1.isAbsolute)(coverage.file)
                    ? (0, path_1.join)(workspaceFolder, coverage.file)
                    : coverage.file;
                coverageByFile.set(fileName, coverage);
            }
            showStatus();
        }
        // Takes parsed coverage information and turns it into diagnostics
        function convertDiagnostics(coverages, workspaceFolder) {
            if (!showCoverage)
                return; // do nothing
            for (const coverage of coverages) {
                if (coverage && coverage.lines && coverage.lines.details) {
                    const fileName = !(0, path_1.isAbsolute)(coverage.file)
                        ? (0, path_1.join)(workspaceFolder, coverage.file)
                        : coverage.file;
                    const diagnosticsForFiles = convertLinesToDiagnostics(coverage.lines.details, fileName);
                    if (diagnosticsForFiles.length > 0) {
                        diagnostics.set(vscode_1.Uri.file(fileName), diagnosticsForFiles);
                    }
                    else {
                        diagnostics.delete(vscode_1.Uri.file(fileName));
                    }
                }
            }
        }
        function convertLinesToDiagnostics(details, fileName) {
            var _a;
            const doc = (_a = vscode_1.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
            const currentFile = doc === null || doc === void 0 ? void 0 : doc.uri.fsPath;
            const diagnosticsForFiles = [];
            for (const detail of details) {
                const line = detail.line - 1;
                if (detail.hit === 0) {
                    const range = (currentFile === fileName && (doc === null || doc === void 0 ? void 0 : doc.lineAt(line).range)) ||
                        new vscode_1.Range(new vscode_1.Position(line, 0), new vscode_1.Position(line, 1000));
                    diagnosticsForFiles.push(new vscode_1.Diagnostic(range, `[${packageInfo.name}] line not covered`, vscode_1.DiagnosticSeverity.Information));
                }
            }
            return diagnosticsForFiles;
        }
        // exports - accessible to tests
        return { onCommand: exports.onCommand, statusBar };
    });
}
exports.activate = activate;
function noop() {
    return __awaiter(this, void 0, void 0, function* () { });
}
//# sourceMappingURL=extension.js.map