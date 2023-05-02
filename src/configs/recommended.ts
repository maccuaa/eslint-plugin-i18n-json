export = {
  plugins: ["i18n-json"],
  rules: {
    "i18n-json/valid-json": 2,
    "i18n-json/sorted-keys": [
      2,
      {
        order: "asc",
        indentSpaces: 2,
      },
    ],
    "i18n-json/identical-keys": 2,
  },
};
