function generateInputReading(parameters) {
    return parameters.map(param => {
        switch (param.type) {

            case "int":
            case "long":
            case "long long":
                return `${param.name} = int(input())`;

            case "float":
            case "double":
                return `${param.name} = float(input())`;

            case "string":
                return `${param.name} = input()`;

            case "bool":
                return `${param.name} = bool(int(input()))`;

            case "vector<int>":
                return `
${param.name}_size = int(input())
${param.name} = list(map(int, input().split()))
`;

            case "vector<string>":
                return `
${param.name}_size = int(input())
${param.name} = input().split()
`;

            default:
                throw new Error(`Unsupported type ${param.type}`);
        }
    }).join("\n");
}

function generateOutput(returnType) {
    if (returnType === "void") return "";

    // Booleans: print as 'true'/'false'
    if (returnType === "bool") return 'print("true" if ans else "false")';

    // Simple lists: print space-separated values
    if (
        returnType === "vector<int>" ||
        returnType === "vector<long long>" ||
        returnType === "vector<double>" ||
        returnType === "vector<char>"
    ) {
        return 'print(" ".join(map(str, ans)))';
    }

    if (returnType === "vector<string>") {
        return 'print(" ".join(ans))';
    }

    // Nested lists: print each row on its own line
    if (returnType === "vector<vector<int>>") {
        return 'for row in ans:\n    print(" ".join(map(str, row)))';
    }

    return "print(ans)";
}

module.exports = (code, problem) => {

    const { className, functionName, parameters, returnType } = problem.functionSignature;

    const args = parameters.map(p => p.name).join(", ");

    const functionCall =
        returnType === "void"
            ? `obj.${functionName}(${args})`
            : `ans = obj.${functionName}(${args})`;

    return `
${code}

${generateInputReading(parameters)}

obj = ${className}()

${functionCall}

${generateOutput(returnType)}
`;
};