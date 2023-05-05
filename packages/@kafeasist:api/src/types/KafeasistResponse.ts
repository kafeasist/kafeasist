export type KafeasistResponse<T> =
  | {
      error: true;
      message: string;
      fields: (keyof T)[];
    }
  | {
      error: false;
      message: string;
    };
