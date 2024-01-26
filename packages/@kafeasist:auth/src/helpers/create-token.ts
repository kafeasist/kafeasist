import { sign } from "jsonwebtoken";

import { JWT_SECRET, JWT_SIGNING_OPTIONS } from "../config";

export const createToken = (payload: any) =>
  sign(payload, JWT_SECRET, JWT_SIGNING_OPTIONS);
