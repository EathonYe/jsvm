const { parse } = require("@swc/core");
const { Scope } = require("./scope");
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
  const path = new Path(ast, null, scope, evaluate);
  evaluate(path);
}

exports.run = run;

(async () => {
  const code = `let x = 2 ** 3;show(x);`;
  // const ast = await parse(code, { isModule: false });

  // console.log(JSON.stringify(ast));
  const context = {
    show: console.log,
  };
  await run(code, context);
})();
