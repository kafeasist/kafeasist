import { JWT_SECRET, JWT_SIGNING_OPTIONS } from "../config";
import { AuthResponse } from "../types/AuthResponse";
import { Session } from "../types/Session";
import { prisma } from "@kafeasist/db";
import { hash } from "argon2";
import { sign } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

interface RegisterParams {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validateName = (firstName: string, lastName: string) => {
  if (firstName.length < 2)
    throw new Error("Ad bölümü en az 2 karakter olmalıdır");

  if (lastName.length < 2)
    throw new Error("Soyad bölümü en az 2 karakter olmalıdır");

  if (firstName.length > 20)
    throw new Error("Ad bölümü en fazla 20 karakter olmalıdır");

  if (lastName.length > 20)
    throw new Error("Ad bölümü en fazla 20 karakter olmalıdır");
};

const validatePhone = (phone: string) => {
  if (phone.length !== 10)
    throw new Error("Telefon numarası 10 karakter olmalıdır");

  if (!phone.startsWith("5"))
    throw new Error("Telefon numarası 5 ile başlamalıdır");

  if (!/^\d+$/.test(phone))
    throw new Error("Telefon numarası sadece rakamlardan oluşmalıdır");
};

const validateEmail = (email: string) => {
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
    throw new Error("Lütfen geçerli bir e-posta adresi giriniz");
};

const validatePassword = (password: string) => {
  if (password.length < 8) throw new Error("Şifre en az 8 karakter olmalıdır");
  if (password.length > 24)
    throw new Error("Şifre en fazla 24 karakter olmalıdır");
  if (!/[a-z]/.test(password))
    throw new Error("Şifre en az bir küçük harf içermelidir");
  if (!/[A-Z]/.test(password))
    throw new Error("Şifre en az bir büyük harf içermelidir");
  if (!/[0-9]/.test(password))
    throw new Error("Şifre en az bir rakam içermelidir");
};

export const register = async (
  params: RegisterParams,
): Promise<AuthResponse> => {
  const { firstName, lastName } = params;

  try {
    validateName(firstName, lastName);
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        success: false,
        message: error.message,
        fields: ["firstName", "lastName"],
      };
  }

  const { phone } = params;

  try {
    validatePhone(phone);
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        success: false,
        message: error.message,
        fields: "phone",
      };
  }

  const { email } = params;

  try {
    validateEmail(email);
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        success: false,
        message: error.message,
        fields: "email",
      };
  }

  const { password } = params;

  try {
    validatePassword(password);
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        success: false,
        message: error.message,
        fields: "password",
      };
  }

  const { confirmPassword } = params;

  if (password !== confirmPassword)
    return {
      success: false,
      message: "Girilen şifreler birbiriyle uyuşmuyor",
      fields: ["password", "confirmPassword"],
    };

  const token = uuidv4();
  const hashedPassword = await hash(password);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      token,
      isVerified: false,
    },
  });

  if (!user)
    return {
      success: false,
      message: "Bilinmeyen bir hata oluştu",
      fields: "",
    };

  if (user instanceof Error) {
    if (user.message.includes("email"))
      return {
        success: false,
        message: "Bu e-posta adresi zaten kullanımda",
        fields: "email",
      };
    if (user.message.includes("phone"))
      return {
        success: false,
        message: "Bu telefon numarası zaten kullanımda",
        fields: "phone",
      };
  }

  const session: Session = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    isVerified: false,
  };

  const jwt = sign(session, JWT_SECRET, JWT_SIGNING_OPTIONS);

  return {
    success: true,
    token: jwt,
    session,
  };
};
