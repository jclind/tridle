import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  { ignores: ['build/'] },
  js.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    rules: {
      // New in eslint-plugin-react-hooks 7. The existing hits are in game
      // state logic, so they stay visible as warnings until that gets
      // refactored on purpose.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]
