/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const generateParamServerParsers = async () => {
  const apiUrl = 'http://localhost:3001/api-json';

  const response = await axios.get(apiUrl);
  const apiData = response.data;

  for (const pathItem in apiData.paths) {
    const pathOperations = apiData.paths[pathItem];

    for (const method in pathOperations) {
      const operation = pathOperations[method];

      if (operation.parameters && operation.parameters.length > 0) {
        const operationId =
          operation.operationId ||
          `${method}_${pathItem}`.replace(/[\/{}]/g, '');

        const hookName = `parse${capitalizeFirstLetter(operationId)}Params`;
        const paramNames = operation.parameters.map((p: any) => p.name);

        const functionCode = generateServerParserFunction(hookName, paramNames);

        const outputDir = path.resolve(
          __dirname,
          './src/http/generated/server/params'
        );
        if (!fs.existsSync(outputDir))
          fs.mkdirSync(outputDir, { recursive: true });

        const filePath = path.join(outputDir, `${hookName}.ts`);
        fs.writeFileSync(filePath, functionCode);
      }
    }
  }
};

const generateServerParserFunction = (fnName: string, paramNames: string[]) => {
  const paramParsing = paramNames
    .map((param) => {
      const lowerParam = param.toLowerCase();

      if (lowerParam === 'page') {
        return `    ${param}: parseInt(searchParams.get('${param}') ?? '1', 10)`;
      }

      if (lowerParam === 'limit') {
        return `    ${param}: parseInt(searchParams.get('${param}') ?? '10', 10)`;
      }

      if (lowerParam === 'order') {
        return `    ${param}: (searchParams.get('${param}') ?? 'ASC') as 'ASC' | 'DESC'`;
      }

      return `    ${param}: searchParams.get('${param}') ?? ''`;
    })
    .join(',\n');

  return `
// Gerado automaticamente
export const ${fnName} = (searchParams: URLSearchParams) => {
  return {
${paramParsing}
  };
};
`;
};

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

generateParamServerParsers();
