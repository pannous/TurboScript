import {isKeyword, splitToken, Token, Tokens, tokenToString} from "../scanner/scanner";
import {createRange, Log, SourceRange, spanRanges} from "../../utils/log";
import {
	allFlags,
	appendFlag,
	createAlignOf,
	createAny,
	createBinary,
	createBlock,
	createboolean,
	createCall,
	createCast,
	createClass,
	createConstants,
	createDelete,
	createDot,
	createDouble,
	createEmpty,
	createEnum,
	createExpression,
	createExtends,
	createFloat,
	createFor,
    createFunction,
	createHook,
	createIf,
	createImplements,
	createImport,
	createImportFrom,
	createImports,
	createIndex,
	createInt,
	createModule,
	createName,
	createNew,
	createNull,
	createParameter,
	createParameters,
	createParseError,
	createReturn,
	createSizeOf,
	createString,
	createThis,
	createUnary,
	createUndefined,
	createVariable,
	createVariables,
	createWhile,
	isUnary,
	Node,
	NODE_FLAG,
	NodeFlag,
	NodeKind,
} from "../core/node";
import {assert} from "../../utils/assert";
import {Terminal} from "../../utils/terminal";

export enum Precedence {
    LOWEST,
    ASSIGN,
    LOGICAL_OR,
    LOGICAL_AND,
    BITWISE_OR,
    BITWISE_XOR,
    BITWISE_AND,
    EQUAL,
    COMPARE,
    SHIFT,
    ADD,
    MULTIPLY,
    EXPONENT,
    UNARY_PREFIX,
    UNARY_POSTFIX,
    MEMBER,
}

function isRightAssociative(precedence: Precedence): boolean {
    return precedence == Precedence.ASSIGN || precedence == Precedence.EXPONENT;
}

enum ParseKind {
    EXPRESSION,
    TYPE,
}

enum StatementMode {
    NORMAL,
    FILE,
    UNTERMINATED,
}

class ParserContext {
    previous: Token;
    current: Token;
    log: Log;

    // This is used to suppress subsequent errors for the same token
    lastError: Token;

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
        if (this.lastError != this.current) {
            this.lastError = this.current;
            this.log.error(this.current.range, `Unexpected ${tokenToString(this.current.kind)}`);
        }
    }

    expect(kind: Tokens): boolean {
        var a=Tokens.LEFT_BRACE;
        if (!this.peek(kind)) {
            if(kind==Tokens.SEMICOLON)return true;// optional semicolon
	        if(kind==Tokens.COLON)return true; // optional COLON
	        // if(kind==Tokens.LEFT_BRACE)return true; // optional braces
	        if(kind==Tokens.RIGHT_BRACE)return true; // optional braces
	        if(kind==Tokens.LEFT_PARENTHESIS)return true; // optional braces
	        if(kind==Tokens.RIGHT_PARENTHESIS)return true; // optional braces
            if (this.lastError != this.current) {
                this.lastError = this.current;

                let previousLine = this.previous.range.enclosingLine();
                let currentLine = this.current.range.enclosingLine();

                // Show missing token errors on the previous line for clarity
                if (kind != Tokens.IDENTIFIER && !previousLine.equals(currentLine)) {
                    this.log.error(previousLine.rangeAtEnd(), `Expected ${tokenToString(kind)}`);
                }

                else {
                    this.log.error(this.current.range,
                        `Expected ${tokenToString(kind)} but found ${tokenToString(this.current.kind)}`);
                }
            }

            return false;
        }

        this.advance();
        return true;
    }

    parseUnaryPrefix(kind: NodeKind, mode: ParseKind): Node {
        assert(isUnary(kind));

        let token = this.current;
        this.advance();

        let value = this.parseExpression(Precedence.UNARY_PREFIX, mode);
        if (value == null) {
            return null;
        }

        return createUnary(kind, value).withRange(spanRanges(token.range, value.range)).withInternalRange(token.range);
    }

    parseBinary(kind: NodeKind, left: Node, localPrecedence: Precedence, operatorPrecedence: Precedence): Node {
        if (localPrecedence >= operatorPrecedence) {
            return left;
        }

        let token = this.current;
        this.advance();

        // Reduce the precedence for right-associative operators
        let precedence = isRightAssociative(operatorPrecedence) ? (operatorPrecedence - 1) as Precedence : operatorPrecedence;
        let right = this.parseExpression(precedence, ParseKind.EXPRESSION);

        if (right == null) {
            return null;
        }

        return createBinary(kind, left, right).withRange(spanRanges(left.range, right.range)).withInternalRange(token.range);
    }

    parseUnaryPostfix(kind: NodeKind, value: Node, localPrecedence: Precedence): Node {
        if (localPrecedence >= Precedence.UNARY_POSTFIX) {
            return value;
        }

        let token = this.current;
        this.advance();
        return createUnary(kind, value).withRange(spanRanges(value.range, token.range)).withInternalRange(token.range);
    }

    parseQuotedString(range: SourceRange): string {
        assert(range.end - range.start >= 2);
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

                if (c == '0') quotedString += '\0';
                else if (c == 't') quotedString += '\t';
                else if (c == 'n') quotedString += '\n';
                else if (c == 'r') quotedString += '\r';
                else if (c == '"' || c == '\'' || c == '`' || c == '\n' || c == '\\') start = end;
                else {
                    let escape = createRange(range.source, range.start + end - 1, range.start + end + 1);
                    this.log.error(escape, `Invalid escape code '${escape.toString()}'`);
                    return null;
                }
            }

            end = end + 1;
        }

        return quotedString + text.slice(start, end);
    }

    parsePrefix(mode: ParseKind): Node {
        let token = this.current;

        if (this.peek(Tokens.IDENTIFIER)) {
            this.advance();
            return createName(token.range.toString()).withRange(token.range);
        }

        // if (this.peek(TokenKind.ARRAY)) {
        //     this.advance();
        //     return createArray(token.range.toString()).withRange(token.range);
        // }

        if (this.peek(Tokens.EXPONENT)) {
            splitToken(this.current, Tokens.MULTIPLY, Tokens.MULTIPLY);
        }

        if (this.peek(Tokens.MULTIPLY)) {
            return this.parseUnaryPrefix(mode == ParseKind.TYPE ? NodeKind.POINTER_TYPE : NodeKind.DEREFERENCE, mode);
        }

        if (mode == ParseKind.EXPRESSION) {
            if (this.eat(Tokens.NULL)) {
                return createNull().withRange(token.range);
            }
            if (this.eat(Tokens.UNDEFINED)) {
                return createUndefined().withRange(token.range);
            }

            if (this.eat(Tokens.THIS)) {
                return createThis().withRange(token.range);
            }

            if (this.peek(Tokens.CHARACTER)) {
                let text = this.parseQuotedString(token.range);
                if (text == null) {
                    return null;
                }
                this.advance();
                if (text.length != 1) {
                    this.log.error(token.range, "Invalid character literal (strings use double quotes)");
                    return createParseError().withRange(token.range);
                }
                return createInt(text.charCodeAt(0)).withRange(token.range);
            }

            if (this.peek(Tokens.STRING)) {
                let text = this.parseQuotedString(token.range);
                if (text == null) {
                    return null;
                }
                this.advance();
                return createString(text).withRange(token.range);
            }

            if (this.peek(Tokens.INT32)) {
                let value = createInt(0);
                if (!this.parseInt(token.range, value)) {
                    value = createParseError();
                }
                this.advance();
                return value.withRange(token.range);
            }

            if (this.peek(Tokens.FLOAT32)) {
                let value = createFloat(0);
                if (!this.parseFloat(token.range, value)) {
                    value = createParseError();
                }
                this.advance();
                return value.withRange(token.range);
            }

            if (this.peek(Tokens.FLOAT64)) {
                let value = createDouble(0);
                if (!this.parseDouble(token.range, value)) {
                    value = createParseError();
                }
                this.advance();
                return value.withRange(token.range);
            }

            if (this.eat(Tokens.TRUE)) {
                return createboolean(true).withRange(token.range);
            }

            if (this.eat(Tokens.FALSE)) {
                return createboolean(false).withRange(token.range);
            }

            if (this.eat(Tokens.NEW)) {
                let type = this.parseType();
                if (type == null) {
                    return null;
                }

                if (this.peek(Tokens.LESS_THAN)) {
                    let parameters = this.parseParameters();
                    if (parameters == null) {
                        return null;
                    }
                    type.appendChild(parameters);
                }

                return this.parseArgumentList(token.range, createNew(type));
            }

            if (this.eat(Tokens.ALIGNOF)) {
                if (!this.expect(Tokens.LEFT_PARENTHESIS)) {
                    return null;
                }
                let type = this.parseType();
                let close = this.current;
                if (type == null || !this.expect(Tokens.RIGHT_PARENTHESIS)) {
                    return null;
                }
                return createAlignOf(type).withRange(spanRanges(token.range, close.range));
            }

            if (this.eat(Tokens.SIZEOF)) {
                if (!this.expect(Tokens.LEFT_PARENTHESIS)) {
                    return null;
                }
                let type = this.parseType();
                let close = this.current;
                if (type == null || !this.expect(Tokens.RIGHT_PARENTHESIS)) {
                    return null;
                }
                return createSizeOf(type).withRange(spanRanges(token.range, close.range));
            }

            if (this.eat(Tokens.LEFT_PARENTHESIS)) {
                let value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
                let close = this.current;
                if (value == null || !this.expect(Tokens.RIGHT_PARENTHESIS)) {
                    return null;
                }
                return value.withRange(spanRanges(token.range, close.range));
            }

            // Unary prefix
            if (this.peek(Tokens.BITWISE_AND)) return this.parseUnaryPrefix(NodeKind.ADDRESS_OF, ParseKind.EXPRESSION);
            if (this.peek(Tokens.COMPLEMENT)) return this.parseUnaryPrefix(NodeKind.COMPLEMENT, ParseKind.EXPRESSION);
            if (this.peek(Tokens.MINUS)) return this.parseUnaryPrefix(NodeKind.NEGATIVE, ParseKind.EXPRESSION);
            if (this.peek(Tokens.MINUS_MINUS)) return this.parseUnaryPrefix(NodeKind.PREFIX_DECREMENT, ParseKind.EXPRESSION);
            if (this.peek(Tokens.NOT)) return this.parseUnaryPrefix(NodeKind.NOT, ParseKind.EXPRESSION);
            if (this.peek(Tokens.PLUS)) return this.parseUnaryPrefix(NodeKind.POSITIVE, ParseKind.EXPRESSION);
            if (this.peek(Tokens.PLUS_PLUS)) return this.parseUnaryPrefix(NodeKind.PREFIX_INCREMENT, ParseKind.EXPRESSION);
        }


        if (this.peek(Tokens.LEFT_BRACE)) {
            Terminal.write("Check if its JS");
        }

        this.unexpectedToken();
        return null;
    }

    parseInfix(precedence: Precedence, current_node: Node, mode: ParseKind): Node {
        let token = this.current.range;

        // Dot
        if (this.peek(Tokens.DOT) && precedence < Precedence.MEMBER) {
            this.advance();

            let name = this.current;
            let range = name.range;

            // Allow contextual keywords
            if (isKeyword(name.kind)) {
                this.advance();
            }

            // Recover from a missing identifier
            else if (!this.expect(Tokens.IDENTIFIER)) {
                range = createRange(range.source, token.end, token.end);
            }

            return createDot(current_node, range.toString()).withRange(spanRanges(current_node.range, range)).withInternalRange(range);
        }

        if (mode == ParseKind.EXPRESSION) {
            // Binary
            if (this.peek(Tokens.ASSIGN)) return this.parseBinary(NodeKind.ASSIGN, current_node, precedence, Precedence.ASSIGN);
            if (this.peek(Tokens.BITWISE_AND)) return this.parseBinary(NodeKind.BITWISE_AND, current_node, precedence, Precedence.BITWISE_AND);
            if (this.peek(Tokens.BITWISE_OR)) return this.parseBinary(NodeKind.BITWISE_OR, current_node, precedence, Precedence.BITWISE_OR);
            if (this.peek(Tokens.BITWISE_XOR)) return this.parseBinary(NodeKind.BITWISE_XOR, current_node, precedence, Precedence.BITWISE_XOR);
            if (this.peek(Tokens.DIVIDE)) return this.parseBinary(NodeKind.DIVIDE, current_node, precedence, Precedence.MULTIPLY);
            if (this.peek(Tokens.EQUAL)) return this.parseBinary(NodeKind.EQUAL, current_node, precedence, Precedence.EQUAL);
            if (this.peek(Tokens.EXPONENT)) return this.parseBinary(NodeKind.EXPONENT, current_node, precedence, Precedence.EXPONENT);
            if (this.peek(Tokens.GREATER_THAN)) return this.parseBinary(NodeKind.GREATER_THAN, current_node, precedence, Precedence.COMPARE);
            if (this.peek(Tokens.GREATER_THAN_EQUAL)) return this.parseBinary(NodeKind.GREATER_THAN_EQUAL, current_node, precedence, Precedence.COMPARE);
            if (this.peek(Tokens.LESS_THAN)) return this.parseBinary(NodeKind.LESS_THAN, current_node, precedence, Precedence.COMPARE);
            if (this.peek(Tokens.LESS_THAN_EQUAL)) return this.parseBinary(NodeKind.LESS_THAN_EQUAL, current_node, precedence, Precedence.COMPARE);
            if (this.peek(Tokens.LOGICAL_AND)) return this.parseBinary(NodeKind.LOGICAL_AND, current_node, precedence, Precedence.LOGICAL_AND);
            if (this.peek(Tokens.LOGICAL_OR)) return this.parseBinary(NodeKind.LOGICAL_OR, current_node, precedence, Precedence.LOGICAL_OR);
            if (this.peek(Tokens.MINUS)) return this.parseBinary(NodeKind.SUBTRACT, current_node, precedence, Precedence.ADD);
            if (this.peek(Tokens.MULTIPLY)) return this.parseBinary(NodeKind.MULTIPLY, current_node, precedence, Precedence.MULTIPLY);
            if (this.peek(Tokens.NOT_EQUAL)) return this.parseBinary(NodeKind.NOT_EQUAL, current_node, precedence, Precedence.EQUAL);
            if (this.peek(Tokens.PLUS)) return this.parseBinary(NodeKind.ADD, current_node, precedence, Precedence.ADD);
            if (this.peek(Tokens.REMAINDER)) return this.parseBinary(NodeKind.REMAINDER, current_node, precedence, Precedence.MULTIPLY);
            if (this.peek(Tokens.SHIFT_LEFT)) return this.parseBinary(NodeKind.SHIFT_LEFT, current_node, precedence, Precedence.SHIFT);
            if (this.peek(Tokens.SHIFT_RIGHT)) return this.parseBinary(NodeKind.SHIFT_RIGHT, current_node, precedence, Precedence.SHIFT);

            // Unary postfix
            if (this.peek(Tokens.PLUS_PLUS)) return this.parseUnaryPostfix(NodeKind.POSTFIX_INCREMENT, current_node, precedence);
            if (this.peek(Tokens.MINUS_MINUS)) return this.parseUnaryPostfix(NodeKind.POSTFIX_DECREMENT, current_node, precedence);

            // Cast
            if (this.peek(Tokens.AS) && precedence < Precedence.UNARY_PREFIX) {
                this.advance();

                let type = this.parseType();
                if (type == null) {
                    return null;
                }

                return createCast(current_node, type).withRange(spanRanges(current_node.range, type.range)).withInternalRange(token);
            }

            // Call or index
            let isIndex = this.peek(Tokens.LEFT_BRACKET);
            if ((isIndex || this.peek(Tokens.LEFT_PARENTHESIS)) && precedence < Precedence.UNARY_POSTFIX) {
                return this.parseArgumentList(current_node.range, isIndex ? createIndex(current_node) : createCall(current_node));
            }

            // Hook
            if (this.peek(Tokens.QUESTION_MARK) && precedence < Precedence.ASSIGN) {
                this.advance();

                let middle = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
                if (middle == null || !this.expect(Tokens.COLON)) {
                    return null;
                }

                let right = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
                if (right == null) {
                    return null;
                }

                return createHook(current_node, middle, right).withRange(spanRanges(current_node.range, right.range));
            }
        }

        return current_node;
    }

    parseDelete(): Node {
        let token = this.current;
        assert(token.kind == Tokens.DELETE);
        this.advance();

        let value: Node = null;
        if (!this.peek(Tokens.SEMICOLON)) {
            value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
            if (value == null) {
                return null;
            }
        }

        let semicolon = this.current;
        this.expect(Tokens.SEMICOLON);
        return createDelete(value).withRange(spanRanges(token.range, semicolon.range));
    }

    parseArgumentList(start: SourceRange, node: Node): Node {
        let open = this.current.range;
        let isIndex = node.kind == NodeKind.INDEX;
        let left = isIndex ? Tokens.LEFT_BRACKET : Tokens.LEFT_PARENTHESIS;
        let right = isIndex ? Tokens.RIGHT_BRACKET : Tokens.RIGHT_PARENTHESIS;

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

                if (!this.eat(Tokens.COMMA)) {
                    break;
                }
            }
        }

        let close = this.current.range;
        if (!this.expect(right)) {
            return null;
        }

        return node.withRange(spanRanges(start, close)).withInternalRange(spanRanges(open, close));
    }

    parseExpression(precedence: Precedence, mode: ParseKind): Node {
        // Prefix
        let node = this.parsePrefix(mode);
        if (node == null) {
            return null;
        }
        assert(node.range != null);

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
            assert(node.range != null);
        }

        return node;
    }

    parseType(): Node {
        return this.parseExpression(Precedence.UNARY_POSTFIX, ParseKind.TYPE);
    }

    parseIf(): Node {
        let token = this.current;
        assert(token.kind == Tokens.IF);
        this.advance();

        if (!this.expect(Tokens.LEFT_PARENTHESIS)) {
            return null;
        }

        let value: Node;

        // Recover from a missing value
        if (this.peek(Tokens.RIGHT_PARENTHESIS)) {
            this.unexpectedToken();
            this.advance();
            value = createParseError();
        }

        else {
            value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
            if (value == null || !this.expect(Tokens.RIGHT_PARENTHESIS)) {
                return null;
            }
        }

        let trueBranch = this.parseBody();
        if (trueBranch == null) {
            return null;
        }

        let falseBranch: Node = null;
        if (this.eat(Tokens.ELSE)) {
            falseBranch = this.parseBody();
            if (falseBranch == null) {
                return null;
            }
        }

        return createIf(value, trueBranch, falseBranch).withRange(spanRanges(
            token.range, (falseBranch != null ? falseBranch : trueBranch).range));
    }

    parseWhile(): Node {
        let token = this.current;
        assert(token.kind == Tokens.WHILE);
        this.advance();

        if (!this.expect(Tokens.LEFT_PARENTHESIS)) {
            return null;
        }

        let value: Node;

        // Recover from a missing value
        if (this.peek(Tokens.RIGHT_PARENTHESIS)) {
            this.unexpectedToken();
            this.advance();
            value = createParseError();
        }

        else {
            value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
            if (value == null || !this.expect(Tokens.RIGHT_PARENTHESIS)) {
                return null;
            }
        }

        let body = this.parseBody();
        if (body == null) {
            return null;
        }

        return createWhile(value, body).withRange(spanRanges(token.range, body.range));
    }

    parseFor(): Node {
        let token = this.current;
        assert(token.kind == Tokens.FOR);
        this.advance();

        if (!this.expect(Tokens.LEFT_PARENTHESIS)) {
            return null;
        }

        let initializationStmt: Node = this.parseStatement(StatementMode.NORMAL);
        let terminationStmt: Node = this.parseStatement(StatementMode.NORMAL);
        let updateStmts: Node = new Node();
        updateStmts.kind = NodeKind.EXPRESSIONS;
        let updateStmt: Node = this.parseStatement(StatementMode.UNTERMINATED);

        while (updateStmt !== null) {
            updateStmts.appendChild(updateStmt);
            if (!this.eat(Tokens.COMMA)) {
                updateStmt = null;
                break;
            }
            updateStmt = this.parseStatement(StatementMode.UNTERMINATED);
        }

        if (!this.expect(Tokens.RIGHT_PARENTHESIS)) {
            this.unexpectedToken();
            this.advance();
            return createParseError();
        }

        let body = this.parseBody();
        if (body == null) {
            return null;
        }

        return createFor(initializationStmt, terminationStmt, updateStmts, body).withRange(spanRanges(token.range, body.range));
    }

    parseBody(): Node {
        let node = this.parseStatement(StatementMode.NORMAL);
        if (node == null) {
            return null;
        }

        if (node.kind == NodeKind.BLOCK) {
            return node;
        }

        let block = createBlock();
        block.appendChild(node);
        return block.withRange(node.range);
    }

    parseBlock(): Node {
        let open = this.current;
        if (!this.expect(Tokens.LEFT_BRACE)) {
            return null;
        }

        let block = createBlock();
        if (!this.parseStatements(block)) {
            return null;
        }

        let close = this.current;
        if (!this.expect(Tokens.RIGHT_BRACE)) {
            return null;
        }

        return block.withRange(spanRanges(open.range, close.range));
    }

    // parseObject():Node {
    //
    // }

    parseReturn(): Node {
        let token = this.current;
        assert(token.kind == Tokens.RETURN);
        this.advance();

        let value: Node = null;
        if (!this.peek(Tokens.SEMICOLON)) {
            value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
            if (value == null) {
                return null;
            }
        }

        let semicolon = this.current;
        this.expect(Tokens.SEMICOLON);
        return createReturn(value).withRange(spanRanges(token.range, semicolon.range));
    }

    parseEmpty(): Node {
        let token = this.current;
        this.advance();
        return createEmpty().withRange(token.range);
    }

    parseEnum(firstFlag: NodeFlag): Node {
        let token = this.current;
        assert(token.kind == Tokens.ENUM);
        this.advance();

        let name = this.current;
        if (!this.expect(Tokens.IDENTIFIER) || !this.expect(Tokens.LEFT_BRACE)) {
            return null;
        }

        let text = name.range.toString();
        let node = createEnum(text);
        node.firstFlag = firstFlag;
        node.flags = allFlags(firstFlag);

        while (!this.peek(Tokens.END_OF_FILE) && !this.peek(Tokens.RIGHT_BRACE)) {
            let member = this.current.range;
            let value: Node = null;

            if (!this.expect(Tokens.IDENTIFIER)) {
                return null;
            }

            if (this.eat(Tokens.ASSIGN)) {
                value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
                if (value == null) {
                    return null;
                }
            }

            let variable = createVariable(member.toString(), createName(text), value);
            node.appendChild(variable.withRange(value != null ? spanRanges(member, value.range) : member).withInternalRange(member));

            // Recover from a terminating semicolon
            if (this.peek(Tokens.SEMICOLON)) {
                this.expect(Tokens.COMMA);
                this.advance();
            }

            // Recover from a missing comma
            else if (this.peek(Tokens.IDENTIFIER)) {
                this.expect(Tokens.COMMA);
            }

            else if (!this.eat(Tokens.COMMA)) {
                break;
            }
        }

        let close = this.current;
        if (!this.expect(Tokens.RIGHT_BRACE)) {
            return null;
        }

        return node.withRange(spanRanges(token.range, close.range)).withInternalRange(name.range);
    }

    parseParameters(): Node {
        let node = createParameters();
        let open = this.current;
        let close: Token;

        assert(open.kind == Tokens.LESS_THAN);
        this.advance();

        while (true) {
            let name = this.current;
            if (!this.expect(Tokens.IDENTIFIER)) {
                close = this.current;
                if (this.eat(Tokens.GREATER_THAN)) {
                    break;
                }
                return null;
            }
            node.appendChild(createParameter(name.range.toString()).withRange(name.range));

            if (!this.eat(Tokens.COMMA)) {
                close = this.current;
                if (!this.expect(Tokens.GREATER_THAN)) {
                    return null;
                }
                break;
            }
        }

        return node.withRange(spanRanges(open.range, close.range));
    }

    parseImports(): Node {
        let token = this.current;
        assert(token.kind == Tokens.IMPORT);
        this.advance();

        let node = createImports();
        node.flags = node.flags | Tokens.IMPORT;

        if (this.peek(Tokens.MULTIPLY)) { //check for wildcard '*' import

            this.log.error(this.current.range, "wildcard '*' import not supported");

            assert(this.eat(Tokens.MULTIPLY));
            assert(this.eat(Tokens.AS));

            let importName = this.current;
            let range = importName.range;
            let _import = createImport(importName.range.toString());
            node.appendChild(_import.withRange(range).withInternalRange(importName.range));
            this.advance();
        }
        else {

            if (!this.expect(Tokens.LEFT_BRACE)) {
                return null;
            }
            while (!this.peek(Tokens.END_OF_FILE) && !this.peek(Tokens.RIGHT_BRACE)) {

                let importName = this.current;
                let range = importName.range;
                let _import = createImport(importName.range.toString());
                node.appendChild(_import.withRange(range).withInternalRange(importName.range));
                this.advance();

                if (!this.eat(Tokens.COMMA)) {
                    break;
                }
            }

            // this.advance();
            // assert(this.expect(TokenKind.RIGHT_BRACE));
            this.expect(Tokens.RIGHT_BRACE);
        }

        this.expect(Tokens.FROM);
        let importFrom = this.current;
        let _from = createImportFrom(importFrom.range.toString());
        node.appendChild(_from.withRange(importFrom.range).withInternalRange(importFrom.range));
        this.advance();
        let semicolon = this.current;
        this.expect(Tokens.SEMICOLON);
        return node.withRange(spanRanges(token.range, semicolon.range));
    }

    parseModule(firstFlag: NodeFlag): Node {
        let token = this.current;
        assert(token.kind == Tokens.MODULE);
        this.advance();

        let name = this.current;
        if (!this.expect(Tokens.IDENTIFIER)) {
            return null;
        }

        let node = createModule(name.range.toString());
        node.firstFlag = firstFlag;
        node.flags = allFlags(firstFlag);

        // Type parameters
        if (this.peek(Tokens.LESS_THAN)) {
            let parameters = this.parseParameters();
            if (parameters == null) {
                return null;
            }
            node.appendChild(parameters);
        }

        if (!this.expect(Tokens.LEFT_BRACE)) {
            return null;
        }

        while (!this.peek(Tokens.END_OF_FILE) && !this.peek(Tokens.RIGHT_BRACE)) {
            let childFlags = this.parseFlags();
            let childName = this.current;
            let oldKind = childName.kind;

            // Support contextual keywords
            if (isKeyword(childName.kind)) {
                childName.kind = Tokens.IDENTIFIER;
                this.advance();
            }

            // The identifier must come first without any keyword
            if (!this.expect(Tokens.IDENTIFIER)) {
                return null;
            }

            let text = childName.range.toString();

            // Support operator definitions
            if (text == "operator" && !this.peek(Tokens.LEFT_PARENTHESIS) && !this.peek(Tokens.IDENTIFIER)) {
                childName.kind = Tokens.OPERATOR;
                this.current = childName;
                if (this.parseFunction(childFlags, node) == null) {
                    return null;
                }
                continue;
            }

            // Is there another identifier after the first one?
            else if (this.peek(Tokens.IDENTIFIER)) {
                let isGet = text == "get";
                let isSet = text == "set";

                // The "get" and "set" flags are contextual
                if (isGet || isSet) {
                    childFlags = appendFlag(childFlags, isGet ? NODE_FLAG.GET : NODE_FLAG.SET, childName.range);

                    // Get the real identifier
                    childName = this.current;
                    this.advance();
                }

                // Recover from an extra "function" token
                else if (oldKind == Tokens.FUNCTION) {
                    this.log.error(childName.range, "Instance functions don't need the 'function' keyword");

                    // Get the real identifier
                    childName = this.current;
                    this.advance();
                }

                // Recover from an extra variable tokens
                else if (oldKind == Tokens.CONST || oldKind == Tokens.LET || oldKind == Tokens.VAR) {
                    this.log.error(childName.range,
                        `Instance variables don't need the '${childName.range.toString()}' keyword`);

                    // Get the real identifier
                    childName = this.current;
                    this.advance();
                }
            }

            // Function
            if (this.peek(Tokens.LEFT_PARENTHESIS) || this.peek(Tokens.LESS_THAN)) {
                this.current = childName;
                if (this.parseFunction(childFlags, node) == null) {
                    return null;
                }
            }

            // Variable
            else {
                this.current = childName;
                if (this.parseVariables(childFlags, node) == null) {
                    return null;
                }
            }
        }

        let close = this.current;
        if (!this.expect(Tokens.RIGHT_BRACE)) {
            return null;
        }

        return node.withRange(spanRanges(token.range, close.range)).withInternalRange(name.range);
    }

    parseClass(firstFlag: NodeFlag): Node {
        let token = this.current;
        assert(token.kind == Tokens.CLASS);
        this.advance();

        let name = this.current;
        if (!this.expect(Tokens.IDENTIFIER)) {
            return null;
        }

        let node = createClass(name.range.toString());
        node.firstFlag = firstFlag;
        node.flags = allFlags(firstFlag);

        // Type parameters
        if (this.peek(Tokens.LESS_THAN)) {
            let parameters = this.parseParameters();
            if (parameters == null) {
                return null;
            }
            node.appendChild(parameters);
        }

        // "extends" clause
        let extendsToken = this.current;
        if (this.eat(Tokens.EXTENDS)) {
            let type: Node;

            // Recover from a missing type
            if (this.peek(Tokens.LEFT_BRACE) || this.peek(Tokens.IMPLEMENTS)) {
                this.unexpectedToken();
                type = createParseError();
            }

            else {
                type = this.parseType();
                if (type == null) {
                    return null;
                }
            }

            node.appendChild(createExtends(type).withRange(type.range != null ? spanRanges(extendsToken.range, type.range) : extendsToken.range));
        }

        // "implements" clause
        let implementsToken = this.current;
        if (this.eat(Tokens.IMPLEMENTS)) {
            let list = createImplements();
            let type: Node = null;
            while (true) {
                // Recover from a missing type
                if (this.peek(Tokens.LEFT_BRACE)) {
                    this.unexpectedToken();
                    break;
                }

                type = this.parseType();
                if (type == null) {
                    return null;
                }
                list.appendChild(type);
                if (!this.eat(Tokens.COMMA)) {
                    break;
                }
            }
            node.appendChild(list.withRange(type != null ? spanRanges(implementsToken.range, type.range) : implementsToken.range));
        }

        if (!this.expect(Tokens.LEFT_BRACE)) {
            return null;
        }

        while (!this.peek(Tokens.END_OF_FILE) && !this.peek(Tokens.RIGHT_BRACE)) {
            let childFlags = this.parseFlags();
            let childName = this.current;
            let oldKind = childName.kind;

            // Support contextual keywords
            if (isKeyword(childName.kind)) {
                childName.kind = Tokens.IDENTIFIER;
                this.advance();
            }

            // The identifier must come first without any keyword
            if (!this.expect(Tokens.IDENTIFIER)) {
                return null;
            }

            let text = childName.range.toString();

            // Support operator definitions
            if (text == "operator" && !this.peek(Tokens.LEFT_PARENTHESIS) && !this.peek(Tokens.IDENTIFIER)) {
                childName.kind = Tokens.OPERATOR;
                this.current = childName;
                if (this.parseFunction(childFlags, node) == null) {
                    return null;
                }
                continue;
            }

            // Is there another identifier after the first one?
            else if (this.peek(Tokens.IDENTIFIER)) {
                let isGet = text == "get";
                let isSet = text == "set";

                // The "get" and "set" flags are contextual
                if (isGet || isSet) {
                    childFlags = appendFlag(childFlags, isGet ? NODE_FLAG.GET : NODE_FLAG.SET, childName.range);

                    // Get the real identifier
                    childName = this.current;
                    this.advance();
                }

                // Recover from an extra "function" token
                else if (oldKind == Tokens.FUNCTION) {
                    this.log.error(childName.range, "Instance functions don't need the 'function' keyword");

                    // Get the real identifier
                    childName = this.current;
                    this.advance();
                }

                // Recover from an extra variable tokens
                else if (oldKind == Tokens.CONST || oldKind == Tokens.LET || oldKind == Tokens.VAR) {
                    this.log.error(childName.range,
                        `Instance variables don't need the '${childName.range.toString()}' keyword`);

                    // Get the real identifier
                    childName = this.current;
                    this.advance();
                }
            }

            // Function
            if (this.peek(Tokens.LEFT_PARENTHESIS) || this.peek(Tokens.LESS_THAN)) {
                this.current = childName;
                if (this.parseFunction(childFlags, node) == null) {
                    return null;
                }
            }

            // Variable
            else {
                this.current = childName;
                if (this.parseVariables(childFlags, node) == null) {
                    return null;
                }
            }
        }

        let close = this.current;
        if (!this.expect(Tokens.RIGHT_BRACE)) {
            return null;
        }

        return node.withRange(spanRanges(token.range, close.range)).withInternalRange(name.range);
    }

    parseFunction(firstFlag: NodeFlag, parent: Node): Node {
        let isOperator = false;
        let token = this.current;
        let nameRange: SourceRange;
        let name: string;

        let VOID=createName("void").withRange(token.range);// wtf api
        let ANY=createName("any").withRange(token.range);// wtf api
        let INT=createName("int").withRange(token.range);// wtf api
        let AUTO=createName("auto").withRange(token.range);// wtf api
        let DEFAULT_RETURN_TYPE = VOID;

        // let DEFAULT_RETURN_TYPE = INT;
    // > CompileError: WasmCompile: Compiling wasm function #4:todo failed: expected 1 elements on the stack for fallthru to @1 @+134

        // Support custom operators
        if (parent != null && this.eat(Tokens.OPERATOR)) {
            let end = this.current;

            if (this.eat(Tokens.LEFT_BRACKET)) {
                if (!this.expect(Tokens.RIGHT_BRACKET)) {
                    return null;
                }

                if (this.peek(Tokens.ASSIGN)) {
                    nameRange = spanRanges(token.range, this.current.range);
                    name = "[]=";
                    this.advance();
                }

                else {
                    nameRange = spanRanges(token.range, end.range);
                    name = "[]";
                }

                isOperator = true;
            }

            else if (
                this.eat(Tokens.BITWISE_AND) ||
                this.eat(Tokens.BITWISE_OR) ||
                this.eat(Tokens.BITWISE_XOR) ||
                this.eat(Tokens.COMPLEMENT) ||
                this.eat(Tokens.DIVIDE) ||
                this.eat(Tokens.EQUAL) ||
                this.eat(Tokens.EXPONENT) ||
                this.eat(Tokens.LESS_THAN) ||
                this.eat(Tokens.GREATER_THAN) ||
                this.eat(Tokens.MINUS) ||
                this.eat(Tokens.MINUS_MINUS) ||
                this.eat(Tokens.MULTIPLY) ||
                this.eat(Tokens.PLUS) ||
                this.eat(Tokens.PLUS_PLUS) ||
                this.eat(Tokens.REMAINDER) ||
                this.eat(Tokens.SHIFT_LEFT) ||
                this.eat(Tokens.SHIFT_RIGHT)) {
                nameRange = end.range;
                name = nameRange.toString();
                isOperator = true;
            }

            else if (
                this.eat(Tokens.ASSIGN) ||
                this.eat(Tokens.GREATER_THAN_EQUAL) ||
                this.eat(Tokens.LESS_THAN_EQUAL) ||
                this.eat(Tokens.LOGICAL_AND) ||
                this.eat(Tokens.LOGICAL_OR) ||
                this.eat(Tokens.NOT) ||
                this.eat(Tokens.NOT_EQUAL)) {
                nameRange = end.range;
                name = nameRange.toString();

                // Recover from an invalid operator name
                this.log.error(nameRange,
                    `The operator '${name}' cannot be implemented ${
                        end.kind == Tokens.NOT_EQUAL ? "(it is automatically derived from '==')" :
                            end.kind == Tokens.LESS_THAN_EQUAL ? "(it is automatically derived from '>')" :
                                end.kind == Tokens.GREATER_THAN_EQUAL ? "(it is automatically derived from '<')" :
                                    ""
                        }`);
            }

            else {
                this.unexpectedToken();
            }
        }

        else {
            // Functions inside class declarations don't use "function"
            if (parent == null) {
                assert(token.kind == Tokens.FUNCTION);
                this.advance();
            }

            // Remember where the name is for the symbol later
            nameRange = this.current.range;
            if (!this.expect(Tokens.IDENTIFIER)) {
                return null;
            }
            name = nameRange.toString();
        }
/////////////////////////////////////////
        let node = createFunction(name)
/////////////////////////////////////////
        if (name == "main") {
            let flag = new NodeFlag();
            flag.flag=NODE_FLAG.EXPORT
            flag.next=  firstFlag
            firstFlag=flag
        }
        node.firstFlag = firstFlag;
        node.flags = allFlags(firstFlag);
        if (isOperator) {
            node.flags = node.flags | NODE_FLAG.OPERATOR;
        }

        // Type parameters
        if (this.peek(Tokens.LESS_THAN)) {
            let parameters = this.parseParameters();
            if (parameters == null) {
                return null;
            }
            node.appendChild(parameters);
        }

        if (!this.expect(Tokens.LEFT_PARENTHESIS)) {
            return null;
        }

        if (!this.peek(Tokens.RIGHT_PARENTHESIS)) {
            while (true) {
                let firstArgumentFlag = this.parseFlags();

                let argument = this.current;

                if (!this.expect(Tokens.IDENTIFIER)) {
                    return null;
                }

                let type: Node;
                let value: Node = null;
                let range = argument.range;

                if (this.expect(Tokens.COLON)) {
                    type = this.parseType();

                    if (this.peek(Tokens.LESS_THAN)) {
                        let parameters = this.parseParameters();
                        if (parameters == null) {
                            return null;
                        }
                        type.appendChild(parameters);
                    }

                    if (type != null) {
                        range = spanRanges(range, type.range);
                    }

                    // Recover from a missing type
                    else if (this.peek(Tokens.COMMA) || this.peek(Tokens.RIGHT_PARENTHESIS)) {
                        type = createParseError();
                    }

                    else {
                        return null;
                    }
                }

                // Recover from a missing colon
                else if (this.peek(Tokens.COMMA) || this.peek(Tokens.RIGHT_PARENTHESIS)) {
                    type = createParseError();
                }

                let firstType = type;

                //Type alias
                while (this.eat(Tokens.BITWISE_OR)) {
                    let aliasType = this.parseType();

                    if (this.peek(Tokens.LESS_THAN)) {
                        let parameters = this.parseParameters();
                        if (parameters == null) {
                            return null;
                        }
                        aliasType.appendChild(parameters);
                    }

                    if (aliasType != null) {
                        range = spanRanges(range, aliasType.range);
                    }

                    // Recover from a missing type
                    else if (this.peek(Tokens.COMMA) || this.peek(Tokens.RIGHT_PARENTHESIS)) {
                        aliasType = createParseError();
                    }

                    else {
                        return null;
                    }

                    type.appendChild(aliasType);
                    type = aliasType;

                }

                if (this.eat(Tokens.ASSIGN)) {
                    value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
                }

                let variable = createVariable(argument.range.toString(), firstType, value);
                variable.firstFlag = firstArgumentFlag;
                variable.flags = allFlags(firstArgumentFlag);
                node.appendChild(variable.withRange(range).withInternalRange(argument.range));

                if (!this.eat(Tokens.COMMA)) {
                    break;
                }
            }
        }

        if (!this.expect(Tokens.RIGHT_PARENTHESIS)) {
            return null;
        }

        let returnType: Node;
        if (node.isAnyfunc()) {
            returnType = createAny();
        }
        else {
            if (node.stringValue == "constructor") {
                returnType = new Node();
                returnType.kind = NodeKind.NAME;
                returnType.stringValue = parent.stringValue;
            } else if (this.expect(Tokens.COLON)) {
                if(this.peek(Tokens.LEFT_BRACE ))
                    returnType = DEFAULT_RETURN_TYPE;
                else
                    returnType = this.parseType();

                if (this.peek(Tokens.LESS_THAN)) {
                    let parameters = this.parseParameters();
                    if (parameters == null) {
                        return null;
                    }
                    returnType.appendChild(parameters);
                }

                if (returnType == null) {
                    // Recover from a missing return type
                    if (this.peek(Tokens.SEMICOLON) || this.peek(Tokens.LEFT_BRACE)) {
                        returnType = DEFAULT_RETURN_TYPE;//createParseError();
                    }

                    else {
                        return null;
                    }
                }

                let firstType = returnType;

                //Type alias
                while (this.eat(Tokens.BITWISE_OR)) {
                    let aliasType = this.parseType();

                    if (this.peek(Tokens.LESS_THAN)) {
                        let parameters = this.parseParameters();
                        if (parameters == null) {
                            return null;
                        }
                        aliasType.appendChild(parameters);
                    }

                    if (aliasType == null) {
                        // Recover from a missing return type
                        if (this.peek(Tokens.SEMICOLON) || this.peek(Tokens.LEFT_BRACE)) {
                            aliasType = createParseError();
                        }

                        else {
                            return null;
                        }
                    }

                    firstType.appendChild(aliasType);
                    firstType = aliasType;

                }

            }

            // Recover from a missing colon
            else if (this.peek(Tokens.SEMICOLON) || this.peek(Tokens.LEFT_BRACE)) {
                returnType = createParseError();
            }

            else {
                return null;
            }
        }

        node.appendChild(returnType);

        let block: Node = null;

        // Is this an import?
        let semicolon = this.current;
        if (this.eat(Tokens.SEMICOLON)) {
            block = createEmpty().withRange(semicolon.range);
        }

        // Normal functions
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
        return node.withRange(spanRanges(token.range, block.range)).withInternalRange(nameRange);
    }

    parseVariables(firstFlag: NodeFlag = null, parent: Node = null): Node {
        let token = this.current;

        // Variables inside class declarations don't use "var"
        if (parent == null) {
            assert(token.kind == Tokens.CONST || token.kind == Tokens.LET || token.kind == Tokens.VAR);
            this.advance();
        }

        let node = token.kind == Tokens.CONST ? createConstants() : createVariables();
        node.firstFlag = firstFlag;

        while (true) {
            let name = this.current;
            if (!this.expect(Tokens.IDENTIFIER)) {
                return null;
            }

            let type: Node = null;
            if (this.eat(Tokens.COLON)) {
                type = this.parseType();

                if (this.peek(Tokens.LESS_THAN)) {
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

            let value: Node = null;
            if (this.eat(Tokens.ASSIGN)) {
                value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);
                if (value == null) {
                    return null;
                }

                // TODO: Implement constructors
                if (parent != null) {
                    //this.log.error(value.range, "Inline initialization of instance variables is not supported yet");
                }
            }

            let range =
                value != null ? spanRanges(name.range, value.range) :
                    type != null ? spanRanges(name.range, type.range) :
                        name.range;

            let variable = createVariable(name.range.toString(), type, value);
            variable.firstFlag = firstFlag;
            variable.flags = allFlags(firstFlag);
            (parent != null ? parent : node).appendChild(variable.withRange(range).withInternalRange(name.range));

            if (!this.eat(Tokens.COMMA)) {
                break;
            }
        }

        let semicolon = this.current;
        this.expect(Tokens.SEMICOLON);
        return node.withRange(spanRanges(token.range, semicolon.range));
    }

    parseLoopJump(kind: NodeKind): Node {
        let token = this.current;
        this.advance();
        this.expect(Tokens.SEMICOLON);
        let node = new Node();
        node.kind = kind;
        return node.withRange(token.range);
    }

    parseFlags(): NodeFlag {
        let firstFlag: NodeFlag = null;
        let lastFlag: NodeFlag = null;

        while (true) {
            let token = this.current;
            let flag: int32;

            if (this.eat(Tokens.DECLARE)) flag = NODE_FLAG.DECLARE;
            else if (this.eat(Tokens.EXPORT)) flag = NODE_FLAG.EXPORT;
            else if (this.eat(Tokens.PRIVATE)) flag = NODE_FLAG.PRIVATE;
            else if (this.eat(Tokens.PROTECTED)) flag = NODE_FLAG.PROTECTED;
            else if (this.eat(Tokens.PUBLIC)) flag = NODE_FLAG.PUBLIC;
            else if (this.eat(Tokens.STATIC)) flag = NODE_FLAG.STATIC;
            else if (this.eat(Tokens.ANYFUNC)) flag = NODE_FLAG.ANYFUNC;
            else if (this.eat(Tokens.UNSAFE)) flag = NODE_FLAG.UNSAFE;
            else if (this.eat(Tokens.JAVASCRIPT)) flag = NODE_FLAG.JAVASCRIPT;
            else if (this.eat(Tokens.START)) flag = NODE_FLAG.START;
            else if (this.eat(Tokens.VIRTUAL)) flag = NODE_FLAG.VIRTUAL;
            else return firstFlag;

            let link = new NodeFlag();
            link.flag = flag;
            link.range = token.range;

            if (firstFlag == null) firstFlag = link;
            else lastFlag.next = link;
            lastFlag = link;
        }
    }

    parseUnsafe(): Node {
        let token = this.current;
        this.advance();

        let node = this.parseBlock();
        if (node == null) {
            return null;
        }

        node.flags = node.flags | NODE_FLAG.UNSAFE;
        return node.withRange(spanRanges(token.range, node.range));
    }

    parseJavaScript(): Node {
        let token = this.current;
        this.advance();

        let node = this.parseBlock();
        if (node == null) {
            return null;
        }

        node.flags = node.flags | NODE_FLAG.JAVASCRIPT;
        return node.withRange(spanRanges(token.range, node.range));
    }

    parseStart(): Node {
        let token = this.current;
        this.advance();

        let node = this.parseBlock();
        if (node == null) {
            return null;
        }

        node.flags = node.flags | NODE_FLAG.START;
        return node.withRange(spanRanges(token.range, node.range));
    }

    parseVirtual(firstFlag): Node {
        let token = this.current;
        this.advance();

        let node = this.parseFunction(firstFlag, null);
        if (node == null) {
            return null;
        }

        node.flags = node.flags | NODE_FLAG.VIRTUAL;
        return node.withRange(spanRanges(token.range, node.range));
    }

    parseStatement(mode: StatementMode): Node {
        let firstFlag = mode == StatementMode.FILE ? this.parseFlags() : null;

        // if (this.peek(TokenKind.UNSAFE) && firstFlag == null) return this.parseUnsafe(); //disabled for now
        if (this.peek(Tokens.IMPORT) && firstFlag == null) return this.parseImports(); // This should handle before parsing
        if (this.peek(Tokens.JAVASCRIPT) && firstFlag == null) return this.parseJavaScript();
        if (this.peek(Tokens.START) && firstFlag == null) return this.parseStart();
        if (this.peek(Tokens.CONST) || this.peek(Tokens.LET) || this.peek(Tokens.VAR)) return this.parseVariables(firstFlag, null);
        if (this.peek(Tokens.FUNCTION)) return this.parseFunction(firstFlag, null);
        if (this.peek(Tokens.VIRTUAL)) return this.parseVirtual(firstFlag);
        if (this.peek(Tokens.MODULE)) return this.parseModule(firstFlag);
        if (this.peek(Tokens.CLASS)) return this.parseClass(firstFlag);
        if (this.peek(Tokens.ENUM)) return this.parseEnum(firstFlag);

        // Definition modifiers need to be attached to a definition
        if (firstFlag != null) {
            this.unexpectedToken();
            return null;
        }

	    // if (this.peek(Tokens.DO)) return this.parseBlock();
	    if (this.peek(Tokens.LEFT_BRACE)) return this.parseBlock();
        if (this.peek(Tokens.BREAK)) return this.parseLoopJump(NodeKind.BREAK);
        if (this.peek(Tokens.CONTINUE)) return this.parseLoopJump(NodeKind.CONTINUE);
        if (this.peek(Tokens.IF)) return this.parseIf();
        if (this.peek(Tokens.WHILE)) return this.parseWhile();
        if (this.peek(Tokens.FOR)) return this.parseFor();
        if (this.peek(Tokens.DELETE)) return this.parseDelete();
        if (this.peek(Tokens.RETURN)) return this.parseReturn();
        if (this.peek(Tokens.SEMICOLON)) return this.parseEmpty();

        // Parse an expression statement
        let value = this.parseExpression(Precedence.LOWEST, ParseKind.EXPRESSION);

        if (value == null) {
            return null;
        }

        let semicolon = this.current;
        if (mode !== StatementMode.UNTERMINATED) {
            this.expect(Tokens.SEMICOLON);
        }
        return createExpression(value).withRange(spanRanges(value.range, semicolon.range));
    }

    parseStatements(parent: Node, mode: StatementMode = StatementMode.NORMAL): boolean {
        while (!this.peek(Tokens.END_OF_FILE) && !this.peek(Tokens.RIGHT_BRACE)) {
            let child = this.parseStatement(parent.kind == NodeKind.FILE ? StatementMode.FILE : mode);
            if (child == null) {
                return false;
            }
            if (child.kind === NodeKind.RETURN) {
                parent.returnNode = child;
            }
            parent.appendChild(child);
        }
        return true;
    }

    parseInt(range: SourceRange, node: Node): boolean {
        let source = range.source;
        let contents = source.contents;
        node.intValue = parseInt(contents.substring(range.start, range.end));
        node.flags = NODE_FLAG.POSITIVE;
        return true;
    }

    parseFloat(range: SourceRange, node: Node): boolean {
        let source = range.source;
        let contents = source.contents;
        node.floatValue = parseFloat(contents.substring(range.start, range.end));
        node.flags = NODE_FLAG.POSITIVE;
        return true;
    }

    parseDouble(range: SourceRange, node: Node): boolean {
        let source = range.source;
        let contents = source.contents;
        node.doubleValue = parseFloat(contents.substring(range.start, range.end));
        node.flags = NODE_FLAG.POSITIVE;
        return true;
    }
}

export function parse(firstToken: Token, log: Log): Node {
    let context = new ParserContext();
    context.current = firstToken;
    context.log = log;

    let file = new Node();
    file.kind = NodeKind.FILE;
    if (!context.parseStatements(file)) {
        return null;
    }
    return file;
}
