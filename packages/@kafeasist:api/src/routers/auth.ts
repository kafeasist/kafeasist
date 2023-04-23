import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  AuthResponse,
  login,
  register,
  removeCookie,
  setCookie,
} from "@kafeasist/auth";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const authRouter = createTRPCRouter({
  /**
   * Get the current session
   * @param ctx
   * @returns The current session
   */
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  /**
   * Register
   * @param ctx
   * @param input
   * @returns AuthResponse
   */
  register: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(2).max(20),
        lastName: z.string().min(2).max(20),
        email: z.string().email(),
        phone: z.string().min(10).max(10),
        password: z.string().min(8).max(24),
        confirmPassword: z.string().min(8).max(24),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<AuthResponse> => {
      const response = await register(input);

      if (response.success) {
        // Assign the session to the context
        ctx.session = response.session;

        // Set the cookie with the token returned from the server
        setCookie(ctx.res, response.token);
      } else
        throw new TRPCError({
          message: response.message,
          code: "BAD_REQUEST",
        });

      return response;
    }),

  /**
   * Log in
   * @param ctx
   * @param input
   * @returns AuthResponse
   */
  login: publicProcedure
    .input(
      z.object({
        emailOrPhone: z.string().email() || z.string().min(10).max(10),
        password: z.string().min(8).max(24),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<AuthResponse> => {
      const response = await login(input);

      if (response.success) {
        // Assign the session to the context
        ctx.session = response.session;

        // Set the cookie with the token returned from the server
        setCookie(ctx.res, response.token);
      } else
        throw new TRPCError({
          message: response.message,
          code: "UNAUTHORIZED",
        });

      return response;
    }),

  /**
   * Log out
   * @param ctx
   * @returns void
   */
  logout: publicProcedure.mutation(({ ctx }) => {
    // Remove the session from the context
    ctx.session = null;

    // Remove the token cookie
    removeCookie(ctx.res);
  }),
});
