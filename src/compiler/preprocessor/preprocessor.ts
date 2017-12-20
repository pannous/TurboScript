import {DiagnosticKind, Log, Source, spanRanges} from "../../utils/log";
import {Token, Tokens, tokenToString} from "../scanner/scanner";
import {Precedence} from "../parser/parser";
export enum PreprocessorValue {
    FALSE,
    TRUE,
    ERROR,
}

export class PreprocessorFlag {
    isDefined: boolean;
    name: string;
    next: PreprocessorFlag;
}

// This preprocessor implements the flag-only conditional behavior from C#.
// There are two scopes for flags: global-level and file-level. This is stored
// using an ever-growing linked list of PreprocessorFlag objects that turn a
// flag either on or off. That way file-level state can just reference the
// memory of the global-level state and the global-level state can easily be
// restored after parsing a file just by restoring the pointer.
export class Preprocessor {
    firstFlag: PreprocessorFlag;
    isDefineAndUndefAllowed: boolean;
    previous: Token;
    current: Token;
    log: Log;

    peek(kind: Tokens): boolean {
        return this.current.kind == kind;
    }

    eat(kind: Tokens): boolean {
        if (this.peek(kind)) {
            this.advance();
            return true;
        }

        return false;
    }

    advance(): void {
        if (!this.peek(Tokens.END_OF_FILE)) {
            this.previous = this.current;
            this.current = this.current.next;
        }
    }

    unexpectedToken(): void {
        this.log.error(this.current.range, `Unexpected ${tokenToString(this.current.kind)}`);
    }

    expect(kind: Tokens): boolean {
        if (!this.peek(kind)) {
            this.log.error(
                this.current.range,
                `Expected ${tokenToString(kind)} but found ${tokenToString(this.current.kind)}`
            );
            return false;
        }

        this.advance();
        return true;
    }

    removeTokensFrom(before: Token): void {
        before.next = this.current;
        this.previous = before;
    }

    isDefined(name: string): boolean {
        var flag = this.firstFlag;
        while (flag != null) {
            if (flag.name == name) {
                return flag.isDefined;
            }
            flag = flag.next;
        }
        return false;
    }

    define(name: string, isDefined: boolean): void {
        var flag = new PreprocessorFlag();
        flag.isDefined = isDefined;
        flag.name = name;
        flag.next = this.firstFlag;
        this.firstFlag = flag;
    }

    run(source: Source, log: Log): void {
        var firstToken = source.firstToken;

        if (firstToken != null && firstToken.kind == Tokens.PREPROCESSOR_NEEDED) {
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
            if (!this.peek(Tokens.END_OF_FILE)) {
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
    scan(isParentLive: boolean): boolean {
        while (!this.peek(Tokens.END_OF_FILE) &&
        !this.peek(Tokens.PREPROCESSOR_ELIF) &&
        !this.peek(Tokens.PREPROCESSOR_ELSE) &&
        !this.peek(Tokens.PREPROCESSOR_ENDIF)) {
            var previous = this.previous;
            var current = this.current;

            // #define or #undef
            if (this.eat(Tokens.PREPROCESSOR_DEFINE) || this.eat(Tokens.PREPROCESSOR_UNDEF)) {
                // Only process the directive if control flow is live at this point
                if (this.expect(Tokens.IDENTIFIER) && isParentLive) {
                    this.define(this.previous.range.toString(), current.kind == Tokens.PREPROCESSOR_DEFINE);
                }

                // Help out people trying to use this like C
                if (this.eat(Tokens.FALSE) || this.eat(Tokens.INT32) && this.previous.range.toString() == "0") {
                    this.log.error(this.previous.range, "Use '#undef' to turn a preprocessor flag off");
                }

                // Scan up to the next newline
                if (!this.peek(Tokens.END_OF_FILE) && !this.expect(Tokens.PREPROCESSOR_NEWLINE)) {
                    while (!this.eat(Tokens.PREPROCESSOR_NEWLINE) && !this.eat(Tokens.END_OF_FILE)) {
                        this.advance();
                    }
                }

                // These statements are only valid at the top of the file
                if (!this.isDefineAndUndefAllowed) {
                    this.log.error(spanRanges(current.range, this.previous.range),
                        "All '#define' and '#undef' directives must be at the top of the file");
                }

                // Remove all of these tokens
                this.removeTokensFrom(previous);
            }

            // #warning or #error
            else if (this.eat(Tokens.PREPROCESSOR_WARNING) || this.eat(Tokens.PREPROCESSOR_ERROR)) {
                var next = this.current;

                // Scan up to the next newline
                while (!this.peek(Tokens.PREPROCESSOR_NEWLINE) && !this.peek(Tokens.END_OF_FILE)) {
                    this.advance();
                }

                // Only process the directive if control flow is live at this point
                if (isParentLive) {
                    var range = this.current == next ? current.range : spanRanges(next.range, this.previous.range);
                    this.log.append(range, range.toString(), current.kind == Tokens.PREPROCESSOR_WARNING ? DiagnosticKind.WARNING : DiagnosticKind.ERROR);
                }

                // Remove all of these tokens
                this.eat(Tokens.PREPROCESSOR_NEWLINE);
                this.removeTokensFrom(previous);
            }

            // #if
            else if (this.eat(Tokens.PREPROCESSOR_IF)) {
                var isLive = isParentLive;

                // Scan over the entire if-else chain
                while (true) {
                    var condition = this.parseExpression(Precedence.LOWEST);

                    // Reject if the condition is missing
                    if (condition == PreprocessorValue.ERROR || !this.expect(Tokens.PREPROCESSOR_NEWLINE)) {
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

                    // Keep these tokens but remove all subsequent branches
                    else {
                        isLive = false;
                    }

                    // Update the previous pointer so we remove from here next
                    previous = this.previous;

                    // #elif
                    if (this.eat(Tokens.PREPROCESSOR_ELIF)) {
                        continue;
                    }

                    // #else
                    if (this.eat(Tokens.PREPROCESSOR_ELSE)) {
                        if (!this.expect(Tokens.PREPROCESSOR_NEWLINE)) {
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
                if (!this.expect(Tokens.PREPROCESSOR_ENDIF) || !this.peek(Tokens.END_OF_FILE) && !this.expect(Tokens.PREPROCESSOR_NEWLINE)) {
                    return false;
                }
                this.removeTokensFrom(previous);
            }

            // Skip normal tokens
            else {
                this.isDefineAndUndefAllowed = false;
                this.advance();
            }
        }

        return true;
    }

    parsePrefix(): PreprocessorValue {
        var isDefinedOperator = false;
        var start = this.current;

        // true or false
        if (this.eat(Tokens.TRUE)) return PreprocessorValue.TRUE;
        if (this.eat(Tokens.FALSE)) return PreprocessorValue.FALSE;

        // Identifier
        if (this.eat(Tokens.IDENTIFIER)) {
            var name = this.previous.range.toString();

            // Recover from a C-style define operator
            if (this.peek(Tokens.LEFT_PARENTHESIS) && name == "defined") {
                isDefinedOperator = true;
            }

            else {
                var isTrue = this.isDefined(name);
                return isTrue ? PreprocessorValue.TRUE : PreprocessorValue.FALSE;
            }
        }

        // !
        if (this.eat(Tokens.NOT)) {
            var value = this.parseExpression(Precedence.UNARY_PREFIX);
            if (value == PreprocessorValue.ERROR) return PreprocessorValue.ERROR;
            return value == PreprocessorValue.TRUE ? PreprocessorValue.FALSE : PreprocessorValue.TRUE;
        }

        // Group
        if (this.eat(Tokens.LEFT_PARENTHESIS)) {
            let first = this.current;
            let value = this.parseExpression(Precedence.LOWEST);
            if (value == PreprocessorValue.ERROR || !this.expect(Tokens.RIGHT_PARENTHESIS)) {
                return PreprocessorValue.ERROR;
            }

            // Recover from a C-style define operator
            if (isDefinedOperator) {
                let errorMessage = "There is no 'defined' operator";
                if (first.kind == Tokens.IDENTIFIER && this.previous == first.next) {
                    errorMessage += " (just use '" + first.range.toString() + "' instead)";
                }
                this.log.error(spanRanges(start.range, this.previous.range), errorMessage);
            }

            return value;
        }

        // Recover from a C-style boolean
        if (this.eat(Tokens.INT32)) {
            let isTrue = this.previous.range.toString() != "0";
            this.log.error(
                this.previous.range,
                `Unexpected integer (did you mean ' ${isTrue ? "true" : "false"}')?`
            );
            return isTrue ? PreprocessorValue.TRUE : PreprocessorValue.FALSE;
        }

        this.unexpectedToken();
        return PreprocessorValue.ERROR;
    }

    parseInfix(precedence: Precedence, left: PreprocessorValue): PreprocessorValue {
        var operator = this.current.kind;

        // == or !=
        if (precedence < Precedence.EQUAL && (this.eat(Tokens.EQUAL) || this.eat(Tokens.NOT_EQUAL))) {
            var right = this.parseExpression(Precedence.EQUAL);
            if (right == PreprocessorValue.ERROR) return PreprocessorValue.ERROR;
            return (operator == Tokens.EQUAL) == (left == right) ? PreprocessorValue.TRUE : PreprocessorValue.FALSE;
        }

        // &&
        if (precedence < Precedence.LOGICAL_AND && this.eat(Tokens.LOGICAL_AND)) {
            var right = this.parseExpression(Precedence.LOGICAL_AND);
            if (right == PreprocessorValue.ERROR) return PreprocessorValue.ERROR;
            return (left == PreprocessorValue.TRUE && right == PreprocessorValue.TRUE) ? PreprocessorValue.TRUE : PreprocessorValue.FALSE;
        }

        // ||
        if (precedence < Precedence.LOGICAL_OR && this.eat(Tokens.LOGICAL_OR)) {
            var right = this.parseExpression(Precedence.LOGICAL_OR);
            if (right == PreprocessorValue.ERROR) return PreprocessorValue.ERROR;
            return (left == PreprocessorValue.TRUE || right == PreprocessorValue.TRUE) ? PreprocessorValue.TRUE : PreprocessorValue.FALSE;
        }

        // Hook
        if (precedence == Precedence.LOWEST && this.eat(Tokens.QUESTION_MARK)) {
            var middle = this.parseExpression(Precedence.LOWEST);
            if (middle == PreprocessorValue.ERROR || !this.expect(Tokens.COLON)) {
                return PreprocessorValue.ERROR;
            }

            var right = this.parseExpression(Precedence.LOWEST);
            if (right == PreprocessorValue.ERROR) {
                return PreprocessorValue.ERROR;
            }

            return left == PreprocessorValue.TRUE ? middle : right;
        }

        return left;
    }

    parseExpression(precedence: Precedence): PreprocessorValue {
        // Prefix
        var value = this.parsePrefix();
        if (value == PreprocessorValue.ERROR) {
            return PreprocessorValue.ERROR;
        }

        // Infix
        while (true) {
            var current = this.current;
            value = this.parseInfix(precedence, value);
            if (value == PreprocessorValue.ERROR) return PreprocessorValue.ERROR;
            if (this.current == current) break;
        }

        return value;
    }
}
