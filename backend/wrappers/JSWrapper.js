module.exports = (code, problem) => {

  const { functionName, parameters } = problem.functionSignature;

  const args = parameters.map(p => p.name).join(", ");

  return `
const fs = require("fs");

const input = fs.readFileSync(0,"utf8").trim().split(/\\s+/);

let idx = 0;

${code}

// TODO: Generate input

const ans = ${functionName}(${args});

console.log(ans);
`;
};