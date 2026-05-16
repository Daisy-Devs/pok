
import { cn } from "../lib/utils";
import { cva } from "class-variance-authority";

interface PillProps {
  variant?: "default" | "primary" | "secondary";
  classname?: string;
  text: string;
  icon?: React.ReactNode;
}
const pillVariants = cva(
  "flex items-center gap-2 font-extrabold justify-center rounded-full py-1.5 px-3",
  {
    variants: {
      variant: {
        default: "bg-white text-secondary-dark",
        primary: "bg-primary-light text-[#07006C]",
        secondary: "bg-secondary text-secondary-foreground",
      },
    },
  },
);
/**
 * A pill component to display a text with an optional icon.
 *
 * @param {pillProps} variant - The variant of the pill. One of "default", "primary", or "secondary".
 * @param {pillProps} className - The class name to apply to the pill.
 * @param {pillProps} text - The text to display inside the pill.
 * @param {pillProps} icon - The icon to display inside the pill.
 */
const Pill: React.FC<PillProps> = ({ variant, classname, text, icon }) => {
  return <div className={cn(pillVariants({ variant }), classname)}>
    {icon}
    <p className="uppercase text-xs">{text}</p>
  </div>;
};

export default Pill;
