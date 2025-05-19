/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import fs from 'fs';
import path from 'path';

/**
 * Gera funções com defaultValues para formulários de update
 */
export const generateDefaultValueHooks = async () => {
  try {
    const apiUrl = 'http://localhost:3001/api-json';
    const response = await axios.get(apiUrl);
    const api = response.data;

    const outputDir = path.resolve(
      __dirname,
      './src/http/generated/defaultValues'
    );
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    for (const [routePath, methods] of Object.entries(api.paths)) {
      for (const [method, operation] of Object.entries(
        methods as Record<string, any>
      )) {
        if (method !== 'put' && method !== 'patch') continue;
        if (!operation.requestBody) continue;

        const operationId = operation.operationId || `${method}_${routePath}`;
        const functionName = `get${capitalize(operationId)}DefaultValues`;

        const contentType = Object.keys(operation.requestBody.content || {})[0];
        const schemaRef =
          operation.requestBody.content?.[contentType]?.schema?.$ref;

        if (!schemaRef) continue;

        const schemaName = getSchemaName(schemaRef);
        const schema = api.components.schemas[schemaName];

        if (!schema || !schema.properties) continue;

        const fieldsCode = Object.entries(schema.properties)
          .map(([field, def]) => {
            const fallback = getFallbackValue(def);
            return `  ${field}: data?.${field} ?? ${fallback},`;
          })
          .join('\n');

        const code = `
/**
 * ⚙️ Arquivo gerado automaticamente José Antonio Motta
 *
 * 🛠️ Baseado no schema do Orval v6.x
 *
 * ⚠️ Não edite este arquivo manualmente — ele será sobrescrito.
 */

import { ${schemaName} } from '../api.schemas';

export const ${functionName} = (data?: Partial<${schemaName}>): ${schemaName} => ({
${fieldsCode}
});
`;

        const filePath = path.join(outputDir, `${functionName}.ts`);
        fs.writeFileSync(filePath, code);
        console.log(`✅ Default values function generated: ${filePath}`);
      }
    }
  } catch (err) {
    console.error('Erro ao gerar default values functions:', err);
  }
};

// Helpers

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const getSchemaName = (ref: string) => ref.split('/').pop() ?? 'UnknownSchema';

const getFallbackValue = (def: any): string => {
  if (!def) return '""';
  const type = def.type;

  switch (type) {
    case 'string':
      return '""';
    case 'boolean':
      return 'false';
    case 'integer':
    case 'number':
      return '0';
    case 'array':
      return '[]';
    case 'object':
      return '{}';
    default:
      return 'null';
  }
};

// Chamada da função para gerar as funções de defaultValues
generateDefaultValueHooks();
