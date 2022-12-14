module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*/*.d.ts',
    '!src/**/*/types.ts',
    '!src/index.ts',
    '!**/types/**/*',
  ],
  coverageReporters: ['json-summary', 'json', 'lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 49,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  setupFiles: ['react-app-polyfill/jsdom'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/config/jest/babelTransform.cjs',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.cjs',
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': '<rootDir>/config/jest/fileTransform.cjs',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  modulePaths: [],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  resetMocks: true,
  timers : 'modern'
};
