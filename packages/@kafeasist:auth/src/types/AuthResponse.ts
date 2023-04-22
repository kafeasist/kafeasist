import { Session } from "./Session";

export type AuthResponse =
  | {
      success: true;
      token: string;
      session: Session;
    }
  | {
      success: false;
      message: string;
      fields: string | string[];
    };
