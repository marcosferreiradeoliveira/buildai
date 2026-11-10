import BrandLogo from "@/components/BrandLogo";
import SocialLinks from "@/components/SocialLinks";
import { CALENDLY_URL, isConsultoriaCta } from "@/lib/calendly";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NavLink } from "@/types/landing";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  createDefaultWhatsAppMessage,
  createProspectWhatsAppMessage,
  openWhatsApp,
} from "@/lib/whatsapp";

type NavbarProps = {
  brandName: string;
  logoSrc?: string;
  navLinks: NavLink[];
  ctaLabel: string;
  prospectCompanyName?: string;
};

const Navbar = ({ brandName, logoSrc, navLinks, ctaLabel, prospectCompanyName }: NavbarProps) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const openCalendly = isConsultoriaCta(ctaLabel);
  const whatsappMessage = prospectCompanyName
    ? createProspectWhatsAppMessage(prospectCompanyName)
    : createDefaultWhatsAppMessage(brandName);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMenuOpen(false);
    if (!href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate({ pathname: "/", hash: href.slice(1) });
  };

  const ctaClassName =
    "bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition neon-glow text-center";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <a
          href="/"
          className="flex items-center shrink-0"
          aria-label={brandName}
          onClick={(event) => {
            if (window.location.pathname === "/") {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={brandName}
              className="h-8 w-auto sm:h-9"
              width={160}
              height={36}
            />
          ) : (
            <BrandLogo />
          )}
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
          <SocialLinks className="flex gap-2" />
          <LanguageSwitcher />
          {openCalendly ? (
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={ctaClassName}>
              {ctaLabel}
            </a>
          ) : (
            <button type="button" onClick={() => openWhatsApp(whatsappMessage, "navbar")} className={ctaClassName}>
              {ctaLabel}
            </button>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <button
            className="text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t border-border px-4 pb-4"
        >
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="block w-full text-left py-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
          <SocialLinks className="flex gap-2 py-2" />
          {openCalendly ? (
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block w-full bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium text-center"
            >
              {ctaLabel}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => openWhatsApp(whatsappMessage, "navbar")}
              className="mt-2 w-full bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium"
            >
              {ctaLabel}
            </button>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
