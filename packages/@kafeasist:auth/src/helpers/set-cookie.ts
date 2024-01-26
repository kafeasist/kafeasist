import { serialize, type CookieSerializeOptions } from "cookie";

import { Cache, invalidateCache } from "@kafeasist/redis";

import { COOKIE_NAME } from "../config";
import { Session } from "../types/Session";
import { createToken } from "./create-token";

const defaultCookieOptions: CookieSerializeOptions = {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV !== "development",
};

/**
 * Set a session cookie
 * @param res NextApiResponse
 * @param user Session user
 * @param name Cookie name (default: COOKIE_NAME)
 * @param options Cookie options (default: defaultCookieOptions)
 * @returns void
 */
export const setCookie = async (
  headers: Headers,
  user: Session,
  name: string = COOKIE_NAME,
  options: CookieSerializeOptions = defaultCookieOptions,
) => {
  options = { ...defaultCookieOptions, ...options };

  const value = createToken({ id: user.id });

  if (typeof options.maxAge === "number")
    options.expires = new Date(Date.now() + options.maxAge * 1000);

  const cookie = serialize(name, value, options);
  headers.append("Set-Cookie", cookie);

  await invalidateCache(Cache.SESSION + user.id);
};
