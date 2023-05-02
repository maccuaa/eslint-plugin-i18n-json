export const plur = (word = "", count = 0) => {
  const isLower = word.charAt(0) === word.charAt(0).toLowerCase();
  const plural = word.concat(isLower ? "s" : "S");
  return Math.abs(count) > 1 ? plural : word;
};
