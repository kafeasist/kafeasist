import * as React from "react";

export type FormItemContextValue = {
  id: string;
};

export const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

export const FormItemContextProvider = FormItemContext.Provider;
