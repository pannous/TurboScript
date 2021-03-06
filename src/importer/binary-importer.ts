import {FileSystem} from "../utils/filesystem";
import {WasmBinary} from "../webassembly/wasm/wasm-binary";
import {WasmSection} from "../webassembly/core/wasm-section";
import {ExportSection} from "../webassembly/wasm/sections/export-section";
import {WasmExport} from "../webassembly/core/wasm-export";
import {SignatureSection} from "../webassembly/wasm/sections/signature-section";
import {FunctionSection} from "../webassembly/wasm/sections/function-section";
import {WasmExternalKind} from "../webassembly/core/wasm-external-kind";
import {Terminal} from "../utils/terminal";
import {WasmBinaryImport} from "./kinds/wasm-binary-import";
import {ImportSection} from "../webassembly/wasm/sections/import-section";
/**
 * Created by n.vinayakan on 23.06.17.
 */
export class BinaryImporter {
    static binaries: WasmBinary[] = [];
    static imports: WasmBinaryImport[] = [];

    static reset(): void {
        BinaryImporter.binaries = [];
        BinaryImporter.imports = [];
    }

    static resolveWasmBinaryImport(imports: string[], from: string, importPath: string): string {
        let binary = FileSystem.readBinaryFile(importPath);
        if (binary === null || binary === undefined) {
            binary = FileSystem.readBinaryFile(from);
        }
        let wasmBinary = new WasmBinary(binary);
        let importSection = wasmBinary.getSection(WasmSection.Import) as ImportSection;
        let importCount = importSection.imports.length;
        let exportSection = wasmBinary.getSection(WasmSection.Export) as ExportSection;
        let signatureSection = wasmBinary.getSection(WasmSection.Signature) as SignatureSection;
        let functionSection = wasmBinary.getSection(WasmSection.Function) as FunctionSection;
        let declarations = "";
        if (exportSection !== null && signatureSection !== null && functionSection !== null) {
            let exports: WasmExport[] = exportSection.exports;
            if (exports.length > 0) {
                imports.forEach(_import => {
                    let matchedExport = exports.find(_export => _export.name === _import);
                    if (matchedExport !== undefined && matchedExport.kind === WasmExternalKind.Function) {
                        let _function = functionSection.functions[matchedExport.index - importCount];
                        let signature = signatureSection.signatures[_function.signatureIndex];
                        let binaryImport: WasmBinaryImport = new WasmBinaryImport(_import, signature, matchedExport.index);
                        declarations += binaryImport.declaration + "\n";
                        BinaryImporter.imports.push(binaryImport);
                    } else {
                        let error = `Cannot find function ${_import} in wasm binary ${from}`;
                        Terminal.error(error);
                        throw error;
                    }
                });
                BinaryImporter.binaries.push(wasmBinary);
            }
        }
        return declarations;
    }

    static get
}

export function isBinaryImport(name: string): boolean {
    let found: boolean = false;
    BinaryImporter.imports.some(_import => {
        found = _import.name === name;
        return found;
    });
    return found;
}

export function getMergedCallIndex(name: string): int32 {
    let __import: WasmBinaryImport;
    BinaryImporter.imports.some(_import => {
        if(_import.name === name){
            __import = _import;
            return true;
        }
        return false;
    });
    return __import.functionIndex;
}
