module.exports = (code, problem) => {

  const { className, functionName, parameters } = problem.functionSignature;

  const args = parameters.map(p => p.name).join(", ");

  return `
import java.util.*;

${code}

public class Main{

    public static void main(String[] args){

        Scanner sc = new Scanner(System.in);

        // TODO: Generate input

        ${className} obj = new ${className}();

        System.out.print(obj.${functionName}(${args}));
    }

}
`;
};