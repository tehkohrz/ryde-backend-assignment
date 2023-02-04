export default {
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',
  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ['node_modules'],
  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'node', 'json'],
  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  collectCoverageFrom: ['**/*.{js}', '!**/node_modules/**'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: { '\\.[jt]sx?$': 'babel-jest' },
};
