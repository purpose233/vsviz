const base = require("./jest.config.base.js");

module.exports = {
  ...base,
  projects:
  [
      "<rootDir>/packages/builder/jest.config.js"
  ],
  coverageDirectory: "<rootDir>/coverage/"
};
