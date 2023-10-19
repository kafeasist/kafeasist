import { hash, verify } from "argon2";
import { z } from "zod";

import { validateNameLastName } from "@kafeasist/auth";
import { validatePassword } from "@kafeasist/auth/src/helpers/validators";
import { prisma } from "@kafeasist/db";
import { Cache, invalidateCache } from "@kafeasist/redis";

import { createTRPCRouter, protectedProcedure } from "../trpc";
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
        if (!ctx.session)
          return { error: true, message: "Oturum açın", fields: [] };

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
        if (!ctx.session)
          return { error: true, message: "Oturum açın", fields: [] };

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
});
