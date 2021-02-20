const BinaryExpressionOperatorEvaluateMap = {
  "**": (a, b) => Math.pow(a, b),
  "+": (a, b) => a + b,
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
  MemberExpression(path) {
    const object = path.scope.get(path.node.object.value);
    if (path.node.computed) {
      return path.evaluate(path.createChild(path.node.object))[
        path.evaluate(path.createChild(path.node.property))
      ];
    }
    return path.evaluate(path.createChild(path.node.object))[
      path.node.property.value
    ];
  },
  FunctionDeclaration(path) {
    path.scope.let(path.node.identifier.value, ESMap.FunctionExpression(path));
  },
  FunctionExpression(path) {
    return function (...args) {
      // create function scope
      const newPath = path.createChild(path.node, "function");
      for (let i = 0; i < path.node.params.length; i++) {
        newPath.scope.const(
          path.evaluate(path.createChild(path.node.params[i])),
          args[i]
        );
      }
      newPath.scope.const("this", this);
      newPath.scope.const("arguments", arguments);
      return path.evaluate(newPath.createChild(newPath.node.body));
    };
  },
  BlockStatement(path) {
    for (let i = 0; i < path.node.stmts.length; i++) {
      const result = path.evaluate(
        path.createChild(path.node.stmts[i], "block")
      );
      if (path.node.stmts[i].type === "ReturnStatement") {
        return result;
      }
    }
  },
  ReturnStatement(path) {
    return path.evaluate(path.createChild(path.node.argument));
  },
  Parameter(path) {
    return path.node.pat.value;
  },
};

exports.ESMap = ESMap;
