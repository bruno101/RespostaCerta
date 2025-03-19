import { MouseEventHandler } from "react";
import { motion } from "framer-motion";

export default function CustomButton({
  className,
  type,
  disabled,
  children,
  onClick,
  bgColor,
}: {
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean | undefined;
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  bgColor:
    | "cyan"
    | "green"
    | "red"
    | "sky"
    | "blue"
    | "lime"
    | "teal"
    | "emerald"
    | "gray"
    | "stone"
    | "neutral"
    | "zinc"
    | "slate"
    | "gray"
    | "violet"
    | "purple"
    | "indigo"
    | "yellow"
    | "amber"
    | "fuchsia"
    | "pink"
    | "rose";
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type={type || "button"}
      disabled={disabled || false}
      onClick={onClick || undefined}
      className={`bg-${bgColor}-600 hover:bg-${bgColor}-500 focus:bg-${bgColor}-500 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-${bgColor}-600 text-white disabled:opacity-50 rounded-md flex items-center text-[14px] px-3 py-2 ${className}`}
    >
      {children}
    </motion.button>
  );
}
