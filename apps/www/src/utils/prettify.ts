export const prettifyString = (str: string | undefined, len: number) => {
  if (!str) return "";

  return str.length > len ? str.slice(0, len - 1) + "…" : str;
};
