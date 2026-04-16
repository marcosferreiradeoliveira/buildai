import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { LandingContent } from "@/types/landing";

const serviceIcons = [
  <svg key="micro-saas" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neon-purple">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 9l3 3-3 3" />
    <line x1="14" y1="15" x2="18" y2="15" />
  </svg>,
  <svg key="ai-automation" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neon-blue">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
  </svg>,
  <svg key="custom-software" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neon-purple">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>,
];

type ServicesSectionProps = {
  content: LandingContent["services"];
};

const ServicesSection = ({ content }: ServicesSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="servicos" className="py-24 sm:py-32 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">{content.eyebrow}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mt-3">
            {content.title} <span className="gradient-text">{content.highlightedText}</span> resultados
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            {content.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {content.items.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative p-8 rounded-2xl bg-card border border-border neon-border-hover transition-all duration-500 cursor-default"
            >
              <div className="mb-5">{serviceIcons[i % serviceIcons.length]}</div>
              <span className="inline-block text-[10px] uppercase tracking-widest text-primary font-semibold mb-3 bg-primary/10 px-2.5 py-1 rounded-full">
                {service.tag}
              </span>
              <h3 className="text-xl font-heading font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
