import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LandingContent } from "@/types/landing";

type PortfolioSectionProps = {
  content: LandingContent["portfolio"];
};

const PortfolioSection = ({ content }: PortfolioSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="portfolio" className="relative py-24 sm:py-32 overflow-hidden" ref={ref}>
      {content.backgroundImageSrc ? (
        <>
          <img
            src={content.backgroundImageSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-background/55" />
        </>
      ) : null}
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">{content.eyebrow}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mt-3">
            {content.title} <span className="gradient-text">{content.highlightedText}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {content.items.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative overflow-hidden p-8 rounded-2xl bg-card border border-border neon-border-hover transition-all duration-500"
            >
              {content.backgroundImageSrc ? (
                <>
                  <img
                    src={content.backgroundImageSrc}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover opacity-20"
                  />
                  <div className="absolute inset-0 bg-card/85" />
                </>
              ) : null}
              <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-widest text-neon-blue font-semibold">
                {project.category}
              </span>
              <h3 className="text-xl font-heading font-semibold mt-3 mb-2">{project.title}</h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{project.description}</p>
              <div className="pt-4 border-t border-border">
                <div className="text-sm font-semibold gradient-text">{project.metric}</div>
              </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
