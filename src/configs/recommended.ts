export = {
  plugins: ["@maccuaa/i18n-json"],
  rules: {
    "@maccuaa/i18n-json/valid-json": 2,
    "@maccuaa/i18n-json/sorted-keys": [
      2,
      {
        order: "asc",
        indentSpaces: 2,
      },
    ],
    "@maccuaa/i18n-json/identical-keys": 0,
  },
};
