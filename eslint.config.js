import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import tanstackQuery from '@tanstack/eslint-plugin-query'
import tanstackRouter from '@tanstack/eslint-plugin-router'

export default tseslint.config(
  {
    ignores: [
      'dist',
      '.output',
      '.nitro',
      '.tanstack',
      '.vinxi',
      'src/routeTree.gen.ts',
    ],
  },

  js.configs.recommended,
  tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      '@tanstack/query': tanstackQuery,
      '@tanstack/router': tanstackRouter,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      '@tanstack/query/exhaustive-deps': 'error',
      '@tanstack/query/stable-query-client': 'error',
      '@tanstack/query/no-rest-destructuring': 'warn',

      '@tanstack/router/create-route-property-order': 'error',

      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
)
