import { serialize } from "cookie";

import { COOKIE_NAME } from "../config";

/**
 * Remove a session cookie
 * @param res NextApiResponse
 * @param name Cookie name to remove (default: COOKIE_NAME)
 * @returns void
 */
export const removeCookie = (headers: Headers, name: string = COOKIE_NAME) => {
  headers.append("Set-Cookie", serialize(name, "", { maxAge: -1, path: "/" }));
};
