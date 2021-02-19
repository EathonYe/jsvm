const { parse } = require("@swc/core");
const { Scope } = require("./scope");
const { ESMap } = require("./es");
const { Path } = require("./path");

function evaluate(path) {
  return ESMap[path.node.type](path);
}

async function run(code) {
  const ast = await parse(code);
  const scope = new Scope();
  const path = new Path(ast, null, scope, evaluate);
  evaluate(path);
}

exports.run = run;

(async () => {
  const code = "let x = 2 ** 3;";
  // const ast = await parse(code, { isModule: false });

  // console.log(JSON.stringify(ast));
  await run(code);
})();
