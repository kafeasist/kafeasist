import { Category } from "@prisma/client";
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

export const categoryRouter = createTRPCRouter({
  /**
   * Get all categories of a company
   * @access protected
   * @param {number} companyId - The id of the company
   * @returns {Category[]} categories - The categories of the company
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
      }): Promise<
        KafeasistResponse<typeof input> & { categories?: Category[] }
      > => {
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

        const categories = await readCache<Category[]>(
          Cache.CATEGORY + input.companyId,
        );

        if (!categories) {
          const categoriesDb = await ctx.prisma.category.findMany({
            where: {
              companyId: input.companyId,
            },
          });

          if (!categoriesDb)
            return {
              error: true,
              message: "Kategoriler bulunamadı",
              fields: [],
            };

          await setCache(
            Cache.CATEGORY + input.companyId,
            categoriesDb,
            REDIS_TTL,
          );

          return {
            error: false,
            message: "Kategoriler getirildi",
            categories: categoriesDb,
          };
        }

        return {
          error: false,
          message: "Kategoriler getirildi",
          categories,
        };
      },
    ),

  /**
   * Get a category by id
   * @access protected
   * @param {number} id - The id of the category
   * @returns {Category} category - The category
   */
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(
      async ({
        ctx,
        input,
      }): Promise<
        KafeasistResponse<typeof input> & { category?: Category }
      > => {
        const category = await ctx.prisma.category.findFirst({
          where: {
            id: input.id,
            company: {
              user: {
                id: ctx.session.id,
              },
            },
          },
        });

        if (!category)
          return { error: true, message: "Kategori bulunamadı", fields: [] };

        return {
          error: false,
          message: "Kategori getirildi",
          category,
        };
      },
    ),

  /**
   * Create a new category
   * @access protected
   * @param {number} companyId - The id of the company
   * @param {string} name - The name of the category
   * @param {string} description - The description of the category
   * @returns {Category} category - The created category
   */
  create: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
        description: z.string().optional(),
        name: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<
        KafeasistResponse<typeof input> & { category?: Category }
      > => {
        try {
          validateName(input.name);
        } catch (error: unknown) {
          if (error instanceof Error)
            return {
              error: true,
              message: error.message,
              fields: ["name"],
            };
        }

        const categoryWithSameName = await ctx.prisma.category.findFirst({
          where: {
            name: input.name,
            companyId: input.companyId,
          },
        });

        if (categoryWithSameName)
          return {
            error: true,
            message: "Bu isimde bir kategori zaten var",
            fields: ["name"],
          };

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

        const category = await ctx.prisma.category.create({
          data: {
            name: input.name,
            description: input.description,
            company: {
              connect: {
                id: input.companyId,
              },
            },
          },
        });

        await invalidateCache(Cache.CATEGORY + input.companyId);

        return {
          error: false,
          message: "Kategori başarıyla oluşturuldu.",
          category,
        };
      },
    ),

  /**
   * Update a category
   * @access protected
   * @param {number} id - The id of the category
   * @param {string} name - The name of the category
   * @param {string} description - The description of the category
   * @returns {Category} category - The updated category
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<
        KafeasistResponse<typeof input> & { category?: Category }
      > => {
        try {
          validateName(input.name);
        } catch (error: unknown) {
          if (error instanceof Error)
            return {
              error: true,
              message: error.message,
              fields: ["name"],
            };
        }

        const category = await ctx.prisma.category.findFirst({
          where: {
            id: input.id,
            company: {
              user: {
                id: ctx.session.id,
              },
            },
          },
        });

        if (!category)
          return { error: true, message: "Kategori bulunamadı", fields: [] };

        if (category.name !== input.name) {
          const categoryWithSameName = await ctx.prisma.category.findFirst({
            where: {
              name: input.name,
              companyId: category.companyId,
            },
          });

          if (categoryWithSameName)
            return {
              error: true,
              message: "Bu isimde bir kategori zaten var",
              fields: ["name"],
            };
        }

        const updatedCategory = await ctx.prisma.category.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            description: input.description,
          },
        });

        await invalidateCache(Cache.CATEGORY + category.companyId);

        return {
          error: false,
          message: "Kategori başarıyla güncellendi.",
          category: updatedCategory,
        };
      },
    ),

  /**
   * Delete a category
   * @access protected
   * @param {number} id - The id of the category
   */
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(
      async ({ ctx, input }): Promise<KafeasistResponse<typeof input>> => {
        const category = await ctx.prisma.category.findFirst({
          where: {
            id: input.id,
            company: {
              user: {
                id: ctx.session.id,
              },
            },
          },
        });

        if (!category)
          return { error: true, message: "Kategori bulunamadı", fields: [] };

        await ctx.prisma.category.delete({
          where: {
            id: input.id,
          },
        });

        await invalidateCache(Cache.CATEGORY + category.companyId);
        await invalidateCache(Cache.PRODUCT + category.companyId);

        return {
          error: false,
          message: "Kategori başarıyla silindi.",
        };
      },
    ),
});
