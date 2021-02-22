const { parse } = require("@swc/core");
const { Scope, ScopeType } = require("./scope");
const { ESMap } = require("./es");
const { Path } = require("./path");

function evaluate(path) {
  if (!path.node.type) {
    return evaluate(path.createChild(path.node.expression));
  }
  return ESMap[path.node.type](path);
}

async function run(code, context = {}) {
  const ast = await parse(code);
  const scope = new Scope();
  scope.type = ScopeType.ROOT;
  scope.const("module", { exports: {} });
  scope.setContext(context);
  const path = new Path(ast, null, scope, evaluate);
  evaluate(path);

  const module = scope.get("module");
  return module ? module.exports : undefined;
}

exports.run = run;

// (async () => {
//   const code = `
// 	function add(a, b) {
// 		return a + b;
// 	}
// 	let x = 2 ** 3;
// 	console.log(x);
// 	console.log(add(1, 2));
//   module.exports = x;
// 	`;
//   const context = {
//     console,
//   };
//   await run(code, context);
// })();
