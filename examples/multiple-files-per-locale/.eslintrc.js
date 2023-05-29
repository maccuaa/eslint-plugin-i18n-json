const path = require("path");

module.exports = {
  root: true,
  extends: ["plugin:@maccuaa/i18n-json/recommended"],
  rules: {
    "@maccuaa/i18n-json/identical-keys": [
      2,
      {
        filePath: {
          "login.json": path.resolve("./translations/en-US/login.json"),
          "search-results.json": path.resolve("./translations/en-US/search-results.json"),
          "todos.json": path.resolve("./translations/en-US/todos.json"),
        },
      },
    ],
  },
};
