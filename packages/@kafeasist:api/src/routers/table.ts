import { Table } from "@prisma/client";
import { z } from "zod";

import { validateName } from "@kafeasist/auth";
import {
  Cache,
  invalidateCache,
  readCache,
  REDIS_TTL,
  setCache,
} from "@kafeasist/redis";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { KafeasistResponse } from "../types/KafeasistResponse";

export const tableRouter = createTRPCRouter({
  /**
   * Get all tables for a company
   * @access protected
   * @param {number} companyId - The company id
   * @returns {Table[]} - The tables
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
      }): Promise<KafeasistResponse<typeof input> & { tables?: Table[] }> => {
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

        const tables = await readCache<Table[]>(Cache.TABLE + input.companyId);

        if (!tables) {
          const tablesDb = await ctx.prisma.table.findMany({
            where: {
              companyId: input.companyId,
            },
          });

          if (!tablesDb)
            return { error: false, message: "Masalar bulunamadı.", tables: [] };

          await setCache(Cache.TABLE + input.companyId, tablesDb, REDIS_TTL);

          return {
            error: false,
            message: "Masalar getirildi.",
            tables: tablesDb,
          };
        }

        return { error: false, message: "Masalar getirildi.", tables };
      },
    ),

  /**
   * Get tables by place id
   * @access protected
   * @param {number} placeId - The place id
   * @returns {Table[]} - The tables
   */
  getByPlaceId: protectedProcedure
    .input(
      z.object({
        placeId: z.number(),
      }),
    )
    .query(
      async ({
        ctx,
        input,
      }): Promise<KafeasistResponse<typeof input> & { tables?: Table[] }> => {
        const place = await ctx.prisma.place.findFirst({
          where: {
            id: input.placeId,
            company: {
              user: {
                id: ctx.session.id,
              },
            },
          },
        });

        if (!place)
          return { error: true, message: "Mekan bulunamadı", fields: [] };

        const tables = await ctx.prisma.table.findMany({
          where: {
            placeId: input.placeId,
          },
        });

        if (!tables)
          return { error: false, message: "Masalar bulunamadı.", tables: [] };

        return { error: false, message: "Masalar getirildi.", tables };
      },
    ),

  /**
   * Create a table
   * @access protected
   * @param {number} companyId - The company id
   * @param {string} name - The table name
   * @param {string} description - The table description
   * @returns {Table} - The created table
   */
  create: protectedProcedure
    .input(
      z.object({
        placeId: z.number(),
        companyId: z.number(),
        name: z.string(),
        description: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<KafeasistResponse<typeof input> & { table?: Table }> => {
        try {
          validateName(input.name);
        } catch (error: unknown) {
          if (error instanceof Error) {
            return { error: true, message: error.message, fields: [] };
          }
        }

        const place = await ctx.prisma.place.findFirst({
          where: {
            id: input.placeId,
            company: {
              user: {
                id: ctx.session.id,
              },
            },
          },
        });

        if (!place)
          return { error: true, message: "Mekan bulunamadı", fields: [] };

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

        const table = await ctx.prisma.table.create({
          data: {
            name: input.name,
            description: input.description,
            place: {
              connect: {
                id: input.placeId,
              },
            },
            company: {
              connect: {
                id: input.companyId,
              },
            },
          },
        });

        if (!table)
          return { error: true, message: "Masa oluşturulamadı", fields: [] };

        await invalidateCache(Cache.TABLE + input.companyId);

        return { error: false, message: "Masa oluşturuldu", table };
      },
    ),

  /**
   * Update a table
   * @access protected
   * @param {number} tableId - The table id
   * @param {string} name - The table name
   * @param {string} description - The table description
   * @returns {Table} - The updated table
   */
  update: protectedProcedure
    .input(
      z.object({
        tableId: z.number(),
        name: z.string(),
        description: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<KafeasistResponse<typeof input> & { table?: Table }> => {
        try {
          validateName(input.name);
        } catch (error: unknown) {
          if (error instanceof Error) {
            return { error: true, message: error.message, fields: [] };
          }
        }

        const table = await ctx.prisma.table.findFirst({
          where: {
            id: input.tableId,
            company: {
              user: {
                id: ctx.session.id,
              },
            },
          },
        });

        if (!table)
          return { error: true, message: "Masa bulunamadı.", fields: [] };

        const updatedTable = await ctx.prisma.table.update({
          where: {
            id: input.tableId,
          },
          data: {
            name: input.name,
            description: input.description,
          },
        });

        await invalidateCache(Cache.TABLE + table.companyId);

        return {
          error: false,
          message: "Masa güncellendi",
          table: updatedTable,
        };
      },
    ),

  /**
   * Delete a table
   * @access protected
   * @param {number} tableId - The table id
   */
  delete: protectedProcedure
    .input(
      z.object({
        tableId: z.number(),
      }),
    )
    .mutation(
      async ({ ctx, input }): Promise<KafeasistResponse<typeof input>> => {
        const table = await ctx.prisma.table.findFirst({
          where: {
            id: input.tableId,
            company: {
              user: {
                id: ctx.session.id,
              },
            },
          },
        });

        if (!table)
          return { error: true, message: "Masa bulunamadı.", fields: [] };

        await ctx.prisma.table.delete({
          where: {
            id: input.tableId,
          },
        });

        await invalidateCache(Cache.TABLE + table.companyId);

        return {
          error: false,
          message: "Masa silindi",
        };
      },
    ),
});
