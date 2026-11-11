import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Play, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WhatsAppCtaBand from "@/components/WhatsAppCtaBand";
import { Link, useSearchParams } from "react-router-dom";
import { CaseCategory, LandingContent, ProjectItem } from "@/types/landing";
import { useUi } from "@/i18n/LanguageContext";

type PortfolioBlock = LandingContent["portfolio"];

type PortfolioSectionProps = {
  content: PortfolioBlock;
  sectionId?: string;
  allCasesHref?: string;
  enableFilters?: boolean;
};

const categoryOrder: CaseCategory[] = ["atendimento", "conteudo", "sistemas"];

const CasePicture = ({ project }: { project: ProjectItem }) => {
  const gallery = project.images?.length ? project.images : project.imageSrc ? [project.imageSrc] : [];
  const [active, setActive] = useState(0);
  const src = gallery[active] ?? project.imageSrc;

  if (!src) {
    return (
      <div
        className="relative z-10 flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-primary/35 via-card to-sky-400/20"
        aria-hidden="true"
      >
        <Sparkles className="h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <img
        src={src}
        srcSet={gallery.length > 1 ? undefined : project.imageSrcSet}
        sizes={gallery.length > 1 ? undefined : project.imageSizes || "(min-width: 1024px) 22rem, (min-width: 640px) 46vw, 100vw"}
        alt={project.imageAlt || `Tela de ${project.title} da BuildAI`}
        width={1600}
        height={1000}
        loading="lazy"
        decoding="async"
        className="aspect-[16/10] w-full object-cover"
      />
      {gallery.length > 1 ? (
        <div className="absolute bottom-3 right-3 flex gap-2">
          {gallery.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={index === 0 ? "Ver formulário" : "Ver painel"}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setActive(index);
              }}
              className={`h-12 w-16 overflow-hidden rounded-md border ${index === active ? "border-primary" : "border-white/40"}`}
            >
              <img src={image} alt="" width={1600} height={1000} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const getYoutubeEmbedUrl = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
};

const PortfolioSection = ({ content, sectionId = "portfolio", allCasesHref, enableFilters = false }: PortfolioSectionProps) => {
  const ref = useRef(null);
  const ui = useUi();
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [videoModal, setVideoModal] = useState<{ title: string; embedUrl: string } | null>(null);
  const [params, setParams] = useSearchParams();
  const requested = params.get("categoria");
  const selected = categoryOrder.includes(requested as CaseCategory) ? (requested as CaseCategory) : null;
  const visible = content.items.filter((project) => !project.hidden);
  const items = selected ? visible.filter((project) => project.caseCategory === selected) : visible;
  const groups = enableFilters && !selected
    ? categoryOrder
        .map((id) => ({ id, items: items.filter((project) => project.caseCategory === id) }))
        .filter((group) => group.items.length > 0)
    : [{ id: selected ?? "todos", items }];
  const gridClass = "sm:grid-cols-2 lg:grid-cols-3";
  const filterLabels: Record<CaseCategory | "todos", string> = {
    todos: ui.portfolio.filterAll,
    atendimento: ui.portfolio.filterSales,
    conteudo: ui.portfolio.filterContent,
    sistemas: ui.portfolio.filterSystems,
  };

  return (
    <section id={sectionId} className="relative py-24 sm:py-32 overflow-hidden" ref={ref}>
      {content.backgroundImageSrc ? (
        <>
          <img
            src={content.backgroundImageSrc}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
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

        {enableFilters ? (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {(["todos", ...categoryOrder] as const).map((id) => {
              const active = (id === "todos" && !selected) || id === selected;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    const next = new URLSearchParams(params);
                    if (id === "todos") next.delete("categoria");
                    else next.set("categoria", id);
                    setParams(next, { replace: true });
                  }}
                  className={`rounded-full border px-4 py-2 text-sm ${active ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}
                >
                  {filterLabels[id]}
                </button>
              );
            })}
          </div>
        ) : null}

        {groups.map((group) => (
        <div key={group.id} className="mb-12">
        {enableFilters && !selected ? (
          <h3 className="mb-6 text-xl font-heading font-semibold">{filterLabels[group.id as CaseCategory]}</h3>
        ) : null}
        <div className={`grid gap-6 ${gridClass}`}>
          {group.items.map((project, i) => {
            const isClickable = Boolean(project.href || project.videoUrl);
            const cardClass = `group relative overflow-hidden rounded-2xl bg-card border border-border neon-border-hover transition-all duration-500 p-0 ${
              isClickable ? "cursor-pointer hover:border-primary/40" : ""
            }`;

            const cardBody = (
              <>
                {content.backgroundImageSrc ? (
                  <>
                    <img
                      src={content.backgroundImageSrc}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-card/85" />
                  </>
                ) : null}
                <CasePicture project={project} />
                <div className="relative z-10 p-6 sm:p-8">
                  {project.badge ? (
                    <span className="mb-3 inline-block rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                      {project.badge}
                    </span>
                  ) : null}
                  <span className="brand-eyebrow text-[10px]">
                    {project.tag || project.category}
                  </span>
                  <h3 className="text-xl font-heading font-semibold mt-3 mb-2 flex items-start justify-between gap-2">
                    <span>{project.title}</span>
                    {project.videoUrl ? (
                      <Play className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                    ) : project.href ? (
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                    ) : null}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed line-clamp-3">{project.description}</p>
                  <div className="pt-4 border-t border-border">
                    {project.outcome ? (
                      <p className="text-sm leading-relaxed">
                        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{ui.portfolio.outcomePrefix}</span>
                        <span className="font-semibold gradient-text">{project.outcome}</span>
                      </p>
                    ) : (
                      <div className="text-sm font-semibold gradient-text">{project.metric}</div>
                    )}
                    {project.videoUrl ? (
                      <p className="text-xs text-muted-foreground mt-2 group-hover:text-primary transition-colors">
                        {project.ctaLabel || ui.portfolio.watchVideo}
                      </p>
                    ) : project.href ? (
                      <p className="text-xs text-muted-foreground mt-2 group-hover:text-primary transition-colors">
                        {project.ctaLabel || ui.portfolio.viewLive}
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
        ))}

        {allCasesHref ? (
          <div className="mt-10 text-center">
            <Link to={allCasesHref} className="text-sm font-semibold text-primary hover:underline">
              {ui.portfolio.viewAll}
            </Link>
          </div>
        ) : null}

        {sectionId === "portfolio" ? <WhatsAppCtaBand source="cases" className="mt-12" /> : null}
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
