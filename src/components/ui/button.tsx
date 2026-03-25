import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import Image, { StaticImageData } from "next/image";
import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "group items-center gap-2 inline-flex justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-sm h-fit w-fit",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        blue: "bg-primary text-white hover:bg-primary/80 focus-visible:ring-[#ffffff]",
        blue_light:
          "bg-primary-light text-black hover:bg-primary/50 focus-visible:ring-[#ffffff]",
        grey: "bg-muted-foreground text-black hover:bg-primary/50 focus-visible:ring-[#ffffff]",
        white:
          "bg-white text-primary hover:bg-primary/50 focus-visible:ring-[#ffffff]", //shadow
        green:
          "bg-secondary text-secondary-dark hover:bg-primary/50 focus-visible:ring-[#ffffff]", //shadow
        ghost:
          "text-primary hover:text-primary underline-offset-4 hover:underline ",
        outline:
          "border border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus-visible:ring-[#ffffff]",
      },
      size: {
        only_icon: "px-[12px] py-[12px]",
        normal: "px-[14px] py-[8px]",
        long: "px-[80px] py-[8px]",
      },
      withIcon: {
        true: "flex",
        false: "",
      },
      iconOnly: {
        true: "p-0 grid place-items-center",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "normal",
      withIcon: false,
      iconOnly: false,
    },
  },
);

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  text?: string;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  leftImageSrc?: string | StaticImageData;
  rightImageSrc?: string | StaticImageData;

  hoverLeftImageSrc?: string | StaticImageData;
  hoverRightImageSrc?: string | StaticImageData;

  imageSize?: number;
  imageClassName?: string;
  textClassName?: string;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------
function Button({
  className,
  variant,
  size,
  asChild = false,
  text,

  leftIcon,
  rightIcon,

  leftImageSrc,
  rightImageSrc,

  hoverLeftImageSrc,
  hoverRightImageSrc,

  imageSize = 20,
  imageClassName,
  textClassName,

  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  // 🔧 Icon renderer
  const renderImage = (
    src?: string | StaticImageData,
    hoverSrc?: string | StaticImageData,
    alt?: string,
  ) => {
    if (!src) return null;

    // No hover image → simple render
    if (!hoverSrc) {
      return (
        <Image
          src={src}
          alt={alt || "icon"}
          width={imageSize}
          height={imageSize}
          className={imageClassName}
        />
      );
    }

    // Hover animation
    return (
      <span
        className="relative grid place-items-center"
        style={{ width: imageSize, height: imageSize }}
      >
        {/* Default */}
        <Image
          src={src}
          alt={alt || "icon"}
          width={imageSize}
          height={imageSize}
          className={cn(
            "absolute transition-all duration-500",
            "opacity-100 rotate-0 group-hover:opacity-0 group-hover:-rotate-90",
            imageClassName,
          )}
        />

        {/* Hover */}
        <Image
          src={hoverSrc}
          alt={`${alt}-hover`}
          width={imageSize}
          height={imageSize}
          className={cn(
            "absolute transition-all duration-500",
            "opacity-0 rotate-90 group-hover:opacity-100 group-hover:rotate-0",
            imageClassName,
          )}
        />
      </span>
    );
  };

  return (
    <Comp
      type="button"
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      <span className="flex items-center gap-2">
        {leftIcon && <span className={imageClassName}>{leftIcon}</span>}
        {renderImage(leftImageSrc, hoverLeftImageSrc, "left-icon")}
        {text && <span className={textClassName}>{text}</span>}
        {renderImage(rightImageSrc, hoverRightImageSrc, "right-icon")}
        {rightIcon && <span className={imageClassName}>{rightIcon}</span>}
      </span>
    </Comp>
  );
}

export { Button, buttonVariants };
