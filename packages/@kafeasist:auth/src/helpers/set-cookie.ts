import { serialize, type CookieSerializeOptions } from "cookie";
import { stringify } from "superjson";

import { COOKIE_NAME } from "../config";

const defaultCookieOptions: CookieSerializeOptions = {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV !== "development",
};

/**
 * Set a session cookie
 * @param res NextApiResponse
 * @param value Cookie value
 * @param name Cookie name (default: COOKIE_NAME)
 * @param options Cookie options (default: defaultCookieOptions)
 * @returns void
 * @see https://nextjs.org/docs/api-routes/request-helpers#extending-the-reqres-objects-with-typescript
 */
export const setCookie = (
  headers: Headers,
  value: unknown,
  name: string = COOKIE_NAME,
  options: CookieSerializeOptions = defaultCookieOptions,
) => {
  options = { ...defaultCookieOptions, ...options };

  const stringValue =
    typeof value === "object" ? "j:" + stringify(value) : String(value);

  if (typeof options.maxAge === "number")
    options.expires = new Date(Date.now() + options.maxAge * 1000);

  headers.append("Set-Cookie", serialize(name, stringValue, options));
};
