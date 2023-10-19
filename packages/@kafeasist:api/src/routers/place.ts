import { Place } from "@prisma/client";
import { z } from "zod";

import {
  Cache,
  invalidateCache,
  readCache,
  REDIS_TTL,
  setCache,
} from "@kafeasist/redis";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { KafeasistResponse } from "../types/KafeasistResponse";

export const placeRouter = createTRPCRouter({
  /**
   * Get all places for a company
   * @access protected
   * @param {number} companyId - The company id
   * @returns {Place[]} - The places
   */
  getAll: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
      }),
    )
    .query(
      async ({
        ctx,
        input,
      }): Promise<KafeasistResponse<typeof input> & { places?: Place[] }> => {
        if (!ctx.session)
          return { error: true, message: "Oturum açın", fields: [] };

        const company = await ctx.prisma.company.findFirst({
          where: {
            id: input.companyId,
            user: {
              id: ctx.session.id,
            },
          },
        });

        if (!company)
          return { error: true, message: "Şirket bulunamadı", fields: [] };

        const places = await readCache<Place[]>(Cache.PLACE + input.companyId);

        if (!places) {
          const placesDb = await ctx.prisma.place.findMany({
            where: {
              companyId: input.companyId,
            },
          });

          if (!placesDb)
            return {
              error: false,
              message: "Mekanlar bulunamadı.",
              places: [],
            };

          await setCache(Cache.PLACE + input.companyId, placesDb, REDIS_TTL);

          return {
            error: false,
            message: "Mekanlar getirildi.",
            places: placesDb,
          };
        }

        return { error: false, message: "Mekanlar getirildi.", places };
      },
    ),

  /**
   * Create a place
   * @access protected
   * @param {number} companyId - The company id
   * @param {string} name - The place name
   * @returns {Place} - The created place
   */
  create: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
        name: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<KafeasistResponse<typeof input> & { place?: Place }> => {
        if (!ctx.session)
          return { error: true, message: "Oturum açın", fields: [] };

        const company = await ctx.prisma.company.findFirst({
          where: {
            id: input.companyId,
            user: {
              id: ctx.session.id,
            },
          },
        });

        if (!company)
          return { error: true, message: "Şirket bulunamadı", fields: [] };

        const placeExists = await ctx.prisma.place.findFirst({
          where: {
            name: input.name,
            companyId: input.companyId,
          },
        });

        if (placeExists)
          return {
            error: true,
            message: "Mekan zaten var",
            fields: ["name"],
          };

        const place = await ctx.prisma.place.create({
          data: {
            name: input.name,
            company: {
              connect: {
                id: input.companyId,
              },
            },
          },
        });

        await invalidateCache(Cache.PLACE + input.companyId);

        return { error: false, message: "Mekan oluşturuldu.", place };
      },
    ),
});
