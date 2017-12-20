import {createRange, Log, Source, SourceRange} from "../../utils/log";
import {assert} from "../../utils/assert";
/**
 * Author: Nidin Vinayakan
 */
export enum Tokens {
    END_OF_FILE,
        // Literals
    CHARACTER,
    IDENTIFIER,
    INT32,
    INT64,
    FLOAT32,
    FLOAT64,
    STRING,
    ARRAY,

        // Punctuation
    ASSIGN,
    BITWISE_AND,
    BITWISE_OR,
    BITWISE_XOR,
    COLON,
    COMMA,
    COMPLEMENT,
    DIVIDE,
    DOT,
    EQUAL,
    EXPONENT,
    GREATER_THAN,
    GREATER_THAN_EQUAL,
    LEFT_BRACE,
    LEFT_BRACKET,
    LEFT_PARENTHESIS,
    LESS_THAN,
    LESS_THAN_EQUAL,
    LOGICAL_AND,
    LOGICAL_OR,
    MINUS,
    MINUS_MINUS,
    MULTIPLY,
    NOT,
    NOT_EQUAL,
    PLUS,
    PLUS_PLUS,
    QUESTION_MARK,
    REMAINDER,
    RIGHT_BRACE,
    RIGHT_BRACKET,
    RIGHT_PARENTHESIS,
    SEMICOLON,
    FROM,
    SHIFT_LEFT,
    SHIFT_RIGHT,

        // Keywords
    ALIGNOF,
    AS,
    BREAK,
    MODULE,
    CLASS,
    CONST,
    CONTINUE,
    DECLARE,
    ELSE,
    ENUM,
    EXPORT,
    EXTENDS,
    FALSE,
    FUNCTION,
    ANYFUNC,
    IF,
    IMPLEMENTS,
    IMPORT,
    LET,
    NEW,
    DELETE,
    NULL,
    UNDEFINED,
    OPERATOR,
    PRIVATE,
    PROTECTED,
    PUBLIC,
    RETURN,
    SIZEOF,
    STATIC,
    THIS,
    TRUE,
    UNSAFE,
    JAVASCRIPT,
    START,
    VIRTUAL,
    VAR,
    WHILE,
    FOR,

        // Preprocessor
    PREPROCESSOR_DEFINE,
    PREPROCESSOR_ELIF,
    PREPROCESSOR_ELSE,
    PREPROCESSOR_ENDIF,
    PREPROCESSOR_ERROR,
    PREPROCESSOR_IF,
    PREPROCESSOR_NEEDED,
    PREPROCESSOR_NEWLINE,
    PREPROCESSOR_UNDEF,
    PREPROCESSOR_WARNING,
}

export function isKeyword(kind: Tokens): boolean {
    return kind >= Tokens.ALIGNOF && kind <= Tokens.WHILE;
}

export class Token {
    kind: Tokens;
    range: SourceRange;
    next: Token;
    name: String;
    type: String;
}

export function splitToken(first: Token, firstKind: Tokens, secondKind: Tokens): void {
    var range = first.range;
    assert(range.end - range.start >= 2);

    var second = new Token();
    second.kind = secondKind;
    second.range = createRange(range.source, range.start + 1, range.end);
    second.next = first.next;

    first.kind = firstKind;
    first.next = second;
    range.end = range.start + 1;
}

export function tokenToString(token: Tokens): string {
    if (token == Tokens.END_OF_FILE) return "end of file";

    // Literals
    if (token == Tokens.CHARACTER) return "character literal";
    if (token == Tokens.IDENTIFIER) return "identifier";
    if (token == Tokens.INT32) return "integer32 literal";
    if (token == Tokens.INT64) return "integer64 literal";
    if (token == Tokens.FLOAT32) return "float32 literal";
    if (token == Tokens.FLOAT64) return "float64 literal";
    if (token == Tokens.STRING) return "string literal";
    if (token == Tokens.ARRAY) return "array literal";

    // Punctuation
    if (token == Tokens.ASSIGN) return "'='";
    if (token == Tokens.BITWISE_AND) return "'&'";
    if (token == Tokens.BITWISE_OR) return "'|'";
    if (token == Tokens.BITWISE_XOR) return "'^'";
    if (token == Tokens.COLON) return "':'";
    if (token == Tokens.COMMA) return "','";
    if (token == Tokens.COMPLEMENT) return "'~'";
    if (token == Tokens.DIVIDE) return "'/'";
    if (token == Tokens.DOT) return "'.'";
    if (token == Tokens.EQUAL) return "'=='";
    if (token == Tokens.EXPONENT) return "'**'";
    if (token == Tokens.GREATER_THAN) return "'>'";
    if (token == Tokens.GREATER_THAN_EQUAL) return "'>='";
    if (token == Tokens.LEFT_BRACE) return "'{'";
    if (token == Tokens.LEFT_BRACKET) return "'['";
    if (token == Tokens.LEFT_PARENTHESIS) return "'('";
    if (token == Tokens.LESS_THAN) return "'<'";
    if (token == Tokens.LESS_THAN_EQUAL) return "'<='";
    if (token == Tokens.LOGICAL_AND) return "'&&'";
    if (token == Tokens.LOGICAL_OR) return "'||'";
    if (token == Tokens.MINUS) return "'-'";
    if (token == Tokens.MINUS_MINUS) return "'--'";
    if (token == Tokens.MULTIPLY) return "'*'";
    if (token == Tokens.NOT) return "'!'";
    if (token == Tokens.NOT_EQUAL) return "'!='";
    if (token == Tokens.PLUS) return "'+'";
    if (token == Tokens.PLUS_PLUS) return "'++'";
    if (token == Tokens.QUESTION_MARK) return "'?'";
    if (token == Tokens.REMAINDER) return "'%'";
    if (token == Tokens.RIGHT_BRACE) return "'}'";
    if (token == Tokens.RIGHT_BRACKET) return "']'";
    if (token == Tokens.RIGHT_PARENTHESIS) return "')'";
    if (token == Tokens.SEMICOLON) return "';'";
    if (token == Tokens.SHIFT_LEFT) return "'<<'";
    if (token == Tokens.SHIFT_RIGHT) return "'>>'";

    // Keywords
    if (token == Tokens.FROM) return "'from'";
    if (token == Tokens.ALIGNOF) return "'alignof'";
    if (token == Tokens.AS) return "'as'";
    if (token == Tokens.BREAK) return "'break'";
    if (token == Tokens.MODULE) return "'namespace'";
    if (token == Tokens.CLASS) return "'class'";
    if (token == Tokens.CONST) return "'const'";
    if (token == Tokens.CONTINUE) return "'continue'";
    if (token == Tokens.DECLARE) return "'declare'";
    if (token == Tokens.ELSE) return "'else'";
    if (token == Tokens.ENUM) return "'enum'";
    if (token == Tokens.EXPORT) return "'export'";
    if (token == Tokens.EXTENDS) return "'extends'";
    if (token == Tokens.FALSE) return "'false'";
    if (token == Tokens.FUNCTION) return "'function'";
    if (token == Tokens.ANYFUNC) return "'anyfunc'";
    if (token == Tokens.IF) return "'if'";
    if (token == Tokens.IMPLEMENTS) return "'implements'";
    if (token == Tokens.IMPORT) return "'import'";
    if (token == Tokens.LET) return "'let'";
    if (token == Tokens.NEW) return "'new'";
    if (token == Tokens.DELETE) return "'delete'";
    if (token == Tokens.NULL) return "'null'";
    if (token == Tokens.UNDEFINED) return "'undefined'";
    if (token == Tokens.OPERATOR) return "'operator'";
    if (token == Tokens.PRIVATE) return "'private'";
    if (token == Tokens.PROTECTED) return "'protected'";
    if (token == Tokens.PUBLIC) return "'public'";
    if (token == Tokens.RETURN) return "'return'";
    if (token == Tokens.SIZEOF) return "'sizeof'";
    if (token == Tokens.STATIC) return "'static'";
    if (token == Tokens.THIS) return "'this'";
    if (token == Tokens.TRUE) return "'true'";
    if (token == Tokens.UNSAFE) return "'unsafe'";
    if (token == Tokens.JAVASCRIPT) return "'@JS'";
    if (token == Tokens.START) return "'@start'";
    if (token == Tokens.VIRTUAL) return "'@virtual'";
    if (token == Tokens.VAR) return "'var'";
    if (token == Tokens.WHILE) return "'while'";
    if (token == Tokens.FOR) return "'for'";

    // Preprocessor
    if (token == Tokens.PREPROCESSOR_DEFINE) return "'#define'";
    if (token == Tokens.PREPROCESSOR_ELIF) return "'#elif'";
    if (token == Tokens.PREPROCESSOR_ELSE) return "'#else'";
    if (token == Tokens.PREPROCESSOR_ENDIF) return "'#endif'";
    if (token == Tokens.PREPROCESSOR_ERROR) return "'#error'";
    if (token == Tokens.PREPROCESSOR_IF) return "'#if'";
    if (token == Tokens.PREPROCESSOR_NEWLINE) return "newline";
    if (token == Tokens.PREPROCESSOR_UNDEF) return "'#undef'";
    if (token == Tokens.PREPROCESSOR_WARNING) return "'#warning'";

    assert(false);
    return null;
}

export function isAlpha(c: string): boolean {
    return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c == '_';
}

export function isASCII(c: uint16): boolean {
    return c >= 0x20 && c <= 0x7E;
}

export function isNumber(c: string): boolean {
    return c >= '0' && c <= '9';
}

export function isDigit(c: any, base: uint8): boolean {
    if (c.trim() == "") return false;
    if (base == 16) {
        return isNumber(c) || c >= 'A' && c <= 'F' || c >= 'a' && c <= 'f';
    }
    //return c >= '0' && c < '0' + base;
    return !isNaN(c);
}

export function tokenize(source: Source, log: Log): Token {
    var first: Token = null;
    var last: Token = null;
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

        // Identifier
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
                    if (text == "as") kind = Tokens.AS;
                    else if (text == "if") kind = Tokens.IF;
                    else if (text == "or") kind = Tokens.IF;
                    else if (text == "is") kind = Tokens.EQUAL; // todo
                    else if (text == "to") kind = Tokens.FUNCTION;

                    // else if (text == "is") kind = TokenKind.ASSIGN;// todo
                }

                else if (length == 3) {
                    if (text == "let") kind = Tokens.LET;
                    else if (text == "def") kind = Tokens.FUNCTION;
                    else if (text == "new") kind = Tokens.NEW;
                    else if (text == "var") kind = Tokens.VAR;
                    else if (text == "val") kind = Tokens.VAR;
                    else if (text == "for") kind = Tokens.FOR;
                    else if (text == "and") kind = Tokens.LOGICAL_AND;
                    else if (text == "not") kind = Tokens.NOT;
                    else if (text == "nil") kind = Tokens.NULL;
                    else if (text == "nul") kind = Tokens.NULL;
                    else if (text == "@JS") kind = Tokens.JAVASCRIPT;
                }

                else if (length == 4) {
                    if (text == "else") kind = Tokens.ELSE;
                    else if (text == "enum") kind = Tokens.ENUM;
                    else if (text == "null") kind = Tokens.NULL;
                    else if (text == "Null") kind = Tokens.NULL;
                    else if (text == "none") kind = Tokens.NULL;
                    else if (text == "None") kind = Tokens.NULL;
                    else if (text == "this") kind = Tokens.THIS;
                    else if (text == "self") kind = Tokens.THIS;
                    else if (text == "True") kind = Tokens.TRUE;
                    else if (text == "true") kind = Tokens.TRUE;
                    else if (text == "from") kind = Tokens.FROM;
                }

                else if (length == 5) {
                    if (text == "break") kind = Tokens.BREAK;
                    else if (text == "class") kind = Tokens.CLASS;
                    else if (text == "const") kind = Tokens.CONST;
                    else if (text == "false") kind = Tokens.FALSE;
                    else if (text == "False") kind = Tokens.FALSE;
                    else if (text == "while") kind = Tokens.WHILE;
                }

                else if (length == 6) {
                    if (text == "export") kind = Tokens.EXPORT;
                    else if (text == "module") kind = Tokens.MODULE;
                    else if (text == "import") kind = Tokens.IMPORT;
                    else if (text == "public") kind = Tokens.PUBLIC;
                    else if (text == "return") kind = Tokens.RETURN;
                    else if (text == "sizeof") kind = Tokens.SIZEOF;
                    else if (text == "static") kind = Tokens.STATIC;
                    else if (text == "unsafe") kind = Tokens.UNSAFE;
                    else if (text == "@start") kind = Tokens.START;// ?
                    else if (text == "delete") kind = Tokens.DELETE;
                }

                else if (length == 7) {
                    if (text == "alignof") kind = Tokens.ALIGNOF;// ?
                    else if (text == "declare") kind = Tokens.DECLARE;
                    else if (text == "extends") kind = Tokens.EXTENDS;
                    else if (text == "private") kind = Tokens.PRIVATE;
                    else if (text == "anyfunc") kind = Tokens.ANYFUNC;// ?
                }

                else {
                    if (text == "continue") kind = Tokens.CONTINUE;
                    else if (text == "@virtual") kind = Tokens.VIRTUAL;
                    else if (text == "function") kind = Tokens.FUNCTION;
                    else if (text == "constant") kind = Tokens.CONST;
                    else if (text == "implements") kind = Tokens.IMPLEMENTS;
                    else if (text == "protected") kind = Tokens.PROTECTED;
                }
            }
        }

        // Integer or Float
        else if (isNumber(c)) {

            let isFloat: boolean = false;
            let isDouble: boolean = false;

            //kind = TokenKind.INT32;

            if (i < limit) {
                var next = contents[i];
                var base: uint8 = 10;

                // Handle binary, octal, and hexadecimal prefixes
                if (c == '0' && i + 1 < limit) {
                    if (next == 'b' || next == 'B') base = 2;
                    else if (next == 'o' || next == 'O') base = 8;
                    else if (next == 'x' || next == 'X') base = 16;
                    if (base != 10) {
                        if (isDigit(contents[i + 1], base)) i = i + 2;
                        else base = 10;
                    }
                }

                let floatFound: boolean = false;
                let exponentFound: boolean = false;
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
                } else {
                    kind = isFloat ? Tokens.FLOAT64 : Tokens.INT32;
                }

                // Extra letters after the end is an error
                if (i < limit && (isAlpha(contents[i]) || isNumber(contents[i]))) {
                    i = i + 1;

                    while (i < limit && (isAlpha(contents[i]) || isNumber(contents[i]))) {
                        i = i + 1;
                    }

                    log.error(createRange(source, start, i),
                        `Invalid ${isFloat ? "float" : "integer"} literal: '${contents.slice(start, i)}'`);
                    return null;
                }
            }
        }

        // Character or string
        else if (c == '"' || c == '\'' || c == '`') {
            while (i < limit) {
                var next = contents[i];

                // Escape any character including newlines
                if (i + 1 < limit && next == '\\') {
                    i = i + 2;
                }

                // Only allow newlines in template literals
                else if (next == '\n' && c != '`') {
                    break;
                }

                // Handle a normal character
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
                log.error(createRange(source, start, i),
                    c == '\'' ? "Unterminated character literal" :
                        c == '`' ? "Unterminated template literal" :
                            "Unterminated string literal");
                return null;
            }
        }

        // Operators
        else if (c == '%') kind = Tokens.REMAINDER;
        else if (c == '(') kind = Tokens.LEFT_PARENTHESIS;
        else if (c == ')') kind = Tokens.RIGHT_PARENTHESIS;
        else if (c == ',') kind = Tokens.COMMA;
        else if (c == '.') kind = Tokens.DOT;
        else if (c == ':') kind = Tokens.COLON;
        else if (c == ';') kind = Tokens.SEMICOLON;
        else if (c == '?') kind = Tokens.QUESTION_MARK;
        else if (c == '[') kind = Tokens.LEFT_BRACKET;
        else if (c == ']') kind = Tokens.RIGHT_BRACKET;
        else if (c == '^') kind = Tokens.BITWISE_XOR;
        else if (c == '{') kind = Tokens.LEFT_BRACE;
        else if (c == '}') kind = Tokens.RIGHT_BRACE;
        else if (c == '~') kind = Tokens.COMPLEMENT;

        // * or **
        else if (c == '*') {
            kind = Tokens.MULTIPLY;

            if (i < limit && contents[i] == '*') {
                kind = Tokens.EXPONENT;
                i = i + 1;
            }
        }

        // / or // or /*
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
                    log.error(createRange(source, start, start + 2), "Unterminated multi-line comment");
                    return null;
                }

                continue;
            }
        }

        // ! or !=
        else if (c == '!') {
            kind = Tokens.NOT;

            if (i < limit && contents[i] == '=') {
                kind = Tokens.NOT_EQUAL;
                i = i + 1;

                // Recover from !==
                if (i < limit && contents[i] == '=') {
                    i = i + 1;
                    log.error(createRange(source, start, i), "Use '!=' instead of '!=='");
                }
            }
        }

        // = or ==
        else if (c == '=') {
            kind = Tokens.ASSIGN;

            if (i < limit && contents[i] == '=') {
                kind = Tokens.EQUAL;
                i = i + 1;

                // Recover from ===
                if (i < limit && contents[i] == '=') {
                    i = i + 1;
                    log.error(createRange(source, start, i), "Use '==' instead of '==='");
                }
            }
        }

        // + or ++
        else if (c == '+') {
            kind = Tokens.PLUS;

            if (i < limit && contents[i] == '+') {
                kind = Tokens.PLUS_PLUS;
                i = i + 1;
            }
        }

        // - or --
        else if (c == '-') {
            kind = Tokens.MINUS;

            if (i < limit && contents[i] == '-') {
                kind = Tokens.MINUS_MINUS;
                i = i + 1;
            }
        }

        // & or &&
        else if (c == '&') {
            kind = Tokens.BITWISE_AND;

            if (i < limit && contents[i] == '&') {
                kind = Tokens.LOGICAL_AND;
                i = i + 1;
            }
        }

        // | or ||
        else if (c == '|') {
            kind = Tokens.BITWISE_OR;

            if (i < limit && contents[i] == '|') {
                kind = Tokens.LOGICAL_OR;
                i = i + 1;
            }
        }

        // < or << or <=
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

        // > or >> or >=
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

            if (text == "#define") kind = Tokens.PREPROCESSOR_DEFINE;
            else if (text == "#elif") kind = Tokens.PREPROCESSOR_ELIF;
            else if (text == "#else") kind = Tokens.PREPROCESSOR_ELSE;
            else if (text == "#endif") kind = Tokens.PREPROCESSOR_ENDIF;
            else if (text == "#error") kind = Tokens.PREPROCESSOR_ERROR;
            else if (text == "#if") kind = Tokens.PREPROCESSOR_IF;
            else if (text == "#undef") kind = Tokens.PREPROCESSOR_UNDEF;
            else if (text == "#warning") kind = Tokens.PREPROCESSOR_WARNING;

            // Allow a shebang at the start of the file
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

                // Check for #elif typos
                else if (text == "#elsif" || text == "#elseif") {
                    errorMessage += ", did you mean '#elif'?";
                    kind = Tokens.PREPROCESSOR_ELIF;
                }

                // Check for #endif typos
                else if (text == "#end") {
                    errorMessage += ", did you mean '#endif'?";
                    kind = Tokens.PREPROCESSOR_ENDIF;
                }

                log.error(createRange(source, start, i), errorMessage);
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
                    log.error(createRange(source, start, i), `Expected newline before ${tokenToString(kind)}`);
                }
            }

            needsPreprocessor = true;
            wantNewline = true;
        }

        let range = createRange(source, start, i);

        if (kind == Tokens.END_OF_FILE) {
            log.error(range, `Syntax error: '${contents.slice(start, start + 1)}'`);
            return null;
        }

        let token = new Token();
        token.kind = kind;
        token.range = range;
        token.name = range.toString();
        token.type = tokenToString(kind);

        if (first == null) first = token;
        else last.next = token;
        last = token;
    }

    let eof = new Token();
    eof.kind = Tokens.END_OF_FILE;
    eof.range = createRange(source, limit, limit);

    if (first == null) first = eof;
    else last.next = eof;
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
