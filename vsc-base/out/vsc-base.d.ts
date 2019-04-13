import { addLeadingLocalDash, cleanPath, getJsonParts, isAbsolutePath, isSubPath, joinPaths, pathAsUnix, getRelativePath, getSubrelativePathFromAbsoluteRootPath, getAbsolutePathFromRelatrivePath, sharedPath, sleep, splitPath, subtractPath, toKebabCase, toCamelCase, toPascalCase, toSnakeCase, trimDashes, trimLeadingDash, getErrorInfo, getTimestamp } from './vsc-base-raw';
import { ask, pick, findFilePaths, findFilePathsFromBase, findRelativeFilePaths, getActiveEditor, getActiveDocument, getActiveDocumentPath, getActiveDocumentContent, setActiveDocumentContent, getFullDocumentRange, appendToDocument, appendToActiveDocument, appendLineToActiveDocument, saveActiveDocument, getRootPath, saveAll, showErrorMessage, showMessage } from './vsc-base-vscode';
import { getLineStreamReader, getReadStream, doesExists, getDir, getFileContent, getJsonContent, getConfig, getPackageFilePaths, getPackageDependencies, isDir, makeDir, move, copy, saveFileContent } from './vsc-base-system';
import { getVscDefaultModuleMap, varifyModuleMethods, awaitResult, tsTranspile, tsLoadModuleSourceCode, tsRewriteTranpiledCodeWithVscBaseModules, tsLoadModule, TSLoadModuleError, tsCreateTransformer, TsTransformerCallback, tsCreateRemoveNodesTransformer, TsRemoveTransformerCallback, tsTransform, tsTransformSourceFile, TsDefaultCompilerOptions, tsCreateSourceFile } from './vsc-base-typescript';
import { scaffoldTemplate, vscTemplate, vscTemplateItem, vscTemplateFolder, vscTemplateFile, vscUserInput, vscUserInputs, vscStringDelegate } from './vsc-base-vscTemplate';
export { vscTemplate, vscTemplateItem, vscTemplateFolder, vscTemplateFile, vscUserInput, vscUserInputs, vscStringDelegate };
export { addLeadingLocalDash, cleanPath, getJsonParts, isAbsolutePath, isSubPath, joinPaths, pathAsUnix, getAbsolutePathFromRelatrivePath, getRelativePath, getSubrelativePathFromAbsoluteRootPath, sharedPath, sleep, splitPath, subtractPath, toKebabCase, toCamelCase, toPascalCase, toSnakeCase, trimDashes, trimLeadingDash, getErrorInfo, getTimestamp, ask, pick, findFilePaths, findFilePathsFromBase, findRelativeFilePaths, getActiveEditor, getActiveDocument, getActiveDocumentPath, getActiveDocumentContent, setActiveDocumentContent, getFullDocumentRange, appendToDocument, appendToActiveDocument, appendLineToActiveDocument, saveActiveDocument, getRootPath, saveAll, showErrorMessage, showMessage, getLineStreamReader, getReadStream, doesExists, getDir, getFileContent, getJsonContent, getConfig, getPackageFilePaths, getPackageDependencies, isDir, makeDir, move, copy, saveFileContent, scaffoldTemplate, getVscDefaultModuleMap, awaitResult, varifyModuleMethods, tsTranspile, tsLoadModuleSourceCode, tsRewriteTranpiledCodeWithVscBaseModules, tsLoadModule, TSLoadModuleError, tsCreateTransformer, TsTransformerCallback, tsCreateRemoveNodesTransformer, TsRemoveTransformerCallback, tsTransform, tsTransformSourceFile, TsDefaultCompilerOptions, tsCreateSourceFile };
