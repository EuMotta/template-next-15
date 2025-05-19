import js from '@eslint/js';
import importHelpers from 'eslint-plugin-import-helpers';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended']
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      '**/*.d.ts',
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/public/**'
    ],

    plugins: {
      'react-hooks': reactHooks,
      'import-helpers': importHelpers
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: [
            ['/^react/', '/^next/'],
            'module',
            '/^@shared/',
            'absolute',
            '/^components/',
            '/^pages/',
            '/utils/',
            '/constants/',
            '/^store/',
            '/^styles/',
            '/^templates/',
            ['parent', 'sibling', 'index']
          ],
          alphabetize: {
            order: 'asc',
            ignoreCase: true
          }
        }
      ],
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
          plugins: ['prettier-plugin-tailwindcss']
        }
      ]
    }
  }
]);
