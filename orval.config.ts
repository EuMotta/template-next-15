import fs from 'fs';
import { defineConfig } from 'orval';
import path from 'path';

import { generateDefaultValueHooks } from './orval-generate-default-values';
import { generateParamHooks } from './orval-generate-params-client';
import { generateParamServerParsers } from './orval-generate-params-server';

const schemasPath = path.join(process.cwd(), 'src/http/generated/zod');

const applyZodErrorImport = `import { applyZodErrorMap } from "@/utils/apply-zod-error-map";\n\napplyZodErrorMap();\n\n`;

const processFiles = (dir: string) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      processFiles(fullPath);
    } else if (file.endsWith('.zod.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');

      if (!content.includes('applyZodErrorMap')) {
        fs.writeFileSync(fullPath, applyZodErrorImport + content, 'utf8');
        console.log(`✅ Atualizado: ${fullPath}`);
      }
    }
  });
};

export default defineConfig({
  server: {
    input: {
      target: 'http://localhost:3001/api-json'
    },
    output: {
      mode: 'split',
      target: './src/http/generated/server/api-server.ts',
      client: 'axios',
      clean: true,
      override: {
        header: () =>
          `/* eslint-disable */\n/* tslint:disable */\n// @ts-nocheck\n\n`,
        mutator: {
          path: './src/http/server.ts',
          name: 'serverHttp',
          default: true
        }
      }
    },

    hooks: {
      afterAllFilesWrite: () => {
        console.log('🔄 Aplicando ajustes nos arquivos Zod...');
        processFiles(schemasPath);

        console.log('🔄 Gerando hooks de query params (nuqs)...');
        generateParamHooks();
        console.log('🔄 Gerando params pelo servidor...');
        generateParamServerParsers();

        console.log('🔄 Gerando defaultValues...');
        generateDefaultValueHooks();
      }
    }
  },

  client: {
    input: {
      target: 'http://localhost:3001/api-json'
    },
    output: {
      mode: 'split',
      target: './src/http/generated/client/api.ts',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      override: {
        header: () =>
          `/* eslint-disable */\n/* tslint:disable */\n// @ts-nocheck\n\n`,
        fetch: {
          includeHttpResponseReturnType: false
        },
        mutator: {
          path: './src/http/client.ts',
          name: 'http',
          default: true
        }
      }
    },
    hooks: {
      afterAllFilesWrite: () => {
        console.log('🔄 Aplicando ajustes nos arquivos Zod...');
        processFiles(schemasPath);

        console.log('🔄 Gerando hooks de query params (nuqs)...');
        generateParamHooks();

        console.log('🔄 Gerando defaultValues...');
        generateDefaultValueHooks();
      }
    }
  },

  clientZod: {
    input: {
      target: 'http://localhost:3001/api-json'
    },
    output: {
      mode: 'tags-split',
      client: 'zod',
      target: './src/http/generated/zod',
      fileExtension: '.zod.ts',
      override: {
        zod: {
          generate: {
            param: true,
            query: true,
            header: true,
            body: true,
            response: false
          },
          generateEachHttpStatus: true
        }
      }
    }
  }
});
