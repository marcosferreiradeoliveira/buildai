import { Instagram } from "lucide-react";
import { getSocialLinks } from "@/config/social";

type SocialLinksProps = {
  className?: string;
};

const SocialLinks = ({ className = "flex gap-4" }: SocialLinksProps) => {
  const links = getSocialLinks();
  if (links.length === 0) return null;

  return (
    <div className={className}>
      {links.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener"
          aria-label={social.label}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
        >
          {social.label === "Instagram" ? <Instagram className="h-4 w-4" aria-hidden="true" /> : null}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
