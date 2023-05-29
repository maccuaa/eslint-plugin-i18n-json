const path = require("path");

module.exports = {
  root: true,
  extends: ["plugin:@maccuaa/i18n-json/recommended"],
  settings: {
    /*
      None of the key paths listed below
      will be checked for valid i18n syntax
      nor used in the identical-keys rule comparison.
      (if the key path points to an object, the object is ignored)
    */
    "i18n-json/ignore-keys": ["translationMetadata", "login.form.inProgressTranslationKey"],
  },
  rules: {
    "@maccuaa/i18n-json/identical-keys": [
      2,
      {
        filePath: path.resolve("./translations/en-US/index.json"),
      },
    ],
  },
};
