export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: ['**/Test/**/*.spec.js', '**/Test/**/*.test.js', '**/*.spec.js', '**/*.test.js']
};

