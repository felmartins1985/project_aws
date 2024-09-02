module.exports = {
  transform: { '^.+\\.ts?$': ['ts-jest', { tsconfig: 'tsconfig.json' }] },
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules', 'src'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**', // Include all JavaScript and TypeScript files in src for coverage
    // '!src/tests/**', // Optionally exclude any other test setup files or directories
  ],
  setupFiles: ['<rootDir>/src/tests/setupJest.js'],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
};