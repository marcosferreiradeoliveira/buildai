import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LandingContent } from "@/types/landing";

type BuildInPublicSectionProps = {
  content: LandingContent["process"];
};

const BuildInPublicSection = ({ content }: BuildInPublicSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="build-in-public" className="py-24 sm:py-32 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">{content.eyebrow}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mt-3">
            {content.title} <span className="gradient-text">{content.highlightedText}</span> no processo
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            {content.description}
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

          {content.timeline.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative pl-16 pb-12 last:pb-0"
            >
              {/* Dot */}
              <div
                className={`absolute left-4 top-1 w-5 h-5 rounded-full border-2 ${
                  item.status === "done"
                    ? "bg-primary border-primary neon-glow"
                    : item.status === "active"
                    ? "bg-neon-blue border-neon-blue neon-glow-blue animate-pulse-neon"
                    : "bg-muted border-border"
                }`}
              />
              <span className="text-xs text-primary font-semibold uppercase tracking-wider">{item.date}</span>
              <h3 className="text-lg font-heading font-semibold mt-1">{item.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuildInPublicSection;
