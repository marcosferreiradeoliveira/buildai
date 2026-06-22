import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { CourseBlock } from "@/types/landing";

type CourseSectionProps = {
  content: CourseBlock;
};

const CourseSection = ({ content }: CourseSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="curso-ia" className="relative py-16 sm:py-20 overflow-hidden" ref={ref}>
      {content.backgroundImageSrc ? (
        <>
          <img
            src={content.backgroundImageSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-background/60" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-neon-blue/5 pointer-events-none" />
      )}

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="overflow-hidden rounded-2xl bg-card border border-border neon-border-hover">
            <div className="grid md:grid-cols-[minmax(0,280px)_1fr]">
              {content.previewImageSrc ? (
                <img
                  src={content.previewImageSrc}
                  alt={content.instructorName ?? "CursoIA"}
                  className="h-56 md:h-full w-full object-cover object-top"
                />
              ) : null}

              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-widest text-neon-blue font-semibold">
                  {content.eyebrow}
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold mt-3 leading-tight">
                  {content.title}{" "}
                  <span className="gradient-text">{content.highlightedText}</span>
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base mt-3 leading-relaxed">
                  {content.description}
                </p>

                <div className="mt-5 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    {content.pricing.originalPrice ? (
                      <p className="text-xs text-muted-foreground line-through">
                        De {content.pricing.originalPrice}
                      </p>
                    ) : null}
                    <p className="text-xl sm:text-2xl font-heading font-bold gradient-text">
                      {content.pricing.installments}
                    </p>
                    <p className="text-sm text-muted-foreground">ou {content.pricing.total}</p>
                    {content.metric ? (
                      <p className="text-xs font-semibold text-foreground mt-2">{content.metric}</p>
                    ) : null}
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className="rounded-full px-6 shrink-0 neon-glow"
                  >
                    <a href={content.ctaHref} target="_blank" rel="noopener noreferrer">
                      {content.ctaLabel}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CourseSection;
