import { User } from "./User";

export type AuthResponse =
  | {
      success: true;
      token: string;
      user: User;
    }
  | {
      success: false;
      message: string;
      fields: string | string[];
    };
