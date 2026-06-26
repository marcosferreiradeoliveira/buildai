import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LandingContent } from "@/types/landing";
import { useUi } from "@/i18n/LanguageContext";

type PortfolioBlock = LandingContent["portfolio"];

type PortfolioSectionProps = {
  content: PortfolioBlock;
  sectionId?: string;
};

const getYoutubeEmbedUrl = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
};

const PortfolioSection = ({ content, sectionId = "portfolio" }: PortfolioSectionProps) => {
  const ref = useRef(null);
  const ui = useUi();
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [videoModal, setVideoModal] = useState<{ title: string; embedUrl: string } | null>(null);
  const gridClass =
    content.items.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section id={sectionId} className="relative py-24 sm:py-32 overflow-hidden" ref={ref}>
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
          <span className="brand-eyebrow">{content.eyebrow}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mt-3">
            {content.title} <span className="gradient-text">{content.highlightedText}</span>
          </h2>
          {content.description ? (
            <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {content.description}
            </p>
          ) : null}
        </motion.div>

        <div className={`grid gap-6 ${gridClass}`}>
          {content.items.map((project, i) => {
            const isClickable = Boolean(project.href || project.videoUrl);
            const cardClass = `group relative overflow-hidden rounded-2xl bg-card border border-border neon-border-hover transition-all duration-500 ${
              project.imageSrc ? "p-0" : "p-8"
            } ${isClickable ? "cursor-pointer hover:border-primary/40" : ""}`;

            const cardBody = (
              <>
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
                {project.imageSrc ? (
                  <img
                    src={project.imageSrc}
                    alt={project.title}
                    className="relative z-10 w-full h-40 sm:h-44 object-cover"
                  />
                ) : null}
                <div className={`relative z-10 ${project.imageSrc ? "p-6 sm:p-8" : ""}`}>
                  <span className="brand-eyebrow text-[10px]">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-heading font-semibold mt-3 mb-2 flex items-start justify-between gap-2">
                    <span>{project.title}</span>
                    {project.videoUrl ? (
                      <Play className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                    ) : project.href ? (
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                    ) : null}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{project.description}</p>
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-semibold gradient-text">{project.metric}</div>
                    {project.videoUrl ? (
                      <p className="text-xs text-muted-foreground mt-2 group-hover:text-primary transition-colors">
                        {ui.portfolio.watchVideo}
                      </p>
                    ) : project.href ? (
                      <p className="text-xs text-muted-foreground mt-2 group-hover:text-primary transition-colors">
                        {ui.portfolio.viewLive}
                      </p>
                    ) : null}
                  </div>
                </div>
              </>
            );

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                {project.videoUrl ? (
                  <button
                    type="button"
                    onClick={() =>
                      setVideoModal({
                        title: project.title,
                        embedUrl: getYoutubeEmbedUrl(project.videoUrl!),
                      })
                    }
                    className={`block w-full text-left ${cardClass}`}
                    aria-label={`Assistir vídeo de ${project.title}`}
                  >
                    {cardBody}
                  </button>
                ) : project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block ${cardClass}`}
                    aria-label={`Ver projeto ${project.title}`}
                  >
                    {cardBody}
                  </a>
                ) : (
                  <div className={cardClass}>{cardBody}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <Dialog open={Boolean(videoModal)} onOpenChange={(open) => !open && setVideoModal(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden gap-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>{videoModal?.title}</DialogTitle>
          </DialogHeader>
          {videoModal ? (
            <div className="aspect-video w-full bg-black">
              <iframe
                src={videoModal.embedUrl}
                title={videoModal.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PortfolioSection;
