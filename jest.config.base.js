module.exports = {
  roots: [
    "<rootDir>/packages"
    // "<rootDir>/src",
    // "<rootDir>/__tests__"
  ],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testRegex: "(/__tests__/.*.(test|spec)).(js?|ts?)$",
  testPathIgnorePatterns: [
    '/node_modules/',
    '(/__tests__/.*|(\\.|/)(test|spec))\\.d\.ts$'
  ],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "(__tests__/.*.mock).(jsx?|tsx?)$",
    "/node_modules/",
    "/lib/"
  ],
  verbose: true
};
