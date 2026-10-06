// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // The raw palette is for the theme file only. Everything else uses semantic tokens.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/theme/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/tokens/color', '@/theme/tokens/color'],
              message: 'Do not import the raw palette. Use semantic tokens via useTheme().colors.',
            },
          ],
        },
      ],
    },
  },
]);
