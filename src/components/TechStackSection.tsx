import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LandingContent } from "@/types/landing";

type TechStackSectionProps = {
  content: LandingContent["techStack"];
};

const TechStackSection = ({ content }: TechStackSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="tech-stack" className="py-20 border-y border-border" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-sm text-muted-foreground uppercase tracking-wider">{content.eyebrow}</span>
        </motion.div>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {content.items.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-2xl">{tech.icon}</span>
              <span className="text-sm font-medium">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
