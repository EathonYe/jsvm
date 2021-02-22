const ScopeType = {
  ROOT: "root",
  FUNCTION: "function",
  BLOCK: "block",
};

class Scope {
  constructor(parent) {
    this.parent = parent;
    this.variableObject = {};
    this.level = 0;
    this.type = null;
    this.context = null;
  }

  setContext(context) {
    this.context = context;
    for (let key in context) {
      if (!Reflect.has(this.variableObject, key)) {
        this.variableObject[key] = context[key];
      }
    }
  }

  createChild(scopeType) {
    const childScope = new Scope(this);
    childScope.type = scopeType;
    childScope.level = this.level + 1;
    return childScope;
  }

  var(key, value) {
    this.variableObject[key] = value;
  }

  let(key, value) {
    this.var(key, value);
  }

  const(key, value) {
    this.var(key, value);
  }

  get(key) {
    if (this.variableObject[key]) {
      return this.variableObject[key];
    } else if (this.parent) {
      return this.parent.get(key);
    } else {
      throw new ReferenceError(`${key} is not defined.`);
    }
  }
}

exports.ScopeType = ScopeType;
exports.Scope = Scope;
