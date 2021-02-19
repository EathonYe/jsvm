const BinaryExpressionOperatorEvaluateMap = {
  "**": (a, b) => Math.pow(a, b),
};

const ESMap = {
  Module(path) {
    for (let declaration of path.node.body) {
      path.evaluate(path.createChild(declaration));
    }
  },
  VariableDeclaration(path) {
    for (const declaration of path.node.declarations) {
      const varKeyValueMap = {};
      varKeyValueMap[declaration.id.value] = declaration.init
        ? path.evaluate(path.createChild(declaration.init))
        : undefined;

      for (let key in varKeyValueMap) {
        path.scope[path.node.kind](key, varKeyValueMap[key]);
      }
    }
  },
  BinaryExpression(path) {
    return BinaryExpressionOperatorEvaluateMap[path.node.operator](
      path.evaluate(path.createChild(path.node.left)),
      path.evaluate(path.createChild(path.node.right))
    );
  },
  NumericLiteral(path) {
    return path.node.value;
  },
  ExpressionStatement(path) {
    return path.evaluate(path.createChild(path.node.expression));
  },
  CallExpression(path) {
    const func = path.evaluate(path.createChild(path.node.callee));
    const args = path.node.arguments.map((arg) =>
      path.evaluate(path.createChild(arg))
    );
    return func.apply(null, args);
  },
  Identifier(path) {
    return path.scope.get(path.node.value);
  },
};

exports.ESMap = ESMap;
