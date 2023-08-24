export const getFirstLetter = (text: string) => {
  return text
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("");
};
