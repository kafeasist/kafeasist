import { useTheme } from "next-themes";
import Image, { ImageProps } from "next/image";
import * as React from "react";
import logo from "~/../public/logowithtext.png";
import darkLogo from "~/../public/logowithtextwhite.png";

const Logo = React.forwardRef<HTMLImageElement, Partial<ImageProps>>(
  ({ className, ...props }, ref) => {
    const { theme } = useTheme();

    return (
      <Image
        {...props}
        src={theme === "dark" ? darkLogo : logo}
        className={className}
        ref={ref}
        width={props.width || 140}
        height={props.height || 30}
        alt="kafeasist Logo"
      />
    );
  },
);
Logo.displayName = "Logo";

export { Logo };
