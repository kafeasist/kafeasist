import { Session } from "./Session";

export type AuthResponse<T> =
  | {
      success: true;
      token: string;
      session: Session;
    }
  | {
      success: false;
      message: string;
      fields: (keyof T)[];
    };
