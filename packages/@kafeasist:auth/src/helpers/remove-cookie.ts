import { COOKIE_NAME } from "../config";
import { serialize } from "cookie";
import { NextApiResponse } from "next";

/**
 * Remove a session cookie
 * @param res NextApiResponse
 * @param name Cookie name to remove (default: COOKIE_NAME)
 * @returns void
 */
export const removeCookie = (
  res: NextApiResponse,
  name: string = COOKIE_NAME,
) => {
  res.setHeader("Set-Cookie", serialize(name, "", { maxAge: -1, path: "/" }));
};
