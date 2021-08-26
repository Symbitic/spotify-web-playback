module.exports = {
  moduleDirectories: ['node_modules', 'src', './'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
  testEnvironment: 'jsdom',
  testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
  testURL: 'http://localhost:8989/',
  verbose: false,
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
