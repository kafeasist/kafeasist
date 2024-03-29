import { z } from "zod";

import { validateName, validatePhone } from "@kafeasist/auth";
import { Company, Plan, prisma } from "@kafeasist/db";
import {
  Cache,
  invalidateCache,
  readCache,
  REDIS_TTL,
  setCache,
} from "@kafeasist/redis";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { KafeasistResponse } from "../types/KafeasistResponse";
import { plans } from "../types/Plans";

export const companyRouter = createTRPCRouter({
  /**
   * Get how many companies the user has
   * @param ctx
   * @returns The number of companies
   */
  count: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) return 0;
    const companies = await readCache<Company[]>(
      Cache.COMPANY + ctx.session.id,
    );
    if (!companies) {
      const fetchedCompanies = await prisma.company.findMany({
        where: {
          userId: ctx.session.id,
        },
      });

      await setCache(
        Cache.COMPANY + ctx.session.id,
        fetchedCompanies,
        REDIS_TTL,
      );
      return fetchedCompanies.length;
    }

    return companies.length;
  }),

  /**
   * Get the companies of the user
   * @param ctx
   * @returns The companies of the user
   */
  get: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) return null;
    const companies = await readCache<Company[]>(
      Cache.COMPANY + ctx.session.id,
    );

    if (!companies) {
      const fetchedCompanies = await prisma.company.findMany({
        where: {
          userId: ctx.session.id,
        },
      });

      await setCache(
        Cache.COMPANY + ctx.session.id,
        fetchedCompanies,
        REDIS_TTL,
      );
      return fetchedCompanies;
    }

    return companies;
  }),

  /**
   * Get the company of the user
   * @param ctx
   * @param input
   * @returns The company of the user
   */
  getOne: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input: { id } }) => {
      if (!ctx.session) return null;

      const companies = await readCache<Company[]>(
        Cache.COMPANY + ctx.session.id,
      );

      if (!companies) {
        const fetchedCompany = await prisma.company.findFirst({
          where: {
            id,
            userId: ctx.session.id,
          },
        });

        return fetchedCompany ?? null;
      }

      return companies.find((company) => company.id === id) ?? null;
    }),

  /**
   * Create a new company
   * @param ctx
   * @param input
   * @returns Promise<KafeasistResponse>
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string(),
        address: z.string(),
        taxCode: z.string(),
        plan: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<KafeasistResponse<typeof input> & { company?: Company }> => {
        if (!plans.includes(input.plan as any))
          return {
            error: true,
            message: "Lütfen bir plan seçiniz.",
            fields: ["plan"],
          };

        try {
          validatePhone(input.phone);
        } catch (error: unknown) {
          if (error instanceof Error)
            return {
              error: true,
              message: error.message,
              fields: ["phone"],
            };
        }

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

        const companyWithSameName = await prisma.company.findFirst({
          where: {
            name: input.name,
            user: {
              id: ctx.session.id,
            },
          },
        });

        if (companyWithSameName)
          return {
            error: true,
            message: "Bu isimde bir şirketiniz zaten var.",
            fields: ["name"],
          };

        const companyWithSameTaxCode = await prisma.company.findFirst({
          where: {
            taxCode: input.taxCode,
          },
        });

        if (companyWithSameTaxCode)
          return {
            error: true,
            message: "Bu vergi levhasıyla kayıtlı bir şirket bulunuyor.",
            fields: ["taxCode"],
          };

        const companyWithSamePhone = await prisma.company.findFirst({
          where: {
            phone: input.phone,
          },
        });

        if (companyWithSamePhone)
          return {
            error: true,
            message: "Bu telefon numarası ile bir şirket bulunuyor.",
            fields: ["phone"],
          };

        const company = await prisma.company.create({
          data: {
            name: input.name,
            phone: input.phone,
            address: input.address,
            taxCode: input.taxCode,
            plan: input.plan as Plan,
            user: {
              connect: {
                id: ctx.session.id,
              },
            },
          },
        });

        if (!company)
          return {
            error: true,
            message: "Şirket oluşturulurken bir hata oluştu.",
            fields: [],
          };

        await invalidateCache(Cache.COMPANY + ctx.session.id);
        return {
          error: false,
          message: "Başarıyla şirketiniz oluşturuldu.",
          company,
        };
      },
    ),

  /**
   * Update the company of the user
   * @param ctx
   * @param input
   * @returns Promise<KafeasistResponse>
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        phone: z.string(),
        address: z.string(),
        taxCode: z.string(),
      }),
    )
    .mutation(
      async ({ ctx, input }): Promise<KafeasistResponse<typeof input>> => {
        try {
          validatePhone(input.phone);
        } catch (error: unknown) {
          if (error instanceof Error)
            return {
              error: true,
              message: error.message,
              fields: ["phone"],
            };
        }

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

        const companyExists = await prisma.company.findFirst({
          where: {
            id: input.id,
            user: {
              id: ctx.session.id,
            },
          },
        });

        if (!companyExists)
          return {
            error: true,
            message: "Bu şirket size ait değil.",
            fields: [],
          };

        const company = await prisma.company.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            phone: input.phone,
            address: input.address,
            taxCode: input.taxCode,
          },
        });

        if (!company)
          return {
            error: true,
            message: "Şirket güncellenirken bir hata oluştu.",
            fields: [],
          };

        if (company instanceof Error) {
          if (company.message.includes("phone"))
            return {
              error: true,
              message: "Bu telefon numarası zaten kullanımda",
              fields: ["phone"],
            };
          if (company.message.includes("taxCode"))
            return {
              error: true,
              message: "Bu vergi numarası zaten kullanımda",
              fields: ["taxCode"],
            };
        }

        await invalidateCache(Cache.COMPANY + ctx.session.id);
        return {
          error: false,
          message: "Başarıyla şirketiniz güncellendi.",
        };
      },
    ),

  /**
   * Delete the company of the user
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
        const companyExists = await prisma.company.findFirst({
          where: {
            id: input.id,
            user: {
              id: ctx.session.id,
            },
          },
        });

        if (!companyExists)
          return {
            error: true,
            message: "Bu şirket size ait değil.",
            fields: [],
          };

        const company = await prisma.company.delete({
          where: {
            id: input.id,
          },
        });

        if (!company)
          return {
            error: true,
            message: "Şirket silinirken bir hata oluştu.",
            fields: [],
          };

        await invalidateCache(Cache.COMPANY + ctx.session.id);
        return {
          error: false,
          message: "Başarıyla şirketiniz silindi.",
        };
      },
    ),

  /**
   * Change the plan of the company
   * @param ctx
   * @param input
   * @returns Promise<KafeasistResponse>
   */
  changePlan: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        plan: z.string().optional(),
      }),
    )
    .mutation(
      async ({ ctx, input }): Promise<KafeasistResponse<typeof input>> => {
        if (!input.plan || !plans.includes(input.plan as any))
          return {
            error: true,
            message: "Lütfen bir plan seçiniz.",
            fields: ["plan"],
          };

        const companyExists = await prisma.company.findFirst({
          where: {
            id: input.id,
            user: {
              id: ctx.session.id,
            },
          },
        });

        if (!companyExists)
          return {
            error: true,
            message: "Bu şirket size ait değil.",
            fields: [],
          };

        if (companyExists.plan === input.plan) {
          return {
            error: true,
            message: "Bu plan zaten şirketinizin planı.",
            fields: ["plan"],
          };
        }

        const company = await prisma.company.update({
          where: {
            id: input.id,
          },
          data: {
            plan: input.plan as Plan,
          },
        });

        if (!company)
          return {
            error: true,
            message: "Plan değiştirilirken bir hata oluştu.",
            fields: [],
          };

        await invalidateCache(Cache.COMPANY + ctx.session.id);
        return {
          error: false,
          message: "Başarıyla planınız değiştirildi.",
        };
      },
    ),
});
