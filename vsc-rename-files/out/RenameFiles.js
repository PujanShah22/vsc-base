'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vsc = require("vsc-base");
class RenameFiles {
    /**
     * The main method that runs the create template output
     */
    rename(selectedPath, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectedDir = vsc.getDir(selectedPath);
            const [_, folderName] = vsc.splitPath(selectedDir);
            const state = {
                selectedPath,
                selectedDir,
                setIndexAtEnd: false,
                setIndexAtEndOfFolder: false,
                incSubFolder: true,
                incFiles: true,
                incFolders: true,
                replaceIndex: false,
                replaceIndexForFolders: false,
                resetIndexForFolders: true,
                resetIndexForEachFolder: true,
                addIndexWhenExist: true,
                files: [],
                folders: [],
                useReg: true,
                from: folderName,
                to: 'New-Name'
            };
            //const folders = getFolders(dir, filePaths)
            const { onCommand, sendSetHTML: set, dispose } = vsc.startWebview(context, {
                title: `Rename files`,
                style: `
            #main { padding: 10px; }
            .close { position: absolute; top:10px; right: 10px;}
            .from { background: var(--vscode-diffEditor-removedTextBackground); text-decoration: line-through; }
            .to { background: var(--vscode-diffEditor-insertedTextBackground); }
            .line {margin-bottom: 2px;}
            .newNameWrap { margin-left:40px; }
            .newName {  margin-left:5px; background: rgba(120,120,120, 0.6); }
            .skip { text-decoration: line-through; color: #aaa !important; }
            .error_msg { color: #900; }
            .hrline { margin: 8px 0px; display:block; height: 1px; width: 100%; border-top:1px solid var(--vscode-foreground); }
            .hrsubline { margin: 4px 0px; display:block; height: 1px; width: 100%; border-top:1px dashed var(--vscode-foreground); }
            .settings { padding: 10px; border: 1px solid var(--vscode-foreground); }
            input[type=text] { width: 120px; }
            h3 { margin-bottom: 4px; }
         `,
                body: `
            <h2>Rename Files</h2>
            <strong>Selected folder:</strong> ${state.selectedDir}<br/>
            <div class='settings'>
               <strong>Settings:</strong><br/>
               ${renderCheckbox('incSubFolder', state.incSubFolder, 'Include sub-folders')}<br/>
               ${renderCheckbox('incFiles', state.incFiles, 'Rename files')}<br/>
               ${renderCheckbox('incFolders', state.incFolders, 'Rename folders <i>(This can only rename folder that contains a file!)</i>')}<br/>
               ${renderCheckbox('useReg', state.useReg, 'Use RegExp<sup>1</sup>')}<br/>
               <div class='hrsubline'>&nbsp;</div>
               Add index ${renderCheckbox('addIndexWhenExist', state.addIndexWhenExist, ' when coping to an exiting name')}<br/>
               Replace $index<sup>2</sup>:
               ${renderCheckbox('replaceIndex', state.replaceIndex, ' in file name')}
               ${renderCheckbox('replaceIndexForFolders', state.replaceIndexForFolders, ' in folder name')}
               <br/>
               Reset the $index:
               ${renderCheckbox('resetIndexForFolders', state.resetIndexForFolders, ' for folders')}
               ${renderCheckbox('resetIndexForEachFolder', state.resetIndexForEachFolder, ' for each new folder (File names)')}
               <br/>
               Add $index at end of name: 
               ${renderCheckbox('setIndexAtEnd', state.setIndexAtEnd, 'For file name')}
               ${renderCheckbox('setIndexAtEndOfFolder', state.setIndexAtEndOfFolder, 'For folder name')}
            </div>
            <h3>Replace:</h3>
            <i>- <sup>1</sup>For RegExp: Add \/[gimusy] in end for flags, use $1, $2 ect for captured groups</i><br/>
            <i>- <sup>2</sup>Write $index for adding index number (if setting is added)</i><br/>
            <br/>
            Replace <input type="text" onKeyup="sendCommand('setProp',{prop:'from',value:this.value})" value="${state.from}" />
            with <input type="text" onKeyup="sendCommand('setProp',{prop:'to',value:this.value})" value="${state.to}" /> <br/>
            <div id='main'></div>
            <br/>
            <div id='info'></div>
            <button class='close' onClick="sendCommand('close')">Cancel</button>
         `
            });
            update(state, set);
            yield onCommand((command, value, resolve) => __awaiter(this, void 0, void 0, function* () {
                switch (command) {
                    case 'setProp':
                        //@ts-ignore
                        state[value.prop] = value.value;
                        break;
                    case 'apply':
                        yield applyRenaming(state);
                        resolve();
                        break;
                    case 'close':
                        resolve();
                        break;
                }
                update(state, set);
            }));
            dispose();
        });
    }
}
exports.default = RenameFiles;
const update = (state, set) => __awaiter(this, void 0, void 0, function* () {
    setStateRegExp(state);
    yield getFoldersAndFiles(state);
    set('#main', renderState(state));
});
const renderCheckbox = (prop, value, msg) => `
   <label onClick="sendCommand('setProp', {prop:'${prop}', value: document.getElementById('${prop}').checked})">
   <input id='${prop}' type='checkbox' ${value ? 'checked' : ''}/> 
   ${msg}
   </label>
`;
const applyRenaming = (state) => __awaiter(this, void 0, void 0, function* () {
    if (state.incFiles) {
        for (const fileObj of state.files) {
            if (!fileObj.alreadyExists) {
                yield vsc.rename(fileObj.from, fileObj.to);
            }
        }
    }
    if (state.incFolders) {
        const sortedFolders = state.folders.sort((a, b) => b.to.length - a.to.length);
        for (const folderObj of sortedFolders) {
            if (!folderObj.alreadyExists) {
                yield vsc.rename(folderObj.from, folderObj.to);
            }
        }
    }
});
const renderState = (state) => {
    let content = `   `;
    if (state.incFiles && state.files.length) {
        content += `
      <h3>Files</h3>
      ${state.files.map(file => renderRenameObj(file)).join("\n")}
      `;
    }
    if (state.incFolders && state.folders.length) {
        content += `<br/>
         <h3>Folders</h3>
         ${state.folders.map(folder => renderRenameObj(folder)).join("\n")}
      `;
    }
    if ((state.incFiles && state.files.length) || (state.incFolders && state.folders.length)) {
        content += `<br/><br/>
         <button onClick="sendCommand('apply')">Rename matched files (and folders)</button>
      `;
    }
    return content;
};
const renderRenameObj = (item) => {
    if (item.alreadyExists) {
        return `
      <div class='error_msg'>Rename to existing path! This will be skipped!</div>
      <div class='line skip'>${item.dir}/${item.replaceHtml}</div>
      `;
    }
    return `
      <div class='line'>${item.dir}/${item.replaceHtml} <span class='newNameWrap'>(new name: <span class='newName'>${item.newName}</span>)</span></div>
   `;
};
const createRenameObject = (isFolder, path, state, index, prevList, toAdd) => {
    const [dir, oldName] = vsc.splitPath(path);
    let newName = state.to + (toAdd ? '' + index.value : '');
    let replaceHtml = '';
    let found = false;
    let indexUsed = false;
    if ((state.setIndexAtEnd && !isFolder) || (state.setIndexAtEndOfFolder && isFolder)) {
        newName += index.value;
        indexUsed = true;
    }
    if (newName.includes("$index") && (state.replaceIndex && !isFolder) || (state.replaceIndexForFolders && isFolder)) {
        newName = newName.replace("$index", "" + index.value);
        indexUsed = true;
    }
    if (state.useReg && state.fromRegExp) {
        const match = oldName.match(state.fromRegExp);
        if (match) {
            replaceHtml = oldName.replace(state.fromRegExp, `<span class='from'>${vsc.escapeHtml(match[0])}</span><span class='to'>${vsc.escapeHtml(newName)}</span>`);
            newName = oldName.replace(state.fromRegExp, newName);
            found = true;
        }
    }
    if (!state.useReg) {
        replaceHtml = oldName.replace(state.from, `<span class='from'>${vsc.escapeHtml(state.from)}</span><span class='to'>${vsc.escapeHtml(newName)}</span>`);
        newName = oldName.replace(state.from, newName);
        if (oldName !== newName) {
            found = true;
        }
    }
    if (found) {
        let to = vsc.joinPaths(dir, newName);
        if (path[0] === "/" && to[0] !== "/") {
            to = "/" + to;
        }
        let alreadyExists = vsc.doesExists(to) || prevList.some(x => x.to === to);
        if (alreadyExists && state.addIndexWhenExist) {
            index.value += 1;
            return createRenameObject(isFolder, path, state, index, prevList, true);
        }
        if (indexUsed) {
            index.value += 1;
        }
        return {
            oldName,
            newName,
            dir,
            from: path,
            to,
            alreadyExists,
            index: indexUsed ? index.value : -1,
            replaceHtml
        };
    }
};
const getFoldersAndFiles = (state) => __awaiter(this, void 0, void 0, function* () {
    const includePath = state.incSubFolder ? '**/*' : '*';
    const allFilePaths = yield vsc.findFilePathsFromBase(state.selectedDir, includePath);
    const allFoldersPaths = getFolders(state.selectedDir, allFilePaths);
    let index = { value: 1 };
    const foundFiles = [];
    let lastFolder = '';
    allFilePaths.map(path => {
        const renameObject = createRenameObject(false, path, state, index, foundFiles);
        if (renameObject) {
            foundFiles.push(renameObject);
        }
        const [folder] = vsc.splitPath(path);
        if (lastFolder !== folder) {
            lastFolder = folder;
            if (state.resetIndexForEachFolder) {
                index.value = 1;
            }
        }
    });
    if (state.resetIndexForFolders) {
        index.value = 1;
    }
    const foundFolders = [];
    allFoldersPaths.map(path => {
        const renameObject = createRenameObject(true, path, state, index, foundFolders);
        if (renameObject) {
            foundFolders.push(renameObject);
        }
    });
    state.files = foundFiles;
    state.folders = foundFolders;
});
const getFolders = (basePath, filePaths) => {
    const baseDir = vsc.getDir(basePath);
    const folderPaths = [baseDir];
    filePaths.forEach(path => {
        const dirPath = vsc.getDir(path);
        const relPath = vsc.subtractPath(dirPath, baseDir);
        if (!relPath) {
            return;
        }
        const subFolders = relPath.split("/");
        subFolders.reduce((p, c) => {
            p += "/" + c;
            const found = folderPaths.includes(p);
            if (!found) {
                folderPaths.push(p);
            }
            return p;
        }, baseDir);
    });
    return folderPaths;
};
const setStateRegExp = (state) => {
    // Regexp
    if (state.useReg) {
        let regString = state.from;
        const matchFlags = regString.match(/\/([gimusy]+)$/);
        let flag = "";
        if (matchFlags) {
            regString = regString.replace(/\/([gimusy]+)$/, '');
            flag = matchFlags[1];
        }
        state.fromRegExp = new RegExp(regString, flag);
    }
    else {
        state.fromRegExp = undefined;
    }
};
//# sourceMappingURL=RenameFiles.js.map