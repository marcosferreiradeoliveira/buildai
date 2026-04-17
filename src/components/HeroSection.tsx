import { motion } from "framer-motion";
import { LandingContent } from "@/types/landing";
import { createDefaultWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";

type HeroSectionProps = {
  content: LandingContent["hero"];
  companyName: string;
};

const HeroSection = ({ content, companyName }: HeroSectionProps) => {
  const whatsappMessage = createDefaultWhatsAppMessage(companyName);

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
      {content.backgroundImageSrc ? (
        <img
          src={content.backgroundImageSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      ) : null}

      {content.backgroundImageSrc ? <div className="absolute inset-0 bg-background/45" /> : null}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-purple/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 mb-8">
              {content.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold leading-tight mb-6"
          >
            {content.title} <span className="gradient-text">{content.highlightedText}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={() => openWhatsApp(whatsappMessage)}
              className="bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-semibold text-base hover:opacity-90 transition neon-glow"
            >
              {content.primaryCtaLabel}
            </button>
            <button
              type="button"
              onClick={() => document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3.5 rounded-lg font-semibold text-base border border-border text-foreground hover:bg-secondary transition"
            >
              {content.secondaryCtaLabel}
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {content.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
