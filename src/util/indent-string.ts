interface Options {
  indent?: string;
  includeEmptyLines?: boolean;
}

export const indentString = (string: string, count = 1, options: Options = {}): string => {
  const { indent = " ", includeEmptyLines = false } = options;

  if (count < 0) {
    throw new RangeError(`Expected \`count\` to be at least 0, got \`${count}\``);
  }

  if (count === 0) {
    return string;
  }

  const regex = includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;

  return string.replace(regex, indent.repeat(count));
};
