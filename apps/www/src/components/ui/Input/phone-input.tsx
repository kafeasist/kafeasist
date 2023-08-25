import { Input, InputProps } from "./input";
import React from "react";

const PhoneInput = (props: InputProps) => {
  const [value, setValue] = React.useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 10) return;
    if (!value.startsWith("5") && value.length !== 0) return;
    if (isNaN(Number(value))) return;

    setValue(value);
  };

  return <Input {...props} type="tel" value={value} onChange={handleChange} />;
};

export { PhoneInput };
