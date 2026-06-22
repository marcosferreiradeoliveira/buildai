export type NavLink = {
  label: string;
  href: string;
};

export type HeroStat = {
  value: string;
  label: string;
};

export type ServiceItem = {
  title: string;
  description: string;
  tag: string;
};

export type TimelineStatus = "done" | "active" | "upcoming";

export type TimelineItem = {
  date: string;
  title: string;
  description: string;
  status: TimelineStatus;
};

export type TechItem = {
  name: string;
  icon: string;
};

export type ProjectItem = {
  title: string;
  category: string;
  metric: string;
  description: string;
  imageSrc?: string;
};

export type ContactSocial = {
  label: string;
  href: string;
};

export type CourseBlock = {
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  metric?: string;
  previewImageSrc?: string;
  backgroundImageSrc?: string;
  instructorName?: string;
  pricing: {
    originalPrice?: string;
    installments: string;
    total: string;
  };
  ctaLabel: string;
  ctaHref: string;
};

export type LandingContent = {
  /** Nome da empresa-alvo em landings personalizadas (/lp). A marca exibida continua sendo BuildAI. */
  prospectCompanyName?: string;
  seo: {
    title: string;
    description: string;
    previewImageSrc: string;
    faviconHref: string;
  };
  navbar: {
    brandName: string;
    navLinks: NavLink[];
    ctaLabel: string;
  };
  hero: {
    badge: string;
    title: string;
    highlightedText: string;
    titleSuffix?: string;
    description: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    stats: HeroStat[];
    backgroundImageSrc?: string;
  };
  services: {
    eyebrow: string;
    title: string;
    highlightedText: string;
    description: string;
    items: ServiceItem[];
  };
  process: {
    eyebrow: string;
    title: string;
    highlightedText: string;
    description: string;
    timeline: TimelineItem[];
  };
  techStack: {
    eyebrow: string;
    items: TechItem[];
  };
  portfolio: {
    eyebrow: string;
    title: string;
    highlightedText: string;
    description?: string;
    items: ProjectItem[];
    backgroundImageSrc?: string;
  };
  /** Landings /lp: ideias de implementação (automação, SaaS, IA) com base no contexto do lead. */
  implementationIdeas?: {
    eyebrow: string;
    title: string;
    highlightedText: string;
    description?: string;
    items: ProjectItem[];
  };
  /** Módulo promocional do CursoIA — exibido na landing principal. */
  course?: CourseBlock;
  contact: {
    eyebrow: string;
    title: string;
    highlightedText: string;
    description: string;
    submitLabel: string;
    successTitle: string;
    successDescription: string;
    socials: ContactSocial[];
    copyrightName: string;
  };
};
