/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import fs from 'fs';
import path from 'path';

/**
 * Gera hooks de query params para cada rota
 */
export const generateParamHooks = async () => {
  try {
    const apiUrl = 'http://localhost:3001/api-json';

    const response = await axios.get(apiUrl);
    const apiData = response.data;

    for (const pathItem in apiData.paths) {
      const pathOperations = apiData.paths[pathItem];

      for (const method in pathOperations) {
        const operation = pathOperations[method];

        if (operation.parameters && operation.parameters.length > 0) {
          const operationId = operation.operationId || `${method}-${pathItem}`;
          const paramNames = operation.parameters.map(
            (param: any) => param.name
          );

          const hookName = `use${capitalizeFirstLetter(operationId)}`;
          const hookCode = generateQueryHookCode(hookName, paramNames);

          const hooksDir = path.resolve(
            __dirname,
            './src/http/generated/params'
          );
          if (!fs.existsSync(hooksDir)) {
            fs.mkdirSync(hooksDir, { recursive: true });
          }

          const filePath = path.join(hooksDir, `${hookName}Params.ts`);
          fs.writeFileSync(filePath, hookCode);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao gerar hooks:', error);
  }
};

/**
 * Gera o código do hook para uma rota com os parâmetros usando nuqs
 * @param hookName Nome do hook
 * @param paramNames Parâmetros da consulta
 * @param operationId Id da operação
 * @param pathItem Caminho da operação
 * @returns Código do hook
 */
const generateQueryHookCode = (hookName: string, paramNames: string[]) => {
  const parsers = paramNames.reduce(
    (acc, param) => {
      if (param.toLowerCase() === 'order') {
        acc[param] = `parseAsStringEnum(['ASC', 'DESC']).withDefault('ASC')`;
      } else if (param.toLowerCase() === 'page') {
        acc[param] = `parseAsInteger.withDefault(1)`;
      } else if (param.toLowerCase() === 'limit') {
        acc[param] = `parseAsInteger.withDefault(10)`;
      } else {
        acc[param] = `parseAsString`;
      }
      return acc;
    },
    {} as Record<string, string>
  );

  const urlKeys = paramNames.reduce(
    (acc, param) => {
      acc[param] = `"${param}"`;
      return acc;
    },
    {} as Record<string, string>
  );

  const parsersCode = Object.entries(parsers)
    .map(([key, value]) => `  ${key}: ${value},`)
    .join('\n');

  const urlKeysCode = Object.entries(urlKeys)
    .map(([key, value]) => `  ${key}: ${value},`)
    .join('\n');

  // Generate transformation code for null to undefined
  const transformCode = paramNames
    .map((param) => `    ${param}: params.${param} ?? undefined,`)
    .join('\n');

  const hookBody = `
import {
  type UrlKeys,
  useQueryStates,
  parseAsString,
  parseAsStringEnum,
  parseAsInteger,
} from 'nuqs';


export const ${hookName}ParamsParsers = {
${parsersCode}
};

export const ${hookName}ParamsUrlKeys: UrlKeys<typeof ${hookName}ParamsParsers> = {
${urlKeysCode}
};

export const ${hookName}Params = () => {
  const [params, setFilterParams] = useQueryStates(${hookName}ParamsParsers, {
    urlKeys: ${hookName}ParamsUrlKeys,
  });

  const transformedParams = {
${transformCode}
  };

  return {
    params: transformedParams,
    setFilterParams,
  };
};

export default ${hookName}Params;
  `;
  return hookBody;
};

/**
 * Capitaliza a primeira letra de uma string
 * @param str String a ser capitalizada
 * @returns String com a primeira letra maiúscula
 */
const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

generateParamHooks();
