class Scope {
  constructor(parent) {
    this.parent = parent;
    this.variableObject = {};
    this.level = 0;
  }

  createChild() {
    const childScope = new Scope(this);
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
}

exports.Scope = Scope;
