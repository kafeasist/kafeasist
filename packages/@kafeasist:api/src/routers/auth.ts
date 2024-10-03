import { z } from "zod";

import {
  AuthResponse,
  forgotPassword,
  login,
  register,
  removeCookie,
  resetPassword,
  setCookie,
} from "@kafeasist/auth";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  /**
   * Get the current session
   * @param ctx
   * @returns The current session
   */
  getSession: publicProcedure.query(async ({ ctx }) => {
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
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        phone: z.string(),
        password: z.string(),
        confirmPassword: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<AuthResponse<typeof input>> => {
      const response = await register(input);

      if (response.success) {
        // Assign the session to the context
        ctx.session = response.session;

        // Set the cookie with the token returned from the server
        await setCookie(ctx.headers, response.session);
      }

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
        email: z.string(),
        password: z.string(),
        pin: z.string().optional(),
        recovery1: z.string().optional(),
        recovery2: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<AuthResponse<typeof input>> => {
      const response = await login(input);

      if (response.success) {
        // Assign the session to the context
        ctx.session = response.session;

        // Set the cookie with the token returned from the server
        await setCookie(ctx.headers, response.session);
      }

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
    removeCookie(ctx.headers);
  }),

  /**
   * Forgot password
   * @param ctx
   * @param input
   * @returns void
   */
  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ input }): Promise<AuthResponse<typeof input>> => {
      const response = await forgotPassword(input);

      return response;
    }),

  /**
   * Reset password
   * @param ctx
   * @param input
   * @returns void
   */
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string(),
        confirmPassword: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<AuthResponse<typeof input>> => {
      const response = await resetPassword(input);

      if (response.success) {
        // Assign the session to the context
        ctx.session = response.session;

        // Set the cookie with the token returned from the server
        await setCookie(ctx.headers, response.session);
      }

      return response;
    }),
});
