export const prettifyDate = (
  date: Date,
  type: "long" | "short" | "numeric" = "long",
) => {
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: type,
    day: "numeric",
  });
};
