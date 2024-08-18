import crypto from "node:crypto";
import { hash, verify } from "argon2";
import { encode } from "hi-base32";
import { TOTP } from "otpauth";
import QRCode from "qrcode";
import { z } from "zod";

import {
  sendVerificationEmail,
  validateNameLastName,
  verifyEmail,
} from "@kafeasist/auth";
import { validatePassword } from "@kafeasist/auth/src/helpers/validators";
import { prisma } from "@kafeasist/db";
import { Cache, invalidateCache } from "@kafeasist/redis";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { KafeasistResponse } from "../types/KafeasistResponse";

export const userRouter = createTRPCRouter({
  /**
   * Edit name and surname
   * @param ctx
   * @param input
   * @returns Promise<KafeasistResponse>
   */
  update: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
      }),
    )
    .mutation(
      async ({ ctx, input }): Promise<KafeasistResponse<typeof input>> => {
        try {
          validateNameLastName(input.firstName, input.lastName);
        } catch (error: unknown) {
          if (error instanceof Error)
            return {
              error: true,
              message: error.message,
              fields: ["firstName", "lastName"],
            };
        }

        await prisma.user.update({
          where: {
            id: ctx.session.id,
          },
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
          },
        });

        const response = await invalidateCache(Cache.SESSION + ctx.session.id);

        if (response instanceof Error) {
          return {
            error: false,
            message:
              "Kullanıcı bilgileri güncellendi. Değişiklikleri görmek için sayfayı yenileyin.",
          };
        }

        return {
          error: false,
          message: "Kullanıcı bilgileri güncellendi",
        };
      },
    ),

  /**
   * Change password
   * @param ctx
   * @param input
   * @returns Promise<KafeasistResponse>
   */
  changePassword: protectedProcedure
    .input(
      z.object({
        oldPassword: z.string(),
        newPassword: z.string(),
        newPasswordAgain: z.string(),
      }),
    )
    .mutation(
      async ({ ctx, input }): Promise<KafeasistResponse<typeof input>> => {
        if (input.newPassword !== input.newPasswordAgain)
          return {
            error: true,
            message: "Yeni şifreler eşleşmiyor",
            fields: ["newPassword", "newPasswordAgain"],
          };

        try {
          validatePassword(input.newPassword);
        } catch (error: unknown) {
          if (error instanceof Error)
            return {
              error: true,
              message: error.message,
              fields: ["newPassword", "newPasswordAgain"],
            };
        }

        const user = await prisma.user.findUnique({
          where: {
            id: ctx.session.id,
          },
        });

        if (!user) {
          return {
            error: true,
            message: "Kullanıcı bulunamadı",
            fields: [],
          };
        }

        if (!(await verify(user.password, input.oldPassword))) {
          return {
            error: true,
            message: "Eski şifre hatalı",
            fields: ["oldPassword"],
          };
        }

        if (input.oldPassword === input.newPassword)
          return {
            error: true,
            message: "Yeni şifre eskisiyle aynı olamaz",
            fields: ["newPassword", "newPasswordAgain"],
          };

        const hashedPassword = await hash(input.newPassword);
        try {
          await prisma.user.update({
            where: {
              id: ctx.session.id,
            },
            data: {
              password: hashedPassword,
            },
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            return {
              error: true,
              message: "Şifre değiştirilirken bir hata oluştu",
              fields: ["newPassword", "newPasswordAgain"],
            };
          }
        }

        return {
          error: false,
          message: "Şifre başarıyla değiştirildi",
        };
      },
    ),

  /**
   * Verify e-mail
   * @param ctx
   * @param input
   * @returns Promise<KafeasistResponse>
   */
  verifyEmail: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .mutation(async ({ input }): Promise<KafeasistResponse<typeof input>> => {
      const { token } = input;

      const response = await verifyEmail({ token });

      if (!response.success) {
        return {
          error: true,
          message: response.message,
          fields: [],
        };
      }

      return {
        error: false,
        message: response.message,
      };
    }),

  /**
   * Resend verification e-mail
   * @param ctx
   * @param input
   * @returns Promise<KafeasistResponse>
   */
  resendVerificationEmail: protectedProcedure.mutation(
    async ({ ctx, input }): Promise<KafeasistResponse<typeof input>> => {
      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.id,
        },
      });

      if (!user) {
        return {
          error: true,
          message: "Kullanıcı bulunamadı",
          fields: [],
        };
      }

      if (user.emailVerified)
        return {
          error: true,
          message: "E-posta zaten doğrulanmış",
          fields: [],
        };

      await sendVerificationEmail(user.email);

      return {
        error: false,
        message: "Doğrulama e-postası tekrar gönderildi!",
      };
    },
  ),

  /**
   * 2FA generate secret
   * @param ctx
   * @param input
   * @returns Promise<KafeasistResponse>
   */
  generate2FA: protectedProcedure.mutation(
    async ({ ctx, input }): Promise<KafeasistResponse<typeof input>> => {
      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.id,
        },
      });

      if (!user) {
        return {
          error: true,
          message: "Kullanıcı bulunamadı",
          fields: [],
        };
      }

      if (user.twoFA)
        return {
          error: true,
          message: "Çift faktörlü kimlik doğrulama zaten etkin",
          fields: [],
        };

      const buffer = crypto.randomBytes(15);
      const secret = encode(buffer).replace(/=/g, "").substring(0, 24);

      const totp = new TOTP({
        issuer: "kafeasist",
        label: user.email,
        algorithm: "SHA1",
        digits: 6,
        secret,
      });

      const otpauthURL = totp.toString();
      const qrCodeURL = await QRCode.toDataURL(otpauthURL, {
        color: {
          light: "#FEFDFA",
          dark: "#141414",
        },
        margin: 0,
      });

      await prisma.user.update({
        where: {
          id: ctx.session.id,
        },
        data: {
          twoFASecret: secret,
        },
      });

      return {
        error: false,
        message: qrCodeURL,
      };
    },
  ),

  /**
   * 2FA verify
   * @param ctx
   * @param input
   * @returns Promise<KafeasistResponse>
   */
  verify2FA: protectedProcedure
    .input(
      z.object({
        pin: z.string(),
      }),
    )
    .mutation(
      async ({ ctx, input }): Promise<KafeasistResponse<typeof input>> => {
        const user = await prisma.user.findUnique({
          where: {
            id: ctx.session.id,
          },
        });

        if (!user) {
          return {
            error: true,
            message: "Kullanıcı bulunamadı",
            fields: [],
          };
        }

        if (!user.twoFASecret)
          return {
            error: true,
            message:
              "Lütfen önce çift faktörlü kimlik doğrulama kodu oluşturun.",
            fields: [],
          };

        const totp = new TOTP({
          issuer: "kafeasist",
          label: user.email,
          algorithm: "SHA1",
          digits: 6,
          secret: user.twoFASecret,
        });

        const isValid = totp.validate({ token: input.pin });

        if (isValid == null)
          return {
            error: true,
            message: "Girdiğiniz kimlik doğrulama kodu hatalı.",
            fields: ["pin"],
          };

        function generateRecoveryCode() {
          const LENGTH = 9;

          let result = "";
          const characters = "abcdefghijklmnopqrstuvwxyz";
          const charactersLength = characters.length;
          let counter = 0;
          while (counter < LENGTH) {
            result += characters.charAt(
              Math.floor(Math.random() * charactersLength),
            );
            counter += 1;
          }

          return result;
        }

        const mfaCodes = [
          generateRecoveryCode(),
          generateRecoveryCode(),
          generateRecoveryCode(),
          generateRecoveryCode(),
          generateRecoveryCode(),
          generateRecoveryCode(),
          generateRecoveryCode(),
          generateRecoveryCode(),
          generateRecoveryCode(),
        ] as const;

        await prisma.mFACodes.create({
          data: {
            userId: user.id,
            codeOne: await hash(mfaCodes[0]),
            codeTwo: await hash(mfaCodes[1]),
            codeThree: await hash(mfaCodes[2]),
            codeFour: await hash(mfaCodes[3]),
            codeFive: await hash(mfaCodes[4]),
            codeSix: await hash(mfaCodes[5]),
            codeSeven: await hash(mfaCodes[6]),
            codeEight: await hash(mfaCodes[7]),
            codeNine: await hash(mfaCodes[8]),
          },
        });

        await prisma.user.update({
          where: {
            id: ctx.session.id,
          },
          data: {
            twoFA: true,
          },
        });

        await invalidateCache(Cache.SESSION + ctx.session.id);

        return {
          error: false,
          message: mfaCodes.join(" "),
        };
      },
    ),

  /**
   * 2FA disable
   * @param ctx
   * @param input
   * @returns Promise<KafeasistResponse>
   */
  disable2FA: protectedProcedure.mutation(
    async ({ ctx, input }): Promise<KafeasistResponse<typeof input>> => {
      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.id,
        },
      });

      if (!user) {
        return {
          error: true,
          message: "Kullanıcı bulunamadı",
          fields: [],
        };
      }

      if (!user.twoFA)
        return {
          error: true,
          message: "Çift faktörlü kimlik doğrulama zaten devre dışı",
          fields: [],
        };

      await prisma.user.update({
        where: {
          id: ctx.session.id,
        },
        data: {
          twoFA: false,
          twoFASecret: null,
        },
      });

      await invalidateCache(Cache.SESSION + ctx.session.id);

      return {
        error: false,
        message:
          "Çift faktörlü kimlik doğrulama hesabınızdan devre dışı bırakıldı.",
      };
    },
  ),
});
