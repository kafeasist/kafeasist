export type Session = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  imageUrl: string | null;
  emailVerified: Date | null;
  twoFA: boolean;
};
