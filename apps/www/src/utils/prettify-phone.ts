export const prettifyPhone = (phone: string): string => {
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{2})(\d{2})$/);

  if (match) {
    var intlCode = match[1] ? "+90 " : "";
    return [
      intlCode,
      "(",
      match[2],
      ") ",
      match[3],
      " ",
      match[4],
      " ",
      match[5],
    ].join("");
  }

  return phone;
};
