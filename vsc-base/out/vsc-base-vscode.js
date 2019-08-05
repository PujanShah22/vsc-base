"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vsc = require("./vsc-base");
/** vsc-base method
 * @description
 * Prompt user for a question
 * @see [ask](http://vsc-base.org/#ask)
 * @param question string
 * @param defaultValue string
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * const answer = await vsc.ask(question, defaultValue)
 * @example
 * const answer = await ask('Where to move file?', currentFilePath)
 * @returns Promise<string | undefined>
 */
exports.ask = (question, defaultValue) => __awaiter(this, void 0, void 0, function* () {
    return yield vscode.window.showInputBox({
        prompt: question,
        value: defaultValue
    });
});
/** vsc-base method
 * @description
 * Prompt user for a question with a list of answers
 * @see [pick](http://vsc-base.org/#pick)
 * @param path string[]
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * const answer = await vsc.pick(answers)
 * @example
 * const list = ['yes', 'no']
 * const answer = await vsc.pick(list)
 * @returns Promise<string | undefined>
 */
exports.pick = (answerList) => __awaiter(this, void 0, void 0, function* () { return yield vscode.window.showQuickPick(answerList); });
/** vsc-base method
 * @description
 * Get a list off all filePaths in project the matches a glob pattern
 * @see [findFilePaths](http://vsc-base.org/#findFilePaths)
 * @param include glob
 * @param exclude glob
 * @param maxResults
 * @dependencyExternal vscode
 * @dependencyInternal pathAsUnix
 * @vscType Vscode
 * @example
 * const files = await vsc.findFilePaths(includePattern)
 * @example
 * const allTestFiles = await vsc.findFilePaths('**\/*.test.{ts,jsx,ts,tsx}')
 * for (const filePath of allTestFiles){
 *   const source = await vsc.getFileContent()
 *   // do something with the files...
 * }
 * @returns Promise<string[]>
 */
exports.findFilePaths = (include = '**/*.{js,jsx,ts,tsx}', exclude = '**/node_modules/**', maxResults = 100000) => __awaiter(this, void 0, void 0, function* () {
    const uriFiles = yield vscode.workspace.findFiles(include, exclude, maxResults);
    const files = uriFiles.map((uri) => vsc.pathAsUnix(uri.fsPath));
    return files;
});
/** vsc-base method
 * @description
 * Get a list off all filePaths from a basePath, in project the matches a glob pattern
 * @see [findFilePathsFromBase](http://vsc-base.org/#findFilePathsFromBase)
 * @param include glob
 * @param exclude glob
 * @dependencyExternal vscode
 * @dependencyInternal getDir, findFilePaths
 * @param maxResults
 * @vscType Vscode
 * @example
 * const files = await vsc.findFilePathsFromBase(dir, includePattern)
 * @example
 * const filePaths = await vsc.findFilePathsFromBase('c:/root/src/module1', '*.story.{ts,tsx}')
 * for (const filePath of filePaths){
 *    const source = await vsc.getFileContent()
 *    // Do something with filePath..
 * }
 * @returns Promise<string[]>
 */
exports.findFilePathsFromBase = (basePath, includePattern = '**/*.{js,jsx,ts,tsx}', exclude = '**/node_modules/**', maxResults = 100000) => __awaiter(this, void 0, void 0, function* () {
    let baseDir = vsc.getDir(basePath);
    const include = new vscode.RelativePattern(baseDir, includePattern);
    const filePaths = yield vsc.findFilePaths(include, exclude, maxResults);
    return filePaths;
});
/** vsc-base method
 * @description
 * Find files based from a relative to a path
 * @see [findRelativeFilePaths](http://vsc-base.org/#findRelativeFilePaths)
 * @param path
 * @param relativePath
 * @param includePattern
 * @param exclude
 * @param maxResults
 * @dependencyExternal vscode
 * @dependencyInternal getDir, joinPath, cleanPath, trimDashes, findFilePathsFromBase
 * @vscType Vscode
 * @example
 * const files = await vsc.findRelativeFilePaths(path, relativePath, includePattern)
 * @example
 * const moduleFileInParentFolder = await vsc.findRelativeFilePaths(path, '../', '*Module.ts')
 * if(moduleFileInParentFolder.length===0){
 *   vsc.showErrorMessage('Module file was not found in parent folder')
 *   return
 * }
 * if(moduleFileInParentFolder.length>1){
 *   vsc.showErrorMessage('More than one Module file was found in parent folder')
 *   return
 * }
 * const modulePath = moduleFileInParentFolder[0];
 * // Do something with modulePath..
 * @returns Promise<string[]>
 */
exports.findRelativeFilePaths = (path, relativePath, includePattern = '**/*.{js,jsx,ts,tsx}', exclude = '**/node_modules/**', maxResults = 100000) => __awaiter(this, void 0, void 0, function* () {
    const dir = vsc.getDir(path);
    const joinPath = vsc.joinPaths(dir, relativePath);
    let base = vsc.cleanPath(joinPath + '/');
    base = vsc.trimDashes(base);
    const filePaths = yield exports.findFilePathsFromBase(base, includePattern, exclude, maxResults);
    return filePaths;
});
/** vsc-base method
 * @description
 * Get vscode.window.activeTerminal
 * @see [getActiveTerminal](http://vsc-base.org/#getActiveTerminal)
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * const editor = vsc.getActiveTerminal()
 * @returns vscode.TextEditor | undefined
 */
exports.getActiveTerminal = () => {
    return vscode.window.activeTerminal;
};
/** vsc-base method
 * @description
 * Write text to a terminal \
 * If addNewLine = true (it's the default value), the text written will be executed. \
 * This will also happen if the text contains newline feeds (\n or \r\n) \
 * **NOTE:** \
 * if you use this method in an extension the end user need to be able to actually \
 * execute the command! \
 * This method is mostly design for vsc-script's, where you have control of the environment. \
 * See also [execFromPath](http://vsc-base.org/#execFromPath)
 * @see [writeToTerminal](http://vsc-base.org/#writeToTerminal)
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * const editor = vsc.writeToTerminal()
 * @returns vscode.TextEditor | undefined
 */
exports.writeToTerminal = (content, showTerminal = true, addNewLine = true, terminal) => {
    if (!terminal) {
        terminal = vsc.getActiveTerminal();
    }
    if (!terminal) {
        return false;
    }
    terminal.sendText(content, addNewLine);
    if (showTerminal) {
        terminal.show();
    }
    return true;
};
/** vsc-base method
 * @description
 * Get vscode.window.activeTextEditor
 * @see [getActiveEditor](http://vsc-base.org/#getActiveEditor)
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * const editor = vsc.getActiveEditor()
 * @returns vscode.TextEditor | undefined
 */
exports.getActiveEditor = () => {
    return vscode.window.activeTextEditor;
};
/** vsc-base method
 * @description
 * Get open vscode.TextDocument
 * @see [getActiveDocument](http://vsc-base.org/#getActiveDocument)
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * const document = vsc.getActiveDocument()
 * @returns vscode.TextDocument | undefined
 */
exports.getActiveDocument = (editor) => {
    if (!editor) {
        editor = vsc.getActiveEditor();
    }
    const document = editor && editor.document;
    return document;
};
/** vsc-base method
 * @description
 * Open a new document (untitled and not saved).
 * @see [newDocument](http://vsc-base.org/#newDocument)
 * @dependencyInternal getActiveDocument
 * @example
 * const path = vsc.newDocument(content)
 * @vscType Vscode
 * @returns Promise<vscode.TextDocument>
 */
exports.newDocument = (content, language = 'typescript') => __awaiter(this, void 0, void 0, function* () {
    const document = yield vscode.workspace.openTextDocument({ language, content });
    yield vscode.window.showTextDocument(document);
    return document;
});
/** vsc-base method
 * @description
 * Get current open file path or undefined if nothing is open.
 * @see [getDocumentPath](http://vsc-base.org/#getDocumentPath)
 * @dependencyInternal getActiveDocument
 * @example
 * const path = vsc.getDocumentPath()
 * @vscType Vscode
 * @returns string | undefined
 */
exports.getDocumentPath = (document) => {
    if (!document) {
        document = vsc.getActiveDocument();
    }
    return (document && document.fileName) || undefined;
};
/** vsc-base method
 * @description
 * Get current open file's content.
 * @see [getDocumentContent](http://vsc-base.org/#getDocumentContent)
 * @dependencyInternal getActiveDocument
 * @vscType Vscode
 * @example
 * const content = vsc.getDocumentContent()
 * @returns string | undefined
 */
exports.getDocumentContent = (document) => {
    if (!document) {
        document = vsc.getActiveDocument();
    }
    return (document && document.getText()) || undefined;
};
/** vsc-base method
 * @description
 * Set current open file's content. \
 * Return true if success, and false if there was no active TextEditor or open Document.
 * @see [setDocumentContent](http://vsc-base.org/#setDocumentContent)
 * @param content
 * @param editor
 * @dependencyInternal insertAtRange
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * const success = vsc.setDocumentContent(content)
 * @returns boolean
 */
exports.setDocumentContent = (content, editor) => {
    if (editor === undefined) {
        editor = vsc.getActiveEditor();
    }
    if (editor === undefined) {
        return false;
    }
    const fullRange = vsc.getFullDocumentRange(editor.document);
    return exports.insertAtRange(content, fullRange, editor);
};
/** vsc-base method
 * @description
 * Get a vscode.Range for the entire document
 * @see [getFullDocumentRange](http://vsc-base.org/#getFullDocumentRange)
 * @param document
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * const fullRange = vsc.getFullDocumentRange(document)
 * @returns boolean
 */
exports.getFullDocumentRange = (document) => {
    const startPosition = new vscode.Position(0, 0);
    const endPosition = new vscode.Position(document.lineCount, 0);
    const fullRange = new vscode.Range(startPosition, endPosition);
    return fullRange;
};
/** vsc-base method
 * @description
 * Append new content in the end of the (open) document. \
 * Return true on success
 * @see [appendToDocument](http://vsc-base.org/#appendToDocument)
 * @param content
 * @param document
 * @param editor
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * await vsc.appendToDocument(editor, document, content)
 * @returns boolean
 */
exports.appendToDocument = (content, editor) => {
    if (!editor) {
        editor = vsc.getActiveEditor();
    }
    if (!editor) {
        return false;
    }
    const startPosition = new vscode.Position(editor.document.lineCount, 0);
    const endPosition = new vscode.Position(editor.document.lineCount, 0);
    const fullRange = new vscode.Range(startPosition, endPosition);
    return exports.insertAtRange(content, fullRange, editor);
};
/** vsc-base method
 * @description
 * Prepend new content in the end of the open document.
 * Return true on success, false if the document or textEditor was not open/correct
 * @see [prependToDocument](http://vsc-base.org/#prependToDocument)
 * @param content
 * @param editor
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * vsc.prependToDocument(editor, document, content)
 * @returns boolean
 */
exports.prependToDocument = (content, editor) => {
    const startPosition = new vscode.Position(0, 0);
    const endPosition = new vscode.Position(0, 0);
    const startRange = new vscode.Range(startPosition, endPosition);
    return exports.insertAtRange(content, startRange, editor);
};
/** vsc-base method
 * @description
 * Insert content at vscode.Range
 * Return true on success, false if the document or textEditor was not open/correct
 * @see [insertAtRange](http://vsc-base.org/#insertAtRange)
 * @param content
 * @param range
 * @param editor
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * const success = vsc.insertAtRange(content, range)
 * @returns boolean
 */
exports.insertAtRange = (content, range, editor) => {
    if (editor === undefined) {
        editor = vsc.getActiveEditor();
    }
    if (editor === undefined) {
        return false;
    }
    // Use TextEdit to avoid scrolling the document
    const edits = [];
    edits.push(vscode.TextEdit.replace(range, content));
    const workspaceEdit = new vscode.WorkspaceEdit();
    workspaceEdit.set(editor.document.uri, edits);
    vscode.workspace.applyEdit(workspaceEdit);
    return true;
};
/** vsc-base method
 * @description
 * Insert content at position (start and optional end position)
 * Return true on success, false if the document or textEditor was not open/correct
 * @see [insertAt](http://vsc-base.org/#insertAt)
 * @param content
 * @param range
 * @param editor
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * const success = vsc.insertAt(content, start, end)
 * @returns boolean
 */
exports.insertAt = (content, start, end = start, editor, trimSpaces = false) => {
    if (editor === undefined) {
        editor = vsc.getActiveEditor();
    }
    if (editor === undefined) {
        return false;
    }
    const source = editor.document.getText();
    const pos = vsc.createVscodeRangeAndPosition(source, start, end, trimSpaces);
    vsc.insertAtRange(content, pos.range, editor);
    return true;
};
/** vsc-base method
 * @description
 * Append new line content in the end of the (open) document
 * @see [appendLineToDocument](http://vsc-base.org/#appendLineToDocument)
 * @param content
 * @param editor
 * @dependencyInternal appendToActiveDocument
 * @vscType Vscode
 * @example
 * const success = vsc.appendLineToDocument(content)
 * @returns boolean
 */
exports.appendLineToDocument = (content, editor) => {
    return vsc.appendToDocument('\n' + content, editor);
};
/** vsc-base method
 * @description
 * Prepend new line content in the start of the (open) document
 * @see [prependLineToDocument](http://vsc-base.org/#prependLineToDocument)
 * @param content
 * @param document
 * @param editor
 * @vscType Vscode
 * @example
 * const success = vsc.prependLineToDocument(content)
 * @returns boolean
 */
exports.prependLineToDocument = (content, editor) => {
    return vsc.prependToDocument(content + '\n', editor);
};
/** vsc-base method
 * @description
 * Save active open file. \
 * Return true for success, and false if there was no open document
 * @see [saveDocument](http://vsc-base.org/#saveDocument)
 * @dependencyInternal getActiveDocument
 * @vscType Vscode
 * @example
 * const success = await vsc.saveDocument(content)
 * @returns Promise<boolean>
 */
exports.saveDocument = (document) => __awaiter(this, void 0, void 0, function* () {
    if (!document) {
        document = vsc.getActiveDocument();
    }
    if (document) {
        yield document.save();
        return true;
    }
    return Promise.resolve(false);
});
/** vsc-base method
 * @description
 * Takes a start and end and return vscode positions and range objects. \
 * Also returns the content and fullContent properties and orgStart and Org End. \
 * (The normal ts ast compiler has spaces and comment included in the node pos and node end)
 * @see [createVscodeRangeAndPosition](http://vsc-base.org/#createVscodeRangeAndPosition)
 * @vscType Vscode
 * @example
 * const success = vsc.createVscodeRangeAndPosition(source, start, end)
 * @returns boolean
 */
exports.createVscodeRangeAndPosition = (source, start, end = start, trimSpacesAndComments = true) => {
    const fullContent = source.substring(start, end);
    const orgStart = start;
    const orgEnd = end;
    if (trimSpacesAndComments) {
        const matcher = /^((\/\*[\s\S]*?\*\/)|(\/\/[^\n]*\n)|([\s\n]+))*/;
        const found = source.substring(start, end);
        const startSpaces = found.match(matcher);
        if (startSpaces) {
            start += startSpaces[0].length;
        }
        const endSpaces = found.match(/\s+$/);
        if (endSpaces) {
            end -= endSpaces[0].length;
        }
    }
    const content = source.substring(start, end);
    const startLines = source.substr(0, start).split("\n");
    const endLines = source.substr(0, end).split("\n");
    const startLineNumber = startLines.length - 1;
    const endLineNumber = endLines.length - 1;
    const startPosition = new vscode.Position(startLineNumber, startLines[startLines.length - 1].length);
    const endPosition = new vscode.Position(endLineNumber, endLines[endLines.length - 1].length);
    const range = new vscode.Range(startPosition, endPosition);
    return {
        content,
        start,
        end,
        startLineNumber,
        endLineNumber,
        startPosition,
        endPosition,
        range,
        fullContent,
        orgStart,
        orgEnd
    };
};
/** vsc-base method
 * @description
 * Create a vscode.Selection \
 * @see [createSelection](http://vsc-base.org/#createSelection)
 * @param range
 * @param editor
 * @vscType Vscode
 * @example
 * const selection = vsc.createSelection(start, end)
 * @returns vscode.Selection
 */
exports.createSelection = (source, start, end = start, trimSpaces = true) => {
    const complexRangeObject = vsc.createVscodeRangeAndPosition(source, start, end, trimSpaces);
    const selection = new vscode.Selection(complexRangeObject.startPosition, complexRangeObject.endPosition);
    return selection;
};
/** vsc-base method
 * @description
 * Set Selection for an TextEditor (Current document) \
 * Clear other selections. \
 * returns true on success
 * @see [setSelection](http://vsc-base.org/#setSelection)
 * @param range
 * @param editor
 * @vscType Vscode
 * @example
 * const success = vsc.setSelection(start, end)
 * @returns boolean
 */
exports.setSelection = (start, end = start, editor) => {
    if (!editor) {
        editor = vsc.getActiveEditor();
    }
    if (!editor) {
        return false;
    }
    const source = editor.document.getText();
    const selection = vsc.createSelection(source, start, end);
    editor.selections = []; // clear selections
    editor.selection = selection;
    return true;
};
/** vsc-base method
 * @description
 * Set Selections for an TextEditor (Current document) \
 * Takes a ranges array positions with start and end.
 * Clear other selections. \
 * returns true on success
 * @see [setSelections](http://vsc-base.org/#setSelections)
 * @param range
 * @param editor
 * @vscType Vscode
 * @example
 * const success = vsc.setSelections(ranges)
 * @returns boolean
 */
exports.setSelections = (ranges, editor) => {
    if (!editor) {
        editor = vsc.getActiveEditor();
    }
    if (!editor) {
        return false;
    }
    const source = editor.document.getText();
    editor.selections = ranges.map((range) => vsc.createSelection(source, range.start, range.end));
    return true;
};
/** vsc-base method
 * @description
 * Add a Selection for an TextEditor (Current document) \
 * returns true on success
 * @see [addSelection](http://vsc-base.org/#addSelection)
 * @vscType Vscode
 * @example
 * const success = vsc.addSelection(range)
 * @returns boolean
 */
exports.addSelection = (start, end = start, editor) => {
    if (!editor) {
        editor = vsc.getActiveEditor();
    }
    if (!editor) {
        return false;
    }
    const source = editor.document.getText();
    const selection = vsc.createSelection(source, start, end);
    editor.selections = [selection, ...editor.selections];
    //editor.selections.push(selection)
    return true;
};
/** vsc-base method
 * @description
 * Set Selection for an TextEditor (Current document) \
 * Clear other selections \
 * returns true on success
 * @see [setSelectionFromRange](http://vsc-base.org/#setSelectionFromRange)
 * @param range
 * @param editor
 * @vscType Vscode
 * @example
 * const success = vsc.setSelectionFromRange(range)
 * @returns boolean
 */
exports.setSelectionFromRange = (range, editor) => {
    if (!editor) {
        editor = vsc.getActiveEditor();
    }
    if (!editor) {
        return false;
    }
    editor.selections = []; // clear selections
    editor.selection = new vscode.Selection(range.start, range.end);
    return true;
};
/** vsc-base method
 * @description
 * Set Selections for an TextEditor (Current document) \
 * Clear other selections \
 * returns true on success
 * @see [setSelectionsFromRanges](http://vsc-base.org/#setSelectionsFromRanges)
 * @param range
 * @param editor
 * @vscType Vscode
 * @example
 * const success = vsc.setSelectionsFromRanges(ranges)
 * @returns boolean
 */
exports.setSelectionsFromRanges = (range, editor) => {
    if (!editor) {
        editor = vsc.getActiveEditor();
    }
    if (!editor) {
        return false;
    }
    editor.selections = range.map(range => new vscode.Selection(range.start, range.end));
    return true;
};
/** vsc-base method
 * @description
 * Add a Selection for an TextEditor (Current document) \
 * returns true on success
 * @see [addSelectionFromRange](http://vsc-base.org/#addSelectionFromRange)
 * @param range
 * @param editor
 * @vscType Vscode
 * @example
 * const success = vsc.addSelectionFromRange(range)
 * @returns boolean
 */
exports.addSelectionFromRange = (range, editor) => {
    if (!editor) {
        editor = vsc.getActiveEditor();
    }
    if (!editor) {
        return false;
    }
    editor.selections = [new vscode.Selection(range.start, range.end), ...editor.selections];
    return true;
};
/** vsc-base method
 * @description
 * Get project root for a path or undefined if no project was found.
 * @see [getRootPath](http://vsc-base.org/#getRootPath)
 * @param path
 * @dependencyExternal vscode
 * @dependencyInternal pathAsUnix
 * @vscType Vscode
 * @example
 * const rootPath = vsc.getRootPath()
 * @returns string | undefined
 */
exports.getRootPath = (path) => {
    const uri = vscode.Uri.file(path);
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
    if (!workspaceFolder) {
        return undefined;
    }
    let rootPath = workspaceFolder.uri.fsPath;
    rootPath = vsc.pathAsUnix(rootPath);
    return rootPath;
};
/** vsc-base method
 * @description
 * Save All files
 * @see [saveAll](http://vsc-base.org/#saveAll)
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * await vsc.saveAll()
 * @returns Promise<void>
 */
exports.saveAll = () => __awaiter(this, void 0, void 0, function* () {
    yield vscode.workspace.saveAll(false);
});
/** vsc-base method
 * @description
 * Show error message to user
 * @see [showErrorMessage](http://vsc-base.org/#showErrorMessage)
 * @param message
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * vsc.showErrorMessage(message)
 * @returns Promise<void>
 */
exports.showErrorMessage = (message) => __awaiter(this, void 0, void 0, function* () {
    yield vscode.window.showErrorMessage(message);
});
/** vsc-base method
 * @description
 * Show message to user
 * @see [showMessage](http://vsc-base.org/#showMessage)
 * @param message
 * @dependencyExternal vscode
 * @vscType Vscode
 * @example
 * vsc.showMessage(message)
 * @returns Promise<void>
 */
exports.showMessage = (message) => __awaiter(this, void 0, void 0, function* () {
    yield vscode.window.showInformationMessage(message);
});
//# sourceMappingURL=vsc-base-vscode.js.map