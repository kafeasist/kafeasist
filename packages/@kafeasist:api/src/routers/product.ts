import { Product } from "@prisma/client";
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

export const productRouter = createTRPCRouter({
  /**
   * Get all products of a company
   * @access protected
   * @param {number} companyId - The id of the company
   * @returns {Product[]} products - The products of the company
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
        KafeasistResponse<typeof input> & { products?: Product[] }
      > => {
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

        const products = await readCache<Product[]>(
          Cache.PRODUCT + input.companyId,
        );

        if (!products) {
          const productsDb = await ctx.prisma.product.findMany({
            where: {
              category: {
                company: {
                  id: input.companyId,
                },
              },
            },
          });

          if (!productsDb)
            return {
              error: true,
              message: "Ürünler bulunamadı",
              fields: [],
            };

          await setCache(
            Cache.PRODUCT + input.companyId,
            productsDb,
            REDIS_TTL,
          );

          return {
            error: false,
            message: "Ürünler getirildi",
            products: productsDb,
          };
        }

        return { error: false, message: "Ürünler getirildi", products };
      },
    ),

  /**
   * Get a product by id
   * @access protected
   * @param {number} id - The id of the product
   * @returns {Product} product - The product
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
      }): Promise<KafeasistResponse<typeof input> & { product?: Product }> => {
        if (!ctx.session)
          return { error: true, message: "Oturum açın", fields: [] };

        const product = await ctx.prisma.product.findFirst({
          where: {
            id: input.id,
            category: {
              company: {
                user: {
                  id: ctx.session.id,
                },
              },
            },
          },
        });

        if (!product)
          return { error: true, message: "Ürün bulunamadı", fields: [] };

        return { error: false, message: "Ürün getirildi", product };
      },
    ),

  /**
   * Create a product
   * @access protected
   * @param {number} companyId - The id of the company
   * @param {string} name - The name of the product
   * @param {string} description - The description of the product
   * @todo @param {string} imageUrl - The image url of the product
   * @param {number} price - The price of the product
   * @param {number} pricePennies - The price of the product in pennies
   * @param {number} categoryId - The id of the category
   * @returns {Product} product - The created product
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        price: z.number(),
        pricePennies: z.number(),
        categoryId: z.number(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<KafeasistResponse<typeof input> & { product?: Product }> => {
        if (!ctx.session)
          return { error: true, message: "Oturum açın", fields: [] };

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

        if (input.price < 0) {
          return {
            error: true,
            message: "Lütfen geçerli bir fiyat giriniz.",
            fields: ["price"],
          };
        }

        if (input.pricePennies < 0 || input.pricePennies > 99) {
          return {
            error: true,
            message: "Lütfen geçerli bir fiyat giriniz.",
            fields: ["pricePennies"],
          };
        }

        const category = await ctx.prisma.category.findFirst({
          where: {
            id: input.categoryId,
          },
        });

        if (!category)
          return {
            error: true,
            message: "Lütfen bir kategori seçiniz.",
            fields: ["categoryId"],
          };

        const company = await ctx.prisma.company.findFirst({
          where: {
            id: category.companyId,
            user: {
              id: ctx.session.id,
            },
          },
        });

        if (!company)
          return { error: true, message: "Şirket bulunamadı", fields: [] };

        const totalPrice = input.price * 100 + input.pricePennies;

        const product = await ctx.prisma.product.create({
          data: {
            name: input.name,
            description: input.description,
            imageUrl: input.imageUrl,
            price: totalPrice,
            categoryName: category.name,
            category: {
              connect: {
                id: input.categoryId,
              },
            },
          },
        });

        if (!product)
          return { error: true, message: "Ürün oluşturulamadı", fields: [] };

        await invalidateCache(Cache.PRODUCT + category.companyId);

        return {
          error: false,
          message: "Ürününüz başarıyla oluşturuldu.",
          product,
        };
      },
    ),

  /**
   * Update a product
   * @access protected
   * @param {number} id - The id of the product
   * @param {string} name - The name of the product
   * @param {string} description - The description of the product
   * @todo @param {string} imageUrl - The image url of the product
   * @param {number} price - The price of the product
   * @param {number} pricePennies - The price of the product in pennies
   * @param {number} categoryId - The id of the category
   * @returns {Product} product - The updated product
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        price: z.number(),
        pricePennies: z.number(),
        categoryId: z.number(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<KafeasistResponse<typeof input> & { product?: Product }> => {
        if (!ctx.session)
          return { error: true, message: "Oturum açın", fields: [] };

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

        if (input.price < 0) {
          return {
            error: true,
            message: "Lütfen geçerli bir fiyat giriniz.",
            fields: ["price"],
          };
        }

        if (input.pricePennies < 0 || input.pricePennies > 99) {
          return {
            error: true,
            message: "Lütfen geçerli bir fiyat giriniz.",
            fields: ["pricePennies"],
          };
        }

        const category = await ctx.prisma.category.findFirst({
          where: {
            id: input.categoryId,
            company: {
              user: {
                id: ctx.session.id,
              },
            },
          },
        });

        if (!category)
          return { error: true, message: "Kategori bulunamadı", fields: [] };

        const totalPrice = input.price * 100 + input.pricePennies;

        const product = await ctx.prisma.product.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            description: input.description,
            imageUrl: input.imageUrl,
            price: totalPrice,
            categoryName: category.name,
            category: {
              connect: {
                id: category.id,
              },
            },
          },
        });

        if (!product)
          return { error: true, message: "Ürün güncellenemedi", fields: [] };

        await invalidateCache(Cache.PRODUCT + category.companyId);

        return {
          error: false,
          message: "Ürününüz başarıyla güncellendi.",
          product,
        };
      },
    ),

  /**
   * Delete a product
   * @access protected
   * @param {number} id - The id of the product
   * @returns {Product} product - The deleted product
   */
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<KafeasistResponse<typeof input> & { product?: Product }> => {
        if (!ctx.session)
          return { error: true, message: "Oturum açın", fields: [] };

        const product = await ctx.prisma.product.delete({
          where: {
            id: input.id,
          },
        });

        if (!product)
          return { error: true, message: "Ürün silinemedi", fields: [] };

        const category = await ctx.prisma.category.findFirst({
          where: {
            id: product.categoryId,
            company: {
              user: {
                id: ctx.session.id,
              },
            },
          },
        });

        if (!category)
          return { error: true, message: "Kategori bulunamadı", fields: [] };

        await invalidateCache(Cache.PRODUCT + category.companyId);

        return {
          error: false,
          message: "Ürününüz başarıyla kaldırıldı.",
          product,
        };
      },
    ),
});
