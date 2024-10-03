import { CreditCard } from "@prisma/client";

import { prisma } from "@kafeasist/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { KafeasistResponse } from "../types/KafeasistResponse";

export const creditCardRouter = createTRPCRouter({
  /**
   * Get credit cards
   * @param ctx
   * @param input
   * @returns Promise<KafeasistResponse>
   */
  get: protectedProcedure.query(
    async ({
      ctx,
      input,
    }): Promise<KafeasistResponse<typeof input> & { card?: CreditCard }> => {
      const card = await prisma.creditCard.findUnique({
        where: {
          userId: ctx.session.id,
        },
      });

      if (!card)
        return {
          error: true,
          message: "Herhangi bir kredi kartı bulunamadı.",
          fields: [],
        };

      return {
        error: false,
        message: "Kredi kartı bulundu.",
        card,
      };
    },
  ),
});
