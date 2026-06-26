import buildaiLogoDark from "@/assets/buildai-logo-transparent.png";
import buildaiLogoLight from "@/assets/buildai-logo-light.png";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "dark" | "light";
  className?: string;
};

const BrandLogo = ({ variant = "dark", className }: BrandLogoProps) => (
  <img
    src={variant === "dark" ? buildaiLogoDark : buildaiLogoLight}
    alt="BuildAI"
    className={cn("h-8 w-auto sm:h-9", className)}
    width={160}
    height={36}
  />
);

export default BrandLogo;
