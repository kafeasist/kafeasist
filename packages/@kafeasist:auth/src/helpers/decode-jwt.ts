export const decodeJwt = (token: string) => {
  const payload = token.split(".")[1];
  if (!payload) return null;

  return JSON.parse(Buffer.from(payload, "base64").toString());
};
