export const Cache = {
  COMPANY: "companies:",
  SESSION: "session:",
  CATEGORY: "categories:",
  PRODUCT: "products:",
  TABLE: "tables:",
  PLACE: "places:",
} as const;

export type Cache = (typeof Cache)[keyof typeof Cache];
