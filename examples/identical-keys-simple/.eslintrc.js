const path = require("path");

module.exports = {
  root: true, // since this example folder is embedded into the project. just ignore this.
  extends: ["plugin:@maccuaa/eslint-plugin-i18n-json/recommended"],
  rules: {
    // option for this rule the absolute path to the comparision file the plugin should require.
    "@maccuaa/i18n-json/identical-keys": [
      2,
      {
        filePath: path.resolve("./translations/en-US/index.json"),
      },
    ],
  },
};
