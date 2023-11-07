import { z } from "zod";

import { prisma } from "@kafeasist/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { KafeasistResponse } from "../types/KafeasistResponse";

export const notificationRouter = createTRPCRouter({
  /**
   * Get the notifications of the user
   * @param ctx
   * @returns The notifications of the user
   */
  getAll: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session)
      return { error: true, message: "Oturum açın", fields: [] };

    const notifications = await prisma.notification.findMany({
      where: {
        userId: ctx.session.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!notifications)
      return {
        error: true,
        message: "Bir hata oluştu.",
        fields: [],
      };

    return { error: false, data: notifications };
  }),

  /**
   * Delete a notification of the user
   * @param ctx
   * @param input
   * @returns Promise<KafeasistResponse>
   */
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(
      async ({ ctx, input }): Promise<KafeasistResponse<typeof input>> => {
        if (!ctx.session)
          return { error: true, message: "Oturum açın", fields: [] };

        const notification = await prisma.notification.findFirst({
          where: {
            id: input.id,
            userId: ctx.session.id,
          },
        });

        if (!notification)
          return {
            error: true,
            message: "Bu bildirim size ait değil.",
            fields: [],
          };

        await prisma.notification.delete({
          where: {
            id: input.id,
          },
        });

        return {
          error: false,
          message: "Bildirim başarıyla silindi.",
        };
      },
    ),
});
