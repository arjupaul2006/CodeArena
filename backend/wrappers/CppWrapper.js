function generateInputReading(parameters) {
  return parameters
    .map((param) => {
      switch (param.type) {
        case "int":
          return `int ${param.name}; cin >> ${param.name};`;

        case "long":
          return `long ${param.name}; cin >> ${param.name};`;

        case "long long":
          return `long long ${param.name}; cin >> ${param.name};`;

        case "float":
          return `float ${param.name}; cin >> ${param.name};`;

        case "double":
          return `double ${param.name}; cin >> ${param.name};`;

        case "bool":
          return `bool ${param.name}; cin >> ${param.name};`;

        case "char":
          return `char ${param.name}; cin >> ${param.name};`;

        case "string":
          return `string ${param.name}; cin >> ${param.name};`;

        case "vector<int>":
          return `
int ${param.name}_size;
cin >> ${param.name}_size;

vector<int> ${param.name}(${param.name}_size);

for(int i = 0; i < ${param.name}_size; i++)
    cin >> ${param.name}[i];
`;

        case "vector<long long>":
          return `
int ${param.name}_size;
cin >> ${param.name}_size;

vector<long long> ${param.name}(${param.name}_size);

for(int i = 0; i < ${param.name}_size; i++)
    cin >> ${param.name}[i];
`;

        case "vector<double>":
          return `
int ${param.name}_size;
cin >> ${param.name}_size;

vector<double> ${param.name}(${param.name}_size);

for(int i = 0; i < ${param.name}_size; i++)
    cin >> ${param.name}[i];
`;

        case "vector<string>":
          return `
int ${param.name}_size;
cin >> ${param.name}_size;

vector<string> ${param.name}(${param.name}_size);

for(int i = 0; i < ${param.name}_size; i++)
    cin >> ${param.name}[i];
`;

        case "vector<char>":
          return `
int ${param.name}_size;
cin >> ${param.name}_size;

vector<char> ${param.name}(${param.name}_size);

for(int i = 0; i < ${param.name}_size; i++)
    cin >> ${param.name}[i];
`;

        case "vector<vector<int>>":
          return `
int ${param.name}_rows, ${param.name}_cols;
cin >> ${param.name}_rows >> ${param.name}_cols;

vector<vector<int>> ${param.name}(
    ${param.name}_rows,
    vector<int>(${param.name}_cols)
);

for(int i = 0; i < ${param.name}_rows; i++)
    for(int j = 0; j < ${param.name}_cols; j++)
        cin >> ${param.name}[i][j];
`;

        default:
          throw new Error(`Unsupported parameter type: ${param.type}`);
      }
    })
    .join("\n");
}

function generateOutputPrinting(returnType) {
  switch (returnType) {
    case "void":
      return "";

    case "int":
    case "long":
    case "long long":
    case "float":
    case "double":
    case "char":
    case "string":
      return "cout << ans;";

    case "bool":
      return `cout << (ans ? "true" : "false");`;

    case "vector<int>":
    case "vector<long long>":
    case "vector<double>":
    case "vector<string>":
    case "vector<char>":
      return `
for(size_t i = 0; i < ans.size(); i++) {
    if(i) cout << " ";
    cout << ans[i];
}
`;

    case "vector<vector<int>>":
      return `
for(auto &row : ans){
    for(size_t j = 0; j < row.size(); j++){
        if(j) cout << " ";
        cout << row[j];
    }
    cout << "\\n";
}
`;

    default:
      throw new Error(`Unsupported return type: ${returnType}`);
  }
}

const wrapperCpp = (code, problem) => {
  const { className, functionName, parameters, returnType } =
    problem.functionSignature;

  const parameterNames = parameters.map((param) => param.name).join(", ");

  const functionCall =
    returnType === "void"
      ? `obj.${functionName}(${parameterNames});`
      : `auto ans = obj.${functionName}(${parameterNames});`;

  return `
#include <bits/stdc++.h>
using namespace std;

${code}

int main() {

${generateInputReading(parameters)}

${className} obj;

${functionCall}

${generateOutputPrinting(returnType)}

return 0;
}
`;
};

module.exports = wrapperCpp;
