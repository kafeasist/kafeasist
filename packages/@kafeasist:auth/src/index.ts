export * from "./routes/register";
export * from "./routes/login";
export * from "./routes/forgot-password";

export { getSessionFromCookie } from "./helpers/get-session-from-cookie";
export { setCookie } from "./helpers/set-cookie";
export { removeCookie } from "./helpers/remove-cookie";
export { validatePhone, validateName } from "./helpers/validators";

export * from "./types/AuthResponse";
export * from "./types/Session";

export { COOKIE_NAME } from "./config";
