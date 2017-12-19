import {Symbol, SymbolKind, SymbolState} from "./symbol";
import {Log} from "../../utils/log";
import {Type} from "./type";
export enum FindNested {
  NORMAL,
  ALLOW_INSTANCE_ERRORS,
}

export enum ScopeHint {
  NORMAL,
  NOT_BINARY,
  NOT_GETTER,
  NOT_SETTER,
  NOT_UNARY,
  PREFER_GETTER,
  PREFER_SETTER,
}

export class Scope {
  parent: Scope;
  symbol: Symbol;
  firstSymbol: Symbol;
  lastSymbol: Symbol;

  findLocal(name: string, hint: ScopeHint): Symbol {
    var symbol = this.firstSymbol;
    var fallback: Symbol = null;
    while (symbol != null) {
      if (symbol.name == name) {
        if (hint == ScopeHint.PREFER_GETTER && symbol.isSetter() ||
            hint == ScopeHint.PREFER_SETTER && symbol.isGetter()) {
          fallback = symbol;
        }

        else if (
            (hint != ScopeHint.NOT_GETTER || !symbol.isGetter()) &&
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

  findNested(name: string, hint: ScopeHint, mode: FindNested): Symbol {
    var scope:Scope = this;
    while (scope != null) {
      if (scope.symbol == null || scope.symbol.kind != SymbolKind.TYPE_CLASS ||
          mode == FindNested.ALLOW_INSTANCE_ERRORS || scope.symbol.node.hasParameters()) {
        var local = scope.findLocal(name, hint);
        if (local != null) {
          return local;
        }
      }
      scope = scope.parent;
    }
      if(name=="bool") return this.findNested("boolean",hint,mode)// todo better
      if(name=="byte") return this.findNested("int8",hint,mode)// todo better
      if(name=="short") return this.findNested("int16",hint,mode)// todo better
      if(name=="int") return this.findNested("int32",hint,mode)// todo better
      if(name=="long") return this.findNested("int64",hint,mode)// todo better
      if(name=="float") return this.findNested("float32",hint,mode)// todo better
      if(name=="double") return this.findNested("float64",hint,mode)// todo better
      if(name=="number") return this.findNested("float64",hint,mode)// todo better
      // if(name=="char") dont return this.findNested("int8",hint,mode)// todo better
    return null;
  }

  define(log: Log, symbol: Symbol, hint: ScopeHint): boolean {
    let existing = this.findLocal(symbol.name, hint);
    if (existing != null) {
      if (symbol.name == "this") {
        log.warning(symbol.range, "Duplicate 'this' symbol");
        return true;
      } else {
        log.error(symbol.range, `Duplicate symbol '${symbol.name}'`);
        return false;
      }
    }

    if (this.firstSymbol == null) this.firstSymbol = symbol;
    else this.lastSymbol.next = symbol;
    this.lastSymbol = symbol;

    return true;
  }

  defineNativeType(log: Log, name: string): Type {
    var symbol = new Symbol();
    symbol.kind = SymbolKind.TYPE_NATIVE;
    symbol.name = name;
    symbol.resolvedType = new Type();
    symbol.resolvedType.symbol = symbol;
    symbol.state = SymbolState.INITIALIZED;
    this.define(log, symbol, ScopeHint.NORMAL);
    return symbol.resolvedType;
  }
}
