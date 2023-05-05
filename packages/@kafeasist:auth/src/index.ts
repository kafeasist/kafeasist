export * from "./routes/register";
export * from "./routes/login";
export * from "./routes/forgotPassword";

export { getSessionFromCookie } from "./helpers/getSessionFromCookie";
export { setCookie } from "./helpers/setCookie";
export { removeCookie } from "./helpers/removeCookie";
export { validatePhone, validateName } from "./helpers/validators";

export * from "./types/AuthResponse";
export * from "./types/Session";

export { COOKIE_NAME } from "./config";
