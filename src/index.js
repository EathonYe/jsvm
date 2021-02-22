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

async function run(code, context) {
  const ast = await parse(code);
  const scope = new Scope();
  scope.setContext(context);
  scope.type = ScopeType.ROOT;
  const path = new Path(ast, null, scope, evaluate);
  evaluate(path);
}

exports.run = run;

(async () => {
  const code = `
	function add(a, b) {
		return a + b;
	}
	let x = 2 ** 3;
	console.log(x);
	console.log(add(1, 2));
	`;
  // const ast = await parse(code, { isModule: false });

  // console.log(JSON.stringify(ast));
  const context = {
    console,
  };
  await run(code, context);
})();
