const path = require("path");

module.exports = {
  root: true,
  extends: ["plugin:@maccuaa/i18n-json/recommended"],
  rules: {
    "@maccuaa/i18n-json/identical-keys": [
      2,
      {
        filePath: path.resolve("./src/i18n/en-US.json"),
      },
    ],
  },
};
