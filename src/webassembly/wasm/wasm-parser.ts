import {WasmSectionBinary} from "./wasm-binary-section";
import {ByteArray} from "../../utils/bytearray";
import {WasmSection} from "../core/wasm-section";
import {SignatureSection} from "./sections/signature-section";
import {ImportSection} from "./sections/import-section";
import {FunctionSection} from "./sections/function-section";
import {TableSection} from "./sections/table-section";
import {MemorySection} from "./sections/memory-section";
import {GlobalSection} from "./sections/global-section";
import {ExportSection} from "./sections/export-section";
import {StartSection} from "./sections/start-section";
import {ElementSection} from "./sections/element-section";
import {CodeSection} from "./sections/code-section";
import {DataSection} from "./sections/data-section";
import {NameSection} from "./sections/name-section";
import {Terminal} from "../../utils/terminal";
import {WasmFunction} from "../core/wasm-function";
import {WasmSignature} from "../core/wasm-signature";
/**
 * Created by 01 on 2017-06-19.
 */
export class WasmParser {

    static currentSignatures: WasmSignature[];
    static currentFunctions: WasmFunction[];

    constructor() {

    }
}

export function createSection(id: WasmSection, name?: string): WasmSectionBinary {
    let sectionBinary = null;
    switch (id) {
        case WasmSection.Signature:
            sectionBinary = new SignatureSection(new ByteArray());
            break;
        case WasmSection.Import:
            sectionBinary = new ImportSection(new ByteArray());
            break;
        case WasmSection.Function:
            sectionBinary = new FunctionSection(new ByteArray());
            break;
        case WasmSection.Table:
            sectionBinary = new TableSection(new ByteArray());
            break;
        case WasmSection.Memory:
            sectionBinary = new MemorySection(new ByteArray());
            break;
        case WasmSection.Global:
            sectionBinary = new GlobalSection(new ByteArray());
            break;
        case WasmSection.Export:
            sectionBinary = new ExportSection(new ByteArray());
            break;
        case WasmSection.Start:
            sectionBinary = new StartSection(new ByteArray());
            break;
        case WasmSection.Element:
            sectionBinary = new ElementSection(new ByteArray());
            break;
        case WasmSection.Code:
            sectionBinary = new CodeSection(new ByteArray());
            break;
        case WasmSection.Data:
            sectionBinary = new DataSection(new ByteArray());
            break;
        case WasmSection.Custom:
            if (name !== undefined) {
                if (name === "name") {
                    sectionBinary = new NameSection(name, new ByteArray());
                }
            } else {
                let error = "Cannot create custom section without name";
                Terminal.error(error);
                throw error;
            }
            break;
    }
    if (sectionBinary === null) {
        let error = `Unknown section id:${id} ${name !== undefined ? ", " + name : ""}`;
        Terminal.error(error);
        throw error;
    }
    return sectionBinary;
}

export function parseSection(data: ByteArray): WasmSectionBinary {
    let id = data.readS32LEB();
    let name_len = 0;
    let name = null;
    if (this.id == 0) {
        name_len = data.readU32LEB();
        name = data.readUTFBytes(name_len);
    }
    let payload_len = data.readU32LEB();
    let payload = data.readBytes(new ByteArray(), 0, payload_len);
    let sectionBinary: WasmSectionBinary;

    switch (id) {
        case WasmSection.Signature:
            sectionBinary = new SignatureSection(payload);
            WasmParser.currentSignatures = (sectionBinary as SignatureSection).signatures;
            break;
        case WasmSection.Import:
            sectionBinary = new ImportSection(payload);
            break;
        case WasmSection.Function:
            sectionBinary = new FunctionSection(payload);
            WasmParser.currentFunctions = (sectionBinary as FunctionSection).functions;
            break;
        case WasmSection.Table:
            sectionBinary = new TableSection(payload);
            break;
        case WasmSection.Memory:
            sectionBinary = new MemorySection(payload);
            break;
        case WasmSection.Global:
            sectionBinary = new GlobalSection(payload);
            break;
        case WasmSection.Export:
            sectionBinary = new ExportSection(payload);
            break;
        case WasmSection.Start:
            sectionBinary = new StartSection(payload);
            break;
        case WasmSection.Element:
            sectionBinary = new ElementSection(payload);
            break;
        case WasmSection.Code:
            sectionBinary = new CodeSection(payload);
            (sectionBinary as CodeSection).functions = WasmParser.currentFunctions;
            break;
        case WasmSection.Data:
            sectionBinary = new DataSection(payload);
            break;
        case WasmSection.Custom:
            if (name === "name") {
                sectionBinary = new NameSection(name, payload);
                sectionBinary.name_len = name_len;
            }
            break;
    }
    if (sectionBinary !== undefined) {
        sectionBinary.read();
        return sectionBinary;
    } else {
        return null;
    }
}
