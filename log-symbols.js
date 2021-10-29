const c = require("./colors");

function isUnicodeSupported() {
  if (process.platform !== "win32") {
    return process.env.TERM !== "linux"; // Linux console (kernel)
  }

  return (
    Boolean(process.env.CI) ||
    Boolean(process.env.WT_SESSION) || // Windows Terminal
    process.env.ConEmuTask === "{cmd::Cmder}" || // ConEmu and cmder
    process.env.TERM_PROGRAM === "vscode" ||
    process.env.TERM === "xterm-256color" ||
    process.env.TERM === "alacritty"
  );
}

const main = {
  info: c.blue("ℹ"),
  success: c.green("✔"),
  warning: c.yellow("⚠"),
  error: c.red("✖")
};

const fallback = {
  info: c.blue("i"),
  success: c.green("√"),
  warning: c.yellow("‼"),
  error: c.red("×")
};

const logSymbols = isUnicodeSupported() ? main : fallback;

module.exports = logSymbols;
