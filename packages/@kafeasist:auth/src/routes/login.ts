import { hash, verify } from "argon2";
import { TOTP } from "otpauth";

import { prisma } from "@kafeasist/db";
import { Cache, invalidateCache } from "@kafeasist/redis";

import { createToken } from "../helpers/create-token";
import { AuthResponse } from "../types/AuthResponse";
import { Session } from "../types/Session";

interface LoginParams {
  email: string;
  password: string;
  pin?: string;
  recovery1?: string;
  recovery2?: string;
}

export const login = async (
  params: LoginParams,
): Promise<AuthResponse<LoginParams>> => {
  const { email, password } = params;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user)
    return {
      success: false,
      message: "E-posta veya şifre hatalı",
      fields: ["email", "password"],
    };

  if (!(await verify(user.password, password)))
    return {
      success: false,
      message: "E-posta veya şifre hatalı",
      fields: ["email", "password"],
    };

  if (user.twoFA && !params.pin && !params.recovery1 && !params.recovery2)
    return {
      success: false,
      message: "REDIRECT_TO_2FA", // Special case for 2FA
      fields: ["pin"],
    };

  if (user.twoFA && params.pin) {
    const totp = new TOTP({
      issuer: "kafeasist",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      secret: user.twoFASecret!,
    });

    const isValid = totp.validate({ token: params.pin });

    if (isValid == null)
      return {
        success: false,
        message: "Girdiğiniz kimlik doğrulama kodu hatalı.",
        fields: ["pin"],
      };
  }

  if (user.twoFA && params.recovery1 && params.recovery2) {
    console.log("here");
    const mfaCodes = [
      await hash(params.recovery1),
      await hash(params.recovery2),
    ];
    if (mfaCodes.length !== 2)
      return {
        success: false,
        message: "Kurtarma kodları eksik.",
        fields: ["recovery1", "recovery2"],
      };

    const codes = await prisma.mFACodes.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!codes)
      return {
        success: false,
        message:
          "Bir hata oluştu, hata düzelmezse lütfen destek@kafeasist.com adresine e-posta gönderin.",
        fields: ["recovery1", "recovery2"],
      };

    console.log("here 1");

    let found = 0;
    const foundCodes = {
      codeOne: "",
      codeTwo: "",
      codeThree: "",
      codeFour: "",
      codeFive: "",
      codeSix: "",
      codeSeven: "",
      codeEight: "",
      codeNine: "",
    };

    if (mfaCodes.includes(codes.codeOne)) {
      foundCodes.codeOne = codes.codeOne;
      found++;
    }
    if (mfaCodes.includes(codes.codeTwo)) {
      foundCodes.codeTwo = codes.codeTwo;
      found++;
    }
    if (mfaCodes.includes(codes.codeThree)) {
      foundCodes.codeThree = codes.codeThree;
      found++;
    }
    if (mfaCodes.includes(codes.codeFour)) {
      foundCodes.codeFour = codes.codeFour;
      found++;
    }
    if (mfaCodes.includes(codes.codeFive)) {
      foundCodes.codeFive = codes.codeFive;
      found++;
    }
    if (mfaCodes.includes(codes.codeSix)) {
      foundCodes.codeSix = codes.codeSix;
      found++;
    }
    if (mfaCodes.includes(codes.codeSeven)) {
      foundCodes.codeSeven = codes.codeSeven;
      found++;
    }
    if (mfaCodes.includes(codes.codeEight)) {
      foundCodes.codeEight = codes.codeEight;
      found++;
    }
    if (mfaCodes.includes(codes.codeNine)) {
      foundCodes.codeNine = codes.codeNine;
      found++;
    }

    console.log("here", found);

    if (found !== 2)
      return {
        success: false,
        message:
          "Girdiğiniz kurtarma kodları hatalı veya daha önce kullanılmış.",
        fields: ["recovery1", "recovery2"],
      };

    await prisma.mFACodes.update({
      where: {
        id: codes.id,
      },
      data: {
        codeOne: foundCodes.codeOne === codes.codeOne ? "USED" : codes.codeOne,
        codeTwo: foundCodes.codeTwo === codes.codeTwo ? "USED" : codes.codeTwo,
        codeThree:
          foundCodes.codeThree === codes.codeThree ? "USED" : codes.codeThree,
        codeFour:
          foundCodes.codeFour === codes.codeFour ? "USED" : codes.codeFour,
        codeFive:
          foundCodes.codeFive === codes.codeFive ? "USED" : codes.codeFive,
        codeSix: foundCodes.codeSix === codes.codeSix ? "USED" : codes.codeSix,
        codeSeven:
          foundCodes.codeSeven === codes.codeSeven ? "USED" : codes.codeSeven,
        codeEight:
          foundCodes.codeEight === codes.codeEight ? "USED" : codes.codeEight,
        codeNine:
          foundCodes.codeNine === codes.codeNine ? "USED" : codes.codeNine,
      },
    });
  }

  const session: Session = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    imageUrl: user.imageUrl,
    emailVerified: user.emailVerified,
    twoFA: user.twoFA,
  };

  const jwt = createToken({ id: user.id });
  await invalidateCache(Cache.COMPANY + user.id);

  return {
    success: true,
    token: jwt,
    session,
  };
};
