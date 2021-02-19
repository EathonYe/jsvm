class Path {
  constructor(node, parent, scope, evaluate) {
    this.node = node;
    this.parent = parent;
    this.scope = scope;
    this.evaluate = evaluate;
  }

  createChild(node, scopeType) {
    return new Path(
      node,
      this,
      scopeType ? this.scope.createChild(scopeType) : this.scope,
      this.evaluate
    );
  }
}

exports.Path = Path;
