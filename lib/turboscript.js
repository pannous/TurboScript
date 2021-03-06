(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("fs"), require("path"));
	else if(typeof define === 'function' && define.amd)
		define(["fs", "path"], factory);
	else if(typeof exports === 'object')
		exports["turboscript"] = factory(require("fs"), require("path"));
	else
		root["turboscript"] = factory(root["fs"], root["path"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_35__, __WEBPACK_EXTERNAL_MODULE_79__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 56);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __webpack_require__(3);
const utils_1 = __webpack_require__(8);
function ByteArray_set16(array, index, value) {
    array.set(index, value);
    array.set(index + 1, (value >> 8));
}
exports.ByteArray_set16 = ByteArray_set16;
function ByteArray_set32(array, index, value) {
    array.set(index, value);
    array.set(index + 1, (value >> 8));
    array.set(index + 2, (value >> 16));
    array.set(index + 3, (value >> 24));
}
exports.ByteArray_set32 = ByteArray_set32;
function ByteArray_append32(array, value) {
    array.append(value);
    array.append((value >> 8));
    array.append((value >> 16));
    array.append((value >> 24));
}
exports.ByteArray_append32 = ByteArray_append32;
//
// export function ByteArray_append64(array: ByteArray, value: int64): void {
//     array.append(value);
//     array.append((value >> 8));
//     array.append((value >> 16));
//     array.append((value >> 24));
//     array.append((value >> 32));
//     array.append((value >> 40));
//     array.append((value >> 48));
//     array.append((value >> 56));
// }
//
// declare function Uint8Array_new(length: number): Uint8Array;
//
function ByteArray_setString(data, index, text) {
    var length = text.length;
    assert_1.assert(index >= 0 && index + length * 2 <= data.length);
    var array = data.array;
    var i = 0;
    while (i < length) {
        var c = text.charCodeAt(i);
        array[index] = c;
        array[index + 1] = (c >> 8);
        index = index + 2;
        i = i + 1;
    }
}
exports.ByteArray_setString = ByteArray_setString;
/**
 * JavaScript ByteArray
 * version : 0.2
 * @author Nidin Vinayakan | nidinthb@gmail.com
 *
 * ActionScript3 ByteArray implementation in JavaScript
 * limitation : size of ByteArray cannot be changed
 *
 */
class ByteArray {
    constructor(buffer, byteOffset = 0, byteLength = 0) {
        this.BUFFER_EXT_SIZE = 1024; //Buffer expansion size
        this._array = null;
        this.log = "";
        this.EOF_byte = -1;
        this.EOF_code_point = -1;
        if (buffer == undefined) {
            buffer = new ArrayBuffer(this.BUFFER_EXT_SIZE);
            this.write_position = 0;
        }
        else if (buffer == null) {
            this.write_position = 0;
        }
        else {
            this.write_position = byteLength > 0 ? byteLength : buffer.byteLength;
        }
        this.data = new DataView(buffer, byteOffset, byteLength > 0 ? byteLength : buffer.byteLength);
        this._array = new Uint8Array(this.data.buffer, this.data.byteOffset, this.data.byteLength);
        this._position = 0;
        this.endian = ByteArray.LITTLE_ENDIAN;
    }
    get array() {
        return this._array.subarray(0, this.length);
    }
    ;
    get(index) {
        // assert((index) < (this._length));
        return this._array[index];
    }
    set(index, value) {
        //assert((index) < (this._length));
        this._array[index] = value;
    }
    append(value) {
        let index = this.position;
        this.resize(index + 1);
        this._array[index] = value;
        this.position++;
        return index;
    }
    resize(length) {
        if (length > this.data.byteLength) {
            let pos = this.position;
            let len = this.length;
            let capacity = length * 2;
            let data = new Uint8Array(capacity);
            data.set(this.array);
            this.setArray(data);
            this._position = pos;
            this.write_position = len;
        }
        return this;
    }
    copy(source, offset = 0, length = 0) {
        offset = offset > 0 ? offset : this.length;
        if (offset + source.length > this._array.length) {
            this.resize(offset + source.length);
        }
        this._array.set(source.array, offset);
        this.position = offset + source.length;
        return this;
    }
    // getter setter
    get buffer() {
        return this.data.buffer;
    }
    set buffer(value) {
        this.data = new DataView(value);
    }
    get dataView() {
        return this.data;
    }
    set dataView(value) {
        this.data = value;
        this.write_position = value.byteLength;
    }
    get phyPosition() {
        return this._position + this.data.byteOffset;
    }
    get byteOffset() {
        return this.data.byteOffset;
    }
    get byteLength() {
        return this.data.byteLength;
    }
    get position() {
        return this._position;
    }
    set position(value) {
        if (this._position < value) {
            if (!this.validate(this._position - value)) {
                return;
            }
        }
        this._position = value;
        this.write_position = value > this.write_position ? value : this.write_position;
    }
    get length() {
        return this.write_position;
    }
    set length(value) {
        this.validateBuffer(value);
    }
    get bytesAvailable() {
        return this.data.byteLength - this._position;
    }
    //end
    clear() {
        this._position = 0;
    }
    setArray(array) {
        this._array = array;
        this.setBuffer(array.buffer, array.byteOffset, array.byteLength);
    }
    setBuffer(buffer, offset = 0, length = 0) {
        if (buffer) {
            this.data = new DataView(buffer, offset, length > 0 ? length : buffer.byteLength);
        }
        else {
        }
    }
    readU8LEB() {
        return this.readUnsignedLEB128(1);
    }
    readU16LEB() {
        return this.readUnsignedLEB128(2);
    }
    readU32LEB() {
        return this.readUnsignedLEB128(4);
    }
    readU64LEB() {
        return this.readUnsignedLEB128(8);
    }
    readS8LEB() {
        return this.readLEB128(1);
    }
    readS16LEB() {
        return this.readLEB128(2);
    }
    readS32LEB() {
        return this.readLEB128(4);
    }
    readS64LEB() {
        return this.readLEB128(8);
    }
    /**
     * Read unsigned Little Endian Base 128
     */
    readUnsignedLEB128(size) {
        let value = 0;
        let shift = 0;
        let byte;
        while (true) {
            byte = this.readUnsignedByte();
            let last = !(byte & 128);
            let payload = byte & 127;
            let shift_mask = 0 == shift ? ~0
                : ((1 << (size * 8 - shift)) - 1);
            let significant_payload = payload & shift_mask;
            if (significant_payload != payload) {
                if (!(value < 0 && last)) {
                    throw "LEB dropped bits only valid for signed LEB";
                }
            }
            value |= significant_payload << shift;
            if (last)
                break;
            shift += 7;
            if (utils_1.sizeOfNumber(shift) >= size * 8) {
                throw "LEB overflow";
            }
        }
        return value;
    }
    /**
     * Read signed Little Endian Base 128
     */
    readLEB128(size) {
        let value = 0;
        let shift = 0;
        let sizeOfShift = 0;
        let byte;
        while (true) {
            byte = this.readByte();
            let last = !(byte & 128);
            let payload = byte & 127;
            let shift_mask = 0 == shift
                ? ~0
                : ((1 << (size * 8 - shift)) - 1);
            let significant_payload = payload & shift_mask;
            if (significant_payload != payload) {
                if (!(utils_1.isSigned(value) && last)) {
                    throw "LEB dropped bits only valid for signed LEB";
                }
            }
            value |= significant_payload << shift;
            if (last)
                break;
            shift += 7;
            sizeOfShift = utils_1.sizeOfNumber(shift);
            if (sizeOfShift >= size * 8) {
                throw "LEB overflow";
            }
        }
        // If signed LEB, then we might need to sign-extend. (compile should
        // optimize this out if not needed).
        if (utils_1.isSigned(value)) {
            shift += 7;
            sizeOfShift = utils_1.sizeOfNumber(shift);
            if ((byte & 64) && sizeOfShift < 8 * size) {
                let sext_bits = 8 * size - sizeOfShift;
                value <<= sext_bits;
                value >>= sext_bits;
                if (value >= 0) {
                    throw "LEB sign-extend should produce a negative value";
                }
            }
        }
        return value;
    }
    /**
     * Write unsigned Little Endian Base 128
     */
    writeUnsignedLEB128(value) {
        let b = 0;
        value |= 0;
        do {
            b = value & 0x7F;
            value >>>= 7;
            if (value)
                b |= 0x80;
            this.append(b);
        } while (value);
    }
    /**
     * Write signed Little Endian Base 128
     */
    writeLEB128(value) {
        let b;
        value |= 0;
        do {
            b = value & 0x7F;
            value >>= 7;
            let signBit = (b & 0x40) !== 0;
            if (((value === 0) && !signBit) ||
                ((value === -1) && signBit)) {
                this.append(b);
                break;
            }
            else {
                b |= 0x80;
                this.append(b);
            }
        } while (true);
    }
    /**
     * Read WASM String
     */
    readWasmString() {
        let length = this.readUnsignedLEB128(4);
        return this.readUTFBytes(length);
    }
    /**
     * Write WASM String
     */
    writeWasmString(value) {
        let length = value.length;
        this.writeUnsignedLEB128(length);
        let index = this.length;
        this.resize(index + length);
        let i = 0;
        while (i < length) {
            this.set(index + i, value.charCodeAt(i));
            i = i + 1;
        }
        this.position = index + length;
    }
    /**
     * Reads a Boolean value from the byte stream. A single byte is read,
     * and true is returned if the byte is nonzero,
     * false otherwise.
     * @return    Returns true if the byte is nonzero, false otherwise.
     */
    readBoolean() {
        if (!this.validate(ByteArray.SIZE_OF_BOOLEAN))
            return null;
        return this.data.getUint8(this.position++) != 0;
    }
    /**
     * Reads a signed byte from the byte stream.
     * The returned value is in the range -128 to 127.
     * @return    An integer between -128 and 127.
     */
    readByte() {
        if (!this.validate(ByteArray.SIZE_OF_INT8))
            return null;
        return this.data.getInt8(this.position++);
    }
    /**
     * Reads the number of data bytes, specified by the length parameter, from the byte stream.
     * The bytes are read into the ByteArray object specified by the bytes parameter,
     * and the bytes are written into the destination ByteArray starting at the _position specified by offset.
     * @param    bytes    The ByteArray object to read data into.
     * @param    offset    The offset (_position) in bytes at which the read data should be written.
     * @param    length    The number of bytes to read.  The default value of 0 causes all available data to be read.
     */
    readBytes(_bytes = null, offset = 0, length = 0, createNewBuffer = false) {
        if (length == 0) {
            length = this.bytesAvailable;
        }
        else if (!this.validate(length))
            return null;
        if (createNewBuffer) {
            _bytes = _bytes == null ? new ByteArray(new ArrayBuffer(length)) : _bytes;
            //This method is expensive
            for (var i = 0; i < length; i++) {
                _bytes.data.setUint8(i + offset, this.data.getUint8(this.position++));
            }
        }
        else {
            //Offset argument ignored
            _bytes = _bytes == null ? new ByteArray(null) : _bytes;
            _bytes.dataView = new DataView(this.data.buffer, this.byteOffset + this.position, length);
            this.position += length;
        }
        return _bytes;
    }
    /**
     * Reads an IEEE 754 double-precision (64-bit) floating-point number from the byte stream.
     * @return    A double-precision (64-bit) floating-point number.
     */
    readDouble() {
        if (!this.validate(ByteArray.SIZE_OF_FLOAT64))
            return null;
        var value = this.data.getFloat64(this.position, this.endian == ByteArray.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_FLOAT64;
        return value;
    }
    /**
     * Reads an IEEE 754 single-precision (32-bit) floating-point number from the byte stream.
     * @return    A single-precision (32-bit) floating-point number.
     */
    readFloat() {
        if (!this.validate(ByteArray.SIZE_OF_FLOAT32))
            return null;
        var value = this.data.getFloat32(this.position, this.endian == ByteArray.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_FLOAT32;
        return value;
    }
    /**
     * Reads a signed 32-bit integer from the byte stream.
     *
     *   The returned value is in the range -2147483648 to 2147483647.
     * @return    A 32-bit signed integer between -2147483648 and 2147483647.
     */
    readInt() {
        if (!this.validate(ByteArray.SIZE_OF_INT32))
            return null;
        var value = this.data.getInt32(this.position, this.endian == ByteArray.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_INT32;
        return value;
    }
    /**
     * Reads a signed 64-bit integer from the byte stream.
     *
     *   The returned value is in the range −(2^63) to 2^63 − 1
     * @return    A 64-bit signed integer between −(2^63) to 2^63 − 1
     */
    // public readInt64(): Int64 {
    //     if (!this.validate(ByteArray.SIZE_OF_UINT32)) return null;
    //
    //     var low = this.data.getInt32(this.position, this.endian == ByteArray.LITTLE_ENDIAN);
    //     this.position += ByteArray.SIZE_OF_INT32;
    //     var high = this.data.getInt32(this.position, this.endian == ByteArray.LITTLE_ENDIAN);
    //     this.position += ByteArray.SIZE_OF_INT32;
    //     return new Int64(low, high);
    // }
    /**
     * Reads a multibyte string of specified length from the byte stream using the
     * specified character set.
     * @param    length    The number of bytes from the byte stream to read.
     * @param    charSet    The string denoting the character set to use to interpret the bytes.
     *   Possible character set strings include "shift-jis", "cn-gb",
     *   "iso-8859-1", and others.
     *   For a complete list, see Supported Character Sets.
     *   Note: If the value for the charSet parameter
     *   is not recognized by the current system, the application uses the system's default
     *   code page as the character set. For example, a value for the charSet parameter,
     *   as in myTest.readMultiByte(22, "iso-8859-01") that uses 01 instead of
     *   1 might work on your development system, but not on another system.
     *   On the other system, the application will use the system's default code page.
     * @return    UTF-8 encoded string.
     */
    readMultiByte(length, charSet) {
        if (!this.validate(length))
            return null;
        return "";
    }
    /**
     * Reads a signed 16-bit integer from the byte stream.
     *
     *   The returned value is in the range -32768 to 32767.
     * @return    A 16-bit signed integer between -32768 and 32767.
     */
    readShort() {
        if (!this.validate(ByteArray.SIZE_OF_INT16))
            return null;
        var value = this.data.getInt16(this.position, this.endian == ByteArray.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_INT16;
        return value;
    }
    /**
     * Reads an unsigned byte from the byte stream.
     *
     *   The returned value is in the range 0 to 255.
     * @return    A 32-bit unsigned integer between 0 and 255.
     */
    readUnsignedByte() {
        if (!this.validate(ByteArray.SIZE_OF_UINT8))
            return null;
        return this.data.getUint8(this.position++);
    }
    /**
     * Reads an unsigned 32-bit integer from the byte stream.
     *
     *   The returned value is in the range 0 to 4294967295.
     * @return    A 32-bit unsigned integer between 0 and 4294967295.
     */
    readUnsignedInt() {
        if (!this.validate(ByteArray.SIZE_OF_UINT32))
            return null;
        var value = this.data.getUint32(this.position, this.endian == ByteArray.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_UINT32;
        return value;
    }
    /**
     * Reads a variable sized unsigned integer (VX -> 16-bit or 32-bit) from the byte stream.
     *
     *   A VX is written as a variable length 2- or 4-byte element. If the index value is less than 65,280 (0xFF00),
     *   then the index is written as an unsigned two-byte integer. Otherwise the index is written as an unsigned
     *   four byte integer with bits 24-31 set. When reading an index, if the first byte encountered is 255 (0xFF),
     *   then the four-byte form is being used and the first byte should be discarded or masked out.
     *
     *   The returned value is in the range  0 to 65279 or 0 to 2147483647.
     * @return    A VX 16-bit or 32-bit unsigned integer between 0 to 65279 or 0 and 2147483647.
     */
    readVariableSizedUnsignedInt() {
        var value;
        var c = this.readUnsignedByte();
        if (c != 0xFF) {
            value = c << 8;
            c = this.readUnsignedByte();
            value |= c;
        }
        else {
            c = this.readUnsignedByte();
            value = c << 16;
            c = this.readUnsignedByte();
            value |= c << 8;
            c = this.readUnsignedByte();
            value |= c;
        }
        return value;
    }
    /**
     * Fast read for WebGL since only Uint16 numbers are expected
     */
    readU16VX() {
        return (this.readUnsignedByte() << 8) | this.readUnsignedByte();
    }
    /**
     * Reads an unsigned 64-bit integer from the byte stream.
     *
     *   The returned value is in the range 0 to 2^64 − 1.
     * @return    A 64-bit unsigned integer between 0 and 2^64 − 1
     */
    // public readUnsignedInt64(): UInt64 {
    //     if (!this.validate(ByteArray.SIZE_OF_UINT32)) return null;
    //
    //     var low = this.data.getUint32(this.position, this.endian == ByteArray.LITTLE_ENDIAN);
    //     this.position += ByteArray.SIZE_OF_UINT32;
    //     var high = this.data.getUint32(this.position, this.endian == ByteArray.LITTLE_ENDIAN);
    //     this.position += ByteArray.SIZE_OF_UINT32;
    //     return new UInt64(low, high);
    // }
    /**
     * Reads an unsigned 16-bit integer from the byte stream.
     *
     *   The returned value is in the range 0 to 65535.
     * @return    A 16-bit unsigned integer between 0 and 65535.
     */
    readUnsignedShort() {
        if (!this.validate(ByteArray.SIZE_OF_UINT16))
            return null;
        var value = this.data.getUint16(this.position, this.endian == ByteArray.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_UINT16;
        return value;
    }
    /**
     * Reads a UTF-8 string from the byte stream.  The string
     * is assumed to be prefixed with an unsigned int16 indicating
     * the length in bytes.
     * @return    UTF-8 encoded  string.
     */
    readUTF() {
        if (!this.validate(ByteArray.SIZE_OF_UINT16))
            return null;
        var length = this.data.getUint16(this.position, this.endian == ByteArray.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_UINT16;
        if (length > 0) {
            return this.readUTFBytes(length);
        }
        else {
            return "";
        }
    }
    /**
     * Reads a sequence of UTF-8 bytes specified by the length
     * parameter from the byte stream and returns a string.
     * @param    length    An unsigned int16 indicating the length of the UTF-8 bytes.
     * @return    A string composed of the UTF-8 bytes of the specified length.
     */
    readUTFBytes(length) {
        if (!this.validate(length))
            return null;
        var _bytes = new Uint8Array(this.buffer, this.byteOffset + this.position, length);
        this.position += length;
        /*var _bytes: Uint8Array = new Uint8Array(new ArrayBuffer(length));
         for (var i = 0; i < length; i++) {
         _bytes[i] = this.data.getUint8(this.position++);
         }*/
        return this.decodeUTF8(_bytes);
    }
    readStandardString(length) {
        if (!this.validate(length))
            return null;
        var str = "";
        for (var i = 0; i < length; i++) {
            str += String.fromCharCode(this.data.getUint8(this.position++));
        }
        return str;
    }
    readStringTillNull(keepEvenByte = true) {
        var str = "";
        var num = 0;
        while (this.bytesAvailable > 0) {
            var _byte = this.data.getUint8(this.position++);
            num++;
            if (_byte != 0) {
                str += String.fromCharCode(_byte);
            }
            else {
                if (keepEvenByte && num % 2 != 0) {
                    this.position++;
                }
                break;
            }
        }
        return str;
    }
    /**
     * Writes a Boolean value. A single byte is written according to the value parameter,
     * either 1 if true or 0 if false.
     * @param    value    A Boolean value determining which byte is written. If the parameter is true,
     *           the method writes a 1; if false, the method writes a 0.
     * @param    offset   optional start position to write
     */
    writeBoolean(value, offset = null) {
        offset = offset ? offset : this.position++;
        this.validateBuffer(ByteArray.SIZE_OF_BOOLEAN, offset);
        this.data.setUint8(offset, value ? 1 : 0);
    }
    /**
     * Writes a byte to the byte stream.
     * The low 8 bits of the
     * parameter are used. The high 24 bits are ignored.
     * @param    value    A 32-bit integer. The low 8 bits are written to the byte stream.
     * @param    offset   optional start position to write
     */
    writeByte(value, offset = null) {
        offset = offset ? offset : this.position++;
        this.validateBuffer(ByteArray.SIZE_OF_INT8, offset);
        this.data.setInt8(offset, value);
    }
    writeUnsignedByte(value, offset = null) {
        offset = offset ? offset : this.position++;
        this.validateBuffer(ByteArray.SIZE_OF_UINT8, offset);
        this.data.setUint8(offset, value);
    }
    /**
     * Writes a sequence of length bytes from the
     * specified byte array, bytes,
     * starting offset(zero-based index) bytes
     * into the byte stream.
     *
     *   If the length parameter is omitted, the default
     * length of 0 is used; the method writes the entire buffer starting at
     * offset.
     * If the offset parameter is also omitted, the entire buffer is
     * written. If offset or length
     * is out of range, they are clamped to the beginning and end
     * of the bytes array.
     * @param    _bytes    The ByteArray object.
     * @param    offset    A zero-based index indicating the _position into the array to begin writing.
     * @param    length    An unsigned integer indicating how far into the buffer to write.
     */
    writeBytes(_bytes, offset = 0, length = 0) {
        this.copy(_bytes);
        // this.validateBuffer(length);
        // var tmp_data = new DataView(_bytes.buffer);
        // for (var i = 0; i < _bytes.length; i++) {
        //     this.data.setUint8(this.position++, tmp_data.getUint8(i));
        // }
    }
    /**
     * Writes an IEEE 754 double-precision (64-bit) floating-point number to the byte stream.
     * @param    value    A double-precision (64-bit) floating-point number.
     * @param    offset   optional start position to write
     */
    writeDouble(value, offset = null) {
        let position = offset != null ? offset : this.position;
        this.validateBuffer(ByteArray.SIZE_OF_FLOAT64, position);
        this.data.setFloat64(position, value, this.endian == ByteArray.LITTLE_ENDIAN);
        if (!offset) {
            this.position += ByteArray.SIZE_OF_FLOAT64;
        }
    }
    /**
     * Writes an IEEE 754 single-precision (32-bit) floating-point number to the byte stream.
     * @param    value    A single-precision (32-bit) floating-point number.
     * @param    offset   optional start position to write
     */
    writeFloat(value, offset = null) {
        let position = offset != null ? offset : this.position;
        this.validateBuffer(ByteArray.SIZE_OF_FLOAT32, position);
        this.data.setFloat32(position, value, this.endian == ByteArray.LITTLE_ENDIAN);
        if (!offset) {
            this.position += ByteArray.SIZE_OF_FLOAT32;
        }
    }
    /**
     * Writes a 32-bit signed integer to the byte stream.
     * @param    value    An integer to write to the byte stream.
     * @param    offset   optional start position to write
     */
    writeInt(value, offset = null) {
        let position = offset != null ? offset : this.position;
        this.validateBuffer(ByteArray.SIZE_OF_INT32, position);
        this.data.setInt32(position, value, this.endian == ByteArray.LITTLE_ENDIAN);
        if (!offset) {
            this.position += ByteArray.SIZE_OF_INT32;
        }
    }
    /**
     * Writes a multibyte string to the byte stream using the specified character set.
     * @param    value    The string value to be written.
     * @param    charSet    The string denoting the character set to use. Possible character set strings
     *   include "shift-jis", "cn-gb", "iso-8859-1", and others.
     *   For a complete list, see Supported Character Sets.
     */
    writeMultiByte(value, charSet) {
    }
    /**
     * Writes a 16-bit integer to the byte stream. The low 16 bits of the parameter are used.
     * The high 16 bits are ignored.
     * @param    value    32-bit integer, whose low 16 bits are written to the byte stream.
     * @param    offset   optional start position to write
     */
    writeShort(value, offset = null) {
        let position = offset != null ? offset : this.position;
        this.validateBuffer(ByteArray.SIZE_OF_INT16, position);
        this.data.setInt16(position, value, this.endian == ByteArray.LITTLE_ENDIAN);
        if (!offset) {
            this.position += ByteArray.SIZE_OF_INT16;
        }
    }
    writeUnsignedShort(value, offset = null) {
        let position = offset != null ? offset : this.position;
        this.validateBuffer(ByteArray.SIZE_OF_UINT16, position);
        this.data.setUint16(position, value, this.endian == ByteArray.LITTLE_ENDIAN);
        if (!offset) {
            this.position += ByteArray.SIZE_OF_UINT16;
        }
    }
    /**
     * Writes a 32-bit unsigned integer to the byte stream.
     * @param    value    An unsigned integer to write to the byte stream.
     * @param    offset   optional start position to write
     */
    writeUnsignedInt(value, offset = null) {
        let position = offset != null ? offset : this.position;
        this.validateBuffer(ByteArray.SIZE_OF_UINT32, position);
        this.data.setUint32(position, value, this.endian == ByteArray.LITTLE_ENDIAN);
        if (!offset) {
            this.position += ByteArray.SIZE_OF_UINT32;
        }
    }
    /**
     * Writes a UTF-8 string to the byte stream. The length of the UTF-8 string in bytes
     * is written first, as a 16-bit integer, followed by the bytes representing the
     * characters of the string.
     * @param    value    The string value to be written.
     * @param    offset   optional start position to write
     */
    writeUTF(value, offset = null) {
        let utf8bytes = this.encodeUTF8(value);
        let length = utf8bytes.length;
        let position = offset != null ? offset : this.position;
        this.validateBuffer(ByteArray.SIZE_OF_UINT16 + length, position);
        this.data.setUint16(position, length, this.endian === ByteArray.LITTLE_ENDIAN);
        if (!offset) {
            this.position += ByteArray.SIZE_OF_UINT16;
            this.writeUint8Array(utf8bytes);
        }
        else {
            offset += ByteArray.SIZE_OF_UINT16;
            this.writeUint8Array(utf8bytes, offset);
        }
    }
    /**
     * Writes a UTF-8 string to the byte stream. Similar to the writeUTF() method,
     * but writeUTFBytes() does not prefix the string with a 16-bit length word.
     * @param    value    The string value to be written.
     * @param    offset   optional start position to write
     */
    writeUTFBytes(value, offset = null) {
        this.writeUint8Array(this.encodeUTF8(value), offset);
    }
    toString() {
        return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
    }
    /****************************/
    /* EXTRA JAVASCRIPT APIs    */
    /****************************/
    /**
     * Writes a Uint8Array to the byte stream.
     * @param    _bytes    The Uint8Array to be written.
     * @param    offset   optional start position to write
     */
    writeUint8Array(_bytes, offset = null) {
        let position = offset != null ? offset : this.position;
        this.validateBuffer(_bytes.length, position);
        this._array.set(_bytes, position);
        if (!offset) {
            this.position += _bytes.length;
        }
        return this;
    }
    /**
     * Writes a Uint16Array to the byte stream.
     * @param    _bytes    The Uint16Array to be written.
     * @param    offset   optional start position to write
     */
    writeUint16Array(_bytes, offset = null) {
        let position = offset != null ? offset : this.position;
        this.validateBuffer(_bytes.length * ByteArray.SIZE_OF_UINT16, position);
        for (let i = 0; i < _bytes.length; i++) {
            this.data.setUint16(position, _bytes[i], this.endian === ByteArray.LITTLE_ENDIAN);
            position += ByteArray.SIZE_OF_UINT16;
        }
        if (!offset) {
            this.position = position;
        }
    }
    /**
     * Writes a Uint32Array to the byte stream.
     * @param    _bytes    The Uint32Array to be written.
     * @param    offset   optional start position to write
     */
    writeUint32Array(_bytes, offset = null) {
        let position = offset != null ? offset : this.position;
        this.validateBuffer(_bytes.length * ByteArray.SIZE_OF_UINT32, position);
        for (let i = 0; i < _bytes.length; i++) {
            this.data.setUint32(position, _bytes[i], this.endian === ByteArray.LITTLE_ENDIAN);
            position += ByteArray.SIZE_OF_UINT32;
        }
        if (!offset) {
            this.position = position;
        }
    }
    /**
     * Writes a Int8Array to the byte stream.
     * @param    _bytes    The Int8Array to be written.
     * @param    offset   optional start position to write
     */
    writeInt8Array(_bytes, offset = null) {
        let position = offset != null ? offset : this.position;
        this.validateBuffer(_bytes.length, position);
        for (let i = 0; i < _bytes.length; i++) {
            this.data.setInt8(position++, _bytes[i]);
        }
        if (!offset) {
            this.position = position;
        }
    }
    /**
     * Writes a Int16Array to the byte stream.
     * @param    _bytes    The Int16Array to be written.
     * @param    offset   optional start position to write
     */
    writeInt16Array(_bytes, offset = null) {
        let position = offset != null ? offset : this.position;
        this.validateBuffer(_bytes.length * ByteArray.SIZE_OF_INT16, position);
        for (let i = 0; i < _bytes.length; i++) {
            this.data.setInt16(position, _bytes[i], this.endian === ByteArray.LITTLE_ENDIAN);
            position += ByteArray.SIZE_OF_INT16;
        }
        if (!offset) {
            this.position = position;
        }
    }
    /**
     * Writes a Int32Array to the byte stream.
     * @param    _bytes    The Int32Array to be written.
     * @param    offset   optional start position to write
     */
    writeInt32Array(_bytes, offset = null) {
        let position = offset != null ? offset : this.position;
        this.validateBuffer(_bytes.length * ByteArray.SIZE_OF_INT32, position);
        for (let i = 0; i < _bytes.length; i++) {
            this.data.setInt32(position, _bytes[i], this.endian === ByteArray.LITTLE_ENDIAN);
            position += ByteArray.SIZE_OF_INT32;
        }
        if (!offset) {
            this.position = position;
        }
    }
    /**
     * Writes a Float32Array to the byte stream.
     * @param    _bytes    The Float32Array to be written.
     * @param    offset   optional start position to write
     */
    writeFloat32Array(_bytes, offset = null) {
        let position = offset != null ? offset : this.position;
        this.validateBuffer(_bytes.length * ByteArray.SIZE_OF_FLOAT32, position);
        for (let i = 0; i < _bytes.length; i++) {
            this.data.setFloat32(position, _bytes[i], this.endian === ByteArray.LITTLE_ENDIAN);
            position += ByteArray.SIZE_OF_FLOAT32;
        }
        if (!offset) {
            this.position = position;
        }
    }
    /**
     * Writes a Float64Array to the byte stream.
     * @param    _bytes    The Float64Array to be written.
     * @param    offset   optional start position to write
     */
    writeFloat64Array(_bytes, offset = null) {
        let position = offset != null ? offset : this.position;
        this.validateBuffer(_bytes.length, position);
        for (let i = 0; i < _bytes.length; i++) {
            this.data.setFloat64(position, _bytes[i], this.endian === ByteArray.LITTLE_ENDIAN);
            position += ByteArray.SIZE_OF_FLOAT64;
        }
        if (!offset) {
            this.position = position;
        }
    }
    /**
     * Read a Uint8Array from the byte stream.
     * @param    length An unsigned int16 indicating the length of the Uint8Array.
     */
    readUint8Array(length, createNewBuffer = true) {
        if (!this.validate(length))
            return null;
        if (!createNewBuffer) {
            var result = new Uint8Array(this.buffer, this.byteOffset + this.position, length);
            this.position += length;
        }
        else {
            result = new Uint8Array(new ArrayBuffer(length));
            for (var i = 0; i < length; i++) {
                result[i] = this.data.getUint8(this.position);
                this.position += ByteArray.SIZE_OF_UINT8;
            }
        }
        return result;
    }
    /**
     * Read a Uint16Array from the byte stream.
     * @param    length An unsigned int16 indicating the length of the Uint16Array.
     */
    readUint16Array(length, createNewBuffer = true) {
        var size = length * ByteArray.SIZE_OF_UINT16;
        if (!this.validate(size))
            return null;
        if (!createNewBuffer) {
            var result = new Uint16Array(this.buffer, this.byteOffset + this.position, length);
            this.position += size;
        }
        else {
            result = new Uint16Array(new ArrayBuffer(size));
            for (var i = 0; i < length; i++) {
                result[i] = this.data.getUint16(this.position, this.endian === ByteArray.LITTLE_ENDIAN);
                this.position += ByteArray.SIZE_OF_UINT16;
            }
        }
        return result;
    }
    /**
     * Read a Uint32Array from the byte stream.
     * @param    length An unsigned int16 indicating the length of the Uint32Array.
     */
    readUint32Array(length, createNewBuffer = true) {
        var size = length * ByteArray.SIZE_OF_UINT32;
        if (!this.validate(size))
            return null;
        if (!createNewBuffer) {
            var result = new Uint32Array(this.buffer, this.byteOffset + this.position, length);
            this.position += size;
        }
        else {
            result = new Uint32Array(new ArrayBuffer(size));
            for (var i = 0; i < length; i++) {
                result[i] = this.data.getUint32(this.position, this.endian === ByteArray.LITTLE_ENDIAN);
                this.position += ByteArray.SIZE_OF_UINT32;
            }
        }
        return result;
    }
    /**
     * Read a Int8Array from the byte stream.
     * @param    length An unsigned int16 indicating the length of the Int8Array.
     */
    readInt8Array(length, createNewBuffer = true) {
        if (!this.validate(length))
            return null;
        if (!createNewBuffer) {
            var result = new Int8Array(this.buffer, this.byteOffset + this.position, length);
            this.position += length;
        }
        else {
            result = new Int8Array(new ArrayBuffer(length));
            for (var i = 0; i < length; i++) {
                result[i] = this.data.getInt8(this.position);
                this.position += ByteArray.SIZE_OF_INT8;
            }
        }
        return result;
    }
    /**
     * Read a Int16Array from the byte stream.
     * @param    length An unsigned int16 indicating the length of the Int16Array.
     */
    readInt16Array(length, createNewBuffer = true) {
        var size = length * ByteArray.SIZE_OF_INT16;
        if (!this.validate(size))
            return null;
        if (!createNewBuffer) {
            var result = new Int16Array(this.buffer, this.byteOffset + this.position, length);
            this.position += size;
        }
        else {
            result = new Int16Array(new ArrayBuffer(size));
            for (var i = 0; i < length; i++) {
                result[i] = this.data.getInt16(this.position, this.endian === ByteArray.LITTLE_ENDIAN);
                this.position += ByteArray.SIZE_OF_INT16;
            }
        }
        return result;
    }
    /**
     * Read a Int32Array from the byte stream.
     * @param    length An unsigned int16 indicating the length of the Int32Array.
     */
    readInt32Array(length, createNewBuffer = true) {
        var size = length * ByteArray.SIZE_OF_INT32;
        if (!this.validate(size))
            return null;
        if (!createNewBuffer) {
            if ((this.byteOffset + this.position) % 4 == 0) {
                var result = new Int32Array(this.buffer, this.byteOffset + this.position, length);
                this.position += size;
            }
            else {
                var tmp = new Uint8Array(new ArrayBuffer(size));
                for (var i = 0; i < size; i++) {
                    tmp[i] = this.data.getUint8(this.position);
                    this.position += ByteArray.SIZE_OF_UINT8;
                }
                result = new Int32Array(tmp.buffer);
            }
        }
        else {
            result = new Int32Array(new ArrayBuffer(size));
            for (var i = 0; i < length; i++) {
                result[i] = this.data.getInt32(this.position, this.endian === ByteArray.LITTLE_ENDIAN);
                this.position += ByteArray.SIZE_OF_INT32;
            }
        }
        return result;
    }
    /**
     * Read a Float32Array from the byte stream.
     * @param    length An unsigned int16 indicating the length of the Float32Array.
     */
    readFloat32Array(length, createNewBuffer = true) {
        var size = length * ByteArray.SIZE_OF_FLOAT32;
        if (!this.validate(size))
            return null;
        if (!createNewBuffer) {
            if ((this.byteOffset + this.position) % 4 == 0) {
                var result = new Float32Array(this.buffer, this.byteOffset + this.position, length);
                this.position += size;
            }
            else {
                var tmp = new Uint8Array(new ArrayBuffer(size));
                for (var i = 0; i < size; i++) {
                    tmp[i] = this.data.getUint8(this.position);
                    this.position += ByteArray.SIZE_OF_UINT8;
                }
                result = new Float32Array(tmp.buffer);
            }
        }
        else {
            result = new Float32Array(new ArrayBuffer(size));
            for (var i = 0; i < length; i++) {
                result[i] = this.data.getFloat32(this.position, this.endian === ByteArray.LITTLE_ENDIAN);
                this.position += ByteArray.SIZE_OF_FLOAT32;
            }
        }
        return result;
    }
    /**
     * Read a Float64Array from the byte stream.
     * @param    length An unsigned int16 indicating the length of the Float64Array.
     */
    readFloat64Array(length, createNewBuffer = true) {
        var size = length * ByteArray.SIZE_OF_FLOAT64;
        if (!this.validate(size))
            return null;
        if (!createNewBuffer) {
            var result = new Float64Array(this.buffer, this.position, length);
            this.position += size;
        }
        else {
            result = new Float64Array(new ArrayBuffer(size));
            for (var i = 0; i < length; i++) {
                result[i] = this.data.getFloat64(this.position, this.endian === ByteArray.LITTLE_ENDIAN);
                this.position += ByteArray.SIZE_OF_FLOAT64;
            }
        }
        return result;
    }
    validate(len) {
        //len += this.data.byteOffset;
        if (this.data.byteLength > 0 && this._position + len <= this.data.byteLength) {
            return true;
        }
        else {
            throw 'Error #2030: End of file was encountered.';
        }
    }
    /**********************/
    /*  PRIVATE METHODS   */
    /**********************/
    validateBuffer(size, offset = 0) {
        let length = offset + size;
        this.resize(length);
    }
    /**
     * UTF-8 Encoding/Decoding
     */
    encodeUTF8(str) {
        var pos = 0;
        var codePoints = this.stringToCodePoints(str);
        var outputBytes = [];
        while (codePoints.length > pos) {
            var code_point = codePoints[pos++];
            if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                this.encoderError(code_point);
            }
            else if (this.inRange(code_point, 0x0000, 0x007f)) {
                outputBytes.push(code_point);
            }
            else {
                var count, offset;
                if (this.inRange(code_point, 0x0080, 0x07FF)) {
                    count = 1;
                    offset = 0xC0;
                }
                else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                    count = 2;
                    offset = 0xE0;
                }
                else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                    count = 3;
                    offset = 0xF0;
                }
                outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                while (count > 0) {
                    var temp = this.div(code_point, Math.pow(64, count - 1));
                    outputBytes.push(0x80 + (temp % 64));
                    count -= 1;
                }
            }
        }
        return new Uint8Array(outputBytes);
    }
    decodeUTF8(data) {
        var fatal = false;
        var pos = 0;
        var result = "";
        var code_point;
        var utf8_code_point = 0;
        var utf8_bytes_needed = 0;
        var utf8_bytes_seen = 0;
        var utf8_lower_boundary = 0;
        while (data.length > pos) {
            var _byte = data[pos++];
            if (_byte === this.EOF_byte) {
                if (utf8_bytes_needed !== 0) {
                    code_point = this.decoderError(fatal);
                }
                else {
                    code_point = this.EOF_code_point;
                }
            }
            else {
                if (utf8_bytes_needed === 0) {
                    if (this.inRange(_byte, 0x00, 0x7F)) {
                        code_point = _byte;
                    }
                    else {
                        if (this.inRange(_byte, 0xC2, 0xDF)) {
                            utf8_bytes_needed = 1;
                            utf8_lower_boundary = 0x80;
                            utf8_code_point = _byte - 0xC0;
                        }
                        else if (this.inRange(_byte, 0xE0, 0xEF)) {
                            utf8_bytes_needed = 2;
                            utf8_lower_boundary = 0x800;
                            utf8_code_point = _byte - 0xE0;
                        }
                        else if (this.inRange(_byte, 0xF0, 0xF4)) {
                            utf8_bytes_needed = 3;
                            utf8_lower_boundary = 0x10000;
                            utf8_code_point = _byte - 0xF0;
                        }
                        else {
                            this.decoderError(fatal);
                        }
                        utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                        code_point = null;
                    }
                }
                else if (!this.inRange(_byte, 0x80, 0xBF)) {
                    utf8_code_point = 0;
                    utf8_bytes_needed = 0;
                    utf8_bytes_seen = 0;
                    utf8_lower_boundary = 0;
                    pos--;
                    code_point = this.decoderError(fatal, _byte);
                }
                else {
                    utf8_bytes_seen += 1;
                    utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                    if (utf8_bytes_seen !== utf8_bytes_needed) {
                        code_point = null;
                    }
                    else {
                        var cp = utf8_code_point;
                        var lower_boundary = utf8_lower_boundary;
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                            code_point = cp;
                        }
                        else {
                            code_point = this.decoderError(fatal, _byte);
                        }
                    }
                }
            }
            //Decode string
            if (code_point !== null && code_point !== this.EOF_code_point) {
                if (code_point <= 0xFFFF) {
                    if (code_point > 0)
                        result += String.fromCharCode(code_point);
                }
                else {
                    code_point -= 0x10000;
                    result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                    result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                }
            }
        }
        return result;
    }
    encoderError(code_point) {
        throw 'EncodingError! The code point ' + code_point + ' could not be encoded.';
    }
    decoderError(fatal, opt_code_point) {
        if (fatal) {
            throw 'DecodingError';
        }
        return opt_code_point || 0xFFFD;
    }
    inRange(a, min, max) {
        return min <= a && a <= max;
    }
    div(n, d) {
        return Math.floor(n / d);
    }
    stringToCodePoints(string) {
        /** @type {Array.<number>} */
        var cps = [];
        // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
        var i = 0, n = string.length;
        while (i < string.length) {
            var c = string.charCodeAt(i);
            if (!this.inRange(c, 0xD800, 0xDFFF)) {
                cps.push(c);
            }
            else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                cps.push(0xFFFD);
            }
            else {
                if (i === n - 1) {
                    cps.push(0xFFFD);
                }
                else {
                    var d = string.charCodeAt(i + 1);
                    if (this.inRange(d, 0xDC00, 0xDFFF)) {
                        var a = c & 0x3FF;
                        var b = d & 0x3FF;
                        i += 1;
                        cps.push(0x10000 + (a << 10) + b);
                    }
                    else {
                        cps.push(0xFFFD);
                    }
                }
            }
            i += 1;
        }
        return cps;
    }
}
ByteArray.BIG_ENDIAN = "bigEndian";
ByteArray.LITTLE_ENDIAN = "littleEndian";
ByteArray.SIZE_OF_BOOLEAN = 1;
ByteArray.SIZE_OF_INT8 = 1;
ByteArray.SIZE_OF_INT16 = 2;
ByteArray.SIZE_OF_INT32 = 4;
ByteArray.SIZE_OF_INT64 = 8;
ByteArray.SIZE_OF_UINT8 = 1;
ByteArray.SIZE_OF_UINT16 = 2;
ByteArray.SIZE_OF_UINT32 = 4;
ByteArray.SIZE_OF_UINT64 = 8;
ByteArray.SIZE_OF_FLOAT32 = 4;
ByteArray.SIZE_OF_FLOAT64 = 8;
exports.ByteArray = ByteArray;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by n.vinayakan on 02.06.17.
 */
var WasmSection;
(function (WasmSection) {
    WasmSection[WasmSection["Custom"] = 0] = "Custom";
    WasmSection[WasmSection["Signature"] = 1] = "Signature";
    WasmSection[WasmSection["Import"] = 2] = "Import";
    WasmSection[WasmSection["Function"] = 3] = "Function";
    WasmSection[WasmSection["Table"] = 4] = "Table";
    WasmSection[WasmSection["Memory"] = 5] = "Memory";
    WasmSection[WasmSection["Global"] = 6] = "Global";
    WasmSection[WasmSection["Export"] = 7] = "Export";
    WasmSection[WasmSection["Start"] = 8] = "Start";
    WasmSection[WasmSection["Element"] = 9] = "Element";
    WasmSection[WasmSection["Code"] = 10] = "Code";
    WasmSection[WasmSection["Data"] = 11] = "Data";
})(WasmSection = exports.WasmSection || (exports.WasmSection = {}));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __webpack_require__(19);
const color_1 = __webpack_require__(18);
/**
 * Created by n.vinayakan on 06.06.17.
 */
class Terminal {
    static log(text) {
        Terminal.write(text + "\n");
    }
    static write(text) {
        Terminal.history += text;
        if (Terminal.silent) {
            return;
        }
        if (env_1.isNode) {
            process.stdout.write(text);
        }
        else {
            console.log(`%c${text}`, `background: ${Terminal.browserStyles.background};` +
                `color: ${Terminal.browserStyles.text};` +
                `font-weight: ${Terminal.browserStyles.bold ? "700" : "100"};`);
        }
    }
    static time(name) {
        if (!Terminal.silent) {
            console.time(name);
        }
    }
    static timeEnd(name) {
        if (!Terminal.silent) {
            console.timeEnd(name);
        }
    }
    static setBGColor(color) {
        if (env_1.isNode) {
            if (process.stdout.isTTY) {
                process.stdout.write(`\x1B[48;5;${color === null ? "" : color}m`);
            }
        }
        else {
            Terminal.browserStyles.background = color_1.HexColor[color];
        }
    }
    static setTextColor(color) {
        if (env_1.isNode) {
            if (process.stdout.isTTY) {
                process.stdout.write(`\x1B[38;5;${color}m`);
            }
        }
        else {
            Terminal.browserStyles.text = color_1.HexColor[color];
        }
    }
    static setBoldText() {
        if (env_1.isNode) {
            if (process.stdout.isTTY) {
                process.stdout.write(`\x1B[38;1m`);
            }
        }
        else {
            Terminal.browserStyles.bold = true;
        }
    }
    static clearColor() {
        if (env_1.isNode) {
            if (process.stdout.isTTY) {
                process.stdout.write(`\x1B[0m`);
            }
        }
        else {
            Terminal.browserStyles.text = color_1.HexColor[color_1.Color.DEFAULT_TEXT];
            Terminal.browserStyles.background = color_1.HexColor[color_1.Color.DEFAULT_BG];
            Terminal.browserStyles.bold = false;
        }
    }
    static error(text) {
        Terminal.setBGColor(color_1.Color.RED);
        Terminal.setTextColor(color_1.Color.WHITE);
        Terminal.write(" ERROR ");
        Terminal.clearColor();
        Terminal.setTextColor(color_1.Color.RED);
        Terminal.write(" ");
        Terminal.write(text);
        Terminal.write("\n");
        Terminal.clearColor();
    }
    static warn(text) {
        Terminal.setBGColor(color_1.Color.ORANGE);
        Terminal.setTextColor(color_1.Color.WHITE);
        Terminal.write(" WARN ");
        Terminal.clearColor();
        Terminal.setTextColor(color_1.Color.ORANGE);
        Terminal.write(" ");
        Terminal.write(text);
        Terminal.write("\n");
        Terminal.clearColor();
    }
}
Terminal.silent = false;
Terminal.history = "";
Terminal.browserStyles = {
    text: color_1.HexColor[color_1.Color.DEFAULT_TEXT],
    background: color_1.HexColor[color_1.Color.DEFAULT_BG],
    bold: false
};
exports.Terminal = Terminal;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const terminal_1 = __webpack_require__(2);
/**
 * Created by n.vinayakan on 06.06.17.
 */
function assert(truth) {
    if (!truth) {
        debugger;
        terminal_1.Terminal.error('Assertion failed');
        if (typeof process !== "undefined") {
            process.exit(1);
        }
        else {
            throw 'Assertion failed';
        }
    }
}
exports.assert = assert;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bytearray_1 = __webpack_require__(0);
const logger_1 = __webpack_require__(32);
const stringbuilder_1 = __webpack_require__(20);
const wasm_section_1 = __webpack_require__(1);
const utils_1 = __webpack_require__(8);
/**
 * Created by n.vinayakan on 17.06.17.
 */
class WasmSectionBinary {
    constructor(id, // section code
        payload_len, // size of this section in bytes
        name_len = -1, // length of name in bytes, present if id == 0
        name = "", // section name: valid UTF-8 byte sequence, present if id == 0
        payload = new bytearray_1.ByteArray() // content of this section, of length payload_len - sizeof(name) - sizeof(name_len)
    ) {
        this.id = id;
        this.payload_len = payload_len;
        this.name_len = name_len;
        this.name = name;
        this.payload = payload; // content of this section, of length payload_len - sizeof(name) - sizeof(name_len)
        this.code = new stringbuilder_1.StringBuilder(2);
        this.code.indent = 1;
    }
    publish(data) {
        data.writeUnsignedLEB128(this.id); //section code
        logger_1.log(data, 0, null, ` - section: ${wasm_section_1.WasmSection[this.id]} [0x${utils_1.toHex(this.id, 2)}]`);
        if (this.id == 0) {
            let strData = new bytearray_1.ByteArray();
            strData.writeWasmString(this.name);
            logger_1.log(data, 0, this.payload.length, "section size");
            data.writeUnsignedLEB128(this.payload.length + strData.length); //size of this section in bytes
            data.copy(strData);
        }
        else {
            logger_1.log(data, 0, this.payload.length, "section size");
            data.writeUnsignedLEB128(this.payload.length); //size of this section in bytes
        }
        data.copy(this.payload);
        data.log += this.payload.log;
    }
    read() {
    }
}
exports.WasmSectionBinary = WasmSectionBinary;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = __webpack_require__(18);
const assert_1 = __webpack_require__(3);
const terminal_1 = __webpack_require__(2);
class LineColumn {
}
exports.LineColumn = LineColumn;
class Source {
    indexToLineColumn(index) {
        let contents = this.contents;
        let column = 0;
        let line = 0;
        let i = 0;
        // Just count the number of lines from the beginning of the file for now
        while (i < index) {
            let c = contents.charCodeAt(i);
            if (c == '\n'.charCodeAt(0)) {
                line = line + 1;
                column = 0;
            }
            else if (c < 0xDC00 || c > 0xDFFF) {
                column = column + 1;
            }
            i = i + 1;
        }
        let location = new LineColumn();
        location.line = line;
        location.column = column;
        return location;
    }
}
exports.Source = Source;
class SourceRange {
    toString() {
        return this.source.contents.slice(this.start, this.end);
    }
    equals(other) {
        return this.source == other.source && this.start == other.start && this.end == other.end;
    }
    enclosingLine() {
        let contents = this.source.contents;
        let start = this.start;
        let end = this.start;
        while (start > 0 && contents[start - 1] != '\n') {
            start = start - 1;
        }
        let length = contents.length;
        while (end < length && contents[end] != '\n') {
            end = end + 1;
        }
        return createRange(this.source, start, end);
    }
    rangeAtEnd() {
        return createRange(this.source, this.end, this.end);
    }
}
exports.SourceRange = SourceRange;
function createRange(source, start, end) {
    assert_1.assert(start <= end);
    let range = new SourceRange();
    range.source = source;
    range.start = start;
    range.end = end;
    return range;
}
exports.createRange = createRange;
function spanRanges(left, right) {
    assert_1.assert(left.source == right.source);
    assert_1.assert(left.start <= right.start);
    assert_1.assert(left.end <= right.end);
    return createRange(left.source, left.start, right.end);
}
exports.spanRanges = spanRanges;
var DiagnosticKind;
(function (DiagnosticKind) {
    DiagnosticKind[DiagnosticKind["ERROR"] = 0] = "ERROR";
    DiagnosticKind[DiagnosticKind["WARNING"] = 1] = "WARNING";
})(DiagnosticKind = exports.DiagnosticKind || (exports.DiagnosticKind = {}));
class Diagnostic {
    sourceName(location) {
        return `${this.range.source.name}:${location.line + 1}:${location.column + 1}: `;
    }
    lineContents() {
        let range = this.range.enclosingLine();
        return range.source.contents.slice(range.start, range.end) + "\n";
    }
    sourceRange(location) {
        let range = this.range;
        let column = location.column;
        let contents = range.source.contents;
        let rangeStr = "";
        // Whitespace
        while (column > 0) {
            rangeStr += ' ';
            column = column - 1;
        }
        // Single character
        if (range.end - range.start <= 1) {
            rangeStr += '^';
        }
        else {
            let i = range.start;
            while (i < range.end && contents[i] != '\n') {
                rangeStr += '~';
                i = i + 1;
            }
        }
        return rangeStr + '\n';
    }
}
exports.Diagnostic = Diagnostic;
class Log {
    error(range, message) {
        this.append(range, message, DiagnosticKind.ERROR);
    }
    warning(range, message) {
        this.append(range, message, DiagnosticKind.WARNING);
    }
    append(range, message, kind) {
        let diagnostic = new Diagnostic();
        diagnostic.range = range;
        diagnostic.message = message;
        diagnostic.kind = kind;
        if (this.first == null)
            this.first = diagnostic;
        else
            this.last.next = diagnostic;
        this.last = diagnostic;
    }
    toString() {
        let str = "";
        let diagnostic = this.first;
        while (diagnostic != null) {
            let location = diagnostic.range.source.indexToLineColumn(diagnostic.range.start);
            str += diagnostic.sourceName(location);
            str += diagnostic.kind == DiagnosticKind.ERROR ? "ERROR: " : "WARN: ";
            str += diagnostic.message + "\n";
            str += diagnostic.lineContents();
            str += diagnostic.sourceRange(location);
            diagnostic = diagnostic.next;
        }
        return str;
    }
    hasErrors() {
        let diagnostic = this.first;
        while (diagnostic != null) {
            if (diagnostic.kind == DiagnosticKind.ERROR) {
                return true;
            }
            diagnostic = diagnostic.next;
        }
        return false;
    }
}
exports.Log = Log;
function writeLogToTerminal(log) {
    let diagnostic = log.first;
    while (diagnostic != null) {
        if (diagnostic.range !== undefined) {
            let location = diagnostic.range.source.indexToLineColumn(diagnostic.range.start);
            // Source
            let diagnosticMessage = diagnostic.sourceName(location);
            terminal_1.Terminal.setBoldText();
            terminal_1.Terminal.write(diagnosticMessage);
            // Kind
            diagnosticMessage = diagnostic.kind == DiagnosticKind.ERROR ? "ERROR: " : "WARN: ";
            terminal_1.Terminal.setTextColor(diagnostic.kind == DiagnosticKind.ERROR ? color_1.Color.RED : color_1.Color.ORANGE);
            terminal_1.Terminal.write(diagnosticMessage);
            // Message
            terminal_1.Terminal.setBoldText();
            terminal_1.Terminal.write(diagnostic.message + "\n");
            // Line contents
            terminal_1.Terminal.clearColor();
            terminal_1.Terminal.write(diagnostic.lineContents());
            // SourceRange
            diagnosticMessage = diagnostic.sourceRange(location);
            terminal_1.Terminal.setTextColor(color_1.Color.RED);
            terminal_1.Terminal.write(diagnosticMessage);
        }
        else {
            terminal_1.Terminal.setTextColor(color_1.Color.RED);
            terminal_1.Terminal.write(diagnostic.message + "\n");
        }
        diagnostic = diagnostic.next;
    }
    terminal_1.Terminal.clearColor();
}
exports.writeLogToTerminal = writeLogToTerminal;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by n.vinayakan on 02.06.17.
 */
var WasmType;
(function (WasmType) {
    WasmType[WasmType["VOID"] = 0] = "VOID";
    WasmType[WasmType["I32"] = 127] = "I32";
    WasmType[WasmType["I64"] = 126] = "I64";
    WasmType[WasmType["F32"] = 125] = "F32";
    WasmType[WasmType["F64"] = 124] = "F64";
    WasmType[WasmType["anyfunc"] = 112] = "anyfunc";
    WasmType[WasmType["func"] = 96] = "func";
    WasmType[WasmType["block_type"] = 64] = "block_type";
})(WasmType = exports.WasmType || (exports.WasmType = {}));
class WasmWrappedType {
}
exports.WasmWrappedType = WasmWrappedType;
const idTostring = {};
idTostring[WasmType.VOID] = "void";
idTostring[WasmType.I32] = "i32";
idTostring[WasmType.I64] = "i64";
idTostring[WasmType.F32] = "f32";
idTostring[WasmType.F64] = "f64";
exports.WasmTypeToString = idTostring;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __webpack_require__(10);
const utils_1 = __webpack_require__(8);
const assert_1 = __webpack_require__(3);
var SymbolKind;
(function (SymbolKind) {
    SymbolKind[SymbolKind["TYPE_MODULE"] = 0] = "TYPE_MODULE";
    SymbolKind[SymbolKind["TYPE_INTERFACE"] = 1] = "TYPE_INTERFACE";
    SymbolKind[SymbolKind["TYPE_CLASS"] = 2] = "TYPE_CLASS";
    SymbolKind[SymbolKind["TYPE_GENERIC"] = 3] = "TYPE_GENERIC";
    SymbolKind[SymbolKind["TYPE_TEMPLATE"] = 4] = "TYPE_TEMPLATE";
    SymbolKind[SymbolKind["TYPE_ENUM"] = 5] = "TYPE_ENUM";
    SymbolKind[SymbolKind["TYPE_GLOBAL"] = 6] = "TYPE_GLOBAL";
    SymbolKind[SymbolKind["TYPE_NATIVE"] = 7] = "TYPE_NATIVE";
    SymbolKind[SymbolKind["FUNCTION_INSTANCE"] = 8] = "FUNCTION_INSTANCE";
    SymbolKind[SymbolKind["FUNCTION_GLOBAL"] = 9] = "FUNCTION_GLOBAL";
    SymbolKind[SymbolKind["VARIABLE_ARGUMENT"] = 10] = "VARIABLE_ARGUMENT";
    SymbolKind[SymbolKind["VARIABLE_CONSTANT"] = 11] = "VARIABLE_CONSTANT";
    SymbolKind[SymbolKind["VARIABLE_GLOBAL"] = 12] = "VARIABLE_GLOBAL";
    SymbolKind[SymbolKind["VARIABLE_INSTANCE"] = 13] = "VARIABLE_INSTANCE";
    SymbolKind[SymbolKind["VARIABLE_LOCAL"] = 14] = "VARIABLE_LOCAL";
})(SymbolKind = exports.SymbolKind || (exports.SymbolKind = {}));
function isModule(kind) {
    return kind == SymbolKind.TYPE_MODULE;
}
exports.isModule = isModule;
function isType(kind) {
    return kind >= SymbolKind.TYPE_CLASS && kind <= SymbolKind.TYPE_NATIVE;
}
exports.isType = isType;
function isFunction(kind) {
    return kind >= SymbolKind.FUNCTION_INSTANCE && kind <= SymbolKind.FUNCTION_GLOBAL;
}
exports.isFunction = isFunction;
function isVariable(kind) {
    return kind >= SymbolKind.VARIABLE_ARGUMENT && kind <= SymbolKind.VARIABLE_LOCAL;
}
exports.isVariable = isVariable;
var SymbolState;
(function (SymbolState) {
    SymbolState[SymbolState["UNINITIALIZED"] = 0] = "UNINITIALIZED";
    SymbolState[SymbolState["INITIALIZING"] = 1] = "INITIALIZING";
    SymbolState[SymbolState["INITIALIZED"] = 2] = "INITIALIZED";
})(SymbolState = exports.SymbolState || (exports.SymbolState = {}));
exports.SYMBOL_FLAG_CONVERT_INSTANCE_TO_GLOBAL = 1 << 0;
exports.SYMBOL_FLAG_IS_BINARY_OPERATOR = 1 << 1;
exports.SYMBOL_FLAG_IS_REFERENCE = 1 << 2;
exports.SYMBOL_FLAG_IS_UNARY_OPERATOR = 1 << 3;
exports.SYMBOL_FLAG_IS_UNSIGNED = 1 << 4;
exports.SYMBOL_FLAG_NATIVE_INTEGER = 1 << 5;
exports.SYMBOL_FLAG_NATIVE_LONG = 1 << 6;
exports.SYMBOL_FLAG_NATIVE_FLOAT = 1 << 7;
exports.SYMBOL_FLAG_NATIVE_DOUBLE = 1 << 8;
exports.SYMBOL_FLAG_USED = 1 << 9;
exports.SYMBOL_FLAG_IS_ARRAY = 1 << 10;
exports.SYMBOL_FLAG_IS_GENERIC = 1 << 11;
exports.SYMBOL_FLAG_IS_TEMPLATE = 1 << 12;
class Symbol {
    constructor() {
        this.state = SymbolState.UNINITIALIZED;
        this.byteSize = 0;
        this.maxAlignment = 0;
    }
    get internalName() {
        return this.rename != null ? this.rename : this.name;
    }
    clone() {
        let symbol = new Symbol();
        symbol.kind = this.kind;
        symbol.name = this.name;
        symbol.node = this.node;
        symbol.range = this.range;
        symbol.scope = this.scope;
        symbol.resolvedType = this.resolvedType;
        symbol.byteSize = this.byteSize;
        symbol.state = this.state;
        symbol.maxAlignment = this.maxAlignment;
        symbol.flags = this.flags;
        symbol.rename = this.rename;
        return symbol;
    }
    isEnumValue() {
        return this.node.parent.kind == node_1.NodeKind.ENUM;
    }
    isUnsafe() {
        return this.node != null && this.node.isUnsafe();
    }
    isGetter() {
        return this.node.isGet();
    }
    isSetter() {
        return this.node.isSet();
    }
    isBinaryOperator() {
        return (this.flags & exports.SYMBOL_FLAG_IS_BINARY_OPERATOR) != 0;
    }
    isUnaryOperator() {
        return (this.flags & exports.SYMBOL_FLAG_IS_UNARY_OPERATOR) != 0;
    }
    shouldConvertInstanceToGlobal() {
        return (this.flags & exports.SYMBOL_FLAG_CONVERT_INSTANCE_TO_GLOBAL) != 0;
    }
    isUsed() {
        return (this.flags & exports.SYMBOL_FLAG_USED) != 0;
    }
    parent() {
        var parent = this.node.parent;
        return parent.kind == node_1.NodeKind.CLASS ? parent.symbol : null;
    }
    resolvedTypeUnderlyingIfEnumValue(context) {
        return this.isEnumValue() ? this.resolvedType.underlyingType(context) : this.resolvedType;
    }
    determineClassLayout(context) {
        assert_1.assert(this.kind == SymbolKind.TYPE_CLASS);
        // Only determine class layout once
        if (this.byteSize != 0) {
            return;
        }
        var offset = 0;
        var child = this.node.firstChild;
        var maxAlignment = 1;
        while (child != null) {
            if (child.kind == node_1.NodeKind.VARIABLE) {
                var type = child.symbol.resolvedType;
                // Ignore invalid members
                if (type != context.errorType) {
                    var alignmentOf = type.variableAlignmentOf(context);
                    // Align the member to the next available slot
                    offset = utils_1.alignToNextMultipleOf(offset, alignmentOf);
                    if (alignmentOf > maxAlignment)
                        maxAlignment = alignmentOf;
                    // Allocate the member by extending the object
                    child.symbol.offset = offset;
                    offset = offset + type.variableSizeOf(context);
                }
            }
            child = child.nextSibling;
        }
        // All objects must have a non-zero size
        if (offset == 0) {
            offset = 1;
        }
        // The object size must be a multiple of the maximum alignment for arrays to work correctly
        offset = utils_1.alignToNextMultipleOf(offset, maxAlignment);
        this.byteSize = offset;
        this.maxAlignment = maxAlignment;
    }
}
exports.Symbol = Symbol;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __webpack_require__(3);
/**
 * Created by Nidin Vinayakan on 17/01/17.
 */
function toHex(value, size = 7) {
    if (value == undefined || value == null) {
        return "";
    }
    let hex = value.toString(16);
    let zero = [];
    for (let i = 0; i < size; i++) {
        zero.push("0");
    }
    let str = hex.split("");
    str.forEach((s) => {
        zero.shift();
        zero.push(s);
    });
    return zero.join("");
}
exports.toHex = toHex;
function isPositivePowerOf2(value) {
    return value > 0 && (value & (value - 1)) == 0;
}
exports.isPositivePowerOf2 = isPositivePowerOf2;
function alignToNextMultipleOf(offset, alignment) {
    assert_1.assert(isPositivePowerOf2(alignment));
    return (offset + alignment - 1) & -alignment;
}
exports.alignToNextMultipleOf = alignToNextMultipleOf;
function sizeOfNumber(value) {
    return value.toString(2).length / 8;
}
exports.sizeOfNumber = sizeOfNumber;
function isSigned(value) {
    return value < 0;
}
exports.isSigned = isSigned;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by n.vinayakan on 06.06.17.
 */
var CompileTarget;
(function (CompileTarget) {
    CompileTarget[CompileTarget["NONE"] = 0] = "NONE";
    CompileTarget[CompileTarget["AUTO"] = 1] = "AUTO";
    CompileTarget[CompileTarget["CPP"] = 2] = "CPP";
    CompileTarget[CompileTarget["JAVASCRIPT"] = 3] = "JAVASCRIPT";
    CompileTarget[CompileTarget["WEBASSEMBLY"] = 4] = "WEBASSEMBLY";
})(CompileTarget = exports.CompileTarget || (exports.CompileTarget = {}));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = __webpack_require__(7);
const assert_1 = __webpack_require__(3);
/**
 * Author: Nidin Vinayakan
 */
var NodeKind;
(function (NodeKind) {
    // Other
    NodeKind[NodeKind["EXTENDS"] = 0] = "EXTENDS";
    NodeKind[NodeKind["FILE"] = 1] = "FILE";
    NodeKind[NodeKind["GLOBAL"] = 2] = "GLOBAL";
    NodeKind[NodeKind["IMPLEMENTS"] = 3] = "IMPLEMENTS";
    NodeKind[NodeKind["PARAMETER"] = 4] = "PARAMETER";
    NodeKind[NodeKind["PARAMETERS"] = 5] = "PARAMETERS";
    NodeKind[NodeKind["VARIABLE"] = 6] = "VARIABLE";
    NodeKind[NodeKind["IMPORT"] = 7] = "IMPORT";
    NodeKind[NodeKind["IMPORT_FROM"] = 8] = "IMPORT_FROM";
    // Statements
    NodeKind[NodeKind["BLOCK"] = 9] = "BLOCK";
    NodeKind[NodeKind["BREAK"] = 10] = "BREAK";
    NodeKind[NodeKind["MODULE"] = 11] = "MODULE";
    NodeKind[NodeKind["IMPORTS"] = 12] = "IMPORTS";
    NodeKind[NodeKind["CLASS"] = 13] = "CLASS";
    NodeKind[NodeKind["CONSTANTS"] = 14] = "CONSTANTS";
    NodeKind[NodeKind["CONTINUE"] = 15] = "CONTINUE";
    NodeKind[NodeKind["EMPTY"] = 16] = "EMPTY";
    NodeKind[NodeKind["ENUM"] = 17] = "ENUM";
    NodeKind[NodeKind["EXPRESSIONS"] = 18] = "EXPRESSIONS";
    NodeKind[NodeKind["EXPRESSION"] = 19] = "EXPRESSION";
    NodeKind[NodeKind["FUNCTION"] = 20] = "FUNCTION";
    NodeKind[NodeKind["IF"] = 21] = "IF";
    NodeKind[NodeKind["RETURN"] = 22] = "RETURN";
    NodeKind[NodeKind["UNSAFE"] = 23] = "UNSAFE";
    NodeKind[NodeKind["JAVASCRIPT"] = 24] = "JAVASCRIPT";
    NodeKind[NodeKind["START"] = 25] = "START";
    NodeKind[NodeKind["VARIABLES"] = 26] = "VARIABLES";
    NodeKind[NodeKind["WHILE"] = 27] = "WHILE";
    NodeKind[NodeKind["FOR"] = 28] = "FOR";
    // Expressions
    NodeKind[NodeKind["ALIGN_OF"] = 29] = "ALIGN_OF";
    NodeKind[NodeKind["BOOLEAN"] = 30] = "BOOLEAN";
    NodeKind[NodeKind["CALL"] = 31] = "CALL";
    NodeKind[NodeKind["CAST"] = 32] = "CAST";
    NodeKind[NodeKind["DOT"] = 33] = "DOT";
    NodeKind[NodeKind["HOOK"] = 34] = "HOOK";
    NodeKind[NodeKind["INDEX"] = 35] = "INDEX";
    NodeKind[NodeKind["POINTER_INDEX"] = 36] = "POINTER_INDEX";
    NodeKind[NodeKind["ANY"] = 37] = "ANY";
    NodeKind[NodeKind["INT32"] = 38] = "INT32";
    NodeKind[NodeKind["INT64"] = 39] = "INT64";
    NodeKind[NodeKind["FLOAT32"] = 40] = "FLOAT32";
    NodeKind[NodeKind["FLOAT64"] = 41] = "FLOAT64";
    NodeKind[NodeKind["ARRAY"] = 42] = "ARRAY";
    NodeKind[NodeKind["GENERIC"] = 43] = "GENERIC";
    NodeKind[NodeKind["NAME"] = 44] = "NAME";
    NodeKind[NodeKind["NEW"] = 45] = "NEW";
    NodeKind[NodeKind["DELETE"] = 46] = "DELETE";
    NodeKind[NodeKind["NULL"] = 47] = "NULL";
    NodeKind[NodeKind["UNDEFINED"] = 48] = "UNDEFINED";
    NodeKind[NodeKind["PARSE_ERROR"] = 49] = "PARSE_ERROR";
    NodeKind[NodeKind["SIZE_OF"] = 50] = "SIZE_OF";
    NodeKind[NodeKind["STRING"] = 51] = "STRING";
    NodeKind[NodeKind["THIS"] = 52] = "THIS";
    NodeKind[NodeKind["TYPE"] = 53] = "TYPE";
    // Unary expressions
    NodeKind[NodeKind["ADDRESS_OF"] = 54] = "ADDRESS_OF";
    NodeKind[NodeKind["COMPLEMENT"] = 55] = "COMPLEMENT";
    NodeKind[NodeKind["DEREFERENCE"] = 56] = "DEREFERENCE";
    NodeKind[NodeKind["NEGATIVE"] = 57] = "NEGATIVE";
    NodeKind[NodeKind["NOT"] = 58] = "NOT";
    NodeKind[NodeKind["POINTER_TYPE"] = 59] = "POINTER_TYPE";
    NodeKind[NodeKind["POSITIVE"] = 60] = "POSITIVE";
    NodeKind[NodeKind["POSTFIX_DECREMENT"] = 61] = "POSTFIX_DECREMENT";
    NodeKind[NodeKind["POSTFIX_INCREMENT"] = 62] = "POSTFIX_INCREMENT";
    NodeKind[NodeKind["PREFIX_DECREMENT"] = 63] = "PREFIX_DECREMENT";
    NodeKind[NodeKind["PREFIX_INCREMENT"] = 64] = "PREFIX_INCREMENT";
    // Binary expressions
    NodeKind[NodeKind["ADD"] = 65] = "ADD";
    NodeKind[NodeKind["ASSIGN"] = 66] = "ASSIGN";
    NodeKind[NodeKind["BITWISE_AND"] = 67] = "BITWISE_AND";
    NodeKind[NodeKind["BITWISE_OR"] = 68] = "BITWISE_OR";
    NodeKind[NodeKind["BITWISE_XOR"] = 69] = "BITWISE_XOR";
    NodeKind[NodeKind["DIVIDE"] = 70] = "DIVIDE";
    NodeKind[NodeKind["EQUAL"] = 71] = "EQUAL";
    NodeKind[NodeKind["EXPONENT"] = 72] = "EXPONENT";
    NodeKind[NodeKind["GREATER_THAN"] = 73] = "GREATER_THAN";
    NodeKind[NodeKind["GREATER_THAN_EQUAL"] = 74] = "GREATER_THAN_EQUAL";
    NodeKind[NodeKind["LESS_THAN"] = 75] = "LESS_THAN";
    NodeKind[NodeKind["LESS_THAN_EQUAL"] = 76] = "LESS_THAN_EQUAL";
    NodeKind[NodeKind["LOGICAL_AND"] = 77] = "LOGICAL_AND";
    NodeKind[NodeKind["LOGICAL_OR"] = 78] = "LOGICAL_OR";
    NodeKind[NodeKind["MULTIPLY"] = 79] = "MULTIPLY";
    NodeKind[NodeKind["NOT_EQUAL"] = 80] = "NOT_EQUAL";
    NodeKind[NodeKind["REMAINDER"] = 81] = "REMAINDER";
    NodeKind[NodeKind["SHIFT_LEFT"] = 82] = "SHIFT_LEFT";
    NodeKind[NodeKind["SHIFT_RIGHT"] = 83] = "SHIFT_RIGHT";
    NodeKind[NodeKind["SUBTRACT"] = 84] = "SUBTRACT";
    //JavaScript
    NodeKind[NodeKind["JS_NUMBER"] = 85] = "JS_NUMBER";
    NodeKind[NodeKind["JS_OBJECT"] = 86] = "JS_OBJECT";
    NodeKind[NodeKind["JS_STRING"] = 87] = "JS_STRING";
    NodeKind[NodeKind["JS_ARRAY"] = 88] = "JS_ARRAY";
})(NodeKind = exports.NodeKind || (exports.NodeKind = {}));
function isUnary(kind) {
    return kind >= NodeKind.ADDRESS_OF && kind <= NodeKind.PREFIX_INCREMENT;
}
exports.isUnary = isUnary;
function isUnaryPostfix(kind) {
    return kind >= NodeKind.POSTFIX_DECREMENT && kind <= NodeKind.POSTFIX_INCREMENT;
}
exports.isUnaryPostfix = isUnaryPostfix;
function isBinary(kind) {
    return kind >= NodeKind.ADD && kind <= NodeKind.SUBTRACT;
}
exports.isBinary = isBinary;
function invertedBinaryKind(kind) {
    if (kind == NodeKind.EQUAL)
        return NodeKind.NOT_EQUAL;
    if (kind == NodeKind.NOT_EQUAL)
        return NodeKind.EQUAL;
    if (kind == NodeKind.GREATER_THAN)
        return NodeKind.LESS_THAN_EQUAL;
    if (kind == NodeKind.GREATER_THAN_EQUAL)
        return NodeKind.LESS_THAN;
    if (kind == NodeKind.LESS_THAN)
        return NodeKind.GREATER_THAN_EQUAL;
    if (kind == NodeKind.LESS_THAN_EQUAL)
        return NodeKind.GREATER_THAN;
    return kind;
}
exports.invertedBinaryKind = invertedBinaryKind;
function isExpression(node) {
    return node.kind >= NodeKind.ALIGN_OF && node.kind <= NodeKind.SUBTRACT;
}
exports.isExpression = isExpression;
function isCompactNodeKind(kind) {
    return kind == NodeKind.CONSTANTS || kind == NodeKind.EXPRESSION || kind == NodeKind.VARIABLES;
}
exports.isCompactNodeKind = isCompactNodeKind;
exports.NODE_FLAG = {
    DECLARE: 1 << 0,
    EXPORT: 1 << 1,
    IMPORT: 1 << 2,
    LIBRARY: 1 << 3,
    GET: 1 << 4,
    OPERATOR: 1 << 5,
    POSITIVE: 1 << 6,
    PRIVATE: 1 << 7,
    PROTECTED: 1 << 8,
    PUBLIC: 1 << 9,
    SET: 1 << 10,
    STATIC: 1 << 11,
    UNSAFE: 1 << 12,
    JAVASCRIPT: 1 << 13,
    UNSIGNED_OPERATOR: 1 << 14,
    VIRTUAL: 1 << 15,
    START: 1 << 16,
    ANYFUNC: 1 << 17,
    GENERIC: 1 << 18,
};
class NodeFlag {
}
exports.NodeFlag = NodeFlag;
function appendFlag(first, flag, range) {
    let link = new NodeFlag();
    link.flag = flag;
    link.range = range;
    // Is the list empty?
    if (first == null) {
        return link;
    }
    // Append the flag to the end of the list
    let secondToLast = first;
    while (secondToLast.next != null) {
        secondToLast = secondToLast.next;
    }
    secondToLast.next = link;
    return first;
}
exports.appendFlag = appendFlag;
function allFlags(link) {
    let all = 0;
    while (link != null) {
        all = all | link.flag;
        link = link.next;
    }
    return all;
}
exports.allFlags = allFlags;
function rangeForFlag(link, flag) {
    while (link != null) {
        if (link.flag == flag) {
            return link.range;
        }
        link = link.next;
    }
    return null;
}
exports.rangeForFlag = rangeForFlag;
class Node {
    constructor(options = {}) {
        Object.assign(this, options);
    }
    get hasValue() {
        return this._hasValue;
    }
    get rawValue() {
        if (this._hasStringValue) {
            return `"${this._rawValue}"`;
        }
        else {
            return this._rawValue;
        }
    }
    get __internal_rawValue() {
        return this._rawValue;
    }
    set rawValue(newValue) {
        this._hasValue = true;
        this._rawValue = newValue;
    }
    get intValue() {
        let n = this._rawValue;
        if (Number(n) === n && n % 1 === 0) {
            return this._rawValue;
        }
        return null;
    }
    set intValue(newValue) {
        this._hasValue = true;
        this._rawValue = newValue;
    }
    get longValue() {
        //TODO: Implement Int64
        return this._rawValue;
    }
    set longValue(newValue) {
        //TODO: Implement Int64
        this._hasValue = true;
        this._rawValue = newValue;
    }
    get floatValue() {
        return this._rawValue;
    }
    set floatValue(newValue) {
        this._hasValue = true;
        this._rawValue = newValue;
    }
    get doubleValue() {
        return this._rawValue;
    }
    set doubleValue(newValue) {
        this._hasValue = true;
        this._rawValue = newValue;
    }
    get stringValue() {
        return this._rawValue;
    }
    set stringValue(newValue) {
        this._hasValue = true;
        this._hasStringValue = true;
        this._rawValue = newValue;
    }
    get referenceValue() {
        return this._rawValue;
    }
    set referenceValue(newValue) {
        this._hasValue = true;
        this._rawValue = newValue;
    }
    becomeTypeOf(node, context) {
        switch (node.resolvedType) {
            case context.int64Type:
                if (this.kind != NodeKind.NAME) {
                    this.kind = NodeKind.INT64;
                }
                this.resolvedType = context.int64Type;
                break;
            case context.float64Type:
                if (this.kind != NodeKind.NAME) {
                    this.kind = NodeKind.FLOAT64;
                }
                this.resolvedType = context.float64Type;
                break;
        }
        if (node.flags) {
            this.flags = node.flags;
        }
    }
    becomeValueTypeOf(symbol, context) {
        // let resolvedSymbol = symbol.resolvedType.pointerTo ? symbol.resolvedType.pointerTo.symbol : symbol.resolvedType.symbol;
        let resolvedSymbol = symbol.resolvedType.symbol;
        if (resolvedSymbol) {
            switch (symbol.resolvedType) {
                case context.int64Type:
                    this.resolvedType = context.int64Type;
                    if (this.kind == NodeKind.NULL) {
                        this.longValue = 0;
                    }
                    if (this.kind != NodeKind.NAME) {
                        this.kind = NodeKind.INT64;
                    }
                    break;
                case context.float64Type:
                    this.resolvedType = context.float64Type;
                    if (this.kind == NodeKind.NULL) {
                        this.doubleValue = 0.0;
                    }
                    if (this.kind != NodeKind.NAME) {
                        this.kind = NodeKind.FLOAT64;
                    }
                    break;
            }
        }
    }
    clone() {
        let node = new Node();
        node.kind = this.kind;
        if (this.offset !== undefined)
            node.offset = this.offset;
        if (this.flags !== undefined)
            node.flags = this.flags;
        if (this.firstFlag !== undefined)
            node.firstFlag = this.firstFlag;
        // if(this.constructorFunctionNode) node.constructorFunctionNode = this.constructorFunctionNode;
        if (this.range !== undefined)
            node.range = this.range;
        if (this.internalRange !== undefined)
            node.internalRange = this.internalRange;
        if (this.hasValue)
            node.rawValue = this.__internal_rawValue;
        return node;
    }
    becomeSymbolReference(symbol) {
        this.kind = NodeKind.NAME;
        this.symbol = symbol;
        this.referenceValue = symbol.name;
        this.resolvedType = symbol.resolvedType;
        this.removeChildren();
    }
    becomeIntegerConstant(value) {
        this.kind = NodeKind.INT32;
        this.symbol = null;
        this.intValue = value;
        this.removeChildren();
    }
    becomeLongConstant(value) {
        this.kind = NodeKind.INT64;
        this.symbol = null;
        this.longValue = value;
        this.removeChildren();
    }
    becomeFloatConstant(value) {
        this.kind = NodeKind.FLOAT32;
        this.symbol = null;
        this.floatValue = value;
        this.removeChildren();
    }
    becomeDoubleConstant(value) {
        this.kind = NodeKind.FLOAT64;
        this.symbol = null;
        this.doubleValue = value;
        this.removeChildren();
    }
    becomeBooleanConstant(value) {
        this.kind = NodeKind.BOOLEAN;
        this.symbol = null;
        this.intValue = value ? 1 : 0;
        this.removeChildren();
    }
    isNegativeInteger() {
        return this.kind == NodeKind.INT32 && this.intValue < 0;
    }
    isNonNegativeInteger() {
        return this.kind == NodeKind.INT32 && this.intValue >= 0;
    }
    isDeclare() {
        return (this.flags & exports.NODE_FLAG.DECLARE) != 0;
    }
    isLibrary() {
        return (this.flags & exports.NODE_FLAG.LIBRARY) != 0;
    }
    isVirtual() {
        return (this.flags & exports.NODE_FLAG.VIRTUAL) != 0;
    }
    isExport() {
        return (this.flags & exports.NODE_FLAG.EXPORT) != 0;
    }
    isImport() {
        return (this.flags & exports.NODE_FLAG.IMPORT) != 0;
    }
    isExternalImport() {
        return this.isDeclare() && !this.isLibrary();
    }
    isStart() {
        return (this.flags & exports.NODE_FLAG.START) != 0;
    }
    isJavaScript() {
        return (this.flags & exports.NODE_FLAG.JAVASCRIPT) != 0;
    }
    isStatic() {
        return (this.flags & exports.NODE_FLAG.STATIC) != 0;
    }
    isAnyfunc() {
        return (this.flags & exports.NODE_FLAG.ANYFUNC) != 0;
    }
    isDeclareOrJavaScript() {
        return (this.flags & (exports.NODE_FLAG.DECLARE | exports.NODE_FLAG.JAVASCRIPT)) != 0;
    }
    isDeclareOrExport() {
        return (this.flags & (exports.NODE_FLAG.DECLARE | exports.NODE_FLAG.EXPORT)) != 0;
    }
    isGet() {
        return (this.flags & exports.NODE_FLAG.GET) != 0;
    }
    isSet() {
        return (this.flags & exports.NODE_FLAG.SET) != 0;
    }
    isOperator() {
        return (this.flags & exports.NODE_FLAG.OPERATOR) != 0;
    }
    isPositive() {
        return (this.flags & exports.NODE_FLAG.POSITIVE) != 0;
    }
    isPrivate() {
        return (this.flags & exports.NODE_FLAG.PRIVATE) != 0;
    }
    isUnsafe() {
        return (this.flags & exports.NODE_FLAG.UNSAFE) != 0;
    }
    isGeneric() {
        return (this.flags & exports.NODE_FLAG.GENERIC) != 0;
    }
    isTemplate() {
        return this.symbol && (this.symbol.flags & symbol_1.SYMBOL_FLAG_IS_TEMPLATE) != 0;
    }
    isUnsignedOperator() {
        return (this.flags & exports.NODE_FLAG.UNSIGNED_OPERATOR) != 0;
    }
    childCount() {
        let count = 0;
        let child = this.firstChild;
        while (child != null) {
            count = count + 1;
            child = child.nextSibling;
        }
        return count;
    }
    parameterCount() {
        let count = 0;
        let child = this.firstChild;
        if (child.kind == NodeKind.PARAMETERS) {
            child = child.firstChild;
            while (child != null) {
                count = count + 1;
                child = child.nextSibling;
            }
        }
        return count;
    }
    hasParameters() {
        if (this.firstChild) {
            let child = this.firstChild;
            if (child.kind == NodeKind.PARAMETERS) {
                return child.childCount() > 0;
            }
        }
        return false;
    }
    createEmptyConstructor() {
        let node = createFunction("constructor");
        node.appendChild(createName(this.symbol.name));
        let body = createBlock();
        node.appendChild(body);
        let variablesNode = createVariables();
        variablesNode.appendChild(createVariable("this", createType(this.resolvedType), null));
        body.appendChild(variablesNode);
        let returnNode = createReturn(createName("this"));
        body.appendChild(returnNode);
        // let symbol = new Symbol();
        // symbol.kind = SymbolKind.FUNCTION_INSTANCE;
        // symbol.name = node.stringValue;
        // symbol.rename = "_ctr";
        // addScopeToSymbol(symbol, this.scope);
        // linkSymbolToNode(symbol, node);
        return node;
    }
    firstInstanceFunction() {
        let child = this.firstChild;
        while (child !== undefined) {
            if (child.kind == NodeKind.FUNCTION) {
                return child;
            }
            child = child.nextSibling;
        }
        return null;
    }
    appendChild(child) {
        child.parent = this;
        if (this.firstChild == null) {
            this.firstChild = child;
            this.firstChild.offset = 0;
        }
        else {
            child.previousSibling = this.lastChild;
            this.lastChild.nextSibling = child;
            child.offset = this.lastChild.offset + 1;
        }
        this.lastChild = child;
    }
    insertChildBefore(after, before) {
        if (before == null) {
            return;
        }
        assert_1.assert(before != after);
        assert_1.assert(before.parent == null);
        assert_1.assert(before.previousSibling == null);
        assert_1.assert(before.nextSibling == null);
        assert_1.assert(after == null || after.parent == this);
        if (after == null) {
            this.appendChild(before);
            return;
        }
        before.parent = this;
        before.previousSibling = after.previousSibling;
        before.nextSibling = after;
        if (after.previousSibling != null) {
            assert_1.assert(after == after.previousSibling.nextSibling);
            after.previousSibling.nextSibling = before;
        }
        else {
            assert_1.assert(after == this.firstChild);
            this.firstChild = before;
        }
        after.previousSibling = before;
    }
    insertChildAfter(before, after) {
        if (after == null) {
            return;
        }
        assert_1.assert(before != after);
        assert_1.assert(after.parent == null);
        assert_1.assert(after.previousSibling == null);
        assert_1.assert(after.nextSibling == null);
        assert_1.assert(before == null || before.parent == this);
        if (before == null) {
            this.appendChild(after);
            return;
        }
        after.parent = this;
        after.previousSibling = before;
        after.nextSibling = before.nextSibling;
        if (before.nextSibling != null) {
            assert_1.assert(before == before.nextSibling.previousSibling);
            before.nextSibling.previousSibling = after;
        }
        before.nextSibling = after;
    }
    remove() {
        assert_1.assert(this.parent != null);
        if (this.previousSibling != null) {
            assert_1.assert(this.previousSibling.nextSibling == this);
            this.previousSibling.nextSibling = this.nextSibling;
        }
        else {
            assert_1.assert(this.parent.firstChild == this);
            this.parent.firstChild = this.nextSibling;
        }
        if (this.nextSibling != null) {
            assert_1.assert(this.nextSibling.previousSibling == this);
            this.nextSibling.previousSibling = this.previousSibling;
        }
        else {
            assert_1.assert(this.parent.lastChild == this);
            this.parent.lastChild = this.previousSibling;
        }
        this.parent = null;
        this.previousSibling = null;
        this.nextSibling = null;
        return this;
    }
    removeChildren() {
        while (this.lastChild != null) {
            this.lastChild.remove();
        }
    }
    replaceWith(node) {
        assert_1.assert(node != this);
        assert_1.assert(this.parent != null);
        assert_1.assert(node.parent == null);
        assert_1.assert(node.previousSibling == null);
        assert_1.assert(node.nextSibling == null);
        node.parent = this.parent;
        node.previousSibling = this.previousSibling;
        node.nextSibling = this.nextSibling;
        if (this.previousSibling != null) {
            assert_1.assert(this.previousSibling.nextSibling == this);
            this.previousSibling.nextSibling = node;
        }
        else {
            assert_1.assert(this.parent.firstChild == this);
            this.parent.firstChild = node;
        }
        if (this.nextSibling != null) {
            assert_1.assert(this.nextSibling.previousSibling == this);
            this.nextSibling.previousSibling = node;
        }
        else {
            assert_1.assert(this.parent.lastChild == this);
            this.parent.lastChild = node;
        }
        this.parent = null;
        this.previousSibling = null;
        this.nextSibling = null;
    }
    isType() {
        return this.kind == NodeKind.TYPE || this.kind == NodeKind.POINTER_TYPE || this.symbol != null && symbol_1.isType(this.symbol.kind);
    }
    isCallValue() {
        return this.parent.kind == NodeKind.CALL && this == this.parent.callValue();
    }
    isAssignTarget() {
        return this.parent.kind == NodeKind.ASSIGN && this == this.parent.binaryLeft();
    }
    withRange(range) {
        this.range = range;
        return this;
    }
    withInternalRange(range) {
        this.internalRange = range;
        return this;
    }
    functionFirstArgument() {
        assert_1.assert(this.kind == NodeKind.FUNCTION);
        assert_1.assert(this.childCount() >= 2);
        let child = this.firstChild;
        if (child.kind == NodeKind.PARAMETERS) {
            child = child.nextSibling;
        }
        return child;
    }
    functionLastArgument() {
        assert_1.assert(this.kind == NodeKind.FUNCTION);
        assert_1.assert(this.childCount() >= 2);
        let child = this.firstChild;
        if (child.kind == NodeKind.PARAMETERS) {
            child = child.nextSibling;
        }
        let lastArgument = null;
        while (child != null) {
            let nextChild = child.nextSibling;
            if (nextChild.kind !== NodeKind.VARIABLE) {
                lastArgument = child;
                child = null;
            }
            else {
                child = nextChild;
            }
        }
        return lastArgument;
    }
    functionFirstArgumentIgnoringThis() {
        assert_1.assert(this.kind == NodeKind.FUNCTION);
        assert_1.assert(this.childCount() >= 2);
        assert_1.assert(this.symbol != null);
        let child = this.functionFirstArgument();
        if (this.symbol.kind == symbol_1.SymbolKind.FUNCTION_INSTANCE) {
            child = child.nextSibling;
        }
        return child;
    }
    functionReturnType() {
        assert_1.assert(this.kind == NodeKind.FUNCTION);
        assert_1.assert(this.childCount() >= 2);
        assert_1.assert(isExpression(this.lastChild.previousSibling));
        return this.lastChild.previousSibling;
    }
    constructorNode() {
        assert_1.assert(this.kind == NodeKind.NEW);
        assert_1.assert(this.childCount() > 0);
        assert_1.assert(this.resolvedType.symbol.node.kind == NodeKind.CLASS);
        return this.resolvedType.symbol.node.constructorFunctionNode;
    }
    functionBody() {
        assert_1.assert(this.kind == NodeKind.FUNCTION);
        assert_1.assert(this.childCount() >= 2);
        assert_1.assert(this.lastChild.kind == NodeKind.BLOCK || this.lastChild.kind == NodeKind.EMPTY);
        let body = this.lastChild;
        return body.kind == NodeKind.BLOCK ? body : null;
    }
    newType() {
        assert_1.assert(this.kind == NodeKind.NEW);
        assert_1.assert(this.childCount() >= 1);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    deleteType() {
        assert_1.assert(this.kind == NodeKind.DELETE);
        assert_1.assert(this.childCount() >= 1);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    callValue() {
        assert_1.assert(this.kind == NodeKind.CALL);
        assert_1.assert(this.childCount() >= 1);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    castValue() {
        assert_1.assert(this.kind == NodeKind.CAST);
        assert_1.assert(this.childCount() == 2);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    castType() {
        assert_1.assert(this.kind == NodeKind.CAST);
        assert_1.assert(this.childCount() == 2);
        assert_1.assert(isExpression(this.lastChild));
        return this.lastChild;
    }
    alignOfType() {
        assert_1.assert(this.kind == NodeKind.ALIGN_OF);
        assert_1.assert(this.childCount() == 1);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    sizeOfType() {
        assert_1.assert(this.kind == NodeKind.SIZE_OF);
        assert_1.assert(this.childCount() == 1);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    dotTarget() {
        assert_1.assert(this.kind == NodeKind.DOT);
        assert_1.assert(this.childCount() == 1);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    returnValue() {
        assert_1.assert(this.kind == NodeKind.RETURN);
        assert_1.assert(this.childCount() <= 1);
        assert_1.assert(this.firstChild == null || isExpression(this.firstChild));
        return this.firstChild;
    }
    ifReturnNode() {
        assert_1.assert(this.kind == NodeKind.IF);
        assert_1.assert(this.firstChild !== null);
        assert_1.assert(this.firstChild.nextSibling !== null);
        return this.firstChild.nextSibling.returnNode || null;
    }
    deleteValue() {
        assert_1.assert(this.kind == NodeKind.DELETE);
        assert_1.assert(this.childCount() <= 1);
        assert_1.assert(this.firstChild == null || isExpression(this.firstChild));
        return this.firstChild;
    }
    extendsType() {
        assert_1.assert(this.kind == NodeKind.EXTENDS);
        assert_1.assert(this.childCount() == 1);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    firstGenericType() {
        assert_1.assert(this.firstChild.kind == NodeKind.PARAMETERS);
        assert_1.assert(this.firstChild.childCount() > 0);
        return this.firstChild.firstChild;
    }
    variableType() {
        assert_1.assert(this.kind == NodeKind.VARIABLE);
        assert_1.assert(this.childCount() <= 2);
        assert_1.assert(isExpression(this.firstChild) || this.firstChild.kind == NodeKind.EMPTY);
        let type = this.firstChild;
        return type.kind != NodeKind.EMPTY ? type : null;
    }
    variableValue() {
        assert_1.assert(this.kind == NodeKind.VARIABLE);
        assert_1.assert(this.childCount() <= 2);
        assert_1.assert(this.firstChild.nextSibling == null || isExpression(this.firstChild.nextSibling));
        return this.firstChild.nextSibling;
    }
    hasVariableValue() {
        assert_1.assert(this.kind == NodeKind.VARIABLE);
        return this.firstChild != undefined && this.firstChild.nextSibling != undefined;
    }
    expressionValue() {
        assert_1.assert(this.kind == NodeKind.EXPRESSION);
        assert_1.assert(this.childCount() == 1);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    binaryLeft() {
        assert_1.assert(isBinary(this.kind));
        assert_1.assert(this.childCount() == 2);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    binaryRight() {
        assert_1.assert(isBinary(this.kind));
        assert_1.assert(this.childCount() == 2);
        assert_1.assert(isExpression(this.lastChild));
        return this.lastChild;
    }
    unaryValue() {
        assert_1.assert(isUnary(this.kind));
        assert_1.assert(this.childCount() == 1);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    pointer() {
        assert_1.assert(this.kind == NodeKind.POINTER_INDEX);
        assert_1.assert(this.childCount() >= 1);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    pointerOffset() {
        assert_1.assert(this.firstChild);
        assert_1.assert(this.firstChild.nextSibling);
        return this.firstChild.nextSibling.intValue;
    }
    forInitializationStatement() {
        assert_1.assert(this.kind == NodeKind.FOR);
        assert_1.assert(this.childCount() == 4);
        return this.firstChild;
    }
    forTerminationStatement() {
        assert_1.assert(this.kind == NodeKind.FOR);
        assert_1.assert(this.childCount() == 4);
        return this.firstChild.nextSibling.expressionValue();
    }
    forUpdateStatements() {
        assert_1.assert(this.kind == NodeKind.FOR);
        assert_1.assert(this.childCount() == 4);
        return this.firstChild.nextSibling.nextSibling;
    }
    forBody() {
        assert_1.assert(this.kind == NodeKind.FOR);
        assert_1.assert(this.childCount() == 4);
        assert_1.assert(this.lastChild.kind == NodeKind.BLOCK);
        return this.lastChild;
    }
    whileValue() {
        assert_1.assert(this.kind == NodeKind.WHILE);
        assert_1.assert(this.childCount() == 2);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    whileBody() {
        assert_1.assert(this.kind == NodeKind.WHILE);
        assert_1.assert(this.childCount() == 2);
        assert_1.assert(this.lastChild.kind == NodeKind.BLOCK);
        return this.lastChild;
    }
    hookValue() {
        assert_1.assert(this.kind == NodeKind.HOOK);
        assert_1.assert(this.childCount() == 3);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    hookTrue() {
        assert_1.assert(this.kind == NodeKind.HOOK);
        assert_1.assert(this.childCount() == 3);
        assert_1.assert(isExpression(this.firstChild.nextSibling));
        return this.firstChild.nextSibling;
    }
    hookFalse() {
        assert_1.assert(this.kind == NodeKind.HOOK);
        assert_1.assert(this.childCount() == 3);
        assert_1.assert(isExpression(this.lastChild));
        return this.lastChild;
    }
    indexTarget() {
        assert_1.assert(this.kind == NodeKind.INDEX);
        assert_1.assert(this.childCount() >= 1);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    ifValue() {
        assert_1.assert(this.kind == NodeKind.IF);
        assert_1.assert(this.childCount() == 2 || this.childCount() == 3);
        assert_1.assert(isExpression(this.firstChild));
        return this.firstChild;
    }
    ifTrue() {
        assert_1.assert(this.kind == NodeKind.IF);
        assert_1.assert(this.childCount() == 2 || this.childCount() == 3);
        assert_1.assert(this.firstChild.nextSibling.kind == NodeKind.BLOCK);
        return this.firstChild.nextSibling;
    }
    ifFalse() {
        assert_1.assert(this.kind == NodeKind.IF);
        assert_1.assert(this.childCount() == 2 || this.childCount() == 3);
        assert_1.assert(this.firstChild.nextSibling.nextSibling == null || this.firstChild.nextSibling.nextSibling.kind == NodeKind.BLOCK);
        return this.firstChild.nextSibling.nextSibling || null;
    }
    expandCallIntoOperatorTree() {
        if (this.kind != NodeKind.CALL) {
            return false;
        }
        let value = this.callValue();
        let symbol = value.symbol;
        if (value.kind == NodeKind.DOT && symbol.node.isOperator() && symbol.node.isDeclare()) {
            let binaryKind = NodeKind.NULL;
            if (symbol.name == "%")
                binaryKind = NodeKind.REMAINDER;
            else if (symbol.name == "&")
                binaryKind = NodeKind.BITWISE_AND;
            else if (symbol.name == "*")
                binaryKind = NodeKind.MULTIPLY;
            else if (symbol.name == "**")
                binaryKind = NodeKind.EXPONENT;
            else if (symbol.name == "/")
                binaryKind = NodeKind.DIVIDE;
            else if (symbol.name == "<")
                binaryKind = NodeKind.LESS_THAN;
            else if (symbol.name == "<<")
                binaryKind = NodeKind.SHIFT_LEFT;
            else if (symbol.name == "==")
                binaryKind = NodeKind.EQUAL;
            else if (symbol.name == ">")
                binaryKind = NodeKind.GREATER_THAN;
            else if (symbol.name == ">>")
                binaryKind = NodeKind.SHIFT_RIGHT;
            else if (symbol.name == "[]")
                binaryKind = NodeKind.INDEX;
            else if (symbol.name == "^")
                binaryKind = NodeKind.BITWISE_XOR;
            else if (symbol.name == "|")
                binaryKind = NodeKind.BITWISE_OR;
            if (binaryKind != NodeKind.NULL) {
                this.kind = binaryKind;
                value.remove();
                this.insertChildBefore(this.firstChild, value.dotTarget().remove());
                return true;
            }
            else if (symbol.name == "[]=") {
                this.kind = NodeKind.ASSIGN;
                let target = createIndex(value.remove().dotTarget().remove());
                target.appendChild(this.firstChild.remove());
                this.insertChildBefore(this.firstChild, target);
                return true;
            }
        }
        return false;
    }
    arrayLength() {
        assert_1.assert(this.kind == NodeKind.NEW);
        assert_1.assert(this.childCount() >= 1);
        assert_1.assert(isExpression(this.firstChild));
        assert_1.assert(this.firstChild.resolvedType.isArray());
        return this.firstChild.nextSibling;
    }
}
exports.Node = Node;
// export class XFunction extends Node{
// 	constructor(name: String){
// 		super({kind : NodeKind.FUNCTION,stringValue :name});
// 	}
// }
function createNew(type) {
    assert_1.assert(isExpression(type));
    let node = new Node();
    node.kind = NodeKind.NEW;
    node.appendChild(type);
    return node;
}
exports.createNew = createNew;
function createDelete(value) {
    assert_1.assert(value == null || isExpression(value));
    let node = new Node();
    node.kind = NodeKind.DELETE;
    if (value != null) {
        node.appendChild(value);
    }
    return node;
}
exports.createDelete = createDelete;
function createHook(test, primary, secondary) {
    assert_1.assert(isExpression(test));
    assert_1.assert(isExpression(primary));
    assert_1.assert(isExpression(secondary));
    let node = new Node();
    node.kind = NodeKind.HOOK;
    node.appendChild(test);
    node.appendChild(primary);
    node.appendChild(secondary);
    return node;
}
exports.createHook = createHook;
function createIndex(target) {
    assert_1.assert(isExpression(target));
    let node = new Node();
    node.kind = NodeKind.INDEX;
    node.appendChild(target);
    return node;
}
exports.createIndex = createIndex;
function createNull() {
    let node = new Node();
    node.kind = NodeKind.NULL;
    return node;
}
exports.createNull = createNull;
function createUndefined() {
    let node = new Node();
    node.kind = NodeKind.UNDEFINED;
    return node;
}
exports.createUndefined = createUndefined;
function createThis() {
    let node = new Node();
    node.kind = NodeKind.THIS;
    return node;
}
exports.createThis = createThis;
function createAddressOf(value) {
    assert_1.assert(isExpression(value));
    let node = new Node();
    node.kind = NodeKind.ADDRESS_OF;
    node.appendChild(value);
    return node;
}
exports.createAddressOf = createAddressOf;
function createDereference(value) {
    assert_1.assert(isExpression(value));
    let node = new Node();
    node.kind = NodeKind.DEREFERENCE;
    node.appendChild(value);
    return node;
}
exports.createDereference = createDereference;
function createAlignOf(type) {
    assert_1.assert(isExpression(type));
    let node = new Node();
    node.kind = NodeKind.ALIGN_OF;
    node.appendChild(type);
    return node;
}
exports.createAlignOf = createAlignOf;
function createSizeOf(type) {
    assert_1.assert(isExpression(type));
    let node = new Node();
    node.kind = NodeKind.SIZE_OF;
    node.appendChild(type);
    return node;
}
exports.createSizeOf = createSizeOf;
function createboolean(value) {
    let node = new Node();
    node.kind = NodeKind.BOOLEAN;
    node.intValue = value ? 1 : 0;
    return node;
}
exports.createboolean = createboolean;
function createInt(value) {
    let node = new Node();
    node.kind = NodeKind.INT32;
    node.intValue = value;
    return node;
}
exports.createInt = createInt;
function createLong(value) {
    let node = new Node();
    node.kind = NodeKind.INT64;
    node.longValue = value;
    return node;
}
exports.createLong = createLong;
function createFloat(value) {
    let node = new Node();
    node.kind = NodeKind.FLOAT32;
    node.floatValue = value;
    return node;
}
exports.createFloat = createFloat;
function createDouble(value) {
    let node = new Node();
    node.kind = NodeKind.FLOAT64;
    node.doubleValue = value;
    return node;
}
exports.createDouble = createDouble;
function createString(value) {
    let node = new Node();
    node.kind = NodeKind.STRING;
    node.stringValue = value;
    return node;
}
exports.createString = createString;
function createArray(type) {
    let node = new Node();
    node.kind = NodeKind.ARRAY;
    node.resolvedType = type;
    return node;
}
exports.createArray = createArray;
function createName(value) {
    let node = new Node();
    node.kind = NodeKind.NAME;
    node.referenceValue = value;
    return node;
}
exports.createName = createName;
function createType(type) {
    assert_1.assert(type != null);
    let node = new Node();
    node.kind = NodeKind.TYPE;
    node.resolvedType = type;
    return node;
}
exports.createType = createType;
function createAny() {
    let node = new Node();
    node.kind = NodeKind.ANY;
    return node;
}
exports.createAny = createAny;
function createEmpty() {
    let node = new Node();
    node.kind = NodeKind.EMPTY;
    return node;
}
exports.createEmpty = createEmpty;
function createExpression(value) {
    assert_1.assert(isExpression(value));
    let node = new Node();
    node.kind = NodeKind.EXPRESSION;
    node.appendChild(value);
    return node;
}
exports.createExpression = createExpression;
function createBlock() {
    let node = new Node();
    node.kind = NodeKind.BLOCK;
    return node;
}
exports.createBlock = createBlock;
function createModule(name) {
    let node = new Node();
    node.kind = NodeKind.MODULE;
    node.stringValue = name;
    return node;
}
exports.createModule = createModule;
function createClass(name) {
    let node = new Node();
    node.kind = NodeKind.CLASS;
    node.stringValue = name;
    return node;
}
exports.createClass = createClass;
function createEnum(name) {
    let node = new Node();
    node.kind = NodeKind.ENUM;
    node.stringValue = name;
    return node;
}
exports.createEnum = createEnum;
function createIf(value, trueBranch, falseBranch) {
    assert_1.assert(isExpression(value));
    assert_1.assert(trueBranch.kind == NodeKind.BLOCK);
    assert_1.assert(falseBranch == null || falseBranch.kind == NodeKind.BLOCK);
    let node = new Node();
    node.kind = NodeKind.IF;
    node.appendChild(value);
    node.appendChild(trueBranch);
    if (falseBranch != null) {
        node.appendChild(falseBranch);
    }
    return node;
}
exports.createIf = createIf;
function createWhile(value, body) {
    assert_1.assert(isExpression(value));
    assert_1.assert(body.kind == NodeKind.BLOCK);
    let node = new Node();
    node.kind = NodeKind.WHILE;
    node.appendChild(value);
    node.appendChild(body);
    return node;
}
exports.createWhile = createWhile;
function createFor(initializationStmt, terminationStmt, updateStmt, body) {
    // assert(isExpression(initializationStmt));
    // assert(isExpression(terminationStmt));
    // assert(isExpression(updateStmt));
    assert_1.assert(body.kind == NodeKind.BLOCK);
    let node = new Node();
    node.kind = NodeKind.FOR;
    node.appendChild(initializationStmt);
    node.appendChild(terminationStmt);
    node.appendChild(updateStmt);
    node.appendChild(body);
    return node;
}
exports.createFor = createFor;
function createReturn(value) {
    assert_1.assert(value == null || isExpression(value));
    let node = new Node();
    node.kind = NodeKind.RETURN;
    if (value != null) {
        node.appendChild(value);
    }
    return node;
}
exports.createReturn = createReturn;
function createImports() {
    let node = new Node();
    node.kind = NodeKind.IMPORTS;
    return node;
}
exports.createImports = createImports;
function createImport(name) {
    let node = new Node();
    node.kind = NodeKind.IMPORT;
    node.stringValue = name;
    return node;
}
exports.createImport = createImport;
function createImportFrom(name) {
    let node = new Node();
    node.kind = NodeKind.IMPORT_FROM;
    node.stringValue = name;
    return node;
}
exports.createImportFrom = createImportFrom;
function createVariables() {
    let node = new Node();
    node.kind = NodeKind.VARIABLES;
    return node;
}
exports.createVariables = createVariables;
function createConstants() {
    let node = new Node();
    node.kind = NodeKind.CONSTANTS;
    return node;
}
exports.createConstants = createConstants;
function createParameters() {
    let node = new Node();
    node.kind = NodeKind.PARAMETERS;
    return node;
}
exports.createParameters = createParameters;
function createExtends(type) {
    assert_1.assert(isExpression(type));
    let node = new Node();
    node.kind = NodeKind.EXTENDS;
    node.appendChild(type);
    return node;
}
exports.createExtends = createExtends;
function createImplements() {
    let node = new Node();
    node.kind = NodeKind.IMPLEMENTS;
    return node;
}
exports.createImplements = createImplements;
function createParameter(name) {
    let node = new Node();
    node.kind = NodeKind.PARAMETER;
    node.stringValue = name;
    return node;
}
exports.createParameter = createParameter;
function createVariable(name, type, value) {
    assert_1.assert(type == null || isExpression(type));
    assert_1.assert(value == null || isExpression(value));
    let node = new Node();
    node.kind = NodeKind.VARIABLE;
    node.stringValue = name;
    node.appendChild(type != null ? type : createEmpty());
    if (value != null) {
        node.appendChild(value);
    }
    return node;
}
exports.createVariable = createVariable;
function createFunction(name) {
    // let node = new XFunction(name);
    let node = new Node(); //{kind : NodeKind.FUNCTION,stringValue :name});
    node.kind = NodeKind.FUNCTION;
    node.stringValue = name;
    return node;
}
exports.createFunction = createFunction;
function createUnary(kind, value) {
    assert_1.assert(isUnary(kind));
    assert_1.assert(isExpression(value));
    let node = new Node();
    node.kind = kind;
    node.appendChild(value);
    return node;
}
exports.createUnary = createUnary;
function createBinary(kind, left, right) {
    assert_1.assert(isBinary(kind));
    assert_1.assert(isExpression(left));
    assert_1.assert(isExpression(right));
    let node = new Node();
    node.kind = kind;
    node.appendChild(left);
    node.appendChild(right);
    return node;
}
exports.createBinary = createBinary;
function createCall(value) {
    assert_1.assert(isExpression(value));
    let node = new Node();
    node.kind = NodeKind.CALL;
    node.appendChild(value);
    return node;
}
exports.createCall = createCall;
function createCast(value, type) {
    assert_1.assert(isExpression(value));
    assert_1.assert(isExpression(type));
    let node = new Node();
    node.kind = NodeKind.CAST;
    node.appendChild(value);
    node.appendChild(type);
    return node;
}
exports.createCast = createCast;
function createDot(value, name) {
    assert_1.assert(isExpression(value));
    let node = new Node();
    node.kind = NodeKind.DOT;
    node.stringValue = name;
    node.appendChild(value);
    return node;
}
exports.createDot = createDot;
function createSymbolReference(symbol) {
    let node = createName(symbol.name);
    node.symbol = symbol;
    node.resolvedType = symbol.resolvedType;
    return node;
}
exports.createSymbolReference = createSymbolReference;
function createMemberReference(value, symbol) {
    let node = createDot(value, symbol.name);
    node.symbol = symbol;
    node.resolvedType = symbol.resolvedType;
    return node;
}
exports.createMemberReference = createMemberReference;
function createParseError() {
    let node = new Node();
    node.kind = NodeKind.PARSE_ERROR;
    return node;
}
exports.createParseError = createParseError;
//JavaScript
function createJSNumber() {
    let node = new Node();
    node.kind = NodeKind.JS_NUMBER;
    return node;
}
exports.createJSNumber = createJSNumber;
function createJSObject() {
    let node = new Node();
    node.kind = NodeKind.JS_OBJECT;
    return node;
}
exports.createJSObject = createJSObject;
function createJSString() {
    let node = new Node();
    node.kind = NodeKind.JS_STRING;
    return node;
}
exports.createJSString = createJSString;
function createJSArray() {
    let node = new Node();
    node.kind = NodeKind.JS_ARRAY;
    return node;
}
exports.createJSArray = createJSArray;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bitness_1 = __webpack_require__(27);
const wasm_type_1 = __webpack_require__(6);
const symbol_1 = __webpack_require__(7);
/**
 * Created by n.vinayakan on 17.06.17.
 */
function getWasmFunctionName(symbol) {
    if (symbol === undefined || symbol === null)
        return "";
    let moduleName = symbol.kind == symbol_1.SymbolKind.FUNCTION_INSTANCE ? symbol.parent().internalName : "";
    return (moduleName == "" ? "" : moduleName + "_") + symbol.internalName;
}
exports.getWasmFunctionName = getWasmFunctionName;
function symbolToWasmType(symbol, bitness) {
    let type = symbol.resolvedType;
    if (type.isFloat()) {
        return wasm_type_1.WasmType.F32;
    }
    else if (type.isDouble()) {
        return wasm_type_1.WasmType.F64;
    }
    else if (type.isInteger() || (bitness == bitness_1.Bitness.x32 && type.pointerTo)) {
        return wasm_type_1.WasmType.I32;
    }
    else if (type.isLong() || (bitness == bitness_1.Bitness.x64 && type.pointerTo)) {
        return wasm_type_1.WasmType.I64;
    }
    else {
        return wasm_type_1.WasmType.I32;
    }
}
exports.symbolToWasmType = symbolToWasmType;
function wasmToTurboType(type) {
    switch (type) {
        case wasm_type_1.WasmType.VOID:
            return "void";
        case wasm_type_1.WasmType.I32:
            return "int32";
        case wasm_type_1.WasmType.I64:
            return "int64";
        case wasm_type_1.WasmType.F32:
            return "float32";
        case wasm_type_1.WasmType.F64:
            return "float64";
    }
}
exports.wasmToTurboType = wasmToTurboType;
function typeToDataType(type, bitness) {
    if (type.isFloat()) {
        return "F32";
    }
    else if (type.isDouble()) {
        return "F64";
    }
    else if (type.isInteger() || (bitness == bitness_1.Bitness.x32 && type.pointerTo)) {
        return "I32";
    }
    else if (type.isLong() || (bitness == bitness_1.Bitness.x64 && type.pointerTo)) {
        return "I64";
    }
    else {
        return "I32";
    }
}
exports.typeToDataType = typeToDataType;
function getTypedArrayElementSize(name) {
    switch (name) {
        case "Uint8ClampedArray":
        case "Uint8Array":
        case "Int8Array":
            return 1;
        case "Uint16Array":
        case "Int16Array":
            return 2;
        case "Uint32Array":
        case "Int32Array":
        case "Float32Array":
            return 4;
        case "Float64Array":
            return 8;
        default:
            throw "unknown typed array";
    }
}
exports.getTypedArrayElementSize = getTypedArrayElementSize;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="../declarations.d.ts" />
const type_checker_1 = __webpack_require__(49);
const node_1 = __webpack_require__(10);
const log_1 = __webpack_require__(5);
const preprocessor_1 = __webpack_require__(54);
const scope_1 = __webpack_require__(23);
const scanner_1 = __webpack_require__(13);
const parser_1 = __webpack_require__(25);
const shaking_1 = __webpack_require__(52);
const webassembly_1 = __webpack_require__(78);
const library_1 = __webpack_require__(26);
const preparser_1 = __webpack_require__(53);
const compile_target_1 = __webpack_require__(9);
const assert_1 = __webpack_require__(3);
const terminal_1 = __webpack_require__(2);
const binary_importer_1 = __webpack_require__(14);
/**
 * Author: Nidin Vinayakan
 */
class Compiler {
    initialize(target, outputName) {
        assert_1.assert(this.log == null);
        this.log = new log_1.Log();
        this.preprocessor = new preprocessor_1.Preprocessor();
        binary_importer_1.BinaryImporter.reset();
        this.target = target;
        this.outputName = outputName;
        this.librarySource = this.addInput("<native>", library_1.Library.get(target));
        this.librarySource.isLibrary = true;
        this.runtimeSource = library_1.Library.getRuntime(target);
        this.wrapperSource = library_1.Library.getWrapper(target);
        this.createGlobals();
        if (target == compile_target_1.CompileTarget.CPP) {
            this.preprocessor.define("CPP", true);
        }
        else if (target == compile_target_1.CompileTarget.JAVASCRIPT) {
            this.preprocessor.define("JS", true);
        }
        else if (target == compile_target_1.CompileTarget.WEBASSEMBLY) {
            this.preprocessor.define("WASM", true);
        }
    }
    createGlobals() {
        let context = new type_checker_1.CheckContext();
        context.log = this.log;
        context.target = this.target;
        context.pointerByteSize = 4; // Assume 32-bit code generation for now
        let global = new node_1.Node();
        global.kind = node_1.NodeKind.GLOBAL;
        let scope = new scope_1.Scope();
        global.scope = scope;
        // Hard-coded types
        context.anyType = scope.defineNativeType(context.log, "any");
        context.errorType = scope.defineNativeType(context.log, "<error>");
        context.nullType = scope.defineNativeType(context.log, "null");
        context.undefinedType = scope.defineNativeType(context.log, "undefined");
        context.voidType = scope.defineNativeType(context.log, "void");
        this.context = context;
        this.global = global;
    }
    addInput(name, contents) {
        let source = new log_1.Source();
        source.name = name;
        source.contents = contents;
        if (this.firstSource == null)
            this.firstSource = source;
        else {
            source.prev = this.lastSource;
            this.lastSource.next = source;
        }
        this.lastSource = source;
        return source;
    }
    addInputBefore(name, contents, nextSource) {
        let source = new log_1.Source();
        source.name = name;
        source.contents = contents;
        nextSource.prev.next = source;
        source.prev = nextSource.prev;
        nextSource.prev = source;
        source.next = nextSource;
        return source;
    }
    finish() {
        terminal_1.Terminal.time("pre-parsing");
        let source = this.firstSource;
        while (source != null) {
            if (!preparser_1.preparse(source, this, this.log)) {
                return false;
            }
            source = source.next;
        }
        terminal_1.Terminal.timeEnd("pre-parsing");
        terminal_1.Terminal.time("scanning");
        source = this.firstSource;
        while (source != null) {
            source.firstToken = scanner_1.tokenize(source, this.log);
            source = source.next;
        }
        terminal_1.Terminal.timeEnd("scanning");
        terminal_1.Terminal.time("pre-processing");
        source = this.firstSource;
        while (source != null) {
            this.preprocessor.run(source, this.log);
            source = source.next;
        }
        terminal_1.Terminal.timeEnd("pre-processing");
        terminal_1.Terminal.time("parsing");
        source = this.firstSource;
        while (source != null) {
            if (source.firstToken != null) {
                source.file = parser_1.parse(source.firstToken, this.log);
            }
            source = source.next;
        }
        terminal_1.Terminal.timeEnd("parsing");
        terminal_1.Terminal.time("type-checking");
        let global = this.global;
        let context = this.context;
        let fullResolve = true;
        source = this.firstSource;
        while (source != null) {
            let file = source.file;
            if (file != null) {
                if (source.isLibrary) {
                    file.flags |= node_1.NODE_FLAG.LIBRARY;
                    type_checker_1.initialize(context, file, global.scope, type_checker_1.CheckMode.INITIALIZE);
                    type_checker_1.resolve(context, file, global.scope);
                }
                else {
                    type_checker_1.initialize(context, file, global.scope, type_checker_1.CheckMode.NORMAL);
                }
                while (file.firstChild != null) {
                    let child = file.firstChild;
                    child.remove();
                    global.appendChild(child);
                }
            }
            // Stop if the library code has errors because it's highly likely that everything is broken
            if (source.isLibrary && this.log.hasErrors()) {
                fullResolve = false;
                break;
            }
            source = source.next;
        }
        if (fullResolve) {
            type_checker_1.resolve(context, global, global.scope);
        }
        terminal_1.Terminal.timeEnd("type-checking");
        if (this.log.hasErrors()) {
            return false;
        }
        terminal_1.Terminal.time("optimizing");
        shaking_1.treeShaking(global);
        terminal_1.Terminal.timeEnd("optimizing");
        terminal_1.Terminal.time("emitting");
        // if (this.target == CompileTarget.C) {
        //     cEmit(this);
        // }
        // else if (this.target == CompileTarget.JAVASCRIPT) {
        //     jsEmit(this);
        // } else
        if (this.target == compile_target_1.CompileTarget.WEBASSEMBLY) {
            webassembly_1.wasmEmit(this);
        }
        terminal_1.Terminal.timeEnd("emitting");
        terminal_1.Terminal.write("Done!\n");
        return true;
    }
}
Compiler.mallocRequired = false;
Compiler.debug = false;
exports.Compiler = Compiler;
function replaceFileExtension(path, extension) {
    let dot = path.lastIndexOf(".");
    let forward = path.lastIndexOf("/");
    let backward = path.lastIndexOf("\\");
    // Make sure that there's a non-empty file name that the dot is a part of
    if (dot > 0 && dot > forward && dot > backward) {
        path = path.slice(0, dot);
    }
    return path + extension;
}
exports.replaceFileExtension = replaceFileExtension;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __webpack_require__(5);
const assert_1 = __webpack_require__(3);
/**
 * Author: Nidin Vinayakan
 */
var Tokens;
(function (Tokens) {
    Tokens[Tokens["END_OF_FILE"] = 0] = "END_OF_FILE";
    // Literals
    Tokens[Tokens["CHARACTER"] = 1] = "CHARACTER";
    Tokens[Tokens["IDENTIFIER"] = 2] = "IDENTIFIER";
    Tokens[Tokens["INT32"] = 3] = "INT32";
    Tokens[Tokens["INT64"] = 4] = "INT64";
    Tokens[Tokens["FLOAT32"] = 5] = "FLOAT32";
    Tokens[Tokens["FLOAT64"] = 6] = "FLOAT64";
    Tokens[Tokens["STRING"] = 7] = "STRING";
    Tokens[Tokens["ARRAY"] = 8] = "ARRAY";
    Tokens[Tokens["HASH"] = 9] = "HASH";
    // Punctuation
    Tokens[Tokens["ASSIGN"] = 10] = "ASSIGN";
    Tokens[Tokens["BITWISE_AND"] = 11] = "BITWISE_AND";
    Tokens[Tokens["BITWISE_OR"] = 12] = "BITWISE_OR";
    Tokens[Tokens["BITWISE_XOR"] = 13] = "BITWISE_XOR";
    Tokens[Tokens["COLON"] = 14] = "COLON";
    Tokens[Tokens["COMMA"] = 15] = "COMMA";
    Tokens[Tokens["COMPLEMENT"] = 16] = "COMPLEMENT";
    Tokens[Tokens["DIVIDE"] = 17] = "DIVIDE";
    Tokens[Tokens["DOT"] = 18] = "DOT";
    Tokens[Tokens["EQUAL"] = 19] = "EQUAL";
    Tokens[Tokens["EXPONENT"] = 20] = "EXPONENT";
    Tokens[Tokens["GREATER_THAN"] = 21] = "GREATER_THAN";
    Tokens[Tokens["GREATER_THAN_EQUAL"] = 22] = "GREATER_THAN_EQUAL";
    Tokens[Tokens["LEFT_BRACE"] = 23] = "LEFT_BRACE";
    Tokens[Tokens["LEFT_BRACKET"] = 24] = "LEFT_BRACKET";
    Tokens[Tokens["LEFT_PARENTHESIS"] = 25] = "LEFT_PARENTHESIS";
    Tokens[Tokens["LESS_THAN"] = 26] = "LESS_THAN";
    Tokens[Tokens["LESS_THAN_EQUAL"] = 27] = "LESS_THAN_EQUAL";
    Tokens[Tokens["LOGICAL_AND"] = 28] = "LOGICAL_AND";
    Tokens[Tokens["LOGICAL_OR"] = 29] = "LOGICAL_OR";
    Tokens[Tokens["MINUS"] = 30] = "MINUS";
    Tokens[Tokens["MINUS_MINUS"] = 31] = "MINUS_MINUS";
    Tokens[Tokens["MULTIPLY"] = 32] = "MULTIPLY";
    Tokens[Tokens["NOT"] = 33] = "NOT";
    Tokens[Tokens["NOT_EQUAL"] = 34] = "NOT_EQUAL";
    Tokens[Tokens["PLUS"] = 35] = "PLUS";
    Tokens[Tokens["PLUS_PLUS"] = 36] = "PLUS_PLUS";
    Tokens[Tokens["QUESTION_MARK"] = 37] = "QUESTION_MARK";
    Tokens[Tokens["REMAINDER"] = 38] = "REMAINDER";
    Tokens[Tokens["RIGHT_BRACE"] = 39] = "RIGHT_BRACE";
    Tokens[Tokens["RIGHT_BRACKET"] = 40] = "RIGHT_BRACKET";
    Tokens[Tokens["RIGHT_PARENTHESIS"] = 41] = "RIGHT_PARENTHESIS";
    Tokens[Tokens["SEMICOLON"] = 42] = "SEMICOLON";
    Tokens[Tokens["FROM"] = 43] = "FROM";
    Tokens[Tokens["SHIFT_LEFT"] = 44] = "SHIFT_LEFT";
    Tokens[Tokens["SHIFT_RIGHT"] = 45] = "SHIFT_RIGHT";
    // Keywords
    Tokens[Tokens["ALIGNOF"] = 46] = "ALIGNOF";
    Tokens[Tokens["AS"] = 47] = "AS";
    Tokens[Tokens["BREAK"] = 48] = "BREAK";
    Tokens[Tokens["MODULE"] = 49] = "MODULE";
    Tokens[Tokens["CLASS"] = 50] = "CLASS";
    Tokens[Tokens["CONST"] = 51] = "CONST";
    Tokens[Tokens["CONTINUE"] = 52] = "CONTINUE";
    Tokens[Tokens["DECLARE"] = 53] = "DECLARE";
    Tokens[Tokens["ELSE"] = 54] = "ELSE";
    Tokens[Tokens["ENUM"] = 55] = "ENUM";
    Tokens[Tokens["EXPORT"] = 56] = "EXPORT";
    Tokens[Tokens["EXTENDS"] = 57] = "EXTENDS";
    Tokens[Tokens["FALSE"] = 58] = "FALSE";
    Tokens[Tokens["FUNCTION"] = 59] = "FUNCTION";
    Tokens[Tokens["ANYFUNC"] = 60] = "ANYFUNC";
    Tokens[Tokens["IF"] = 61] = "IF";
    Tokens[Tokens["IMPLEMENTS"] = 62] = "IMPLEMENTS";
    Tokens[Tokens["IMPORT"] = 63] = "IMPORT";
    Tokens[Tokens["LET"] = 64] = "LET";
    Tokens[Tokens["NEW"] = 65] = "NEW";
    Tokens[Tokens["DELETE"] = 66] = "DELETE";
    Tokens[Tokens["NULL"] = 67] = "NULL";
    Tokens[Tokens["UNDEFINED"] = 68] = "UNDEFINED";
    Tokens[Tokens["OPERATOR"] = 69] = "OPERATOR";
    Tokens[Tokens["PRIVATE"] = 70] = "PRIVATE";
    Tokens[Tokens["PROTECTED"] = 71] = "PROTECTED";
    Tokens[Tokens["PUBLIC"] = 72] = "PUBLIC";
    Tokens[Tokens["RETURN"] = 73] = "RETURN";
    Tokens[Tokens["SIZEOF"] = 74] = "SIZEOF";
    Tokens[Tokens["STATIC"] = 75] = "STATIC";
    Tokens[Tokens["THIS"] = 76] = "THIS";
    Tokens[Tokens["TRUE"] = 77] = "TRUE";
    Tokens[Tokens["UNSAFE"] = 78] = "UNSAFE";
    Tokens[Tokens["JAVASCRIPT"] = 79] = "JAVASCRIPT";
    Tokens[Tokens["START"] = 80] = "START";
    Tokens[Tokens["VIRTUAL"] = 81] = "VIRTUAL";
    Tokens[Tokens["VAR"] = 82] = "VAR";
    Tokens[Tokens["WHILE"] = 83] = "WHILE";
    Tokens[Tokens["FOR"] = 84] = "FOR";
    // Preprocessor
    Tokens[Tokens["PREPROCESSOR_DEFINE"] = 85] = "PREPROCESSOR_DEFINE";
    Tokens[Tokens["PREPROCESSOR_ELIF"] = 86] = "PREPROCESSOR_ELIF";
    Tokens[Tokens["PREPROCESSOR_ELSE"] = 87] = "PREPROCESSOR_ELSE";
    Tokens[Tokens["PREPROCESSOR_ENDIF"] = 88] = "PREPROCESSOR_ENDIF";
    Tokens[Tokens["PREPROCESSOR_ERROR"] = 89] = "PREPROCESSOR_ERROR";
    Tokens[Tokens["PREPROCESSOR_IF"] = 90] = "PREPROCESSOR_IF";
    Tokens[Tokens["PREPROCESSOR_NEEDED"] = 91] = "PREPROCESSOR_NEEDED";
    Tokens[Tokens["PREPROCESSOR_NEWLINE"] = 92] = "PREPROCESSOR_NEWLINE";
    Tokens[Tokens["PREPROCESSOR_UNDEF"] = 93] = "PREPROCESSOR_UNDEF";
    Tokens[Tokens["PREPROCESSOR_WARNING"] = 94] = "PREPROCESSOR_WARNING";
})(Tokens = exports.Tokens || (exports.Tokens = {}));
function isKeyword(kind) {
    return kind >= Tokens.ALIGNOF && kind <= Tokens.WHILE;
}
exports.isKeyword = isKeyword;
class Token {
}
exports.Token = Token;
function splitToken(first, firstKind, secondKind) {
    var range = first.range;
    assert_1.assert(range.end - range.start >= 2);
    var second = new Token();
    second.kind = secondKind;
    second.range = log_1.createRange(range.source, range.start + 1, range.end);
    second.next = first.next;
    first.kind = firstKind;
    first.next = second;
    range.end = range.start + 1;
}
exports.splitToken = splitToken;
function tokenToString(token) {
    if (token == Tokens.END_OF_FILE)
        return "end of file";
    // Literals
    if (token == Tokens.CHARACTER)
        return "character literal";
    if (token == Tokens.IDENTIFIER)
        return "identifier";
    if (token == Tokens.INT32)
        return "integer32 literal";
    if (token == Tokens.INT64)
        return "integer64 literal";
    if (token == Tokens.FLOAT32)
        return "float32 literal";
    if (token == Tokens.FLOAT64)
        return "float64 literal";
    if (token == Tokens.STRING)
        return "'string' literal";
    if (token == Tokens.ARRAY)
        return "array[] literal";
    if (token == Tokens.HASH)
        return "hash{} literal";
    // Punctuation
    if (token == Tokens.ASSIGN)
        return "'='";
    if (token == Tokens.BITWISE_AND)
        return "'&'";
    if (token == Tokens.BITWISE_OR)
        return "'|'";
    if (token == Tokens.BITWISE_XOR)
        return "'^'";
    if (token == Tokens.COLON)
        return "':'";
    if (token == Tokens.COMMA)
        return "','";
    if (token == Tokens.COMPLEMENT)
        return "'~'";
    if (token == Tokens.DIVIDE)
        return "'/'";
    if (token == Tokens.DOT)
        return "'.'";
    if (token == Tokens.EQUAL)
        return "'=='";
    if (token == Tokens.EXPONENT)
        return "'**'";
    if (token == Tokens.GREATER_THAN)
        return "'>'";
    if (token == Tokens.GREATER_THAN_EQUAL)
        return "'>='";
    if (token == Tokens.LEFT_BRACE)
        return "'{'";
    if (token == Tokens.LEFT_BRACKET)
        return "'['";
    if (token == Tokens.LEFT_PARENTHESIS)
        return "'('";
    if (token == Tokens.LESS_THAN)
        return "'<'";
    if (token == Tokens.LESS_THAN_EQUAL)
        return "'<='";
    if (token == Tokens.LOGICAL_AND)
        return "'&&'";
    if (token == Tokens.LOGICAL_OR)
        return "'||'";
    if (token == Tokens.MINUS)
        return "'-'";
    if (token == Tokens.MINUS_MINUS)
        return "'--'";
    if (token == Tokens.MULTIPLY)
        return "'*'";
    if (token == Tokens.NOT)
        return "'!'";
    if (token == Tokens.NOT_EQUAL)
        return "'!='";
    if (token == Tokens.PLUS)
        return "'+'";
    if (token == Tokens.PLUS_PLUS)
        return "'++'";
    if (token == Tokens.QUESTION_MARK)
        return "'?'";
    if (token == Tokens.REMAINDER)
        return "'%'";
    if (token == Tokens.RIGHT_BRACE)
        return "'}'";
    if (token == Tokens.RIGHT_BRACKET)
        return "']'";
    if (token == Tokens.RIGHT_PARENTHESIS)
        return "')'";
    if (token == Tokens.SEMICOLON)
        return "';'";
    if (token == Tokens.SHIFT_LEFT)
        return "'<<'";
    if (token == Tokens.SHIFT_RIGHT)
        return "'>>'";
    // Keywords
    if (token == Tokens.FROM)
        return "'from'";
    if (token == Tokens.ALIGNOF)
        return "'alignof'";
    if (token == Tokens.AS)
        return "'as'";
    if (token == Tokens.BREAK)
        return "'break'";
    if (token == Tokens.MODULE)
        return "'namespace'";
    if (token == Tokens.CLASS)
        return "'class'";
    if (token == Tokens.CONST)
        return "'const'";
    if (token == Tokens.CONTINUE)
        return "'continue'";
    if (token == Tokens.DECLARE)
        return "'declare'";
    if (token == Tokens.ELSE)
        return "'else'";
    if (token == Tokens.ENUM)
        return "'enum'";
    if (token == Tokens.EXPORT)
        return "'export'";
    if (token == Tokens.EXTENDS)
        return "'extends'";
    if (token == Tokens.FALSE)
        return "'false'";
    if (token == Tokens.FUNCTION)
        return "'function'";
    if (token == Tokens.ANYFUNC)
        return "'anyfunc'";
    if (token == Tokens.IF)
        return "'if'";
    if (token == Tokens.IMPLEMENTS)
        return "'implements'";
    if (token == Tokens.IMPORT)
        return "'import'";
    if (token == Tokens.LET)
        return "'let'";
    if (token == Tokens.NEW)
        return "'new'";
    if (token == Tokens.DELETE)
        return "'delete'";
    if (token == Tokens.NULL)
        return "'null'";
    if (token == Tokens.UNDEFINED)
        return "'undefined'";
    if (token == Tokens.OPERATOR)
        return "'operator'";
    if (token == Tokens.PRIVATE)
        return "'private'";
    if (token == Tokens.PROTECTED)
        return "'protected'";
    if (token == Tokens.PUBLIC)
        return "'public'";
    if (token == Tokens.RETURN)
        return "'return'";
    if (token == Tokens.SIZEOF)
        return "'sizeof'";
    if (token == Tokens.STATIC)
        return "'static'";
    if (token == Tokens.THIS)
        return "'this'";
    if (token == Tokens.TRUE)
        return "'true'";
    if (token == Tokens.UNSAFE)
        return "'unsafe'";
    if (token == Tokens.JAVASCRIPT)
        return "'@JS'";
    if (token == Tokens.START)
        return "'@start'";
    if (token == Tokens.VIRTUAL)
        return "'@virtual'";
    if (token == Tokens.VAR)
        return "'var'";
    if (token == Tokens.WHILE)
        return "'while'";
    if (token == Tokens.FOR)
        return "'for'";
    // Preprocessor
    if (token == Tokens.PREPROCESSOR_DEFINE)
        return "'#define'";
    if (token == Tokens.PREPROCESSOR_ELIF)
        return "'#elif'";
    if (token == Tokens.PREPROCESSOR_ELSE)
        return "'#else'";
    if (token == Tokens.PREPROCESSOR_ENDIF)
        return "'#endif'";
    if (token == Tokens.PREPROCESSOR_ERROR)
        return "'#error'";
    if (token == Tokens.PREPROCESSOR_IF)
        return "'#if'";
    if (token == Tokens.PREPROCESSOR_NEWLINE)
        return "newline";
    if (token == Tokens.PREPROCESSOR_UNDEF)
        return "'#undef'";
    if (token == Tokens.PREPROCESSOR_WARNING)
        return "'#warning'";
    assert_1.assert(false);
    return null;
}
exports.tokenToString = tokenToString;
function isAlpha(c) {
    return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c == '_';
}
exports.isAlpha = isAlpha;
function isASCII(c) {
    return c >= 0x20 && c <= 0x7E;
}
exports.isASCII = isASCII;
function isNumber(c) {
    return c >= '0' && c <= '9';
}
exports.isNumber = isNumber;
function isDigit(c, base) {
    if (c.trim() == "")
        return false;
    if (base == 16) {
        return isNumber(c) || c >= 'A' && c <= 'F' || c >= 'a' && c <= 'f';
    }
    //return c >= '0' && c < '0' + base;
    return !isNaN(c);
}
exports.isDigit = isDigit;
function tokenize(source, log) {
    var first = null;
    var last = null;
    var contents = source.contents;
    var limit = contents.length;
    var needsPreprocessor = false;
    var wantNewline = false;
    var i = 0;
    while (i < limit) {
        var start = i;
        var c = contents[i];
        i = i + 1;
        if (c == ' ' || c == '\t' || c == '\r') {
            continue;
        }
        var kind = Tokens.END_OF_FILE;
        // Newline
        if (c == '\n') {
            if (!wantNewline) {
                continue;
            }
            // Preprocessor commands all end in a newline
            kind = Tokens.PREPROCESSOR_NEWLINE;
            wantNewline = false;
        }
        else if (isAlpha(c) || c == "@") {
            kind = Tokens.IDENTIFIER;
            while (i < limit && (isAlpha(contents[i]) || isNumber(contents[i]))) {
                i = i + 1;
            }
            // Keywords
            var length = i - start;
            if (length >= 2 && length <= 10) {
                var text = contents.slice(start, i);
                if (length == 2) {
                    if (text == "as")
                        kind = Tokens.AS;
                    else if (text == "if")
                        kind = Tokens.IF;
                    else if (text == "or")
                        kind = Tokens.IF;
                    else if (text == "do")
                        kind = Tokens.LEFT_BRACE;
                    else if (text == "is")
                        kind = Tokens.EQUAL; // todo
                    else if (text == "to")
                        kind = Tokens.FUNCTION;
                    // else if (text == "is") kind = TokenKind.ASSIGN;// todo
                }
                else if (length == 3) {
                    if (text == "let")
                        kind = Tokens.LET;
                    else if (text == "def")
                        kind = Tokens.FUNCTION;
                    else if (text == "new")
                        kind = Tokens.NEW;
                    else if (text == "var")
                        kind = Tokens.VAR;
                    else if (text == "val")
                        kind = Tokens.VAR;
                    else if (text == "for")
                        kind = Tokens.FOR;
                    else if (text == "and")
                        kind = Tokens.LOGICAL_AND;
                    else if (text == "not")
                        kind = Tokens.NOT;
                    else if (text == "nil")
                        kind = Tokens.NULL;
                    else if (text == "nul")
                        kind = Tokens.NULL;
                    else if (text == "@JS")
                        kind = Tokens.JAVASCRIPT;
                    else if (text == "end")
                        kind = Tokens.RIGHT_BRACE;
                }
                else if (length == 4) {
                    if (text == "else")
                        kind = Tokens.ELSE;
                    else if (text == "then")
                        kind = Tokens.LEFT_BRACE;
                    else if (text == "enum")
                        kind = Tokens.ENUM;
                    else if (text == "null")
                        kind = Tokens.NULL;
                    else if (text == "Null")
                        kind = Tokens.NULL;
                    else if (text == "none")
                        kind = Tokens.NULL;
                    else if (text == "None")
                        kind = Tokens.NULL;
                    else if (text == "this")
                        kind = Tokens.THIS;
                    else if (text == "self")
                        kind = Tokens.THIS;
                    else if (text == "True")
                        kind = Tokens.TRUE;
                    else if (text == "true")
                        kind = Tokens.TRUE;
                    else if (text == "from")
                        kind = Tokens.FROM;
                }
                else if (length == 5) {
                    if (text == "break")
                        kind = Tokens.BREAK;
                    else if (text == "class")
                        kind = Tokens.CLASS;
                    else if (text == "const")
                        kind = Tokens.CONST;
                    else if (text == "false")
                        kind = Tokens.FALSE;
                    else if (text == "False")
                        kind = Tokens.FALSE;
                    else if (text == "while")
                        kind = Tokens.WHILE;
                }
                else if (length == 6) {
                    if (text == "export")
                        kind = Tokens.EXPORT;
                    else if (text == "module")
                        kind = Tokens.MODULE;
                    else if (text == "import")
                        kind = Tokens.IMPORT;
                    else if (text == "public")
                        kind = Tokens.PUBLIC;
                    else if (text == "return")
                        kind = Tokens.RETURN;
                    else if (text == "sizeof")
                        kind = Tokens.SIZEOF;
                    else if (text == "static")
                        kind = Tokens.STATIC;
                    else if (text == "unsafe")
                        kind = Tokens.UNSAFE;
                    else if (text == "@start")
                        kind = Tokens.START; // ?
                    else if (text == "delete")
                        kind = Tokens.DELETE;
                }
                else if (length == 7) {
                    if (text == "alignof")
                        kind = Tokens.ALIGNOF; // ?
                    else if (text == "declare")
                        kind = Tokens.DECLARE;
                    else if (text == "extends")
                        kind = Tokens.EXTENDS;
                    else if (text == "private")
                        kind = Tokens.PRIVATE;
                    else if (text == "anyfunc")
                        kind = Tokens.ANYFUNC; // ?
                }
                else {
                    if (text == "continue")
                        kind = Tokens.CONTINUE;
                    else if (text == "@virtual")
                        kind = Tokens.VIRTUAL;
                    else if (text == "function")
                        kind = Tokens.FUNCTION;
                    else if (text == "constant")
                        kind = Tokens.CONST;
                    else if (text == "implements")
                        kind = Tokens.IMPLEMENTS;
                    else if (text == "protected")
                        kind = Tokens.PROTECTED;
                }
            }
        }
        else if (isNumber(c)) {
            let isFloat = false;
            let isDouble = false;
            //kind = TokenKind.INT32;
            if (i < limit) {
                var next = contents[i];
                var base = 10;
                // Handle binary, octal, and hexadecimal prefixes
                if (c == '0' && i + 1 < limit) {
                    if (next == 'b' || next == 'B')
                        base = 2;
                    else if (next == 'o' || next == 'O')
                        base = 8;
                    else if (next == 'x' || next == 'X')
                        base = 16;
                    if (base != 10) {
                        if (isDigit(contents[i + 1], base))
                            i = i + 2;
                        else
                            base = 10;
                    }
                }
                let floatFound = false;
                let exponentFound = false;
                // Scan the payload
                while (i < limit && (isDigit(contents[i], base) ||
                    (exponentFound = contents[i] === "e") ||
                    (floatFound = contents[i] === "."))) {
                    i = i + 1;
                    if (exponentFound) {
                        isFloat = true;
                        if (contents[i] === "+" || contents[i] === "-") {
                            i = i + 1;
                        }
                    }
                    if (floatFound) {
                        isFloat = true;
                    }
                }
                if (contents[i] === "f") {
                    kind = Tokens.FLOAT32;
                    i = i + 1;
                }
                else {
                    kind = isFloat ? Tokens.FLOAT64 : Tokens.INT32;
                }
                // Extra letters after the end is an error
                if (i < limit && (isAlpha(contents[i]) || isNumber(contents[i]))) {
                    i = i + 1;
                    while (i < limit && (isAlpha(contents[i]) || isNumber(contents[i]))) {
                        i = i + 1;
                    }
                    log.error(log_1.createRange(source, start, i), `Invalid ${isFloat ? "float" : "integer"} literal: '${contents.slice(start, i)}'`);
                    return null;
                }
            }
        }
        else if (c == '"' || c == '\'' || c == '`') {
            while (i < limit) {
                var next = contents[i];
                // Escape any character including newlines
                if (i + 1 < limit && next == '\\') {
                    i = i + 2;
                }
                else if (next == '\n' && c != '`') {
                    break;
                }
                else {
                    i = i + 1;
                    // End the string with a matching quote character
                    if (next == c) {
                        kind = c == '\'' ? Tokens.CHARACTER : Tokens.STRING;
                        break;
                    }
                }
            }
            // It's an error if we didn't find a matching quote character
            if (kind == Tokens.END_OF_FILE) {
                log.error(log_1.createRange(source, start, i), c == '\'' ? "Unterminated character literal" :
                    c == '`' ? "Unterminated template literal" :
                        "Unterminated string literal");
                return null;
            }
        }
        else if (c == '%')
            kind = Tokens.REMAINDER;
        else if (c == '(')
            kind = Tokens.LEFT_PARENTHESIS;
        else if (c == ')')
            kind = Tokens.RIGHT_PARENTHESIS;
        else if (c == ',')
            kind = Tokens.COMMA;
        else if (c == '.')
            kind = Tokens.DOT;
        else if (c == ':')
            kind = Tokens.COLON;
        else if (c == ';')
            kind = Tokens.SEMICOLON;
        else if (c == '?')
            kind = Tokens.QUESTION_MARK;
        else if (c == '[')
            kind = Tokens.LEFT_BRACKET;
        else if (c == ']')
            kind = Tokens.RIGHT_BRACKET;
        else if (c == '^')
            kind = Tokens.BITWISE_XOR;
        else if (c == '{')
            kind = Tokens.LEFT_BRACE;
        else if (c == '}')
            kind = Tokens.RIGHT_BRACE;
        else if (c == '~')
            kind = Tokens.COMPLEMENT;
        else if (c == '*') {
            kind = Tokens.MULTIPLY;
            if (i < limit && contents[i] == '*') {
                kind = Tokens.EXPONENT;
                i = i + 1;
            }
        }
        else if (c == '/') {
            kind = Tokens.DIVIDE;
            // Single-line comments
            if (i < limit && contents[i] == '/') {
                i = i + 1;
                while (i < limit && contents[i] != '\n') {
                    i = i + 1;
                }
                continue;
            }
            // Multi-line comments
            if (i < limit && contents[i] == '*') {
                i = i + 1;
                var foundEnd = false;
                while (i < limit) {
                    var next = contents[i];
                    if (next == '*' && i + 1 < limit && contents[i + 1] == '/') {
                        foundEnd = true;
                        i = i + 2;
                        break;
                    }
                    i = i + 1;
                }
                if (!foundEnd) {
                    log.error(log_1.createRange(source, start, start + 2), "Unterminated multi-line comment");
                    return null;
                }
                continue;
            }
        }
        else if (c == '!') {
            kind = Tokens.NOT;
            if (i < limit && contents[i] == '=') {
                kind = Tokens.NOT_EQUAL;
                i = i + 1;
                // Recover from !==
                if (i < limit && contents[i] == '=') {
                    i = i + 1;
                    log.error(log_1.createRange(source, start, i), "Use '!=' instead of '!=='");
                }
            }
        }
        else if (c == '=') {
            kind = Tokens.ASSIGN;
            if (i < limit && contents[i] == '=') {
                kind = Tokens.EQUAL;
                i = i + 1;
                // Recover from ===
                if (i < limit && contents[i] == '=') {
                    i = i + 1;
                    log.error(log_1.createRange(source, start, i), "Use '==' instead of '==='");
                }
            }
        }
        else if (c == '+') {
            kind = Tokens.PLUS;
            if (i < limit && contents[i] == '+') {
                kind = Tokens.PLUS_PLUS;
                i = i + 1;
            }
        }
        else if (c == '-') {
            kind = Tokens.MINUS;
            if (i < limit && contents[i] == '-') {
                kind = Tokens.MINUS_MINUS;
                i = i + 1;
            }
        }
        else if (c == '&') {
            kind = Tokens.BITWISE_AND;
            if (i < limit && contents[i] == '&') {
                kind = Tokens.LOGICAL_AND;
                i = i + 1;
            }
        }
        else if (c == '|') {
            kind = Tokens.BITWISE_OR;
            if (i < limit && contents[i] == '|') {
                kind = Tokens.LOGICAL_OR;
                i = i + 1;
            }
        }
        else if (c == '<') {
            kind = Tokens.LESS_THAN;
            if (i < limit) {
                c = contents[i];
                if (c == '<') {
                    kind = Tokens.SHIFT_LEFT;
                    i = i + 1;
                }
                else if (c == '=') {
                    kind = Tokens.LESS_THAN_EQUAL;
                    i = i + 1;
                }
            }
        }
        else if (c == '>') {
            kind = Tokens.GREATER_THAN;
            if (i < limit) {
                c = contents[i];
                if (c == '>') {
                    kind = Tokens.SHIFT_RIGHT;
                    i = i + 1;
                }
                else if (c == '=') {
                    kind = Tokens.GREATER_THAN_EQUAL;
                    i = i + 1;
                }
            }
        }
        else if (c == '#') {
            while (i < limit && (isAlpha(contents[i]) || isNumber(contents[i]))) {
                i = i + 1;
            }
            var text = contents.slice(start, i);
            if (text == "#define")
                kind = Tokens.PREPROCESSOR_DEFINE;
            else if (text == "#elif")
                kind = Tokens.PREPROCESSOR_ELIF;
            else if (text == "#else")
                kind = Tokens.PREPROCESSOR_ELSE;
            else if (text == "#endif")
                kind = Tokens.PREPROCESSOR_ENDIF;
            else if (text == "#error")
                kind = Tokens.PREPROCESSOR_ERROR;
            else if (text == "#if")
                kind = Tokens.PREPROCESSOR_IF;
            else if (text == "#undef")
                kind = Tokens.PREPROCESSOR_UNDEF;
            else if (text == "#warning")
                kind = Tokens.PREPROCESSOR_WARNING;
            else if (start == 0 && text == "#" && i < limit && contents[i] == '!') {
                while (i < limit && contents[i] != '\n') {
                    i = i + 1;
                }
                continue;
            }
            else {
                let errorMessage = `Invalid preprocessor token '${text}'`;
                // Check for #if typos
                if (text == "#ifdef") {
                    errorMessage += ", did you mean '#if'?";
                    kind = Tokens.PREPROCESSOR_IF;
                }
                else if (text == "#elsif" || text == "#elseif") {
                    errorMessage += ", did you mean '#elif'?";
                    kind = Tokens.PREPROCESSOR_ELIF;
                }
                else if (text == "#end") {
                    errorMessage += ", did you mean '#endif'?";
                    kind = Tokens.PREPROCESSOR_ENDIF;
                }
                else {
                    while (i < limit && contents[i] != '\n') {
                        i = i + 1;
                    }
                    continue;
                }
                log.error(log_1.createRange(source, start, i), errorMessage);
            }
            // All preprocessor directives must be on a line by themselves
            if (last != null && last.kind != Tokens.PREPROCESSOR_NEWLINE) {
                let end = last.range.end;
                let j = i - 1;
                while (j >= end) {
                    if (contents[j] == '\n') {
                        break;
                    }
                    j = j - 1;
                }
                if (j < end) {
                    log.error(log_1.createRange(source, start, i), `Expected newline before ${tokenToString(kind)}`);
                }
            }
            needsPreprocessor = true;
            wantNewline = true;
        }
        let range = log_1.createRange(source, start, i);
        if (kind == Tokens.END_OF_FILE) {
            log.error(range, `Syntax error: '${contents.slice(start, start + 1)}'`);
            return null;
        }
        let token = new Token();
        token.kind = kind;
        token.range = range;
        token.name = range.toString();
        token.type = tokenToString(kind);
        if (first == null)
            first = token;
        else
            last.next = token;
        last = token;
    }
    let eof = new Token();
    eof.kind = Tokens.END_OF_FILE;
    eof.range = log_1.createRange(source, limit, limit);
    if (first == null)
        first = eof;
    else
        last.next = eof;
    last = eof;
    // Pass a "flag" for whether the preprocessor is needed back to the caller
    if (needsPreprocessor) {
        let token = new Token();
        token.kind = Tokens.PREPROCESSOR_NEEDED;
        token.next = first;
        return token;
    }
    return first;
}
exports.tokenize = tokenize;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const filesystem_1 = __webpack_require__(15);
const wasm_binary_1 = __webpack_require__(22);
const wasm_section_1 = __webpack_require__(1);
const wasm_external_kind_1 = __webpack_require__(16);
const terminal_1 = __webpack_require__(2);
const wasm_binary_import_1 = __webpack_require__(55);
/**
 * Created by n.vinayakan on 23.06.17.
 */
class BinaryImporter {
    static reset() {
        BinaryImporter.binaries = [];
        BinaryImporter.imports = [];
    }
    static resolveWasmBinaryImport(imports, from, importPath) {
        let binary = filesystem_1.FileSystem.readBinaryFile(importPath);
        if (binary === null || binary === undefined) {
            binary = filesystem_1.FileSystem.readBinaryFile(from);
        }
        let wasmBinary = new wasm_binary_1.WasmBinary(binary);
        let importSection = wasmBinary.getSection(wasm_section_1.WasmSection.Import);
        let importCount = importSection.imports.length;
        let exportSection = wasmBinary.getSection(wasm_section_1.WasmSection.Export);
        let signatureSection = wasmBinary.getSection(wasm_section_1.WasmSection.Signature);
        let functionSection = wasmBinary.getSection(wasm_section_1.WasmSection.Function);
        let declarations = "";
        if (exportSection !== null && signatureSection !== null && functionSection !== null) {
            let exports = exportSection.exports;
            if (exports.length > 0) {
                imports.forEach(_import => {
                    let matchedExport = exports.find(_export => _export.name === _import);
                    if (matchedExport !== undefined && matchedExport.kind === wasm_external_kind_1.WasmExternalKind.Function) {
                        let _function = functionSection.functions[matchedExport.index - importCount];
                        let signature = signatureSection.signatures[_function.signatureIndex];
                        let binaryImport = new wasm_binary_import_1.WasmBinaryImport(_import, signature, matchedExport.index);
                        declarations += binaryImport.declaration + "\n";
                        BinaryImporter.imports.push(binaryImport);
                    }
                    else {
                        let error = `Cannot find function ${_import} in wasm binary ${from}`;
                        terminal_1.Terminal.error(error);
                        throw error;
                    }
                });
                BinaryImporter.binaries.push(wasmBinary);
            }
        }
        return declarations;
    }
}
BinaryImporter.binaries = [];
BinaryImporter.imports = [];
exports.BinaryImporter = BinaryImporter;
function isBinaryImport(name) {
    let found = false;
    BinaryImporter.imports.some(_import => {
        found = _import.name === name;
        return found;
    });
    return found;
}
exports.isBinaryImport = isBinaryImport;
function getMergedCallIndex(name) {
    let __import;
    BinaryImporter.imports.some(_import => {
        if (_import.name === name) {
            __import = _import;
            return true;
        }
        return false;
    });
    return __import.functionIndex;
}
exports.getMergedCallIndex = getMergedCallIndex;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __webpack_require__(19);
const terminal_1 = __webpack_require__(2);
/**
 * Created by n.vinayakan on 06.06.17.
 */
if (typeof Map === "undefined") {
    var Map = function () {
        this.get = (key) => { return this[key]; };
        this.set = (key, value) => { return this[key] = value; };
    };
}
let fs = null;
let virtualFileSystem = {
    fileMap: new Map(),
    readFileSync: (path, options) => {
        return virtualFileSystem.fileMap.get(path);
    },
    writeFileSync: (path, data, options) => {
        return virtualFileSystem.fileMap.set(path, data);
    }
};
if (env_1.isWorker) {
    terminal_1.Terminal.write("----> Worker environment");
    fs = virtualFileSystem;
    window["Buffer"] = Uint8Array;
}
else if (env_1.isBrowser) {
    terminal_1.Terminal.write("----> Browser environment");
    fs = virtualFileSystem;
    window["Buffer"] = Uint8Array;
}
else if (env_1.isNode) {
    terminal_1.Terminal.write("----> NodeJS environment\n");
    fs = __webpack_require__(35);
}
else {
    terminal_1.Terminal.error("----> Unknown host environment!!!. Where are we?");
}
class FileSystem {
    static readTextFile(path, virtual = false) {
        if (virtual) {
            let virtualFile = virtualFileSystem.readFileSync(path, 'utf8');
            return virtualFile === undefined ? null : virtualFile.replace(/\r\n/g, '\n');
        }
        try {
            return fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
        }
        catch (e) {
            let virtualFile = virtualFileSystem.readFileSync(path, 'utf8');
            if (virtualFile === undefined) {
                terminal_1.Terminal.warn(`Requested file ${path} not found`);
                return null;
            }
            else {
                return virtualFile.replace(/\r\n/g, '\n');
            }
        }
    }
    static writeTextFile(path, contents, virtual = false) {
        try {
            if (virtual) {
                virtualFileSystem.writeFileSync(path, contents);
            }
            else {
                fs.writeFileSync(path, contents);
            }
            return true;
        }
        catch (e) {
            terminal_1.Terminal.error(e.message);
            return false;
        }
    }
    static readBinaryFile(path, virtual = false) {
        if (virtual) {
            let virtualFile = virtualFileSystem.readFileSync(path);
            return virtualFile === undefined ? null : virtualFile;
        }
        try {
            return fs.readFileSync(path);
        }
        catch (e) {
            let virtualFile = virtualFileSystem.readFileSync(path);
            if (virtualFile === undefined) {
                terminal_1.Terminal.warn(`Requested file ${path} not found`);
                return null;
            }
            else {
                return virtualFile;
            }
        }
    }
    static writeBinaryFile(path, contents, virtual = false) {
        let uint8 = contents instanceof Uint8Array;
        try {
            if (virtual) {
                virtualFileSystem.writeFileSync(path, new Buffer(uint8 ? contents : contents.array.subarray(0, contents.length)));
            }
            else {
                fs.writeFileSync(path, new Buffer(uint8 ? contents : contents.array.subarray(0, contents.length)));
            }
            return true;
        }
        catch (e) {
            terminal_1.Terminal.error(e.message);
            return false;
        }
    }
    static getBasePath(path) {
        let pathSeparator = path.indexOf("/") > -1 ? "/" : (path.indexOf("\\") > -1 ? "\\" : "/");
        return path.substring(0, path.lastIndexOf(pathSeparator));
    }
    static getFileName(path) {
        let pathSeparator = path.indexOf("/") > -1 ? "/" : (path.indexOf("\\") > -1 ? "\\" : "/");
        return path.substring(path.lastIndexOf(pathSeparator) + 1, path.length);
    }
}
exports.FileSystem = FileSystem;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by n.vinayakan on 02.06.17.
 */
var WasmExternalKind;
(function (WasmExternalKind) {
    WasmExternalKind[WasmExternalKind["Function"] = 0] = "Function";
    WasmExternalKind[WasmExternalKind["Table"] = 1] = "Table";
    WasmExternalKind[WasmExternalKind["Memory"] = 2] = "Memory";
    WasmExternalKind[WasmExternalKind["Global"] = 3] = "Global";
})(WasmExternalKind = exports.WasmExternalKind || (exports.WasmExternalKind = {}));


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by nidin on 2017-01-12.
 */
exports.WasmOpcode = {
    // Control flow operators
    UNREACHABLE: 0x00,
    NOP: 0x01,
    BLOCK: 0x02,
    LOOP: 0x03,
    IF: 0x04,
    IF_ELSE: 0x05,
    END: 0x0b,
    BR: 0x0c,
    BR_IF: 0x0d,
    BR_TABLE: 0x0e,
    RETURN: 0x0f,
    // Call operators
    CALL: 0x10,
    CALL_INDIRECT: 0x11,
    //Parametric operators
    DROP: 0x1a,
    SELECT: 0x1b,
    //Variable access
    GET_LOCAL: 0x20,
    SET_LOCAL: 0x21,
    TEE_LOCAL: 0x22,
    GET_GLOBAL: 0x23,
    SET_GLOBAL: 0x24,
    // Memory-related operators
    I32_LOAD: 0x28,
    I64_LOAD: 0x29,
    F32_LOAD: 0x2a,
    F64_LOAD: 0x2b,
    I32_LOAD8_S: 0x2c,
    I32_LOAD8_U: 0x2d,
    I32_LOAD16_S: 0x2e,
    I32_LOAD16_U: 0x2f,
    I64_LOAD8_S: 0x30,
    I64_LOAD8_U: 0x31,
    I64_LOAD16_S: 0x32,
    I64_LOAD16_U: 0x33,
    I64_LOAD32_S: 0x34,
    I64_LOAD32_U: 0x35,
    I32_STORE: 0x36,
    I64_STORE: 0x37,
    F32_STORE: 0x38,
    F64_STORE: 0x39,
    I32_STORE8: 0x3a,
    I32_STORE16: 0x3b,
    I64_STORE8: 0x3c,
    I64_STORE16: 0x3d,
    I64_STORE32: 0x3e,
    MEMORY_SIZE: 0x3f,
    GROW_MEMORY: 0x40,
    // Constants
    I32_CONST: 0x41,
    I64_CONST: 0x42,
    F32_CONST: 0x43,
    F64_CONST: 0x44,
    //Comparison operators
    I32_EQZ: 0x45,
    I32_EQ: 0x46,
    I32_NE: 0x47,
    I32_LT_S: 0x48,
    I32_LT_U: 0x49,
    I32_GT_S: 0x4a,
    I32_GT_U: 0x4b,
    I32_LE_S: 0x4c,
    I32_LE_U: 0x4d,
    I32_GE_S: 0x4e,
    I32_GE_U: 0x4f,
    I64_EQZ: 0x50,
    I64_EQ: 0x51,
    I64_NE: 0x52,
    I64_LT_S: 0x53,
    I64_LT_U: 0x54,
    I64_GT_S: 0x55,
    I64_GT_U: 0x56,
    I64_LE_S: 0x57,
    I64_LE_U: 0x58,
    I64_GE_S: 0x59,
    I64_GE_U: 0x5a,
    F32_EQ: 0x5b,
    F32_NE: 0x5c,
    F32_LT: 0x5d,
    F32_GT: 0x5e,
    F32_LE: 0x5f,
    F32_GE: 0x60,
    F64_EQ: 0x61,
    F64_NE: 0x62,
    F64_LT: 0x63,
    F64_GT: 0x64,
    F64_LE: 0x65,
    F64_GE: 0x66,
    //Numeric operators
    I32_CLZ: 0x67,
    I32_CTZ: 0x68,
    I32_POPCNT: 0x69,
    I32_ADD: 0x6a,
    I32_SUB: 0x6b,
    I32_MUL: 0x6c,
    I32_DIV_S: 0x6d,
    I32_DIV_U: 0x6e,
    I32_REM_S: 0x6f,
    I32_REM_U: 0x70,
    I32_AND: 0x71,
    I32_OR: 0x72,
    I32_XOR: 0x73,
    I32_SHL: 0x74,
    I32_SHR_S: 0x75,
    I32_SHR_U: 0x76,
    I32_ROTL: 0x77,
    I32_ROTR: 0x78,
    I64_CLZ: 0x79,
    I64_CTZ: 0x7a,
    I64_POPCNT: 0x7b,
    I64_ADD: 0x7c,
    I64_SUB: 0x7d,
    I64_MUL: 0x7e,
    I64_DIV_S: 0x7f,
    I64_DIV_U: 0x80,
    I64_REM_S: 0x81,
    I64_REM_U: 0x82,
    I64_AND: 0x83,
    I64_OR: 0x84,
    I64_XOR: 0x85,
    I64_SHL: 0x86,
    I64_SHR_S: 0x87,
    I64_SHR_U: 0x88,
    I64_ROTL: 0x89,
    I64_ROTR: 0x8a,
    F32_ABS: 0x8b,
    F32_NEG: 0x8c,
    F32_CEIL: 0x8d,
    F32_FLOOR: 0x8e,
    F32_TRUNC: 0x8f,
    F32_NEAREST: 0x90,
    F32_SQRT: 0x91,
    F32_ADD: 0x92,
    F32_SUB: 0x93,
    F32_MUL: 0x94,
    F32_DIV: 0x95,
    F32_MIN: 0x96,
    F32_MAX: 0x97,
    F32_COPYSIGN: 0x98,
    F64_ABS: 0x99,
    F64_NEG: 0x9a,
    F64_CEIL: 0x9b,
    F64_FLOOR: 0x9c,
    F64_TRUNC: 0x9d,
    F64_NEAREST: 0x9e,
    F64_SQRT: 0x9f,
    F64_ADD: 0xa0,
    F64_SUB: 0xa1,
    F64_MUL: 0xa2,
    F64_DIV: 0xa3,
    F64_MIN: 0xa4,
    F64_MAX: 0xa5,
    F64_COPYSIGN: 0xa6,
    //Conversions
    I32_WRAP_I64: 0xa7,
    I32_TRUNC_S_F32: 0xa8,
    I32_TRUNC_U_F32: 0xa9,
    I32_TRUNC_S_F64: 0xaa,
    I32_TRUNC_U_F64: 0xab,
    I64_EXTEND_S_I32: 0xac,
    I64_EXTEND_U_I32: 0xad,
    I64_TRUNC_S_F32: 0xae,
    I64_TRUNC_U_F32: 0xaf,
    I64_TRUNC_S_F64: 0xb0,
    I64_TRUNC_U_F64: 0xb1,
    F32_CONVERT_S_I32: 0xb2,
    F32_CONVERT_U_I32: 0xb3,
    F32_CONVERT_S_I64: 0xb4,
    F32_CONVERT_U_I64: 0xb5,
    F32_DEMOTE_F64: 0xb6,
    F64_CONVERT_S_I32: 0xb7,
    F64_CONVERT_U_I32: 0xb8,
    F64_CONVERT_S_I64: 0xb9,
    F64_CONVERT_U_I64: 0xba,
    F64_PROMOTE_F32: 0xbb,
    //Reinterpretations
    I32_REINTERPRET_F32: 0xbc,
    I64_REINTERPRET_F64: 0xbd,
    F32_REINTERPRET_I32: 0xbe,
    F64_REINTERPRET_I64: 0xbf,
};
exports.WasmOpcode[exports.WasmOpcode.UNREACHABLE] = "unreachable";
exports.WasmOpcode[exports.WasmOpcode.NOP] = "nop";
exports.WasmOpcode[exports.WasmOpcode.BLOCK] = "block";
exports.WasmOpcode[exports.WasmOpcode.LOOP] = "loop";
exports.WasmOpcode[exports.WasmOpcode.IF] = "if";
exports.WasmOpcode[exports.WasmOpcode.IF_ELSE] = "else";
exports.WasmOpcode[exports.WasmOpcode.END] = "end";
exports.WasmOpcode[exports.WasmOpcode.BR] = "br";
exports.WasmOpcode[exports.WasmOpcode.BR_IF] = "br_if";
exports.WasmOpcode[exports.WasmOpcode.BR_TABLE] = "br_table";
exports.WasmOpcode[exports.WasmOpcode.RETURN] = "return";
// Call operators
exports.WasmOpcode[exports.WasmOpcode.CALL] = "call";
exports.WasmOpcode[exports.WasmOpcode.CALL_INDIRECT] = "call_indirect";
//Parametric operators
exports.WasmOpcode[exports.WasmOpcode.DROP] = "drop";
exports.WasmOpcode[exports.WasmOpcode.SELECT] = "select";
//Variable access
exports.WasmOpcode[exports.WasmOpcode.GET_LOCAL] = "get_local";
exports.WasmOpcode[exports.WasmOpcode.SET_LOCAL] = "set_local";
exports.WasmOpcode[exports.WasmOpcode.TEE_LOCAL] = "tee_local";
exports.WasmOpcode[exports.WasmOpcode.GET_GLOBAL] = "get_global";
exports.WasmOpcode[exports.WasmOpcode.SET_GLOBAL] = "set_global";
// Memory-related operators
exports.WasmOpcode[exports.WasmOpcode.I32_LOAD] = "i32.load";
exports.WasmOpcode[exports.WasmOpcode.I64_LOAD] = "i64.load";
exports.WasmOpcode[exports.WasmOpcode.F32_LOAD] = "f32.load";
exports.WasmOpcode[exports.WasmOpcode.F64_LOAD] = "f64.load";
exports.WasmOpcode[exports.WasmOpcode.I32_LOAD8_S] = "i32.load8_s";
exports.WasmOpcode[exports.WasmOpcode.I32_LOAD8_U] = "i32_load8_u";
exports.WasmOpcode[exports.WasmOpcode.I32_LOAD16_S] = "i32_load16_s";
exports.WasmOpcode[exports.WasmOpcode.I32_LOAD16_U] = "i32_load16_u";
exports.WasmOpcode[exports.WasmOpcode.I64_LOAD8_S] = "i64.load8_s";
exports.WasmOpcode[exports.WasmOpcode.I64_LOAD8_U] = "i64.load8_u";
exports.WasmOpcode[exports.WasmOpcode.I64_LOAD16_S] = "i64.load16_s";
exports.WasmOpcode[exports.WasmOpcode.I64_LOAD16_U] = "i64.load16_u";
exports.WasmOpcode[exports.WasmOpcode.I64_LOAD32_S] = "i64.load32_s";
exports.WasmOpcode[exports.WasmOpcode.I64_LOAD32_U] = "i64.load32_u";
exports.WasmOpcode[exports.WasmOpcode.I32_STORE] = "i32.store";
exports.WasmOpcode[exports.WasmOpcode.I64_STORE] = "i64.store";
exports.WasmOpcode[exports.WasmOpcode.F32_STORE] = "f32.store";
exports.WasmOpcode[exports.WasmOpcode.F64_STORE] = "f64.store";
exports.WasmOpcode[exports.WasmOpcode.I32_STORE8] = "i32.store8";
exports.WasmOpcode[exports.WasmOpcode.I32_STORE16] = "i32.store16";
exports.WasmOpcode[exports.WasmOpcode.I64_STORE8] = "i64.store8";
exports.WasmOpcode[exports.WasmOpcode.I64_STORE16] = "i64.store16";
exports.WasmOpcode[exports.WasmOpcode.I64_STORE32] = "i64.store32";
exports.WasmOpcode[exports.WasmOpcode.MEMORY_SIZE] = "current_memory";
exports.WasmOpcode[exports.WasmOpcode.GROW_MEMORY] = "grow_memory";
// Constants
exports.WasmOpcode[exports.WasmOpcode.I32_CONST] = "i32.const";
exports.WasmOpcode[exports.WasmOpcode.I64_CONST] = "i64.const";
exports.WasmOpcode[exports.WasmOpcode.F32_CONST] = "f32.const";
exports.WasmOpcode[exports.WasmOpcode.F64_CONST] = "f64.const";
//Comparison operators
exports.WasmOpcode[exports.WasmOpcode.I32_EQZ] = "i32.eqz";
exports.WasmOpcode[exports.WasmOpcode.I32_EQ] = "i32.eq";
exports.WasmOpcode[exports.WasmOpcode.I32_NE] = "i32.ne";
exports.WasmOpcode[exports.WasmOpcode.I32_LT_S] = "i32.lt_s";
exports.WasmOpcode[exports.WasmOpcode.I32_LT_U] = "i32.lt_u";
exports.WasmOpcode[exports.WasmOpcode.I32_GT_S] = "i32.gt_s";
exports.WasmOpcode[exports.WasmOpcode.I32_GT_U] = "i32.gt_u";
exports.WasmOpcode[exports.WasmOpcode.I32_LE_S] = "i32.le_s";
exports.WasmOpcode[exports.WasmOpcode.I32_LE_U] = "i32.le_u";
exports.WasmOpcode[exports.WasmOpcode.I32_GE_S] = "i32.ge_s";
exports.WasmOpcode[exports.WasmOpcode.I32_GE_U] = "i32.ge_u";
exports.WasmOpcode[exports.WasmOpcode.I64_EQZ] = "i64.eqz";
exports.WasmOpcode[exports.WasmOpcode.I64_EQ] = "i64.eq";
exports.WasmOpcode[exports.WasmOpcode.I64_NE] = "i64.ne";
exports.WasmOpcode[exports.WasmOpcode.I64_LT_S] = "i64.lt_s";
exports.WasmOpcode[exports.WasmOpcode.I64_LT_U] = "i64.lt_u";
exports.WasmOpcode[exports.WasmOpcode.I64_GT_S] = "i64.gt_s";
exports.WasmOpcode[exports.WasmOpcode.I64_GT_U] = "i64.gt_u";
exports.WasmOpcode[exports.WasmOpcode.I64_LE_S] = "i64.le_s";
exports.WasmOpcode[exports.WasmOpcode.I64_LE_U] = "i64.le_u";
exports.WasmOpcode[exports.WasmOpcode.I64_GE_S] = "i64.ge_s";
exports.WasmOpcode[exports.WasmOpcode.I64_GE_U] = "i64.ge_u";
exports.WasmOpcode[exports.WasmOpcode.F32_EQ] = "f32.eq";
exports.WasmOpcode[exports.WasmOpcode.F32_NE] = "f32.ne";
exports.WasmOpcode[exports.WasmOpcode.F32_LT] = "f32.lt";
exports.WasmOpcode[exports.WasmOpcode.F32_GT] = "f32.gt";
exports.WasmOpcode[exports.WasmOpcode.F32_LE] = "f32.le";
exports.WasmOpcode[exports.WasmOpcode.F32_GE] = "f32.ge";
exports.WasmOpcode[exports.WasmOpcode.F64_EQ] = "f64.eq";
exports.WasmOpcode[exports.WasmOpcode.F64_NE] = "f64.ne";
exports.WasmOpcode[exports.WasmOpcode.F64_LT] = "f64.lt";
exports.WasmOpcode[exports.WasmOpcode.F64_GT] = "f64.gt";
exports.WasmOpcode[exports.WasmOpcode.F64_LE] = "f64.le";
exports.WasmOpcode[exports.WasmOpcode.F64_GE] = "f64.ge";
//Numeric operators
exports.WasmOpcode[exports.WasmOpcode.I32_CLZ] = "i32.clz";
exports.WasmOpcode[exports.WasmOpcode.I32_CTZ] = "i32.ctz";
exports.WasmOpcode[exports.WasmOpcode.I32_POPCNT] = "i32.popcnt";
exports.WasmOpcode[exports.WasmOpcode.I32_ADD] = "i32.add";
exports.WasmOpcode[exports.WasmOpcode.I32_SUB] = "i32.sub";
exports.WasmOpcode[exports.WasmOpcode.I32_MUL] = "i32.mul";
exports.WasmOpcode[exports.WasmOpcode.I32_DIV_S] = "i32.div_s";
exports.WasmOpcode[exports.WasmOpcode.I32_DIV_U] = "i32.div_u";
exports.WasmOpcode[exports.WasmOpcode.I32_REM_S] = "i32.rem_s";
exports.WasmOpcode[exports.WasmOpcode.I32_REM_U] = "i32.rem_u";
exports.WasmOpcode[exports.WasmOpcode.I32_AND] = "i32.and";
exports.WasmOpcode[exports.WasmOpcode.I32_OR] = "i32.or";
exports.WasmOpcode[exports.WasmOpcode.I32_XOR] = "i32.xor";
exports.WasmOpcode[exports.WasmOpcode.I32_SHL] = "i32.shl";
exports.WasmOpcode[exports.WasmOpcode.I32_SHR_S] = "i32.shr_s";
exports.WasmOpcode[exports.WasmOpcode.I32_SHR_U] = "i32.shr_u";
exports.WasmOpcode[exports.WasmOpcode.I32_ROTL] = "i32.rotl";
exports.WasmOpcode[exports.WasmOpcode.I32_ROTR] = "i32.rotr";
exports.WasmOpcode[exports.WasmOpcode.I64_CLZ] = "i64.clz";
exports.WasmOpcode[exports.WasmOpcode.I64_CTZ] = "i64.ctz";
exports.WasmOpcode[exports.WasmOpcode.I64_POPCNT] = "i64.popcnt";
exports.WasmOpcode[exports.WasmOpcode.I64_ADD] = "i64.add";
exports.WasmOpcode[exports.WasmOpcode.I64_SUB] = "i64.sub";
exports.WasmOpcode[exports.WasmOpcode.I64_MUL] = "i64.mul";
exports.WasmOpcode[exports.WasmOpcode.I64_DIV_S] = "i64.div_s";
exports.WasmOpcode[exports.WasmOpcode.I64_DIV_U] = "i64.div_u";
exports.WasmOpcode[exports.WasmOpcode.I64_REM_S] = "i64.rem_s";
exports.WasmOpcode[exports.WasmOpcode.I64_REM_U] = "i64.rem_u";
exports.WasmOpcode[exports.WasmOpcode.I64_AND] = "i64.and";
exports.WasmOpcode[exports.WasmOpcode.I64_OR] = "i64.or";
exports.WasmOpcode[exports.WasmOpcode.I64_XOR] = "i64.xor";
exports.WasmOpcode[exports.WasmOpcode.I64_SHL] = "i64.shl";
exports.WasmOpcode[exports.WasmOpcode.I64_SHR_S] = "i64.shr_s";
exports.WasmOpcode[exports.WasmOpcode.I64_SHR_U] = "i64.shr_u";
exports.WasmOpcode[exports.WasmOpcode.I64_ROTL] = "i64.rotl";
exports.WasmOpcode[exports.WasmOpcode.I64_ROTR] = "i64.rotr";
exports.WasmOpcode[exports.WasmOpcode.F32_ABS] = "f32.abs";
exports.WasmOpcode[exports.WasmOpcode.F32_NEG] = "f32.neg";
exports.WasmOpcode[exports.WasmOpcode.F32_CEIL] = "f32.ceil";
exports.WasmOpcode[exports.WasmOpcode.F32_FLOOR] = "f32.floor";
exports.WasmOpcode[exports.WasmOpcode.F32_TRUNC] = "f32.trunc";
exports.WasmOpcode[exports.WasmOpcode.F32_NEAREST] = "f32.nearest";
exports.WasmOpcode[exports.WasmOpcode.F32_SQRT] = "f32.sqrt";
exports.WasmOpcode[exports.WasmOpcode.F32_ADD] = "f32.add";
exports.WasmOpcode[exports.WasmOpcode.F32_SUB] = "f32.sub";
exports.WasmOpcode[exports.WasmOpcode.F32_MUL] = "f32.mul";
exports.WasmOpcode[exports.WasmOpcode.F32_DIV] = "f32.div";
exports.WasmOpcode[exports.WasmOpcode.F32_MIN] = "f32.min";
exports.WasmOpcode[exports.WasmOpcode.F32_MAX] = "f32.max";
exports.WasmOpcode[exports.WasmOpcode.F32_COPYSIGN] = "f32.copysign";
exports.WasmOpcode[exports.WasmOpcode.F64_ABS] = "f64.abs";
exports.WasmOpcode[exports.WasmOpcode.F64_NEG] = "f64.neg";
exports.WasmOpcode[exports.WasmOpcode.F64_CEIL] = "f64.ceil";
exports.WasmOpcode[exports.WasmOpcode.F64_FLOOR] = "f64.floor";
exports.WasmOpcode[exports.WasmOpcode.F64_TRUNC] = "f64.trunc";
exports.WasmOpcode[exports.WasmOpcode.F64_NEAREST] = "f64.nearest";
exports.WasmOpcode[exports.WasmOpcode.F64_SQRT] = "f64.sqrt";
exports.WasmOpcode[exports.WasmOpcode.F64_ADD] = "f64.add";
exports.WasmOpcode[exports.WasmOpcode.F64_SUB] = "f64.sub";
exports.WasmOpcode[exports.WasmOpcode.F64_MUL] = "f64.mul";
exports.WasmOpcode[exports.WasmOpcode.F64_DIV] = "f64.div";
exports.WasmOpcode[exports.WasmOpcode.F64_MIN] = "f64.min";
exports.WasmOpcode[exports.WasmOpcode.F64_MAX] = "f64.max";
exports.WasmOpcode[exports.WasmOpcode.F64_COPYSIGN] = "f64.copysign";
//Conversions
exports.WasmOpcode[exports.WasmOpcode.I32_WRAP_I64] = "i32.wrap/i64";
exports.WasmOpcode[exports.WasmOpcode.I32_TRUNC_S_F32] = "i32.trunc_s/f32";
exports.WasmOpcode[exports.WasmOpcode.I32_TRUNC_U_F32] = "i32.trunc_u/f32";
exports.WasmOpcode[exports.WasmOpcode.I32_TRUNC_S_F64] = "i32.trunc_s/f64";
exports.WasmOpcode[exports.WasmOpcode.I32_TRUNC_U_F64] = "i32.trunc_u/f64";
exports.WasmOpcode[exports.WasmOpcode.I64_EXTEND_S_I32] = "i64.extend_s/i32";
exports.WasmOpcode[exports.WasmOpcode.I64_EXTEND_U_I32] = "i64.extend_u/i32";
exports.WasmOpcode[exports.WasmOpcode.I64_TRUNC_S_F32] = "i64.trunc_s/f32";
exports.WasmOpcode[exports.WasmOpcode.I64_TRUNC_U_F32] = "i64.trunc_u/f32";
exports.WasmOpcode[exports.WasmOpcode.I64_TRUNC_S_F64] = "i64.trunc_s/f64";
exports.WasmOpcode[exports.WasmOpcode.I64_TRUNC_U_F64] = "i64.trunc_u/f64";
exports.WasmOpcode[exports.WasmOpcode.F32_CONVERT_S_I32] = "f32.convert_s/i32";
exports.WasmOpcode[exports.WasmOpcode.F32_CONVERT_U_I32] = "f32.convert_u/i32";
exports.WasmOpcode[exports.WasmOpcode.F32_CONVERT_S_I64] = "f32.convert_s/i64";
exports.WasmOpcode[exports.WasmOpcode.F32_CONVERT_U_I64] = "f32.convert_u/i64";
exports.WasmOpcode[exports.WasmOpcode.F32_DEMOTE_F64] = "f32.demote/f64";
exports.WasmOpcode[exports.WasmOpcode.F64_CONVERT_S_I32] = "f64.convert_s/i32";
exports.WasmOpcode[exports.WasmOpcode.F64_CONVERT_U_I32] = "f64.convert_u/i32";
exports.WasmOpcode[exports.WasmOpcode.F64_CONVERT_S_I64] = "f64.convert_s/i64";
exports.WasmOpcode[exports.WasmOpcode.F64_CONVERT_U_I64] = "f64.convert_u/i64";
exports.WasmOpcode[exports.WasmOpcode.F64_PROMOTE_F32] = "f64.promote/f32";
//Reinterpretations
exports.WasmOpcode[exports.WasmOpcode.I32_REINTERPRET_F32] = "i32.reinterpret/f32";
exports.WasmOpcode[exports.WasmOpcode.I64_REINTERPRET_F64] = "i64.reinterpret/f64";
exports.WasmOpcode[exports.WasmOpcode.F32_REINTERPRET_I32] = "f32.reinterpret/i32";
exports.WasmOpcode[exports.WasmOpcode.F64_REINTERPRET_I64] = "f64.reinterpret/i64";
Object.freeze(exports.WasmOpcode);


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by n.vinayakan on 06.06.17.
 */
exports.Color = {
    DEFAULT_TEXT: 12,
    DEFAULT_BG: 8,
    BLACK: 0,
    WHITE: 255,
    BOLD: 1,
    RED: 1,
    GREEN: 2,
    YELLOW: 3,
    BLUE: 4,
    MAGENTA: 5,
    ORANGE: 208,
};
const hexColor = {};
hexColor[exports.Color.DEFAULT_TEXT] = "#000000";
hexColor[exports.Color.DEFAULT_BG] = "#FFFFFF";
hexColor[exports.Color.BLACK] = "#000000";
hexColor[exports.Color.WHITE] = "#FFFFFF";
hexColor[exports.Color.BOLD] = "";
hexColor[exports.Color.RED] = "#FF0000";
hexColor[exports.Color.GREEN] = "#00FF00";
hexColor[exports.Color.BLUE] = "#0000FF";
hexColor[exports.Color.YELLOW] = "#FFF600";
hexColor[exports.Color.MAGENTA] = "#FF00FF";
hexColor[exports.Color.ORANGE] = "#FF8C00";
exports.HexColor = hexColor;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by n.vinayakan on 06.06.17.
 */
exports.isBrowser = new Function("try {return this===window;}catch(e){ return false;}")();
exports.isWorker = new Function("try {return this===self && typeof importScripts !== 'undefined';}catch(e){return false;}")();
exports.isNode = typeof global !== "undefined" && typeof process !== "undefined" && typeof process.stdout !== "undefined";


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
let stringBuilderPool = null;
// Remove an object from the pool or allocate a new object if the pool is empty
function StringBuilder_new() {
    let sb = stringBuilderPool;
    if (sb != null)
        stringBuilderPool = sb.next;
    else
        sb = new StringBuilder();
    sb.clear();
    return sb;
}
exports.StringBuilder_new = StringBuilder_new;
function StringBuilder_appendQuoted(sb, text) {
    let end = 0;
    let limit = text.length;
    let start = end;
    sb.appendChar('"');
    while (end < limit) {
        let c = text[end];
        if (c == '"')
            sb.appendSlice(text, start, end).append("\\\"");
        else if (c == '\0')
            sb.appendSlice(text, start, end).append("\\0");
        else if (c == '\t')
            sb.appendSlice(text, start, end).append("\\t");
        else if (c == '\r')
            sb.appendSlice(text, start, end).append("\\r");
        else if (c == '\n')
            sb.appendSlice(text, start, end).append("\\n");
        else if (c == '\\')
            sb.appendSlice(text, start, end).append("\\\\");
        else {
            end = end + 1;
            continue;
        }
        end = end + 1;
        start = end;
    }
    sb.appendSlice(text, start, end).appendChar('"');
}
exports.StringBuilder_appendQuoted = StringBuilder_appendQuoted;
class StringBuilder {
    constructor(indentSize = 4) {
        this.indent = 0;
        this.chunks = [];
        this.indentSize = indentSize;
        this._text = "";
    }
    get indentSize() {
        return this._indentSize;
    }
    set indentSize(value) {
        this._indentSize = value;
        this.indentStr = "";
        for (let i = 0; i < value; i++) {
            this.indentStr += " ";
        }
    }
    clear() {
        this._text = "";
    }
    clearIndent(delta = 0) {
        this._text = this._text.substr(0, this._text.length - (delta * this.indentSize));
    }
    emitIndent(delta = 0) {
        if (delta < 0) {
            this._text = this._text.substr(0, this._text.length + (delta * this.indentSize));
        }
        this.indent += delta;
        let i = this.indent;
        while (i > 0) {
            this._text += this.indentStr;
            i = i - 1;
        }
    }
    appendChar(c) {
        // this._text = StringBuilder_appendChar(this._text, c);
        this._text += c;
        return this;
    }
    appendSlice(text, start, end) {
        // this._text = StringBuilder_append(this._text, text.slice(start, end));
        this._text += text.slice(start, end);
        return this;
    }
    breakChunk() {
        this.chunks.push(this._text);
        this._text = "";
        return this.chunks.length - 1;
    }
    appendLine(text, indent = 0) {
        this.indent += indent;
        this.emitIndent();
        this._text += text + "\n";
        return this;
    }
    appendRaw(text) {
        this._text += text + "\n";
        return this;
    }
    append(text, indent = 0) {
        this.indent += indent;
        let lines = text.split("\n");
        lines.forEach((line, i) => {
            if (i > 0) {
                this._text += "\n";
                this.emitIndent();
            }
            this._text += line;
        });
        return this;
    }
    removeLastChar() {
        this._text = this._text.substring(0, this._text.length - 1);
    }
    removeLastLinebreak() {
        this._text = this._text.substring(0, this._text.lastIndexOf("\n"));
    }
    // This also "frees" this object (puts it back in the pool)
    finish() {
        this.next = stringBuilderPool;
        stringBuilderPool = this;
        if (this.chunks.length > 0) {
            let code = "";
            this.chunks.forEach((chunk) => {
                code += chunk;
            });
            return code + this._text;
        }
        else {
            return this._text;
        }
    }
}
exports.StringBuilder = StringBuilder;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_type_1 = __webpack_require__(6);
const stringbuilder_1 = __webpack_require__(20);
/**
 * Created by n.vinayakan on 02.06.17.
 */
class WasmFunction {
    constructor(name = "<anonymous>", symbol) {
        this.name = name;
        this.symbol = symbol;
        this.isExternal = false;
        this.isExported = false;
        this.localVariables = [];
        this.returnType = wasm_type_1.WasmType.VOID;
        this.code = new stringbuilder_1.StringBuilder(2);
        this.chunks = [];
    }
    toString() {
        return `[WasmFunction]:: ${this.name}()[${this.signatureIndex}]`;
    }
}
exports.WasmFunction = WasmFunction;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bytearray_1 = __webpack_require__(0);
const terminal_1 = __webpack_require__(2);
const wasm_section_1 = __webpack_require__(1);
const wasm_parser_1 = __webpack_require__(34);
/**
 * Created by n.vinayakan on 17.06.17.
 */
class WasmBinary {
    constructor(data) {
        this.sections = [];
        this.sectionMap = new Map();
        if (data !== undefined) {
            this.read(data);
        }
        else {
            this.data = new bytearray_1.ByteArray();
            this.data.log = "";
            this.data.writeUnsignedInt(WasmBinary.MAGIC);
            this.data.writeUnsignedInt(WasmBinary.VERSION);
            this.data.log += '0000000: 0061 736d             ; WASM_BINARY_MAGIC\n';
            this.data.log += '0000004: 0100 0000             ; WASM_BINARY_VERSION\n';
        }
    }
    read(data) {
        if (data !== null && data !== undefined) {
            this.data = new bytearray_1.ByteArray(data.buffer, data.byteOffset, data.byteLength);
            this.data.endian = bytearray_1.ByteArray.LITTLE_ENDIAN;
            // Check magic number
            let magic = this.data.readUnsignedInt();
            let version = this.data.readUnsignedInt();
            if (magic !== WasmBinary.MAGIC) {
                terminal_1.Terminal.error(`Found unknown WASM magic number ${magic} instead of ${WasmBinary.MAGIC}`);
            }
            this.readNextSection();
        }
    }
    readNextSection() {
        if (this.data.bytesAvailable > 0) {
            let section = wasm_parser_1.parseSection(this.data);
            if (section !== null) {
                this.sectionMap.set(section.id, this.sections.push(section) - 1);
            }
            this.readNextSection();
        }
        else {
            // Terminal.log(`${this.sections.length} Sections parsed!`);
        }
    }
    reset() {
        this.sections = null;
        this.sections = [];
        this.sectionMap = null;
        this.sectionMap = new Map();
        this.data = new bytearray_1.ByteArray();
        this.data.log = "";
        this.data.writeUnsignedInt(WasmBinary.MAGIC);
        this.data.writeUnsignedInt(WasmBinary.VERSION);
        this.data.log += '0000000: 0061 736d             ; WASM_BINARY_MAGIC\n';
        this.data.log += '0000004: 0100 0000             ; WASM_BINARY_VERSION\n';
    }
    appendSection(section) {
        this.sectionMap.set(section.id, this.sections.push(section) - 1);
    }
    getSection(id, name) {
        let index = this.sectionMap.get(id);
        if (index !== undefined) {
            return this.sections[index];
        }
        else {
            let section = wasm_parser_1.createSection(id, name);
            this.appendSection(section);
            // let warn = `Section ${WasmSection[id]} created! Reason: Requested section not found in the imported wasm module`;
            // Terminal.warn(warn);
            return section;
        }
    }
    initializeSections() {
        this.appendSection(wasm_parser_1.createSection(wasm_section_1.WasmSection.Signature));
        this.appendSection(wasm_parser_1.createSection(wasm_section_1.WasmSection.Import));
        this.appendSection(wasm_parser_1.createSection(wasm_section_1.WasmSection.Function));
        this.appendSection(wasm_parser_1.createSection(wasm_section_1.WasmSection.Table));
        this.appendSection(wasm_parser_1.createSection(wasm_section_1.WasmSection.Memory));
        this.appendSection(wasm_parser_1.createSection(wasm_section_1.WasmSection.Global));
        this.appendSection(wasm_parser_1.createSection(wasm_section_1.WasmSection.Export));
        this.appendSection(wasm_parser_1.createSection(wasm_section_1.WasmSection.Start));
        this.appendSection(wasm_parser_1.createSection(wasm_section_1.WasmSection.Element));
        this.appendSection(wasm_parser_1.createSection(wasm_section_1.WasmSection.Code));
        this.appendSection(wasm_parser_1.createSection(wasm_section_1.WasmSection.Data));
        this.appendSection(wasm_parser_1.createSection(wasm_section_1.WasmSection.Custom, "name"));
    }
    copySections(binary) {
        binary.sections.forEach(importedSection => {
            switch (importedSection.id) {
                case wasm_section_1.WasmSection.Signature: {
                    let section = this.getSection(importedSection.id);
                    section.signatures = section.signatures.concat(importedSection.signatures);
                    break;
                }
                case wasm_section_1.WasmSection.Import: {
                    let section = this.getSection(importedSection.id);
                    section.imports = section.imports.concat(importedSection.imports);
                    break;
                }
                case wasm_section_1.WasmSection.Function: {
                    let section = this.getSection(importedSection.id);
                    section.functions = section.functions.concat(importedSection.functions);
                    break;
                }
                case wasm_section_1.WasmSection.Table: {
                    let section = this.getSection(importedSection.id);
                    section.tables = section.tables.concat(importedSection.tables);
                    break;
                }
                case wasm_section_1.WasmSection.Memory: {
                    let section = this.getSection(importedSection.id);
                    section.memory = section.memory.concat(importedSection.memory);
                    break;
                }
                case wasm_section_1.WasmSection.Global: {
                    let section = this.getSection(importedSection.id);
                    section.globals = section.globals.concat(importedSection.globals);
                    break;
                }
                case wasm_section_1.WasmSection.Export: {
                    let section = this.getSection(importedSection.id);
                    section.exports = section.exports.concat(importedSection.exports);
                    break;
                }
                case wasm_section_1.WasmSection.Start: {
                    let section = this.getSection(importedSection.id);
                    if (section.startFunctionIndex === -1) {
                        section.startFunctionIndex = importedSection.startFunctionIndex;
                    }
                    break;
                }
                case wasm_section_1.WasmSection.Element: {
                    let section = this.getSection(importedSection.id);
                    section.elements = section.elements.concat(importedSection.elements);
                    break;
                }
                case wasm_section_1.WasmSection.Code: {
                    let section = this.getSection(importedSection.id);
                    section.functions = section.functions.concat(importedSection.functions);
                    break;
                }
                case wasm_section_1.WasmSection.Data: {
                    let section = this.getSection(importedSection.id);
                    section.data = section.data.concat(importedSection.data);
                    break;
                }
                case wasm_section_1.WasmSection.Custom: {
                    if (importedSection.name === "name") {
                        let section = this.getSection(importedSection.id);
                        // TODO
                    }
                    break;
                }
            }
        });
    }
}
WasmBinary.MAGIC = 0x6d736100; //'\0' | 'a' << 8 | 's' << 16 | 'm' << 24;
WasmBinary.VERSION = 0x1;
WasmBinary.SIZE_IN_PAGES = 1;
WasmBinary.SET_MAX_MEMORY = false;
WasmBinary.MAX_MEMORY = 1024 * 1024 * 1024;
WasmBinary.MEMORY_INITIALIZER_BASE = 8; // Leave space for "null"
exports.WasmBinary = WasmBinary;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = __webpack_require__(7);
const type_1 = __webpack_require__(24);
var FindNested;
(function (FindNested) {
    FindNested[FindNested["NORMAL"] = 0] = "NORMAL";
    FindNested[FindNested["ALLOW_INSTANCE_ERRORS"] = 1] = "ALLOW_INSTANCE_ERRORS";
})(FindNested = exports.FindNested || (exports.FindNested = {}));
var ScopeHint;
(function (ScopeHint) {
    ScopeHint[ScopeHint["NORMAL"] = 0] = "NORMAL";
    ScopeHint[ScopeHint["NOT_BINARY"] = 1] = "NOT_BINARY";
    ScopeHint[ScopeHint["NOT_GETTER"] = 2] = "NOT_GETTER";
    ScopeHint[ScopeHint["NOT_SETTER"] = 3] = "NOT_SETTER";
    ScopeHint[ScopeHint["NOT_UNARY"] = 4] = "NOT_UNARY";
    ScopeHint[ScopeHint["PREFER_GETTER"] = 5] = "PREFER_GETTER";
    ScopeHint[ScopeHint["PREFER_SETTER"] = 6] = "PREFER_SETTER";
})(ScopeHint = exports.ScopeHint || (exports.ScopeHint = {}));
class Scope {
    findLocal(name, hint) {
        var symbol = this.firstSymbol;
        var fallback = null;
        while (symbol != null) {
            if (symbol.name == name) {
                if (hint == ScopeHint.PREFER_GETTER && symbol.isSetter() ||
                    hint == ScopeHint.PREFER_SETTER && symbol.isGetter()) {
                    fallback = symbol;
                }
                else if ((hint != ScopeHint.NOT_GETTER || !symbol.isGetter()) &&
                    (hint != ScopeHint.NOT_SETTER || !symbol.isSetter()) &&
                    (hint != ScopeHint.NOT_BINARY || !symbol.isBinaryOperator()) &&
                    (hint != ScopeHint.NOT_UNARY || !symbol.isUnaryOperator())) {
                    return symbol;
                }
            }
            symbol = symbol.next;
        }
        return fallback;
    }
    findNested(name, hint, mode) {
        var scope = this;
        while (scope != null) {
            if (scope.symbol == null || scope.symbol.kind != symbol_1.SymbolKind.TYPE_CLASS ||
                mode == FindNested.ALLOW_INSTANCE_ERRORS || scope.symbol.node.hasParameters()) {
                var local = scope.findLocal(name, hint);
                if (local != null) {
                    return local;
                }
            }
            scope = scope.parent;
        }
        if (name == "bool")
            return this.findNested("boolean", hint, mode); // todo better
        if (name == "byte")
            return this.findNested("int8", hint, mode); // todo better
        if (name == "short")
            return this.findNested("int16", hint, mode); // todo better
        if (name == "int")
            return this.findNested("int32", hint, mode); // todo better
        if (name == "long")
            return this.findNested("int64", hint, mode); // todo better
        if (name == "float")
            return this.findNested("float32", hint, mode); // todo better
        if (name == "double")
            return this.findNested("float64", hint, mode); // todo better
        if (name == "number")
            return this.findNested("float64", hint, mode); // todo better
        // if(name=="char") dont return this.findNested("int8",hint,mode)// todo better
        return null;
    }
    define(log, symbol, hint) {
        let existing = this.findLocal(symbol.name, hint);
        if (existing != null) {
            if (symbol.name == "this") {
                log.warning(symbol.range, "Duplicate 'this' symbol");
                return true;
            }
            else {
                log.error(symbol.range, `Duplicate symbol '${symbol.name}'`);
                return false;
            }
        }
        if (this.firstSymbol == null)
            this.firstSymbol = symbol;
        else
            this.lastSymbol.next = symbol;
        this.lastSymbol = symbol;
        return true;
    }
    defineNativeType(log, name) {
        var symbol = new symbol_1.Symbol();
        symbol.kind = symbol_1.SymbolKind.TYPE_NATIVE;
        symbol.name = name;
        symbol.resolvedType = new type_1.Type();
        symbol.resolvedType.symbol = symbol;
        symbol.state = symbol_1.SymbolState.INITIALIZED;
        this.define(log, symbol, ScopeHint.NORMAL);
        return symbol.resolvedType;
    }
}
exports.Scope = Scope;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = __webpack_require__(7);
var ConversionKind;
(function (ConversionKind) {
    ConversionKind[ConversionKind["IMPLICIT"] = 0] = "IMPLICIT";
    ConversionKind[ConversionKind["EXPLICIT"] = 1] = "EXPLICIT";
})(ConversionKind = exports.ConversionKind || (exports.ConversionKind = {}));
class Type {
    isClass() {
        return this.symbol != null && this.symbol.kind == symbol_1.SymbolKind.TYPE_CLASS;
    }
    isGeneric() {
        let symbol = this.symbol || this.pointerTo.symbol;
        return symbol != null && symbol.kind == symbol_1.SymbolKind.TYPE_GENERIC;
    }
    isTemplate() {
        let symbol = this.symbol || this.pointerTo.symbol;
        return symbol != null && symbol.kind == symbol_1.SymbolKind.TYPE_TEMPLATE;
    }
    isEnum() {
        return this.symbol != null && this.symbol.kind == symbol_1.SymbolKind.TYPE_ENUM;
    }
    isInteger() {
        return this.symbol != null && (this.symbol.flags & symbol_1.SYMBOL_FLAG_NATIVE_INTEGER) != 0 || this.isEnum();
    }
    isLong() {
        return this.symbol != null && (this.symbol.flags & symbol_1.SYMBOL_FLAG_NATIVE_LONG) != 0;
    }
    isUnsigned() {
        return this.symbol != null && (this.symbol.flags & symbol_1.SYMBOL_FLAG_IS_UNSIGNED) != 0;
    }
    isFloat() {
        return this.symbol != null && (this.symbol.flags & symbol_1.SYMBOL_FLAG_NATIVE_FLOAT) != 0;
    }
    isDouble() {
        return this.symbol != null && (this.symbol.flags & symbol_1.SYMBOL_FLAG_NATIVE_DOUBLE) != 0;
    }
    isArray() {
        // return this.symbol != null && (this.symbol.flags & SYMBOL_FLAG_IS_ARRAY) != 0;
        return this.symbol != null && this.symbol.name.indexOf("Array<") >= 0;
    }
    isTypedArray() {
        return this.symbol != null &&
            (this.symbol.name == "Float32Array" || this.symbol.name == "Float64Array" ||
                this.symbol.name == "Int8Array" || this.symbol.name == "Int16Array" || this.symbol.name == "Int32Array" ||
                this.symbol.name == "Uint8Array" || this.symbol.name == "Uint16Array" || this.symbol.name == "Uint32Array");
    }
    isReference() {
        return this.pointerTo != null || this.symbol != null && (this.symbol.flags & symbol_1.SYMBOL_FLAG_IS_REFERENCE) != 0;
    }
    underlyingType(context) {
        return this.isEnum() ? context.int32Type : this.pointerTo != null ? context.uint32Type : this;
    }
    integerBitCount(context) {
        return this.symbol != null ? this.symbol.byteSize * 8 : 0;
    }
    integerBitMask(context) {
        return ~0 >> (32 - this.integerBitCount(context));
    }
    allocationSizeOf(context) {
        return this.symbol == null ? context.pointerByteSize : this.symbol.byteSize;
    }
    allocationAlignmentOf(context) {
        return this.allocationSizeOf(context); // This is true right now
    }
    variableSizeOf(context) {
        return this.isReference() ? context.pointerByteSize : this.symbol.byteSize;
    }
    variableAlignmentOf(context) {
        return this.variableSizeOf(context); // This is true right now
    }
    pointerType() {
        let type = this.cachedPointerType;
        if (type == null) {
            type = new Type();
            type.pointerTo = this;
            this.cachedPointerType = type;
        }
        return type;
    }
    toString() {
        if (this.cachedToString == null) {
            this.cachedToString =
                this.pointerTo != null ? "*" + this.pointerTo.toString() :
                    this.symbol.name;
        }
        return this.cachedToString;
    }
    findMember(name, hint) {
        let symbol = this.symbol;
        return symbol != null && symbol.scope != null ? symbol.scope.findLocal(name, hint) : null;
    }
    hasInstanceMembers() {
        let symbol = this.symbol;
        return symbol != null && (symbol.kind == symbol_1.SymbolKind.TYPE_TEMPLATE || symbol.kind == symbol_1.SymbolKind.TYPE_CLASS || symbol.kind == symbol_1.SymbolKind.TYPE_NATIVE);
    }
}
exports.Type = Type;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const scanner_1 = __webpack_require__(13);
const log_1 = __webpack_require__(5);
const node_1 = __webpack_require__(10);
const assert_1 = __webpack_require__(3);
const terminal_1 = __webpack_require__(2);
var Precedence;
(function (Precedence) {
    Precedence[Precedence["LOWEST"] = 0] = "LOWEST";
    Precedence[Precedence["ASSIGN"] = 1] = "ASSIGN";
    Precedence[Precedence["LOGICAL_OR"] = 2] = "LOGICAL_OR";
    Precedence[Precedence["LOGICAL_AND"] = 3] = "LOGICAL_AND";
    Precedence[Precedence["BITWISE_OR"] = 4] = "BITWISE_OR";
    Precedence[Precedence["BITWISE_XOR"] = 5] = "BITWISE_XOR";
    Precedence[Precedence["BITWISE_AND"] = 6] = "BITWISE_AND";
    Precedence[Precedence["EQUAL"] = 7] = "EQUAL";
    Precedence[Precedence["COMPARE"] = 8] = "COMPARE";
    Precedence[Precedence["SHIFT"] = 9] = "SHIFT";
    Precedence[Precedence["ADD"] = 10] = "ADD";
    Precedence[Precedence["MULTIPLY"] = 11] = "MULTIPLY";
    Precedence[Precedence["EXPONENT"] = 12] = "EXPONENT";
    Precedence[Precedence["UNARY_PREFIX"] = 13] = "UNARY_PREFIX";
    Precedence[Precedence["UNARY_POSTFIX"] = 14] = "UNARY_POSTFIX";
    Precedence[Precedence["MEMBER"] = 15] = "MEMBER";
})(Precedence = exports.Precedence || (exports.Precedence = {}));
function isRightAssociative(precedence) {
    return precedence == Precedence.ASSIGN || precedence == Precedence.EXPONENT;
}
var ParseKind;
(function (ParseKind) {
    ParseKind[ParseKind["EXPRESSION"] = 0] = "EXPRESSION";
    ParseKind[ParseKind["TYPE"] = 1] = "TYPE";
})(ParseKind || (ParseKind = {}));
var StatementMode;
(function (StatementMode) {
    StatementMode[StatementMode["NORMAL"] = 0] = "NORMAL";
    StatementMode[StatementMode["FILE"] = 1] = "FILE";
    StatementMode[StatementMode["UNTERMINATED"] = 2] = "UNTERMINATED";
})(StatementMode || (StatementMode = {}));
class ParserContext {
    peek(kind) {
        return this.current.kind == kind;
    }
    eat(kind) {
        if (this.peek(kind)) {
            this.advance();
            return true;
        }
        return false;
    }
    advance() {
        if (!this.peek(scanner_1.Tokens.END_OF_FILE)) {
            this.previous = this.current;
            this.current = this.current.next;
        }
    }
    unexpectedToken() {
        if (this.lastError != this.current) {
            this.lastError = this.current;
            this.log.error(this.current.range, `Unexpected ${scanner_1.tokenToString(this.current.kind)}`);
        }
    }
    expect(kind) {
        var a = scanner_1.Tokens.LEFT_BRACE;
        if (!this.peek(kind)) {
            if (kind == scanner_1.Tokens.SEMICOLON)
                return true; // optional semicolon
            if (kind == scanner_1.Tokens.COLON)
                return true; // optional COLON
            // if(kind==Tokens.LEFT_BRACE)return true; // optional braces
            if (kind == scanner_1.Tokens.RIGHT_BRACE)
                return true; // optional braces
            if (kind == scanner_1.Tokens.LEFT_PARENTHESIS)
                return true; // optional braces
            if (kind == scanner_1.Tokens.RIGHT_PARENTHESIS)
                return true; // optional braces
            if (this.lastError != this.current) {
                this.lastError = this.current;
                let previousLine = this.previous.range.enclosingLine();
                let currentLine = this.current.range.enclosingLine();
                // Show missing token errors on the previous line for clarity
                if (kind != scanner_1.Tokens.IDENTIFIER && !previousLine.equals(currentLine)) {
                    this.log.error(previousLine.rangeAtEnd(), `Expected ${scanner_1.tokenToString(kind)}`);
                }
                else {
                    this.log.error(this.current.range, `Expected ${scanner_1.tokenToString(kind)} but found ${scanner_1.tokenToString(this.current.kind)}`);
                }
            }
            return false;
        }
        this.advance();
        return true;
    }
    parseUnaryPrefix(kind, mode) {
        assert_1.assert(node_1.isUnary(kind));
        let token = this.current;
        this.advance();
        let value = this.parseExpression(Precedence.UNARY_PREFIX, mode);
        if (value == null) {
            return null;
        }
        return node_1.createUnary(kind, value).withRange(log_1.spanRanges(token.range, value.range)).withInternalRange(token.range);
    }
    parseBinary(kind, left, localPrecedence, operatorPrecedence) {
        if (localPrecedence >= operatorPrecedence) {
            return left;
        }
        let token = this.current;
        this.advance();
        // Reduce the precedence for right-associative operators
        let precedence = isRightAssociative(operatorPrecedence) ? (operatorPrecedence - 1) : operatorPrecedence;
        let right = this.parseExpression(precedence, ParseKind.EXPRESSION);
        if (right == null) {
            return null;
        }
        return node_1.createBinary(kind, left, right).withRange(log_1.spanRanges(left.range, right.range)).withInternalRange(token.range);
    }
    parseUnaryPostfix(kind, value, localPrecedence) {
        if (localPrecedence >= Precedence.UNARY_POSTFIX) {
            return value;
        }
        let token = this.current;
        this.advance();
        return node_1.createUnary(kind, value).withRange(log_1.spanRanges(value.range, token.range)).withInternalRange(token.range);
    }
    parseQuotedString(range) {
        assert_1.assert(range.end - range.start >= 2);
        let text = range.source.contents;
        let end = range.start + 1;
        let limit = range.end - 1;
        let start = end;
        let quotedString = "";
        while (end < limit) {
            let c = text[end];
            if (c == '\\') {
                quotedString += text.slice(start, end);
                end = end + 1;
                start = end + 1;
                c = text[end];
                if (c == '0')
                    quotedString += '\0';
                else if (c == 't')
                    quotedString += '\t';
                else if (c == 'n')
                    quotedString += '\n';
                else if (c == 'r')
                    quotedString += '\r';
                else if (c == '"' || c == '\'' || c == '`' || c == '\n' || c == '\\')
                    start = end;
                else {
                    let escape = log_1.createRange(range.source, range.start + end - 1, range.start + end + 1);
                    this.log.error(escape, `Invalid escape code '${escape.toString()}'`);
                    return null;
                }
            }
            end = end + 1;
        }
        return quotedString + text.slice(start, end);
    }
    parsePrefix(mode) {
        let token = this.current;
        if (this.peek(scanner_1.Tokens.IDENTIFIER)) {
            this.advance();
            return node_1.createName(token.range.toString()).withRange(token.range);
        }
        // if (this.peek(TokenKind.ARRAY)) {
        //     this.advance();
        //     return createArray(token.range.toString()).withRange(token.range);
        // }
        if (this.peek(scanner_1.Tokens.EXPONENT)) {
            scanner_1.splitToken(this.current, scanner_1.Tokens.MULTIPLY, scanner_1.Tokens.MULTIPLY);
        }
        if (this.peek(scanner_1.Tokens.MULTIPLY)) {
            return this.parseUnaryPrefix(mode == ParseKind.TYPE ? node_1.NodeKind.POINTER_TYPE : node_1.NodeKind.DEREFERENCE, mode);
        }
        if (mode == ParseKind.EXPRESSION) {
            if (this.eat(scanner_1.Tokens.NULL)) {
                return node_1.createNull().withRange(token.range);
            }
            if (this.eat(scanner_1.Tokens.UNDEFINED)) {
                return node_1.createUndefined().withRange(token.range);
            }
            if (this.eat(scanner_1.Tokens.THIS)) {
                return node_1.createThis().withRange(token.range);
            }
            if (this.peek(scanner_1.Tokens.CHARACTER)) {
                let text = this.parseQuotedString(token.range);
                if (text == null) {
                    return null;
                }
                this.advance();
                if (text.length != 1) {
                    this.log.error(token.range, "Invalid character literal (strings use double quotes)");
                    return node_1.createParseError().withRange(token.range);
                }
                return node_1.createInt(text.charCodeAt(0)).withRange(token.range);
            }
            if (this.peek(scanner_1.Tokens.STRING)) {
                let text = this.parseQuotedString(token.range);
                if (text == null) {
                    return null;
                }
                this.advance();
                return node_1.createString(text).withRange(token.range);
            }
            if (this.peek(scanner_1.Tokens.INT32)) {
                let value = node_1.createInt(0);
                if (!this.parseInt(token.range, value)) {
                    value = node_1.createParseError();
                }
                this.advance();
                return value.withRange(token.range);
            }
            if (this.peek(scanner_1.Tokens.FLOAT32)) {
                let value = node_1.createFloat(0);
                if (!this.parseFloat(token.range, value)) {
                    value = node_1.createParseError();
                }
                this.advance();
                return value.withRange(token.range);
            }
            if (this.peek(scanner_1.Tokens.FLOAT64)) {
                let value = node_1.createDouble(0);
                if (!this.parseDouble(token.range, value)) {
                    value = node_1.createParseError();
                }
                this.advance();
                return value.withRange(token.range);
            }
            if (this.eat(scanner_1.Tokens.TRUE)) {
                return node_1.createboolean(true).withRange(token.range);
            }
            if (this.eat(scanner_1.Tokens.FALSE)) {
                return node_1.createboolean(false).withRange(token.range);
            }
            if (this.eat(scanner_1.Tokens.NEW)) {
                let type = this.parseType();
                if (type == null) {
                    return null;
                }
                if (this.peek(scanner_1.Tokens.LESS_THAN)) {
                    let parameters = this.parseParameters();
                    if (parameters == null) {
                        return null;
                    }
                    type.appendChild(parameters);
                }
                return this.parseArgumentList(token.range, node_1.createNew(type));
            }
            if (this.eat(scanner_1.Tokens.ALIGNOF)) {
                if (!this.expect(scanner_1.Tokens.LEFT_PARENTHESIS)) {
                    return null;
                }
                let type = this.parseType();
                let close = this.current;
                if (type == null || !this.expect(scanner_1.Tokens.RIGHT_PARENTHESIS)) {
                    return null;
                }
                return node_1.createAlignOf(type).withRange(log_1.spanRanges(token.range, close.range));
            }
            if (this.eat(scanner_1.Tokens.SIZEOF)) {
                if (!this.expect(scanner_1.Tokens.LEFT_PARENTHESIS)) {
                    return null;
                }
                let type = this.parseType();
                let close = this.current;
                if (type == null || !this.expect(scanner_1.Tokens.RIGHT_PARENTHESIS)) {
                    return null;
                }
                return node_1.createSizeOf(type).withRange(log_1.spanRanges(token.range, close.range));
            }
            if (this.eat(scanner_1.Tokens.LEFT_PARENTHESIS)) {
                let value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
                let close = this.current;
                if (value == null || !this.expect(scanner_1.Tokens.RIGHT_PARENTHESIS)) {
                    return null;
                }
                return value.withRange(log_1.spanRanges(token.range, close.range));
            }
            // Unary prefix
            if (this.peek(scanner_1.Tokens.BITWISE_AND))
                return this.parseUnaryPrefix(node_1.NodeKind.ADDRESS_OF, ParseKind.EXPRESSION);
            if (this.peek(scanner_1.Tokens.COMPLEMENT))
                return this.parseUnaryPrefix(node_1.NodeKind.COMPLEMENT, ParseKind.EXPRESSION);
            if (this.peek(scanner_1.Tokens.MINUS))
                return this.parseUnaryPrefix(node_1.NodeKind.NEGATIVE, ParseKind.EXPRESSION);
            if (this.peek(scanner_1.Tokens.MINUS_MINUS))
                return this.parseUnaryPrefix(node_1.NodeKind.PREFIX_DECREMENT, ParseKind.EXPRESSION);
            if (this.peek(scanner_1.Tokens.NOT))
                return this.parseUnaryPrefix(node_1.NodeKind.NOT, ParseKind.EXPRESSION);
            if (this.peek(scanner_1.Tokens.PLUS))
                return this.parseUnaryPrefix(node_1.NodeKind.POSITIVE, ParseKind.EXPRESSION);
            if (this.peek(scanner_1.Tokens.PLUS_PLUS))
                return this.parseUnaryPrefix(node_1.NodeKind.PREFIX_INCREMENT, ParseKind.EXPRESSION);
        }
        if (this.peek(scanner_1.Tokens.LEFT_BRACE)) {
            terminal_1.Terminal.write("Check if its JS");
        }
        this.unexpectedToken();
        return null;
    }
    parseInfix(precedence, current_node, mode) {
        let token = this.current.range;
        // Dot
        if (this.peek(scanner_1.Tokens.DOT) && precedence < Precedence.MEMBER) {
            this.advance();
            let name = this.current;
            let range = name.range;
            // Allow contextual keywords
            if (scanner_1.isKeyword(name.kind)) {
                this.advance();
            }
            else if (!this.expect(scanner_1.Tokens.IDENTIFIER)) {
                range = log_1.createRange(range.source, token.end, token.end);
            }
            return node_1.createDot(current_node, range.toString()).withRange(log_1.spanRanges(current_node.range, range)).withInternalRange(range);
        }
        if (mode == ParseKind.EXPRESSION) {
            // Binary
            if (this.peek(scanner_1.Tokens.ASSIGN))
                return this.parseBinary(node_1.NodeKind.ASSIGN, current_node, precedence, Precedence.ASSIGN);
            if (this.peek(scanner_1.Tokens.BITWISE_AND))
                return this.parseBinary(node_1.NodeKind.BITWISE_AND, current_node, precedence, Precedence.BITWISE_AND);
            if (this.peek(scanner_1.Tokens.BITWISE_OR))
                return this.parseBinary(node_1.NodeKind.BITWISE_OR, current_node, precedence, Precedence.BITWISE_OR);
            if (this.peek(scanner_1.Tokens.BITWISE_XOR))
                return this.parseBinary(node_1.NodeKind.BITWISE_XOR, current_node, precedence, Precedence.BITWISE_XOR);
            if (this.peek(scanner_1.Tokens.DIVIDE))
                return this.parseBinary(node_1.NodeKind.DIVIDE, current_node, precedence, Precedence.MULTIPLY);
            if (this.peek(scanner_1.Tokens.EQUAL))
                return this.parseBinary(node_1.NodeKind.EQUAL, current_node, precedence, Precedence.EQUAL);
            if (this.peek(scanner_1.Tokens.EXPONENT))
                return this.parseBinary(node_1.NodeKind.EXPONENT, current_node, precedence, Precedence.EXPONENT);
            if (this.peek(scanner_1.Tokens.GREATER_THAN))
                return this.parseBinary(node_1.NodeKind.GREATER_THAN, current_node, precedence, Precedence.COMPARE);
            if (this.peek(scanner_1.Tokens.GREATER_THAN_EQUAL))
                return this.parseBinary(node_1.NodeKind.GREATER_THAN_EQUAL, current_node, precedence, Precedence.COMPARE);
            if (this.peek(scanner_1.Tokens.LESS_THAN))
                return this.parseBinary(node_1.NodeKind.LESS_THAN, current_node, precedence, Precedence.COMPARE);
            if (this.peek(scanner_1.Tokens.LESS_THAN_EQUAL))
                return this.parseBinary(node_1.NodeKind.LESS_THAN_EQUAL, current_node, precedence, Precedence.COMPARE);
            if (this.peek(scanner_1.Tokens.LOGICAL_AND))
                return this.parseBinary(node_1.NodeKind.LOGICAL_AND, current_node, precedence, Precedence.LOGICAL_AND);
            if (this.peek(scanner_1.Tokens.LOGICAL_OR))
                return this.parseBinary(node_1.NodeKind.LOGICAL_OR, current_node, precedence, Precedence.LOGICAL_OR);
            if (this.peek(scanner_1.Tokens.MINUS))
                return this.parseBinary(node_1.NodeKind.SUBTRACT, current_node, precedence, Precedence.ADD);
            if (this.peek(scanner_1.Tokens.MULTIPLY))
                return this.parseBinary(node_1.NodeKind.MULTIPLY, current_node, precedence, Precedence.MULTIPLY);
            if (this.peek(scanner_1.Tokens.NOT_EQUAL))
                return this.parseBinary(node_1.NodeKind.NOT_EQUAL, current_node, precedence, Precedence.EQUAL);
            if (this.peek(scanner_1.Tokens.PLUS))
                return this.parseBinary(node_1.NodeKind.ADD, current_node, precedence, Precedence.ADD);
            if (this.peek(scanner_1.Tokens.REMAINDER))
                return this.parseBinary(node_1.NodeKind.REMAINDER, current_node, precedence, Precedence.MULTIPLY);
            if (this.peek(scanner_1.Tokens.SHIFT_LEFT))
                return this.parseBinary(node_1.NodeKind.SHIFT_LEFT, current_node, precedence, Precedence.SHIFT);
            if (this.peek(scanner_1.Tokens.SHIFT_RIGHT))
                return this.parseBinary(node_1.NodeKind.SHIFT_RIGHT, current_node, precedence, Precedence.SHIFT);
            // Unary postfix
            if (this.peek(scanner_1.Tokens.PLUS_PLUS))
                return this.parseUnaryPostfix(node_1.NodeKind.POSTFIX_INCREMENT, current_node, precedence);
            if (this.peek(scanner_1.Tokens.MINUS_MINUS))
                return this.parseUnaryPostfix(node_1.NodeKind.POSTFIX_DECREMENT, current_node, precedence);
            // Cast
            if (this.peek(scanner_1.Tokens.AS) && precedence < Precedence.UNARY_PREFIX) {
                this.advance();
                let type = this.parseType();
                if (type == null) {
                    return null;
                }
                return node_1.createCast(current_node, type).withRange(log_1.spanRanges(current_node.range, type.range)).withInternalRange(token);
            }
            // Call or index
            let isIndex = this.peek(scanner_1.Tokens.LEFT_BRACKET);
            if ((isIndex || this.peek(scanner_1.Tokens.LEFT_PARENTHESIS)) && precedence < Precedence.UNARY_POSTFIX) {
                return this.parseArgumentList(current_node.range, isIndex ? node_1.createIndex(current_node) : node_1.createCall(current_node));
            }
            // Hook
            if (this.peek(scanner_1.Tokens.QUESTION_MARK) && precedence < Precedence.ASSIGN) {
                this.advance();
                let middle = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
                if (middle == null || !this.expect(scanner_1.Tokens.COLON)) {
                    return null;
                }
                let right = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
                if (right == null) {
                    return null;
                }
                return node_1.createHook(current_node, middle, right).withRange(log_1.spanRanges(current_node.range, right.range));
            }
        }
        return current_node;
    }
    parseDelete() {
        let token = this.current;
        assert_1.assert(token.kind == scanner_1.Tokens.DELETE);
        this.advance();
        let value = null;
        if (!this.peek(scanner_1.Tokens.SEMICOLON)) {
            value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
            if (value == null) {
                return null;
            }
        }
        let semicolon = this.current;
        this.expect(scanner_1.Tokens.SEMICOLON);
        return node_1.createDelete(value).withRange(log_1.spanRanges(token.range, semicolon.range));
    }
    parseArgumentList(start, node) {
        let open = this.current.range;
        let isIndex = node.kind == node_1.NodeKind.INDEX;
        let left = isIndex ? scanner_1.Tokens.LEFT_BRACKET : scanner_1.Tokens.LEFT_PARENTHESIS;
        let right = isIndex ? scanner_1.Tokens.RIGHT_BRACKET : scanner_1.Tokens.RIGHT_PARENTHESIS;
        if (!this.expect(left)) {
            return null;
        }
        if (!this.peek(right)) {
            while (true) {
                let value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
                if (value == null) {
                    return null;
                }
                node.appendChild(value);
                if (!this.eat(scanner_1.Tokens.COMMA)) {
                    break;
                }
            }
        }
        let close = this.current.range;
        if (!this.expect(right)) {
            return null;
        }
        return node.withRange(log_1.spanRanges(start, close)).withInternalRange(log_1.spanRanges(open, close));
    }
    parseExpression(precedence, mode) {
        // Prefix
        let node = this.parsePrefix(mode);
        if (node == null) {
            return null;
        }
        assert_1.assert(node.range != null);
        // Infix
        while (true) {
            let result = this.parseInfix(precedence, node, mode);
            if (result == null) {
                return null;
            }
            if (result == node) {
                break;
            }
            node = result;
            assert_1.assert(node.range != null);
        }
        return node;
    }
    parseType() {
        return this.parseExpression(Precedence.UNARY_POSTFIX, ParseKind.TYPE);
    }
    parseIf() {
        let token = this.current;
        assert_1.assert(token.kind == scanner_1.Tokens.IF);
        this.advance();
        if (!this.expect(scanner_1.Tokens.LEFT_PARENTHESIS)) {
            return null;
        }
        let value;
        // Recover from a missing value
        if (this.peek(scanner_1.Tokens.RIGHT_PARENTHESIS)) {
            this.unexpectedToken();
            this.advance();
            value = node_1.createParseError();
        }
        else {
            value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
            if (value == null || !this.expect(scanner_1.Tokens.RIGHT_PARENTHESIS)) {
                return null;
            }
        }
        let trueBranch = this.parseBody();
        if (trueBranch == null) {
            return null;
        }
        let falseBranch = null;
        if (this.eat(scanner_1.Tokens.ELSE)) {
            falseBranch = this.parseBody();
            if (falseBranch == null) {
                return null;
            }
        }
        return node_1.createIf(value, trueBranch, falseBranch).withRange(log_1.spanRanges(token.range, (falseBranch != null ? falseBranch : trueBranch).range));
    }
    parseWhile() {
        let token = this.current;
        assert_1.assert(token.kind == scanner_1.Tokens.WHILE);
        this.advance();
        if (!this.expect(scanner_1.Tokens.LEFT_PARENTHESIS)) {
            return null;
        }
        let value;
        // Recover from a missing value
        if (this.peek(scanner_1.Tokens.RIGHT_PARENTHESIS)) {
            this.unexpectedToken();
            this.advance();
            value = node_1.createParseError();
        }
        else {
            value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
            if (value == null || !this.expect(scanner_1.Tokens.RIGHT_PARENTHESIS)) {
                return null;
            }
        }
        let body = this.parseBody();
        if (body == null) {
            return null;
        }
        return node_1.createWhile(value, body).withRange(log_1.spanRanges(token.range, body.range));
    }
    parseFor() {
        let token = this.current;
        assert_1.assert(token.kind == scanner_1.Tokens.FOR);
        this.advance();
        if (!this.expect(scanner_1.Tokens.LEFT_PARENTHESIS)) {
            return null;
        }
        let initializationStmt = this.parseStatement(StatementMode.NORMAL);
        let terminationStmt = this.parseStatement(StatementMode.NORMAL);
        let updateStmts = new node_1.Node();
        updateStmts.kind = node_1.NodeKind.EXPRESSIONS;
        let updateStmt = this.parseStatement(StatementMode.UNTERMINATED);
        while (updateStmt !== null) {
            updateStmts.appendChild(updateStmt);
            if (!this.eat(scanner_1.Tokens.COMMA)) {
                updateStmt = null;
                break;
            }
            updateStmt = this.parseStatement(StatementMode.UNTERMINATED);
        }
        if (!this.expect(scanner_1.Tokens.RIGHT_PARENTHESIS)) {
            this.unexpectedToken();
            this.advance();
            return node_1.createParseError();
        }
        let body = this.parseBody();
        if (body == null) {
            return null;
        }
        return node_1.createFor(initializationStmt, terminationStmt, updateStmts, body).withRange(log_1.spanRanges(token.range, body.range));
    }
    parseBody() {
        let node = this.parseStatement(StatementMode.NORMAL);
        if (node == null) {
            return null;
        }
        if (node.kind == node_1.NodeKind.BLOCK) {
            return node;
        }
        let block = node_1.createBlock();
        block.appendChild(node);
        return block.withRange(node.range);
    }
    parseBlock() {
        let open = this.current;
        if (!this.expect(scanner_1.Tokens.LEFT_BRACE)) {
            return null;
        }
        let block = node_1.createBlock();
        if (!this.parseStatements(block)) {
            return null;
        }
        let close = this.current;
        if (!this.expect(scanner_1.Tokens.RIGHT_BRACE)) {
            return null;
        }
        return block.withRange(log_1.spanRanges(open.range, close.range));
    }
    // parseObject():Node {
    //
    // }
    parseReturn() {
        let token = this.current;
        assert_1.assert(token.kind == scanner_1.Tokens.RETURN);
        this.advance();
        let value = null;
        if (!this.peek(scanner_1.Tokens.SEMICOLON)) {
            value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
            if (value == null) {
                return null;
            }
        }
        let semicolon = this.current;
        this.expect(scanner_1.Tokens.SEMICOLON);
        return node_1.createReturn(value).withRange(log_1.spanRanges(token.range, semicolon.range));
    }
    parseEmpty() {
        let token = this.current;
        this.advance();
        return node_1.createEmpty().withRange(token.range);
    }
    parseEnum(firstFlag) {
        let token = this.current;
        assert_1.assert(token.kind == scanner_1.Tokens.ENUM);
        this.advance();
        let name = this.current;
        if (!this.expect(scanner_1.Tokens.IDENTIFIER) || !this.expect(scanner_1.Tokens.LEFT_BRACE)) {
            return null;
        }
        let text = name.range.toString();
        let node = node_1.createEnum(text);
        node.firstFlag = firstFlag;
        node.flags = node_1.allFlags(firstFlag);
        while (!this.peek(scanner_1.Tokens.END_OF_FILE) && !this.peek(scanner_1.Tokens.RIGHT_BRACE)) {
            let member = this.current.range;
            let value = null;
            if (!this.expect(scanner_1.Tokens.IDENTIFIER)) {
                return null;
            }
            if (this.eat(scanner_1.Tokens.ASSIGN)) {
                value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
                if (value == null) {
                    return null;
                }
            }
            let variable = node_1.createVariable(member.toString(), node_1.createName(text), value);
            node.appendChild(variable.withRange(value != null ? log_1.spanRanges(member, value.range) : member).withInternalRange(member));
            // Recover from a terminating semicolon
            if (this.peek(scanner_1.Tokens.SEMICOLON)) {
                this.expect(scanner_1.Tokens.COMMA);
                this.advance();
            }
            else if (this.peek(scanner_1.Tokens.IDENTIFIER)) {
                this.expect(scanner_1.Tokens.COMMA);
            }
            else if (!this.eat(scanner_1.Tokens.COMMA)) {
                break;
            }
        }
        let close = this.current;
        if (!this.expect(scanner_1.Tokens.RIGHT_BRACE)) {
            return null;
        }
        return node.withRange(log_1.spanRanges(token.range, close.range)).withInternalRange(name.range);
    }
    parseParameters() {
        let node = node_1.createParameters();
        let open = this.current;
        let close;
        assert_1.assert(open.kind == scanner_1.Tokens.LESS_THAN);
        this.advance();
        while (true) {
            let name = this.current;
            if (!this.expect(scanner_1.Tokens.IDENTIFIER)) {
                close = this.current;
                if (this.eat(scanner_1.Tokens.GREATER_THAN)) {
                    break;
                }
                return null;
            }
            node.appendChild(node_1.createParameter(name.range.toString()).withRange(name.range));
            if (!this.eat(scanner_1.Tokens.COMMA)) {
                close = this.current;
                if (!this.expect(scanner_1.Tokens.GREATER_THAN)) {
                    return null;
                }
                break;
            }
        }
        return node.withRange(log_1.spanRanges(open.range, close.range));
    }
    parseImports() {
        let token = this.current;
        assert_1.assert(token.kind == scanner_1.Tokens.IMPORT);
        this.advance();
        let node = node_1.createImports();
        node.flags = node.flags | scanner_1.Tokens.IMPORT;
        if (this.peek(scanner_1.Tokens.MULTIPLY)) {
            this.log.error(this.current.range, "wildcard '*' import not supported");
            assert_1.assert(this.eat(scanner_1.Tokens.MULTIPLY));
            assert_1.assert(this.eat(scanner_1.Tokens.AS));
            let importName = this.current;
            let range = importName.range;
            let _import = node_1.createImport(importName.range.toString());
            node.appendChild(_import.withRange(range).withInternalRange(importName.range));
            this.advance();
        }
        else {
            if (!this.expect(scanner_1.Tokens.LEFT_BRACE)) {
                return null;
            }
            while (!this.peek(scanner_1.Tokens.END_OF_FILE) && !this.peek(scanner_1.Tokens.RIGHT_BRACE)) {
                let importName = this.current;
                let range = importName.range;
                let _import = node_1.createImport(importName.range.toString());
                node.appendChild(_import.withRange(range).withInternalRange(importName.range));
                this.advance();
                if (!this.eat(scanner_1.Tokens.COMMA)) {
                    break;
                }
            }
            // this.advance();
            // assert(this.expect(TokenKind.RIGHT_BRACE));
            this.expect(scanner_1.Tokens.RIGHT_BRACE);
        }
        this.expect(scanner_1.Tokens.FROM);
        let importFrom = this.current;
        let _from = node_1.createImportFrom(importFrom.range.toString());
        node.appendChild(_from.withRange(importFrom.range).withInternalRange(importFrom.range));
        this.advance();
        let semicolon = this.current;
        this.expect(scanner_1.Tokens.SEMICOLON);
        return node.withRange(log_1.spanRanges(token.range, semicolon.range));
    }
    parseModule(firstFlag) {
        let token = this.current;
        assert_1.assert(token.kind == scanner_1.Tokens.MODULE);
        this.advance();
        let name = this.current;
        if (!this.expect(scanner_1.Tokens.IDENTIFIER)) {
            return null;
        }
        let node = node_1.createModule(name.range.toString());
        node.firstFlag = firstFlag;
        node.flags = node_1.allFlags(firstFlag);
        // Type parameters
        if (this.peek(scanner_1.Tokens.LESS_THAN)) {
            let parameters = this.parseParameters();
            if (parameters == null) {
                return null;
            }
            node.appendChild(parameters);
        }
        if (!this.expect(scanner_1.Tokens.LEFT_BRACE)) {
            return null;
        }
        while (!this.peek(scanner_1.Tokens.END_OF_FILE) && !this.peek(scanner_1.Tokens.RIGHT_BRACE)) {
            let childFlags = this.parseFlags();
            let childName = this.current;
            let oldKind = childName.kind;
            // Support contextual keywords
            if (scanner_1.isKeyword(childName.kind)) {
                childName.kind = scanner_1.Tokens.IDENTIFIER;
                this.advance();
            }
            // The identifier must come first without any keyword
            if (!this.expect(scanner_1.Tokens.IDENTIFIER)) {
                return null;
            }
            let text = childName.range.toString();
            // Support operator definitions
            if (text == "operator" && !this.peek(scanner_1.Tokens.LEFT_PARENTHESIS) && !this.peek(scanner_1.Tokens.IDENTIFIER)) {
                childName.kind = scanner_1.Tokens.OPERATOR;
                this.current = childName;
                if (this.parseFunction(childFlags, node) == null) {
                    return null;
                }
                continue;
            }
            else if (this.peek(scanner_1.Tokens.IDENTIFIER)) {
                let isGet = text == "get";
                let isSet = text == "set";
                // The "get" and "set" flags are contextual
                if (isGet || isSet) {
                    childFlags = node_1.appendFlag(childFlags, isGet ? node_1.NODE_FLAG.GET : node_1.NODE_FLAG.SET, childName.range);
                    // Get the real identifier
                    childName = this.current;
                    this.advance();
                }
                else if (oldKind == scanner_1.Tokens.FUNCTION) {
                    this.log.error(childName.range, "Instance functions don't need the 'function' keyword");
                    // Get the real identifier
                    childName = this.current;
                    this.advance();
                }
                else if (oldKind == scanner_1.Tokens.CONST || oldKind == scanner_1.Tokens.LET || oldKind == scanner_1.Tokens.VAR) {
                    this.log.error(childName.range, `Instance variables don't need the '${childName.range.toString()}' keyword`);
                    // Get the real identifier
                    childName = this.current;
                    this.advance();
                }
            }
            // Function
            if (this.peek(scanner_1.Tokens.LEFT_PARENTHESIS) || this.peek(scanner_1.Tokens.LESS_THAN)) {
                this.current = childName;
                if (this.parseFunction(childFlags, node) == null) {
                    return null;
                }
            }
            else {
                this.current = childName;
                if (this.parseVariables(childFlags, node) == null) {
                    return null;
                }
            }
        }
        let close = this.current;
        if (!this.expect(scanner_1.Tokens.RIGHT_BRACE)) {
            return null;
        }
        return node.withRange(log_1.spanRanges(token.range, close.range)).withInternalRange(name.range);
    }
    parseClass(firstFlag) {
        let token = this.current;
        assert_1.assert(token.kind == scanner_1.Tokens.CLASS);
        this.advance();
        let name = this.current;
        if (!this.expect(scanner_1.Tokens.IDENTIFIER)) {
            return null;
        }
        let node = node_1.createClass(name.range.toString());
        node.firstFlag = firstFlag;
        node.flags = node_1.allFlags(firstFlag);
        // Type parameters
        if (this.peek(scanner_1.Tokens.LESS_THAN)) {
            let parameters = this.parseParameters();
            if (parameters == null) {
                return null;
            }
            node.appendChild(parameters);
        }
        // "extends" clause
        let extendsToken = this.current;
        if (this.eat(scanner_1.Tokens.EXTENDS)) {
            let type;
            // Recover from a missing type
            if (this.peek(scanner_1.Tokens.LEFT_BRACE) || this.peek(scanner_1.Tokens.IMPLEMENTS)) {
                this.unexpectedToken();
                type = node_1.createParseError();
            }
            else {
                type = this.parseType();
                if (type == null) {
                    return null;
                }
            }
            node.appendChild(node_1.createExtends(type).withRange(type.range != null ? log_1.spanRanges(extendsToken.range, type.range) : extendsToken.range));
        }
        // "implements" clause
        let implementsToken = this.current;
        if (this.eat(scanner_1.Tokens.IMPLEMENTS)) {
            let list = node_1.createImplements();
            let type = null;
            while (true) {
                // Recover from a missing type
                if (this.peek(scanner_1.Tokens.LEFT_BRACE)) {
                    this.unexpectedToken();
                    break;
                }
                type = this.parseType();
                if (type == null) {
                    return null;
                }
                list.appendChild(type);
                if (!this.eat(scanner_1.Tokens.COMMA)) {
                    break;
                }
            }
            node.appendChild(list.withRange(type != null ? log_1.spanRanges(implementsToken.range, type.range) : implementsToken.range));
        }
        if (!this.expect(scanner_1.Tokens.LEFT_BRACE)) {
            return null;
        }
        while (!this.peek(scanner_1.Tokens.END_OF_FILE) && !this.peek(scanner_1.Tokens.RIGHT_BRACE)) {
            let childFlags = this.parseFlags();
            let childName = this.current;
            let oldKind = childName.kind;
            // Support contextual keywords
            if (scanner_1.isKeyword(childName.kind)) {
                childName.kind = scanner_1.Tokens.IDENTIFIER;
                this.advance();
            }
            // The identifier must come first without any keyword
            if (!this.expect(scanner_1.Tokens.IDENTIFIER)) {
                return null;
            }
            let text = childName.range.toString();
            // Support operator definitions
            if (text == "operator" && !this.peek(scanner_1.Tokens.LEFT_PARENTHESIS) && !this.peek(scanner_1.Tokens.IDENTIFIER)) {
                childName.kind = scanner_1.Tokens.OPERATOR;
                this.current = childName;
                if (this.parseFunction(childFlags, node) == null) {
                    return null;
                }
                continue;
            }
            else if (this.peek(scanner_1.Tokens.IDENTIFIER)) {
                let isGet = text == "get";
                let isSet = text == "set";
                // The "get" and "set" flags are contextual
                if (isGet || isSet) {
                    childFlags = node_1.appendFlag(childFlags, isGet ? node_1.NODE_FLAG.GET : node_1.NODE_FLAG.SET, childName.range);
                    // Get the real identifier
                    childName = this.current;
                    this.advance();
                }
                else if (oldKind == scanner_1.Tokens.FUNCTION) {
                    this.log.error(childName.range, "Instance functions don't need the 'function' keyword");
                    // Get the real identifier
                    childName = this.current;
                    this.advance();
                }
                else if (oldKind == scanner_1.Tokens.CONST || oldKind == scanner_1.Tokens.LET || oldKind == scanner_1.Tokens.VAR) {
                    this.log.error(childName.range, `Instance variables don't need the '${childName.range.toString()}' keyword`);
                    // Get the real identifier
                    childName = this.current;
                    this.advance();
                }
            }
            // Function
            if (this.peek(scanner_1.Tokens.LEFT_PARENTHESIS) || this.peek(scanner_1.Tokens.LESS_THAN)) {
                this.current = childName;
                if (this.parseFunction(childFlags, node) == null) {
                    return null;
                }
            }
            else {
                this.current = childName;
                if (this.parseVariables(childFlags, node) == null) {
                    return null;
                }
            }
        }
        let close = this.current;
        if (!this.expect(scanner_1.Tokens.RIGHT_BRACE)) {
            return null;
        }
        return node.withRange(log_1.spanRanges(token.range, close.range)).withInternalRange(name.range);
    }
    parseFunction(firstFlag, parent) {
        let isOperator = false;
        let token = this.current;
        let nameRange;
        let name;
        let VOID = node_1.createName("void").withRange(token.range); // wtf api
        let ANY = node_1.createName("any").withRange(token.range); // wtf api
        let INT = node_1.createName("int").withRange(token.range); // wtf api
        let AUTO = node_1.createName("auto").withRange(token.range); // wtf api
        let DEFAULT_RETURN_TYPE = VOID;
        // let DEFAULT_RETURN_TYPE = INT;
        // > CompileError: WasmCompile: Compiling wasm function #4:todo failed: expected 1 elements on the stack for fallthru to @1 @+134
        // Support custom operators
        if (parent != null && this.eat(scanner_1.Tokens.OPERATOR)) {
            let end = this.current;
            if (this.eat(scanner_1.Tokens.LEFT_BRACKET)) {
                if (!this.expect(scanner_1.Tokens.RIGHT_BRACKET)) {
                    return null;
                }
                if (this.peek(scanner_1.Tokens.ASSIGN)) {
                    nameRange = log_1.spanRanges(token.range, this.current.range);
                    name = "[]=";
                    this.advance();
                }
                else {
                    nameRange = log_1.spanRanges(token.range, end.range);
                    name = "[]";
                }
                isOperator = true;
            }
            else if (this.eat(scanner_1.Tokens.BITWISE_AND) ||
                this.eat(scanner_1.Tokens.BITWISE_OR) ||
                this.eat(scanner_1.Tokens.BITWISE_XOR) ||
                this.eat(scanner_1.Tokens.COMPLEMENT) ||
                this.eat(scanner_1.Tokens.DIVIDE) ||
                this.eat(scanner_1.Tokens.EQUAL) ||
                this.eat(scanner_1.Tokens.EXPONENT) ||
                this.eat(scanner_1.Tokens.LESS_THAN) ||
                this.eat(scanner_1.Tokens.GREATER_THAN) ||
                this.eat(scanner_1.Tokens.MINUS) ||
                this.eat(scanner_1.Tokens.MINUS_MINUS) ||
                this.eat(scanner_1.Tokens.MULTIPLY) ||
                this.eat(scanner_1.Tokens.PLUS) ||
                this.eat(scanner_1.Tokens.PLUS_PLUS) ||
                this.eat(scanner_1.Tokens.REMAINDER) ||
                this.eat(scanner_1.Tokens.SHIFT_LEFT) ||
                this.eat(scanner_1.Tokens.SHIFT_RIGHT)) {
                nameRange = end.range;
                name = nameRange.toString();
                isOperator = true;
            }
            else if (this.eat(scanner_1.Tokens.ASSIGN) ||
                this.eat(scanner_1.Tokens.GREATER_THAN_EQUAL) ||
                this.eat(scanner_1.Tokens.LESS_THAN_EQUAL) ||
                this.eat(scanner_1.Tokens.LOGICAL_AND) ||
                this.eat(scanner_1.Tokens.LOGICAL_OR) ||
                this.eat(scanner_1.Tokens.NOT) ||
                this.eat(scanner_1.Tokens.NOT_EQUAL)) {
                nameRange = end.range;
                name = nameRange.toString();
                // Recover from an invalid operator name
                this.log.error(nameRange, `The operator '${name}' cannot be implemented ${end.kind == scanner_1.Tokens.NOT_EQUAL ? "(it is automatically derived from '==')" :
                    end.kind == scanner_1.Tokens.LESS_THAN_EQUAL ? "(it is automatically derived from '>')" :
                        end.kind == scanner_1.Tokens.GREATER_THAN_EQUAL ? "(it is automatically derived from '<')" :
                            ""}`);
            }
            else {
                this.unexpectedToken();
            }
        }
        else {
            // Functions inside class declarations don't use "function"
            if (parent == null) {
                assert_1.assert(token.kind == scanner_1.Tokens.FUNCTION);
                this.advance();
            }
            // Remember where the name is for the symbol later
            nameRange = this.current.range;
            if (!this.expect(scanner_1.Tokens.IDENTIFIER)) {
                return null;
            }
            name = nameRange.toString();
        }
        /////////////////////////////////////////
        let node = node_1.createFunction(name);
        /////////////////////////////////////////
        if (name == "main") {
            let flag = new node_1.NodeFlag();
            flag.flag = node_1.NODE_FLAG.EXPORT;
            flag.next = firstFlag;
            firstFlag = flag;
        }
        node.firstFlag = firstFlag;
        node.flags = node_1.allFlags(firstFlag);
        if (isOperator) {
            node.flags = node.flags | node_1.NODE_FLAG.OPERATOR;
        }
        // Type parameters
        if (this.peek(scanner_1.Tokens.LESS_THAN)) {
            let parameters = this.parseParameters();
            if (parameters == null) {
                return null;
            }
            node.appendChild(parameters);
        }
        if (!this.expect(scanner_1.Tokens.LEFT_PARENTHESIS)) {
            return null;
        }
        if (!this.peek(scanner_1.Tokens.RIGHT_PARENTHESIS)) {
            while (true) {
                let firstArgumentFlag = this.parseFlags();
                let argument = this.current;
                if (!this.expect(scanner_1.Tokens.IDENTIFIER)) {
                    return null;
                }
                let type;
                let value = null;
                let range = argument.range;
                if (this.expect(scanner_1.Tokens.COLON)) {
                    type = this.parseType();
                    if (this.peek(scanner_1.Tokens.LESS_THAN)) {
                        let parameters = this.parseParameters();
                        if (parameters == null) {
                            return null;
                        }
                        type.appendChild(parameters);
                    }
                    if (type != null) {
                        range = log_1.spanRanges(range, type.range);
                    }
                    else if (this.peek(scanner_1.Tokens.COMMA) || this.peek(scanner_1.Tokens.RIGHT_PARENTHESIS)) {
                        type = node_1.createParseError();
                    }
                    else {
                        return null;
                    }
                }
                else if (this.peek(scanner_1.Tokens.COMMA) || this.peek(scanner_1.Tokens.RIGHT_PARENTHESIS)) {
                    type = node_1.createParseError();
                }
                let firstType = type;
                //Type alias
                while (this.eat(scanner_1.Tokens.BITWISE_OR)) {
                    let aliasType = this.parseType();
                    if (this.peek(scanner_1.Tokens.LESS_THAN)) {
                        let parameters = this.parseParameters();
                        if (parameters == null) {
                            return null;
                        }
                        aliasType.appendChild(parameters);
                    }
                    if (aliasType != null) {
                        range = log_1.spanRanges(range, aliasType.range);
                    }
                    else if (this.peek(scanner_1.Tokens.COMMA) || this.peek(scanner_1.Tokens.RIGHT_PARENTHESIS)) {
                        aliasType = node_1.createParseError();
                    }
                    else {
                        return null;
                    }
                    type.appendChild(aliasType);
                    type = aliasType;
                }
                if (this.eat(scanner_1.Tokens.ASSIGN)) {
                    value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
                }
                let variable = node_1.createVariable(argument.range.toString(), firstType, value);
                variable.firstFlag = firstArgumentFlag;
                variable.flags = node_1.allFlags(firstArgumentFlag);
                node.appendChild(variable.withRange(range).withInternalRange(argument.range));
                if (!this.eat(scanner_1.Tokens.COMMA)) {
                    break;
                }
            }
        }
        if (!this.expect(scanner_1.Tokens.RIGHT_PARENTHESIS)) {
            return null;
        }
        let returnType;
        if (node.isAnyfunc()) {
            returnType = node_1.createAny();
        }
        else {
            if (node.stringValue == "constructor") {
                returnType = new node_1.Node();
                returnType.kind = node_1.NodeKind.NAME;
                returnType.stringValue = parent.stringValue;
            }
            else if (this.expect(scanner_1.Tokens.COLON)) {
                if (this.peek(scanner_1.Tokens.LEFT_BRACE))
                    returnType = DEFAULT_RETURN_TYPE;
                else
                    returnType = this.parseType();
                if (this.peek(scanner_1.Tokens.LESS_THAN)) {
                    let parameters = this.parseParameters();
                    if (parameters == null) {
                        return null;
                    }
                    returnType.appendChild(parameters);
                }
                if (returnType == null) {
                    // Recover from a missing return type
                    if (this.peek(scanner_1.Tokens.SEMICOLON) || this.peek(scanner_1.Tokens.LEFT_BRACE)) {
                        returnType = DEFAULT_RETURN_TYPE; //createParseError();
                    }
                    else {
                        return null;
                    }
                }
                let firstType = returnType;
                //Type alias
                while (this.eat(scanner_1.Tokens.BITWISE_OR)) {
                    let aliasType = this.parseType();
                    if (this.peek(scanner_1.Tokens.LESS_THAN)) {
                        let parameters = this.parseParameters();
                        if (parameters == null) {
                            return null;
                        }
                        aliasType.appendChild(parameters);
                    }
                    if (aliasType == null) {
                        // Recover from a missing return type
                        if (this.peek(scanner_1.Tokens.SEMICOLON) || this.peek(scanner_1.Tokens.LEFT_BRACE)) {
                            aliasType = node_1.createParseError();
                        }
                        else {
                            return null;
                        }
                    }
                    firstType.appendChild(aliasType);
                    firstType = aliasType;
                }
            }
            else if (this.peek(scanner_1.Tokens.SEMICOLON) || this.peek(scanner_1.Tokens.LEFT_BRACE)) {
                returnType = node_1.createParseError();
            }
            else {
                return null;
            }
        }
        node.appendChild(returnType);
        let block = null;
        // Is this an import?
        let semicolon = this.current;
        if (this.eat(scanner_1.Tokens.SEMICOLON)) {
            block = node_1.createEmpty().withRange(semicolon.range);
        }
        else {
            block = this.parseBlock();
            if (block == null) {
                return null;
            }
        }
        // Add this to the enclosing class
        if (parent != null) {
            parent.appendChild(node);
        }
        node.appendChild(block);
        return node.withRange(log_1.spanRanges(token.range, block.range)).withInternalRange(nameRange);
    }
    parseVariables(firstFlag = null, parent = null) {
        let token = this.current;
        // Variables inside class declarations don't use "var"
        if (parent == null) {
            assert_1.assert(token.kind == scanner_1.Tokens.CONST || token.kind == scanner_1.Tokens.LET || token.kind == scanner_1.Tokens.VAR);
            this.advance();
        }
        let node = token.kind == scanner_1.Tokens.CONST ? node_1.createConstants() : node_1.createVariables();
        node.firstFlag = firstFlag;
        while (true) {
            let name = this.current;
            if (!this.expect(scanner_1.Tokens.IDENTIFIER)) {
                return null;
            }
            let type = null;
            if (this.eat(scanner_1.Tokens.COLON)) {
                type = this.parseType();
                if (this.peek(scanner_1.Tokens.LESS_THAN)) {
                    let parameters = this.parseParameters();
                    if (parameters == null) {
                        return null;
                    }
                    type.appendChild(parameters);
                }
                if (type == null) {
                    return null;
                }
            }
            let value = null;
            if (this.eat(scanner_1.Tokens.ASSIGN)) {
                value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
                if (value == null) {
                    return null;
                }
                // TODO: Implement constructors
                if (parent != null) {
                    //this.log.error(value.range, "Inline initialization of instance variables is not supported yet");
                }
            }
            let range = value != null ? log_1.spanRanges(name.range, value.range) :
                type != null ? log_1.spanRanges(name.range, type.range) :
                    name.range;
            let variable = node_1.createVariable(name.range.toString(), type, value);
            variable.firstFlag = firstFlag;
            variable.flags = node_1.allFlags(firstFlag);
            (parent != null ? parent : node).appendChild(variable.withRange(range).withInternalRange(name.range));
            if (!this.eat(scanner_1.Tokens.COMMA)) {
                break;
            }
        }
        let semicolon = this.current;
        this.expect(scanner_1.Tokens.SEMICOLON);
        return node.withRange(log_1.spanRanges(token.range, semicolon.range));
    }
    parseLoopJump(kind) {
        let token = this.current;
        this.advance();
        this.expect(scanner_1.Tokens.SEMICOLON);
        let node = new node_1.Node();
        node.kind = kind;
        return node.withRange(token.range);
    }
    parseFlags() {
        let firstFlag = null;
        let lastFlag = null;
        while (true) {
            let token = this.current;
            let flag;
            if (this.eat(scanner_1.Tokens.DECLARE))
                flag = node_1.NODE_FLAG.DECLARE;
            else if (this.eat(scanner_1.Tokens.EXPORT))
                flag = node_1.NODE_FLAG.EXPORT;
            else if (this.eat(scanner_1.Tokens.PRIVATE))
                flag = node_1.NODE_FLAG.PRIVATE;
            else if (this.eat(scanner_1.Tokens.PROTECTED))
                flag = node_1.NODE_FLAG.PROTECTED;
            else if (this.eat(scanner_1.Tokens.PUBLIC))
                flag = node_1.NODE_FLAG.PUBLIC;
            else if (this.eat(scanner_1.Tokens.STATIC))
                flag = node_1.NODE_FLAG.STATIC;
            else if (this.eat(scanner_1.Tokens.ANYFUNC))
                flag = node_1.NODE_FLAG.ANYFUNC;
            else if (this.eat(scanner_1.Tokens.UNSAFE))
                flag = node_1.NODE_FLAG.UNSAFE;
            else if (this.eat(scanner_1.Tokens.JAVASCRIPT))
                flag = node_1.NODE_FLAG.JAVASCRIPT;
            else if (this.eat(scanner_1.Tokens.START))
                flag = node_1.NODE_FLAG.START;
            else if (this.eat(scanner_1.Tokens.VIRTUAL))
                flag = node_1.NODE_FLAG.VIRTUAL;
            else
                return firstFlag;
            let link = new node_1.NodeFlag();
            link.flag = flag;
            link.range = token.range;
            if (firstFlag == null)
                firstFlag = link;
            else
                lastFlag.next = link;
            lastFlag = link;
        }
    }
    parseUnsafe() {
        let token = this.current;
        this.advance();
        let node = this.parseBlock();
        if (node == null) {
            return null;
        }
        node.flags = node.flags | node_1.NODE_FLAG.UNSAFE;
        return node.withRange(log_1.spanRanges(token.range, node.range));
    }
    parseJavaScript() {
        let token = this.current;
        this.advance();
        let node = this.parseBlock();
        if (node == null) {
            return null;
        }
        node.flags = node.flags | node_1.NODE_FLAG.JAVASCRIPT;
        return node.withRange(log_1.spanRanges(token.range, node.range));
    }
    parseStart() {
        let token = this.current;
        this.advance();
        let node = this.parseBlock();
        if (node == null) {
            return null;
        }
        node.flags = node.flags | node_1.NODE_FLAG.START;
        return node.withRange(log_1.spanRanges(token.range, node.range));
    }
    parseVirtual(firstFlag) {
        let token = this.current;
        this.advance();
        let node = this.parseFunction(firstFlag, null);
        if (node == null) {
            return null;
        }
        node.flags = node.flags | node_1.NODE_FLAG.VIRTUAL;
        return node.withRange(log_1.spanRanges(token.range, node.range));
    }
    parseStatement(mode) {
        let firstFlag = mode == StatementMode.FILE ? this.parseFlags() : null;
        // if (this.peek(TokenKind.UNSAFE) && firstFlag == null) return this.parseUnsafe(); //disabled for now
        if (this.peek(scanner_1.Tokens.IMPORT) && firstFlag == null)
            return this.parseImports(); // This should handle before parsing
        if (this.peek(scanner_1.Tokens.JAVASCRIPT) && firstFlag == null)
            return this.parseJavaScript();
        if (this.peek(scanner_1.Tokens.START) && firstFlag == null)
            return this.parseStart();
        if (this.peek(scanner_1.Tokens.CONST) || this.peek(scanner_1.Tokens.LET) || this.peek(scanner_1.Tokens.VAR))
            return this.parseVariables(firstFlag, null);
        if (this.peek(scanner_1.Tokens.FUNCTION))
            return this.parseFunction(firstFlag, null);
        if (this.peek(scanner_1.Tokens.VIRTUAL))
            return this.parseVirtual(firstFlag);
        if (this.peek(scanner_1.Tokens.MODULE))
            return this.parseModule(firstFlag);
        if (this.peek(scanner_1.Tokens.CLASS))
            return this.parseClass(firstFlag);
        if (this.peek(scanner_1.Tokens.ENUM))
            return this.parseEnum(firstFlag);
        // Definition modifiers need to be attached to a definition
        if (firstFlag != null) {
            this.unexpectedToken();
            return null;
        }
        // if (this.peek(Tokens.DO)) return this.parseBlock();
        if (this.peek(scanner_1.Tokens.LEFT_BRACE))
            return this.parseBlock();
        if (this.peek(scanner_1.Tokens.BREAK))
            return this.parseLoopJump(node_1.NodeKind.BREAK);
        if (this.peek(scanner_1.Tokens.CONTINUE))
            return this.parseLoopJump(node_1.NodeKind.CONTINUE);
        if (this.peek(scanner_1.Tokens.IF))
            return this.parseIf();
        if (this.peek(scanner_1.Tokens.WHILE))
            return this.parseWhile();
        if (this.peek(scanner_1.Tokens.FOR))
            return this.parseFor();
        if (this.peek(scanner_1.Tokens.DELETE))
            return this.parseDelete();
        if (this.peek(scanner_1.Tokens.RETURN))
            return this.parseReturn();
        if (this.peek(scanner_1.Tokens.SEMICOLON))
            return this.parseEmpty();
        // Parse an expression statement
        let value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
        if (value == null) {
            return null;
        }
        let semicolon = this.current;
        if (mode !== StatementMode.UNTERMINATED) {
            this.expect(scanner_1.Tokens.SEMICOLON);
        }
        return node_1.createExpression(value).withRange(log_1.spanRanges(value.range, semicolon.range));
    }
    parseStatements(parent, mode = StatementMode.NORMAL) {
        while (!this.peek(scanner_1.Tokens.END_OF_FILE) && !this.peek(scanner_1.Tokens.RIGHT_BRACE)) {
            let child = this.parseStatement(parent.kind == node_1.NodeKind.FILE ? StatementMode.FILE : mode);
            if (child == null) {
                return false;
            }
            if (child.kind === node_1.NodeKind.RETURN) {
                parent.returnNode = child;
            }
            parent.appendChild(child);
        }
        return true;
    }
    parseInt(range, node) {
        let source = range.source;
        let contents = source.contents;
        node.intValue = parseInt(contents.substring(range.start, range.end));
        node.flags = node_1.NODE_FLAG.POSITIVE;
        return true;
    }
    parseFloat(range, node) {
        let source = range.source;
        let contents = source.contents;
        node.floatValue = parseFloat(contents.substring(range.start, range.end));
        node.flags = node_1.NODE_FLAG.POSITIVE;
        return true;
    }
    parseDouble(range, node) {
        let source = range.source;
        let contents = source.contents;
        node.doubleValue = parseFloat(contents.substring(range.start, range.end));
        node.flags = node_1.NODE_FLAG.POSITIVE;
        return true;
    }
}
function parse(firstToken, log) {
    let context = new ParserContext();
    context.current = firstToken;
    context.log = log;
    let file = new node_1.Node();
    file.kind = node_1.NodeKind.FILE;
    if (!context.parseStatements(file)) {
        return null;
    }
    return file;
}
exports.parse = parse;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const compile_target_1 = __webpack_require__(9);
const filesystem_1 = __webpack_require__(15);
// library files
const math = __webpack_require__(41);
const types = __webpack_require__(42);
const array = __webpack_require__(39);
const jstypes = __webpack_require__(44);
const runtime = __webpack_require__(43);
const wrapper = __webpack_require__(45);
const wasmWrapper = __webpack_require__(48);
const malloc = __webpack_require__(40);
const dlmallocBin = __webpack_require__(37);
const builtins = __webpack_require__(46);
const initializer = __webpack_require__(47);
filesystem_1.FileSystem.writeBinaryFile("/library/dlmalloc.wasm", dlmallocBin, true);
class Library {
    static get binary() {
        return dlmallocBin;
    }
    static get(target) {
        let lib;
        switch (target) {
            case compile_target_1.CompileTarget.JAVASCRIPT:
                lib = jstypes + "\n";
                break;
            case compile_target_1.CompileTarget.WEBASSEMBLY:
                lib = [
                    types,
                    initializer,
                    builtins,
                    math,
                    malloc,
                    array
                ].join('\n');
                break;
        }
        return lib;
    }
    static getRuntime(target) {
        switch (target) {
            case compile_target_1.CompileTarget.JAVASCRIPT:
                return runtime + "\n";
            default:
                return "";
        }
    }
    static getWrapper(target) {
        switch (target) {
            case compile_target_1.CompileTarget.JAVASCRIPT:
                return wrapper + "\n";
            case compile_target_1.CompileTarget.WEBASSEMBLY:
                return wasmWrapper + "\n";
            default:
                return "";
        }
    }
}
exports.Library = Library;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by n.vinayakan on 02.06.17.
 */
var Bitness;
(function (Bitness) {
    Bitness[Bitness["x32"] = 0] = "x32";
    Bitness[Bitness["x64"] = 1] = "x64";
})(Bitness = exports.Bitness || (exports.Bitness = {}));


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by 01 on 2017-06-19.
 */
class WasmExport {
    constructor(name, kind, index, as = name) {
        this.name = name;
        this.kind = kind;
        this.index = index;
        this.as = as;
    }
}
exports.WasmExport = WasmExport;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by n.vinayakan on 02.06.17.
 */
class WasmGlobal {
    constructor(type, mutable, name, symbol) {
        this.type = type;
        this.mutable = mutable;
        this.name = name;
        this.symbol = symbol;
    }
}
exports.WasmGlobal = WasmGlobal;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by n.vinayakan on 02.06.17.
 */
class WasmImport {
    constructor(namespace, name, type, signatureIndex, signature) {
        this.namespace = namespace;
        this.name = name;
        this.type = type;
        this.signatureIndex = signatureIndex;
        this.signature = signature;
    }
}
exports.WasmImport = WasmImport;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_type_1 = __webpack_require__(6);
const assert_1 = __webpack_require__(3);
/**
 * Created by n.vinayakan on 02.06.17.
 */
class WasmSignature {
    constructor() {
        this.argumentTypes = [];
        this.returnType = wasm_type_1.WasmType.VOID; // Default return type
    }
}
exports.WasmSignature = WasmSignature;
function wasmAreSignaturesEqual(a, b) {
    assert_1.assert(a.returnType != null);
    assert_1.assert(b.returnType != null);
    let x = a.argumentTypes;
    let y = b.argumentTypes;
    if (x.length !== y.length) {
        return false;
    }
    let equal = true;
    x.some((x_id, index) => {
        if (x_id !== y[index]) {
            equal = false;
            return true;
        }
        return false;
    });
    if (a.returnType != b.returnType) {
        return false;
    }
    return equal;
}
exports.wasmAreSignaturesEqual = wasmAreSignaturesEqual;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(8);
/**
 * Created by n.vinayakan on 02.06.17.
 */
function log(array, offset = 0, value, msg = "") {
    array.log += (value != null ? `${utils_1.toHex(offset + array.position)}: ${utils_1.toHex(value, 2)}                    ; ` : "") + (msg != null ? `${msg}\n` : "\n");
}
exports.log = log;
function logData(array, offset = 0, value, addPosition = true) {
    array.log += (addPosition ? `${utils_1.toHex(offset + array.position)}: ${utils_1.toHex(value, 2)}` : ` ${utils_1.toHex(value, 2)}`);
}
exports.logData = logData;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by n.vinayakan on 03.06.17.
 */
class WasmRuntimeProperty {
    constructor(type, name) {
        this.type = type;
        this.name = name;
    }
}
exports.WasmRuntimeProperty = WasmRuntimeProperty;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bytearray_1 = __webpack_require__(0);
const wasm_section_1 = __webpack_require__(1);
const signature_section_1 = __webpack_require__(73);
const import_section_1 = __webpack_require__(70);
const function_section_1 = __webpack_require__(68);
const table_section_1 = __webpack_require__(75);
const memory_section_1 = __webpack_require__(71);
const global_section_1 = __webpack_require__(69);
const export_section_1 = __webpack_require__(67);
const start_section_1 = __webpack_require__(74);
const element_section_1 = __webpack_require__(66);
const code_section_1 = __webpack_require__(64);
const data_section_1 = __webpack_require__(65);
const name_section_1 = __webpack_require__(72);
const terminal_1 = __webpack_require__(2);
/**
 * Created by 01 on 2017-06-19.
 */
class WasmParser {
    constructor() {
    }
}
exports.WasmParser = WasmParser;
function createSection(id, name) {
    let sectionBinary = null;
    switch (id) {
        case wasm_section_1.WasmSection.Signature:
            sectionBinary = new signature_section_1.SignatureSection(new bytearray_1.ByteArray());
            break;
        case wasm_section_1.WasmSection.Import:
            sectionBinary = new import_section_1.ImportSection(new bytearray_1.ByteArray());
            break;
        case wasm_section_1.WasmSection.Function:
            sectionBinary = new function_section_1.FunctionSection(new bytearray_1.ByteArray());
            break;
        case wasm_section_1.WasmSection.Table:
            sectionBinary = new table_section_1.TableSection(new bytearray_1.ByteArray());
            break;
        case wasm_section_1.WasmSection.Memory:
            sectionBinary = new memory_section_1.MemorySection(new bytearray_1.ByteArray());
            break;
        case wasm_section_1.WasmSection.Global:
            sectionBinary = new global_section_1.GlobalSection(new bytearray_1.ByteArray());
            break;
        case wasm_section_1.WasmSection.Export:
            sectionBinary = new export_section_1.ExportSection(new bytearray_1.ByteArray());
            break;
        case wasm_section_1.WasmSection.Start:
            sectionBinary = new start_section_1.StartSection(new bytearray_1.ByteArray());
            break;
        case wasm_section_1.WasmSection.Element:
            sectionBinary = new element_section_1.ElementSection(new bytearray_1.ByteArray());
            break;
        case wasm_section_1.WasmSection.Code:
            sectionBinary = new code_section_1.CodeSection(new bytearray_1.ByteArray());
            break;
        case wasm_section_1.WasmSection.Data:
            sectionBinary = new data_section_1.DataSection(new bytearray_1.ByteArray());
            break;
        case wasm_section_1.WasmSection.Custom:
            if (name !== undefined) {
                if (name === "name") {
                    sectionBinary = new name_section_1.NameSection(name, new bytearray_1.ByteArray());
                }
            }
            else {
                let error = "Cannot create custom section without name";
                terminal_1.Terminal.error(error);
                throw error;
            }
            break;
    }
    if (sectionBinary === null) {
        let error = `Unknown section id:${id} ${name !== undefined ? ", " + name : ""}`;
        terminal_1.Terminal.error(error);
        throw error;
    }
    return sectionBinary;
}
exports.createSection = createSection;
function parseSection(data) {
    let id = data.readS32LEB();
    let name_len = 0;
    let name = null;
    if (this.id == 0) {
        name_len = data.readU32LEB();
        name = data.readUTFBytes(name_len);
    }
    let payload_len = data.readU32LEB();
    let payload = data.readBytes(new bytearray_1.ByteArray(), 0, payload_len);
    let sectionBinary;
    switch (id) {
        case wasm_section_1.WasmSection.Signature:
            sectionBinary = new signature_section_1.SignatureSection(payload);
            WasmParser.currentSignatures = sectionBinary.signatures;
            break;
        case wasm_section_1.WasmSection.Import:
            sectionBinary = new import_section_1.ImportSection(payload);
            break;
        case wasm_section_1.WasmSection.Function:
            sectionBinary = new function_section_1.FunctionSection(payload);
            WasmParser.currentFunctions = sectionBinary.functions;
            break;
        case wasm_section_1.WasmSection.Table:
            sectionBinary = new table_section_1.TableSection(payload);
            break;
        case wasm_section_1.WasmSection.Memory:
            sectionBinary = new memory_section_1.MemorySection(payload);
            break;
        case wasm_section_1.WasmSection.Global:
            sectionBinary = new global_section_1.GlobalSection(payload);
            break;
        case wasm_section_1.WasmSection.Export:
            sectionBinary = new export_section_1.ExportSection(payload);
            break;
        case wasm_section_1.WasmSection.Start:
            sectionBinary = new start_section_1.StartSection(payload);
            break;
        case wasm_section_1.WasmSection.Element:
            sectionBinary = new element_section_1.ElementSection(payload);
            break;
        case wasm_section_1.WasmSection.Code:
            sectionBinary = new code_section_1.CodeSection(payload);
            sectionBinary.functions = WasmParser.currentFunctions;
            break;
        case wasm_section_1.WasmSection.Data:
            sectionBinary = new data_section_1.DataSection(payload);
            break;
        case wasm_section_1.WasmSection.Custom:
            if (name === "name") {
                sectionBinary = new name_section_1.NameSection(name, payload);
                sectionBinary.name_len = name_len;
            }
            break;
    }
    if (sectionBinary !== undefined) {
        sectionBinary.read();
        return sectionBinary;
    }
    else {
        return null;
    }
}
exports.parseSection = parseSection;


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="declarations.d.ts" />
const log_1 = __webpack_require__(5);
const compiler_1 = __webpack_require__(12);
const compile_target_1 = __webpack_require__(9);
const terminal_1 = __webpack_require__(2);
const filesystem_1 = __webpack_require__(15);
const compiler_options_1 = __webpack_require__(50);
const color_1 = __webpack_require__(18);
const library_1 = __webpack_require__(26);
const fs_1 = __webpack_require__(35);
/**
 * TurboScript compiler main entry
 */
class CommandLineArgument {
}
exports.CommandLineArgument = CommandLineArgument;
let firstArgument;
let lastArgument;
function main_addArgument(text) {
    let argument = new CommandLineArgument();
    argument.text = text;
    if (firstArgument == null)
        firstArgument = argument;
    else
        lastArgument.next = argument;
    lastArgument = argument;
}
exports.main_addArgument = main_addArgument;
function main_reset() {
    firstArgument = null;
    lastArgument = null;
}
exports.main_reset = main_reset;
function printUsage() {
    terminal_1.Terminal.write(`
Usage: tc [FLAGS] [INPUTS]

  --help           Print this message.
  --out [PATH]     Emit code to PATH (the target format is the file extension).
    --wasm         Explicit webassembly output 
  --define [NAME]  Define the flag NAME in all input files.

Examples:

  tc src/*.tbs --out main.wasm
`);
}
exports.printUsage = printUsage;
async function runWasm(file) {
    console.log("runWasm", file);
    let imports = {
        console: { log: (x) => console.log(x) }
    };
    let _wasm = fs_1.readFileSync(file);
    let module = await WebAssembly.compile(_wasm);
    let instance = await WebAssembly.instantiate(module, imports);
    if (instance.exports.main)
        console.log(instance.exports.main());
    return '...';
}
// public
// async function main_entry(): Promise<int32> {
function main_entry() {
    let target = compile_target_1.CompileTarget.NONE;
    let argument = firstArgument;
    let inputCount = 0;
    let output;
    let outputName;
    let outputPath;
    let bundle = false;
    // Print usage by default
    if (firstArgument == null) {
        printUsage();
        return 1;
    }
    let execute = false; // compile only
    // Initial pass over the argument list
    while (argument != null) {
        let text = argument.text;
        if (text.startsWith("-")) {
            if (text == "-h" || text == "-help" || text == "--help" || text == "/?") {
                printUsage();
                return 0;
            }
            else if (text == "--run") {
                execute = true;
            }
            else if (text == "--cpp") {
                target = compile_target_1.CompileTarget.CPP;
            }
            else if (text == "--js") {
                target = compile_target_1.CompileTarget.JAVASCRIPT;
            }
            else if (text == "--wasm") {
                target = compile_target_1.CompileTarget.WEBASSEMBLY;
            }
            else if (text == "--define" && argument.next != null) {
                argument = argument.next;
            }
            else if (text == "--out" && argument.next != null) {
                argument = argument.next;
                output = argument.text;
            }
            else if (text == "--bundle" || text == "-b") {
                argument = argument.next;
                bundle = true;
            }
            else {
                terminal_1.Terminal.error("Invalid flag: " + text);
                return 1;
            }
        }
        else {
            inputCount = inputCount + 1;
        }
        argument = argument.next;
    }
    // Must have inputs
    if (inputCount == 0) {
        terminal_1.Terminal.error("No input files");
        return 1;
    }
    // Must have an output
    if (output == null) {
        // Terminal.error("Missing an output file (use the --out flag)");
        // return 1;
        output = "out.wasm";
    }
    console.log("compile", output);
    outputPath = filesystem_1.FileSystem.getBasePath(output);
    outputName = filesystem_1.FileSystem.getFileName(output);
    // Automatically set the target based on the file extension
    if (target == compile_target_1.CompileTarget.NONE) {
        if (output.endsWith(".wasm"))
            target = compile_target_1.CompileTarget.WEBASSEMBLY;
        else {
            terminal_1.Terminal.error("Missing a target (use either --js or --wasm)");
            return 1;
        }
    }
    // Start the compilation
    let compiler = new compiler_1.Compiler();
    compiler.initialize(target, output);
    // Second pass over the argument list
    argument = firstArgument;
    while (argument != null) {
        let text = argument.text;
        if (text == "--define") {
            argument = argument.next;
            compiler.preprocessor.define(argument.text, true);
        }
        else if (text == "--out") {
            argument = argument.next;
        }
        else if (!text.startsWith("-")) {
            let contents = filesystem_1.FileSystem.readTextFile(text);
            if (contents == null) {
                terminal_1.Terminal.error("Cannot read from " + text);
                return 1;
            }
            compiler.addInput(text, contents);
        }
        argument = argument.next;
    }
    // Finish the compilation
    // await
    compiler.finish();
    log_1.writeLogToTerminal(compiler.log);
    // Only emit the output if the compilation succeeded
    if (!compiler.log.hasErrors()) {
        try {
            switch (target) {
                case compile_target_1.CompileTarget.CPP:
                    filesystem_1.FileSystem.writeTextFile(output, compiler.outputCPP);
                    filesystem_1.FileSystem.writeTextFile(compiler_1.replaceFileExtension(output, ".h"), compiler.outputH);
                    break;
                case compile_target_1.CompileTarget.JAVASCRIPT:
                    filesystem_1.FileSystem.writeTextFile(output, compiler.outputJS);
                    break;
                case compile_target_1.CompileTarget.WEBASSEMBLY:
                    if (compiler.outputWASM !== undefined) {
                        filesystem_1.FileSystem.writeBinaryFile(outputPath + "/library.wasm", library_1.Library.binary);
                        filesystem_1.FileSystem.writeBinaryFile(output, compiler.outputWASM);
                        filesystem_1.FileSystem.writeTextFile(compiler_1.replaceFileExtension(output, ".wast"), compiler.outputWAST);
                        filesystem_1.FileSystem.writeTextFile(output + ".log", compiler.outputWASM.log);
                        if (bundle) {
                            let wrapper = library_1.Library.getWrapper(compile_target_1.CompileTarget.WEBASSEMBLY).replace("__TURBO_WASM__", `"${outputName}"`);
                            filesystem_1.FileSystem.writeTextFile(compiler_1.replaceFileExtension(output, ".bootstrap.js"), wrapper);
                        }
                    }
                    else {
                        terminal_1.Terminal.error("Compile error!");
                        return 1;
                    }
                    break;
            }
            if (1 > 0 || execute)
                runWasm(output);
            return 0;
        }
        catch (e) {
            terminal_1.Terminal.error("Cannot write to " + output);
            console.error(e);
            return 1;
        }
        // if (target == CompileTarget.CPP && FileSystem.writeTextFile(output, compiler.outputCPP) &&
        //     FileSystem.writeTextFile(replaceFileExtension(output, ".h"), compiler.outputH) ||
        //     target == CompileTarget.JAVASCRIPT && FileSystem.writeTextFile(output, compiler.outputJS) ||
        //     target == CompileTarget.WEBASSEMBLY && FileSystem.writeBinaryFile(output, compiler.outputWASM) &&
        //     FileSystem.writeTextFile(replaceFileExtension(output, ".wast"), compiler.outputWAST) &&
        //     FileSystem.writeTextFile(output + ".log", compiler.outputWASM.log)) {
        //     Terminal.write("\n");
        //     return 0;
        // }
        //
        // Terminal.error("Cannot write to " + output);
    }
    else
        console.log("ERRORS");
    terminal_1.Terminal.write("\n");
    return 1;
}
exports.main = {
    addArgument: main_addArgument,
    reset: main_reset,
    entry: main_entry
};
function compileString(source, options = compiler_options_1.defaultCompilerOptions) {
    terminal_1.Terminal.silent = options.silent;
    let input = "/virtual/inline.tbs";
    let output = "/virtual/inline.wasm";
    filesystem_1.FileSystem.writeTextFile(input, source, true);
    let compiler = new compiler_1.Compiler();
    compiler.initialize(options.target, output);
    compiler.addInput(input, source);
    compiler.finish();
    terminal_1.Terminal.silent = false;
    if (!compiler.log.hasErrors()) {
        return {
            success: true,
            wasm: compiler.outputWASM.array,
            wast: compiler.outputWAST
        };
    }
    else {
        if (!options.silent || options.logError) {
            log_1.writeLogToTerminal(compiler.log);
        }
        return {
            success: false,
            log: compiler.log
        };
    }
}
exports.compileString = compileString;
exports.version = "1.0.11-beta";
terminal_1.Terminal.setTextColor(color_1.Color.MAGENTA);
terminal_1.Terminal.write(`~~~~~~~~~~~~~~~~~~~~~~~~~| TurboScript ${exports.version} |~~~~~~~~~~~~~~~~~~~~~~~~~\n`);
terminal_1.Terminal.clearColor();
exports.default = {
    version: exports.version,
    main: exports.main,
    compileString: compileString
};


/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = new Uint8Array([0,97,115,109,1,0,0,0,1,175,128,128,128,0,7,96,3,127,127,127,1,127,96,2,127,127,1,127,96,1,127,1,127,96,2,127,127,0,96,4,127,127,127,127,1,127,96,5,127,127,127,127,127,1,127,96,3,127,127,127,0,3,156,128,128,128,0,27,0,0,0,1,0,1,2,1,3,0,0,0,0,0,4,5,4,0,1,2,2,2,1,2,1,2,6,4,132,128,128,128,0,1,112,0,0,5,131,128,128,128,0,1,0,1,7,214,131,128,128,0,25,6,109,101,109,111,114,121,2,0,6,109,101,109,99,109,112,0,0,6,109,101,109,99,112,121,0,1,6,109,101,109,115,101,116,0,2,13,99,114,101,97,116,101,95,109,115,112,97,99,101,0,3,23,99,114,101,97,116,101,95,109,115,112,97,99,101,95,119,105,116,104,95,98,97,115,101,0,4,25,109,115,112,97,99,101,95,116,114,97,99,107,95,108,97,114,103,101,95,99,104,117,110,107,115,0,5,14,100,101,115,116,114,111,121,95,109,115,112,97,99,101,0,6,13,109,115,112,97,99,101,95,109,97,108,108,111,99,0,7,11,109,115,112,97,99,101,95,102,114,101,101,0,8,13,109,115,112,97,99,101,95,99,97,108,108,111,99,0,9,14,109,115,112,97,99,101,95,114,101,97,108,108,111,99,0,10,23,109,115,112,97,99,101,95,114,101,97,108,108,111,99,95,105,110,95,112,108,97,99,101,0,12,15,109,115,112,97,99,101,95,109,101,109,97,108,105,103,110,0,13,25,109,115,112,97,99,101,95,105,110,100,101,112,101,110,100,101,110,116,95,99,97,108,108,111,99,0,14,27,109,115,112,97,99,101,95,105,110,100,101,112,101,110,100,101,110,116,95,99,111,109,97,108,108,111,99,0,16,16,109,115,112,97,99,101,95,98,117,108,107,95,102,114,101,101,0,17,11,109,115,112,97,99,101,95,116,114,105,109,0,18,16,109,115,112,97,99,101,95,102,111,111,116,112,114,105,110,116,0,19,20,109,115,112,97,99,101,95,109,97,120,95,102,111,111,116,112,114,105,110,116,0,20,22,109,115,112,97,99,101,95,102,111,111,116,112,114,105,110,116,95,108,105,109,105,116,0,21,26,109,115,112,97,99,101,95,115,101,116,95,102,111,111,116,112,114,105,110,116,95,108,105,109,105,116,0,22,18,109,115,112,97,99,101,95,117,115,97,98,108,101,95,115,105,122,101,0,23,14,109,115,112,97,99,101,95,109,97,108,108,111,112,116,0,24,11,109,115,112,97,99,101,95,105,110,105,116,0,25,9,129,128,128,128,0,0,10,178,135,129,128,0,27,183,130,128,128,0,1,5,127,2,127,2,64,2,64,2,64,2,64,2,64,32,0,65,7,113,34,3,32,1,65,7,113,71,13,0,65,8,32,3,107,34,6,4,64,65,0,33,3,3,64,32,0,32,3,106,34,7,45,0,0,32,1,32,3,106,34,4,45,0,0,71,13,3,32,3,65,1,106,34,3,32,6,73,13,0,11,32,1,32,3,106,33,1,32,0,32,3,106,33,0,32,2,32,3,107,33,2,11,32,2,65,4,73,13,0,65,0,33,3,3,64,32,0,32,3,106,40,2,0,32,1,32,3,106,40,2,0,71,13,4,32,3,65,4,106,33,3,32,2,65,124,106,34,2,65,3,75,13,0,11,32,0,32,3,106,33,0,32,1,32,3,106,33,1,11,65,1,32,2,107,33,3,2,64,2,64,3,64,32,3,34,2,65,1,70,13,1,32,2,65,1,106,33,3,32,1,45,0,0,33,6,32,0,45,0,0,33,7,32,1,65,1,106,34,4,33,1,32,0,65,1,106,34,5,33,0,32,7,32,6,70,13,0,12,2,11,0,11,32,1,33,4,32,0,33,5,11,65,0,32,2,107,69,13,1,12,3,11,32,4,65,1,106,33,4,32,7,65,1,106,33,5,32,2,32,3,107,13,2,11,65,0,15,11,32,0,33,5,32,1,33,4,11,32,5,45,0,0,32,4,45,0,0,107,11,11,151,140,128,128,0,1,8,127,2,127,2,64,2,64,2,64,32,2,69,32,1,65,3,113,69,114,69,4,64,32,0,33,5,2,64,3,64,32,5,32,1,45,0,0,58,0,0,32,2,65,127,106,33,3,32,5,65,1,106,33,5,32,1,65,1,106,33,1,32,2,65,1,70,13,1,32,3,33,2,32,1,65,3,113,13,0,11,11,32,5,65,3,113,69,13,1,12,2,11,32,2,33,3,32,0,34,5,65,3,113,13,1,11,2,64,32,3,65,16,79,4,64,32,5,32,3,65,112,106,34,6,65,112,113,34,7,65,16,106,34,8,106,33,4,32,1,33,2,3,64,32,5,32,2,40,2,0,54,2,0,32,5,65,4,106,32,2,65,4,106,40,2,0,54,2,0,32,5,65,8,106,32,2,65,8,106,40,2,0,54,2,0,32,5,65,12,106,32,2,65,12,106,40,2,0,54,2,0,32,5,65,16,106,33,5,32,2,65,16,106,33,2,32,3,65,112,106,34,3,65,15,75,13,0,11,32,6,32,7,107,33,3,32,1,32,8,106,33,1,12,1,11,32,5,33,4,11,32,3,65,8,113,4,64,32,4,32,1,40,2,0,54,2,0,32,4,32,1,40,2,4,54,2,4,32,1,65,8,106,33,1,32,4,65,8,106,33,4,11,32,3,65,4,113,4,64,32,4,32,1,40,2,0,54,2,0,32,1,65,4,106,33,1,32,4,65,4,106,33,4,11,32,3,65,2,113,4,64,32,4,32,1,45,0,0,58,0,0,32,4,32,1,45,0,1,58,0,1,32,4,65,2,106,33,4,32,1,65,2,106,33,1,11,32,3,65,1,113,69,13,1,32,4,32,1,45,0,0,58,0,0,32,0,15,11,2,64,2,64,2,64,2,64,2,64,2,64,2,64,32,3,65,32,73,13,0,32,5,65,3,113,34,2,65,3,70,13,1,32,2,65,2,70,13,2,32,2,65,1,71,13,0,32,5,32,1,45,0,1,58,0,1,32,5,32,1,40,2,0,34,7,58,0,0,32,5,32,1,45,0,2,58,0,2,32,5,65,3,106,33,2,32,3,65,125,106,34,4,65,17,73,13,3,32,1,65,16,106,33,6,32,3,65,109,106,33,8,32,1,32,3,65,108,106,65,112,113,34,9,65,19,106,34,10,106,33,1,3,64,32,2,32,6,65,116,106,40,2,0,34,3,65,8,116,32,7,65,24,118,114,54,2,0,32,2,65,4,106,32,6,65,120,106,40,2,0,34,7,65,8,116,32,3,65,24,118,114,54,2,0,32,2,65,8,106,32,6,65,124,106,40,2,0,34,3,65,8,116,32,7,65,24,118,114,54,2,0,32,2,65,12,106,32,6,40,2,0,34,7,65,8,116,32,3,65,24,118,114,54,2,0,32,2,65,16,106,33,2,32,6,65,16,106,33,6,32,4,65,112,106,34,4,65,16,75,13,0,11,32,8,32,9,107,33,4,32,5,32,10,106,33,2,12,6,11,32,3,33,4,32,5,33,2,12,5,11,32,5,32,1,40,2,0,34,7,58,0,0,32,5,65,1,106,33,2,32,3,65,127,106,34,4,65,19,73,13,2,32,1,65,16,106,33,6,32,3,65,111,106,33,8,32,1,32,3,65,108,106,65,112,113,34,9,65,17,106,34,10,106,33,1,3,64,32,2,32,6,65,116,106,40,2,0,34,3,65,24,116,32,7,65,8,118,114,54,2,0,32,2,65,4,106,32,6,65,120,106,40,2,0,34,7,65,24,116,32,3,65,8,118,114,54,2,0,32,2,65,8,106,32,6,65,124,106,40,2,0,34,3,65,24,116,32,7,65,8,118,114,54,2,0,32,2,65,12,106,32,6,40,2,0,34,7,65,24,116,32,3,65,8,118,114,54,2,0,32,2,65,16,106,33,2,32,6,65,16,106,33,6,32,4,65,112,106,34,4,65,18,75,13,0,11,32,8,32,9,107,33,4,32,5,32,10,106,33,2,12,4,11,32,5,32,1,40,2,0,34,7,58,0,0,32,5,32,1,45,0,1,58,0,1,32,5,65,2,106,33,2,32,3,65,126,106,34,4,65,18,73,13,2,32,1,65,16,106,33,6,32,3,65,110,106,33,8,32,1,32,3,65,108,106,65,112,113,34,9,65,18,106,34,10,106,33,1,3,64,32,2,32,6,65,116,106,40,2,0,34,3,65,16,116,32,7,65,16,118,114,54,2,0,32,2,65,4,106,32,6,65,120,106,40,2,0,34,7,65,16,116,32,3,65,16,118,114,54,2,0,32,2,65,8,106,32,6,65,124,106,40,2,0,34,3,65,16,116,32,7,65,16,118,114,54,2,0,32,2,65,12,106,32,6,40,2,0,34,7,65,16,116,32,3,65,16,118,114,54,2,0,32,2,65,16,106,33,2,32,6,65,16,106,33,6,32,4,65,112,106,34,4,65,17,75,13,0,11,32,8,32,9,107,33,4,32,5,32,10,106,33,2,12,3,11,32,1,65,3,106,33,1,12,2,11,32,1,65,1,106,33,1,12,1,11,32,1,65,2,106,33,1,11,32,4,65,16,113,4,64,32,2,32,1,45,0,1,58,0,1,32,2,32,1,45,0,2,58,0,2,32,2,32,1,45,0,3,58,0,3,32,2,32,1,45,0,4,58,0,4,32,2,32,1,45,0,5,58,0,5,32,2,32,1,45,0,6,58,0,6,32,2,32,1,45,0,7,58,0,7,32,2,32,1,45,0,8,58,0,8,32,2,32,1,45,0,9,58,0,9,32,2,32,1,45,0,10,58,0,10,32,2,32,1,45,0,11,58,0,11,32,2,32,1,45,0,12,58,0,12,32,2,32,1,45,0,13,58,0,13,32,2,32,1,45,0,14,58,0,14,32,2,32,1,45,0,0,58,0,0,32,2,32,1,45,0,15,58,0,15,32,2,65,16,106,33,2,32,1,65,16,106,33,1,11,32,4,65,8,113,4,64,32,2,32,1,45,0,0,58,0,0,32,2,32,1,45,0,1,58,0,1,32,2,32,1,45,0,2,58,0,2,32,2,32,1,45,0,3,58,0,3,32,2,32,1,45,0,4,58,0,4,32,2,32,1,45,0,5,58,0,5,32,2,32,1,45,0,6,58,0,6,32,2,32,1,45,0,7,58,0,7,32,2,65,8,106,33,2,32,1,65,8,106,33,1,11,32,4,65,4,113,4,64,32,2,32,1,45,0,0,58,0,0,32,2,32,1,45,0,1,58,0,1,32,2,32,1,45,0,2,58,0,2,32,2,32,1,45,0,3,58,0,3,32,2,65,4,106,33,2,32,1,65,4,106,33,1,11,32,4,65,2,113,4,64,32,2,32,1,45,0,0,58,0,0,32,2,32,1,45,0,1,58,0,1,32,2,65,2,106,33,2,32,1,65,2,106,33,1,11,32,4,65,1,113,69,13,0,32,2,32,1,45,0,0,58,0,0,32,0,15,11,32,0,11,11,255,130,128,128,0,2,2,127,1,126,2,127,2,64,32,2,69,13,0,32,0,32,2,106,34,3,65,127,106,32,1,58,0,0,32,0,32,1,58,0,0,32,2,65,3,73,13,0,32,3,65,126,106,32,1,58,0,0,32,0,32,1,58,0,1,32,3,65,125,106,32,1,58,0,0,32,0,32,1,58,0,2,32,2,65,7,73,13,0,32,3,65,124,106,32,1,58,0,0,32,0,32,1,58,0,3,32,2,65,9,73,13,0,32,0,65,0,32,0,107,65,3,113,34,4,106,34,3,32,1,65,255,1,113,65,129,130,132,8,108,34,1,54,2,0,32,3,32,2,32,4,107,65,124,113,34,4,106,34,2,65,124,106,32,1,54,2,0,32,4,65,9,73,13,0,32,3,32,1,54,2,8,32,3,32,1,54,2,4,32,2,65,120,106,32,1,54,2,0,32,2,65,116,106,32,1,54,2,0,32,4,65,25,73,13,0,32,3,32,1,54,2,16,32,3,32,1,54,2,12,32,3,32,1,54,2,20,32,3,32,1,54,2,24,32,2,65,104,106,32,1,54,2,0,32,2,65,100,106,32,1,54,2,0,32,2,65,108,106,32,1,54,2,0,32,2,65,112,106,32,1,54,2,0,32,4,32,3,65,4,113,65,24,114,34,4,107,34,2,65,32,73,13,0,32,1,173,34,5,66,32,134,32,5,132,33,5,32,3,32,4,106,33,1,3,64,32,1,32,5,55,3,0,32,1,65,8,106,32,5,55,3,0,32,1,65,16,106,32,5,55,3,0,32,1,65,24,106,32,5,55,3,0,32,1,65,32,106,33,1,32,2,65,96,106,34,2,65,31,75,13,0,11,11,32,0,11,11,212,128,128,128,0,1,1,127,2,127,65,200,0,40,2,0,4,64,65,0,15,11,65,192,0,40,2,0,65,16,107,33,2,65,204,0,66,128,128,132,128,128,128,192,0,55,2,0,65,212,0,66,127,55,2,0,65,200,0,32,2,65,12,106,65,112,113,65,216,170,213,170,5,115,54,2,0,65,220,0,65,0,54,2,0,65,0,11,11,204,131,128,128,0,1,6,127,2,127,65,192,0,65,192,0,40,2,0,65,16,107,34,8,54,2,0,65,0,33,6,65,200,0,40,2,0,34,4,69,4,64,65,204,0,66,128,128,132,128,128,128,192,0,55,2,0,65,212,0,66,127,55,2,0,65,200,0,32,8,65,12,106,65,112,113,65,216,170,213,170,5,115,34,4,54,2,0,65,220,0,65,0,54,2,0,11,2,64,32,1,65,137,4,73,13,0,65,0,33,6,65,248,123,65,204,0,40,2,0,107,32,1,77,13,0,65,0,33,3,32,0,65,120,32,0,107,65,7,113,65,0,32,0,65,8,106,65,7,113,27,106,34,2,65,8,106,34,6,65,0,65,224,3,16,2,33,5,32,2,65,227,3,54,2,4,32,2,65,188,3,106,32,1,54,2,0,32,2,65,184,3,106,32,1,54,2,0,32,2,65,204,3,106,32,1,54,2,0,32,2,65,44,106,32,4,54,2,0,32,2,65,40,106,65,127,54,2,0,32,2,65,24,106,32,0,54,2,0,32,2,65,200,3,106,32,0,54,2,0,32,2,65,216,3,106,65,0,54,2,0,65,220,0,40,2,0,33,4,32,2,65,220,3,106,65,0,54,2,0,32,2,65,196,3,106,32,4,65,4,114,54,2,0,3,64,32,2,32,3,106,34,4,65,56,106,32,4,65,48,106,34,7,54,2,0,32,4,65,60,106,32,7,54,2,0,32,3,65,8,106,34,3,65,128,2,71,13,0,11,32,5,32,5,65,124,106,40,2,0,65,120,113,106,34,3,65,120,106,34,4,65,0,32,3,107,65,7,113,65,0,32,3,65,7,113,27,34,3,106,34,7,32,0,32,1,106,34,2,32,4,107,65,88,106,32,3,107,34,3,65,1,114,54,2,4,32,5,65,8,54,2,204,3,32,5,65,216,0,40,2,0,54,2,28,32,5,32,7,54,2,24,32,5,32,3,54,2,12,32,2,65,92,106,65,40,54,2,0,11,65,192,0,32,8,65,16,106,54,2,0,32,6,11,11,132,128,128,128,0,0,65,1,11,155,128,128,128,0,0,2,127,32,0,65,192,3,106,33,0,3,64,32,0,40,2,8,34,0,13,0,11,65,0,11,11,164,181,128,128,0,1,10,127,2,127,65,192,0,40,2,0,65,16,107,33,7,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,32,1,65,244,1,77,4,64,32,0,40,2,0,34,4,65,16,32,1,65,11,106,65,120,113,32,1,65,11,73,27,34,5,65,3,118,34,2,118,34,1,65,3,113,69,13,1,32,0,32,1,65,127,115,65,1,113,32,2,106,34,3,65,3,116,106,34,5,65,48,106,40,2,0,34,1,65,8,106,33,6,32,1,40,2,8,34,2,32,5,65,40,106,34,5,70,13,2,32,0,40,2,16,32,2,75,32,2,40,2,12,32,1,71,114,13,3,32,5,65,8,106,32,2,54,2,0,32,2,65,12,106,32,5,54,2,0,12,3,11,65,127,33,5,32,1,65,191,127,75,13,17,32,1,65,11,106,34,2,65,120,113,33,5,32,0,40,2,4,34,10,69,13,17,2,127,65,0,32,2,65,8,118,34,2,69,13,0,26,65,31,32,5,65,255,255,255,7,75,13,0,26,32,5,65,14,32,2,32,2,65,128,254,63,106,65,16,118,65,8,113,34,3,116,34,2,65,128,224,31,106,65,16,118,65,4,113,34,4,32,3,114,32,2,32,4,116,34,2,65,128,128,15,106,65,16,118,65,2,113,34,3,114,107,32,2,32,3,116,65,15,118,106,34,2,65,7,106,118,65,1,113,32,2,65,1,116,114,11,33,9,65,0,32,5,107,33,3,32,0,32,9,65,2,116,106,65,176,2,106,40,2,0,34,2,69,13,4,32,5,65,0,65,25,32,9,65,1,118,107,32,9,65,31,70,27,116,33,6,65,0,33,1,65,0,33,4,3,64,32,2,40,2,4,65,120,113,32,5,107,34,8,32,3,73,4,64,32,8,33,3,32,2,33,4,32,8,69,13,8,11,32,1,32,2,65,20,106,40,2,0,34,8,32,8,32,2,32,6,65,29,118,65,4,113,106,65,16,106,40,2,0,34,2,70,27,32,1,32,8,27,33,1,32,6,32,2,65,0,71,116,33,6,32,2,13,0,11,32,1,32,4,114,69,13,4,12,14,11,32,5,32,0,40,2,8,34,3,77,13,16,32,1,69,13,4,32,0,65,40,106,34,7,32,1,32,2,116,65,2,32,2,116,34,1,65,0,32,1,107,114,113,34,1,65,0,32,1,107,113,65,127,106,34,1,32,1,65,12,118,65,16,113,34,1,118,34,2,65,5,118,65,8,113,34,6,32,1,114,32,2,32,6,118,34,1,65,2,118,65,4,113,34,2,114,32,1,32,2,118,34,1,65,1,118,65,2,113,34,2,114,32,1,32,2,118,34,1,65,1,118,65,1,113,34,2,114,32,1,32,2,118,106,34,8,65,3,116,106,34,2,40,2,8,34,1,40,2,8,34,6,32,2,70,13,6,32,0,40,2,16,32,6,75,32,6,40,2,12,32,1,71,114,13,7,32,2,65,8,106,32,6,54,2,0,32,6,65,12,106,32,2,54,2,0,32,0,65,8,106,40,2,0,33,3,12,7,11,32,0,32,4,65,126,32,3,119,113,54,2,0,11,32,1,32,3,65,3,116,34,2,65,3,114,54,2,4,32,1,32,2,106,34,1,32,1,40,2,4,65,1,114,54,2,4,32,6,15,0,11,0,11,65,0,33,4,32,10,65,2,32,9,116,34,1,65,0,32,1,107,114,113,34,1,69,13,12,32,0,32,1,65,0,32,1,107,113,65,127,106,34,1,32,1,65,12,118,65,16,113,34,1,118,34,2,65,5,118,65,8,113,34,6,32,1,114,32,2,32,6,118,34,1,65,2,118,65,4,113,34,2,114,32,1,32,2,118,34,1,65,1,118,65,2,113,34,2,114,32,1,32,2,118,34,1,65,1,118,65,1,113,34,2,114,32,1,32,2,118,106,65,2,116,106,65,176,2,106,40,2,0,34,1,13,10,12,11,11,32,0,40,2,4,34,1,69,13,11,32,0,32,1,65,0,32,1,107,113,65,127,106,34,1,32,1,65,12,118,65,16,113,34,1,118,34,2,65,5,118,65,8,113,34,3,32,1,114,32,2,32,3,118,34,1,65,2,118,65,4,113,34,2,114,32,1,32,2,118,34,1,65,1,118,65,2,113,34,2,114,32,1,32,2,118,34,1,65,1,118,65,1,113,34,2,114,32,1,32,2,118,106,65,2,116,106,65,176,2,106,40,2,0,34,3,40,2,4,65,120,113,32,5,107,33,2,32,3,65,16,106,32,3,40,2,16,69,65,2,116,106,40,2,0,34,1,4,64,3,64,32,1,40,2,4,65,120,113,32,5,107,34,4,32,2,32,4,32,2,73,34,4,27,33,2,32,1,32,3,32,4,27,33,3,32,1,65,16,106,32,1,40,2,16,69,65,2,116,106,40,2,0,34,4,33,1,32,4,13,0,11,11,32,0,40,2,16,34,10,32,3,75,13,11,32,3,32,5,106,34,9,32,3,77,13,11,32,3,40,2,24,33,7,32,3,40,2,12,34,6,32,3,70,13,3,32,10,32,3,40,2,8,34,1,75,32,1,40,2,12,32,3,71,114,32,6,40,2,8,32,3,71,114,13,4,32,6,65,8,106,32,1,54,2,0,32,1,65,12,106,32,6,54,2,0,32,7,13,6,12,7,11,65,0,33,3,32,2,33,4,32,2,33,1,12,8,11,32,0,32,4,65,126,32,8,119,113,54,2,0,11,32,1,65,8,106,33,4,32,1,32,5,65,3,114,54,2,4,32,1,32,5,106,34,6,32,8,65,3,116,34,8,32,5,107,34,2,65,1,114,54,2,4,32,1,32,8,106,32,2,54,2,0,32,3,4,64,32,7,32,3,65,3,118,34,5,65,3,116,106,33,3,32,0,65,20,106,40,2,0,33,1,2,127,32,0,40,2,0,34,8,65,1,32,5,116,34,5,113,4,64,32,3,32,3,40,2,8,34,5,32,0,40,2,16,32,5,75,27,12,1,11,32,0,32,8,32,5,114,54,2,0,32,3,11,34,5,32,1,54,2,12,32,3,65,8,106,32,1,54,2,0,32,1,32,3,54,2,12,32,1,32,5,54,2,8,11,32,0,65,20,106,32,6,54,2,0,32,0,65,8,106,32,2,54,2,0,32,4,15,11,32,3,65,20,106,34,4,40,2,0,34,1,69,4,64,32,3,40,2,16,34,1,69,13,2,32,3,65,16,106,33,4,11,3,64,32,4,33,8,32,1,34,6,65,20,106,34,4,40,2,0,34,1,13,0,32,6,65,16,106,33,4,32,6,40,2,16,34,1,13,0,11,32,10,32,8,75,13,0,32,8,65,0,54,2,0,11,32,7,69,13,2,12,1,11,65,0,33,6,32,7,69,13,1,11,2,64,2,64,32,3,32,0,32,3,40,2,28,34,4,65,2,116,106,65,176,2,106,34,1,40,2,0,71,4,64,32,0,65,16,106,40,2,0,32,7,77,4,64,32,7,65,16,106,32,7,40,2,16,32,3,71,65,2,116,106,32,6,54,2,0,11,32,6,13,1,12,3,11,32,1,32,6,54,2,0,32,6,69,13,1,11,32,0,65,16,106,40,2,0,34,4,32,6,75,13,1,32,6,32,7,54,2,24,32,3,40,2,16,34,1,69,32,4,32,1,75,114,69,4,64,32,6,32,1,54,2,16,32,1,32,6,54,2,24,11,32,3,65,20,106,40,2,0,34,1,69,32,0,65,16,106,40,2,0,32,1,75,114,13,1,32,6,65,20,106,32,1,54,2,0,32,1,32,6,54,2,24,12,1,11,32,0,65,4,106,34,1,32,1,40,2,0,65,126,32,4,119,113,54,2,0,11,2,64,32,2,65,15,77,4,64,32,3,32,2,32,5,106,34,1,65,3,114,54,2,4,32,3,32,1,106,34,1,32,1,40,2,4,65,1,114,54,2,4,12,1,11,32,3,32,5,65,3,114,54,2,4,32,9,32,2,65,1,114,54,2,4,32,9,32,2,106,32,2,54,2,0,32,0,65,8,106,34,4,40,2,0,34,1,4,64,32,0,32,1,65,3,118,34,6,65,3,116,106,65,40,106,33,5,32,0,65,20,106,40,2,0,33,1,2,127,32,0,40,2,0,34,8,65,1,32,6,116,34,6,113,4,64,32,5,32,5,40,2,8,34,6,32,0,65,16,106,40,2,0,32,6,75,27,12,1,11,32,0,32,8,32,6,114,54,2,0,32,5,11,34,6,32,1,54,2,12,32,5,65,8,106,32,1,54,2,0,32,1,32,5,54,2,12,32,1,32,6,54,2,8,11,32,0,65,20,106,32,9,54,2,0,32,4,32,2,54,2,0,11,32,3,65,8,106,15,11,32,1,69,13,1,11,3,64,32,1,40,2,4,65,120,113,32,5,107,34,2,32,3,32,2,32,3,73,34,2,27,33,3,32,1,32,4,32,2,27,33,4,32,1,65,16,106,32,1,40,2,16,69,65,2,116,106,40,2,0,34,2,33,1,32,2,13,0,11,11,32,4,69,32,3,32,0,40,2,8,32,5,107,79,114,13,0,32,0,40,2,16,34,10,32,4,75,13,0,32,4,32,5,106,34,9,32,4,77,13,0,32,4,40,2,24,33,7,32,4,40,2,12,34,6,32,4,70,13,1,32,10,32,4,40,2,8,34,1,75,32,1,40,2,12,32,4,71,114,32,6,40,2,8,32,4,71,114,13,2,32,6,65,8,106,32,1,54,2,0,32,1,65,12,106,32,6,54,2,0,32,7,13,20,12,21,11,2,127,2,64,2,64,2,64,2,64,32,0,40,2,8,34,1,32,5,73,4,64,32,0,40,2,12,34,4,32,5,77,13,1,32,0,40,2,24,34,1,32,5,106,34,2,32,4,32,5,107,34,3,65,1,114,54,2,4,32,0,65,12,106,32,3,54,2,0,32,0,32,2,54,2,24,32,1,32,5,65,3,114,54,2,4,32,1,65,8,106,15,11,32,0,40,2,20,33,2,32,1,32,5,107,34,3,65,16,73,13,1,32,2,32,5,106,34,4,32,3,65,1,114,54,2,4,32,2,32,1,106,32,3,54,2,0,32,0,65,8,106,32,3,54,2,0,32,0,65,20,106,32,4,54,2,0,32,2,32,5,65,3,114,54,2,4,12,2,11,65,200,0,40,2,0,69,13,2,65,208,0,40,2,0,12,3,11,32,2,32,1,65,3,114,54,2,4,32,0,65,20,106,65,0,54,2,0,32,0,65,8,106,65,0,54,2,0,32,2,32,1,106,34,1,32,1,40,2,4,65,1,114,54,2,4,11,32,2,65,8,106,15,11,65,204,0,66,128,128,132,128,128,128,192,0,55,2,0,65,212,0,66,127,55,2,0,65,200,0,32,7,65,12,106,65,112,113,65,216,170,213,170,5,115,54,2,0,65,220,0,65,0,54,2,0,65,128,128,4,11,33,1,65,0,33,8,32,1,32,5,65,47,106,34,10,106,34,7,65,0,32,1,107,34,9,113,34,6,32,5,77,13,10,32,0,40,2,184,3,34,11,4,64,32,0,40,2,176,3,34,1,32,6,106,34,2,32,1,77,32,2,32,11,75,114,13,11,11,32,0,65,188,3,106,45,0,0,65,4,113,13,8,32,0,40,2,24,34,2,4,64,32,0,65,192,3,106,33,1,3,64,32,1,40,2,0,34,3,32,2,77,4,64,32,3,32,1,40,2,4,106,32,2,75,13,5,11,32,1,40,2,8,34,1,13,0,11,11,63,0,33,1,32,6,33,7,65,204,0,40,2,0,34,2,65,127,106,34,3,32,1,65,16,116,34,4,113,4,64,32,6,32,4,107,32,3,32,4,106,65,0,32,2,107,113,106,33,7,11,32,7,32,5,77,32,7,65,254,255,255,255,7,75,114,13,7,32,11,4,64,32,0,40,2,176,3,34,1,32,7,106,34,2,32,1,77,32,2,32,11,75,114,13,8,11,63,0,65,16,116,65,127,32,7,65,127,106,65,16,117,65,1,106,64,0,27,34,1,32,4,70,13,9,32,1,33,4,12,3,11,32,4,65,20,106,34,2,40,2,0,34,1,69,4,64,32,4,40,2,16,34,1,69,13,4,32,4,65,16,106,33,2,11,3,64,32,2,33,8,32,1,34,6,65,20,106,34,2,40,2,0,34,1,13,0,32,6,65,16,106,33,2,32,6,40,2,16,34,1,13,0,11,32,10,32,8,75,13,0,32,8,65,0,54,2,0,11,32,7,69,13,18,12,17,11,32,7,32,4,107,32,9,113,34,7,65,254,255,255,255,7,75,13,4,63,0,33,2,2,127,32,7,4,64,65,127,32,7,65,127,106,65,16,117,65,1,106,64,0,69,13,1,26,11,32,2,65,16,116,11,34,4,32,1,40,2,0,32,1,65,4,106,40,2,0,106,70,13,2,11,32,5,65,48,106,32,7,77,32,7,65,254,255,255,255,7,75,114,32,4,65,127,70,114,69,4,64,32,10,32,7,107,65,208,0,40,2,0,34,1,106,65,0,32,1,107,113,34,1,65,254,255,255,255,7,75,13,6,32,1,4,64,32,1,65,127,106,65,16,117,65,1,106,64,0,69,13,4,11,32,1,32,7,106,33,7,12,6,11,32,4,65,127,71,13,5,12,3,11,65,0,33,6,32,7,13,14,12,15,11,32,4,65,127,71,13,3,12,1,11,65,0,32,7,107,65,1,72,13,0,32,7,65,127,115,65,16,117,65,1,106,64,0,26,11,32,0,65,188,3,106,34,1,32,1,40,2,0,65,4,114,54,2,0,11,32,6,65,254,255,255,255,7,75,13,1,63,0,33,1,2,127,32,6,4,64,65,127,32,6,65,127,106,65,16,117,65,1,106,64,0,69,13,1,26,11,32,1,65,16,116,11,33,4,63,0,33,1,32,4,65,127,70,13,1,32,4,32,1,65,16,116,34,1,79,13,1,32,1,32,4,107,34,7,32,5,65,40,106,77,13,1,11,32,0,32,0,40,2,176,3,32,7,106,34,1,54,2,176,3,32,1,32,0,40,2,180,3,75,4,64,32,0,65,180,3,106,32,1,54,2,0,11,2,64,2,64,2,64,32,0,40,2,24,34,2,4,64,32,0,65,192,3,106,34,9,33,1,3,64,32,4,32,1,40,2,0,34,3,32,1,40,2,4,34,6,106,70,13,2,32,1,40,2,8,34,1,13,0,12,3,11,0,11,2,64,32,0,40,2,16,34,1,4,64,32,4,32,1,79,13,1,11,32,0,65,16,106,32,4,54,2,0,11,32,0,32,7,54,2,196,3,32,0,32,4,54,2,192,3,65,0,33,1,32,0,65,0,54,2,204,3,32,0,65,127,54,2,32,32,0,65,200,0,40,2,0,54,2,36,3,64,32,0,32,1,106,34,2,65,48,106,32,2,65,40,106,34,3,54,2,0,32,2,65,52,106,32,3,54,2,0,32,1,65,8,106,34,1,65,128,2,71,13,0,11,32,0,65,24,106,32,0,32,0,65,124,106,40,2,0,65,120,113,106,34,1,65,120,106,34,2,65,0,32,1,107,65,7,113,65,0,32,1,65,7,113,27,34,1,106,34,3,54,2,0,32,0,65,12,106,32,4,32,7,106,34,4,32,2,107,65,88,106,32,1,107,34,1,54,2,0,32,3,32,1,65,1,114,54,2,4,32,4,65,92,106,65,40,54,2,0,32,0,65,216,0,40,2,0,54,2,28,12,2,11,32,1,45,0,12,65,8,113,32,4,32,2,77,114,32,3,32,2,75,114,13,0,32,2,65,120,32,2,107,65,7,113,65,0,32,2,65,8,106,65,7,113,27,34,3,106,34,4,32,0,65,12,106,34,9,40,2,0,32,7,106,34,10,32,3,107,34,3,65,1,114,54,2,4,32,1,65,4,106,32,6,32,7,106,54,2,0,32,0,65,216,0,40,2,0,54,2,28,32,9,32,3,54,2,0,32,0,65,24,106,32,4,54,2,0,32,2,32,10,106,65,40,54,2,4,12,1,11,32,4,32,0,40,2,16,34,6,73,4,64,32,0,65,16,106,32,4,54,2,0,32,4,33,6,11,32,4,32,7,106,33,3,32,9,33,1,2,127,2,64,2,127,2,64,2,64,2,64,2,64,3,64,32,1,40,2,0,32,3,70,13,1,32,1,40,2,8,34,1,13,0,12,2,11,0,11,32,1,45,0,12,65,8,113,13,0,32,1,32,4,54,2,0,32,1,32,1,40,2,4,32,7,106,54,2,4,32,4,65,120,32,4,107,65,7,113,65,0,32,4,65,8,106,65,7,113,27,106,34,7,32,5,65,3,114,54,2,4,32,3,65,120,32,3,107,65,7,113,65,0,32,3,65,8,106,65,7,113,27,106,34,4,32,7,107,32,5,107,33,1,32,7,32,5,106,33,3,32,2,32,4,70,13,1,32,0,40,2,20,32,4,70,13,8,32,4,40,2,4,34,2,65,3,113,65,1,71,13,14,32,2,65,120,113,33,10,32,2,65,255,1,75,13,9,32,4,40,2,12,33,8,32,4,40,2,8,34,5,32,0,32,2,65,3,118,34,9,65,3,116,106,65,40,106,34,2,71,4,64,32,6,32,5,75,32,5,40,2,12,32,4,71,114,13,14,11,32,8,32,5,70,13,10,32,8,32,2,71,4,64,32,6,32,8,75,32,8,40,2,8,32,4,71,114,13,14,11,32,5,32,8,54,2,12,32,8,65,8,106,32,5,54,2,0,12,13,11,32,9,33,1,2,64,3,64,32,1,40,2,0,34,3,32,2,77,4,64,32,3,32,1,40,2,4,106,34,3,32,2,75,13,2,11,32,1,40,2,8,33,1,12,0,11,0,11,32,4,65,120,32,4,107,65,7,113,65,0,32,4,65,8,106,65,7,113,27,34,1,106,34,10,32,7,65,88,106,34,6,32,1,107,34,1,65,1,114,54,2,4,32,4,32,6,106,65,40,54,2,4,32,2,32,3,65,39,32,3,107,65,7,113,65,0,32,3,65,89,106,65,7,113,27,106,65,81,106,34,6,32,6,32,2,65,16,106,73,27,34,6,65,27,54,2,4,32,0,65,216,0,40,2,0,54,2,28,32,0,65,12,106,32,1,54,2,0,32,0,65,24,106,32,10,54,2,0,32,6,65,20,106,32,9,65,12,106,40,2,0,54,2,0,32,6,65,16,106,32,9,65,8,106,40,2,0,54,2,0,32,6,65,12,106,32,9,65,4,106,40,2,0,54,2,0,32,6,32,9,40,2,0,54,2,8,32,0,65,0,54,2,204,3,32,0,32,6,65,8,106,54,2,200,3,32,0,32,7,54,2,196,3,32,0,65,192,3,106,32,4,54,2,0,32,6,65,28,106,33,1,3,64,32,1,65,7,54,2,0,32,1,65,4,106,34,1,32,3,73,13,0,11,32,6,32,2,70,13,5,32,6,65,4,106,34,1,32,1,40,2,0,65,126,113,54,2,0,32,6,32,6,32,2,107,34,7,54,2,0,32,2,32,7,65,1,114,54,2,4,32,7,65,255,1,77,4,64,32,0,32,7,65,3,118,34,3,65,3,116,106,65,40,106,33,1,32,0,40,2,0,34,4,65,1,32,3,116,34,3,113,69,13,2,32,1,32,1,40,2,8,34,3,32,0,65,16,106,40,2,0,32,3,75,27,12,3,11,32,7,65,8,118,34,3,69,13,3,65,31,32,7,65,255,255,255,7,75,13,4,26,32,7,65,14,32,3,32,3,65,128,254,63,106,65,16,118,65,8,113,34,1,116,34,3,65,128,224,31,106,65,16,118,65,4,113,34,4,32,1,114,32,3,32,4,116,34,1,65,128,128,15,106,65,16,118,65,2,113,34,3,114,107,32,1,32,3,116,65,15,118,106,34,1,65,7,106,118,65,1,113,32,1,65,1,116,114,12,4,11,32,0,65,24,106,32,3,54,2,0,32,0,65,12,106,34,2,32,2,40,2,0,32,1,106,34,1,54,2,0,32,3,32,1,65,1,114,54,2,4,12,13,11,32,0,32,4,32,3,114,54,2,0,32,1,11,34,3,32,2,54,2,12,32,1,65,8,106,32,2,54,2,0,32,2,32,1,54,2,12,32,2,32,3,54,2,8,12,2,11,65,0,11,33,1,32,2,66,0,55,2,16,32,2,65,28,106,32,1,54,2,0,32,0,32,1,65,2,116,106,65,176,2,106,33,3,2,64,2,64,32,0,40,2,4,34,4,65,1,32,1,116,34,6,113,4,64,32,7,65,0,65,25,32,1,65,1,118,107,32,1,65,31,70,27,116,33,1,32,3,40,2,0,33,4,3,64,32,4,34,3,40,2,4,65,120,113,32,7,70,13,3,32,1,65,29,118,33,4,32,1,65,1,116,33,1,32,3,32,4,65,4,113,106,65,16,106,34,6,40,2,0,34,4,13,0,11,32,0,65,16,106,40,2,0,32,6,75,13,3,32,6,32,2,54,2,0,32,2,65,24,106,32,3,54,2,0,12,1,11,32,0,65,4,106,32,4,32,6,114,54,2,0,32,3,32,2,54,2,0,32,2,65,24,106,32,3,54,2,0,11,32,2,32,2,54,2,12,32,2,32,2,54,2,8,12,1,11,32,0,65,16,106,40,2,0,34,4,32,3,40,2,8,34,1,75,32,4,32,3,75,114,13,0,32,1,32,2,54,2,12,32,3,65,8,106,32,2,54,2,0,32,2,32,3,54,2,12,32,2,65,24,106,65,0,54,2,0,32,2,32,1,54,2,8,11,32,0,65,12,106,34,1,40,2,0,34,2,32,5,77,13,0,32,0,65,24,106,34,4,40,2,0,34,3,32,5,106,34,6,32,2,32,5,107,34,2,65,1,114,54,2,4,32,1,32,2,54,2,0,32,4,32,6,54,2,0,32,3,32,5,65,3,114,54,2,4,32,3,65,8,106,33,8,11,32,8,15,11,32,3,32,0,65,8,106,34,2,40,2,0,32,1,106,34,1,65,1,114,54,2,4,32,0,65,20,106,32,3,54,2,0,32,2,32,1,54,2,0,32,3,32,1,106,32,1,54,2,0,12,6,11,32,4,40,2,24,33,11,2,64,32,4,40,2,12,34,8,32,4,71,4,64,32,6,32,4,40,2,8,34,2,75,32,2,40,2,12,32,4,71,114,32,8,40,2,8,32,4,71,114,13,1,32,8,65,8,106,32,2,54,2,0,32,2,65,12,106,32,8,54,2,0,32,11,13,4,12,5,11,32,4,65,20,106,34,2,40,2,0,34,5,69,4,64,32,4,65,16,106,34,2,40,2,0,34,5,69,13,3,11,3,64,32,2,33,9,32,5,34,8,65,20,106,34,2,40,2,0,34,5,13,0,32,8,65,16,106,33,2,32,8,40,2,16,34,5,13,0,11,32,6,32,9,75,13,0,32,9,65,0,54,2,0,11,32,11,69,13,3,12,2,11,32,0,32,0,40,2,0,65,126,32,9,119,113,54,2,0,12,2,11,65,0,33,8,32,11,69,13,1,11,2,64,2,64,32,0,32,4,40,2,28,34,5,65,2,116,106,65,176,2,106,34,2,40,2,0,32,4,71,4,64,32,0,65,16,106,40,2,0,32,11,77,4,64,32,11,65,16,106,32,11,40,2,16,32,4,71,65,2,116,106,32,8,54,2,0,11,32,8,13,1,12,3,11,32,2,32,8,54,2,0,32,8,69,13,1,11,32,0,65,16,106,40,2,0,34,5,32,8,75,13,1,32,8,32,11,54,2,24,32,4,40,2,16,34,2,69,32,5,32,2,75,114,69,4,64,32,8,32,2,54,2,16,32,2,32,8,54,2,24,11,32,4,65,20,106,40,2,0,34,2,69,32,0,65,16,106,40,2,0,32,2,75,114,13,1,32,8,65,20,106,32,2,54,2,0,32,2,32,8,54,2,24,12,1,11,32,0,32,0,40,2,4,65,126,32,5,119,113,54,2,4,11,32,10,32,1,106,33,1,32,4,32,10,106,33,4,11,32,4,32,4,40,2,4,65,126,113,54,2,4,32,3,32,1,65,1,114,54,2,4,32,3,32,1,106,32,1,54,2,0,2,127,2,64,2,127,2,64,32,1,65,255,1,77,4,64,32,0,32,1,65,3,118,34,2,65,3,116,106,65,40,106,33,1,32,0,40,2,0,34,5,65,1,32,2,116,34,2,113,69,13,1,32,1,65,8,106,33,5,32,1,32,1,40,2,8,34,2,32,0,65,16,106,40,2,0,32,2,75,27,12,2,11,32,1,65,8,118,34,5,69,13,2,65,31,32,1,65,255,255,255,7,75,13,3,26,32,1,65,14,32,5,32,5,65,128,254,63,106,65,16,118,65,8,113,34,2,116,34,5,65,128,224,31,106,65,16,118,65,4,113,34,4,32,2,114,32,5,32,4,116,34,2,65,128,128,15,106,65,16,118,65,2,113,34,5,114,107,32,2,32,5,116,65,15,118,106,34,2,65,7,106,118,65,1,113,32,2,65,1,116,114,12,3,11,32,0,32,5,32,2,114,54,2,0,32,1,65,8,106,33,5,32,1,11,34,2,32,3,54,2,12,32,5,32,3,54,2,0,32,3,32,1,54,2,12,32,3,32,2,54,2,8,12,2,11,65,0,11,33,2,32,3,32,2,54,2,28,32,3,66,0,55,2,16,32,0,32,2,65,2,116,106,65,176,2,106,33,5,2,64,2,64,32,0,40,2,4,34,4,65,1,32,2,116,34,6,113,4,64,32,1,65,0,65,25,32,2,65,1,118,107,32,2,65,31,70,27,116,33,2,32,5,40,2,0,33,4,3,64,32,4,34,5,40,2,4,65,120,113,32,1,70,13,3,32,2,65,29,118,33,4,32,2,65,1,116,33,2,32,5,32,4,65,4,113,106,65,16,106,34,6,40,2,0,34,4,13,0,11,32,0,65,16,106,40,2,0,32,6,75,13,3,32,6,32,3,54,2,0,32,3,32,5,54,2,24,12,1,11,32,0,65,4,106,32,4,32,6,114,54,2,0,32,5,32,3,54,2,0,32,3,32,5,54,2,24,11,32,3,32,3,54,2,12,32,3,32,3,54,2,8,12,1,11,32,0,65,16,106,40,2,0,34,2,32,5,40,2,8,34,1,75,32,2,32,5,75,114,13,0,32,1,32,3,54,2,12,32,5,65,8,106,32,3,54,2,0,32,3,65,0,54,2,24,32,3,32,5,54,2,12,32,3,32,1,54,2,8,11,32,7,65,8,106,15,11,2,64,2,64,32,4,32,0,32,4,40,2,28,34,2,65,2,116,106,65,176,2,106,34,1,40,2,0,71,4,64,32,0,65,16,106,40,2,0,32,7,77,4,64,32,7,65,16,106,32,7,40,2,16,32,4,71,65,2,116,106,32,6,54,2,0,11,32,6,13,1,12,3,11,32,1,32,6,54,2,0,32,6,69,13,1,11,32,0,65,16,106,40,2,0,34,2,32,6,75,13,1,32,6,32,7,54,2,24,32,4,40,2,16,34,1,69,32,2,32,1,75,114,69,4,64,32,6,32,1,54,2,16,32,1,32,6,54,2,24,11,32,4,65,20,106,40,2,0,34,1,69,32,0,65,16,106,40,2,0,32,1,75,114,13,1,32,6,65,20,106,32,1,54,2,0,32,1,32,6,54,2,24,12,1,11,32,0,65,4,106,34,1,32,1,40,2,0,65,126,32,2,119,113,54,2,0,11,2,64,32,3,65,15,77,4,64,32,4,32,3,32,5,106,34,1,65,3,114,54,2,4,32,4,32,1,106,34,1,32,1,40,2,4,65,1,114,54,2,4,12,1,11,32,4,32,5,65,3,114,54,2,4,32,9,32,3,65,1,114,54,2,4,32,9,32,3,106,32,3,54,2,0,2,127,2,64,2,127,2,64,32,3,65,255,1,77,4,64,32,0,32,3,65,3,118,34,2,65,3,116,106,65,40,106,33,1,32,0,40,2,0,34,3,65,1,32,2,116,34,2,113,69,13,1,32,1,65,8,106,33,3,32,1,32,1,40,2,8,34,2,32,0,65,16,106,40,2,0,32,2,75,27,12,2,11,32,3,65,8,118,34,2,69,13,2,65,31,32,3,65,255,255,255,7,75,13,3,26,32,3,65,14,32,2,32,2,65,128,254,63,106,65,16,118,65,8,113,34,1,116,34,2,65,128,224,31,106,65,16,118,65,4,113,34,5,32,1,114,32,2,32,5,116,34,1,65,128,128,15,106,65,16,118,65,2,113,34,2,114,107,32,1,32,2,116,65,15,118,106,34,1,65,7,106,118,65,1,113,32,1,65,1,116,114,12,3,11,32,0,32,3,32,2,114,54,2,0,32,1,65,8,106,33,3,32,1,11,34,2,32,9,54,2,12,32,3,32,9,54,2,0,32,9,32,1,54,2,12,32,9,32,2,54,2,8,12,2,11,65,0,11,33,1,32,9,32,1,54,2,28,32,9,66,0,55,2,16,32,0,32,1,65,2,116,106,65,176,2,106,33,2,2,64,2,64,32,0,65,4,106,34,5,40,2,0,34,6,65,1,32,1,116,34,8,113,4,64,32,3,65,0,65,25,32,1,65,1,118,107,32,1,65,31,70,27,116,33,1,32,2,40,2,0,33,5,3,64,32,5,34,2,40,2,4,65,120,113,32,3,70,13,3,32,1,65,29,118,33,5,32,1,65,1,116,33,1,32,2,32,5,65,4,113,106,65,16,106,34,6,40,2,0,34,5,13,0,11,32,0,65,16,106,40,2,0,32,6,75,13,3,32,6,32,9,54,2,0,32,9,32,2,54,2,24,12,1,11,32,5,32,6,32,8,114,54,2,0,32,2,32,9,54,2,0,32,9,32,2,54,2,24,11,32,9,32,9,54,2,12,32,9,32,9,54,2,8,12,1,11,32,0,65,16,106,40,2,0,34,3,32,2,40,2,8,34,1,75,32,3,32,2,75,114,13,0,32,1,32,9,54,2,12,32,2,65,8,106,32,9,54,2,0,32,9,65,0,54,2,24,32,9,32,2,54,2,12,32,9,32,1,54,2,8,11,32,4,65,8,106,11,11,171,144,128,128,0,1,8,127,2,64,32,1,69,13,0,32,1,65,120,106,34,2,32,0,40,2,16,34,8,73,13,0,32,1,65,124,106,40,2,0,34,1,65,3,113,34,4,65,1,70,13,0,32,2,32,1,65,120,113,34,6,106,33,5,2,64,2,64,32,1,65,1,113,13,0,32,4,69,13,2,32,2,32,2,40,2,0,34,1,107,34,2,32,8,73,13,2,32,1,32,6,106,33,6,2,64,2,64,2,64,2,64,32,0,40,2,20,32,2,71,4,64,32,1,65,255,1,75,13,1,32,2,40,2,12,33,3,32,2,40,2,8,34,4,32,0,32,1,65,3,118,34,7,65,3,116,106,65,40,106,34,1,71,4,64,32,8,32,4,75,32,4,40,2,12,32,2,71,114,13,6,11,32,3,32,4,70,13,2,32,3,32,1,71,4,64,32,8,32,3,75,32,3,40,2,8,32,2,71,114,13,6,11,32,4,32,3,54,2,12,32,3,65,8,106,32,4,54,2,0,32,2,32,5,73,13,6,12,7,11,32,5,40,2,4,34,1,65,3,113,65,3,71,13,4,32,5,65,4,106,32,1,65,126,113,54,2,0,32,2,32,6,65,1,114,54,2,4,32,0,32,6,54,2,8,32,2,32,6,106,32,6,54,2,0,15,11,32,2,40,2,24,33,9,2,64,32,2,40,2,12,34,3,32,2,71,4,64,32,8,32,2,40,2,8,34,1,75,32,1,40,2,12,32,2,71,114,32,3,40,2,8,32,2,71,114,13,1,32,3,65,8,106,32,1,54,2,0,32,1,65,12,106,32,3,54,2,0,32,9,13,4,12,5,11,32,2,65,20,106,34,1,40,2,0,34,4,69,4,64,32,2,65,16,106,34,1,40,2,0,34,4,69,13,3,11,3,64,32,1,33,7,32,4,34,3,65,20,106,34,1,40,2,0,34,4,13,0,32,3,65,16,106,33,1,32,3,40,2,16,34,4,13,0,11,32,8,32,7,75,13,0,32,7,65,0,54,2,0,11,32,9,69,13,3,12,2,11,32,0,32,0,40,2,0,65,126,32,7,119,113,54,2,0,32,2,32,5,73,13,3,12,4,11,65,0,33,3,32,9,69,13,1,11,2,64,2,64,32,0,32,2,40,2,28,34,4,65,2,116,106,65,176,2,106,34,1,40,2,0,32,2,71,4,64,32,0,65,16,106,40,2,0,32,9,77,4,64,32,9,65,16,106,32,9,40,2,16,32,2,71,65,2,116,106,32,3,54,2,0,11,32,3,13,1,12,3,11,32,1,32,3,54,2,0,32,3,69,13,1,11,32,0,65,16,106,40,2,0,34,4,32,3,75,13,1,32,3,32,9,54,2,24,32,2,40,2,16,34,1,69,32,4,32,1,75,114,69,4,64,32,3,32,1,54,2,16,32,1,32,3,54,2,24,11,32,2,65,20,106,40,2,0,34,1,69,32,0,65,16,106,40,2,0,32,1,75,114,13,1,32,3,65,20,106,32,1,54,2,0,32,1,32,3,54,2,24,32,2,32,5,73,13,2,12,3,11,32,0,32,0,40,2,4,65,126,32,4,119,113,54,2,4,11,32,2,32,5,79,13,1,11,32,5,40,2,4,34,1,65,1,113,69,13,0,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,32,1,65,2,113,69,4,64,32,0,40,2,24,32,5,70,13,1,32,0,40,2,20,32,5,70,13,2,32,1,65,120,113,32,6,106,33,6,32,1,65,255,1,75,13,3,32,5,40,2,12,33,3,32,5,40,2,8,34,4,32,0,32,1,65,3,118,34,8,65,3,116,106,65,40,106,34,1,71,4,64,32,0,65,16,106,40,2,0,32,4,75,32,4,40,2,12,32,5,71,114,13,8,11,32,3,32,4,70,13,4,32,3,32,1,71,4,64,32,0,65,16,106,40,2,0,32,3,75,32,3,40,2,8,32,5,71,114,13,8,11,32,4,32,3,54,2,12,32,3,65,8,106,32,4,54,2,0,12,7,11,32,5,65,4,106,32,1,65,126,113,54,2,0,32,2,32,6,106,32,6,54,2,0,32,2,32,6,65,1,114,54,2,4,12,7,11,32,0,65,24,106,32,2,54,2,0,32,0,32,0,40,2,12,32,6,106,34,1,54,2,12,32,2,32,1,65,1,114,54,2,4,32,2,32,0,40,2,20,71,13,7,32,0,65,0,54,2,8,32,0,65,20,106,65,0,54,2,0,15,11,32,0,65,20,106,32,2,54,2,0,32,0,32,0,40,2,8,32,6,106,34,1,54,2,8,32,2,32,1,65,1,114,54,2,4,32,2,32,1,106,32,1,54,2,0,15,11,32,5,40,2,24,33,7,2,64,32,5,40,2,12,34,3,32,5,71,4,64,32,0,65,16,106,40,2,0,32,5,40,2,8,34,1,75,32,1,40,2,12,32,5,71,114,32,3,40,2,8,32,5,71,114,13,1,32,3,65,8,106,32,1,54,2,0,32,1,65,12,106,32,3,54,2,0,32,7,13,4,12,5,11,32,5,65,20,106,34,1,40,2,0,34,4,69,4,64,32,5,65,16,106,34,1,40,2,0,34,4,69,13,3,11,3,64,32,1,33,8,32,4,34,3,65,20,106,34,1,40,2,0,34,4,13,0,32,3,65,16,106,33,1,32,3,40,2,16,34,4,13,0,11,32,0,65,16,106,40,2,0,32,8,75,13,0,32,8,65,0,54,2,0,11,32,7,69,13,3,12,2,11,32,0,32,0,40,2,0,65,126,32,8,119,113,54,2,0,12,2,11,65,0,33,3,32,7,69,13,1,11,2,64,2,64,32,0,32,5,40,2,28,34,4,65,2,116,106,65,176,2,106,34,1,40,2,0,32,5,71,4,64,32,0,65,16,106,40,2,0,32,7,77,4,64,32,7,65,16,106,32,7,40,2,16,32,5,71,65,2,116,106,32,3,54,2,0,11,32,3,13,1,12,3,11,32,1,32,3,54,2,0,32,3,69,13,1,11,32,0,65,16,106,40,2,0,34,4,32,3,75,13,1,32,3,32,7,54,2,24,32,5,40,2,16,34,1,69,32,4,32,1,75,114,69,4,64,32,3,32,1,54,2,16,32,1,32,3,54,2,24,11,32,5,65,20,106,40,2,0,34,1,69,32,0,65,16,106,40,2,0,32,1,75,114,13,1,32,3,65,20,106,32,1,54,2,0,32,1,32,3,54,2,24,12,1,11,32,0,32,0,40,2,4,65,126,32,4,119,113,54,2,4,11,32,2,32,6,106,32,6,54,2,0,32,2,32,6,65,1,114,54,2,4,32,2,32,0,65,20,106,40,2,0,71,13,0,32,0,32,6,54,2,8,15,11,2,127,2,64,2,127,2,64,32,6,65,255,1,77,4,64,32,0,32,6,65,3,118,34,4,65,3,116,106,65,40,106,33,1,32,0,40,2,0,34,6,65,1,32,4,116,34,4,113,69,13,1,32,1,32,1,40,2,8,34,4,32,0,65,16,106,40,2,0,32,4,75,27,12,2,11,32,6,65,8,118,34,4,69,13,2,65,31,32,6,65,255,255,255,7,75,13,3,26,32,6,65,14,32,4,32,4,65,128,254,63,106,65,16,118,65,8,113,34,1,116,34,4,65,128,224,31,106,65,16,118,65,4,113,34,3,32,1,114,32,4,32,3,116,34,1,65,128,128,15,106,65,16,118,65,2,113,34,4,114,107,32,1,32,4,116,65,15,118,106,34,1,65,7,106,118,65,1,113,32,1,65,1,116,114,12,3,11,32,0,32,6,32,4,114,54,2,0,32,1,11,34,0,32,2,54,2,12,32,1,65,8,106,32,2,54,2,0,32,2,32,1,54,2,12,32,2,32,0,54,2,8,15,11,65,0,11,33,1,32,2,66,0,55,2,16,32,2,65,28,106,32,1,54,2,0,32,0,32,1,65,2,116,106,65,176,2,106,33,4,2,64,2,64,2,64,32,0,40,2,4,34,3,65,1,32,1,116,34,5,113,4,64,32,6,65,0,65,25,32,1,65,1,118,107,32,1,65,31,70,27,116,33,1,32,4,40,2,0,33,3,3,64,32,3,34,4,40,2,4,65,120,113,32,6,70,13,3,32,1,65,29,118,33,3,32,1,65,1,116,33,1,32,4,32,3,65,4,113,106,65,16,106,34,5,40,2,0,34,3,13,0,11,32,0,65,16,106,40,2,0,32,5,75,13,3,32,5,32,2,54,2,0,32,2,65,24,106,32,4,54,2,0,12,1,11,32,0,65,4,106,32,3,32,5,114,54,2,0,32,4,32,2,54,2,0,32,2,65,24,106,32,4,54,2,0,11,32,2,32,2,54,2,12,32,2,32,2,54,2,8,12,1,11,32,0,65,16,106,40,2,0,34,6,32,4,40,2,8,34,1,75,32,6,32,4,75,114,13,0,32,1,32,2,54,2,12,32,4,65,8,106,32,2,54,2,0,32,2,32,4,54,2,12,32,2,65,24,106,65,0,54,2,0,32,2,32,1,54,2,8,11,32,0,32,0,40,2,32,65,127,106,34,1,54,2,32,32,1,13,0,32,0,65,200,3,106,33,1,3,64,32,1,40,2,0,34,2,65,8,106,33,1,32,2,13,0,11,32,0,65,32,106,65,127,54,2,0,11,11,233,128,128,128,0,1,1,127,2,127,2,64,2,64,32,1,4,64,32,2,32,1,108,33,3,32,2,32,1,114,65,128,128,4,79,4,64,32,3,65,127,32,3,32,1,110,32,2,70,27,33,3,11,32,0,32,3,16,7,34,1,13,1,12,2,11,65,0,33,3,32,0,65,0,16,7,34,1,69,13,1,11,32,1,65,124,106,45,0,0,65,3,113,69,13,0,32,1,65,0,32,3,16,2,26,11,32,1,11,11,138,129,128,128,0,1,2,127,2,127,2,64,2,64,32,1,4,64,65,0,33,3,32,2,65,191,127,75,13,2,32,0,32,1,65,120,106,65,16,32,2,65,11,106,65,120,113,32,2,65,11,73,27,16,11,34,4,69,13,1,32,4,65,8,106,15,11,32,0,32,2,16,7,15,11,32,0,32,2,16,7,34,4,69,13,0,32,4,32,1,32,1,65,124,106,40,2,0,34,3,65,120,113,65,4,65,8,32,3,65,3,113,27,107,34,3,32,2,32,3,32,2,73,27,16,1,33,2,32,0,32,1,16,8,32,2,33,3,11,32,3,11,11,239,136,128,128,0,1,10,127,2,127,65,0,33,3,2,64,32,1,40,2,4,34,7,65,3,113,34,6,65,1,70,13,0,32,0,40,2,16,34,10,32,1,75,13,0,32,1,32,7,65,120,113,34,5,106,34,4,32,1,77,13,0,32,4,40,2,4,34,8,65,1,113,69,13,0,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,32,6,4,64,32,5,32,2,79,13,1,32,0,40,2,24,32,4,70,13,2,32,0,40,2,20,32,4,70,13,3,32,8,65,2,113,13,10,32,8,65,120,113,32,5,106,34,11,32,2,73,13,10,32,11,32,2,107,33,12,32,8,65,255,1,75,13,4,32,4,40,2,12,33,6,32,4,40,2,8,34,3,32,0,32,8,65,3,118,34,8,65,3,116,106,65,40,106,34,5,71,4,64,32,10,32,3,75,32,3,40,2,12,32,4,71,114,13,9,11,32,6,32,3,70,13,5,32,6,32,5,71,4,64,32,10,32,6,75,32,6,40,2,8,32,4,71,114,13,9,11,32,3,32,6,54,2,12,32,6,65,8,106,32,3,54,2,0,12,8,11,32,2,65,128,2,73,13,9,32,5,32,2,65,4,106,79,4,64,32,1,33,3,32,5,32,2,107,65,208,0,40,2,0,65,1,116,77,13,10,11,65,0,15,11,32,5,32,2,107,34,3,65,16,73,13,7,32,1,65,4,106,32,7,65,1,113,32,2,114,65,2,114,54,2,0,32,1,32,2,106,34,2,32,3,65,3,114,54,2,4,32,4,65,4,106,34,7,32,7,40,2,0,65,1,114,54,2,0,32,0,32,2,32,3,16,26,12,7,11,32,0,40,2,12,32,5,106,34,4,32,2,77,13,7,32,1,65,4,106,32,7,65,1,113,32,2,114,65,2,114,54,2,0,32,0,65,24,106,32,1,32,2,106,34,3,54,2,0,32,0,65,12,106,32,4,32,2,107,34,0,54,2,0,32,3,32,0,65,1,114,54,2,4,12,6,11,32,0,40,2,8,32,5,106,34,4,32,2,73,13,6,2,64,32,4,32,2,107,34,3,65,16,79,4,64,32,1,65,4,106,32,7,65,1,113,32,2,114,65,2,114,54,2,0,32,1,32,2,106,34,2,32,3,65,1,114,54,2,4,32,1,32,4,106,34,7,32,3,54,2,0,32,7,32,7,40,2,4,65,126,113,54,2,4,12,1,11,32,1,65,4,106,32,7,65,1,113,32,4,114,65,2,114,54,2,0,32,1,32,4,106,34,2,32,2,40,2,4,65,1,114,54,2,4,65,0,33,3,65,0,33,2,11,32,0,65,20,106,32,2,54,2,0,32,0,65,8,106,32,3,54,2,0,12,5,11,32,4,40,2,24,33,9,2,64,32,4,40,2,12,34,5,32,4,71,4,64,32,10,32,4,40,2,8,34,3,75,32,3,40,2,12,32,4,71,114,32,5,40,2,8,32,4,71,114,13,1,32,5,65,8,106,32,3,54,2,0,32,3,65,12,106,32,5,54,2,0,32,9,13,4,12,5,11,32,4,65,20,106,34,3,40,2,0,34,6,69,4,64,32,4,65,16,106,34,3,40,2,0,34,6,69,13,3,11,3,64,32,3,33,8,32,6,34,5,65,20,106,34,3,40,2,0,34,6,13,0,32,5,65,16,106,33,3,32,5,40,2,16,34,6,13,0,11,32,10,32,8,75,13,0,32,8,65,0,54,2,0,11,32,9,69,13,3,12,2,11,32,0,32,0,40,2,0,65,126,32,8,119,113,54,2,0,12,2,11,65,0,33,5,32,9,69,13,1,11,2,64,2,64,32,0,32,4,40,2,28,34,6,65,2,116,106,65,176,2,106,34,3,40,2,0,32,4,71,4,64,32,0,65,16,106,40,2,0,32,9,77,4,64,32,9,65,16,106,32,9,40,2,16,32,4,71,65,2,116,106,32,5,54,2,0,11,32,5,13,1,12,3,11,32,3,32,5,54,2,0,32,5,69,13,1,11,32,0,65,16,106,40,2,0,34,6,32,5,75,13,1,32,5,32,9,54,2,24,32,4,40,2,16,34,3,69,32,6,32,3,75,114,69,4,64,32,5,32,3,54,2,16,32,3,32,5,54,2,24,11,32,4,65,20,106,40,2,0,34,3,69,32,0,65,16,106,40,2,0,32,3,75,114,13,1,32,5,65,20,106,32,3,54,2,0,32,3,32,5,54,2,24,12,1,11,32,0,32,0,40,2,4,65,126,32,6,119,113,54,2,4,11,32,12,65,15,77,4,64,32,1,65,4,106,32,11,32,7,65,1,113,114,65,2,114,54,2,0,32,1,32,11,106,34,0,32,0,40,2,4,65,1,114,54,2,4,12,1,11,32,1,65,4,106,32,7,65,1,113,32,2,114,65,2,114,54,2,0,32,1,32,2,106,34,2,32,12,65,3,114,54,2,4,32,1,32,11,106,34,3,32,3,40,2,4,65,1,114,54,2,4,32,0,32,2,32,12,16,26,11,32,1,33,3,11,32,3,11,11,192,128,128,128,0,1,1,127,2,127,65,0,33,3,32,1,69,32,2,65,191,127,75,114,69,4,64,32,1,65,0,32,0,32,1,65,120,106,34,3,65,16,32,2,65,11,106,65,120,113,32,2,65,11,73,27,16,11,32,3,70,27,33,3,11,32,3,11,11,170,131,128,128,0,1,5,127,2,127,32,1,65,8,77,4,64,32,0,32,2,16,7,15,11,65,16,33,4,2,64,32,1,65,16,32,1,65,16,75,27,34,3,65,127,106,32,3,113,4,64,3,64,32,4,34,1,65,1,116,33,4,32,1,32,3,73,13,0,12,2,11,0,11,32,3,33,1,11,65,0,33,4,2,64,65,64,32,1,107,32,2,77,13,0,32,0,65,16,32,2,65,11,106,65,120,113,32,2,65,11,73,27,34,2,32,1,106,65,12,106,16,7,34,3,69,13,0,32,3,65,120,106,33,4,2,64,2,64,32,1,65,127,106,32,3,113,4,64,32,3,65,124,106,34,6,40,2,0,34,7,65,120,113,32,3,32,1,106,65,127,106,65,0,32,1,107,113,65,120,106,34,3,32,3,32,1,106,32,3,32,4,107,65,15,75,27,34,1,32,4,107,34,3,107,33,5,32,7,65,3,113,69,13,1,32,1,32,5,32,1,40,2,4,65,1,113,114,65,2,114,54,2,4,32,1,32,5,106,34,5,32,5,40,2,4,65,1,114,54,2,4,32,6,32,3,32,6,40,2,0,65,1,113,114,65,2,114,54,2,0,32,1,32,1,40,2,4,65,1,114,54,2,4,32,0,32,4,32,3,16,26,12,2,11,32,4,33,1,12,1,11,32,1,32,5,54,2,4,32,1,32,4,40,2,0,32,3,106,54,2,0,11,2,64,32,1,40,2,4,34,4,65,3,113,69,13,0,32,4,65,120,113,34,3,32,2,65,16,106,77,13,0,32,1,65,4,106,32,2,32,4,65,1,113,114,65,2,114,54,2,0,32,1,32,2,106,34,4,32,3,32,2,107,34,2,65,3,114,54,2,4,32,1,32,3,106,34,3,32,3,40,2,4,65,1,114,54,2,4,32,0,32,4,32,2,16,26,11,32,1,65,8,106,33,4,11,32,4,11,11,189,128,128,128,0,1,1,127,2,127,65,192,0,65,192,0,40,2,0,65,16,107,34,4,54,2,0,32,4,32,2,54,2,12,32,0,32,1,32,4,65,12,106,65,3,32,3,16,15,33,0,65,192,0,32,4,65,16,106,54,2,0,32,0,11,11,255,131,128,128,0,1,7,127,2,127,65,192,0,65,192,0,40,2,0,65,16,107,34,11,54,2,0,2,64,2,64,2,64,2,64,65,200,0,40,2,0,4,64,32,4,69,13,1,12,2,11,65,204,0,66,128,128,132,128,128,128,192,0,55,2,0,65,212,0,66,127,55,2,0,65,200,0,32,11,65,12,106,65,112,113,65,216,170,213,170,5,115,54,2,0,65,220,0,65,0,54,2,0,32,4,13,1,11,32,1,4,64,65,16,32,1,65,2,116,34,6,65,11,106,65,120,113,32,6,65,11,73,27,33,9,65,0,33,4,12,2,11,32,0,65,0,16,7,33,4,12,2,11,65,0,33,9,32,1,69,13,1,11,2,64,32,3,65,1,113,69,4,64,65,0,33,10,32,1,33,8,32,2,33,5,65,0,33,6,3,64,65,16,32,5,40,2,0,34,7,65,11,106,65,120,113,32,7,65,11,73,27,32,6,106,33,6,32,5,65,4,106,33,5,32,8,65,127,106,34,8,13,0,12,2,11,0,11,65,16,32,2,40,2,0,34,6,65,11,106,65,120,113,32,6,65,11,73,27,34,10,32,1,108,33,6,11,2,64,2,64,32,0,32,9,32,6,106,65,124,106,16,7,34,5,4,64,32,5,65,124,106,40,2,0,65,120,113,33,7,32,3,65,2,113,4,64,32,5,65,0,65,124,32,9,107,32,7,106,16,2,26,11,32,5,65,120,106,33,8,32,4,69,13,1,32,7,33,6,12,2,11,65,0,33,4,12,2,11,32,8,32,6,106,34,4,32,7,32,6,107,65,3,114,54,2,4,32,4,65,8,106,33,4,11,32,4,32,5,54,2,0,32,1,65,127,106,34,1,4,64,32,4,65,4,106,33,7,3,64,32,10,33,5,32,10,69,4,64,65,16,32,2,40,2,0,34,5,65,11,106,65,120,113,32,5,65,11,73,27,33,5,11,32,8,32,5,65,3,114,54,2,4,32,7,32,8,32,5,106,34,8,65,8,106,54,2,0,32,2,65,4,106,33,2,32,7,65,4,106,33,7,32,6,32,5,107,33,6,32,1,65,127,106,34,1,13,0,11,11,32,8,32,6,65,3,114,54,2,4,11,65,192,0,32,11,65,16,106,54,2,0,32,4,11,11,142,128,128,128,0,0,32,0,32,1,32,2,65,0,32,3,16,15,11,220,129,128,128,0,1,7,127,2,127,2,64,32,2,69,13,0,32,1,32,2,65,2,116,106,33,3,32,0,65,16,106,33,7,3,64,2,64,32,1,40,2,0,34,2,4,64,32,1,65,0,54,2,0,32,2,65,124,106,34,8,40,2,0,34,4,65,3,113,65,1,70,13,3,32,2,65,120,106,34,5,32,7,40,2,0,73,13,3,32,4,65,120,113,33,6,32,1,65,4,106,34,1,32,3,71,4,64,32,1,40,2,0,32,5,32,6,106,34,9,65,8,106,70,13,2,11,32,0,32,5,32,6,16,26,32,1,32,3,71,13,2,12,3,11,32,1,65,4,106,34,1,32,3,71,13,1,12,2,11,32,8,32,4,65,1,113,32,9,40,2,4,65,120,113,32,6,106,34,4,114,65,2,114,54,2,0,32,1,32,2,54,2,0,32,5,32,4,106,34,2,32,2,40,2,4,65,1,114,54,2,4,32,1,32,3,71,13,0,11,11,65,0,11,11,254,131,128,128,0,1,7,127,2,127,65,192,0,40,2,0,65,16,107,33,2,65,200,0,40,2,0,69,4,64,65,204,0,66,128,128,132,128,128,128,192,0,55,2,0,65,212,0,66,127,55,2,0,65,200,0,32,2,65,12,106,65,112,113,65,216,170,213,170,5,115,54,2,0,65,220,0,65,0,54,2,0,11,2,64,32,1,65,191,127,75,13,0,32,0,40,2,24,34,3,69,13,0,2,64,32,0,40,2,12,34,4,32,1,65,40,106,77,13,0,32,0,65,192,3,106,33,2,65,87,32,1,107,32,4,106,65,208,0,40,2,0,34,5,106,32,5,110,65,127,106,32,5,108,33,6,2,64,3,64,32,2,40,2,0,34,1,32,3,77,4,64,32,1,32,2,40,2,4,106,32,3,75,13,2,11,32,2,40,2,8,34,2,13,0,11,65,0,33,2,11,32,2,45,0,12,65,8,113,13,0,63,0,33,3,32,2,40,2,0,32,2,40,2,4,106,32,3,65,16,116,34,3,71,13,0,2,64,2,64,2,64,65,0,65,128,128,128,128,120,32,5,107,32,6,32,6,65,254,255,255,255,7,75,27,34,1,107,34,4,65,1,78,4,64,65,127,33,4,32,1,65,127,115,65,16,117,65,1,106,64,0,13,1,12,3,11,32,4,65,0,72,13,1,11,32,3,33,4,12,1,11,65,127,33,4,11,32,3,63,0,65,16,116,34,5,107,34,1,69,32,4,65,127,70,114,32,5,32,3,79,114,69,4,64,32,0,65,24,106,34,4,40,2,0,34,3,65,120,32,3,107,65,7,113,65,0,32,3,65,8,106,65,7,113,27,34,5,106,34,6,32,0,65,12,106,34,7,40,2,0,32,1,107,34,8,32,5,107,34,5,65,1,114,54,2,4,32,0,65,216,0,40,2,0,54,2,28,32,0,32,0,40,2,176,3,32,1,107,54,2,176,3,32,2,65,4,106,34,2,32,2,40,2,0,32,1,107,54,2,0,32,7,32,5,54,2,0,32,4,32,6,54,2,0,32,3,32,8,106,65,40,54,2,4,65,1,15,11,32,0,65,12,106,40,2,0,33,4,11,32,4,32,0,40,2,28,77,13,0,32,0,65,28,106,65,127,54,2,0,11,65,0,11,11,136,128,128,128,0,0,32,0,40,2,176,3,11,136,128,128,128,0,0,32,0,40,2,180,3,11,143,128,128,128,0,0,32,0,40,2,184,3,34,0,65,127,32,0,27,11,184,128,128,128,0,1,1,127,2,127,32,1,65,127,71,4,64,32,0,32,1,65,208,0,40,2,0,34,2,106,65,127,106,65,0,32,2,107,113,34,1,54,2,184,3,32,1,15,11,32,0,65,0,54,2,184,3,65,0,11,11,184,128,128,128,0,1,2,127,2,127,65,0,33,1,2,64,32,0,69,13,0,32,0,65,124,106,40,2,0,34,0,65,3,113,34,2,65,1,70,13,0,32,0,65,120,113,65,4,65,8,32,2,27,107,33,1,11,32,1,11,11,173,129,128,128,0,1,2,127,2,127,65,192,0,40,2,0,65,16,107,33,3,65,0,33,2,65,200,0,40,2,0,69,4,64,65,204,0,66,128,128,132,128,128,128,192,0,55,2,0,65,212,0,66,127,55,2,0,65,200,0,32,3,65,12,106,65,112,113,65,216,170,213,170,5,115,54,2,0,65,220,0,65,0,54,2,0,11,2,64,2,64,2,64,32,0,65,125,71,4,64,32,0,65,126,70,13,1,32,0,65,127,71,13,3,65,216,0,32,1,54,2,0,12,2,11,65,212,0,32,1,54,2,0,12,1,11,65,0,33,2,65,204,0,40,2,0,32,1,75,32,1,65,127,106,32,1,113,114,13,1,65,208,0,32,1,54,2,0,11,65,1,33,2,11,32,2,11,11,144,128,128,128,0,0,32,0,63,0,65,16,116,32,0,107,32,0,16,4,11,147,143,128,128,0,1,8,127,2,64,32,1,32,2,106,33,6,2,64,2,64,2,64,2,64,2,64,2,64,2,64,32,1,40,2,4,34,3,65,1,113,69,4,64,32,3,65,3,113,69,13,7,32,1,32,1,40,2,0,34,3,107,34,1,32,0,40,2,16,34,9,73,13,7,32,0,65,16,106,33,8,32,3,32,2,106,33,2,32,0,40,2,20,32,1,70,13,1,32,3,65,255,1,75,13,2,32,1,40,2,12,33,4,32,1,40,2,8,34,5,32,0,32,3,65,3,118,34,10,65,3,116,106,65,40,106,34,3,71,4,64,32,9,32,5,75,32,5,40,2,12,32,1,71,114,13,7,11,32,4,32,5,70,13,3,32,4,32,3,71,4,64,32,9,32,4,75,32,4,40,2,8,32,1,71,114,13,7,11,32,5,32,4,54,2,12,32,4,65,8,106,32,5,54,2,0,12,6,11,32,0,65,16,106,33,8,12,5,11,32,6,40,2,4,34,3,65,3,113,65,3,71,13,4,32,6,65,4,106,32,3,65,126,113,54,2,0,32,1,32,2,65,1,114,54,2,4,32,0,32,2,54,2,8,32,6,32,2,54,2,0,15,11,32,1,40,2,24,33,7,2,64,32,1,40,2,12,34,4,32,1,71,4,64,32,9,32,1,40,2,8,34,3,75,32,3,40,2,12,32,1,71,114,32,4,40,2,8,32,1,71,114,13,1,32,4,65,8,106,32,3,54,2,0,32,3,65,12,106,32,4,54,2,0,32,7,13,4,12,5,11,32,1,65,20,106,34,3,40,2,0,34,5,69,4,64,32,1,65,16,106,34,3,40,2,0,34,5,69,13,3,11,3,64,32,3,33,10,32,5,34,4,65,20,106,34,3,40,2,0,34,5,13,0,32,4,65,16,106,33,3,32,4,40,2,16,34,5,13,0,11,32,9,32,10,75,13,0,32,10,65,0,54,2,0,11,32,7,69,13,3,12,2,11,32,0,32,0,40,2,0,65,126,32,10,119,113,54,2,0,12,2,11,65,0,33,4,32,7,69,13,1,11,2,64,2,64,32,0,32,1,40,2,28,34,5,65,2,116,106,65,176,2,106,34,3,40,2,0,32,1,71,4,64,32,8,40,2,0,32,7,77,4,64,32,7,65,16,106,32,7,40,2,16,32,1,71,65,2,116,106,32,4,54,2,0,11,32,4,13,1,12,3,11,32,3,32,4,54,2,0,32,4,69,13,1,11,32,8,40,2,0,34,5,32,4,75,13,1,32,4,32,7,54,2,24,32,1,40,2,16,34,3,69,32,5,32,3,75,114,69,4,64,32,4,32,3,54,2,16,32,3,32,4,54,2,24,11,32,1,65,20,106,40,2,0,34,3,69,32,8,40,2,0,32,3,75,114,13,1,32,4,65,20,106,32,3,54,2,0,32,3,32,4,54,2,24,12,1,11,32,0,32,0,40,2,4,65,126,32,5,119,113,54,2,4,11,32,6,32,8,40,2,0,34,9,73,13,0,2,64,2,64,2,64,2,64,2,64,2,64,2,64,2,64,32,6,40,2,4,34,3,65,2,113,69,4,64,32,0,40,2,24,32,6,70,13,1,32,0,40,2,20,32,6,70,13,2,32,3,65,120,113,32,2,106,33,2,32,3,65,255,1,75,13,3,32,6,40,2,12,33,4,32,6,40,2,8,34,5,32,0,32,3,65,3,118,34,10,65,3,116,106,65,40,106,34,3,71,4,64,32,9,32,5,75,32,5,40,2,12,32,6,71,114,13,8,11,32,4,32,5,70,13,4,32,4,32,3,71,4,64,32,9,32,4,75,32,4,40,2,8,32,6,71,114,13,8,11,32,5,32,4,54,2,12,32,4,65,8,106,32,5,54,2,0,12,7,11,32,6,65,4,106,32,3,65,126,113,54,2,0,32,1,32,2,65,1,114,54,2,4,32,1,32,2,106,32,2,54,2,0,12,7,11,32,0,65,24,106,32,1,54,2,0,32,0,32,0,40,2,12,32,2,106,34,2,54,2,12,32,1,32,2,65,1,114,54,2,4,32,1,32,0,40,2,20,71,13,7,32,0,65,0,54,2,8,32,0,65,20,106,65,0,54,2,0,15,11,32,1,32,0,40,2,8,32,2,106,34,2,65,1,114,54,2,4,32,0,65,20,106,32,1,54,2,0,32,0,32,2,54,2,8,32,1,32,2,106,32,2,54,2,0,15,11,32,6,40,2,24,33,7,2,64,32,6,40,2,12,34,4,32,6,71,4,64,32,9,32,6,40,2,8,34,3,75,32,3,40,2,12,32,6,71,114,32,4,40,2,8,32,6,71,114,13,1,32,4,65,8,106,32,3,54,2,0,32,3,65,12,106,32,4,54,2,0,32,7,13,4,12,5,11,32,6,65,20,106,34,5,40,2,0,34,3,69,4,64,32,6,65,16,106,34,5,40,2,0,34,3,69,13,3,11,3,64,32,5,33,10,32,3,34,4,65,20,106,34,5,40,2,0,34,3,13,0,32,4,65,16,106,33,5,32,4,40,2,16,34,3,13,0,11,32,9,32,10,75,13,0,32,10,65,0,54,2,0,11,32,7,69,13,3,12,2,11,32,0,32,0,40,2,0,65,126,32,10,119,113,54,2,0,12,2,11,65,0,33,4,32,7,69,13,1,11,2,64,2,64,32,0,32,6,40,2,28,34,5,65,2,116,106,65,176,2,106,34,3,40,2,0,32,6,71,4,64,32,8,40,2,0,32,7,77,4,64,32,7,65,16,106,32,7,40,2,16,32,6,71,65,2,116,106,32,4,54,2,0,11,32,4,13,1,12,3,11,32,3,32,4,54,2,0,32,4,69,13,1,11,32,8,40,2,0,34,5,32,4,75,13,1,32,4,32,7,54,2,24,32,6,40,2,16,34,3,69,32,5,32,3,75,114,69,4,64,32,4,32,3,54,2,16,32,3,32,4,54,2,24,11,32,6,65,20,106,40,2,0,34,3,69,32,8,40,2,0,32,3,75,114,13,1,32,4,65,20,106,32,3,54,2,0,32,3,32,4,54,2,24,12,1,11,32,0,32,0,40,2,4,65,126,32,5,119,113,54,2,4,11,32,1,32,2,65,1,114,54,2,4,32,1,32,2,106,32,2,54,2,0,32,1,32,0,65,20,106,40,2,0,71,13,0,32,0,32,2,54,2,8,15,11,2,127,2,64,2,127,2,64,32,2,65,255,1,77,4,64,32,0,32,2,65,3,118,34,3,65,3,116,106,65,40,106,33,2,32,0,40,2,0,34,5,65,1,32,3,116,34,3,113,69,13,1,32,2,32,2,40,2,8,34,0,32,8,40,2,0,32,0,75,27,12,2,11,32,2,65,8,118,34,5,69,13,2,65,31,32,2,65,255,255,255,7,75,13,3,26,32,2,65,14,32,5,32,5,65,128,254,63,106,65,16,118,65,8,113,34,3,116,34,5,65,128,224,31,106,65,16,118,65,4,113,34,4,32,3,114,32,5,32,4,116,34,3,65,128,128,15,106,65,16,118,65,2,113,34,5,114,107,32,3,32,5,116,65,15,118,106,34,3,65,7,106,118,65,1,113,32,3,65,1,116,114,12,3,11,32,0,32,5,32,3,114,54,2,0,32,2,11,34,0,32,1,54,2,12,32,2,65,8,106,32,1,54,2,0,32,1,32,2,54,2,12,32,1,32,0,54,2,8,15,11,65,0,11,33,3,32,1,66,0,55,2,16,32,1,65,28,106,32,3,54,2,0,32,0,32,3,65,2,116,106,65,176,2,106,33,5,2,64,2,64,32,0,40,2,4,34,4,65,1,32,3,116,34,6,113,4,64,32,2,65,0,65,25,32,3,65,1,118,107,32,3,65,31,70,27,116,33,0,32,5,40,2,0,33,5,3,64,32,5,34,3,40,2,4,65,120,113,32,2,70,13,3,32,0,65,29,118,33,5,32,0,65,1,116,33,0,32,3,32,5,65,4,113,106,65,16,106,34,4,40,2,0,34,5,13,0,11,32,8,40,2,0,32,4,75,13,3,32,4,32,1,54,2,0,32,1,65,24,106,32,3,54,2,0,12,1,11,32,0,65,4,106,32,4,32,6,114,54,2,0,32,5,32,1,54,2,0,32,1,65,24,106,32,5,54,2,0,11,32,1,32,1,54,2,12,32,1,32,1,54,2,8,15,11,32,8,40,2,0,34,0,32,3,40,2,8,34,2,75,32,0,32,3,75,114,13,0,32,2,32,1,54,2,12,32,3,65,8,106,32,1,54,2,0,32,1,32,3,54,2,12,32,1,65,24,106,65,0,54,2,0,32,1,32,2,54,2,8,11,11,11,0,234,131,128,128,0,4,110,97,109,101,1,223,131,128,128,0,27,0,6,109,101,109,99,109,112,1,6,109,101,109,99,112,121,2,6,109,101,109,115,101,116,3,13,99,114,101,97,116,101,95,109,115,112,97,99,101,4,23,99,114,101,97,116,101,95,109,115,112,97,99,101,95,119,105,116,104,95,98,97,115,101,5,25,109,115,112,97,99,101,95,116,114,97,99,107,95,108,97,114,103,101,95,99,104,117,110,107,115,6,14,100,101,115,116,114,111,121,95,109,115,112,97,99,101,7,13,109,115,112,97,99,101,95,109,97,108,108,111,99,8,11,109,115,112,97,99,101,95,102,114,101,101,9,13,109,115,112,97,99,101,95,99,97,108,108,111,99,10,14,109,115,112,97,99,101,95,114,101,97,108,108,111,99,11,17,116,114,121,95,114,101,97,108,108,111,99,95,99,104,117,110,107,12,23,109,115,112,97,99,101,95,114,101,97,108,108,111,99,95,105,110,95,112,108,97,99,101,13,15,109,115,112,97,99,101,95,109,101,109,97,108,105,103,110,14,25,109,115,112,97,99,101,95,105,110,100,101,112,101,110,100,101,110,116,95,99,97,108,108,111,99,15,6,105,97,108,108,111,99,16,27,109,115,112,97,99,101,95,105,110,100,101,112,101,110,100,101,110,116,95,99,111,109,97,108,108,111,99,17,16,109,115,112,97,99,101,95,98,117,108,107,95,102,114,101,101,18,11,109,115,112,97,99,101,95,116,114,105,109,19,16,109,115,112,97,99,101,95,102,111,111,116,112,114,105,110,116,20,20,109,115,112,97,99,101,95,109,97,120,95,102,111,111,116,112,114,105,110,116,21,22,109,115,112,97,99,101,95,102,111,111,116,112,114,105,110,116,95,108,105,109,105,116,22,26,109,115,112,97,99,101,95,115,101,116,95,102,111,111,116,112,114,105,110,116,95,108,105,109,105,116,23,18,109,115,112,97,99,101,95,117,115,97,98,108,101,95,115,105,122,101,24,14,109,115,112,97,99,101,95,109,97,108,108,111,112,116,25,11,109,115,112,97,99,101,95,105,110,105,116,26,13,100,105,115,112,111,115,101,95,99,104,117,110,107])

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "// part of ECMS2017\n// declare class Math {\n//     static abs(x: float32): float32;\n//     static acos(x: float64): float64;\n//     static asin(x: float64): float64;\n//     static atan(x: float64): float64;\n//     static atan2(y: float64, x: float64): float64;\n//     static ceil(x: float32): float32;\n//     static cos(x: float64): float64;\n//     static exp(x: float64): float64;\n//     static floor(x: float32): float32;\n//     static log(x: float64): float64;\n//     // static max(...values: float64[]): float64;\n//     static max(a: float64, b:float64): float64;\n//     // static min(...values: float64[]): float64;\n//     static min(a: float64, b:float64): float64;\n//     static pow(x: float64, y: float64): float64;\n//     static random(): float64; // 'random' is not a standard Math builtin\n//     // static round(x: float64): float64; //'round' is not a standard Math builtin\n//     static sin(x: float64): float64;\n//     static sqrt(x: float32): float32;\n//     static tan(x: float64): float64;\n//     static imul(a: int32, b:int32): int32;\n// }\n//\n// function absf32(x:float32):float32{\n//     return Math.abs(x) as float32;\n// }\n//\n// function sqrtf32(x:float32):float32{\n//     return Math.sqrt(x);\n// }\n//\n// function powf32(x:float32, y:float32):float32{\n//     return Math.pow(x as float64, y as float64) as float32;\n// }\n//\n// function minf32(x:float32, y:float32):float32{\n//     return Math.min(x as float64, y as float64) as float32;\n// }\n// function maxf32(x:float32, y:float32):float32{\n//     return Math.max(x as float64, y as float64) as float32;\n// }\n//\n// declare function modf32(a:float32, b:float32):float32;\n// declare function modf64(a:float64, b:float64):float64;\n"

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = "class Array<T> {\n\n    bytesLength: int32;\n    elementSize: int32;\n\n    constructor(bytesLength: int32, elementSize: int32) {\n        this.bytesLength = bytesLength;\n        this.elementSize = elementSize;\n    }\n\n    operator [] (index: int32): T {\n        let stripe = index * this.elementSize;\n        if (stripe >= 0 && stripe < this.bytesLength) {\n            return *((this as *uint8 + 8 + stripe) as *T);\n        }\n        return null as T;\n    }\n\n    operator []= (index: int32, value: T): void {\n        let stripe = index * this.elementSize;\n        if (stripe >= 0 && stripe < this.bytesLength) {\n            *((this as *uint8 + 8 + stripe) as *T) = value;\n        }\n    }\n\n    get length(): int32 {\n        return this.bytesLength / this.elementSize;\n    }\n}\n\n//declare type Int32Array   = Array< int32 >\n//declare type Uint32Array  = Array< uint32 >\n//declare type Int64Array   = Array< int64 >\n//declare type Uint64Array  = Array< uint64 >\n//declare type Float32Array = Array< float32 >\n//declare type Float64Array = Array< float64 >\n"

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = "import {mspace_init, mspace_malloc, mspace_free} from \"/library/dlmalloc.wasm\";\n// declare function mspace_init(base:int32):int32;\n// declare function mspace_malloc(base:int32, size:int32):int32;\n// declare function mspace_free(base:int32, size:int32):void;\n\nlet HEAP_BASE: int32 = null;\nlet HEAP_TOP: int32 = null;\n\nexport function malloc(value:int32):int32 {\n    return mspace_malloc(HEAP_BASE, value);\n}\nexport function free(value:int32):void {\n    mspace_free(HEAP_BASE, value);\n}\n"

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = "const PI:float64 = 3.141592653589793;\n\nconst MAX_UNSIGNED_INTEGER_32:uint32 = 4294967295;\n\nconst MIN_INTEGER_32:int32 = -2147483648;\nconst MAX_INTEGER_32:int32 = 2147483647;\n\nconst MAX_UNSIGNED_INTEGER_64:int32 = 18446744073709551615;\n\n// −(2^63) to 2^63 − 1\n// const MIN_INTEGER_64:int32 = -powi64(2, 63);\n// const MAX_INTEGER_64:int32 = powi64(2, 63) - 1;\n\n// float remainder\n\n // export function modf64(x:float64, y:float64):float64{\n //\n //         let ir:int32,iy:int32;\n //         let r:float64,w:float64;\n //\n //         if (y == 0 || isNaN(y) || !isFinite(x)) {\n //             return (x * y) / (x * y);\n //         }\n //\n //         r = abs(x);\n //         y = abs(y);\n //         (void)frexp(y,&iy);\n //         while (r >= y) {\n //             (void)frexp(r,&ir);\n //             w = ldexp(y,ir-iy);\n //             r -= w <= r ? w : w*(double)0.5;\n //         }\n //         return x >= (double)0 ? r : -r;\n //     }\n // }"

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = "// Native types\n// TODO vs common/types vs turbo/types ?\nconst NaN:      float64 = 0.0 / 0.0;\nconst Infinity: float64 = 1.0 / 0.0;\n\nfunction isNaN(value: float32): boolean {\n    return value != value;\n}\n\nfunction isFinite(value: float32): boolean {\n    return !isNaN(value) && value != Infinity && value != -Infinity;\n}\n\ndeclare class boolean {\n    toString(): string;\n}\n\ndeclare class int8 {\n    toString(): string;\n}\n\ndeclare class uint8 {\n    toString(): string;\n}\n\ndeclare class int16 {\n    toString(): string;\n}\n\ndeclare class uint16 {\n    toString(): string;\n}\n\ndeclare class int32 {\n    toString(): string;\n}\n\n// alias int int32\n// declare class int extends int32 {\n//     toString(): string;\n// }\n\n\ndeclare class uint32 {\n    toString(): string;\n}\n\ndeclare class int64 {\n    toString(): string;\n}\n\ndeclare class uint64 {\n    toString(): string;\n}\n\ndeclare class float32 {\n    toString(): string;\n}\n\ndeclare class float64 {\n    toString(): string;\n}\n\ndeclare class string {\n    charAt(index: int32): string;\n\n    charCodeAt(index: int32): uint16;\n\n    get length(): int32;\n\n    indexOf(text: string): int32;\n\n    lastIndexOf(text: string): int32;\n\n    operator == (other: string):boolean;\n    operator [] (index: int32): uint16 { return this.charCodeAt(index); }\n    slice(start: int32, ends: int32): string;\n\n    // startsWith(text: string): boolean { return this.slice(0, text.length) == text; }\n    // endsWith(text: string): boolean { return this.slice(-text.length, this.length) == text; }\n}\n"

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = "// TODO vs common/types vs turbo/types ?\ndeclare class boolean {\n    toString(): string;\n}\n\ndeclare class int8 {\n    toString(): string;\n}\n\ndeclare class uint8 {\n    toString(): string;\n}\n\ndeclare class int16 {\n    toString(): string;\n}\n\ndeclare class uint16 {\n    toString(): string;\n}\n\ndeclare class int32 {\n    toString(): string;\n}\n\ndeclare class uint32 {\n    toString(): string;\n}\n\ndeclare class int64 {\n    toString(): string;\n}\n\ndeclare class uint64 {\n    toString(): string;\n}\n\ndeclare class float32 {\n    toString(): string;\n}\n\ndeclare class float64 {\n    toString(): string;\n}\n\ndeclare class string {\n    charAt(index: int32): string;\n    charCodeAt(index: int32): uint16;\n    get length(): int32;\n    indexOf(text: string): int32;\n    lastIndexOf(text: string): int32;\n    operator == (other: string): boolean;\n    operator [] (index: int32): uint16 { return this.charCodeAt(index); }\n    slice(start: int32, ends: int32): string;\n\n    startsWith(text: string): boolean { return this.slice(0, text.length) == text; }\n    endsWith(text: string): boolean { return this.slice(-text.length, this.length) == text; }\n}\n"

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = "function TurboWrapper(exports, buffer) {\n\n    var HEAP8 = new Int8Array(buffer);\n    var HEAP16 = new Int16Array(buffer);\n    var HEAP32 = new Int32Array(buffer);\n    var HEAPU8 = new Uint8Array(buffer);\n    var HEAPU16 = new Uint16Array(buffer);\n    var HEAPU32 = new Uint32Array(buffer);\n    var HEAPF32 = new Float32Array(buffer);\n    var HEAPF64 = new Float64Array(buffer);\n\n    return {\n        exports: exports,\n        RAW_MEMORY: buffer,\n\n        getMemoryUsage: function () {\n            const top = Atomics.load(HEAP32, 2);\n            // top -= freeMemory;\n            return Math.fround(top / (1024 * 1024));\n        }\n    }\n}\nfunction initTurbo(MB) {\n    var buffer = new SharedArrayBuffer(MB * 1024 * 1024);\n\n    if (buffer.byteLength < 16) {\n        throw new Error(\"The memory is too small even for metadata\");\n    }\n\n    return TurboWrapper(TurboModule(\n        typeof global !== 'undefined' ? global : window,\n        typeof env !== 'undefined' ? env : {\n            STACKTOP: 8,\n            STACK_MAX: 8\n        },\n        buffer\n    ), buffer);\n}\n"

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "// WebAssembly builtin functions\ndeclare function rotl(value: int64, shift: int64): int64;\ndeclare function rotl32(value: int32, shift: int32): int32;\ndeclare function rotr(value: int64, shift: int64): int64;\ndeclare function rotr32(value: int32, shift: int32): int32;\ndeclare function clz(value: int64): int64;\ndeclare function clz32(value: int32): int32;\ndeclare function ctz(value: int64): int64;\ndeclare function ctz32(value: int32): int32;\ndeclare function popcnt(value: int64): int64;\ndeclare function popcnt32(value: int32): int32;\ndeclare function abs(value: float64): float64;\ndeclare function abs32(value: float32): float32;\ndeclare function ceil(value: float64): float64;\ndeclare function ceil32(value: float32): float32;\ndeclare function floor(value: float64): float64;\ndeclare function floor32(value: float32): float32;\ndeclare function sqrt(value: float64): float64;\ndeclare function sqrt32(value: float32): float32;\ndeclare function trunc(value: float64): float64;\ndeclare function trunc32(value: float32): float32;\ndeclare function nearest(value: float64): float64;\ndeclare function nearest32(value: float32): float32;\ndeclare function min(left: float64, right: float64): float64;\ndeclare function min32(left: float32, right: float32): float32;\ndeclare function max(left: float64, right: float64): float64;\ndeclare function max32(left: float32, right: float32): float32;\ndeclare function copysign(left: float64, right: float64): float64;\ndeclare function copysign32(left: float32, right: float32): float32;\ndeclare function reinterpret_i32(value: float32): int32;\ndeclare function reinterpret_i64(value: float64): int64;\ndeclare function reinterpret_f32(value: int32): float32;\ndeclare function reinterpret_f64(value: int64): float64;\ndeclare function current_memory(): int32;\ndeclare function grow_memory(value: int32): int32;\n"

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "/**\n * Created by n.vinayakan on 30.05.17.\n * WebAssembly start function where global variable expressions initializer\n */\n@start\nfunction __WASM_INITIALIZER(): void {\n    // 🔥 WARNING 🔥\n    // DON'T RETURN ANYTHING FROM THIS FUNCTION\n    // Global variable initialization expressions will be appended to this function\n    HEAP_TOP = HEAP_BASE;\n}\n"

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = "/**\n * Created by 01 on 2017-06-26.\n */\nturbo = typeof turbo === \"undefined\" ? {} : turbo;\n(function (turbo) {\n    \"use strict\";\n    if (typeof WebAssembly === \"undefined\") {\n        console.error(\"Sorry, Your environment doesn't support WebAssembly!\");\n        return;\n    }\n    function fetchBinary(file) {\n        \"use strict\";\n        return fetch(file).then(data => data.arrayBuffer());\n    }\n\n    if (turbo.mallocModule === undefined) {\n        fetchBinary(\"library.wasm\").then(malloc => {\n            turbo.mallocModule = new WebAssembly.Module(malloc);\n            initialize();\n        });\n    } else {\n        initialize();\n    }\n\n    function initialize() {\n        fetchBinary(__TURBO_WASM__).then(data => {\n            WebAssembly.instantiate(turbo.mallocModule).then(result => {\n                let mallocInstance = result;\n                let turboModule;\n                let turboInstance;\n                WebAssembly.instantiate(data, {Math: Math, internal: mallocInstance.exports}).then(result => {\n                    \"use strict\";\n                    turboModule = result.module;\n                    turboInstance = result.instance;\n                });\n            });\n        });\n    }\n})(turbo);\n"

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = __webpack_require__(7);
const type_1 = __webpack_require__(24);
const node_1 = __webpack_require__(10);
const compile_target_1 = __webpack_require__(9);
const log_1 = __webpack_require__(5);
const scope_1 = __webpack_require__(23);
const utils_1 = __webpack_require__(8);
const const_1 = __webpack_require__(51);
const assert_1 = __webpack_require__(3);
const compiler_1 = __webpack_require__(12);
const terminal_1 = __webpack_require__(2);
/**
 * Author : Nidin Vinayakan
 */
class CheckContext {
    allocateGlobalVariableOffset(sizeOf, alignmentOf) {
        let offset = utils_1.alignToNextMultipleOf(this.nextGlobalVariableOffset, alignmentOf);
        this.nextGlobalVariableOffset = offset + sizeOf;
        return offset;
    }
}
exports.CheckContext = CheckContext;
function addScopeToSymbol(symbol, parentScope) {
    let scope = new scope_1.Scope();
    scope.parent = parentScope;
    scope.symbol = symbol;
    symbol.scope = scope;
}
exports.addScopeToSymbol = addScopeToSymbol;
function linkSymbolToNode(symbol, node) {
    node.symbol = symbol;
    node.scope = symbol.scope;
    symbol.range = node.internalRange != null ? node.internalRange : node.range;
    symbol.node = node;
}
exports.linkSymbolToNode = linkSymbolToNode;
var CheckMode;
(function (CheckMode) {
    CheckMode[CheckMode["NORMAL"] = 0] = "NORMAL";
    CheckMode[CheckMode["INITIALIZE"] = 1] = "INITIALIZE";
})(CheckMode = exports.CheckMode || (exports.CheckMode = {}));
function initialize(context, node, parentScope, mode) {
    let kind = node.kind;
    if (node.parent != null) {
        let parentKind = node.parent.kind;
        // Validate node placement
        if (kind != node_1.NodeKind.IMPORTS &&
            kind != node_1.NodeKind.VARIABLE &&
            kind != node_1.NodeKind.VARIABLES &&
            (kind != node_1.NodeKind.FUNCTION || parentKind != node_1.NodeKind.CLASS) &&
            (parentKind == node_1.NodeKind.FILE || parentKind == node_1.NodeKind.GLOBAL) != (parentKind == node_1.NodeKind.MODULE ||
                kind == node_1.NodeKind.MODULE ||
                kind == node_1.NodeKind.CLASS ||
                kind == node_1.NodeKind.ENUM ||
                kind == node_1.NodeKind.FUNCTION ||
                kind == node_1.NodeKind.CONSTANTS)) {
            context.log.error(node.range, "This statement is not allowed here");
        }
    }
    // Module
    if (kind == node_1.NodeKind.MODULE) {
        assert_1.assert(node.symbol == null);
        let symbol = new symbol_1.Symbol();
        symbol.kind = symbol_1.SymbolKind.TYPE_MODULE;
        symbol.name = node.stringValue;
        symbol.resolvedType = new type_1.Type();
        symbol.resolvedType.symbol = symbol;
        symbol.flags = symbol_1.SYMBOL_FLAG_IS_REFERENCE;
        addScopeToSymbol(symbol, parentScope);
        linkSymbolToNode(symbol, node);
        parentScope.define(context.log, symbol, scope_1.ScopeHint.NORMAL);
        parentScope = symbol.scope;
    }
    // Class
    if (kind == node_1.NodeKind.CLASS || kind == node_1.NodeKind.ENUM) {
        assert_1.assert(node.symbol == null);
        let symbol = new symbol_1.Symbol();
        symbol.kind = kind == node_1.NodeKind.CLASS ? symbol_1.SymbolKind.TYPE_CLASS : symbol_1.SymbolKind.TYPE_ENUM;
        symbol.name = node.stringValue;
        symbol.resolvedType = new type_1.Type();
        symbol.resolvedType.symbol = symbol;
        symbol.flags = symbol_1.SYMBOL_FLAG_IS_REFERENCE;
        addScopeToSymbol(symbol, parentScope);
        linkSymbolToNode(symbol, node);
        parentScope.define(context.log, symbol, scope_1.ScopeHint.NORMAL);
        parentScope = symbol.scope;
        if (node.parameterCount() > 0) {
            //Class has generic parameters. convert it to class template
            symbol.kind = symbol_1.SymbolKind.TYPE_TEMPLATE;
            symbol.flags |= symbol_1.SYMBOL_FLAG_IS_TEMPLATE;
            //TODO: Lift generic parameter limit from 1 to many
            let genericType = node.firstGenericType();
            let genericSymbol = new symbol_1.Symbol();
            genericSymbol.kind = symbol_1.SymbolKind.TYPE_GENERIC;
            genericSymbol.name = genericType.stringValue;
            genericSymbol.resolvedType = new type_1.Type();
            genericSymbol.resolvedType.symbol = genericSymbol;
            genericSymbol.flags = symbol_1.SYMBOL_FLAG_IS_GENERIC;
            genericType.flags = node_1.NODE_FLAG.GENERIC;
            addScopeToSymbol(genericSymbol, parentScope);
            linkSymbolToNode(genericSymbol, genericType);
            parentScope.define(context.log, genericSymbol, scope_1.ScopeHint.NORMAL);
        }
    }
    else if (kind == node_1.NodeKind.FUNCTION) {
        assert_1.assert(node.symbol == null);
        let symbol = new symbol_1.Symbol();
        symbol.kind =
            node.parent.kind == node_1.NodeKind.CLASS ? symbol_1.SymbolKind.FUNCTION_INSTANCE :
                symbol_1.SymbolKind.FUNCTION_GLOBAL;
        symbol.name = node.stringValue;
        if (node.isOperator()) {
            if (symbol.name == "+" || symbol.name == "-") {
                if (node.functionFirstArgument() == node.functionReturnType()) {
                    symbol.flags = symbol_1.SYMBOL_FLAG_IS_UNARY_OPERATOR;
                    symbol.rename = symbol.name == "+" ? "op_positive" : "op_negative";
                }
                else {
                    symbol.flags = symbol_1.SYMBOL_FLAG_IS_BINARY_OPERATOR;
                    symbol.rename = symbol.name == "+" ? "op_add" : "op_subtract";
                }
            }
            else {
                symbol.rename =
                    symbol.name == "%" ? "op_remainder" :
                        symbol.name == "&" ? "op_and" :
                            symbol.name == "*" ? "op_multiply" :
                                symbol.name == "**" ? "op_exponent" :
                                    symbol.name == "++" ? "op_increment" :
                                        symbol.name == "--" ? "op_decrement" :
                                            symbol.name == "/" ? "op_divide" :
                                                symbol.name == "<" ? "op_lessThan" :
                                                    symbol.name == "<<" ? "op_shiftLeft" :
                                                        symbol.name == "==" ? "op_equals" :
                                                            symbol.name == ">" ? "op_greaterThan" :
                                                                symbol.name == ">>" ? "op_shiftRight" :
                                                                    symbol.name == "[]" ? "op_get" :
                                                                        symbol.name == "[]=" ? "op_set" :
                                                                            symbol.name == "^" ? "op_xor" :
                                                                                symbol.name == "|" ? "op_or" :
                                                                                    symbol.name == "~" ? "op_complement" :
                                                                                        null;
            }
        }
        if (symbol.name == "constructor") {
            symbol.rename = "_ctr";
        }
        addScopeToSymbol(symbol, parentScope);
        linkSymbolToNode(symbol, node);
        parentScope.define(context.log, symbol, symbol.isSetter() ? scope_1.ScopeHint.NOT_GETTER :
            symbol.isGetter() ? scope_1.ScopeHint.NOT_SETTER :
                symbol.isBinaryOperator() ? scope_1.ScopeHint.NOT_UNARY :
                    symbol.isUnaryOperator() ? scope_1.ScopeHint.NOT_BINARY :
                        scope_1.ScopeHint.NORMAL);
        parentScope = symbol.scope;
        // All instance functions have a special "this" type
        if (symbol.kind == symbol_1.SymbolKind.FUNCTION_INSTANCE) {
            let parent = symbol.parent();
            initializeSymbol(context, parent);
            if (symbol.name == "constructor") {
                let body = node.functionBody();
                if (body !== null) {
                    let variablesNode = body.firstChild;
                    if (variablesNode === undefined) {
                        let _variablesNode = node_1.createVariables();
                        body.appendChild(_variablesNode);
                        variablesNode = _variablesNode;
                    }
                    else if (variablesNode.kind !== node_1.NodeKind.VARIABLES) {
                        let _variablesNode = node_1.createVariables();
                        body.insertChildBefore(variablesNode, _variablesNode);
                        variablesNode = _variablesNode;
                    }
                    let firstVariable = variablesNode.firstChild;
                    if (firstVariable !== undefined) {
                        if (firstVariable.stringValue !== "this") {
                            variablesNode.insertChildBefore(firstVariable, node_1.createVariable("this", node_1.createType(parent.resolvedType), null));
                        }
                        else if (firstVariable.stringValue === "this" && firstVariable.firstChild.resolvedType === undefined) {
                            firstVariable.firstChild.resolvedType = parent.resolvedType;
                        }
                    }
                    else {
                        variablesNode.appendChild(node_1.createVariable("this", node_1.createType(parent.resolvedType), null));
                    }
                    // All constructors have special return "this" type
                    let returnNode = node_1.createReturn(node_1.createName("this"));
                    if (node.lastChild.lastChild && node.lastChild.lastChild.kind == node_1.NodeKind.RETURN) {
                        node.lastChild.lastChild.remove();
                    }
                    node.lastChild.appendChild(returnNode);
                }
            }
            else {
                let firstArgument = node.functionFirstArgument();
                if (firstArgument.stringValue !== "this") {
                    node.insertChildBefore(firstArgument, node_1.createVariable("this", node_1.createType(parent.resolvedType), null));
                }
                else if (firstArgument.stringValue === "this" && firstArgument.firstChild.resolvedType === undefined) {
                    firstArgument.firstChild.resolvedType = parent.resolvedType;
                }
            }
        }
    }
    else if (kind == node_1.NodeKind.VARIABLE) {
        assert_1.assert(node.symbol == null);
        let symbol = new symbol_1.Symbol();
        symbol.kind =
            node.parent.kind == node_1.NodeKind.CLASS ? symbol_1.SymbolKind.VARIABLE_INSTANCE :
                node.parent.kind == node_1.NodeKind.FUNCTION ? symbol_1.SymbolKind.VARIABLE_ARGUMENT :
                    node.parent.kind == node_1.NodeKind.CONSTANTS || node.parent.kind == node_1.NodeKind.ENUM ? symbol_1.SymbolKind.VARIABLE_CONSTANT :
                        node.parent.kind == node_1.NodeKind.VARIABLES && node.parent.parent.kind == node_1.NodeKind.FILE ? symbol_1.SymbolKind.VARIABLE_GLOBAL :
                            symbol_1.SymbolKind.VARIABLE_LOCAL;
        symbol.name = node.stringValue;
        symbol.scope = parentScope;
        linkSymbolToNode(symbol, node);
        parentScope.define(context.log, symbol, scope_1.ScopeHint.NORMAL);
    }
    else if (kind == node_1.NodeKind.BLOCK) {
        if (node.parent.kind != node_1.NodeKind.FUNCTION) {
            let scope = new scope_1.Scope();
            scope.parent = parentScope;
            parentScope = scope;
        }
        node.scope = parentScope;
    }
    // Children
    let child = node.firstChild;
    while (child != null) {
        if (mode == CheckMode.INITIALIZE) {
            child.flags |= node_1.NODE_FLAG.LIBRARY;
        }
        initialize(context, child, parentScope, mode);
        child = child.nextSibling;
    }
    if (kind == node_1.NodeKind.FILE && mode == CheckMode.INITIALIZE) {
        context.booleanType = parentScope.findLocal("boolean", scope_1.ScopeHint.NORMAL).resolvedType;
        context.uint8Type = parentScope.findLocal("uint8", scope_1.ScopeHint.NORMAL).resolvedType;
        context.int32Type = parentScope.findLocal("int32", scope_1.ScopeHint.NORMAL).resolvedType;
        context.int64Type = parentScope.findLocal("int64", scope_1.ScopeHint.NORMAL).resolvedType;
        context.int8Type = parentScope.findLocal("int8", scope_1.ScopeHint.NORMAL).resolvedType;
        context.int16Type = parentScope.findLocal("int16", scope_1.ScopeHint.NORMAL).resolvedType;
        context.stringType = parentScope.findLocal("string", scope_1.ScopeHint.NORMAL).resolvedType;
        context.uint32Type = parentScope.findLocal("uint32", scope_1.ScopeHint.NORMAL).resolvedType;
        context.uint64Type = parentScope.findLocal("uint64", scope_1.ScopeHint.NORMAL).resolvedType;
        context.uint16Type = parentScope.findLocal("uint16", scope_1.ScopeHint.NORMAL).resolvedType;
        context.float32Type = parentScope.findLocal("float32", scope_1.ScopeHint.NORMAL).resolvedType;
        context.float64Type = parentScope.findLocal("float64", scope_1.ScopeHint.NORMAL).resolvedType;
        prepareNativeType(context.booleanType, 1, 0);
        prepareNativeType(context.uint8Type, 1, symbol_1.SYMBOL_FLAG_NATIVE_INTEGER | symbol_1.SYMBOL_FLAG_IS_UNSIGNED);
        prepareNativeType(context.int8Type, 1, symbol_1.SYMBOL_FLAG_NATIVE_INTEGER);
        prepareNativeType(context.int16Type, 2, symbol_1.SYMBOL_FLAG_NATIVE_INTEGER);
        prepareNativeType(context.uint16Type, 2, symbol_1.SYMBOL_FLAG_NATIVE_INTEGER | symbol_1.SYMBOL_FLAG_IS_UNSIGNED);
        prepareNativeType(context.int32Type, 4, symbol_1.SYMBOL_FLAG_NATIVE_INTEGER);
        prepareNativeType(context.int64Type, 8, symbol_1.SYMBOL_FLAG_NATIVE_LONG);
        prepareNativeType(context.uint32Type, 4, symbol_1.SYMBOL_FLAG_NATIVE_INTEGER | symbol_1.SYMBOL_FLAG_IS_UNSIGNED);
        prepareNativeType(context.uint64Type, 8, symbol_1.SYMBOL_FLAG_NATIVE_LONG | symbol_1.SYMBOL_FLAG_IS_UNSIGNED);
        prepareNativeType(context.stringType, 4, symbol_1.SYMBOL_FLAG_IS_REFERENCE);
        prepareNativeType(context.float32Type, 4, symbol_1.SYMBOL_FLAG_NATIVE_FLOAT);
        prepareNativeType(context.float64Type, 8, symbol_1.SYMBOL_FLAG_NATIVE_DOUBLE);
    }
}
exports.initialize = initialize;
function prepareNativeType(type, byteSizeAndMaxAlignment, flags) {
    let symbol = type.symbol;
    symbol.kind = symbol_1.SymbolKind.TYPE_NATIVE;
    symbol.byteSize = byteSizeAndMaxAlignment;
    symbol.maxAlignment = byteSizeAndMaxAlignment;
    symbol.flags = flags;
}
function forbidFlag(context, node, flag, text) {
    if ((node.flags & flag) != 0) {
        let range = node_1.rangeForFlag(node.firstFlag, flag);
        if (range != null) {
            node.flags = node.flags & ~flag;
            context.log.error(range, text);
        }
    }
}
exports.forbidFlag = forbidFlag;
function requireFlag(context, node, flag, text) {
    if ((node.flags & flag) == 0) {
        node.flags = node.flags | flag;
        context.log.error(node.range, text);
    }
}
exports.requireFlag = requireFlag;
function initializeSymbol(context, symbol) {
    if (symbol.state == symbol_1.SymbolState.INITIALIZED) {
        assert_1.assert(symbol.resolvedType != null);
        return;
    }
    assert_1.assert(symbol.state == symbol_1.SymbolState.UNINITIALIZED);
    symbol.state = symbol_1.SymbolState.INITIALIZING;
    // Most flags aren't supported yet
    let node = symbol.node;
    // forbidFlag(context, node, NODE_FLAG.EXPORT, "Unsupported flag 'export'");
    forbidFlag(context, node, node_1.NODE_FLAG.PROTECTED, "Unsupported flag 'protected'");
    //forbidFlag(context, node, NODE_FLAG.STATIC, "Unsupported flag 'static'");
    // Module
    if (symbol.kind == symbol_1.SymbolKind.TYPE_MODULE) {
        forbidFlag(context, node, node_1.NODE_FLAG.GET, "Cannot use 'get' on a namespace");
        forbidFlag(context, node, node_1.NODE_FLAG.SET, "Cannot use 'set' on a namespace");
        forbidFlag(context, node, node_1.NODE_FLAG.PUBLIC, "Cannot use 'public' on a namespace");
        forbidFlag(context, node, node_1.NODE_FLAG.PRIVATE, "Cannot use 'private' on a namespace");
    }
    else if (symbol.kind == symbol_1.SymbolKind.TYPE_CLASS || symbol.kind == symbol_1.SymbolKind.TYPE_NATIVE ||
        symbol.kind == symbol_1.SymbolKind.TYPE_GENERIC || symbol.kind == symbol_1.SymbolKind.TYPE_TEMPLATE) {
        forbidFlag(context, node, node_1.NODE_FLAG.GET, "Cannot use 'get' on a class");
        forbidFlag(context, node, node_1.NODE_FLAG.SET, "Cannot use 'set' on a class");
        forbidFlag(context, node, node_1.NODE_FLAG.PUBLIC, "Cannot use 'public' on a class");
        forbidFlag(context, node, node_1.NODE_FLAG.PRIVATE, "Cannot use 'private' on a class");
    }
    else if (symbol.kind == symbol_1.SymbolKind.TYPE_INTERFACE) {
        forbidFlag(context, node, node_1.NODE_FLAG.GET, "Cannot use 'get' on a interface");
        forbidFlag(context, node, node_1.NODE_FLAG.SET, "Cannot use 'set' on a interface");
        forbidFlag(context, node, node_1.NODE_FLAG.PUBLIC, "Cannot use 'public' on a interface");
        forbidFlag(context, node, node_1.NODE_FLAG.PRIVATE, "Cannot use 'private' on a interface");
    }
    else if (symbol.kind == symbol_1.SymbolKind.TYPE_ENUM) {
        forbidFlag(context, node, node_1.NODE_FLAG.GET, "Cannot use 'get' on an enum");
        forbidFlag(context, node, node_1.NODE_FLAG.SET, "Cannot use 'set' on an enum");
        forbidFlag(context, node, node_1.NODE_FLAG.PUBLIC, "Cannot use 'public' on an enum");
        forbidFlag(context, node, node_1.NODE_FLAG.PRIVATE, "Cannot use 'private' on an enum");
        symbol.resolvedType = new type_1.Type();
        symbol.resolvedType.symbol = symbol;
        let underlyingSymbol = symbol.resolvedType.underlyingType(context).symbol;
        symbol.byteSize = underlyingSymbol.byteSize;
        symbol.maxAlignment = underlyingSymbol.maxAlignment;
    }
    else if (symbol_1.isFunction(symbol.kind)) {
        let body = node.functionBody();
        let returnType = node.functionReturnType();
        let oldUnsafeAllowed = context.isUnsafeAllowed;
        context.isUnsafeAllowed = node.isUnsafe();
        resolveAsType(context, returnType, symbol.scope.parent);
        if (returnType.resolvedType.isClass() && returnType.hasParameters() && node.parent != returnType.resolvedType.symbol.node) {
            deriveConcreteClass(context, returnType, [returnType.firstChild.firstChild], returnType.resolvedType.symbol.scope);
        }
        let argumentCount = 0;
        let child = node.functionFirstArgument();
        while (child != returnType) {
            assert_1.assert(child.kind == node_1.NodeKind.VARIABLE);
            assert_1.assert(child.symbol.kind == symbol_1.SymbolKind.VARIABLE_ARGUMENT);
            initializeSymbol(context, child.symbol);
            child.symbol.offset = argumentCount;
            argumentCount = argumentCount + 1;
            child = child.nextSibling;
        }
        if (symbol.kind != symbol_1.SymbolKind.FUNCTION_INSTANCE) {
            forbidFlag(context, node, node_1.NODE_FLAG.GET, "Cannot use 'get' here");
            forbidFlag(context, node, node_1.NODE_FLAG.SET, "Cannot use 'set' here");
            forbidFlag(context, node, node_1.NODE_FLAG.PUBLIC, "Cannot use 'public' here");
            forbidFlag(context, node, node_1.NODE_FLAG.PRIVATE, "Cannot use 'private' here");
        }
        else if (node.isGet()) {
            forbidFlag(context, node, node_1.NODE_FLAG.SET, "Cannot use both 'get' and 'set'");
            // Validate argument count including "this"
            if (argumentCount != 1) {
                context.log.error(symbol.range, "Getters must not have any argumentVariables");
            }
        }
        else if (node.isSet()) {
            symbol.rename = `set_${symbol.name}`;
            // Validate argument count including "this"
            if (argumentCount != 2) {
                context.log.error(symbol.range, "Setters must have exactly one argument");
            }
        }
        else if (node.isOperator()) {
            if (symbol.name == "~" || symbol.name == "++" || symbol.name == "--") {
                if (argumentCount != 1) {
                    context.log.error(symbol.range, `Operator '${symbol.name}' must not have any arguments`);
                }
            }
            else if (symbol.name == "+" || symbol.name == "-") {
                if (argumentCount > 2) {
                    context.log.error(symbol.range, `Operator '${symbol.name}' must have at most one argument`);
                }
            }
            else if (symbol.name == "[]=") {
                if (argumentCount < 2) {
                    context.log.error(symbol.range, "Operator '[]=' must have at least one argument");
                }
            }
            else if (argumentCount != 2) {
                context.log.error(symbol.range, `Operator '${symbol.name}' must have exactly one argument`);
            }
        }
        symbol.resolvedType = new type_1.Type();
        symbol.resolvedType.symbol = symbol;
        if (symbol.kind == symbol_1.SymbolKind.FUNCTION_INSTANCE) {
            let parent = symbol.parent();
            let shouldConvertInstanceToGlobal = false;
            forbidFlag(context, node, node_1.NODE_FLAG.EXPORT, "Cannot use 'export' on an instance function");
            forbidFlag(context, node, node_1.NODE_FLAG.DECLARE, "Cannot use 'declare' on an instance function");
            // Functions inside declared classes are automatically declared
            if (parent.node.isDeclare()) {
                if (body == null) {
                    node.flags = node.flags | node_1.NODE_FLAG.DECLARE;
                }
                else {
                    shouldConvertInstanceToGlobal = true;
                }
            }
            else {
                if (body == null) {
                    context.log.error(node.lastChild.range, "Must implement this function");
                }
                // Functions inside export classes are automatically export
                if (parent.node.isExport()) {
                    node.flags = node.flags | node_1.NODE_FLAG.EXPORT;
                }
            }
            // Rewrite this symbol as a global function instead of an instance function
            if (shouldConvertInstanceToGlobal) {
                symbol.kind = symbol_1.SymbolKind.FUNCTION_GLOBAL;
                symbol.flags = symbol.flags | symbol_1.SYMBOL_FLAG_CONVERT_INSTANCE_TO_GLOBAL;
                symbol.rename = `${parent.name}_${symbol.rename != null ? symbol.rename : symbol.name}`;
                let argument = node.functionFirstArgument();
                assert_1.assert(argument.symbol.name == "this");
                argument.symbol.rename = "__this";
            }
        }
        else if (body == null) {
            forbidFlag(context, node, node_1.NODE_FLAG.EXPORT, "Cannot use 'export' on an unimplemented function");
            if (!node.parent || !node.parent.isDeclare()) {
                requireFlag(context, node, node_1.NODE_FLAG.DECLARE, "Declared functions must be prefixed with 'declare'");
            }
        }
        else {
            forbidFlag(context, node, node_1.NODE_FLAG.DECLARE, "Cannot use 'declare' on a function with an implementation");
        }
        context.isUnsafeAllowed = oldUnsafeAllowed;
    }
    else if (symbol_1.isVariable(symbol.kind)) {
        forbidFlag(context, node, node_1.NODE_FLAG.GET, "Cannot use 'get' on a variable");
        forbidFlag(context, node, node_1.NODE_FLAG.SET, "Cannot use 'set' on a variable");
        let type = node.variableType();
        let value = node.variableValue();
        let oldUnsafeAllowed = context.isUnsafeAllowed;
        context.isUnsafeAllowed = context.isUnsafeAllowed || node.isUnsafe();
        if (symbol.kind != symbol_1.SymbolKind.VARIABLE_INSTANCE) {
            forbidFlag(context, node, node_1.NODE_FLAG.PUBLIC, "Cannot use 'public' here");
            forbidFlag(context, node, node_1.NODE_FLAG.PRIVATE, "Cannot use 'private' here");
        }
        if (type != null) {
            resolveAsType(context, type, symbol.scope);
            if (type.resolvedType.isTemplate() && type.hasParameters() && node.parent != type.resolvedType.symbol.node) {
                deriveConcreteClass(context, type, [type.firstChild.firstChild], type.resolvedType.symbol.scope);
            }
            symbol.resolvedType = type.resolvedType;
        }
        else if (value != null) {
            resolveAsExpression(context, value, symbol.scope);
            if (value.resolvedType.isTemplate() && value.hasParameters() && node.parent != value.resolvedType.symbol.node) {
                deriveConcreteClass(context, value, [value.firstChild.firstChild], value.resolvedType.symbol.scope);
            }
            symbol.resolvedType = value.resolvedType;
        }
        else {
            context.log.error(node.internalRange, "Cannot create untyped variables");
            symbol.resolvedType = context.errorType;
        }
        // Validate the variable type
        if (symbol.resolvedType == context.voidType || symbol.resolvedType == context.nullType) {
            context.log.error(node.internalRange, `Cannot create a variable with type '${symbol.resolvedType.toString()}'`);
            symbol.resolvedType = context.errorType;
        }
        // Resolve constant values at initialization time
        if (symbol.kind == symbol_1.SymbolKind.VARIABLE_CONSTANT) {
            if (value != null) {
                resolveAsExpression(context, value, symbol.scope);
                checkConversion(context, value, symbol.resolvedTypeUnderlyingIfEnumValue(context), type_1.ConversionKind.IMPLICIT);
                if (value.kind == node_1.NodeKind.INT32 || value.kind == node_1.NodeKind.INT64 || value.kind == node_1.NodeKind.BOOLEAN) {
                    symbol.offset = value.intValue;
                }
                else if (value.kind == node_1.NodeKind.FLOAT32 || value.kind == node_1.NodeKind.FLOAT64) {
                    symbol.offset = value.floatValue;
                }
                else if (value.resolvedType != context.errorType) {
                    context.log.error(value.range, "Invalid constant initializer");
                    symbol.resolvedType = context.errorType;
                }
            }
            else if (symbol.isEnumValue()) {
                if (node.previousSibling != null) {
                    let previousSymbol = node.previousSibling.symbol;
                    initializeSymbol(context, previousSymbol);
                    symbol.offset = previousSymbol.offset + 1;
                }
                else {
                    symbol.offset = 0;
                }
            }
            else {
                context.log.error(node.internalRange, "Constants must be initialized");
            }
        }
        // Disallow shadowing at function scope
        if (symbol.scope.symbol == null) {
            let scope = symbol.scope.parent;
            while (scope != null) {
                let shadowed = scope.findLocal(symbol.name, scope_1.ScopeHint.NORMAL);
                if (shadowed != null) {
                    context.log.error(node.internalRange, `The symbol '${symbol.name}' shadows another symbol with the same name in a parent scope`);
                    break;
                }
                // Stop when we pass through a function scope
                if (scope.symbol != null) {
                    break;
                }
                scope = scope.parent;
            }
        }
        context.isUnsafeAllowed = oldUnsafeAllowed;
    }
    else {
        assert_1.assert(false);
    }
    assert_1.assert(symbol.resolvedType != null);
    symbol.state = symbol_1.SymbolState.INITIALIZED;
}
exports.initializeSymbol = initializeSymbol;
/**
 * Derive a concrete class from class template type
 * @param context
 * @param type
 * @param parameters
 * @param scope
 * @returns {Symbol}
 */
function deriveConcreteClass(context, type, parameters, scope) {
    let templateNode = type.resolvedType.pointerTo ? type.resolvedType.pointerTo.symbol.node : type.resolvedType.symbol.node;
    let templateName = templateNode.stringValue;
    let typeName = templateNode.stringValue + `<${parameters[0].stringValue}>`;
    let rename = templateNode.stringValue + `_${parameters[0].stringValue}`;
    let symbol = scope.parent.findNested(typeName, scope_1.ScopeHint.NORMAL, scope_1.FindNested.NORMAL);
    if (symbol) {
        // resolve(context, type.firstChild.firstChild, scope.parent);
        let genericSymbol = scope.parent.findNested(type.firstChild.firstChild.stringValue, scope_1.ScopeHint.NORMAL, scope_1.FindNested.NORMAL);
        type.firstChild.firstChild.symbol = genericSymbol;
        if (genericSymbol.resolvedType.pointerTo) {
            type.firstChild.firstChild.resolvedType = genericSymbol.resolvedType.pointerType();
        }
        else {
            type.firstChild.firstChild.resolvedType = genericSymbol.resolvedType;
        }
        type.symbol = symbol;
        if (type.resolvedType.pointerTo) {
            type.resolvedType = symbol.resolvedType.pointerType();
        }
        else {
            type.resolvedType = symbol.resolvedType;
        }
        return;
    }
    let node = templateNode.clone();
    // node.parent = templateNode.parent;
    node.stringValue = typeName;
    cloneChildren(templateNode.firstChild.nextSibling, node, parameters, templateName, typeName);
    node.offset = null; //FIXME: we cannot take offset from class template node
    initialize(context, node, scope.parent, CheckMode.NORMAL);
    resolve(context, node, scope.parent);
    node.symbol.flags |= symbol_1.SYMBOL_FLAG_USED;
    node.constructorFunctionNode.symbol.flags |= symbol_1.SYMBOL_FLAG_USED;
    type.symbol = node.symbol;
    node.symbol.rename = rename;
    if (type.resolvedType.pointerTo) {
        type.resolvedType = node.symbol.resolvedType.pointerType();
    }
    else {
        type.resolvedType = node.symbol.resolvedType;
    }
    if (templateNode.parent) {
        templateNode.replaceWith(node);
    }
    else {
        let prevNode = templateNode.derivedNodes[templateNode.derivedNodes.length - 1];
        prevNode.parent.insertChildAfter(prevNode, node);
    }
    if (templateNode.derivedNodes === undefined) {
        templateNode.derivedNodes = [];
    }
    templateNode.derivedNodes.push(node);
    //Leave the parameter for the emitter to identify the type
    type.firstChild.firstChild.kind = node_1.NodeKind.NAME;
    resolve(context, type.firstChild.firstChild, scope.parent);
    type.stringValue = node.symbol.name;
    return;
}
function cloneChildren(child, parentNode, parameters, templateName, typeName) {
    let firstChildNode = null;
    let lastChildNode = null;
    while (child) {
        if (child.stringValue == "this" && child.parent.symbol &&
            child.parent.symbol.kind == symbol_1.SymbolKind.FUNCTION_INSTANCE && child.kind == node_1.NodeKind.TYPE) {
            child = child.nextSibling;
            continue;
        }
        let childNode;
        if (child.kind == node_1.NodeKind.PARAMETERS || child.kind == node_1.NodeKind.PARAMETER) {
            child = child.nextSibling;
            continue;
        }
        if (child.isGeneric()) {
            let offset = child.offset;
            if (child.resolvedType) {
                offset = child.resolvedType.pointerTo ? child.resolvedType.pointerTo.symbol.node.offset : child.resolvedType.symbol.node.offset;
            }
            if (child.symbol && symbol_1.isVariable(child.symbol.kind)) {
                childNode = child.clone();
            }
            else {
                childNode = parameters[offset].clone();
            }
            childNode.kind = node_1.NodeKind.NAME;
        }
        else {
            if (child.stringValue == "T") {
                terminal_1.Terminal.write("Generic type escaped!");
                terminal_1.Terminal.write(child);
            }
            childNode = child.clone();
            if (childNode.stringValue == templateName) {
                childNode.stringValue = typeName;
            }
        }
        childNode.parent = parentNode;
        if (childNode.stringValue == "constructor" && childNode.parent.kind == node_1.NodeKind.CLASS) {
            childNode.parent.constructorFunctionNode = childNode;
        }
        if (!firstChildNode) {
            firstChildNode = childNode;
        }
        if (lastChildNode) {
            lastChildNode.nextSibling = childNode;
            childNode.previousSibling = lastChildNode;
        }
        if (child.firstChild) {
            cloneChildren(child.firstChild, childNode, parameters, templateName, typeName);
        }
        lastChildNode = childNode;
        child = child.nextSibling;
    }
    if (firstChildNode != null)
        parentNode.firstChild = firstChildNode;
    if (lastChildNode != null)
        parentNode.lastChild = lastChildNode;
}
function resolveChildren(context, node, parentScope) {
    let child = node.firstChild;
    while (child != null) {
        resolve(context, child, parentScope);
        assert_1.assert(child.resolvedType != null);
        child = child.nextSibling;
    }
}
exports.resolveChildren = resolveChildren;
function resolveChildrenAsExpressions(context, node, parentScope) {
    let child = node.firstChild;
    while (child != null) {
        resolveAsExpression(context, child, parentScope);
        child = child.nextSibling;
    }
}
exports.resolveChildrenAsExpressions = resolveChildrenAsExpressions;
function resolveAsExpression(context, node, parentScope) {
    assert_1.assert(node_1.isExpression(node));
    resolve(context, node, parentScope);
    assert_1.assert(node.resolvedType != null);
    if (node.resolvedType != context.errorType) {
        if (node.isType()) {
            context.log.error(node.range, "Expected expression but found type " + node.castType());
            node.resolvedType = context.errorType;
        }
        else if (node.resolvedType == context.voidType && node.parent.kind != node_1.NodeKind.EXPRESSION) {
            context.log.error(node.range, "This expression does not return a value");
            node.resolvedType = context.errorType;
        }
    }
}
exports.resolveAsExpression = resolveAsExpression;
function resolveAsType(context, node, parentScope) {
    assert_1.assert(node_1.isExpression(node));
    resolve(context, node, parentScope);
    assert_1.assert(node.resolvedType != null);
    if (node.resolvedType != context.errorType && !node.isType()) {
        context.log.error(node.range, "Expected type but found expression");
        node.resolvedType = context.errorType;
    }
}
exports.resolveAsType = resolveAsType;
function canConvert(context, node, to, kind) {
    let from = node.resolvedType;
    assert_1.assert(node_1.isExpression(node));
    assert_1.assert(from != null);
    assert_1.assert(to != null);
    //Generic always accept any types
    if (from.isGeneric() || to.isGeneric()) {
        return true;
    }
    // Early-out if the types are identical or errors
    if (from == to || from == context.errorType || to == context.errorType) {
        return true;
    }
    else if (from == context.nullType /* && to.isReference()*/) {
        return true;
    }
    else if ((from.isReference() || to.isReference())) {
        if (kind == type_1.ConversionKind.EXPLICIT) {
            return true;
        }
    }
    else if (to == context.booleanType) {
        return true;
    }
    else if (from == context.booleanType) {
        return true;
    }
    else if (from.isInteger() && to.isInteger()) {
        let mask = to.integerBitMask(context);
        if (from.isUnsigned() && to.isUnsigned()) {
            return true;
        }
        // Allow implicit conversions between enums and int32
        if (from.isEnum() && to == from.underlyingType(context)) {
            return true;
        }
        if (!node.intValue) {
            return true;
        }
        // Only allow lossless conversions implicitly
        if (kind == type_1.ConversionKind.EXPLICIT || from.symbol.byteSize < to.symbol.byteSize ||
            node.kind == node_1.NodeKind.INT32 && (to.isUnsigned()
                ? node.intValue >= 0 && node.intValue <= const_1.MAX_UINT32_VALUE
                : node.intValue >= const_1.MIN_INT32_VALUE && node.intValue <= const_1.MAX_INT32_VALUE)) {
            return true;
        }
        return false;
    }
    else if (from.isInteger() && to.isFloat() ||
        from.isInteger() && to.isDouble() ||
        from.isLong() && to.isInteger() ||
        from.isLong() && to.isFloat() ||
        from.isLong() && to.isDouble() ||
        from.isFloat() && to.isInteger() ||
        from.isFloat() && to.isLong() ||
        from.isDouble() && to.isInteger() ||
        from.isDouble() && to.isLong() ||
        from.isDouble() && to.isFloat()) {
        if (kind == type_1.ConversionKind.IMPLICIT) {
            return false;
        }
        return true;
    }
    else if (from.isInteger() && to.isLong() ||
        from.isFloat() && to.isDouble() ||
        from.isFloat() && to.isFloat() ||
        from.isDouble() && to.isDouble()) {
        return true;
    }
    return false;
}
exports.canConvert = canConvert;
function checkConversion(context, node, to, kind) {
    if (!canConvert(context, node, to, kind)) {
        context.log.error(node.range, `Cannot convert from type '${node.resolvedType.toString()}' to type '${to.toString()}' ${kind == type_1.ConversionKind.IMPLICIT &&
            canConvert(context, node, to, type_1.ConversionKind.EXPLICIT) ? "without a cast" : ""}`);
        node.resolvedType = context.errorType;
    }
}
exports.checkConversion = checkConversion;
function checkStorage(context, target) {
    assert_1.assert(node_1.isExpression(target));
    if (target.resolvedType != context.errorType &&
        target.kind != node_1.NodeKind.INDEX &&
        target.kind != node_1.NodeKind.POINTER_INDEX &&
        target.kind != node_1.NodeKind.DEREFERENCE &&
        (target.kind != node_1.NodeKind.NAME &&
            target.kind != node_1.NodeKind.DOT ||
            target.symbol != null &&
                (!symbol_1.isVariable(target.symbol.kind) ||
                    target.symbol.kind == symbol_1.SymbolKind.VARIABLE_CONSTANT))) {
        context.log.error(target.range, "Cannot store to this location");
        target.resolvedType = context.errorType;
    }
}
exports.checkStorage = checkStorage;
function createDefaultValueForType(context, type) {
    if (type.isLong()) {
        return node_1.createLong(0);
    }
    else if (type.isInteger()) {
        return node_1.createInt(0);
    }
    else if (type.isDouble()) {
        return node_1.createDouble(0);
    }
    else if (type.isFloat()) {
        return node_1.createFloat(0);
    }
    if (type == context.booleanType) {
        return node_1.createboolean(false);
    }
    if (type.isClass()) {
        return node_1.createNull();
    }
    if (type.isGeneric()) {
        return node_1.createNull();
    }
    assert_1.assert(type.isReference());
    return node_1.createNull();
}
exports.createDefaultValueForType = createDefaultValueForType;
function simplifyBinary(node) {
    let left = node.binaryLeft();
    let right = node.binaryRight();
    // Canonicalize commutative operators
    if ((node.kind == node_1.NodeKind.ADD || node.kind == node_1.NodeKind.MULTIPLY ||
        node.kind == node_1.NodeKind.BITWISE_AND || node.kind == node_1.NodeKind.BITWISE_OR || node.kind == node_1.NodeKind.BITWISE_XOR) &&
        left.kind == node_1.NodeKind.INT32 && right.kind != node_1.NodeKind.INT32) {
        node.appendChild(left.remove());
        left = node.binaryLeft();
        right = node.binaryRight();
    }
    // Convert multiplication or division by a power of 2 into a shift
    if ((node.kind == node_1.NodeKind.MULTIPLY || (node.kind == node_1.NodeKind.DIVIDE || node.kind == node_1.NodeKind.REMAINDER) && node.resolvedType.isUnsigned()) &&
        right.kind == node_1.NodeKind.INT32 && utils_1.isPositivePowerOf2(right.intValue)) {
        // Extract the shift from the value
        let shift = -1;
        let value = right.intValue;
        while (value != 0) {
            value = value >> 1;
            shift = shift + 1;
        }
        // "x * 16" => "x << 4"
        if (node.kind == node_1.NodeKind.MULTIPLY) {
            node.kind = node_1.NodeKind.SHIFT_LEFT;
            right.intValue = shift;
        }
        else if (node.kind == node_1.NodeKind.DIVIDE) {
            node.kind = node_1.NodeKind.SHIFT_RIGHT;
            right.intValue = shift;
        }
        else if (node.kind == node_1.NodeKind.REMAINDER) {
            node.kind = node_1.NodeKind.BITWISE_AND;
            right.intValue = right.intValue - 1;
        }
        else {
            assert_1.assert(false);
        }
    }
    else if (node.kind == node_1.NodeKind.ADD && right.kind == node_1.NodeKind.NEGATIVE) {
        node.kind = node_1.NodeKind.SUBTRACT;
        right.replaceWith(right.unaryValue().remove());
    }
    else if (node.kind == node_1.NodeKind.ADD && right.isNegativeInteger()) {
        node.kind = node_1.NodeKind.SUBTRACT;
        right.intValue = -right.intValue;
    }
}
exports.simplifyBinary = simplifyBinary;
function binaryHasUnsignedArguments(node) {
    let left = node.binaryLeft();
    let right = node.binaryRight();
    let leftType = left.resolvedType;
    let rightType = right.resolvedType;
    return leftType.isUnsigned() && rightType.isUnsigned() || leftType.isUnsigned() && right.isNonNegativeInteger() ||
        left.isNonNegativeInteger() && rightType.isUnsigned();
}
exports.binaryHasUnsignedArguments = binaryHasUnsignedArguments;
function isBinaryLong(node) {
    let left = node.binaryLeft();
    let right = node.binaryRight();
    let leftType = left.resolvedType;
    let rightType = right.resolvedType;
    return leftType.isLong() || rightType.isLong();
}
exports.isBinaryLong = isBinaryLong;
function isBinaryDouble(node) {
    let left = node.binaryLeft();
    let right = node.binaryRight();
    let leftType = left.resolvedType;
    let rightType = right.resolvedType;
    return leftType.isDouble() || rightType.isDouble();
}
exports.isBinaryDouble = isBinaryDouble;
function isSymbolAccessAllowed(context, symbol, node, range) {
    if (symbol.isUnsafe() && !context.isUnsafeAllowed) {
        context.log.error(range, `Cannot use symbol '${symbol.name}' outside an 'unsafe' block`);
        return false;
    }
    if (symbol.node != null && symbol.node.isPrivate()) {
        let parent = symbol.parent();
        if (parent != null && context.enclosingClass != parent) {
            context.log.error(range, `Cannot access private symbol '${symbol.name}' here`);
            return false;
        }
    }
    if (symbol_1.isFunction(symbol.kind) && (symbol.isSetter() ? !node.isAssignTarget() : !node.isCallValue())) {
        if (symbol.isSetter()) {
            context.log.error(range, `Cannot use setter '${symbol.name}' here`);
        }
        else {
            // return true;// auto CALL symbol
            context.log.error(range, `Must call function '${symbol.name}'`);
        }
        return false;
    }
    return true;
}
exports.isSymbolAccessAllowed = isSymbolAccessAllowed;
function resolve(context, node, parentScope) {
    let kind = node.kind;
    assert_1.assert(kind == node_1.NodeKind.FILE || parentScope != null);
    if (node.resolvedType != null) {
        return;
    }
    node.resolvedType = context.errorType;
    if (kind == node_1.NodeKind.FILE || kind == node_1.NodeKind.GLOBAL) {
        resolveChildren(context, node, parentScope);
    }
    else if (kind == node_1.NodeKind.MODULE) {
        let oldEnclosingModule = context.enclosingModule;
        initializeSymbol(context, node.symbol);
        context.enclosingModule = node.symbol;
        resolveChildren(context, node, node.scope);
        context.enclosingModule = oldEnclosingModule;
    }
    else if (kind == node_1.NodeKind.IMPORT || kind == node_1.NodeKind.IMPORT_FROM) {
        //ignore imports
    }
    else if (kind == node_1.NodeKind.CLASS) {
        let oldEnclosingClass = context.enclosingClass;
        initializeSymbol(context, node.symbol);
        context.enclosingClass = node.symbol;
        resolveChildren(context, node, node.scope);
        if (!node.isDeclare() && node.constructorFunctionNode === undefined) {
            node.constructorFunctionNode = node.createEmptyConstructor();
            node.appendChild(node.constructorFunctionNode);
            initialize(context, node.constructorFunctionNode, node.scope, CheckMode.NORMAL);
            // let firstFunction = node.firstInstanceFunction();
            // if(firstFunction === undefined){
            //     node.insertChildBefore(firstFunction, node.constructorFunctionNode);
            // } else {
            //     node.insertChildBefore(firstFunction, node.constructorFunctionNode);
            // }
            resolve(context, node.constructorFunctionNode, node.scope);
        }
        if (node.symbol.kind == symbol_1.SymbolKind.TYPE_CLASS) {
            node.symbol.determineClassLayout(context);
        }
        context.enclosingClass = oldEnclosingClass;
    }
    else if (kind == node_1.NodeKind.ENUM) {
        initializeSymbol(context, node.symbol);
        resolveChildren(context, node, node.scope);
    }
    else if (kind == node_1.NodeKind.FUNCTION) {
        let body = node.functionBody();
        initializeSymbol(context, node.symbol);
        if (node.stringValue == "constructor" && node.parent.kind == node_1.NodeKind.CLASS) {
            node.parent.constructorFunctionNode = node;
        }
        if (body != null) {
            let oldReturnType = context.currentReturnType;
            let oldUnsafeAllowed = context.isUnsafeAllowed;
            let returnType = node.functionReturnType();
            if (returnType.resolvedType.isTemplate() && returnType.hasParameters() && node.parent != returnType.resolvedType.symbol.node) {
                deriveConcreteClass(context, returnType, [returnType.firstChild.firstChild], returnType.resolvedType.symbol.scope);
            }
            context.currentReturnType = returnType.resolvedType;
            context.isUnsafeAllowed = node.isUnsafe();
            resolveChildren(context, body, node.scope);
            if (oldReturnType && oldReturnType.isTemplate() && returnType.hasParameters() && node.parent != oldReturnType.symbol.node) {
                deriveConcreteClass(context, returnType, [returnType.firstChild.firstChild], oldReturnType.symbol.scope);
            }
            // if (oldReturnType && oldReturnType.isTemplate() && !oldReturnType.symbol.node.hasParameters()) {
            //     deriveConcreteClass(context, oldReturnType.symbol.node, [oldReturnType.symbol.node.firstChild], oldReturnType.symbol.scope);
            // }
            context.currentReturnType = oldReturnType;
            context.isUnsafeAllowed = oldUnsafeAllowed;
        }
    }
    else if (kind == node_1.NodeKind.PARAMETER) {
        let symbol = node.symbol;
    }
    else if (kind == node_1.NodeKind.VARIABLE) {
        let symbol = node.symbol;
        initializeSymbol(context, symbol);
        let oldUnsafeAllowed = context.isUnsafeAllowed;
        context.isUnsafeAllowed = context.isUnsafeAllowed || node.isUnsafe();
        let value = node.variableValue();
        if (value != null) {
            resolveAsExpression(context, value, parentScope);
            checkConversion(context, value, symbol.resolvedTypeUnderlyingIfEnumValue(context), type_1.ConversionKind.IMPLICIT);
            if (symbol.resolvedType != value.resolvedType) {
                value.becomeValueTypeOf(symbol, context);
            }
            // Variable initializers must be compile-time constants
            if (symbol.kind == symbol_1.SymbolKind.VARIABLE_GLOBAL && value.kind != node_1.NodeKind.INT32 && value.kind != node_1.NodeKind.BOOLEAN && value.kind != node_1.NodeKind.NULL) {
                //context.log.error(value.range, "Global initializers must be compile-time constants");
            }
        }
        else if (symbol.resolvedType != context.errorType) {
            value = createDefaultValueForType(context, symbol.resolvedType);
            resolveAsExpression(context, value, parentScope);
            node.appendChild(value);
        }
        // Allocate global variables
        if (symbol.kind == symbol_1.SymbolKind.VARIABLE_GLOBAL && symbol.resolvedType != context.errorType) {
            symbol.offset = context.allocateGlobalVariableOffset(symbol.resolvedType.variableSizeOf(context), symbol.resolvedType.variableAlignmentOf(context));
        }
        context.isUnsafeAllowed = oldUnsafeAllowed;
    }
    else if (kind == node_1.NodeKind.BREAK || kind == node_1.NodeKind.CONTINUE) {
        let found = false;
        let n = node;
        while (n != null) {
            if (n.kind == node_1.NodeKind.WHILE) {
                found = true;
                break;
            }
            n = n.parent;
        }
        if (!found) {
            context.log.error(node.range, "Cannot use this statement outside of a loop");
        }
    }
    else if (kind == node_1.NodeKind.BLOCK) {
        let oldUnsafeAllowed = context.isUnsafeAllowed;
        if (node.isUnsafe())
            context.isUnsafeAllowed = true;
        resolveChildren(context, node, node.scope);
        context.isUnsafeAllowed = oldUnsafeAllowed;
    }
    else if (kind == node_1.NodeKind.IMPORTS || kind == node_1.NodeKind.CONSTANTS || kind == node_1.NodeKind.VARIABLES) {
        resolveChildren(context, node, parentScope);
    }
    else if (kind == node_1.NodeKind.ANY) {
        //imported functions have anyType
        node.kind = node_1.NodeKind.TYPE;
        node.resolvedType = context.anyType;
    }
    else if (kind == node_1.NodeKind.INT32) {
        // Use the positive flag to differentiate between -2147483648 and 2147483648
        node.resolvedType = node.intValue < 0 && !node.isPositive() ? context.uint32Type : context.int32Type;
    }
    else if (kind == node_1.NodeKind.INT64) {
        node.resolvedType = node.intValue < 0 && !node.isPositive() ? context.uint64Type : context.int64Type;
    }
    else if (kind == node_1.NodeKind.FLOAT32) {
        node.resolvedType = context.float32Type;
    }
    else if (kind == node_1.NodeKind.FLOAT64) {
        node.resolvedType = context.float64Type;
    }
    else if (kind == node_1.NodeKind.STRING) {
        node.resolvedType = context.stringType;
    }
    else if (kind == node_1.NodeKind.BOOLEAN) {
        node.resolvedType = context.booleanType;
    }
    else if (kind == node_1.NodeKind.NULL) {
        node.resolvedType = context.nullType;
    }
    else if (kind == node_1.NodeKind.INDEX) {
        resolveChildrenAsExpressions(context, node, parentScope);
        let target = node.indexTarget();
        let type = target.resolvedType;
        if (type != context.errorType) {
            let symbol = type.hasInstanceMembers() ? type.findMember("[]", scope_1.ScopeHint.NORMAL) : null;
            if (symbol == null) {
                if (target.resolvedType.pointerTo !== undefined) {
                    // convert index to pinter index
                    node.kind = node_1.NodeKind.POINTER_INDEX;
                    node.resolvedType = target.resolvedType.pointerTo.symbol.resolvedType;
                }
                else {
                    context.log.error(node.internalRange, `Cannot index into type '${target.resolvedType.toString()}'`);
                }
            }
            else {
                assert_1.assert(symbol.kind == symbol_1.SymbolKind.FUNCTION_INSTANCE || symbol.kind == symbol_1.SymbolKind.FUNCTION_GLOBAL && symbol.shouldConvertInstanceToGlobal());
                // Convert to a regular function call and resolve that instead
                node.kind = node_1.NodeKind.CALL;
                target.remove();
                node.insertChildBefore(node.firstChild, node_1.createMemberReference(target, symbol));
                node.resolvedType = null;
                resolveAsExpression(context, node, parentScope);
            }
        }
    }
    else if (kind == node_1.NodeKind.ALIGN_OF) {
        let type = node.alignOfType();
        resolveAsType(context, type, parentScope);
        node.resolvedType = context.int32Type;
        if (type.resolvedType != context.errorType) {
            node.becomeIntegerConstant(type.resolvedType.allocationAlignmentOf(context));
        }
    }
    else if (kind == node_1.NodeKind.SIZE_OF) {
        let type = node.sizeOfType();
        resolveAsType(context, type, parentScope);
        node.resolvedType = context.int32Type;
        if (type.resolvedType != context.errorType) {
            node.becomeIntegerConstant(type.resolvedType.allocationSizeOf(context));
        }
    }
    else if (kind == node_1.NodeKind.THIS) {
        let symbol = parentScope.findNested("this", scope_1.ScopeHint.NORMAL, scope_1.FindNested.NORMAL);
        if (symbol == null) {
            context.log.error(node.range, "Cannot use 'this' here");
        }
        else {
            node.becomeSymbolReference(symbol);
        }
    }
    else if (kind == node_1.NodeKind.PARSE_ERROR) {
        node.resolvedType = context.errorType;
    }
    else if (kind == node_1.NodeKind.NAME) {
        let name = node.stringValue;
        let symbol = parentScope.findNested(name, scope_1.ScopeHint.NORMAL, scope_1.FindNested.NORMAL);
        if (symbol == null) {
            let errorMessage = `No symbol named '${name}' here`;
            // In JavaScript, "this." before instance symbols is required
            symbol = parentScope.findNested(name, scope_1.ScopeHint.NORMAL, scope_1.FindNested.ALLOW_INSTANCE_ERRORS);
            if (symbol != null) {
                errorMessage += `, did you mean 'this.${symbol.name}'?`;
            }
            else if (name == "number") {
                // TODO: convert to float64 automatically
                errorMessage += ", you cannot use generic number type from TypeScript!";
            }
            else if (name == "bool") {
                errorMessage += ", did you mean 'boolean'?";
            }
            context.log.error(node.range, errorMessage);
        }
        else if (symbol.state == symbol_1.SymbolState.INITIALIZING) {
            context.log.error(node.range, `Cyclic reference to symbol '${name}' here`);
        }
        else if (isSymbolAccessAllowed(context, symbol, node, node.range)) {
            initializeSymbol(context, symbol);
            node.symbol = symbol;
            node.resolvedType = symbol.resolvedType;
            if (node.resolvedType.isGeneric()) {
                node.flags |= node_1.NODE_FLAG.GENERIC;
            }
            // Inline constants
            if (symbol.kind == symbol_1.SymbolKind.VARIABLE_CONSTANT) {
                if (symbol.resolvedType == context.booleanType) {
                    node.becomeBooleanConstant(symbol.offset != 0);
                }
                else if (symbol.resolvedType == context.float32Type) {
                    node.becomeFloatConstant(symbol.offset);
                }
                else if (symbol.resolvedType == context.float64Type) {
                    node.becomeDoubleConstant(symbol.offset);
                }
                else if (symbol.resolvedType == context.int64Type) {
                    node.becomeLongConstant(symbol.offset);
                }
                else {
                    node.becomeIntegerConstant(symbol.offset);
                }
            }
        }
    }
    else if (kind == node_1.NodeKind.CAST) {
        let value = node.castValue();
        let type = node.castType();
        resolveAsExpression(context, value, parentScope);
        resolveAsType(context, type, parentScope);
        let castedType = type.resolvedType;
        checkConversion(context, value, castedType, type_1.ConversionKind.EXPLICIT);
        node.resolvedType = castedType;
        // Automatically fold constants
        if (value.kind == node_1.NodeKind.INT32 && castedType.isInteger()) {
            let result = value.intValue;
            let shift = 32 - castedType.integerBitCount(context);
            node.becomeIntegerConstant(castedType.isUnsigned()
                ? castedType.integerBitMask(context) & result
                : result << shift >> shift);
        }
        else if (value.kind == node_1.NodeKind.INT32 && castedType.isFloat()) {
            node.becomeFloatConstant(value.intValue);
        }
        else if (value.kind == node_1.NodeKind.INT32 && castedType.isDouble()) {
            node.becomeDoubleConstant(value.intValue);
        }
        else if (value.kind == node_1.NodeKind.FLOAT32 && castedType.isInteger()) {
            node.becomeIntegerConstant(Math.round(value.floatValue));
        }
    }
    else if (kind == node_1.NodeKind.DOT) {
        let target = node.dotTarget();
        resolve(context, target, parentScope);
        if (target.resolvedType != context.errorType) {
            if (target.isType() && (target.resolvedType.isEnum() || target.resolvedType.hasInstanceMembers()) ||
                !target.isType() && target.resolvedType.hasInstanceMembers()) {
                let name = node.stringValue;
                // Empty names are left over from parse errors that have already been reported
                if (name.length > 0) {
                    let symbol = target.resolvedType.findMember(name, node.isAssignTarget() ? scope_1.ScopeHint.PREFER_SETTER : scope_1.ScopeHint.PREFER_GETTER);
                    if (symbol == null) {
                        context.log.error(node.internalRange, `No member named '${name}' on type '${target.resolvedType.toString()}'`);
                    }
                    else if (symbol.isGetter()) {
                        if (node.parent.stringValue === node.stringValue && node.parent.kind === node_1.NodeKind.CALL) {
                            node.parent.resolvedType = null;
                            node.symbol = symbol;
                            node.resolvedType = symbol.resolvedType;
                            resolveAsExpression(context, node.parent, parentScope);
                        }
                        else {
                            node.kind = node_1.NodeKind.CALL;
                            node.appendChild(node_1.createMemberReference(target.remove(), symbol));
                            node.resolvedType = null;
                            resolveAsExpression(context, node, parentScope);
                        }
                        return;
                    }
                    else if (isSymbolAccessAllowed(context, symbol, node, node.internalRange)) {
                        initializeSymbol(context, symbol);
                        node.symbol = symbol;
                        node.resolvedType = symbol.resolvedType;
                        // Inline constants
                        if (symbol.kind == symbol_1.SymbolKind.VARIABLE_CONSTANT) {
                            node.becomeIntegerConstant(symbol.offset);
                        }
                    }
                }
            }
            else {
                context.log.error(node.internalRange, `The type '${target.resolvedType.toString()}' has no members`);
            }
        }
    }
    else if (kind == node_1.NodeKind.CALL) {
        let value = node.callValue();
        resolveAsExpression(context, value, parentScope);
        if (value.resolvedType != context.errorType) {
            let symbol = value.symbol;
            // Only functions are callable
            if (symbol == null || !symbol_1.isFunction(symbol.kind)) {
                context.log.error(value.range, `Cannot call value of type '${value.resolvedType.toString()}'`);
            }
            else {
                initializeSymbol(context, symbol);
                if (symbol.shouldConvertInstanceToGlobal()) {
                    let name = node_1.createSymbolReference(symbol);
                    node.insertChildBefore(value, name.withRange(value.internalRange));
                    node.insertChildBefore(value, value.dotTarget().remove());
                    value.remove();
                    value = name;
                }
                if (symbol.name === "malloc") {
                    compiler_1.Compiler.mallocRequired = true;
                }
                let returnType = symbol.node.functionReturnType();
                let argumentVariable = symbol.node.functionFirstArgumentIgnoringThis();
                let argumentValue = value.nextSibling;
                // Match argument values with variables
                while (argumentVariable != returnType && argumentValue != null) {
                    resolveAsExpression(context, argumentValue, parentScope);
                    checkConversion(context, argumentValue, argumentVariable.symbol.resolvedType, type_1.ConversionKind.IMPLICIT);
                    argumentVariable = argumentVariable.nextSibling;
                    argumentValue = argumentValue.nextSibling;
                }
                // Not enough argumentVariables?
                if (returnType.resolvedType != context.anyType) {
                    if (argumentVariable != returnType && !argumentVariable.hasVariableValue()) {
                        context.log.error(node.internalRange, `Not enough arguments for function '${symbol.name}'`);
                    }
                    else if (argumentValue != null) {
                        while (argumentValue != null) {
                            resolveAsExpression(context, argumentValue, parentScope);
                            argumentValue = argumentValue.nextSibling;
                        }
                        context.log.error(node.internalRange, `Too many arguments for function '${symbol.name}'`);
                    }
                }
                if (returnType.resolvedType.isArray()) {
                    try {
                        terminal_1.Terminal.write("resolvedType " + returnType.__internal_rawValue + "\n"); //?
                    }
                    catch (e) {
                        console.log("can't write " + returnType);
                        console.log(e);
                    }
                }
                // Pass the return type along
                node.resolvedType = returnType.resolvedType;
            }
        }
    }
    else if (kind == node_1.NodeKind.DELETE) {
        let value = node.deleteType();
        if (value != null) {
            resolveAsExpression(context, value, parentScope);
            if (value.resolvedType == null || value.resolvedType == context.voidType) {
                context.log.error(value.range, "Unexpected delete value 'void'");
            }
        }
        else {
            context.log.error(node.range, `Expected delete value '${context.currentReturnType.toString()}'`);
        }
    }
    else if (kind == node_1.NodeKind.RETURN) {
        let value = node.returnValue();
        if (value != null) {
            resolveAsExpression(context, value, parentScope);
            if (context.currentReturnType != null) {
                if (context.currentReturnType != context.voidType) {
                    if (value.resolvedType.isTemplate() && value.hasParameters() && node.parent != value.resolvedType.symbol.node) {
                        deriveConcreteClass(context, value, [value.firstChild.firstChild], value.resolvedType.symbol.scope);
                    }
                    checkConversion(context, value, context.currentReturnType, type_1.ConversionKind.IMPLICIT);
                }
                else {
                    context.log.error(value.range, "Unexpected return value in function returning 'void'");
                }
            }
            node.parent.returnNode = node;
        }
        else if (context.currentReturnType != null && context.currentReturnType != context.voidType) {
            context.log.error(node.range, `Expected return value in function returning '${context.currentReturnType.toString()}'`);
        }
    }
    else if (kind == node_1.NodeKind.EMPTY) {
    }
    else if (kind == node_1.NodeKind.PARAMETERS) {
        // resolveAsType(context, node.genericType(), parentScope);
        // resolveAsExpression(context, node.expressionValue(), parentScope);
        // context.log.error(node.range, "Generics are not implemented yet");
    }
    else if (kind == node_1.NodeKind.EXTENDS) {
        resolveAsType(context, node.extendsType(), parentScope);
        //context.log.error(node.range, "Subclassing is not implemented yet");
    }
    else if (kind == node_1.NodeKind.IMPLEMENTS) {
        let child = node.firstChild;
        while (child != null) {
            resolveAsType(context, child, parentScope);
            child = child.nextSibling;
        }
        context.log.error(node.range, "Interfaces are not implemented yet");
    }
    else if (kind == node_1.NodeKind.EXPRESSIONS) {
        let child = node.firstChild;
        while (child) {
            resolveAsExpression(context, child.expressionValue(), parentScope);
            child = child.nextSibling;
        }
    }
    else if (kind == node_1.NodeKind.EXPRESSION) {
        resolveAsExpression(context, node.expressionValue(), parentScope);
    }
    else if (kind == node_1.NodeKind.WHILE) {
        let value = node.whileValue();
        let body = node.whileBody();
        resolveAsExpression(context, value, parentScope);
        checkConversion(context, value, context.booleanType, type_1.ConversionKind.IMPLICIT);
        resolve(context, body, parentScope);
    }
    else if (kind == node_1.NodeKind.FOR) {
        let initializationStmt = node.forInitializationStatement();
        let terminationStmt = node.forTerminationStatement();
        let updateStmts = node.forUpdateStatements();
        let body = node.forBody();
        resolve(context, initializationStmt, parentScope);
        resolveAsExpression(context, terminationStmt, parentScope);
        resolve(context, updateStmts, parentScope);
        checkConversion(context, terminationStmt, context.booleanType, type_1.ConversionKind.IMPLICIT);
        resolve(context, body, parentScope);
    }
    else if (kind == node_1.NodeKind.IF) {
        let value = node.ifValue();
        let yes = node.ifTrue();
        let no = node.ifFalse();
        resolveAsExpression(context, value, parentScope);
        checkConversion(context, value, context.booleanType, type_1.ConversionKind.IMPLICIT);
        resolve(context, yes, parentScope);
        if (no != null) {
            resolve(context, no, parentScope);
        }
    }
    else if (kind == node_1.NodeKind.HOOK) {
        let value = node.hookValue();
        let yes = node.hookTrue();
        let no = node.hookFalse();
        resolveAsExpression(context, value, parentScope);
        checkConversion(context, value, context.booleanType, type_1.ConversionKind.IMPLICIT);
        resolve(context, yes, parentScope);
        resolve(context, no, parentScope);
        checkConversion(context, yes, no.resolvedType, type_1.ConversionKind.IMPLICIT);
        let commonType = (yes.resolvedType == context.nullType ? no : yes).resolvedType;
        if (yes.resolvedType != commonType && (yes.resolvedType != context.nullType || !commonType.isReference()) &&
            no.resolvedType != commonType && (no.resolvedType != context.nullType || !commonType.isReference())) {
            context.log.error(log_1.spanRanges(yes.range, no.range), `Type '${yes.resolvedType.toString()}' is not the same as type '${no.resolvedType.toString()}'`);
        }
        node.resolvedType = commonType;
    }
    else if (kind == node_1.NodeKind.ASSIGN) {
        let left = node.binaryLeft();
        let right = node.binaryRight();
        if (left.kind == node_1.NodeKind.INDEX) {
            resolveChildrenAsExpressions(context, left, parentScope);
            let target = left.indexTarget();
            let type = target.resolvedType;
            if (type != context.errorType) {
                let symbol = type.hasInstanceMembers() ? type.findMember("[]=", scope_1.ScopeHint.NORMAL) : null;
                if (symbol == null) {
                    if (target.resolvedType.pointerTo != undefined) {
                        left.kind = node_1.NodeKind.POINTER_INDEX;
                        left.resolvedType = target.resolvedType.pointerTo.symbol.resolvedType;
                    }
                    else {
                        context.log.error(left.internalRange, `Cannot index into type '${target.resolvedType.toString()}'`);
                    }
                }
                else {
                    assert_1.assert(symbol.kind == symbol_1.SymbolKind.FUNCTION_INSTANCE);
                    // Convert to a regular function call and resolve that instead
                    node.kind = node_1.NodeKind.CALL;
                    target.remove();
                    left.remove();
                    while (left.lastChild != null) {
                        node.insertChildBefore(node.firstChild, left.lastChild.remove());
                    }
                    node.insertChildBefore(node.firstChild, node_1.createMemberReference(target, symbol));
                    node.internalRange = log_1.spanRanges(left.internalRange, right.range);
                    node.resolvedType = null;
                    resolveAsExpression(context, node, parentScope);
                    return;
                }
            }
        }
        if (!left.resolvedType) {
            resolveAsExpression(context, left, parentScope);
        }
        // Automatically call setters
        if (left.symbol != null && left.symbol.isSetter()) {
            node.kind = node_1.NodeKind.CALL;
            node.internalRange = left.internalRange;
            node.resolvedType = null;
            resolveAsExpression(context, node, parentScope);
            return;
        }
        resolveAsExpression(context, right, parentScope);
        checkConversion(context, right, left.resolvedType, type_1.ConversionKind.IMPLICIT);
        checkStorage(context, left);
        node.resolvedType = left.resolvedType;
    }
    else if (kind == node_1.NodeKind.NEW) {
        compiler_1.Compiler.mallocRequired = true;
        let type = node.newType();
        resolveAsType(context, type, parentScope);
        if (type.resolvedType.isTemplate() && type.hasParameters() && node.parent != type.resolvedType.symbol.node) {
            deriveConcreteClass(context, type, [type.firstChild.firstChild], type.resolvedType.symbol.scope);
        }
        if (type.resolvedType != context.errorType) {
            if (!type.resolvedType.isClass()) {
                context.log.error(type.range, `Cannot construct type '${type.resolvedType.toString()}'`);
            }
            else {
                node.resolvedType = type.resolvedType;
            }
        }
        //Constructors argumentVariables
        let child = type.nextSibling;
        let constructorNode = node.constructorNode();
        if (constructorNode !== undefined) {
            let argumentVariable = constructorNode.functionFirstArgument();
            while (child != null) {
                resolveAsExpression(context, child, parentScope);
                checkConversion(context, child, argumentVariable.symbol.resolvedType, type_1.ConversionKind.IMPLICIT);
                child = child.nextSibling;
                argumentVariable = argumentVariable.nextSibling;
            }
        }
        // Match argument values with variables
        // while (argumentVariable != returnType && argumentValue != null) {
        //     resolveAsExpression(context, argumentValue, parentScope);
        //     checkConversion(context, argumentValue, argumentVariable.symbol.resolvedType, ConversionKind.IMPLICIT);
        //     argumentVariable = argumentVariable.nextSibling;
        //     argumentValue = argumentValue.nextSibling;
        // }
    }
    else if (kind == node_1.NodeKind.POINTER_TYPE) {
        let value = node.unaryValue();
        resolveAsType(context, value, parentScope);
        if (context.target == compile_target_1.CompileTarget.JAVASCRIPT) {
            context.log.error(node.internalRange, "Cannot use pointers when compiling to JavaScript");
        }
        else {
            let type = value.resolvedType;
            if (type != context.errorType) {
                node.resolvedType = type.pointerType();
            }
        }
    }
    else if (kind == node_1.NodeKind.POINTER_INDEX) {
        debugger;
    }
    else if (kind == node_1.NodeKind.DEREFERENCE) {
        let value = node.unaryValue();
        resolveAsExpression(context, value, parentScope);
        let type = value.resolvedType;
        if (type != context.errorType) {
            if (type.pointerTo == null) {
                context.log.error(node.internalRange, `Cannot dereference type '${type.toString()}'`);
            }
            else {
                node.resolvedType = type.pointerTo;
            }
        }
    }
    else if (kind == node_1.NodeKind.ADDRESS_OF) {
        let value = node.unaryValue();
        resolveAsExpression(context, value, parentScope);
        context.log.error(node.internalRange, "The address-of operator is not supported");
    }
    else if (node_1.isUnary(kind)) {
        let value = node.unaryValue();
        resolveAsExpression(context, value, parentScope);
        // Operator "!" is hard-coded
        if (kind == node_1.NodeKind.NOT) {
            checkConversion(context, value, context.booleanType, type_1.ConversionKind.IMPLICIT);
            node.resolvedType = context.booleanType;
        }
        else if (value.resolvedType.isLong()) {
            if (value.resolvedType.isUnsigned()) {
                node.flags = node.flags | node_1.NODE_FLAG.UNSIGNED_OPERATOR;
                node.resolvedType = context.uint64Type;
            }
            else {
                node.resolvedType = context.int64Type;
            }
            // Automatically fold constants
            if (value.kind == node_1.NodeKind.INT64) {
                let input = value.longValue;
                let output = input;
                if (kind == node_1.NodeKind.COMPLEMENT)
                    output = ~input;
                else if (kind == node_1.NodeKind.NEGATIVE)
                    output = -input;
                node.becomeLongConstant(output);
            }
        }
        else if (value.resolvedType.isInteger()) {
            if (value.resolvedType.isUnsigned()) {
                node.flags = node.flags | node_1.NODE_FLAG.UNSIGNED_OPERATOR;
                node.resolvedType = context.uint32Type;
            }
            else {
                node.resolvedType = context.int32Type;
            }
            // Automatically fold constants
            if (value.kind == node_1.NodeKind.INT32) {
                let input = value.intValue;
                let output = input;
                if (kind == node_1.NodeKind.COMPLEMENT)
                    output = ~input;
                else if (kind == node_1.NodeKind.NEGATIVE)
                    output = -input;
                node.becomeIntegerConstant(output);
            }
        }
        else if (value.resolvedType.isDouble()) {
            node.resolvedType = context.float64Type;
            // Automatically fold constants
            if (value.kind == node_1.NodeKind.FLOAT64) {
                let input = value.doubleValue;
                let output = input;
                if (kind == node_1.NodeKind.COMPLEMENT)
                    output = ~input;
                else if (kind == node_1.NodeKind.NEGATIVE)
                    output = -input;
                node.becomeDoubleConstant(output);
            }
        }
        else if (value.resolvedType.isFloat()) {
            node.resolvedType = context.float32Type;
            // Automatically fold constants
            if (value.kind == node_1.NodeKind.FLOAT32) {
                let input = value.floatValue;
                let output = input;
                if (kind == node_1.NodeKind.COMPLEMENT)
                    output = ~input;
                else if (kind == node_1.NodeKind.NEGATIVE)
                    output = -input;
                node.becomeFloatConstant(output);
            }
        }
        else if (value.resolvedType != context.errorType) {
            let name = node.internalRange.toString();
            let symbol = value.resolvedType.findMember(name, scope_1.ScopeHint.NOT_BINARY);
            // Automatically call the function
            if (symbol != null) {
                node.appendChild(node_1.createMemberReference(value.remove(), symbol).withRange(node.range).withInternalRange(node.internalRange));
                node.kind = node_1.NodeKind.CALL;
                node.resolvedType = null;
                resolveAsExpression(context, node, parentScope);
            }
            else {
                context.log.error(node.internalRange, `Cannot use unary operator '${name}' with type '${value.resolvedType.toString()}'`);
            }
        }
    }
    else if (node_1.isBinary(kind)) {
        let left = node.binaryLeft();
        let right = node.binaryRight();
        resolveAsExpression(context, left, parentScope);
        resolveAsExpression(context, right, parentScope);
        let leftType = left.resolvedType;
        if ((leftType.isDouble() && right.resolvedType.isFloat()) ||
            (leftType.isLong() && right.resolvedType.isInteger())) {
            right.becomeTypeOf(left, context);
        }
        let rightType = right.resolvedType;
        // Operators "&&" and "||" are hard-coded
        if (kind == node_1.NodeKind.LOGICAL_OR || kind == node_1.NodeKind.LOGICAL_AND) {
            checkConversion(context, left, context.booleanType, type_1.ConversionKind.IMPLICIT);
            checkConversion(context, right, context.booleanType, type_1.ConversionKind.IMPLICIT);
            node.resolvedType = context.booleanType;
        }
        else if (kind == node_1.NodeKind.ADD && leftType.pointerTo != null && rightType.isInteger()) {
            node.resolvedType = leftType;
        }
        else if ((kind == node_1.NodeKind.LESS_THAN || kind == node_1.NodeKind.LESS_THAN_EQUAL ||
            kind == node_1.NodeKind.GREATER_THAN || kind == node_1.NodeKind.GREATER_THAN_EQUAL) && (leftType.pointerTo != null || rightType.pointerTo != null)) {
            node.resolvedType = context.booleanType;
            // Both pointer types must be exactly the same
            if (leftType != rightType) {
                context.log.error(node.internalRange, `Cannot compare type '${leftType.toString()}' with type '${rightType.toString()}'`);
            }
        }
        else if ((leftType.isInteger() || leftType.isLong() ||
            leftType.isFloat() || leftType.isDouble() ||
            (leftType.isGeneric() && rightType.isGeneric())) &&
            kind != node_1.NodeKind.EQUAL && kind != node_1.NodeKind.NOT_EQUAL) {
            let isFloat = false;
            let isFloat64 = false;
            if (leftType.isFloat() || leftType.isDouble()) {
                isFloat = true;
                isFloat64 = leftType.isDouble();
            }
            let isUnsigned = binaryHasUnsignedArguments(node);
            // Arithmetic operators
            if (kind == node_1.NodeKind.ADD ||
                kind == node_1.NodeKind.SUBTRACT ||
                kind == node_1.NodeKind.MULTIPLY ||
                kind == node_1.NodeKind.DIVIDE ||
                kind == node_1.NodeKind.REMAINDER ||
                kind == node_1.NodeKind.BITWISE_AND ||
                kind == node_1.NodeKind.BITWISE_OR ||
                kind == node_1.NodeKind.BITWISE_XOR ||
                kind == node_1.NodeKind.SHIFT_LEFT ||
                kind == node_1.NodeKind.SHIFT_RIGHT) {
                let isLong = isBinaryLong(node);
                let commonType;
                if (isFloat) {
                    commonType = isBinaryDouble(node) ? context.float64Type : context.float32Type;
                }
                else {
                    commonType = isUnsigned ? (isLong ? context.uint64Type : context.uint32Type) : (isLong ? context.int64Type : context.int32Type);
                }
                if (isUnsigned) {
                    node.flags = node.flags | node_1.NODE_FLAG.UNSIGNED_OPERATOR;
                }
                checkConversion(context, left, commonType, type_1.ConversionKind.IMPLICIT);
                checkConversion(context, right, commonType, type_1.ConversionKind.IMPLICIT);
                node.resolvedType = commonType;
                // Signature conversion
                if (commonType == context.int64Type) {
                    if (left.kind == node_1.NodeKind.INT32) {
                        left.kind = node_1.NodeKind.INT64;
                        left.resolvedType = context.int64Type;
                    }
                    else if (right.kind == node_1.NodeKind.INT32) {
                        right.kind = node_1.NodeKind.INT64;
                        right.resolvedType = context.int64Type;
                    }
                }
                // Automatically fold constants
                if ((left.kind == node_1.NodeKind.INT32 || left.kind == node_1.NodeKind.INT64) &&
                    (right.kind == node_1.NodeKind.INT32 || right.kind == node_1.NodeKind.INT64)) {
                    let inputLeft = left.intValue;
                    let inputRight = right.intValue;
                    let output = 0;
                    if (kind == node_1.NodeKind.ADD)
                        output = inputLeft + inputRight;
                    else if (kind == node_1.NodeKind.BITWISE_AND)
                        output = inputLeft & inputRight;
                    else if (kind == node_1.NodeKind.BITWISE_OR)
                        output = inputLeft | inputRight;
                    else if (kind == node_1.NodeKind.BITWISE_XOR)
                        output = inputLeft ^ inputRight;
                    else if (kind == node_1.NodeKind.DIVIDE)
                        output = inputLeft / inputRight;
                    else if (kind == node_1.NodeKind.MULTIPLY)
                        output = inputLeft * inputRight;
                    else if (kind == node_1.NodeKind.REMAINDER)
                        output = inputLeft % inputRight;
                    else if (kind == node_1.NodeKind.SHIFT_LEFT)
                        output = inputLeft << inputRight;
                    else if (kind == node_1.NodeKind.SHIFT_RIGHT)
                        output = isUnsigned ? ((inputLeft) >> (inputRight)) : inputLeft >> inputRight;
                    else if (kind == node_1.NodeKind.SUBTRACT)
                        output = inputLeft - inputRight;
                    else
                        return;
                    if (left.kind == node_1.NodeKind.INT32) {
                        node.becomeIntegerConstant(output);
                    }
                    else {
                        node.becomeLongConstant(output);
                    }
                }
                else if ((left.kind == node_1.NodeKind.FLOAT32 || left.kind == node_1.NodeKind.FLOAT64) &&
                    (right.kind == node_1.NodeKind.FLOAT32 || right.kind == node_1.NodeKind.FLOAT64)) {
                    let inputLeft = left.floatValue;
                    let inputRight = right.floatValue;
                    let output = 0;
                    if (kind == node_1.NodeKind.ADD)
                        output = inputLeft + inputRight;
                    else if (kind == node_1.NodeKind.BITWISE_AND)
                        output = inputLeft & inputRight;
                    else if (kind == node_1.NodeKind.BITWISE_OR)
                        output = inputLeft | inputRight;
                    else if (kind == node_1.NodeKind.BITWISE_XOR)
                        output = inputLeft ^ inputRight;
                    else if (kind == node_1.NodeKind.DIVIDE)
                        output = inputLeft / inputRight;
                    else if (kind == node_1.NodeKind.MULTIPLY)
                        output = inputLeft * inputRight;
                    else if (kind == node_1.NodeKind.REMAINDER)
                        output = inputLeft % inputRight;
                    else if (kind == node_1.NodeKind.SHIFT_LEFT)
                        output = inputLeft << inputRight;
                    else if (kind == node_1.NodeKind.SHIFT_RIGHT)
                        output = inputLeft >> inputRight;
                    else if (kind == node_1.NodeKind.SUBTRACT)
                        output = inputLeft - inputRight;
                    else
                        return;
                    if (left.kind == node_1.NodeKind.FLOAT32) {
                        node.becomeFloatConstant(output);
                    }
                    else {
                        node.becomeDoubleConstant(output);
                    }
                }
                else {
                    simplifyBinary(node);
                }
            }
            else if (kind == node_1.NodeKind.LESS_THAN ||
                kind == node_1.NodeKind.LESS_THAN_EQUAL ||
                kind == node_1.NodeKind.GREATER_THAN ||
                kind == node_1.NodeKind.GREATER_THAN_EQUAL) {
                let expectedType = isFloat ? (isFloat64 ? context.float64Type : context.float32Type) : (isUnsigned ? context.uint32Type : context.int32Type);
                if (isUnsigned) {
                    node.flags = node.flags | node_1.NODE_FLAG.UNSIGNED_OPERATOR;
                }
                if (leftType != rightType) {
                    checkConversion(context, left, expectedType, type_1.ConversionKind.IMPLICIT);
                    checkConversion(context, right, expectedType, type_1.ConversionKind.IMPLICIT);
                }
                node.resolvedType = context.booleanType;
            }
            else {
                context.log.error(node.internalRange, "This operator is not currently supported");
            }
        }
        else if (leftType != context.errorType) {
            let name = node.internalRange.toString();
            let symbol = leftType.findMember(kind == node_1.NodeKind.NOT_EQUAL ? "==" :
                kind == node_1.NodeKind.LESS_THAN_EQUAL ? ">" :
                    kind == node_1.NodeKind.GREATER_THAN_EQUAL ? "<" :
                        name, scope_1.ScopeHint.NOT_UNARY);
            // Automatically call the function
            if (symbol != null) {
                left = node_1.createMemberReference(left.remove(), symbol).withRange(node.range).withInternalRange(node.internalRange);
                right.remove();
                if (kind == node_1.NodeKind.NOT_EQUAL ||
                    kind == node_1.NodeKind.LESS_THAN_EQUAL ||
                    kind == node_1.NodeKind.GREATER_THAN_EQUAL) {
                    let call = node_1.createCall(left);
                    call.appendChild(right);
                    node.kind = node_1.NodeKind.NOT;
                    node.appendChild(call.withRange(node.range).withInternalRange(node.range));
                }
                else {
                    node.appendChild(left);
                    node.appendChild(right);
                    node.kind = node_1.NodeKind.CALL;
                }
                node.resolvedType = null;
                resolveAsExpression(context, node, parentScope);
            }
            else if (kind == node_1.NodeKind.EQUAL || kind == node_1.NodeKind.NOT_EQUAL) {
                node.resolvedType = context.booleanType;
                if (leftType != context.errorType &&
                    rightType != context.errorType &&
                    leftType != rightType &&
                    !canConvert(context, right, leftType, type_1.ConversionKind.IMPLICIT) &&
                    !canConvert(context, left, rightType, type_1.ConversionKind.IMPLICIT)) {
                    context.log.error(node.internalRange, `Cannot compare type '${leftType.toString()}' with type '${rightType.toString()}'`);
                }
            }
            else {
                context.log.error(node.internalRange, `Cannot use binary operator '${name}' with type '${leftType.toString()}'`);
            }
        }
    }
    else if (kind == node_1.NodeKind.TYPE) {
        //ignore types
    }
    else {
        terminal_1.Terminal.error(`Unexpected kind: ${node_1.NodeKind[kind]}`);
        assert_1.assert(false);
    }
}
exports.resolve = resolve;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const compile_target_1 = __webpack_require__(9);
exports.defaultCompilerOptions = {
    target: compile_target_1.CompileTarget.WEBASSEMBLY,
    silent: true,
    logError: true
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Nidin Vinayakan on 11/01/17.
 */
exports.MIN_INT32_VALUE = -Math.pow(2, 31);
exports.MAX_INT32_VALUE = Math.pow(2, 31) - 1;
exports.MIN_UINT32_VALUE = 0;
exports.MAX_UINT32_VALUE = Math.pow(2, 32) - 1;
//FIXME: Cannot represent 64 bit integer in javascript
exports.MIN_INT64_VALUE = -Math.pow(2, 63);
exports.MAX_INT64_VALUE = Math.pow(2, 63) - 1;
exports.MIN_UINT64_VALUE = 0;
exports.MAX_UINT64_VALUE = Math.pow(2, 64) - 1;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = __webpack_require__(7);
const node_1 = __webpack_require__(10);
const compiler_1 = __webpack_require__(12);
const index_1 = __webpack_require__(11);
const binary_importer_1 = __webpack_require__(14);
function treeShakingMarkAllUsed(node) {
    var symbol = node.symbol;
    if (symbol != null && !symbol.isUsed() && symbol_1.isFunction(symbol.kind) && symbol.node != null) {
        symbol.flags = symbol.flags | symbol_1.SYMBOL_FLAG_USED;
        treeShakingMarkAllUsed(symbol.node);
        if (node == symbol.node)
            return;
    }
    if (node.kind == node_1.NodeKind.NEW) {
        var type = node.newType().resolvedType;
        if (type.symbol != null) {
            type.symbol.flags |= symbol_1.SYMBOL_FLAG_USED;
            if (type.symbol.node.constructorFunctionNode !== undefined) {
                type.symbol.node.constructorFunctionNode.symbol.flags = symbol_1.SYMBOL_FLAG_USED;
            }
        }
    }
    var child = node.firstChild;
    while (child != null) {
        treeShakingMarkAllUsed(child);
        child = child.nextSibling;
    }
}
exports.treeShakingMarkAllUsed = treeShakingMarkAllUsed;
function treeShakingSearchForUsed(node) {
    if (node.kind == node_1.NodeKind.FUNCTION && (node.isExport() || node.isStart())) {
        if ((binary_importer_1.isBinaryImport(index_1.getWasmFunctionName(node.symbol)) || node.symbol.name === "malloc" || node.symbol.name === "free") && !compiler_1.Compiler.mallocRequired) {
            return;
        }
        treeShakingMarkAllUsed(node);
    }
    else if (node.kind == node_1.NodeKind.GLOBAL || node.kind == node_1.NodeKind.CLASS) {
        var child = node.firstChild;
        while (child != null) {
            treeShakingSearchForUsed(child);
            child = child.nextSibling;
        }
        if (node.kind == node_1.NodeKind.CLASS && node.isExport()) {
            node.symbol.flags = node.symbol.flags | symbol_1.SYMBOL_FLAG_USED;
        }
    }
}
exports.treeShakingSearchForUsed = treeShakingSearchForUsed;
function treeShakingRemoveUnused(node) {
    if (node.kind == node_1.NodeKind.FUNCTION && !node.symbol.isUsed() && node.range.source.isLibrary) {
        // if (node.symbol.kind == SymbolKind.FUNCTION_INSTANCE) {
        //     if (!node.parent.symbol.isUsed()) {
        //         node.remove();
        //     }
        // } else {
        node.remove();
        // }
    }
    else if (node.kind == node_1.NodeKind.GLOBAL || node.kind == node_1.NodeKind.CLASS) {
        var child = node.firstChild;
        while (child != null) {
            var next = child.nextSibling;
            treeShakingRemoveUnused(child);
            child = next;
        }
        if (node.kind == node_1.NodeKind.CLASS && !node.symbol.isUsed() && !node.isDeclare() && node.range.source.isLibrary) {
            node.remove();
        }
    }
}
exports.treeShakingRemoveUnused = treeShakingRemoveUnused;
function treeShaking(node) {
    treeShakingSearchForUsed(node);
    treeShakingRemoveUnused(node);
}
exports.treeShaking = treeShaking;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __webpack_require__(5);
const scanner_1 = __webpack_require__(13);
const filesystem_1 = __webpack_require__(15);
const terminal_1 = __webpack_require__(2);
const binary_importer_1 = __webpack_require__(14);
const env_1 = __webpack_require__(19);
const javascript = __webpack_require__(38);
let path;
if (env_1.isNode) {
    path = __webpack_require__(79);
}
function preparse(source, compiler, log) {
    if (env_1.isNode) {
        source.name = path.resolve(source.name);
    }
    let basePath = filesystem_1.FileSystem.getBasePath(source.name);
    let contents = source.contents;
    let limit = contents.length;
    let wantNewline = false;
    let captureImports = false;
    let captureImportFrom = false;
    let captureImportPath = false;
    let imports;
    let i = 0;
    while (i < limit) {
        let start = i;
        let c = contents[i];
        i = i + 1;
        if (c == ' ' || c == '\t' || c == '\r') {
            continue;
        }
        let kind = scanner_1.Tokens.END_OF_FILE;
        // Newline
        if (c == '\n') {
            if (!wantNewline) {
                continue;
            }
            // Preprocessor commands all end in a newline
            wantNewline = false;
        }
        else if (c == '/') {
            // Single-line comments
            if (i < limit && contents[i] == '/') {
                i = i + 1;
                while (i < limit && contents[i] != '\n') {
                    i = i + 1;
                }
                continue;
            }
            // Multi-line comments
            if (i < limit && contents[i] == '*') {
                i = i + 1;
                let foundEnd = false;
                while (i < limit) {
                    let next = contents[i];
                    if (next == '*' && i + 1 < limit && contents[i + 1] == '/') {
                        foundEnd = true;
                        i = i + 2;
                        break;
                    }
                    i = i + 1;
                }
                if (!foundEnd) {
                    log.error(log_1.createRange(source, start, start + 2), "Unterminated multi-line comment");
                    return null;
                }
            }
        }
        else if (scanner_1.isAlpha(c)) {
            while (i < limit && (scanner_1.isAlpha(contents[i]) || scanner_1.isNumber(contents[i]))) {
                i = i + 1;
            }
            // Keywords
            let length = i - start;
            if (length >= 2 && length <= 10) {
                let text = contents.slice(start, i);
                if (text == "import") {
                    captureImports = true;
                    captureImportFrom = true;
                }
                else if (text == "from" && captureImportFrom) {
                    captureImportFrom = false;
                    captureImportPath = true;
                }
            }
        }
        else if (captureImports && c == '{') {
            captureImports = false;
            imports = [];
            let nextImportIndex = start;
            while (i < limit) {
                let next = contents[i];
                i = i + 1;
                let end = next === "}";
                // capture all imports
                if (next == "," || end) {
                    let _import = contents.slice(nextImportIndex + 1, i - 1);
                    imports.push(_import);
                    kind = scanner_1.Tokens.IMPORT;
                    if (end) {
                        break;
                    }
                    nextImportIndex = i;
                }
            }
        }
        else if (captureImportPath && (c == '"' || c == '\'' || c == '`')) {
            captureImportPath = false;
            while (i < limit) {
                let next = contents[i];
                // Escape any character including newlines
                if (i + 1 < limit && next == '\\') {
                    i = i + 2;
                }
                else if (next == '\n' && c != '`') {
                    break;
                }
                else {
                    i = i + 1;
                    // End the string with a matching quote character
                    if (next == c) {
                        let from = contents.slice(start + 1, i - 1);
                        //FIXME: If the import already resolved don't add it again.
                        let importContent = resolveImport(imports, from, basePath + "/" + from);
                        if (importContent) {
                            if (source.isLibrary) {
                                source.contents += importContent;
                            }
                            else {
                                compiler.addInputBefore(from, importContent, source);
                            }
                        }
                        else {
                            return false;
                        }
                        kind = c == '\'' ? scanner_1.Tokens.CHARACTER : scanner_1.Tokens.STRING;
                        break;
                    }
                }
            }
        }
    }
    return true;
}
exports.preparse = preparse;
function resolveImport(imports, from, importPath) {
    let contents = null;
    if (from === "javascript") {
        contents = javascript;
    }
    else if (from.endsWith(".wasm")) {
        return binary_importer_1.BinaryImporter.resolveWasmBinaryImport(imports, from, importPath);
    }
    else {
        contents = filesystem_1.FileSystem.readTextFile(importPath);
    }
    if (contents == null) {
        terminal_1.Terminal.error(`Cannot read from ${importPath}`);
        return null;
    }
    return contents;
}


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __webpack_require__(5);
const scanner_1 = __webpack_require__(13);
const parser_1 = __webpack_require__(25);
var PreprocessorValue;
(function (PreprocessorValue) {
    PreprocessorValue[PreprocessorValue["FALSE"] = 0] = "FALSE";
    PreprocessorValue[PreprocessorValue["TRUE"] = 1] = "TRUE";
    PreprocessorValue[PreprocessorValue["ERROR"] = 2] = "ERROR";
})(PreprocessorValue = exports.PreprocessorValue || (exports.PreprocessorValue = {}));
class PreprocessorFlag {
}
exports.PreprocessorFlag = PreprocessorFlag;
// This preprocessor implements the flag-only conditional behavior from C#.
// There are two scopes for flags: global-level and file-level. This is stored
// using an ever-growing linked list of PreprocessorFlag objects that turn a
// flag either on or off. That way file-level state can just reference the
// memory of the global-level state and the global-level state can easily be
// restored after parsing a file just by restoring the pointer.
class Preprocessor {
    peek(kind) {
        return this.current.kind == kind;
    }
    eat(kind) {
        if (this.peek(kind)) {
            this.advance();
            return true;
        }
        return false;
    }
    advance() {
        if (!this.peek(scanner_1.Tokens.END_OF_FILE)) {
            this.previous = this.current;
            this.current = this.current.next;
        }
    }
    unexpectedToken() {
        this.log.error(this.current.range, `Unexpected ${scanner_1.tokenToString(this.current.kind)}`);
    }
    expect(kind) {
        if (!this.peek(kind)) {
            this.log.error(this.current.range, `Expected ${scanner_1.tokenToString(kind)} but found ${scanner_1.tokenToString(this.current.kind)}`);
            return false;
        }
        this.advance();
        return true;
    }
    removeTokensFrom(before) {
        before.next = this.current;
        this.previous = before;
    }
    isDefined(name) {
        var flag = this.firstFlag;
        while (flag != null) {
            if (flag.name == name) {
                return flag.isDefined;
            }
            flag = flag.next;
        }
        return false;
    }
    define(name, isDefined) {
        var flag = new PreprocessorFlag();
        flag.isDefined = isDefined;
        flag.name = name;
        flag.next = this.firstFlag;
        this.firstFlag = flag;
    }
    run(source, log) {
        var firstToken = source.firstToken;
        if (firstToken != null && firstToken.kind == scanner_1.Tokens.PREPROCESSOR_NEEDED) {
            var firstFlag = this.firstFlag;
            // Initialize
            this.isDefineAndUndefAllowed = true;
            this.previous = firstToken;
            this.current = firstToken.next;
            this.log = log;
            // Don't parse this file if preprocessing failed
            if (!this.scan(true)) {
                source.firstToken = null;
                return;
            }
            // Make sure blocks are balanced
            if (!this.peek(scanner_1.Tokens.END_OF_FILE)) {
                this.unexpectedToken();
            }
            // Restore the global-level state instead of letting the file-level state
            // leak over into the next file that the preprocessor is run on
            this.firstFlag = firstFlag;
            // Skip over the PREPROCESSOR_NEEDED token so the parser doesn't see it
            source.firstToken = source.firstToken.next;
        }
    }
    // Scan over the next reachable tokens, evaluate #define/#undef directives,
    // and fold #if/#else chains. Stop on #elif/#else/#endif. Return false on
    // failure. Takes a booleanean flag for whether or not control flow is live in
    // this block.
    scan(isParentLive) {
        while (!this.peek(scanner_1.Tokens.END_OF_FILE) &&
            !this.peek(scanner_1.Tokens.PREPROCESSOR_ELIF) &&
            !this.peek(scanner_1.Tokens.PREPROCESSOR_ELSE) &&
            !this.peek(scanner_1.Tokens.PREPROCESSOR_ENDIF)) {
            var previous = this.previous;
            var current = this.current;
            // #define or #undef
            if (this.eat(scanner_1.Tokens.PREPROCESSOR_DEFINE) || this.eat(scanner_1.Tokens.PREPROCESSOR_UNDEF)) {
                // Only process the directive if control flow is live at this point
                if (this.expect(scanner_1.Tokens.IDENTIFIER) && isParentLive) {
                    this.define(this.previous.range.toString(), current.kind == scanner_1.Tokens.PREPROCESSOR_DEFINE);
                }
                // Help out people trying to use this like C
                if (this.eat(scanner_1.Tokens.FALSE) || this.eat(scanner_1.Tokens.INT32) && this.previous.range.toString() == "0") {
                    this.log.error(this.previous.range, "Use '#undef' to turn a preprocessor flag off");
                }
                // Scan up to the next newline
                if (!this.peek(scanner_1.Tokens.END_OF_FILE) && !this.expect(scanner_1.Tokens.PREPROCESSOR_NEWLINE)) {
                    while (!this.eat(scanner_1.Tokens.PREPROCESSOR_NEWLINE) && !this.eat(scanner_1.Tokens.END_OF_FILE)) {
                        this.advance();
                    }
                }
                // These statements are only valid at the top of the file
                if (!this.isDefineAndUndefAllowed) {
                    this.log.error(log_1.spanRanges(current.range, this.previous.range), "All '#define' and '#undef' directives must be at the top of the file");
                }
                // Remove all of these tokens
                this.removeTokensFrom(previous);
            }
            else if (this.eat(scanner_1.Tokens.PREPROCESSOR_WARNING) || this.eat(scanner_1.Tokens.PREPROCESSOR_ERROR)) {
                var next = this.current;
                // Scan up to the next newline
                while (!this.peek(scanner_1.Tokens.PREPROCESSOR_NEWLINE) && !this.peek(scanner_1.Tokens.END_OF_FILE)) {
                    this.advance();
                }
                // Only process the directive if control flow is live at this point
                if (isParentLive) {
                    var range = this.current == next ? current.range : log_1.spanRanges(next.range, this.previous.range);
                    this.log.append(range, range.toString(), current.kind == scanner_1.Tokens.PREPROCESSOR_WARNING ? log_1.DiagnosticKind.WARNING : log_1.DiagnosticKind.ERROR);
                }
                // Remove all of these tokens
                this.eat(scanner_1.Tokens.PREPROCESSOR_NEWLINE);
                this.removeTokensFrom(previous);
            }
            else if (this.eat(scanner_1.Tokens.PREPROCESSOR_IF)) {
                var isLive = isParentLive;
                // Scan over the entire if-else chain
                while (true) {
                    var condition = this.parseExpression(parser_1.Precedence.LOWEST);
                    // Reject if the condition is missing
                    if (condition == PreprocessorValue.ERROR || !this.expect(scanner_1.Tokens.PREPROCESSOR_NEWLINE)) {
                        return false;
                    }
                    // Remove the #if/#elif header
                    this.removeTokensFrom(previous);
                    // Scan to the next #elif, #else, or #endif
                    if (!this.scan(isLive && condition == PreprocessorValue.TRUE)) {
                        return false;
                    }
                    // Remove these tokens?
                    if (!isLive || condition == PreprocessorValue.FALSE) {
                        this.removeTokensFrom(previous);
                    }
                    else {
                        isLive = false;
                    }
                    // Update the previous pointer so we remove from here next
                    previous = this.previous;
                    // #elif
                    if (this.eat(scanner_1.Tokens.PREPROCESSOR_ELIF)) {
                        continue;
                    }
                    // #else
                    if (this.eat(scanner_1.Tokens.PREPROCESSOR_ELSE)) {
                        if (!this.expect(scanner_1.Tokens.PREPROCESSOR_NEWLINE)) {
                            return false;
                        }
                        // Remove the #else
                        this.removeTokensFrom(previous);
                        // Scan to the #endif
                        if (!this.scan(isLive)) {
                            return false;
                        }
                        // Remove these tokens?
                        if (!isLive) {
                            this.removeTokensFrom(previous);
                        }
                    }
                    // #endif
                    break;
                }
                // All if-else chains end with an #endif
                previous = this.previous;
                if (!this.expect(scanner_1.Tokens.PREPROCESSOR_ENDIF) || !this.peek(scanner_1.Tokens.END_OF_FILE) && !this.expect(scanner_1.Tokens.PREPROCESSOR_NEWLINE)) {
                    return false;
                }
                this.removeTokensFrom(previous);
            }
            else {
                this.isDefineAndUndefAllowed = false;
                this.advance();
            }
        }
        return true;
    }
    parsePrefix() {
        var isDefinedOperator = false;
        var start = this.current;
        // true or false
        if (this.eat(scanner_1.Tokens.TRUE))
            return PreprocessorValue.TRUE;
        if (this.eat(scanner_1.Tokens.FALSE))
            return PreprocessorValue.FALSE;
        // Identifier
        if (this.eat(scanner_1.Tokens.IDENTIFIER)) {
            var name = this.previous.range.toString();
            // Recover from a C-style define operator
            if (this.peek(scanner_1.Tokens.LEFT_PARENTHESIS) && name == "defined") {
                isDefinedOperator = true;
            }
            else {
                var isTrue = this.isDefined(name);
                return isTrue ? PreprocessorValue.TRUE : PreprocessorValue.FALSE;
            }
        }
        // !
        if (this.eat(scanner_1.Tokens.NOT)) {
            var value = this.parseExpression(parser_1.Precedence.UNARY_PREFIX);
            if (value == PreprocessorValue.ERROR)
                return PreprocessorValue.ERROR;
            return value == PreprocessorValue.TRUE ? PreprocessorValue.FALSE : PreprocessorValue.TRUE;
        }
        // Group
        if (this.eat(scanner_1.Tokens.LEFT_PARENTHESIS)) {
            let first = this.current;
            let value = this.parseExpression(parser_1.Precedence.LOWEST);
            if (value == PreprocessorValue.ERROR || !this.expect(scanner_1.Tokens.RIGHT_PARENTHESIS)) {
                return PreprocessorValue.ERROR;
            }
            // Recover from a C-style define operator
            if (isDefinedOperator) {
                let errorMessage = "There is no 'defined' operator";
                if (first.kind == scanner_1.Tokens.IDENTIFIER && this.previous == first.next) {
                    errorMessage += " (just use '" + first.range.toString() + "' instead)";
                }
                this.log.error(log_1.spanRanges(start.range, this.previous.range), errorMessage);
            }
            return value;
        }
        // Recover from a C-style boolean
        if (this.eat(scanner_1.Tokens.INT32)) {
            let isTrue = this.previous.range.toString() != "0";
            this.log.error(this.previous.range, `Unexpected integer (did you mean ' ${isTrue ? "true" : "false"}')?`);
            return isTrue ? PreprocessorValue.TRUE : PreprocessorValue.FALSE;
        }
        this.unexpectedToken();
        return PreprocessorValue.ERROR;
    }
    parseInfix(precedence, left) {
        var operator = this.current.kind;
        // == or !=
        if (precedence < parser_1.Precedence.EQUAL && (this.eat(scanner_1.Tokens.EQUAL) || this.eat(scanner_1.Tokens.NOT_EQUAL))) {
            var right = this.parseExpression(parser_1.Precedence.EQUAL);
            if (right == PreprocessorValue.ERROR)
                return PreprocessorValue.ERROR;
            return (operator == scanner_1.Tokens.EQUAL) == (left == right) ? PreprocessorValue.TRUE : PreprocessorValue.FALSE;
        }
        // &&
        if (precedence < parser_1.Precedence.LOGICAL_AND && this.eat(scanner_1.Tokens.LOGICAL_AND)) {
            var right = this.parseExpression(parser_1.Precedence.LOGICAL_AND);
            if (right == PreprocessorValue.ERROR)
                return PreprocessorValue.ERROR;
            return (left == PreprocessorValue.TRUE && right == PreprocessorValue.TRUE) ? PreprocessorValue.TRUE : PreprocessorValue.FALSE;
        }
        // ||
        if (precedence < parser_1.Precedence.LOGICAL_OR && this.eat(scanner_1.Tokens.LOGICAL_OR)) {
            var right = this.parseExpression(parser_1.Precedence.LOGICAL_OR);
            if (right == PreprocessorValue.ERROR)
                return PreprocessorValue.ERROR;
            return (left == PreprocessorValue.TRUE || right == PreprocessorValue.TRUE) ? PreprocessorValue.TRUE : PreprocessorValue.FALSE;
        }
        // Hook
        if (precedence == parser_1.Precedence.LOWEST && this.eat(scanner_1.Tokens.QUESTION_MARK)) {
            var middle = this.parseExpression(parser_1.Precedence.LOWEST);
            if (middle == PreprocessorValue.ERROR || !this.expect(scanner_1.Tokens.COLON)) {
                return PreprocessorValue.ERROR;
            }
            var right = this.parseExpression(parser_1.Precedence.LOWEST);
            if (right == PreprocessorValue.ERROR) {
                return PreprocessorValue.ERROR;
            }
            return left == PreprocessorValue.TRUE ? middle : right;
        }
        return left;
    }
    parseExpression(precedence) {
        // Prefix
        var value = this.parsePrefix();
        if (value == PreprocessorValue.ERROR) {
            return PreprocessorValue.ERROR;
        }
        // Infix
        while (true) {
            var current = this.current;
            value = this.parseInfix(precedence, value);
            if (value == PreprocessorValue.ERROR)
                return PreprocessorValue.ERROR;
            if (this.current == current)
                break;
        }
        return value;
    }
}
exports.Preprocessor = Preprocessor;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __webpack_require__(11);
/**
 * Created by n.vinayakan on 23.06.17.
 */
class WasmBinaryImport {
    constructor(name, signature, functionIndex) {
        this.name = name;
        this.signature = signature;
        this.functionIndex = functionIndex;
        this.declaration = `declare function ${name}(`;
        signature.argumentTypes.forEach((type, i) => {
            this.declaration += i > 0 ? "," : "";
            this.declaration += `param${i}:${index_1.wasmToTurboType(type)}`;
        });
        this.declaration += "):" + index_1.wasmToTurboType(signature.returnType) + ";";
    }
}
exports.WasmBinaryImport = WasmBinaryImport;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(36));
__export(__webpack_require__(9));
__export(__webpack_require__(5));


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_stack_tracer_1 = __webpack_require__(63);
const utils_1 = __webpack_require__(8);
const opcode_1 = __webpack_require__(17);
const wasm_runtime_local_1 = __webpack_require__(33);
const wasm_type_1 = __webpack_require__(6);
const terminal_1 = __webpack_require__(2);
const index_1 = __webpack_require__(11);
const wasm_module_1 = __webpack_require__(77);
const wasm_function_chunk_1 = __webpack_require__(59);
const wasm_merger_1 = __webpack_require__(76);
/**
 * Created by n.vinayakan on 02.06.17.
 */
class WasmAssembler {
    constructor() {
        this.sectionList = [];
        this.currentSection = null;
        this.currentFunction = null;
        this.module = new wasm_module_1.WasmModule();
        this.stackTracer = new wasm_stack_tracer_1.WasmStackTracer();
    }
    sealFunctions() {
        let runtimeFunctions = [];
        this.module.imports.forEach(_import => {
            let fn = new wasm_stack_tracer_1.WasmRuntimeFunction();
            fn.module = _import.namespace;
            fn.name = _import.name;
            fn.signature = _import.signature;
            fn.isImport = true;
            runtimeFunctions.push(fn);
        });
        this.module.functions.forEach((_wasmFunc) => {
            let fn = new wasm_stack_tracer_1.WasmRuntimeFunction();
            fn.name = index_1.getWasmFunctionName(_wasmFunc.symbol);
            fn.signature = _wasmFunc.signature;
            fn.isImport = _wasmFunc.isExternal;
            if (!_wasmFunc.isExternal) {
                fn.locals = [];
                _wasmFunc.locals.forEach((local) => {
                    fn.locals.push(new wasm_runtime_local_1.WasmRuntimeProperty(local.type, local.name));
                });
            }
            runtimeFunctions.push(fn);
        });
        this.stackTracer.functions = runtimeFunctions;
    }
    startSection(id, name) {
        let section = this.module.binary.getSection(id, name);
        this.currentSection = section;
        this.activePayload = section.payload;
        this.activeCode = section.code;
        return section;
    }
    endSection(section) {
        this.currentSection = null;
        this.activePayload = null;
        this.activeCode = null;
    }
    startFunction(fn, index) {
        this.currentFunction = fn;
        this.stackTracer.startFunction(this.module.importCount + index);
        this.activePayload = fn.body;
        this.activeCode = fn.code;
    }
    endFunction() {
        this.activeCode.removeLastLinebreak();
        this.stackTracer.endFunction();
        this.currentSection.code.appendRaw(this.activeCode.finish());
        this.activePayload = this.currentSection.payload;
        this.activeCode = this.currentSection.code;
    }
    startFunctionChunk(fn, index) {
        let chunk = new wasm_function_chunk_1.WasmFunctionChunk();
        fn.chunks.push(chunk);
        this.prevPayload = this.activePayload;
        this.prevCode = this.activeCode;
        this.activePayload = chunk.payload;
        this.activeCode = chunk.code;
        this.stackTracer.startFunction(index);
        return chunk;
    }
    endFunctionChunk() {
        this.activePayload = this.prevPayload;
        this.activeCode = this.prevCode;
        this.stackTracer.endFunction(true);
    }
    dropStack(max = 1) {
        if (this.stackTracer.context.stack.length > 0) {
            terminal_1.Terminal.warn(`Dropping stack items, '${this.stackTracer.context.fn.name}' func stack contains ${this.stackTracer.context.stack.length} items`);
            let item = this.stackTracer.context.stack.pop(true);
            while (item !== undefined && max > 0) {
                terminal_1.Terminal.warn(wasm_type_1.WasmType[item.type]);
                this.activePayload.append(opcode_1.WasmOpcode.DROP);
                this.activeCode.append("drop\n");
                item = this.stackTracer.context.stack.pop(true);
                max--;
            }
        }
    }
    append(offset = 0, value = null, msg = null) {
        this.activePayload.log += (value != null ? `${utils_1.toHex(offset + this.activePayload.position)}: ${utils_1.toHex(value, 2)}                    ; ` : "") + (msg != null ? `${msg}\n` : "\n");
        if (value) {
            this.activePayload.append(value);
        }
    }
    appendOpcode(offset = 0, opcode, inline_value, skip = false) {
        logOpcode(this.activePayload, offset, opcode, inline_value);
        this.activePayload.append(opcode);
        let opcodeWithoutOperand = this.stackTracer.pushOpcode(opcode);
        if (opcodeWithoutOperand !== null && !skip) {
            let isEnd = opcode === opcode_1.WasmOpcode.END;
            let indent = this.isBlock(opcode) ? 1 : (isEnd ? -1 : 0);
            if (isEnd) {
                this.activeCode.clearIndent(1);
            }
            this.activeCode.append(opcodeWithoutOperand + "\n", indent);
        }
    }
    isBlock(opcode) {
        return opcode === opcode_1.WasmOpcode.BLOCK ||
            opcode === opcode_1.WasmOpcode.LOOP ||
            opcode === opcode_1.WasmOpcode.IF ||
            opcode === opcode_1.WasmOpcode.IF_ELSE;
    }
    writeUnsignedLEB128(value) {
        this.activePayload.writeUnsignedLEB128(value);
        let opcodeAndOperand = this.stackTracer.pushValue(value);
        if (opcodeAndOperand !== null) {
            this.activeCode.append(opcodeAndOperand + "\n");
        }
    }
    writeLEB128(value) {
        this.activePayload.writeLEB128(value);
        let opcodeAndOperand = this.stackTracer.pushValue(value);
        if (opcodeAndOperand !== null) {
            this.activeCode.append(opcodeAndOperand + "\n");
        }
    }
    writeFloat(value) {
        this.activePayload.writeFloat(value);
        let opcodeAndOperand = this.stackTracer.pushValue(value);
        if (opcodeAndOperand !== null) {
            this.activeCode.append(opcodeAndOperand + "\n");
        }
    }
    writeDouble(value) {
        this.activePayload.writeDouble(value);
        let opcodeAndOperand = this.stackTracer.pushValue(value);
        if (opcodeAndOperand !== null) {
            this.activeCode.append(opcodeAndOperand + "\n");
        }
    }
    writeWasmString(value) {
        this.activePayload.writeWasmString(value);
    }
    mergeBinaries(binaries) {
        terminal_1.Terminal.time("Merging binaries");
        wasm_merger_1.WasmMerger.merge(binaries, this.module.binary);
        terminal_1.Terminal.timeEnd("Merging binaries");
    }
    finish() {
        this.module.publish();
    }
}
exports.WasmAssembler = WasmAssembler;
function logOpcode(payload, offset = 0, opcode, inline_value) {
    payload.log += `${utils_1.toHex(offset + payload.position)}: ${utils_1.toHex(opcode, 2)}                    ; ${opcode_1.WasmOpcode[opcode]} ${inline_value ? inline_value : ""}\n`;
}
exports.logOpcode = logOpcode;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const opcode_1 = __webpack_require__(17);
/**
 * Created by n.vinayakan on 28.05.17.
 */
exports.builtins = [
    "rotl",
    "rotl32",
    "rotr",
    "rotr32",
    "clz",
    "clz32",
    "ctz",
    "ctz32",
    "popcnt",
    "popcnt32",
    "abs",
    "abs32",
    "ceil",
    "ceil32",
    "floor",
    "floor32",
    "sqrt",
    "sqrt32",
    "trunc",
    "trunc32",
    "nearest",
    "nearest32",
    "min",
    "min32",
    "max",
    "max32",
    "copysign",
    "copysign32",
    "reinterpret_i32",
    "reinterpret_i64",
    "reinterpret_f32",
    "reinterpret_f64",
    "current_memory",
    "grow_memory"
];
function getBuiltinOpcode(name) {
    switch (name) {
        case "rotl": return opcode_1.WasmOpcode.I64_ROTL;
        case "rotl32": return opcode_1.WasmOpcode.I32_ROTL;
        case "rotr": return opcode_1.WasmOpcode.I64_ROTR;
        case "rotr32": return opcode_1.WasmOpcode.I32_ROTR;
        case "clz": return opcode_1.WasmOpcode.I64_CLZ;
        case "clz32": return opcode_1.WasmOpcode.I32_CLZ;
        case "ctz": return opcode_1.WasmOpcode.I64_CTZ;
        case "ctz32": return opcode_1.WasmOpcode.I32_CTZ;
        case "popcnt": return opcode_1.WasmOpcode.I64_POPCNT;
        case "popcnt32": return opcode_1.WasmOpcode.I32_POPCNT;
        case "abs": return opcode_1.WasmOpcode.F64_ABS;
        case "abs32": return opcode_1.WasmOpcode.F32_ABS;
        case "ceil": return opcode_1.WasmOpcode.F64_CEIL;
        case "ceil32": return opcode_1.WasmOpcode.F32_CEIL;
        case "floor": return opcode_1.WasmOpcode.F64_FLOOR;
        case "floor32": return opcode_1.WasmOpcode.F32_FLOOR;
        case "sqrt": return opcode_1.WasmOpcode.F64_SQRT;
        case "sqrt32": return opcode_1.WasmOpcode.F32_SQRT;
        case "trunc": return opcode_1.WasmOpcode.F64_TRUNC;
        case "trunc32": return opcode_1.WasmOpcode.F32_TRUNC;
        case "nearest": return opcode_1.WasmOpcode.F64_NEAREST;
        case "nearest32": return opcode_1.WasmOpcode.F32_NEAREST;
        case "min": return opcode_1.WasmOpcode.F64_MIN;
        case "min32": return opcode_1.WasmOpcode.F32_MIN;
        case "max": return opcode_1.WasmOpcode.F64_MAX;
        case "max32": return opcode_1.WasmOpcode.F32_MAX;
        case "copysign": return opcode_1.WasmOpcode.F64_COPYSIGN;
        case "copysign32": return opcode_1.WasmOpcode.F32_COPYSIGN;
        case "reinterpret_i32": return opcode_1.WasmOpcode.F32_REINTERPRET_I32;
        case "reinterpret_i64": return opcode_1.WasmOpcode.F64_REINTERPRET_I64;
        case "reinterpret_f32": return opcode_1.WasmOpcode.I32_REINTERPRET_F32;
        case "reinterpret_f64": return opcode_1.WasmOpcode.I64_REINTERPRET_F64;
        case "current_memory": return opcode_1.WasmOpcode.MEMORY_SIZE;
        case "grow_memory": return opcode_1.WasmOpcode.GROW_MEMORY;
        default: throw "No builtin function named '" + name + "'";
    }
}
exports.getBuiltinOpcode = getBuiltinOpcode;
function isBuiltin(name) {
    return exports.builtins.indexOf(name) > -1;
}
exports.isBuiltin = isBuiltin;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bytearray_1 = __webpack_require__(0);
const stringbuilder_1 = __webpack_require__(20);
/**
 * Created by 01 on 2017-06-23.
 */
class WasmFunctionChunk {
    constructor(payload = new bytearray_1.ByteArray(), code = new stringbuilder_1.StringBuilder(2)) {
        this.payload = payload;
        this.code = code;
        this.code.emitIndent(2);
    }
}
exports.WasmFunctionChunk = WasmFunctionChunk;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by n.vinayakan on 02.06.17.
 */
class WasmLocal {
    constructor(type, name, symbol, isArgument = false) {
        this.type = type;
        this.name = name;
        this.symbol = symbol;
        this.isArgument = isArgument;
    }
}
exports.WasmLocal = WasmLocal;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by n.vinayakan on 02.06.17.
 */
class WasmSharedOffset {
    constructor() {
        this.nextLocalOffset = 0;
        this.localCount = 0;
    }
}
exports.WasmSharedOffset = WasmSharedOffset;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bytearray_1 = __webpack_require__(0);
/**
 * Created by n.vinayakan on 17.06.17.
 */
class WasmOptimizer {
    constructor() {
    }
    static optimize(inputWASM, level = 1) {
        if (WasmOptimizer.instance === null) {
            WasmOptimizer.instance = new WasmOptimizer();
        }
        WasmOptimizer.instance.initialize(inputWASM);
        switch (level) {
            case 1:
                WasmOptimizer.instance.optimizeLevel_1();
                break;
            case 2:
                WasmOptimizer.instance.optimizeLevel_2();
                break;
            case 3:
                WasmOptimizer.instance.optimizeLevel_3();
                break;
        }
    }
    initialize(inputWASM) {
        this.inputWASM = inputWASM instanceof Uint8Array ? new bytearray_1.ByteArray(inputWASM.buffer) : inputWASM;
    }
    optimizeLevel_1() {
    }
    optimizeLevel_2() {
    }
    optimizeLevel_3() {
    }
}
WasmOptimizer.instance = null;
exports.WasmOptimizer = WasmOptimizer;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_type_1 = __webpack_require__(6);
const opcode_1 = __webpack_require__(17);
const wasm_runtime_local_1 = __webpack_require__(33);
const bytearray_1 = __webpack_require__(0);
const terminal_1 = __webpack_require__(2);
/**
 * Created by n.vinayakan on 02.06.17.
 */
class WasmStackItem {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
exports.WasmStackItem = WasmStackItem;
class WasmStack {
    constructor() {
        this.list = [];
    }
    get length() {
        return this.list.length;
    }
    push(item) {
        this.list.push(item);
    }
    pop(silent = false) {
        if (this.list.length === 0) {
            if (!silent) {
                let error = `Stack is empty`;
                terminal_1.Terminal.warn(error);
                // throw error;
            }
        }
        return this.list.pop();
    }
    clear() {
        this.list = [];
    }
}
exports.WasmStack = WasmStack;
class WasmRuntimeFunction {
    constructor() {
    }
    get returnType() {
        return this.signature.returnType;
    }
    execute(...param) {
        throw "Wasm runtime function execution not implemented!";
    }
}
exports.WasmRuntimeFunction = WasmRuntimeFunction;
class WasmStackContext {
    constructor(fn) {
        this.fn = fn;
        if (fn === undefined) {
            terminal_1.Terminal.error("Undefined runtime function");
            debugger;
        }
        this.stack = new WasmStack();
        this.opcodes = [];
    }
}
exports.WasmStackContext = WasmStackContext;
/**
 * Wasm stack tracer, this is not a stack machine. this will not execute functions
 * instead trace state of stack while emitting function body.
 */
class WasmStackTracer {
    constructor() {
        this.context = null;
        this.memory = new bytearray_1.ByteArray();
    }
    setGlobals(globals) {
        this.globals = [];
        globals.forEach(global => {
            this.globals.push(new wasm_runtime_local_1.WasmRuntimeProperty(global.type, global.name));
        });
    }
    startFunction(index) {
        this.context = new WasmStackContext(this.functions[index]);
    }
    endFunction(skip = false) {
        if (!skip && this.context.stack.length > 0) {
            if (this.context.fn.returnType === wasm_type_1.WasmType.VOID) {
                let error = `Function '${this.context.fn.name}' does not return anything but stack is not empty. Stack contains ${this.context.stack.length} items`;
                terminal_1.Terminal.error(error);
                // throw error;
            }
        }
        this.context = null;
    }
    callFunction(index) {
        let fn = this.functions[index];
        if (fn === undefined) {
            let error = "Function not defined at index " + index;
            terminal_1.Terminal.error(error);
            throw error;
        }
        let returnType = fn.returnType;
        for (let i = 0; i < fn.signature.argumentTypes.length; i++) {
            this.context.stack.pop();
        }
        if (returnType !== wasm_type_1.WasmType.VOID) {
            this.context.stack.push(new WasmStackItem(returnType, undefined));
        }
    }
    pushOpcode(opcode) {
        if (this.context !== null) {
            this.context.opcodes.push(opcode);
            this.context.lastOpcode = opcode;
            return this.updateStack(opcode);
        }
        return null;
    }
    pushValue(value) {
        if (this.context !== null) {
            return this.updateStack(this.context.lastOpcode, value);
        }
        return null;
    }
    updateStack(opcode, value) {
        let type = null;
        if (opcode !== undefined && opcode !== null) {
            type = getOprandType(opcode);
        }
        switch (opcode) {
            case opcode_1.WasmOpcode.CALL:
                if (value !== undefined) {
                    this.callFunction(value);
                    let fn = this.functions[value];
                    return `call ${fn.name ? "$" + fn.name : value}`;
                }
                break;
            case opcode_1.WasmOpcode.END:
                this.context.stack.clear();
                return "end";
            case opcode_1.WasmOpcode.RETURN:
                if (this.context.stack.length == 0) {
                    // happens when def x(){if(1)1
                    terminal_1.Terminal.warn(`Empty stack on return in function ${this.context.fn.name}`);
                }
                return "return";
            case opcode_1.WasmOpcode.I32_CONST:
            case opcode_1.WasmOpcode.I64_CONST:
            case opcode_1.WasmOpcode.F32_CONST:
            case opcode_1.WasmOpcode.F64_CONST:
                if (value !== undefined) {
                    this.context.stack.push(new WasmStackItem(type, value));
                    return `${opcode_1.WasmOpcode[opcode]} ${value}`;
                }
                break;
            case opcode_1.WasmOpcode.SET_LOCAL:
                if (value !== undefined) {
                    if (this.context.fn.locals.length <= value) {
                        let errorMsg = `Local index ${value} out of range ${this.context.fn.locals.length} in function ${this.context.fn.name}`;
                        terminal_1.Terminal.error(errorMsg);
                        throw errorMsg;
                    }
                    else {
                        let a = this.context.stack.pop();
                        let local = this.context.fn.locals[value];
                        if (a !== undefined) {
                            this.context.fn.locals[value].value = a.value;
                        }
                        return `${opcode_1.WasmOpcode[opcode]} $${local.name}`;
                    }
                }
                break;
            case opcode_1.WasmOpcode.GET_LOCAL:
                if (value !== undefined) {
                    let a = this.context.fn.locals[value];
                    this.context.stack.push(new WasmStackItem(a.type, a.value));
                    return `${opcode_1.WasmOpcode[opcode]} $${a.name}`;
                }
            // break;
            case opcode_1.WasmOpcode.SET_GLOBAL:
                if (value !== undefined) {
                    if (this.globals.length <= value) {
                        let errorMsg = `Global index ${value} out of range ${this.globals.length}`;
                        terminal_1.Terminal.error(errorMsg);
                        throw errorMsg;
                    }
                    else {
                        let a = this.context.stack.pop();
                        this.globals[value].value = a.value;
                        return `${opcode_1.WasmOpcode[opcode]} ${value}`;
                    }
                }
                break;
            case opcode_1.WasmOpcode.GET_GLOBAL:
                if (value !== undefined) {
                    let a = this.globals[value];
                    this.context.stack.push(new WasmStackItem(a.type, a.value));
                    return `${opcode_1.WasmOpcode[opcode]} ${value}`;
                }
                break;
            // ADD
            case opcode_1.WasmOpcode.I32_ADD:
            case opcode_1.WasmOpcode.I64_ADD:
            case opcode_1.WasmOpcode.F32_ADD:
            case opcode_1.WasmOpcode.F64_ADD: {
                let a = this.context.stack.pop();
                let b = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value + b.value));
                return opcode_1.WasmOpcode[opcode];
            }
            //SUB
            case opcode_1.WasmOpcode.I32_SUB:
            case opcode_1.WasmOpcode.I64_SUB:
            case opcode_1.WasmOpcode.F32_SUB:
            case opcode_1.WasmOpcode.F64_SUB: {
                let a = this.context.stack.pop();
                let b = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value - b.value));
                return opcode_1.WasmOpcode[opcode];
            }
            //MUL
            case opcode_1.WasmOpcode.I32_MUL:
            case opcode_1.WasmOpcode.I64_MUL:
            case opcode_1.WasmOpcode.F32_MUL:
            case opcode_1.WasmOpcode.F64_MUL: {
                let a = this.context.stack.pop();
                let b = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value * b.value));
                return opcode_1.WasmOpcode[opcode];
            }
            //DIV
            case opcode_1.WasmOpcode.I32_DIV_S:
            case opcode_1.WasmOpcode.I32_DIV_U:
            case opcode_1.WasmOpcode.I64_DIV_S:
            case opcode_1.WasmOpcode.I64_DIV_U:
            case opcode_1.WasmOpcode.F32_DIV:
            case opcode_1.WasmOpcode.F64_DIV: {
                let a = this.context.stack.pop();
                let b = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value / b.value));
                break;
            }
            //REM
            case opcode_1.WasmOpcode.I32_REM_S:
            case opcode_1.WasmOpcode.I32_REM_U:
            case opcode_1.WasmOpcode.I64_REM_S:
            case opcode_1.WasmOpcode.I64_REM_U: {
                let a = this.context.stack.pop();
                let b = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value % b.value));
                return opcode_1.WasmOpcode[opcode];
            }
            //GT
            case opcode_1.WasmOpcode.I32_GT_S:
            case opcode_1.WasmOpcode.I32_GT_U:
            case opcode_1.WasmOpcode.I64_GT_S:
            case opcode_1.WasmOpcode.I64_GT_U:
            case opcode_1.WasmOpcode.F32_GT:
            case opcode_1.WasmOpcode.F64_GT: {
                let a = this.context.stack.pop();
                let b = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value > b.value ? 1 : 0));
                return opcode_1.WasmOpcode[opcode];
            }
            //GE
            case opcode_1.WasmOpcode.I32_GE_S:
            case opcode_1.WasmOpcode.I32_GE_U:
            case opcode_1.WasmOpcode.I64_GE_S:
            case opcode_1.WasmOpcode.I64_GE_U:
            case opcode_1.WasmOpcode.F32_GE:
            case opcode_1.WasmOpcode.F64_GE: {
                let a = this.context.stack.pop();
                let b = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value >= b.value ? 1 : 0));
                return opcode_1.WasmOpcode[opcode];
            }
            //LT
            case opcode_1.WasmOpcode.I32_LT_S:
            case opcode_1.WasmOpcode.I32_LT_U:
            case opcode_1.WasmOpcode.I64_LT_S:
            case opcode_1.WasmOpcode.I64_LT_U:
            case opcode_1.WasmOpcode.F32_LT:
            case opcode_1.WasmOpcode.F64_LT: {
                let a = this.context.stack.pop();
                let b = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value < b.value ? 1 : 0));
                return opcode_1.WasmOpcode[opcode];
            }
            //LE
            case opcode_1.WasmOpcode.I32_LE_S:
            case opcode_1.WasmOpcode.I32_LE_U:
            case opcode_1.WasmOpcode.I64_LE_S:
            case opcode_1.WasmOpcode.I64_LE_U:
            case opcode_1.WasmOpcode.F32_LE:
            case opcode_1.WasmOpcode.F64_LE: {
                let a = this.context.stack.pop();
                let b = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value <= b.value ? 1 : 0));
                return opcode_1.WasmOpcode[opcode];
            }
            //EQ
            case opcode_1.WasmOpcode.I32_EQ:
            case opcode_1.WasmOpcode.I64_EQ:
            case opcode_1.WasmOpcode.F32_EQ:
            case opcode_1.WasmOpcode.F64_EQ: {
                let a = this.context.stack.pop();
                let b = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value === b.value ? 1 : 0));
                return opcode_1.WasmOpcode[opcode];
            }
            //NE
            case opcode_1.WasmOpcode.I32_NE:
            case opcode_1.WasmOpcode.I64_NE:
            case opcode_1.WasmOpcode.F32_NE:
            case opcode_1.WasmOpcode.F64_NE: {
                let a = this.context.stack.pop();
                let b = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value !== b.value ? 1 : 0));
                return opcode_1.WasmOpcode[opcode];
            }
            //EQZ
            case opcode_1.WasmOpcode.I32_EQZ:
            case opcode_1.WasmOpcode.I64_EQZ: {
                let a = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value === 0 ? 1 : 0));
                return opcode_1.WasmOpcode[opcode];
            }
            //AND
            case opcode_1.WasmOpcode.I32_AND:
            case opcode_1.WasmOpcode.I64_AND: {
                let a = this.context.stack.pop();
                let b = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value & b.value));
                return opcode_1.WasmOpcode[opcode];
            }
            //OR
            case opcode_1.WasmOpcode.I32_OR:
            case opcode_1.WasmOpcode.I64_OR: {
                let a = this.context.stack.pop();
                let b = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value | b.value));
                return opcode_1.WasmOpcode[opcode];
            }
            //XOR
            case opcode_1.WasmOpcode.I32_XOR:
            case opcode_1.WasmOpcode.I64_XOR: {
                let a = this.context.stack.pop();
                let b = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, a.value ^ b.value));
                return opcode_1.WasmOpcode[opcode];
            }
            //CTZ
            case opcode_1.WasmOpcode.I32_CTZ:
            case opcode_1.WasmOpcode.I64_CTZ: {
                // let a = this.context.stack.pop();
                // this.context.stack.push(new WasmStackItem(type, ctz(a.value)));
                break;
            }
            //CLZ
            case opcode_1.WasmOpcode.I32_CLZ:
            case opcode_1.WasmOpcode.I64_CLZ: {
                let a = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, Math.clz32(a.value)));
                return opcode_1.WasmOpcode[opcode];
            }
            //CLZ
            case opcode_1.WasmOpcode.I32_ROTL:
            case opcode_1.WasmOpcode.I64_ROTL: {
                // let a = this.context.stack.pop();
                // this.context.stack.push(new WasmStackItem(type, rotl(a.value)));
                return opcode_1.WasmOpcode[opcode];
            }
            //SHR
            case opcode_1.WasmOpcode.I32_SHR_S:
            case opcode_1.WasmOpcode.I32_SHR_U:
            case opcode_1.WasmOpcode.I64_SHR_S:
            case opcode_1.WasmOpcode.I64_SHR_U: {
                // let a = this.context.stack.pop();
                // this.context.stack.push(new WasmStackItem(type, shr(a.value)));
                return opcode_1.WasmOpcode[opcode];
            }
            //SHR
            case opcode_1.WasmOpcode.I32_SHL:
            case opcode_1.WasmOpcode.I64_SHL: {
                // let a = this.context.stack.pop();
                // this.context.stack.push(new WasmStackItem(type, shl(a.value)));
                return opcode_1.WasmOpcode[opcode];
            }
            //POPCNT
            case opcode_1.WasmOpcode.I32_POPCNT:
            case opcode_1.WasmOpcode.I64_POPCNT: {
                // let a = this.context.stack.pop();
                // this.context.stack.push(new WasmStackItem(type, popcnt(a.value)));
                return opcode_1.WasmOpcode[opcode];
            }
            case opcode_1.WasmOpcode.F32_SQRT:
            case opcode_1.WasmOpcode.F64_SQRT: {
                let a = this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(a.type, Math.sqrt(a.value)));
                return opcode_1.WasmOpcode[opcode];
            }
            //LOAD
            case opcode_1.WasmOpcode.I32_LOAD:
            case opcode_1.WasmOpcode.I64_LOAD:
            case opcode_1.WasmOpcode.I32_LOAD8_U:
            case opcode_1.WasmOpcode.I32_LOAD8_S:
            case opcode_1.WasmOpcode.I64_LOAD8_U:
            case opcode_1.WasmOpcode.I64_LOAD8_S:
            case opcode_1.WasmOpcode.I32_LOAD16_U:
            case opcode_1.WasmOpcode.I32_LOAD16_S:
            case opcode_1.WasmOpcode.I64_LOAD16_U:
            case opcode_1.WasmOpcode.I64_LOAD16_S:
            case opcode_1.WasmOpcode.F32_LOAD:
            case opcode_1.WasmOpcode.F64_LOAD: {
                this.context.stack.pop();
                this.context.stack.push(new WasmStackItem(type, 0));
                this.context.lastOpcode = null;
                return opcode_1.WasmOpcode[opcode];
            }
            //STORE
            case opcode_1.WasmOpcode.I32_STORE:
            case opcode_1.WasmOpcode.I64_STORE:
            case opcode_1.WasmOpcode.I32_STORE8:
            case opcode_1.WasmOpcode.I64_STORE8:
            case opcode_1.WasmOpcode.I32_STORE16:
            case opcode_1.WasmOpcode.I64_STORE16:
            case opcode_1.WasmOpcode.F32_STORE:
            case opcode_1.WasmOpcode.F64_STORE: {
                let a = this.context.stack.pop(); // address
                let b = this.context.stack.pop(); // offset
                this.context.lastOpcode = null;
                return opcode_1.WasmOpcode[opcode];
            }
            case opcode_1.WasmOpcode.IF: {
                let a = this.context.stack.pop();
                this.context.lastOpcode = null;
                return opcode_1.WasmOpcode[opcode];
            }
            case opcode_1.WasmOpcode.BR_IF:
                if (value !== undefined) {
                    let a = this.context.stack.pop();
                    this.context.lastOpcode = null;
                    return `${opcode_1.WasmOpcode[opcode]} ${value}`;
                }
                break;
            case opcode_1.WasmOpcode.IF_ELSE:
            case opcode_1.WasmOpcode.BLOCK:
            case opcode_1.WasmOpcode.LOOP:
                //ignore
                return opcode_1.WasmOpcode[opcode];
            case opcode_1.WasmOpcode.BR:
                if (value !== undefined) {
                    return `${opcode_1.WasmOpcode[opcode]} ${value}`;
                }
                break;
            case opcode_1.WasmOpcode.I32_WRAP_I64:
            case opcode_1.WasmOpcode.I32_TRUNC_S_F32:
            case opcode_1.WasmOpcode.I32_TRUNC_U_F32:
            case opcode_1.WasmOpcode.I32_TRUNC_S_F64:
            case opcode_1.WasmOpcode.I32_TRUNC_U_F64:
            case opcode_1.WasmOpcode.I32_REINTERPRET_F32:
            case opcode_1.WasmOpcode.I64_TRUNC_S_F32:
            case opcode_1.WasmOpcode.I64_TRUNC_U_F32:
            case opcode_1.WasmOpcode.I64_TRUNC_S_F64:
            case opcode_1.WasmOpcode.I64_TRUNC_U_F64:
            case opcode_1.WasmOpcode.I64_EXTEND_S_I32:
            case opcode_1.WasmOpcode.I64_EXTEND_U_I32:
            case opcode_1.WasmOpcode.F32_DEMOTE_F64:
            case opcode_1.WasmOpcode.F32_TRUNC:
            case opcode_1.WasmOpcode.F32_REINTERPRET_I32:
            case opcode_1.WasmOpcode.F32_CONVERT_S_I32:
            case opcode_1.WasmOpcode.F32_CONVERT_U_I32:
            case opcode_1.WasmOpcode.F32_CONVERT_S_I64:
            case opcode_1.WasmOpcode.F32_CONVERT_U_I64:
            case opcode_1.WasmOpcode.F64_PROMOTE_F32:
            case opcode_1.WasmOpcode.F64_TRUNC:
            case opcode_1.WasmOpcode.F64_REINTERPRET_I64:
            case opcode_1.WasmOpcode.F64_CONVERT_S_I32:
            case opcode_1.WasmOpcode.F64_CONVERT_U_I32:
            case opcode_1.WasmOpcode.F64_CONVERT_S_I64:
            case opcode_1.WasmOpcode.F64_CONVERT_U_I64:
                //ignore  > pop > push
                return opcode_1.WasmOpcode[opcode];
            case null:
            case undefined:
                //ignore
                break;
            default:
                terminal_1.Terminal.warn(`Unhandled Opcode ${opcode} => ${opcode_1.WasmOpcode[opcode]}`);
                break;
        }
        return null;
    }
}
exports.WasmStackTracer = WasmStackTracer;
function getOprandType(opcode) {
    switch (opcode) {
        // Int32
        case opcode_1.WasmOpcode.I32_CONST:
        case opcode_1.WasmOpcode.I32_ADD:
        case opcode_1.WasmOpcode.I32_MUL:
        case opcode_1.WasmOpcode.I32_SUB:
        case opcode_1.WasmOpcode.I32_DIV_S:
        case opcode_1.WasmOpcode.I32_DIV_U:
        case opcode_1.WasmOpcode.I32_REM_S:
        case opcode_1.WasmOpcode.I32_REM_U:
        case opcode_1.WasmOpcode.I32_GE_S:
        case opcode_1.WasmOpcode.I32_GE_U:
        case opcode_1.WasmOpcode.I32_LE_S:
        case opcode_1.WasmOpcode.I32_LE_U:
        case opcode_1.WasmOpcode.I32_GT_S:
        case opcode_1.WasmOpcode.I32_GT_U:
        case opcode_1.WasmOpcode.I32_LT_S:
        case opcode_1.WasmOpcode.I32_LT_U:
        case opcode_1.WasmOpcode.I32_EQ:
        case opcode_1.WasmOpcode.I32_NE:
        case opcode_1.WasmOpcode.I32_EQZ:
        case opcode_1.WasmOpcode.I32_AND:
        case opcode_1.WasmOpcode.I32_OR:
        case opcode_1.WasmOpcode.I32_XOR:
        case opcode_1.WasmOpcode.I32_CTZ:
        case opcode_1.WasmOpcode.I32_CLZ:
        case opcode_1.WasmOpcode.I32_ROTL:
        case opcode_1.WasmOpcode.I32_ROTR:
        case opcode_1.WasmOpcode.I32_SHL:
        case opcode_1.WasmOpcode.I32_SHR_S:
        case opcode_1.WasmOpcode.I32_SHR_U:
        case opcode_1.WasmOpcode.I32_POPCNT:
        case opcode_1.WasmOpcode.I32_LOAD:
        case opcode_1.WasmOpcode.I32_LOAD8_S:
        case opcode_1.WasmOpcode.I32_LOAD8_U:
        case opcode_1.WasmOpcode.I32_LOAD16_S:
        case opcode_1.WasmOpcode.I32_LOAD16_U:
        case opcode_1.WasmOpcode.I32_STORE16:
        case opcode_1.WasmOpcode.I32_STORE8:
        case opcode_1.WasmOpcode.I32_STORE:
        case opcode_1.WasmOpcode.I32_REINTERPRET_F32:
        case opcode_1.WasmOpcode.I32_TRUNC_S_F32:
        case opcode_1.WasmOpcode.I32_TRUNC_U_F32:
        case opcode_1.WasmOpcode.I32_TRUNC_S_F64:
        case opcode_1.WasmOpcode.I32_TRUNC_U_F64:
        case opcode_1.WasmOpcode.I32_WRAP_I64:
            return wasm_type_1.WasmType.I32;
        // Int64
        case opcode_1.WasmOpcode.I64_CONST:
        case opcode_1.WasmOpcode.I64_ADD:
        case opcode_1.WasmOpcode.I64_MUL:
        case opcode_1.WasmOpcode.I64_SUB:
        case opcode_1.WasmOpcode.I64_DIV_S:
        case opcode_1.WasmOpcode.I64_DIV_U:
        case opcode_1.WasmOpcode.I64_CLZ:
        case opcode_1.WasmOpcode.I64_ROTL:
        case opcode_1.WasmOpcode.I64_AND:
        case opcode_1.WasmOpcode.I64_CTZ:
        case opcode_1.WasmOpcode.I64_EQ:
        case opcode_1.WasmOpcode.I64_EQZ:
        case opcode_1.WasmOpcode.I64_GE_S:
        case opcode_1.WasmOpcode.I64_GE_U:
        case opcode_1.WasmOpcode.I64_LE_S:
        case opcode_1.WasmOpcode.I64_LE_U:
        case opcode_1.WasmOpcode.I64_GT_S:
        case opcode_1.WasmOpcode.I64_GT_U:
        case opcode_1.WasmOpcode.I64_LT_S:
        case opcode_1.WasmOpcode.I64_LT_U:
        case opcode_1.WasmOpcode.I64_LOAD:
        case opcode_1.WasmOpcode.I64_LOAD8_S:
        case opcode_1.WasmOpcode.I64_LOAD8_U:
        case opcode_1.WasmOpcode.I64_LOAD16_S:
        case opcode_1.WasmOpcode.I64_LOAD16_U:
        case opcode_1.WasmOpcode.I64_NE:
        case opcode_1.WasmOpcode.I64_XOR:
        case opcode_1.WasmOpcode.I64_STORE16:
        case opcode_1.WasmOpcode.I64_STORE8:
        case opcode_1.WasmOpcode.I64_STORE:
        case opcode_1.WasmOpcode.I64_SHR_S:
        case opcode_1.WasmOpcode.I64_SHR_U:
        case opcode_1.WasmOpcode.I64_SHL:
        case opcode_1.WasmOpcode.I64_ROTR:
        case opcode_1.WasmOpcode.I64_REM_S:
        case opcode_1.WasmOpcode.I64_REM_U:
        case opcode_1.WasmOpcode.I64_POPCNT:
        case opcode_1.WasmOpcode.I64_OR:
        case opcode_1.WasmOpcode.I64_REINTERPRET_F64:
        case opcode_1.WasmOpcode.I64_TRUNC_S_F32:
        case opcode_1.WasmOpcode.I64_TRUNC_U_F32:
        case opcode_1.WasmOpcode.I64_TRUNC_S_F64:
        case opcode_1.WasmOpcode.I64_TRUNC_U_F64:
        case opcode_1.WasmOpcode.I64_EXTEND_S_I32:
        case opcode_1.WasmOpcode.I64_EXTEND_U_I32:
            return wasm_type_1.WasmType.I64;
        // Float32
        case opcode_1.WasmOpcode.F32_CONST:
        case opcode_1.WasmOpcode.F32_ADD:
        case opcode_1.WasmOpcode.F32_SUB:
        case opcode_1.WasmOpcode.F32_MUL:
        case opcode_1.WasmOpcode.F32_DIV:
        case opcode_1.WasmOpcode.F32_SQRT:
        case opcode_1.WasmOpcode.F32_NEG:
        case opcode_1.WasmOpcode.F32_NE:
        case opcode_1.WasmOpcode.F32_ABS:
        case opcode_1.WasmOpcode.F32_CEIL:
        case opcode_1.WasmOpcode.F32_EQ:
        case opcode_1.WasmOpcode.F32_FLOOR:
        case opcode_1.WasmOpcode.F32_NEAREST:
        case opcode_1.WasmOpcode.F32_MIN:
        case opcode_1.WasmOpcode.F32_MAX:
        case opcode_1.WasmOpcode.F32_GE:
        case opcode_1.WasmOpcode.F32_GT:
        case opcode_1.WasmOpcode.F32_LT:
        case opcode_1.WasmOpcode.F32_LE:
        case opcode_1.WasmOpcode.F32_COPYSIGN:
        case opcode_1.WasmOpcode.F32_LOAD:
        case opcode_1.WasmOpcode.F32_STORE:
        case opcode_1.WasmOpcode.F32_TRUNC:
        case opcode_1.WasmOpcode.F32_DEMOTE_F64:
        case opcode_1.WasmOpcode.F32_CONVERT_S_I32:
        case opcode_1.WasmOpcode.F32_CONVERT_U_I32:
        case opcode_1.WasmOpcode.F32_CONVERT_S_I64:
        case opcode_1.WasmOpcode.F32_CONVERT_U_I64:
        case opcode_1.WasmOpcode.F32_REINTERPRET_I32:
            return wasm_type_1.WasmType.F32;
        // Float64
        case opcode_1.WasmOpcode.F64_CONST:
        case opcode_1.WasmOpcode.F64_ADD:
        case opcode_1.WasmOpcode.F64_SUB:
        case opcode_1.WasmOpcode.F64_MUL:
        case opcode_1.WasmOpcode.F64_DIV:
        case opcode_1.WasmOpcode.F64_SQRT:
        case opcode_1.WasmOpcode.F64_NEG:
        case opcode_1.WasmOpcode.F64_NE:
        case opcode_1.WasmOpcode.F64_ABS:
        case opcode_1.WasmOpcode.F64_CEIL:
        case opcode_1.WasmOpcode.F64_EQ:
        case opcode_1.WasmOpcode.F64_FLOOR:
        case opcode_1.WasmOpcode.F64_NEAREST:
        case opcode_1.WasmOpcode.F64_MIN:
        case opcode_1.WasmOpcode.F64_MAX:
        case opcode_1.WasmOpcode.F64_GE:
        case opcode_1.WasmOpcode.F64_GT:
        case opcode_1.WasmOpcode.F64_LT:
        case opcode_1.WasmOpcode.F64_LE:
        case opcode_1.WasmOpcode.F64_COPYSIGN:
        case opcode_1.WasmOpcode.F64_LOAD:
        case opcode_1.WasmOpcode.F64_STORE:
        case opcode_1.WasmOpcode.F64_TRUNC:
        case opcode_1.WasmOpcode.F64_PROMOTE_F32:
        case opcode_1.WasmOpcode.F64_CONVERT_S_I32:
        case opcode_1.WasmOpcode.F64_CONVERT_U_I32:
        case opcode_1.WasmOpcode.F64_CONVERT_S_I64:
        case opcode_1.WasmOpcode.F64_CONVERT_U_I64:
        case opcode_1.WasmOpcode.F64_REINTERPRET_I64:
            return wasm_type_1.WasmType.F64;
        // No types
        case opcode_1.WasmOpcode.CALL:
        case opcode_1.WasmOpcode.END:
        case opcode_1.WasmOpcode.RETURN:
        case opcode_1.WasmOpcode.GET_GLOBAL:
        case opcode_1.WasmOpcode.GET_LOCAL:
        case opcode_1.WasmOpcode.SET_LOCAL:
        case opcode_1.WasmOpcode.SET_GLOBAL:
        case opcode_1.WasmOpcode.BLOCK:
        case opcode_1.WasmOpcode.LOOP:
        case opcode_1.WasmOpcode.IF:
        case opcode_1.WasmOpcode.IF_ELSE:
        case opcode_1.WasmOpcode.BR:
        case opcode_1.WasmOpcode.BR_IF:
        case opcode_1.WasmOpcode.BR_TABLE:
        case opcode_1.WasmOpcode.NOP:
            return null;
        default:
            terminal_1.Terminal.warn(`Unhandled Opcode ${opcode} => ${opcode_1.WasmOpcode[opcode]}`);
            break;
    }
    return null;
}


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_binary_section_1 = __webpack_require__(4);
const wasm_section_1 = __webpack_require__(1);
const bytearray_1 = __webpack_require__(0);
const wasm_function_1 = __webpack_require__(21);
/**
 * Created by 01 on 2017-06-17.
 */
class CodeSection extends wasm_binary_section_1.WasmSectionBinary {
    constructor(payload = new bytearray_1.ByteArray()) {
        super(wasm_section_1.WasmSection.Code, payload.length, null, null, payload);
    }
    read() {
        if (this.functions === undefined || this.functions === null) {
            this.functions = [];
        }
        let length = this.payload.readU32LEB();
        for (let i = 0; i < length; i++) {
            let _function = this.functions[i];
            if (_function === undefined) {
                _function = new wasm_function_1.WasmFunction();
                this.functions.push(_function);
            }
            let bodyLength = this.payload.readU32LEB();
            // let localVariables: WasmLocal[] = []
            // let localVariableCount = this.payload.readU32LEB();
            // for (let j = 0; j < localVariableCount; j++) {
            //     let typeCount = this.payload.readU8LEB();
            //     for (let k = 0; k < typeCount; k++) {
            //         let local = new WasmLocal(this.payload.readU8LEB(), "");
            //         localVariables.push(local);
            //     }
            // }
            // _function.localVariables = localVariables;
            // console.log("localVariables:" + localVariables.length);
            // let opcode = this.readUnsignedByte();
            // let blockCount = 0;
            // while (opcode !== WasmOpcode.END && blockCount === 0) {
            //     if (opcode === WasmOpcode.END) {
            //         blockCount--;
            //     }
            //     opcode = this.readUnsignedByte();
            //     if (opcode === WasmOpcode.BLOCK || opcode === WasmOpcode.IF || opcode === WasmOpcode.LOOP) {
            //         blockCount++;
            //     }
            // }
            //skip content
            // _function.body = this.payload.readBytes(null, this.payload.position, bodyLength);
            // let bodyArray = this.payload.array.subarray(this.payload.position, this.payload.position + bodyLength + 1);
            let bodyArray = this.payload.readBytes(null, 0, bodyLength, true).array;
            let lastOpcode = bodyArray[bodyArray.length - 1];
            // console.log(`lastOpcode ${lastOpcode} => ${WasmOpcode[lastOpcode]}`);
            // this.payload.position += bodyLength;
            // console.log(bodyArray);
            _function.body = new bytearray_1.ByteArray(bodyArray.buffer, bodyArray.byteOffset, bodyArray.byteLength);
            // console.log("Body parsed length:" + bodyLength);
            // console.log(_function.body.array);
        }
    }
    publish(data) {
        super.publish(data);
    }
}
exports.CodeSection = CodeSection;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_binary_section_1 = __webpack_require__(4);
const wasm_section_1 = __webpack_require__(1);
const bytearray_1 = __webpack_require__(0);
/**
 * Created by 01 on 2017-06-17.
 */
class DataSection extends wasm_binary_section_1.WasmSectionBinary {
    constructor(payload = new bytearray_1.ByteArray()) {
        super(wasm_section_1.WasmSection.Data, payload.length, null, null, payload);
        this.data = [];
    }
    read() {
    }
    publish(data) {
        super.publish(data);
    }
}
exports.DataSection = DataSection;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_binary_section_1 = __webpack_require__(4);
const wasm_section_1 = __webpack_require__(1);
const bytearray_1 = __webpack_require__(0);
/**
 * Created by 01 on 2017-06-17.
 */
class ElementSection extends wasm_binary_section_1.WasmSectionBinary {
    constructor(payload = new bytearray_1.ByteArray()) {
        super(wasm_section_1.WasmSection.Element, payload.length, null, null, payload);
        this.elements = [];
    }
    read() {
    }
    publish(data) {
        super.publish(data);
    }
}
exports.ElementSection = ElementSection;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_binary_section_1 = __webpack_require__(4);
const wasm_section_1 = __webpack_require__(1);
const bytearray_1 = __webpack_require__(0);
const wasm_export_1 = __webpack_require__(28);
/**
 * Created by 01 on 2017-06-17.
 */
class ExportSection extends wasm_binary_section_1.WasmSectionBinary {
    constructor(payload = new bytearray_1.ByteArray()) {
        super(wasm_section_1.WasmSection.Export, payload.length, null, null, payload);
        this.exports = [];
    }
    read() {
        let exportCount = this.payload.readU32LEB();
        for (let i = 0; i < exportCount; i++) {
            let _export = new wasm_export_1.WasmExport(this.payload.readWasmString(), this.payload.readUnsignedByte(), this.payload.readU32LEB());
            this.exports.push(_export);
        }
    }
    publish(data) {
        super.publish(data);
    }
}
exports.ExportSection = ExportSection;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_binary_section_1 = __webpack_require__(4);
const wasm_section_1 = __webpack_require__(1);
const bytearray_1 = __webpack_require__(0);
const wasm_function_1 = __webpack_require__(21);
const wasm_parser_1 = __webpack_require__(34);
/**
 * Created by 01 on 2017-06-17.
 */
class FunctionSection extends wasm_binary_section_1.WasmSectionBinary {
    constructor(payload = new bytearray_1.ByteArray()) {
        super(wasm_section_1.WasmSection.Function, payload.length, null, null, payload);
        this.functions = [];
    }
    read() {
        let functionCount = this.payload.readU32LEB();
        for (let i = 0; i < functionCount; i++) {
            let _function = new wasm_function_1.WasmFunction(); // We don't know have the name of the function yet.
            _function.isExternal = true;
            _function.signatureIndex = this.payload.readU32LEB();
            _function.signature = wasm_parser_1.WasmParser.currentSignatures[_function.signatureIndex];
            this.functions.push(_function);
        }
    }
    publish(data) {
        super.publish(data);
    }
    toString() {
        let str = "WasmFunctions[\n";
        this.functions.forEach(_function => {
            str += "  " + _function.toString() + "\n";
        });
        return str + "]\n";
    }
}
exports.FunctionSection = FunctionSection;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_binary_section_1 = __webpack_require__(4);
const wasm_section_1 = __webpack_require__(1);
const bytearray_1 = __webpack_require__(0);
const wasm_global_1 = __webpack_require__(29);
const wasm_type_1 = __webpack_require__(6);
/**
 * Created by 01 on 2017-06-17.
 */
class GlobalSection extends wasm_binary_section_1.WasmSectionBinary {
    constructor(payload = new bytearray_1.ByteArray()) {
        super(wasm_section_1.WasmSection.Global, payload.length, null, null, payload);
        this.globals = [];
    }
    read() {
        let globalCount = this.payload.readU32LEB();
        for (let i = 0; i < globalCount; i++) {
            let _global = new wasm_global_1.WasmGlobal(this.payload.readU8LEB(), this.payload.readU8LEB() === 1, null);
            switch (_global.type) {
                case wasm_type_1.WasmType.I32:
                    _global.value = this.payload.readS32LEB();
                    break;
                case wasm_type_1.WasmType.I64:
                    _global.value = this.payload.readS64LEB();
                    break;
                case wasm_type_1.WasmType.F32:
                    _global.value = this.payload.readFloat();
                    break;
                case wasm_type_1.WasmType.F64:
                    _global.value = this.payload.readDouble();
                    break;
            }
            this.globals.push(_global);
        }
    }
    publish(data) {
        super.publish(data);
    }
}
exports.GlobalSection = GlobalSection;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_binary_section_1 = __webpack_require__(4);
const wasm_section_1 = __webpack_require__(1);
const bytearray_1 = __webpack_require__(0);
const wasm_import_1 = __webpack_require__(30);
const wasm_external_kind_1 = __webpack_require__(16);
const assert_1 = __webpack_require__(3);
/**
 * Created by 01 on 2017-06-17.
 */
class ImportSection extends wasm_binary_section_1.WasmSectionBinary {
    constructor(payload = new bytearray_1.ByteArray()) {
        super(wasm_section_1.WasmSection.Import, payload.length, null, null, payload);
        this.imports = [];
    }
    read() {
        let importCount = this.payload.readU32LEB();
        for (let i = 0; i < importCount; i++) {
            let namespace = this.payload.readWasmString();
            let name = this.payload.readWasmString();
            let type = this.payload.readUnsignedByte();
            assert_1.assert(type === wasm_external_kind_1.WasmExternalKind.Function);
            let signatureIndex = this.payload.readU32LEB();
            let _import = new wasm_import_1.WasmImport(namespace, name, type, signatureIndex);
            this.imports.push(_import);
        }
    }
    publish(data) {
        super.publish(data);
    }
}
exports.ImportSection = ImportSection;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_binary_section_1 = __webpack_require__(4);
const wasm_section_1 = __webpack_require__(1);
const bytearray_1 = __webpack_require__(0);
/**
 * Created by 01 on 2017-06-17.
 */
class MemorySection extends wasm_binary_section_1.WasmSectionBinary {
    constructor(payload = new bytearray_1.ByteArray()) {
        super(wasm_section_1.WasmSection.Memory, payload.length, null, null, payload);
        this.memory = [];
    }
    read() {
    }
    publish(data) {
        super.publish(data);
    }
}
exports.MemorySection = MemorySection;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_binary_section_1 = __webpack_require__(4);
const wasm_section_1 = __webpack_require__(1);
const bytearray_1 = __webpack_require__(0);
/**
 * Created by 01 on 2017-06-17.
 */
class NameSection extends wasm_binary_section_1.WasmSectionBinary {
    constructor(name, payload = new bytearray_1.ByteArray()) {
        super(wasm_section_1.WasmSection.Custom, payload.length, -1, name, payload);
    }
    read() {
        this.funcNameMap = new Map();
        this.funcLocalNameMap = new Map();
        let nameType = this.payload.readU8LEB();
        let nameLength = this.payload.readU32LEB();
        if (nameType === 1) {
            let funcNameCount = this.payload.readU32LEB();
            for (let i = 0; i < funcNameCount; i++) {
                let funcNameIndex = this.payload.readU32LEB();
                let funcName = this.payload.readWasmString();
                this.funcNameMap.set(funcNameIndex, funcName);
            }
        }
        else if (nameType === 2) {
            let funcLocalNameCount = this.payload.readU32LEB();
            for (let i = 0; i < funcLocalNameCount; i++) {
                let funcIndex = this.payload.readU32LEB();
                let localNameMap = new Map();
                let localNameCount = this.payload.readU32LEB();
                for (let j = 0; j < localNameCount; j++) {
                    let localNameIndex = this.payload.readU32LEB();
                    let localName = this.payload.readWasmString();
                    localNameMap.set(localNameIndex, localName);
                }
                this.funcLocalNameMap.set(funcIndex, localNameMap);
            }
        }
    }
    publish(data) {
        super.publish(data);
    }
}
exports.NameSection = NameSection;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_binary_section_1 = __webpack_require__(4);
const wasm_section_1 = __webpack_require__(1);
const bytearray_1 = __webpack_require__(0);
const wasm_signature_1 = __webpack_require__(31);
const wasm_type_1 = __webpack_require__(6);
const terminal_1 = __webpack_require__(2);
/**
 * Created by 01 on 2017-06-17.
 */
class SignatureSection extends wasm_binary_section_1.WasmSectionBinary {
    constructor(payload = new bytearray_1.ByteArray()) {
        super(wasm_section_1.WasmSection.Signature, payload.length, null, null, payload);
        this.signatures = [];
    }
    read() {
        let signatureCount = this.payload.readU32LEB();
        for (let i = 0; i < signatureCount; i++) {
            let signature = new wasm_signature_1.WasmSignature();
            let form = this.payload.readUnsignedByte();
            if (form !== wasm_type_1.WasmType.func) {
                terminal_1.Terminal.error("Wrong function type");
            }
            let numArguments = this.payload.readU32LEB();
            for (let j = 0; j < numArguments; j++) {
                let type = this.payload.readU32LEB();
                signature.argumentTypes.push(type);
            }
            let numResults = this.payload.readU8LEB();
            if (numResults > 0) {
                signature.returnType = this.payload.readU32LEB();
            }
            else {
                signature.returnType = wasm_type_1.WasmType.VOID;
            }
            this.signatures.push(signature);
        }
    }
    publish(data) {
        super.publish(data);
    }
}
exports.SignatureSection = SignatureSection;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_binary_section_1 = __webpack_require__(4);
const wasm_section_1 = __webpack_require__(1);
const bytearray_1 = __webpack_require__(0);
/**
 * Created by 01 on 2017-06-17.
 */
class StartSection extends wasm_binary_section_1.WasmSectionBinary {
    constructor(payload = new bytearray_1.ByteArray()) {
        super(wasm_section_1.WasmSection.Start, payload.length, null, null, payload);
        this.startFunctionIndex = -1;
    }
    read() {
        this.startFunctionIndex = this.payload.readU32LEB();
    }
    publish(data) {
        super.publish(data);
    }
}
exports.StartSection = StartSection;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_binary_section_1 = __webpack_require__(4);
const wasm_section_1 = __webpack_require__(1);
const bytearray_1 = __webpack_require__(0);
/**
 * Created by 01 on 2017-06-17.
 */
class TableSection extends wasm_binary_section_1.WasmSectionBinary {
    constructor(payload = new bytearray_1.ByteArray()) {
        super(wasm_section_1.WasmSection.Table, payload.length, null, null, payload);
        this.tables = [];
    }
    read() {
    }
    publish(data) {
        super.publish(data);
    }
}
exports.TableSection = TableSection;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_section_1 = __webpack_require__(1);
const terminal_1 = __webpack_require__(2);
/**
 * Created by n.vinayakan on 29.06.17.
 */
class WasmMerger {
    static merge(inputs, output) {
        if (inputs.length > 1) {
            let error = "Not supported! Maximum wasm binaries supported in WasmMerger is 1.";
            terminal_1.Terminal.error(error);
            throw error;
        }
        // let output: WasmBinary = new WasmBinary();
        // output.initializeSections();
        let signatureSection;
        let importSection;
        let exportSection;
        let outputFunctionSection;
        let functionSection;
        let codeSection;
        inputs.forEach(binary => {
            binary.sections.forEach(importedSection => {
                switch (importedSection.id) {
                    case wasm_section_1.WasmSection.Signature: {
                        signatureSection = importedSection;
                        let section = output.getSection(wasm_section_1.WasmSection.Signature);
                        section.signatures = section.signatures.concat(signatureSection.signatures);
                        break;
                    }
                    case wasm_section_1.WasmSection.Import: {
                        importSection = importedSection;
                        let section = output.getSection(wasm_section_1.WasmSection.Import);
                        section.imports = section.imports.concat(importSection.imports);
                        break;
                    }
                    case wasm_section_1.WasmSection.Function: {
                        functionSection = importedSection;
                        outputFunctionSection = output.getSection(wasm_section_1.WasmSection.Function);
                        outputFunctionSection.functions = outputFunctionSection.functions.concat(functionSection.functions);
                        break;
                    }
                    case wasm_section_1.WasmSection.Table: {
                        let section = output.getSection(importedSection.id);
                        section.tables = section.tables.concat(importedSection.tables);
                        break;
                    }
                    case wasm_section_1.WasmSection.Memory: {
                        let section = output.getSection(importedSection.id);
                        section.memory = section.memory.concat(importedSection.memory);
                        break;
                    }
                    case wasm_section_1.WasmSection.Global: {
                        let section = output.getSection(importedSection.id);
                        section.globals = section.globals.concat(importedSection.globals);
                        break;
                    }
                    case wasm_section_1.WasmSection.Export: {
                        exportSection = importedSection;
                        let section = output.getSection(importedSection.id);
                        concatUniqueExports(section, exportSection);
                        // section.exports = section.exports.concat(exportSection.exports);
                        break;
                    }
                    case wasm_section_1.WasmSection.Start: {
                        let section = output.getSection(importedSection.id);
                        if (section.startFunctionIndex === -1) {
                            section.startFunctionIndex = importedSection.startFunctionIndex;
                        }
                        break;
                    }
                    case wasm_section_1.WasmSection.Element: {
                        let section = output.getSection(importedSection.id);
                        section.elements = section.elements.concat(importedSection.elements);
                        break;
                    }
                    case wasm_section_1.WasmSection.Code: {
                        codeSection = importedSection;
                        let section = output.getSection(wasm_section_1.WasmSection.Code);
                        // section.functions = section.functions.concat(codeSection.functions);
                        section.functions = outputFunctionSection.functions;
                        break;
                    }
                    case wasm_section_1.WasmSection.Data: {
                        let section = output.getSection(importedSection.id);
                        section.data = section.data.concat(importedSection.data);
                        break;
                    }
                    case wasm_section_1.WasmSection.Custom: {
                        console.log("Name section found!");
                        // let section: NameSection = output.getSection(importedSection.id) as NameSection;
                        // section.funcNameMap
                        // section.funcLocalNameMap
                        //section.names = section.names.concat((importedSection as NameSection).names);
                        updateFunctionNames(outputFunctionSection, importedSection);
                        break;
                    }
                }
            });
        });
        return output;
    }
}
exports.WasmMerger = WasmMerger;
function concatUniqueExports(outputExportSection, inputExportSection) {
    inputExportSection.exports.forEach(exportIn => {
        let duplicate = outputExportSection.exports.find(exportOut => exportIn.name === exportOut.name);
        if (duplicate === undefined) {
            outputExportSection.exports.push(exportIn);
        }
    });
}
function updateFunctionNames(functionSection, nameSection) {
    let funcNameMap = nameSection.funcNameMap;
    functionSection.functions.forEach((func, index) => {
        func.name = funcNameMap.get(index);
    });
    console.log("Function names updated");
    console.log(functionSection.functions);
}


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const wasm_binary_1 = __webpack_require__(22);
const wasm_function_1 = __webpack_require__(21);
const wasm_import_1 = __webpack_require__(30);
const wasm_signature_1 = __webpack_require__(31);
const wasm_global_1 = __webpack_require__(29);
const index_1 = __webpack_require__(11);
const assert_1 = __webpack_require__(3);
const wasm_section_1 = __webpack_require__(1);
const wasm_export_1 = __webpack_require__(28);
const wasm_external_kind_1 = __webpack_require__(16);
const terminal_1 = __webpack_require__(2);
/**
 * Created by 01 on 2017-06-19.
 */
class WasmModule {
    constructor(binary) {
        this.text = ";; Experimental wast emitter\n(module\n";
        if (binary !== undefined) {
            this.read(binary);
        }
        else {
            this.binary = new wasm_binary_1.WasmBinary();
            this.binary.initializeSections();
            // this.getReferences();
        }
    }
    get imports() {
        return this.binary.getSection(wasm_section_1.WasmSection.Import).imports;
    }
    get importCount() {
        return this.imports.length;
    }
    get exports() {
        return this.binary.getSection(wasm_section_1.WasmSection.Export).exports;
    }
    get exportCount() {
        return this.exports.length;
    }
    get globals() {
        return this.binary.getSection(wasm_section_1.WasmSection.Global).globals;
    }
    get globalCount() {
        return this.globals.length;
    }
    get signatures() {
        return this.binary.getSection(wasm_section_1.WasmSection.Signature).signatures;
    }
    get signatureCount() {
        return this.signatures.length;
    }
    get functions() {
        return this.binary.getSection(wasm_section_1.WasmSection.Function).functions;
    }
    get functionCount() {
        return this.functions.length;
    }
    // private getReferences(): void {
    // this.importSection = (this.binary.getSection(WasmSection.Import) as ImportSection);
    // this.exportSection = (this.binary.getSection(WasmSection.Export) as ExportSection);
    // this.globalSection = (this.binary.getSection(WasmSection.Global) as GlobalSection);
    // this.signatureSection = (this.binary.getSection(WasmSection.Signature) as SignatureSection);
    // this.functionSection = (this.binary.getSection(WasmSection.Function) as FunctionSection);
    // }
    reset() {
        this.binary.reset();
    }
    read(binary) {
        if (binary instanceof wasm_binary_1.WasmBinary) {
            this.binary = binary;
        }
        else {
            this.binary = new wasm_binary_1.WasmBinary(binary);
        }
        // this.getReferences();
    }
    publish() {
        this.text += "  ";
        this.binary.sections.forEach(section => {
            if (section.payload.length > 0) {
                section.publish(this.binary.data);
                this.text += section.code.finish();
            }
        });
        this.text = this.text.substring(0, this.text.lastIndexOf("\n"));
        this.text += ")\n";
    }
    allocateGlobal(symbol, bitness) {
        let global = new wasm_global_1.WasmGlobal(index_1.symbolToWasmType(symbol, bitness), true, symbol.internalName, symbol);
        symbol.offset = this.globals.length;
        this.globals.push(global);
        return global;
    }
    allocateSignature(argumentTypes, returnType) {
        assert_1.assert(returnType != null);
        let signature = new wasm_signature_1.WasmSignature();
        signature.argumentTypes = argumentTypes;
        signature.returnType = returnType;
        let signatureIndex = -1;
        this.signatures.some((check, index) => {
            if (wasm_signature_1.wasmAreSignaturesEqual(signature, check)) {
                signatureIndex = index;
                return true;
            }
            return false;
        });
        if (signatureIndex > -1) {
            return [signatureIndex, this.signatures[signatureIndex]];
        }
        return [this.signatures.push(signature) - 1, signature];
    }
    allocateImport(signature, signatureIndex, namespace, name) {
        let _import = new wasm_import_1.WasmImport(namespace, name, wasm_external_kind_1.WasmExternalKind.Function, signatureIndex, signature);
        return [_import, this.imports.push(_import) - 1];
    }
    allocateExport(name, kind, index, as = name) {
        let duplicate = this.exports.find(_export => _export.name === as);
        if (duplicate === undefined) {
            this.exports.push(new wasm_export_1.WasmExport(name, kind, index, as));
        }
        else {
            terminal_1.Terminal.warn("Error! Duplicate export " + name + " as " + as);
        }
    }
    allocateFunction(name, signature, signatureIndex, symbol, isExported = false) {
        let _function = new wasm_function_1.WasmFunction(name, symbol);
        let fnIndex = this.functions.push(_function) - 1;
        _function.isExported = isExported;
        if (isExported) {
            this.exports.push(new wasm_export_1.WasmExport(_function.name, wasm_external_kind_1.WasmExternalKind.Function, fnIndex));
        }
        _function.signature = signature;
        _function.signatureIndex = signatureIndex;
        return _function;
    }
}
exports.WasmModule = WasmModule;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="assembler/wasm-assembler.ts"/>
const symbol_1 = __webpack_require__(7);
const bytearray_1 = __webpack_require__(0);
const utils_1 = __webpack_require__(8);
const node_1 = __webpack_require__(10);
const compiler_1 = __webpack_require__(12);
const opcode_1 = __webpack_require__(17);
const builtins_helper_1 = __webpack_require__(58);
const assert_1 = __webpack_require__(3);
const wasm_type_1 = __webpack_require__(6);
const logger_1 = __webpack_require__(32);
const bitness_1 = __webpack_require__(27);
const wasm_section_1 = __webpack_require__(1);
const wasm_external_kind_1 = __webpack_require__(16);
const wasm_local_1 = __webpack_require__(60);
const wasm_shared_offset_1 = __webpack_require__(61);
const wasm_assembler_1 = __webpack_require__(57);
const terminal_1 = __webpack_require__(2);
const utils_2 = __webpack_require__(11);
const wasm_optimizer_1 = __webpack_require__(62);
const wasm_binary_1 = __webpack_require__(22);
const binary_importer_1 = __webpack_require__(14);
class WasmModuleEmitter {
    constructor(bitness) {
        this.bitness = bitness;
        this.HEAP_BASE_INDEX = -1;
        this.mallocFunctionIndex = -1;
        this.freeFunctionIndex = -1;
        this.startFunctionIndex = -1;
        this.assembler = new wasm_assembler_1.WasmAssembler();
    }
    growMemoryInitializer() {
        let array = this.memoryInitializer;
        let current = array.length;
        let length = this.context.nextGlobalVariableOffset;
        while (current < length) {
            array.append(0);
            current = current + 1;
        }
    }
    emitModule() {
        this.emitTypes();
        this.emitImportTable();
        this.emitFunctionDeclarations();
        // this.emitTables();
        this.emitMemory();
        this.emitGlobalDeclarations();
        this.emitExportTable();
        this.emitStart();
        this.emitElements();
        this.emitFunctionBodies();
        this.emitDataSegments();
        this.emitNames();
        this.assembler.finish();
    }
    emitTypes() {
        let section = this.assembler.startSection(wasm_section_1.WasmSection.Signature);
        let signatures = section.signatures;
        let offset = 0;
        this.assembler.writeUnsignedLEB128(signatures.length);
        signatures.forEach((signature, index) => {
            // Emit signature
            this.assembler.activeCode.append(`(type (;${index};) (func`);
            logger_1.log(section.payload, offset, wasm_type_1.WasmType.func, "func sig " + index);
            this.assembler.writeUnsignedLEB128(wasm_type_1.WasmType.func); //form, the value for the func type constructor
            logger_1.log(section.payload, offset, signature.argumentTypes.length, "num params");
            this.assembler.writeUnsignedLEB128(signature.argumentTypes.length); //param_count, the number of parameters to the function
            if (signature.argumentTypes.length > 0) {
                this.assembler.activeCode.append(` (param`);
            }
            signature.argumentTypes.forEach(type => {
                logger_1.log(section.payload, offset, type, wasm_type_1.WasmType[type]);
                this.assembler.writeUnsignedLEB128(type); //value_type, the parameter types of the function
                this.assembler.activeCode.append(` ${wasm_type_1.WasmTypeToString[type]}`);
            });
            if (signature.argumentTypes.length > 0) {
                this.assembler.activeCode.append(`)`);
            }
            if (signature.returnType !== wasm_type_1.WasmType.VOID) {
                logger_1.log(section.payload, offset, 1, "num results");
                this.assembler.writeUnsignedLEB128(1); //return_count, the number of results from the function
                logger_1.log(section.payload, offset, signature.returnType, wasm_type_1.WasmType[signature.returnType]);
                this.assembler.writeUnsignedLEB128(signature.returnType);
                this.assembler.activeCode.append(` (result ${wasm_type_1.WasmTypeToString[signature.returnType]})`);
            }
            else {
                this.assembler.writeUnsignedLEB128(0);
            }
            this.assembler.activeCode.append("))\n");
        });
        this.assembler.endSection(section);
    }
    emitImportTable() {
        if (this.assembler.module.importCount == 0) {
            return;
        }
        let section = this.assembler.startSection(wasm_section_1.WasmSection.Import);
        let imports = section.imports;
        let offset = 0;
        logger_1.log(section.payload, offset, imports.length, "num imports");
        this.assembler.writeUnsignedLEB128(imports.length);
        imports.forEach((_import, index) => {
            logger_1.log(section.payload, offset, null, `import func (${index}) ${_import.namespace} ${_import.name}`);
            this.assembler.activeCode.append(`(import "${_import.namespace}" "${_import.name}" (func (;${index};) (type ${_import.signatureIndex})))\n`);
            this.assembler.writeWasmString(_import.namespace);
            this.assembler.writeWasmString(_import.name);
            this.assembler.writeUnsignedLEB128(wasm_external_kind_1.WasmExternalKind.Function);
            this.assembler.writeUnsignedLEB128(_import.signatureIndex);
        });
        this.assembler.endSection(section);
    }
    emitFunctionDeclarations() {
        if (this.assembler.module.functionCount === 0) {
            return;
        }
        let section = this.assembler.startSection(wasm_section_1.WasmSection.Function);
        let functions = section.functions;
        let offset = 0;
        logger_1.log(section.payload, offset, functions.length, "num functions");
        this.assembler.writeUnsignedLEB128(functions.length);
        let importCount = this.assembler.module.importCount;
        functions.forEach((fn, index) => {
            logger_1.log(section.payload, offset, fn.signatureIndex, `func ${importCount + index} sig ${utils_2.getWasmFunctionName(fn.symbol)}`);
            this.assembler.writeUnsignedLEB128(fn.signatureIndex);
        });
        this.assembler.endSection(section);
    }
    emitTables() {
        //TODO
    }
    emitMemory() {
        let section = this.assembler.startSection(wasm_section_1.WasmSection.Memory);
        let memory = section.memory;
        if (memory.length > 1) {
            terminal_1.Terminal.warn("More than 1 memory found, In the MVP, the number of memories must be no more than 1.");
        }
        this.assembler.module.allocateExport("memory", wasm_external_kind_1.WasmExternalKind.Memory, 0);
        let offset = 0;
        logger_1.log(section.payload, offset, memory.length, "num memories");
        this.assembler.writeUnsignedLEB128(1); //indicating the number of memories defined by the namespace, In the MVP, the number of memories must be no more than 1.
        //resizable_limits
        logger_1.log(section.payload, offset, 0, "memory flags");
        this.assembler.writeUnsignedLEB128(wasm_binary_1.WasmBinary.SET_MAX_MEMORY ? 0x1 : 0); //flags, bit 0x1 is set if the maximum field is present
        logger_1.log(section.payload, offset, wasm_binary_1.WasmBinary.SIZE_IN_PAGES, "memory initial pages");
        this.assembler.writeUnsignedLEB128(wasm_binary_1.WasmBinary.SIZE_IN_PAGES); //initial length (in units of table elements or wasm pages)
        if (wasm_binary_1.WasmBinary.SET_MAX_MEMORY) {
            logger_1.log(section.payload, offset, wasm_binary_1.WasmBinary.MAX_MEMORY, "maximum memory");
            this.assembler.writeUnsignedLEB128(wasm_binary_1.WasmBinary.MAX_MEMORY); // maximum, only present if specified by flags
        }
        this.assembler.activeCode.append("(memory $0 1)\n");
        this.assembler.endSection(section);
    }
    emitGlobalDeclarations() {
        if (this.assembler.module.globals.length === 0) {
            return;
        }
        let section = this.assembler.startSection(wasm_section_1.WasmSection.Global);
        let globals = section.globals;
        let offset = 0;
        this.assembler.writeUnsignedLEB128(globals.length);
        this.assembler.stackTracer.setGlobals(globals);
        // Initialize mspace before initializing globals
        if (compiler_1.Compiler.mallocRequired) {
            // write mspace_init
            let mspace_init_index = binary_importer_1.getMergedCallIndex("mspace_init");
            this.assembler.startFunctionChunk(this.startFunction, this.startFunctionIndex);
            this.assembler.appendOpcode(0, opcode_1.WasmOpcode.I32_CONST);
            this.assembler.writeUnsignedLEB128(40);
            this.assembler.appendOpcode(0, opcode_1.WasmOpcode.CALL);
            this.assembler.writeUnsignedLEB128(mspace_init_index);
            this.assembler.appendOpcode(0, opcode_1.WasmOpcode.SET_GLOBAL);
            this.assembler.writeUnsignedLEB128(this.HEAP_BASE_INDEX);
            this.assembler.endFunctionChunk();
        }
        globals.forEach((global, index) => {
            let wasmType = utils_2.symbolToWasmType(global.symbol, this.bitness);
            let value = global.symbol.node.variableValue();
            section.payload.append(wasmType); //content_type
            this.assembler.writeUnsignedLEB128(global.mutable ? 1 : 0); //mutability, 0 if immutable, 1 if mutable.
            let rawValue = 0;
            if (value) {
                if (value.kind === node_1.NodeKind.NULL || value.kind === node_1.NodeKind.UNDEFINED) {
                    rawValue = 0;
                }
                else if (value.rawValue !== undefined) {
                    rawValue = value.rawValue;
                }
                else {
                    // Emit evaluation to start function
                    this.addGlobalToStartFunction(global);
                }
            }
            this.assembler.appendOpcode(offset, opcode_1.WasmOpcode[`${wasm_type_1.WasmType[wasmType]}_CONST`], rawValue);
            switch (wasmType) {
                case wasm_type_1.WasmType.I32:
                    this.assembler.writeUnsignedLEB128(rawValue);
                    break;
                case wasm_type_1.WasmType.I64:
                    this.assembler.writeUnsignedLEB128(rawValue);
                    break;
                case wasm_type_1.WasmType.F32:
                    this.assembler.writeFloat(rawValue);
                    break;
                case wasm_type_1.WasmType.F64:
                    this.assembler.writeDouble(rawValue);
                    break;
            }
            let wasmTypeStr = wasm_type_1.WasmTypeToString[wasmType];
            this.assembler.activeCode.append(`(global (;${index};) (mut ${wasmTypeStr}) (${wasmTypeStr}.const ${rawValue}))\n`);
            this.assembler.appendOpcode(offset, opcode_1.WasmOpcode.END);
        });
        this.assembler.endSection(section);
    }
    addGlobalToStartFunction(global) {
        let value = global.symbol.node.variableValue();
        this.assembler.startFunctionChunk(this.startFunction, this.startFunctionIndex);
        this.emitNode(0, value);
        this.assembler.appendOpcode(0, opcode_1.WasmOpcode.SET_GLOBAL);
        this.assembler.writeUnsignedLEB128(global.symbol.offset);
        this.assembler.endFunctionChunk();
    }
    emitExportTable() {
        if (this.assembler.module.exportCount === 0) {
            return;
        }
        let offset = 0;
        let section = this.assembler.startSection(wasm_section_1.WasmSection.Export);
        let importCount = this.assembler.module.importCount;
        let exports = section.exports;
        logger_1.log(section.payload, offset, exports.length, "num exports");
        this.assembler.writeUnsignedLEB128(exports.length);
        //Export main memory
        // let memoryName: string = "memory";
        // log(section.payload, offset, memoryName.length, "export name length");
        // log(section.payload, null, null, `${toHex(section.payload.position + offset + 4)}: ${memoryName} // export name`);
        // this.assembler.writeWasmString(memoryName);
        // log(section.payload, offset, WasmExternalKind.Memory, "export kind");
        // this.assembler.activePayload.writeUnsignedByte(WasmExternalKind.Memory);
        // log(section.payload, offset, 0, "export memory index");
        // this.assembler.writeUnsignedLEB128(0);
        // this.assembler.activeCode.append(`(export "memory" (memory $0))\n`);
        exports.forEach((_export) => {
            let isFunctionExport = _export.kind === wasm_external_kind_1.WasmExternalKind.Function;
            let exportIndex = isFunctionExport ? importCount + _export.index : _export.index;
            logger_1.log(section.payload, offset, _export.as.length, "export name length");
            logger_1.log(section.payload, null, null, `${utils_1.toHex(section.payload.position + offset + 4)}: ${_export.as} // export name`);
            this.assembler.writeWasmString(_export.as);
            logger_1.log(section.payload, offset, _export.kind, "export kind");
            this.assembler.writeUnsignedLEB128(_export.kind);
            logger_1.log(section.payload, offset, exportIndex, "export index");
            this.assembler.writeUnsignedLEB128(exportIndex);
            if (isFunctionExport) {
                this.assembler.activeCode.append(`(export "${_export.as}" (func $${_export.name}))\n`);
            }
            else if (_export.kind === wasm_external_kind_1.WasmExternalKind.Memory) {
                this.assembler.activeCode.append(`(export "${_export.as}" (memory $${_export.index}))\n`);
            }
        });
        this.assembler.endSection(section);
    }
    emitStart() {
        if (this.startFunctionIndex != -1) {
            let section = this.assembler.startSection(wasm_section_1.WasmSection.Start);
            let offset = 0;
            let importCount = this.assembler.module.importCount;
            logger_1.log(section.payload, offset, this.startFunctionIndex, "start function index");
            this.assembler.activeCode.append(`(start ${importCount + this.startFunctionIndex})\n`);
            this.assembler.writeUnsignedLEB128(importCount + this.startFunctionIndex);
            this.assembler.endSection(section);
        }
    }
    emitElements() {
        //TODO
    }
    emitFunctionBodies() {
        if (this.assembler.module.functionCount === 0) {
            return;
        }
        let offset = 0;
        let signatures = this.assembler.module.binary.getSection(wasm_section_1.WasmSection.Signature).signatures;
        let functions = this.assembler.module.binary.getSection(wasm_section_1.WasmSection.Function).functions;
        let section = this.assembler.startSection(wasm_section_1.WasmSection.Code);
        // FIXME: functions might overwrite
        section.functions = functions;
        logger_1.log(section.payload, offset, this.assembler.module.functionCount, "num functions");
        this.assembler.writeUnsignedLEB128(this.assembler.module.functionCount);
        functions.forEach((fn, index) => {
            this.currentFunction = fn;
            let sectionOffset = offset + section.payload.position;
            let wasmFunctionName = utils_2.getWasmFunctionName(fn.symbol);
            if (!fn.isExternal) {
                let bodyData = new bytearray_1.ByteArray();
                fn.body = bodyData;
                logger_1.log(bodyData, sectionOffset, fn.locals.length, "local var count");
                this.assembler.startFunction(fn, index);
                /* wasm text format */
                this.assembler.activeCode.emitIndent();
                this.assembler.activeCode.append(`(func $${wasmFunctionName} (type ${fn.signatureIndex}) `);
                fn.argumentVariables.forEach((argumentEntry) => {
                    this.assembler.activeCode.append(`(param $${argumentEntry.name} ${wasm_type_1.WasmTypeToString[argumentEntry.type]}) `);
                });
                let signature = signatures[fn.signatureIndex];
                if (signature.returnType !== wasm_type_1.WasmType.VOID) {
                    this.assembler.activeCode.append(`(result ${wasm_type_1.WasmTypeToString[signature.returnType]})`);
                }
                this.assembler.activeCode.append("\n", 2);
                if (fn.localVariables.length > 0) {
                    bodyData.writeUnsignedLEB128(fn.localVariables.length); //local_count
                    // TODO: Optimize local declarations
                    fn.localVariables.forEach((localVariableEntry) => {
                        logger_1.log(bodyData, sectionOffset, 1, "local index");
                        bodyData.writeUnsignedLEB128(1); //count
                        logger_1.log(bodyData, sectionOffset, localVariableEntry.type, wasm_type_1.WasmType[localVariableEntry.type]);
                        bodyData.append(localVariableEntry.type); //value_type
                        this.assembler.activeCode.append(`(local $${localVariableEntry.name} ${wasm_type_1.WasmTypeToString[localVariableEntry.type]}) `);
                    });
                    this.assembler.activeCode.append("\n");
                }
                else {
                    bodyData.writeUnsignedLEB128(0);
                }
                let lastChild;
                if (fn.isConstructor) {
                    // this is <CLASS>__ctr function
                    this.emitConstructor(sectionOffset, fn);
                }
                let child = fn.symbol.node.functionBody().firstChild;
                while (child != null) {
                    lastChild = child;
                    this.emitNode(sectionOffset, child);
                    child = child.nextSibling;
                }
                if (fn.chunks.length > 0) {
                    this.assembler.activeCode.clearIndent(2);
                    fn.chunks.forEach((chunk, index) => {
                        bodyData.copy(chunk.payload);
                        bodyData.log += chunk.payload.log;
                        chunk.code.removeLastLinebreak();
                        this.assembler.activeCode.appendRaw(chunk.code.finish());
                    });
                }
                else {
                    if (lastChild && lastChild.kind !== node_1.NodeKind.RETURN && fn.returnType != wasm_type_1.WasmType.VOID) {
                        this.assembler.appendOpcode(sectionOffset, opcode_1.WasmOpcode.RETURN);
                    }
                }
                if (fn.returnType === wasm_type_1.WasmType.VOID) {
                    // Drop stack if not empty
                    this.assembler.dropStack();
                }
                this.assembler.appendOpcode(sectionOffset, opcode_1.WasmOpcode.END, null, true); //end, 0x0b, indicating the end of the body
                this.assembler.endFunction();
                this.assembler.activeCode.removeLastLinebreak();
                this.assembler.activeCode.append(`)\n`);
            }
            else {
                if (fn.name != "<anonymous>")
                    console.log("External function " + fn.name);
                // else ???
            }
            section.payload.writeUnsignedLEB128(fn.body.length);
            logger_1.log(section.payload, offset, null, ` - func body ${this.assembler.module.importCount + (index)} (${wasmFunctionName})`);
            logger_1.log(section.payload, offset, fn.body.length, "func body size");
            section.payload.log += fn.body.log;
            section.payload.copy(fn.body);
        });
        this.assembler.endSection(section);
    }
    emitDataSegments() {
        this.growMemoryInitializer();
        let memoryInitializer = this.memoryInitializer;
        let initializerLength = memoryInitializer.length;
        let initialHeapPointer = utils_1.alignToNextMultipleOf(wasm_binary_1.WasmBinary.MEMORY_INITIALIZER_BASE + initializerLength, 8);
        // Store initial heap base pointer
        // memoryInitializer.writeUnsignedInt(initialHeapPointer, this.mspaceBasePointer);
        let section = this.assembler.startSection(wasm_section_1.WasmSection.Data);
        let offset = 0;
        // This only writes one single section containing everything
        logger_1.log(section.payload, offset, 1, "num data segments");
        this.assembler.writeUnsignedLEB128(1);
        //data_segment
        logger_1.log(section.payload, offset, null, " - data segment header 0");
        logger_1.log(section.payload, offset, 0, "memory index");
        this.assembler.writeUnsignedLEB128(0); //index, the linear memory index (0 in the MVP)
        //offset, an i32 initializer expression that computes the offset at which to place the data
        this.assembler.appendOpcode(offset, opcode_1.WasmOpcode.I32_CONST);
        logger_1.log(section.payload, offset, wasm_binary_1.WasmBinary.MEMORY_INITIALIZER_BASE, "i32 literal");
        this.assembler.writeUnsignedLEB128(wasm_binary_1.WasmBinary.MEMORY_INITIALIZER_BASE); //const value
        this.assembler.appendOpcode(offset, opcode_1.WasmOpcode.END);
        logger_1.log(section.payload, offset, initializerLength, "data segment size");
        this.assembler.writeUnsignedLEB128(initializerLength); //size, size of data (in bytes)
        logger_1.log(section.payload, offset, null, " - data segment data 0");
        //data, sequence of size bytes
        // Copy the entire memory initializer (also includes zero-initialized data for now)
        this.assembler.activeCode.append(`(data (i32.const ${wasm_binary_1.WasmBinary.MEMORY_INITIALIZER_BASE}) "  `);
        let i = 0;
        let value;
        while (i < initializerLength) {
            for (let j = 0; j < 16; j++) {
                if (i + j < initializerLength) {
                    value = memoryInitializer.get(i + j);
                    section.payload.append(value);
                    this.assembler.activeCode.append("\\" + utils_1.toHex(value, 2));
                    logger_1.logData(section.payload, offset, value, j == 0);
                }
            }
            section.payload.log += "\n";
            i = i + 16;
        }
        this.assembler.activeCode.append('")\n');
        // section.payload.copy(memoryInitializer, initializerLength);
        this.assembler.endSection(section);
    }
    // Custom section for debug names
    //
    emitNames() {
        let section = this.assembler.startSection(wasm_section_1.WasmSection.Custom, "name");
        let functions = this.assembler.module.binary.getSection(wasm_section_1.WasmSection.Function).functions;
        let subsectionFunc = new bytearray_1.ByteArray();
        let subsectionLocal = new bytearray_1.ByteArray();
        subsectionFunc.writeUnsignedLEB128(this.assembler.module.functionCount);
        subsectionLocal.writeUnsignedLEB128(this.assembler.module.functionCount);
        functions.forEach((fn, index) => {
            let fnIndex = this.assembler.module.importCount + index;
            subsectionFunc.writeUnsignedLEB128(fnIndex);
            subsectionFunc.writeWasmString(fn.name);
            subsectionLocal.writeUnsignedLEB128(fnIndex);
            if (fn.locals !== undefined) {
                subsectionLocal.writeUnsignedLEB128(fn.locals.length);
                fn.locals.forEach((local, index) => {
                    subsectionLocal.writeUnsignedLEB128(index);
                    subsectionLocal.writeWasmString(local.name);
                });
            }
        });
        //subsection for function names
        this.assembler.writeUnsignedLEB128(1); // name_type
        this.assembler.writeUnsignedLEB128(subsectionFunc.length); // name_payload_len
        section.payload.copy(subsectionFunc); // name_payload_data
        //subsection for local names
        this.assembler.writeUnsignedLEB128(2); // name_type
        this.assembler.writeUnsignedLEB128(subsectionLocal.length); // name_payload_len
        section.payload.copy(subsectionLocal); // name_payload_data
        this.assembler.endSection(section);
    }
    mergeBinaryImports() {
        // TODO: Merge only imported functions and it's dependencies
        this.assembler.mergeBinaries(binary_importer_1.BinaryImporter.binaries);
    }
    prepareToEmit(node) {
        if (node.kind == node_1.NodeKind.STRING) {
            let text = node.stringValue;
            let length = text.length;
            let offset = this.context.allocateGlobalVariableOffset(length * 2 + 4, 4);
            node.intValue = offset;
            this.growMemoryInitializer();
            let memoryInitializer = this.memoryInitializer;
            // Emit a length-prefixed string
            bytearray_1.ByteArray_set32(memoryInitializer, offset, length);
            bytearray_1.ByteArray_setString(memoryInitializer, offset + 4, text);
        }
        else if (node.kind == node_1.NodeKind.VARIABLE) {
            let symbol = node.symbol;
            /*if (symbol.kind == SymbolKind.VARIABLE_GLOBAL) {
             let sizeOf = symbol.resolvedType.variableSizeOf(this.context);
             let value = symbol.node.variableValue();
             let memoryInitializer = this.memoryInitializer;

             // Copy the initial value into the memory initializer
             this.growMemoryInitializer();

             let offset = symbol.offset;

             if (sizeOf == 1) {
             if (symbol.resolvedType.isUnsigned()) {
             memoryInitializer.writeUnsignedByte(value.intValue, offset);
             } else {
             memoryInitializer.writeByte(value.intValue, offset);
             }
             }
             else if (sizeOf == 2) {
             if (symbol.resolvedType.isUnsigned()) {
             memoryInitializer.writeUnsignedShort(value.intValue, offset);
             } else {
             memoryInitializer.writeShort(value.intValue, offset);
             }
             }
             else if (sizeOf == 4) {
             if (symbol.resolvedType.isFloat()) {
             memoryInitializer.writeFloat(value.floatValue, offset);
             } else {
             if (symbol.resolvedType.isUnsigned()) {
             memoryInitializer.writeUnsignedInt(value.intValue, offset);
             } else {
             memoryInitializer.writeInt(value.intValue, offset);
             }
             }
             }
             else if (sizeOf == 8) {
             if (symbol.resolvedType.isDouble()) {
             memoryInitializer.writeDouble(value.rawValue, offset);
             } else {
             //TODO Implement Int64 write
             if (symbol.resolvedType.isUnsigned()) {
             //memoryInitializer.writeUnsignedInt64(value.rawValue, offset);
             } else {
             //memoryInitializer.writeInt64(value.rawValue, offset);
             }
             }
             }
             else assert(false);*/
            if (symbol.kind == symbol_1.SymbolKind.VARIABLE_GLOBAL) {
                let global = this.assembler.module.allocateGlobal(symbol, this.bitness);
                // Make sure the heap offset is tracked
                if (symbol.name == "HEAP_BASE") {
                    assert_1.assert(this.HEAP_BASE_INDEX == -1);
                    this.HEAP_BASE_INDEX = symbol.offset;
                }
            }
        }
        else if (node.kind == node_1.NodeKind.FUNCTION &&
            (node.symbol.kind != symbol_1.SymbolKind.FUNCTION_INSTANCE ||
                node.symbol.kind == symbol_1.SymbolKind.FUNCTION_INSTANCE && !node.parent.isTemplate())) {
            let symbol = node.symbol;
            let wasmFunctionName = utils_2.getWasmFunctionName(symbol);
            // if (isBinaryImport(wasmFunctionName)) {
            //     node = node.nextSibling;
            //     return;
            // }
            let returnType = node.functionReturnType();
            let wasmReturnType = this.getWasmType(returnType.resolvedType);
            let shared = new wasm_shared_offset_1.WasmSharedOffset();
            let isConstructor = symbol.name == "constructor";
            // Make sure to include the implicit "this" variable as a normal argument
            let argument = node.isExternalImport() ? node.functionFirstArgumentIgnoringThis() : node.functionFirstArgument();
            let argumentVariables = [];
            let argumentTypes = [];
            while (argument != returnType) {
                let wasmType = this.getWasmType(argument.variableType().resolvedType);
                argumentVariables.push(new wasm_local_1.WasmLocal(wasmType, argument.symbol.name, argument.symbol, true));
                argumentTypes.push(wasmType);
                shared.nextLocalOffset = shared.nextLocalOffset + 1;
                argument = argument.nextSibling;
            }
            let [signatureIndex, signature] = this.assembler.module.allocateSignature(argumentTypes, wasmReturnType);
            let body = node.functionBody();
            // Functions without bodies are imports
            if (body == null) {
                if (!builtins_helper_1.isBuiltin(wasmFunctionName)) {
                    let moduleName = symbol.kind == symbol_1.SymbolKind.FUNCTION_INSTANCE ? symbol.parent().name : "global";
                    symbol.offset = this.assembler.module.importCount;
                    if (binary_importer_1.isBinaryImport(wasmFunctionName)) {
                        // this.assembler.module.allocateImport(signature, signatureIndex, "internal", symbol.name);
                        symbol.node.flags |= node_1.NODE_FLAG.IMPORT;
                    }
                    else {
                        this.assembler.module.allocateImport(signature, signatureIndex, moduleName, symbol.name);
                    }
                }
                node = node.nextSibling;
                return;
            }
            else {
                symbol.offset = this.assembler.module.functionCount;
            }
            let fn = this.assembler.module.allocateFunction(wasmFunctionName, signature, signatureIndex, symbol, node.isExport());
            fn.argumentVariables = argumentVariables;
            fn.isConstructor = isConstructor;
            fn.returnType = wasmReturnType;
            // Make sure "malloc" is tracked
            if (symbol.kind == symbol_1.SymbolKind.FUNCTION_GLOBAL && symbol.name == "malloc") {
                assert_1.assert(this.mallocFunctionIndex == -1);
                this.mallocFunctionIndex = symbol.offset;
            }
            if (symbol.kind == symbol_1.SymbolKind.FUNCTION_GLOBAL && symbol.name == "free") {
                assert_1.assert(this.freeFunctionIndex == -1);
                this.freeFunctionIndex = symbol.offset;
            }
            // Make "__WASM_INITIALIZER" as start function
            if (symbol.kind == symbol_1.SymbolKind.FUNCTION_GLOBAL && symbol.name == "__WASM_INITIALIZER") {
                assert_1.assert(this.startFunctionIndex == -1);
                this.startFunctionIndex = symbol.offset;
                this.startFunction = fn;
                this.startFunction.body = new bytearray_1.ByteArray();
            }
            wasmAssignLocalVariableOffsets(fn, body, shared, this.bitness);
            fn.locals = argumentVariables.concat(fn.localVariables);
        }
        let child = node.firstChild;
        while (child != null) {
            this.prepareToEmit(child);
            child = child.nextSibling;
        }
    }
    emitBinaryExpression(byteOffset, node, opcode) {
        this.emitNode(byteOffset, node.binaryLeft());
        this.emitNode(byteOffset, node.binaryRight());
        this.assembler.appendOpcode(byteOffset, opcode);
    }
    emitLoadFromMemory(byteOffset, type, relativeBase, offset) {
        let opcode;
        // Relative address
        if (relativeBase != null) {
            this.emitNode(byteOffset, relativeBase);
        }
        else {
            opcode = opcode_1.WasmOpcode.I32_CONST;
            this.assembler.appendOpcode(byteOffset, opcode);
            logger_1.log(this.assembler.activePayload, byteOffset, 0, "i32 literal");
            this.assembler.writeUnsignedLEB128(0);
        }
        let sizeOf = type.variableSizeOf(this.context);
        if (sizeOf == 1) {
            opcode = type.isUnsigned() ? opcode_1.WasmOpcode.I32_LOAD8_U : opcode_1.WasmOpcode.I32_LOAD8_S;
            this.assembler.appendOpcode(byteOffset, opcode);
            logger_1.log(this.assembler.activePayload, byteOffset, 0, "alignment");
            this.assembler.writeUnsignedLEB128(0);
        }
        else if (sizeOf == 2) {
            opcode = type.isUnsigned() ? opcode_1.WasmOpcode.I32_LOAD16_U : opcode_1.WasmOpcode.I32_LOAD16_S;
            this.assembler.appendOpcode(byteOffset, opcode);
            logger_1.log(this.assembler.activePayload, byteOffset, 1, "alignment");
            this.assembler.writeUnsignedLEB128(1);
        }
        else if (sizeOf == 4 || type.isClass()) {
            if (type.isFloat()) {
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F32_LOAD);
            }
            else {
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_LOAD);
            }
            logger_1.log(this.assembler.activePayload, byteOffset, 2, "alignment");
            this.assembler.writeUnsignedLEB128(2);
        }
        else if (sizeOf == 8) {
            if (type.isDouble()) {
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F64_LOAD);
            }
            else {
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I64_LOAD);
            }
            logger_1.log(this.assembler.activePayload, byteOffset, 3, "alignment");
            this.assembler.writeUnsignedLEB128(3);
        }
        else {
            assert_1.assert(false);
        }
        logger_1.log(this.assembler.activePayload, byteOffset, offset, "load offset");
        this.assembler.writeUnsignedLEB128(offset);
    }
    emitStoreToMemory(byteOffset, type, relativeBase, offset, value) {
        // Relative address
        if (relativeBase != null) {
            this.emitNode(byteOffset, relativeBase);
        }
        else {
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST);
            logger_1.log(this.assembler.activePayload, byteOffset, 0, "i32 literal");
            this.assembler.writeUnsignedLEB128(0);
        }
        this.emitNode(byteOffset, value);
        let sizeOf = type.variableSizeOf(this.context);
        if (sizeOf == 1) {
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_STORE8);
            logger_1.log(this.assembler.activePayload, byteOffset, 0, "alignment");
            this.assembler.writeUnsignedLEB128(0);
        }
        else if (sizeOf == 2) {
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_STORE16);
            logger_1.log(this.assembler.activePayload, byteOffset, 1, "alignment");
            this.assembler.writeUnsignedLEB128(1);
        }
        else if (sizeOf == 4 || type.isClass()) {
            if (type.isFloat()) {
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F32_STORE);
            }
            else {
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_STORE);
            }
            logger_1.log(this.assembler.activePayload, byteOffset, 2, "alignment");
            this.assembler.writeUnsignedLEB128(2);
        }
        else if (sizeOf == 8) {
            if (type.isDouble()) {
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F64_STORE);
            }
            else if (type.isLong()) {
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I64_STORE);
            }
            logger_1.log(this.assembler.activePayload, byteOffset, 3, "alignment");
            this.assembler.writeUnsignedLEB128(3);
        }
        else {
            assert_1.assert(false);
        }
        logger_1.log(this.assembler.activePayload, byteOffset, offset, "load offset");
        this.assembler.writeUnsignedLEB128(offset);
    }
    /**
     * Emit instance
     * @param array
     * @param byteOffset
     * @param node
     */
    emitInstance(byteOffset, node) {
        let constructorNode = node.constructorNode();
        if (constructorNode !== undefined) {
            let callSymbol = constructorNode.symbol;
            let type = node.newType();
            let size;
            if (type.resolvedType.isArray()) {
                /**
                 * If the new type if an array append total byte length and element size
                 **/
                let elementNode = type.firstGenericType();
                let elementType = elementNode.resolvedType;
                let isClassElement = elementType.isClass();
                //ignore 64 bit pointer
                size = isClassElement ? 4 : elementType.allocationSizeOf(this.context);
                assert_1.assert(size > 0);
                let lengthNode = node.arrayLength();
                if (lengthNode.kind == node_1.NodeKind.INT32) {
                    let length = size * lengthNode.intValue;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, length);
                    this.assembler.writeLEB128(length); //array byteLength
                }
                else {
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, size);
                    this.assembler.writeLEB128(size);
                    this.emitNode(byteOffset, lengthNode);
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_MUL); //array byteLength
                }
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, size);
                this.assembler.writeLEB128(size); // array element size
                let callIndex = this.getWasmFunctionCallIndex(callSymbol);
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.CALL);
                logger_1.log(this.assembler.activePayload, byteOffset, callIndex, `call func index (${callIndex})`);
                this.assembler.writeUnsignedLEB128(callIndex);
            }
            else if (type.resolvedType.isTypedArray()) {
                // let elementSize = getTypedArrayElementSize(type.resolvedType.symbol.name);
                // this.assembler.appendOpcode(byteOffset, WasmOpcode.GET_LOCAL);
                // this.assembler.writeLEB128(0);
                // this.assembler.appendOpcode(byteOffset, WasmOpcode.I32_CONST);
                // this.assembler.writeLEB128(elementSize);
                // this.assembler.appendOpcode(byteOffset, WasmOpcode.I32_SHL);
                // this.assembler.appendOpcode(byteOffset, WasmOpcode.I32_CONST);
                // this.assembler.writeLEB128(size);
                // this.assembler.appendOpcode(byteOffset, WasmOpcode.I32_ADD);
            }
            else {
                // Emit constructor argumentVariables
                let child = node.firstChild.nextSibling;
                while (child != null) {
                    this.emitNode(byteOffset, child);
                    child = child.nextSibling;
                }
                let callIndex = this.getWasmFunctionCallIndex(callSymbol);
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.CALL, callIndex);
                this.assembler.writeUnsignedLEB128(callIndex);
            }
        }
    }
    /**
     * Emit constructor function where malloc happens
     * @param array
     * @param byteOffset
     * @param fn
     */
    emitConstructor(byteOffset, fn) {
        let constructorNode = fn.symbol.node;
        let type = constructorNode.parent.symbol;
        let size = type.resolvedType.allocationSizeOf(this.context);
        assert_1.assert(size > 0);
        if (type.resolvedType.isArray()) {
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.GET_LOCAL, 0);
            this.assembler.writeUnsignedLEB128(0); // array parameter byteLength
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, size);
            this.assembler.writeLEB128(size); // size of array class, default is 8 bytes
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_ADD);
        }
        else if (type.resolvedType.isTypedArray()) {
            let elementSize = utils_2.getTypedArrayElementSize(type.resolvedType.symbol.name);
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.GET_LOCAL, 0);
            this.assembler.writeUnsignedLEB128(0);
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, elementSize);
            this.assembler.writeLEB128(elementSize);
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_SHL);
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, size);
            this.assembler.writeLEB128(size);
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_ADD);
        }
        else {
            // Pass the object size as the first argument
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, size);
            this.assembler.writeLEB128(size);
        }
        // Allocate memory
        let mallocIndex = this.calculateWasmFunctionIndex(this.mallocFunctionIndex);
        this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.CALL, mallocIndex);
        this.assembler.writeUnsignedLEB128(mallocIndex);
        this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.SET_LOCAL, fn.signature.argumentTypes.length);
        this.assembler.writeUnsignedLEB128(fn.signature.argumentTypes.length);
        // Set self pointer to first local variable which is immediate after the argument variable
    }
    emitNode(byteOffset, node) {
        // Assert
        assert_1.assert(!node_1.isExpression(node) || node.resolvedType != null);
        if (node.kind == node_1.NodeKind.BLOCK) {
            /**
             * Skip emitting block if parent is 'if' or 'loop' since it is already a block
             */
            let skipBlock = node.parent.kind === node_1.NodeKind.IF;
            if (!skipBlock) {
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.BLOCK);
                if (node.returnNode !== undefined) {
                    // log(this.assembler.activePayload, byteOffset, this.currentFunction.returnType, WasmType[this.currentFunction.returnType]);
                    this.assembler.append(byteOffset, this.currentFunction.returnType);
                    this.assembler.activeCode.removeLastLinebreak();
                    this.assembler.activeCode.append(" (result " + wasm_type_1.WasmTypeToString[this.currentFunction.returnType] + ")\n", 1);
                }
                else {
                    // log(this.assembler.activePayload, byteOffset, WasmType.block_type);
                    this.assembler.append(byteOffset, wasm_type_1.WasmType.block_type);
                }
            }
            let child = node.firstChild;
            while (child != null) {
                this.emitNode(byteOffset, child);
                child = child.nextSibling;
            }
            if (!skipBlock) {
                this.assembler.activeCode.clearIndent(1);
                this.assembler.activeCode.indent -= 1;
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.END);
            }
        }
        else if (node.kind == node_1.NodeKind.WHILE) {
            let value = node.whileValue();
            let body = node.whileBody();
            // Ignore "while (false) { ... }"
            if (value.kind == node_1.NodeKind.BOOLEAN && value.intValue == 0) {
                return 0;
            }
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.BLOCK);
            //log(this.assembler.activePayload, WasmType.block_type);
            this.assembler.append(byteOffset, wasm_type_1.WasmType.block_type);
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.LOOP);
            //log(this.assembler.activePayload, 0, WasmType.block_type, WasmType[WasmType.block_type]);
            this.assembler.append(byteOffset, wasm_type_1.WasmType.block_type);
            if (value.kind != node_1.NodeKind.BOOLEAN) {
                this.emitNode(byteOffset, value);
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_EQZ);
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.BR_IF);
                this.assembler.writeUnsignedLEB128(1); // Break out of the immediately enclosing loop
            }
            let child = body.firstChild;
            while (child != null) {
                this.emitNode(byteOffset, child);
                child = child.nextSibling;
            }
            // Jump back to the top (this doesn't happen automatically)
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.BR);
            this.assembler.writeUnsignedLEB128(0); // Continue back to the immediately enclosing loop
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.END); // end inner block
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.END); // end outer block
        }
        else if (node.kind == node_1.NodeKind.FOR) {
            let initializationStmt = node.forInitializationStatement();
            let terminationStmt = node.forTerminationStatement();
            let updateStmt = node.forUpdateStatements();
            let body = node.forBody();
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.BLOCK);
            //log(this.assembler.activePayload, WasmType.block_type);
            this.assembler.append(byteOffset, wasm_type_1.WasmType.block_type);
            this.emitNode(byteOffset, initializationStmt);
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.LOOP);
            //log(this.assembler.activePayload, 0, WasmType.block_type, WasmType[WasmType.block_type]);
            this.assembler.append(byteOffset, wasm_type_1.WasmType.block_type);
            if (terminationStmt.kind != node_1.NodeKind.BOOLEAN) {
                this.emitNode(byteOffset, terminationStmt);
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_EQZ);
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.BR_IF);
                this.assembler.writeUnsignedLEB128(1); // Break out of the immediately enclosing loop
            }
            let child = body.firstChild;
            while (child != null) {
                this.emitNode(byteOffset, child);
                child = child.nextSibling;
            }
            this.emitNode(byteOffset, updateStmt);
            // Jump back to the top (this doesn't happen automatically)
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.BR);
            this.assembler.writeUnsignedLEB128(0); // Continue back to the immediately enclosing loop
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.END); // end inner block
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.END); // end outer block
        }
        else if (node.kind == node_1.NodeKind.BREAK || node.kind == node_1.NodeKind.CONTINUE) {
            let label = 0;
            let parent = node.parent;
            while (parent != null && parent.kind != node_1.NodeKind.WHILE) {
                if (parent.kind == node_1.NodeKind.BLOCK) {
                    label = label + 1;
                }
                parent = parent.parent;
            }
            assert_1.assert(label > 0);
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.BR);
            this.assembler.writeUnsignedLEB128(label - (node.kind == node_1.NodeKind.BREAK ? 0 : 1));
        }
        else if (node.kind == node_1.NodeKind.EMPTY) {
            return 0;
        }
        else if (node.kind == node_1.NodeKind.EXPRESSIONS) {
            let child = node.firstChild;
            while (child) {
                this.emitNode(byteOffset, child.expressionValue());
                child = child.nextSibling;
            }
        }
        else if (node.kind == node_1.NodeKind.EXPRESSION) {
            this.emitNode(byteOffset, node.expressionValue());
        }
        else if (node.kind == node_1.NodeKind.RETURN) {
            let value = node.returnValue();
            if (value != null) {
                this.emitNode(byteOffset, value);
            }
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.RETURN);
        }
        else if (node.kind == node_1.NodeKind.VARIABLES) {
            let count = 0;
            let child = node.firstChild;
            while (child != null) {
                assert_1.assert(child.kind == node_1.NodeKind.VARIABLE);
                count = count + this.emitNode(byteOffset, child);
                child = child.nextSibling;
            }
            return count;
        }
        else if (node.kind == node_1.NodeKind.IF) {
            let branch = node.ifFalse();
            this.emitNode(byteOffset, node.ifValue());
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.IF);
            let returnNode = node.ifReturnNode();
            let needEmptyElse = false;
            if (returnNode == null && branch === null) {
                this.assembler.append(0, wasm_type_1.WasmType.block_type, wasm_type_1.WasmType[wasm_type_1.WasmType.block_type]);
            }
            else {
                if (returnNode !== null) {
                    let returnType = utils_2.symbolToWasmType(returnNode.resolvedType.symbol);
                    this.assembler.append(0, returnType, wasm_type_1.WasmType[returnType]);
                    this.assembler.activeCode.removeLastLinebreak();
                    this.assembler.activeCode.append(` (result ${wasm_type_1.WasmTypeToString[returnType]})\n`);
                    if (branch == null) {
                        needEmptyElse = true;
                    }
                }
                else {
                    this.assembler.append(0, wasm_type_1.WasmType.block_type, wasm_type_1.WasmType[wasm_type_1.WasmType.block_type]);
                }
            }
            this.emitNode(byteOffset, node.ifTrue());
            if (branch != null) {
                this.assembler.activeCode.indent -= 1;
                this.assembler.activeCode.clearIndent(1);
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.IF_ELSE);
                this.emitNode(byteOffset, branch);
            }
            else if (needEmptyElse) {
                this.assembler.activeCode.indent -= 1;
                this.assembler.activeCode.clearIndent(1);
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.IF_ELSE);
                let dataType = utils_2.typeToDataType(returnNode.resolvedType, this.bitness);
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode[`${dataType}_CONST`]);
                if (dataType === "I32" || dataType === "I64") {
                    this.assembler.writeUnsignedLEB128(0);
                }
                else if (dataType === "F32") {
                    this.assembler.writeFloat(0);
                }
                else if (dataType === "F64") {
                    this.assembler.writeDouble(0);
                }
            }
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.END);
        }
        else if (node.kind == node_1.NodeKind.HOOK) {
            this.emitNode(byteOffset, node.hookValue());
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.IF);
            let trueValue = node.hookTrue();
            let trueValueType = utils_2.symbolToWasmType(trueValue.resolvedType.symbol);
            this.assembler.append(0, trueValueType, wasm_type_1.WasmType[trueValueType]);
            this.emitNode(byteOffset, trueValue);
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.IF_ELSE);
            this.emitNode(byteOffset, node.hookFalse());
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.END);
        }
        else if (node.kind == node_1.NodeKind.VARIABLE) {
            let value = node.variableValue();
            if (node.symbol.name == "this" && this.currentFunction.symbol.name == "constructor") {
                // skip this
            }
            else if (node.symbol.kind == symbol_1.SymbolKind.VARIABLE_LOCAL) {
                if (value &&
                    value.kind != node_1.NodeKind.NAME &&
                    value.kind != node_1.NodeKind.CALL &&
                    value.kind != node_1.NodeKind.NEW &&
                    value.kind != node_1.NodeKind.DOT &&
                    value.rawValue) {
                    if (node.symbol.resolvedType.isFloat()) {
                        this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F32_CONST, value.floatValue);
                        this.assembler.writeFloat(value.floatValue);
                    }
                    else if (node.symbol.resolvedType.isDouble()) {
                        this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F64_CONST, value.doubleValue);
                        this.assembler.writeDouble(value.doubleValue);
                    }
                    else if (node.symbol.resolvedType.isLong()) {
                        this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I64_CONST, value.longValue);
                        this.assembler.writeLEB128(value.longValue);
                    }
                    else {
                        this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, value.intValue);
                        this.assembler.writeLEB128(value.intValue);
                    }
                }
                else {
                    if (value != null) {
                        this.emitNode(byteOffset, value);
                    }
                    else {
                        // Default value
                        if (node.symbol.resolvedType.isFloat()) {
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F32_CONST, 0);
                            this.assembler.writeFloat(0);
                        }
                        else if (node.symbol.resolvedType.isDouble()) {
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F64_CONST, 0);
                            this.assembler.writeDouble(0);
                        }
                        else if (node.symbol.resolvedType.isLong()) {
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I64_CONST, 0);
                            this.assembler.writeLEB128(0);
                        }
                        else {
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, 0);
                            this.assembler.writeLEB128(0);
                        }
                    }
                }
                let skipSetLocal = value && node_1.isUnaryPostfix(value.kind);
                if (skipSetLocal == false) {
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.SET_LOCAL, node.symbol.offset);
                    this.assembler.writeUnsignedLEB128(node.symbol.offset);
                }
            }
            else {
                assert_1.assert(false);
            }
        }
        else if (node.kind == node_1.NodeKind.NAME) {
            let symbol = node.symbol;
            if (symbol.kind == symbol_1.SymbolKind.VARIABLE_ARGUMENT || symbol.kind == symbol_1.SymbolKind.VARIABLE_LOCAL) {
                // FIXME This should handle in checker.
                if (symbol.name === "this" && this.currentFunction.symbol.name === "constructor") {
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.GET_LOCAL, this.currentFunction.signature.argumentTypes.length);
                    this.assembler.writeUnsignedLEB128(this.currentFunction.signature.argumentTypes.length);
                }
                else {
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.GET_LOCAL, symbol.offset);
                    this.assembler.writeUnsignedLEB128(symbol.offset);
                }
            }
            else if (symbol.kind == symbol_1.SymbolKind.VARIABLE_GLOBAL) {
                // FIXME: Final spec allow immutable global variables
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.GET_GLOBAL, symbol.offset);
                this.assembler.writeUnsignedLEB128(symbol.offset);
                // this.emitLoadFromMemory(byteOffset, symbol.resolvedType, null, MEMORY_INITIALIZER_BASE + symbol.offset);
            }
            else {
                assert_1.assert(false);
            }
        }
        else if (node.kind == node_1.NodeKind.DEREFERENCE) {
            this.emitLoadFromMemory(byteOffset, node.resolvedType.underlyingType(this.context), node.unaryValue(), 0);
        }
        else if (node.kind == node_1.NodeKind.POINTER_INDEX) {
            this.emitLoadFromMemory(byteOffset, node.resolvedType.underlyingType(this.context), node.pointer(), node.pointerOffset());
        }
        else if (node.kind == node_1.NodeKind.NULL) {
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, 0);
            this.assembler.writeLEB128(0);
        }
        else if (node.kind == node_1.NodeKind.INT32 || node.kind == node_1.NodeKind.BOOLEAN) {
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, node.intValue);
            this.assembler.writeLEB128(node.intValue || 0);
        }
        else if (node.kind == node_1.NodeKind.INT64) {
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I64_CONST, node.longValue);
            this.assembler.writeLEB128(node.longValue);
        }
        else if (node.kind == node_1.NodeKind.FLOAT32) {
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F32_CONST, node.floatValue);
            this.assembler.writeFloat(node.floatValue);
        }
        else if (node.kind == node_1.NodeKind.FLOAT64) {
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F64_CONST, node.doubleValue);
            this.assembler.writeDouble(node.doubleValue);
        }
        else if (node.kind == node_1.NodeKind.STRING) {
            let value = wasm_binary_1.WasmBinary.MEMORY_INITIALIZER_BASE + node.intValue;
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, value);
            this.assembler.writeLEB128(value);
        }
        else if (node.kind == node_1.NodeKind.CALL) {
            let value = node.callValue();
            let symbol = value.symbol;
            assert_1.assert(symbol_1.isFunction(symbol.kind));
            // Write out the implicit "this" argument
            if (!symbol.node.isExternalImport() && symbol.kind == symbol_1.SymbolKind.FUNCTION_INSTANCE) {
                let dotTarget = value.dotTarget();
                this.emitNode(byteOffset, dotTarget);
                if (dotTarget.kind == node_1.NodeKind.NEW) {
                    this.emitInstance(byteOffset, dotTarget);
                }
            }
            let child = value.nextSibling;
            while (child != null) {
                this.emitNode(byteOffset, child);
                child = child.nextSibling;
            }
            let wasmFunctionName = utils_2.getWasmFunctionName(symbol);
            if (builtins_helper_1.isBuiltin(wasmFunctionName)) {
                this.assembler.appendOpcode(byteOffset, builtins_helper_1.getBuiltinOpcode(symbol.name));
            }
            else {
                let callIndex;
                if (binary_importer_1.isBinaryImport(wasmFunctionName)) {
                    callIndex = binary_importer_1.getMergedCallIndex(wasmFunctionName);
                }
                else {
                    callIndex = this.getWasmFunctionCallIndex(symbol);
                }
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.CALL, callIndex);
                this.assembler.writeUnsignedLEB128(callIndex);
            }
        }
        else if (node.kind == node_1.NodeKind.NEW) {
            this.emitInstance(byteOffset, node);
        }
        else if (node.kind == node_1.NodeKind.DELETE) {
            let value = node.deleteValue();
            this.emitNode(byteOffset, value);
            let freeIndex = this.calculateWasmFunctionIndex(this.freeFunctionIndex);
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.CALL, freeIndex);
            this.assembler.writeUnsignedLEB128(freeIndex);
        }
        else if (node.kind == node_1.NodeKind.POSITIVE) {
            this.emitNode(byteOffset, node.unaryValue());
        }
        else if (node.kind == node_1.NodeKind.NEGATIVE) {
            let resolvedType = node.unaryValue().resolvedType;
            if (resolvedType.isFloat()) {
                this.emitNode(byteOffset, node.unaryValue());
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F32_NEG);
            }
            else if (resolvedType.isDouble()) {
                this.emitNode(byteOffset, node.unaryValue());
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F64_NEG);
            }
            else if (resolvedType.isInteger()) {
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, 0);
                this.assembler.writeLEB128(0);
                this.emitNode(byteOffset, node.unaryValue());
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_SUB);
            }
            else if (resolvedType.isLong()) {
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I64_CONST, 0);
                this.assembler.writeLEB128(0);
                this.emitNode(byteOffset, node.unaryValue());
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I64_SUB);
            }
        }
        else if (node.kind == node_1.NodeKind.COMPLEMENT) {
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, ~0);
            this.assembler.writeLEB128(~0);
            this.emitNode(byteOffset, node.unaryValue());
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_XOR);
        }
        else if (node.kind == node_1.NodeKind.NOT) {
            this.emitNode(byteOffset, node.unaryValue());
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_EQZ);
        }
        else if (node.kind == node_1.NodeKind.CAST) {
            let value = node.castValue();
            let context = this.context;
            let from = value.resolvedType.underlyingType(context);
            let type = node.resolvedType.underlyingType(context);
            let fromSize = from.variableSizeOf(context);
            let typeSize = type.variableSizeOf(context);
            //FIXME: Handle 8,16 bit integer to float casting
            // Sign-extend
            // if (
            //     from == context.int32Type &&
            //     type == context.int8Type || type == context.int16Type
            // ) {
            //     let shift = 32 - typeSize * 8;
            //     this.emitNode(byteOffset, value);
            //     this.assembler.appendOpcode(byteOffset, WasmOpcode.I32_CONST);
            //     log(byteOffset, shift, "i32 literal");
            //     this.assembler.writeLEB128(shift);
            //     this.assembler.appendOpcode(byteOffset, WasmOpcode.I32_SHR_S);
            //     this.assembler.appendOpcode(byteOffset, WasmOpcode.I32_CONST);
            //     log(byteOffset, shift, "i32 literal");
            //     this.assembler.writeLEB128(shift);
            //     this.assembler.appendOpcode(byteOffset, WasmOpcode.I32_SHL);
            // }
            //
            // // Mask
            // else if (
            //     from == context.int32Type || from == context.uint32Type &&
            //     type == context.uint8Type || type == context.uint16Type
            // ) {
            //     this.emitNode(byteOffset, value);
            //     this.assembler.appendOpcode(byteOffset, WasmOpcode.I32_CONST);
            //     let _value = type.integerBitMask(this.context);
            //     log(byteOffset, _value, "i32 literal");
            //     this.assembler.writeLEB128(_value);
            //     this.assembler.appendOpcode(byteOffset, WasmOpcode.I32_AND);
            // }
            // --- 32 bit Integer casting ---
            // i32 > i64
            if ((from == context.nullType || from == context.booleanType || from == context.int32Type || from == context.uint32Type) &&
                (type == context.int64Type || type == context.uint64Type)) {
                if (value.kind == node_1.NodeKind.NULL) {
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I64_CONST, 0);
                    this.assembler.writeLEB128(0);
                }
                else if (value.kind == node_1.NodeKind.BOOLEAN) {
                    let intValue = value.intValue || 0;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I64_CONST, intValue);
                    this.assembler.writeLEB128(intValue);
                }
                else if (value.kind == node_1.NodeKind.INT32) {
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I64_CONST, value.longValue);
                    this.assembler.writeLEB128(value.longValue);
                }
                else {
                    let isUnsigned = value.resolvedType.isUnsigned();
                    this.emitNode(byteOffset, value);
                    this.assembler.appendOpcode(byteOffset, isUnsigned ? opcode_1.WasmOpcode.I64_EXTEND_U_I32 : opcode_1.WasmOpcode.I64_EXTEND_S_I32);
                }
            }
            else if ((from == context.nullType || from == context.booleanType || from == context.int32Type || from == context.uint32Type) &&
                type == context.float32Type) {
                if (value.kind == node_1.NodeKind.NULL) {
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F32_CONST, 0);
                    this.assembler.writeFloat(0);
                }
                else if (value.kind == node_1.NodeKind.BOOLEAN) {
                    let floatValue = value.intValue || 0;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F32_CONST, floatValue);
                    this.assembler.writeFloat(floatValue);
                }
                else if (value.kind == node_1.NodeKind.INT32) {
                    let floatValue = value.floatValue || 0;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F32_CONST, floatValue);
                    this.assembler.writeFloat(floatValue);
                }
                else {
                    let isUnsigned = value.resolvedType.isUnsigned();
                    this.emitNode(byteOffset, value);
                    this.assembler.appendOpcode(byteOffset, isUnsigned ? opcode_1.WasmOpcode.F32_CONVERT_U_I32 : opcode_1.WasmOpcode.F32_CONVERT_S_I32);
                }
            }
            else if ((from == context.nullType || from == context.int32Type || from == context.uint32Type) &&
                type == context.float64Type) {
                if (value.kind == node_1.NodeKind.NULL) {
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F64_CONST, 0);
                    this.assembler.writeDouble(0);
                }
                else if (value.kind == node_1.NodeKind.BOOLEAN) {
                    let doubleValue = value.doubleValue || 0;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F64_CONST, doubleValue);
                    this.assembler.writeDouble(doubleValue);
                }
                else if (value.kind == node_1.NodeKind.INT32) {
                    let doubleValue = value.doubleValue || 0;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F64_CONST, doubleValue);
                    this.assembler.writeDouble(doubleValue);
                }
                else {
                    let isUnsigned = value.resolvedType.isUnsigned();
                    this.emitNode(byteOffset, value);
                    this.assembler.appendOpcode(byteOffset, isUnsigned ? opcode_1.WasmOpcode.F64_CONVERT_U_I32 : opcode_1.WasmOpcode.F64_CONVERT_S_I32);
                }
            }
            else if ((from == context.int64Type || from == context.uint64Type) &&
                (type == context.int32Type || type == context.uint32Type)) {
                if (value.kind == node_1.NodeKind.INT64) {
                    let intValue = value.intValue || 0;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, intValue);
                    this.assembler.writeLEB128(intValue);
                }
                else {
                    this.emitNode(byteOffset, value);
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_WRAP_I64);
                }
            }
            else if ((from == context.int64Type || from == context.uint64Type) &&
                type == context.float32Type) {
                if (value.kind == node_1.NodeKind.INT32) {
                    let floatValue = value.floatValue || 0;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F32_CONST, floatValue);
                    this.assembler.writeFloat(floatValue);
                }
                else {
                    let isUnsigned = value.resolvedType.isUnsigned();
                    this.emitNode(byteOffset, value);
                    this.assembler.appendOpcode(byteOffset, isUnsigned ? opcode_1.WasmOpcode.F32_CONVERT_U_I64 : opcode_1.WasmOpcode.F32_CONVERT_S_I64);
                }
            }
            else if ((from == context.int64Type || from == context.uint64Type) &&
                type == context.float64Type) {
                if (value.kind == node_1.NodeKind.INT64) {
                    let doubleValue = value.doubleValue || 0;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F64_CONST, doubleValue);
                    this.assembler.writeDouble(doubleValue);
                }
                else {
                    let isUnsigned = value.resolvedType.isUnsigned();
                    this.emitNode(byteOffset, value);
                    this.assembler.appendOpcode(byteOffset, isUnsigned ? opcode_1.WasmOpcode.F64_CONVERT_U_I64 : opcode_1.WasmOpcode.F64_CONVERT_S_I64);
                }
            }
            else if (from == context.float32Type &&
                (type == context.uint8Type || type == context.int8Type ||
                    type == context.uint16Type || type == context.int16Type ||
                    type == context.uint32Type || type == context.int32Type)) {
                if (value.kind == node_1.NodeKind.FLOAT32) {
                    let intValue = value.intValue || 0;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, intValue);
                    this.assembler.writeLEB128(intValue);
                }
                else {
                    let isUnsigned = type.isUnsigned();
                    this.emitNode(byteOffset, value);
                    this.assembler.appendOpcode(byteOffset, isUnsigned ? opcode_1.WasmOpcode.I32_TRUNC_U_F32 : opcode_1.WasmOpcode.I32_TRUNC_S_F32);
                }
            }
            else if (from == context.float32Type &&
                (type == context.int64Type || type == context.uint64Type)) {
                if (value.kind == node_1.NodeKind.FLOAT32) {
                    let longValue = value.longValue || 0;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I64_CONST, longValue);
                    this.assembler.writeLEB128(longValue);
                }
                else {
                    let isUnsigned = type.isUnsigned();
                    this.emitNode(byteOffset, value);
                    this.assembler.appendOpcode(byteOffset, isUnsigned ? opcode_1.WasmOpcode.I64_TRUNC_U_F32 : opcode_1.WasmOpcode.I64_TRUNC_S_F32);
                }
            }
            else if (from == context.float32Type && type == context.float64Type) {
                if (value.kind == node_1.NodeKind.FLOAT32) {
                    let doubleValue = value.doubleValue || 0;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F64_CONST, doubleValue);
                    this.assembler.writeDouble(doubleValue);
                }
                else {
                    this.emitNode(byteOffset, value);
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F64_PROMOTE_F32);
                }
            }
            else if (from == context.float64Type &&
                (type == context.uint8Type || type == context.int8Type ||
                    type == context.uint16Type || type == context.int16Type ||
                    type == context.uint32Type || type == context.int32Type)) {
                if (value.kind == node_1.NodeKind.FLOAT64) {
                    let intValue = value.intValue || 0;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, intValue);
                    this.assembler.writeLEB128(intValue);
                }
                else {
                    let isUnsigned = type.isUnsigned();
                    this.emitNode(byteOffset, value);
                    this.assembler.appendOpcode(byteOffset, isUnsigned ? opcode_1.WasmOpcode.I32_TRUNC_U_F64 : opcode_1.WasmOpcode.I32_TRUNC_S_F64);
                }
            }
            else if (from == context.float64Type &&
                (type == context.int64Type || type == context.uint64Type)) {
                if (value.kind == node_1.NodeKind.FLOAT64) {
                    let longValue = value.longValue || 0;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I64_CONST, longValue);
                    this.assembler.writeLEB128(longValue);
                }
                else {
                    let isUnsigned = type.isUnsigned();
                    this.emitNode(byteOffset, value);
                    this.assembler.appendOpcode(byteOffset, isUnsigned ? opcode_1.WasmOpcode.I64_TRUNC_U_F64 : opcode_1.WasmOpcode.I64_TRUNC_S_F64);
                }
            }
            else if (from == context.float64Type && type == context.float32Type) {
                if (value.kind == node_1.NodeKind.FLOAT64) {
                    let floatValue = value.floatValue || 0;
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F32_CONST, floatValue);
                    this.assembler.writeFloat(floatValue);
                }
                else {
                    this.emitNode(byteOffset, value);
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F32_DEMOTE_F64);
                }
            }
            else {
                this.emitNode(byteOffset, value);
            }
        }
        else if (node.kind == node_1.NodeKind.DOT) {
            let symbol = node.symbol;
            if (symbol.kind == symbol_1.SymbolKind.VARIABLE_INSTANCE) {
                this.emitLoadFromMemory(byteOffset, symbol.resolvedType, node.dotTarget(), symbol.offset);
            }
            else {
                assert_1.assert(false);
            }
        }
        else if (node.kind == node_1.NodeKind.ASSIGN) {
            let left = node.binaryLeft();
            let right = node.binaryRight();
            let symbol = left.symbol;
            if (left.kind == node_1.NodeKind.DEREFERENCE) {
                this.emitStoreToMemory(byteOffset, left.resolvedType.underlyingType(this.context), left.unaryValue(), 0, right);
            }
            else if (left.kind == node_1.NodeKind.POINTER_INDEX) {
                this.emitStoreToMemory(byteOffset, left.resolvedType.underlyingType(this.context), left.pointer(), left.pointerOffset(), right);
            }
            else if (symbol.kind == symbol_1.SymbolKind.VARIABLE_INSTANCE) {
                this.emitStoreToMemory(byteOffset, symbol.resolvedType, left.dotTarget(), symbol.offset, right);
            }
            else if (symbol.kind == symbol_1.SymbolKind.VARIABLE_GLOBAL) {
                this.emitNode(byteOffset, right);
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.SET_GLOBAL);
                this.assembler.writeUnsignedLEB128(symbol.offset);
                // this.emitStoreToMemory(byteOffset, symbol.resolvedType, null, MEMORY_INITIALIZER_BASE + symbol.offset, right);
            }
            else if (symbol.kind == symbol_1.SymbolKind.VARIABLE_ARGUMENT || symbol.kind == symbol_1.SymbolKind.VARIABLE_LOCAL) {
                this.emitNode(byteOffset, right);
                if (!node_1.isUnaryPostfix(right.kind)) {
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.SET_LOCAL, symbol.offset);
                    this.assembler.writeUnsignedLEB128(symbol.offset);
                }
            }
            else {
                assert_1.assert(false);
            }
        }
        else if (node.kind == node_1.NodeKind.LOGICAL_AND) {
            this.emitNode(byteOffset, node.binaryLeft());
            this.emitNode(byteOffset, node.binaryRight());
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_AND);
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, 1);
            this.assembler.writeLEB128(1);
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_EQ);
        }
        else if (node.kind == node_1.NodeKind.LOGICAL_OR) {
            this.emitNode(byteOffset, node.binaryLeft());
            this.emitNode(byteOffset, node.binaryRight());
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_OR);
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST);
            logger_1.log(this.assembler.activePayload, byteOffset, 1, "i32 literal");
            this.assembler.writeLEB128(1);
            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_EQ);
        }
        else if (node_1.isUnary(node.kind)) {
            let kind = node.kind;
            if (kind == node_1.NodeKind.POSTFIX_INCREMENT || kind == node_1.NodeKind.POSTFIX_DECREMENT) {
                let value = node.unaryValue();
                let dataType = utils_2.typeToDataType(value.resolvedType, this.bitness);
                //TODO handle instance variable
                if (node.parent.kind == node_1.NodeKind.VARIABLE) {
                    this.emitNode(byteOffset, value);
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.SET_LOCAL, node.parent.symbol.offset);
                    this.assembler.writeUnsignedLEB128(node.parent.symbol.offset);
                }
                else if (node.parent.kind == node_1.NodeKind.ASSIGN) {
                    this.emitNode(byteOffset, value);
                    let left = node.parent.binaryLeft();
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.SET_LOCAL, left.symbol.offset);
                    this.assembler.writeUnsignedLEB128(left.symbol.offset);
                }
                this.emitNode(byteOffset, value);
                if (node.parent.kind != node_1.NodeKind.RETURN) {
                    assert_1.assert(value.resolvedType.isInteger() || value.resolvedType.isLong() ||
                        value.resolvedType.isFloat() || value.resolvedType.isDouble());
                    let size = value.resolvedType.pointerTo ?
                        value.resolvedType.pointerTo.allocationSizeOf(this.context) :
                        value.resolvedType.allocationSizeOf(this.context);
                    if (size == 1 || size == 2) {
                        if (value.kind == node_1.NodeKind.INT32 || value.resolvedType.isInteger()) {
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, 1);
                            this.assembler.writeLEB128(1);
                        }
                        else {
                            terminal_1.Terminal.error("Wrong type");
                        }
                    }
                    else if (size == 4) {
                        if (value.kind == node_1.NodeKind.INT32 || value.resolvedType.isInteger()) {
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, 1);
                            this.assembler.writeLEB128(1);
                        }
                        else if (value.kind == node_1.NodeKind.FLOAT32 || value.resolvedType.isFloat()) {
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F32_CONST, 1.0);
                            this.assembler.writeFloat(1);
                        }
                        else {
                            terminal_1.Terminal.error("Wrong type");
                        }
                    }
                    else if (size == 8) {
                        if (value.kind == node_1.NodeKind.INT64 || value.resolvedType.isLong()) {
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I64_CONST, 1);
                            this.assembler.writeLEB128(1);
                        }
                        else if (value.kind == node_1.NodeKind.FLOAT64 || value.resolvedType.isDouble()) {
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F64_CONST, 1.0);
                            this.assembler.writeDouble(1);
                        }
                        else {
                            terminal_1.Terminal.error("Wrong type");
                        }
                    }
                    //TODO extend to other operations
                    let operation = kind == node_1.NodeKind.POSTFIX_INCREMENT ? "ADD" : "SUB";
                    this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode[`${dataType}_${operation}`]);
                    if (value.symbol.kind == symbol_1.SymbolKind.VARIABLE_GLOBAL) {
                        this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.SET_GLOBAL, value.symbol.offset);
                        this.assembler.writeLEB128(value.symbol.offset);
                    }
                    else if (value.symbol.kind == symbol_1.SymbolKind.VARIABLE_LOCAL || value.symbol.kind == symbol_1.SymbolKind.VARIABLE_ARGUMENT) {
                        this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.SET_LOCAL, value.symbol.offset);
                        this.assembler.writeLEB128(value.symbol.offset);
                    }
                    else if (value.symbol.kind == symbol_1.SymbolKind.VARIABLE_INSTANCE) {
                        //FIXME
                        //this.emitStoreToMemory(byteOffset, value.symbol.resolvedType, value.dotTarget(), value.symbol.offset, node);
                    }
                }
            }
        }
        else {
            let isUnsigned = node.isUnsignedOperator();
            let left = node.binaryLeft();
            let right = node.binaryRight();
            let isFloat = left.resolvedType.isFloat() || right.resolvedType.isFloat();
            let isDouble = left.resolvedType.isDouble() || right.resolvedType.isDouble();
            let dataTypeLeft = utils_2.typeToDataType(left.resolvedType, this.bitness);
            let dataTypeRight = utils_2.typeToDataType(right.resolvedType, this.bitness);
            if (node.kind == node_1.NodeKind.ADD) {
                this.emitNode(byteOffset, left);
                if (left.resolvedType.pointerTo == null) {
                    this.emitNode(byteOffset, right);
                }
                else {
                    assert_1.assert(right.resolvedType.isInteger() || right.resolvedType.isLong() ||
                        right.resolvedType.isFloat() || right.resolvedType.isDouble());
                    let size = left.resolvedType.pointerTo.allocationSizeOf(this.context);
                    if (size == 2) {
                        if (right.kind == node_1.NodeKind.INT32) {
                            let _value = right.intValue << 1;
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, _value);
                            this.assembler.writeLEB128(_value);
                        }
                        else {
                            this.emitNode(byteOffset, right);
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, 1);
                            this.assembler.writeLEB128(1);
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_SHL);
                        }
                    }
                    else if (size == 4) {
                        if (right.kind == node_1.NodeKind.INT32) {
                            let _value = right.intValue << 2;
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, _value);
                            this.assembler.writeLEB128(_value);
                        }
                        else if (right.kind == node_1.NodeKind.FLOAT32) {
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F32_CONST, right.floatValue);
                            this.assembler.writeFloat(right.floatValue);
                        }
                        else {
                            this.emitNode(byteOffset, right);
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_CONST, 2);
                            this.assembler.writeLEB128(2);
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I32_SHL);
                        }
                    }
                    else if (size == 8) {
                        if (right.kind == node_1.NodeKind.INT64) {
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.I64_CONST, right.longValue);
                            this.assembler.writeLEB128(right.longValue);
                        }
                        else if (right.kind == node_1.NodeKind.FLOAT64) {
                            this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode.F64_CONST, right.doubleValue);
                            this.assembler.writeDouble(right.doubleValue);
                        }
                    }
                    else {
                        this.emitNode(byteOffset, right);
                    }
                }
                this.assembler.appendOpcode(byteOffset, opcode_1.WasmOpcode[`${dataTypeLeft}_ADD`]);
            }
            else if (node.kind == node_1.NodeKind.BITWISE_AND) {
                if (isFloat || isDouble) {
                    let error = "Cannot do bitwise operations on floating point number";
                    terminal_1.Terminal.error(error);
                    throw error;
                }
                this.emitBinaryExpression(byteOffset, node, opcode_1.WasmOpcode[`${dataTypeLeft}_AND`]);
            }
            else if (node.kind == node_1.NodeKind.BITWISE_OR) {
                if (isFloat || isDouble) {
                    let error = "Cannot do bitwise operations on floating point number";
                    terminal_1.Terminal.error(error);
                    throw error;
                }
                this.emitBinaryExpression(byteOffset, node, opcode_1.WasmOpcode[`${dataTypeLeft}_OR`]);
            }
            else if (node.kind == node_1.NodeKind.BITWISE_XOR) {
                this.emitBinaryExpression(byteOffset, node, opcode_1.WasmOpcode[`${dataTypeLeft}_XOR`]);
            }
            else if (node.kind == node_1.NodeKind.EQUAL) {
                this.emitBinaryExpression(byteOffset, node, opcode_1.WasmOpcode[`${dataTypeLeft}_EQ`]);
            }
            else if (node.kind == node_1.NodeKind.MULTIPLY) {
                this.emitBinaryExpression(byteOffset, node, opcode_1.WasmOpcode[`${dataTypeLeft}_MUL`]);
            }
            else if (node.kind == node_1.NodeKind.NOT_EQUAL) {
                this.emitBinaryExpression(byteOffset, node, opcode_1.WasmOpcode[`${dataTypeLeft}_NE`]);
            }
            else if (node.kind == node_1.NodeKind.SHIFT_LEFT) {
                if (isFloat || isDouble) {
                    let error = "Cannot do bitwise operations on floating point number";
                    terminal_1.Terminal.error(error);
                    throw error;
                }
                this.emitBinaryExpression(byteOffset, node, opcode_1.WasmOpcode[`${dataTypeLeft}_SHL`]);
            }
            else if (node.kind == node_1.NodeKind.SUBTRACT) {
                this.emitBinaryExpression(byteOffset, node, opcode_1.WasmOpcode[`${dataTypeLeft}_SUB`]);
            }
            else if (node.kind == node_1.NodeKind.DIVIDE) {
                let opcode = (isFloat || isDouble) ?
                    opcode_1.WasmOpcode[`${dataTypeLeft}_DIV`] :
                    (isUnsigned ? opcode_1.WasmOpcode[`${dataTypeLeft}_DIV_U`] : opcode_1.WasmOpcode[`${dataTypeLeft}_DIV_S`]);
                this.emitBinaryExpression(byteOffset, node, opcode);
            }
            else if (node.kind == node_1.NodeKind.GREATER_THAN) {
                let opcode = (isFloat || isDouble) ?
                    opcode_1.WasmOpcode[`${dataTypeLeft}_GT`] :
                    (isUnsigned ? opcode_1.WasmOpcode[`${dataTypeLeft}_GT_U`] : opcode_1.WasmOpcode[`${dataTypeLeft}_GT_S`]);
                this.emitBinaryExpression(byteOffset, node, opcode);
            }
            else if (node.kind == node_1.NodeKind.GREATER_THAN_EQUAL) {
                let opcode = (isFloat || isDouble) ?
                    opcode_1.WasmOpcode[`${dataTypeLeft}_GE`] :
                    (isUnsigned ? opcode_1.WasmOpcode[`${dataTypeLeft}_GE_U`] : opcode_1.WasmOpcode[`${dataTypeLeft}_GE_S`]);
                this.emitBinaryExpression(byteOffset, node, opcode);
            }
            else if (node.kind == node_1.NodeKind.LESS_THAN) {
                let opcode = (isFloat || isDouble) ?
                    opcode_1.WasmOpcode[`${dataTypeLeft}_LT`] :
                    (isUnsigned ? opcode_1.WasmOpcode[`${dataTypeLeft}_LT_U`] : opcode_1.WasmOpcode[`${dataTypeLeft}_LT_S`]);
                this.emitBinaryExpression(byteOffset, node, opcode);
            }
            else if (node.kind == node_1.NodeKind.LESS_THAN_EQUAL) {
                let opcode = (isFloat || isDouble) ?
                    opcode_1.WasmOpcode[`${dataTypeLeft}_LE`] :
                    (isUnsigned ? opcode_1.WasmOpcode[`${dataTypeLeft}_LE_U`] : opcode_1.WasmOpcode[`${dataTypeLeft}_LE_S`]);
                this.emitBinaryExpression(byteOffset, node, opcode);
            }
            else if (node.kind == node_1.NodeKind.REMAINDER) {
                if (isFloat || isDouble) {
                    let error = "Floating point remainder is not yet supported in WebAssembly. Please import javascript function to handle this";
                    terminal_1.Terminal.error(error);
                    throw error;
                }
                this.emitBinaryExpression(byteOffset, node, isUnsigned ?
                    opcode_1.WasmOpcode[`${dataTypeLeft}_REM_U`] : opcode_1.WasmOpcode[`${dataTypeLeft}_REM_S`]);
            }
            else if (node.kind == node_1.NodeKind.SHIFT_RIGHT) {
                if (isFloat || isDouble) {
                    let error = "Cannot do bitwise operations on floating point number";
                    terminal_1.Terminal.error(error);
                    throw error;
                }
                this.emitBinaryExpression(byteOffset, node, isUnsigned ?
                    opcode_1.WasmOpcode[`${dataTypeLeft}_SHR_U`] : opcode_1.WasmOpcode[`${dataTypeLeft}_SHR_S`]);
            }
            else {
                assert_1.assert(false);
            }
        }
        return 1;
    }
    calculateWasmFunctionIndex(index) {
        return this.assembler.module.importCount + index;
    }
    getWasmFunctionCallIndex(symbol) {
        return (symbol.node.isImport() || symbol.node.isExternalImport()) ? symbol.offset : this.assembler.module.importCount + symbol.offset;
    }
    getWasmType(type) {
        let context = this.context;
        if (type == context.booleanType || type.isClass() || type.isInteger() || (this.bitness == bitness_1.Bitness.x32 && type.isReference())) {
            return wasm_type_1.WasmType.I32;
        }
        else if (type.isLong() || (this.bitness == bitness_1.Bitness.x64 && type.isReference())) {
            return wasm_type_1.WasmType.I64;
        }
        else if (type.isDouble()) {
            return wasm_type_1.WasmType.F64;
        }
        else if (type.isFloat()) {
            return wasm_type_1.WasmType.F32;
        }
        if (type == context.voidType) {
            return wasm_type_1.WasmType.VOID;
        }
        assert_1.assert(false);
        return wasm_type_1.WasmType.VOID;
    }
}
function wasmAssignLocalVariableOffsets(fn, node, shared, bitness) {
    if (node.kind == node_1.NodeKind.VARIABLE) {
        assert_1.assert(node.symbol.kind == symbol_1.SymbolKind.VARIABLE_LOCAL);
        // node.symbol.offset = shared.nextLocalOffset;
        shared.nextLocalOffset = shared.nextLocalOffset + 1;
        shared.localCount = shared.localCount + 1;
        let local = new wasm_local_1.WasmLocal(utils_2.symbolToWasmType(node.symbol, bitness), node.symbol.internalName, node.symbol, false);
        node.symbol.offset = fn.argumentVariables.length + fn.localVariables.length;
        fn.localVariables.push(new wasm_local_1.WasmLocal(local.type, local.symbol.name));
    }
    let child = node.firstChild;
    while (child != null) {
        wasmAssignLocalVariableOffsets(fn, child, shared, bitness);
        child = child.nextSibling;
    }
}
function wasmEmit(compiler, bitness = bitness_1.Bitness.x32, optimize = true) {
    let wasmEmitter = new WasmModuleEmitter(bitness);
    wasmEmitter.context = compiler.context;
    wasmEmitter.memoryInitializer = new bytearray_1.ByteArray();
    if (compiler_1.Compiler.mallocRequired) {
        // Merge imported malloc.wasm binaries
        wasmEmitter.mergeBinaryImports();
    }
    // Emission requires two passes
    wasmEmitter.prepareToEmit(compiler.global);
    wasmEmitter.assembler.sealFunctions();
    compiler.outputWASM = wasmEmitter.assembler.module.binary.data;
    wasmEmitter.emitModule();
    if (optimize) {
        wasm_optimizer_1.WasmOptimizer.optimize(compiler.outputWASM);
    }
    compiler.outputWAST = wasmEmitter.assembler.module.text;
}
exports.wasmEmit = wasmEmit;


/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })
/******/ ]);
});
//# sourceMappingURL=turboscript.js.map