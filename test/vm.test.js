const test = require("ava");
const { run } = require("../src/index");

test("VariableDeclaration", async (t) => {
  const code = `
	let x = 2 ** 3;
    module.exports = x;
    `;
  const result = await run(code, {});
  t.deepEqual(result, 8);
});

test("FunctionDeclaration", async (t) => {
  const code = `
    function add(a, b) {
		return a + b;
	}
    module.exports = add(1, 2);
    `;
  const result = await run(code);
  t.deepEqual(result, 3);
});
