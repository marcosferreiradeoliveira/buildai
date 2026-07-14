import { useEffect } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Code2,
  Database,
  ExternalLink,
  Film,
  Gauge,
  Mic2,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trackEvent } from "@/lib/analytics";
import buildaiLogo from "@/assets/buildai-logo-transparent.png";
import automacaoCaseImage from "@/assets/automacao Large.jpeg";
import contentFactoryCaseImage from "@/assets/Newsgen Large.jpeg";
import culturaFluxoCaseImage from "@/assets/fluxo.jpeg";
import freelasSniperCaseImage from "@/assets/99sniper Large.jpeg";
import greenSkyCaseImage from "@/assets/greensky Large.jpeg";
import growthOsCaseImage from "@/assets/GrowOS Large.jpeg";
import psdAutomatorCaseImage from "@/assets/preview.jpeg";

const calendlyUrl = "https://calendly.com/buildaidev/30min";

const metrics = [
  { value: "50+", label: "Projetos entregues" },
  { value: "98%", label: "Satisfação" },
  { value: "10x", label: "ROI médio" },
];

const steps = [
  {
    icon: Clock3,
    title: "Passo 1: Você conta o gargalo (5 min)",
    description:
      "Em um papo rápido, você nos mostra o processo manual mais chato, lento ou repetitivo do seu time.",
  },
  {
    icon: Workflow,
    title: "Passo 2: Nós desenhamos o fluxo (5 min)",
    description:
      "Nossa equipe de engenharia desenha a arquitetura ideal de IA, Integrações ou Web Scraping para o seu caso.",
  },
  {
    icon: Gauge,
    title: "Passo 3: Entregamos o ROI de bandeja (5 min)",
    description:
      "Calculamos as horas salvas e o custo cortado. Se a conta fechar, você decide se quer que a gente desenvolva ou não.",
  },
];

const categoryStyles: Record<string, string> = {
  "Automação com IA": "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  "Content Factory": "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200",
  "Software Sob Medida": "border-blue-400/30 bg-blue-400/10 text-blue-200",
  MicroSaaS: "border-indigo-400/30 bg-indigo-400/10 text-indigo-200",
};

const portfolio = [
  {
    category: "Automação com IA",
    title: "Gerador de Artes PSD",
    description:
      "Aplicação web que transforma um layout fixo no Photoshop (PSD) em gerador em lote: camadas nomeadas, planilha Excel e pasta de imagens viram artes finais em PNG/PSD — catálogos, cards, banners, menus e qualquer layout repetitivo com um clique.",
    highlight:
      "Produção em lote de peças visuais a partir de template + planilha, sem retrabalho manual",
    imageSrc: psdAutomatorCaseImage,
    href: "https://psdautomator.vercel.app/",
    cta: "Ver projeto ao vivo",
  },
  {
    category: "Content Factory",
    title: "NewsGen AI",
    description:
      "Plataforma web que transforma conteúdo em vídeo com IA: a partir de texto (notícias ou roteiro), gera narração e vídeo com apresentador virtual; também traduz vídeos gravados para outros idiomas mantendo áudio e imagem sincronizados.",
    highlight:
      "Produção de vídeos informativos com menos etapas manuais — roteiro, voz e montagem em um só fluxo",
    imageSrc: contentFactoryCaseImage,
    href: "https://ai-video-news-generator--video-generator-39001.us-central1.hosted.app/",
    cta: "Ver projeto ao vivo",
  },
  {
    category: "Software Sob Medida",
    title: "Green Sky",
    description:
      "Site institucional e comercial para operadora de parapente e asa delta (São Conrado e Niterói): catálogo de experiências, checkout Stripe ou fluxo consultivo via WhatsApp.",
    highlight: "Reservas online com Stripe e fundo de impacto social",
    imageSrc: greenSkyCaseImage,
    href: "https://greensky.com.br/",
    cta: "Ver projeto ao vivo",
  },
  {
    category: "MicroSaaS",
    title: "GrowthOS",
    description:
      "Dashboard web para Chief Growth Officer (receita, CAC, leads, ROAS, funil de produto e comparação de canais). Conecta Google Ads, Meta, Brevo, Snov.io, Mixpanel e GA4; o CGO AI Analyst gera relatórios estratégicos com Gemini.",
    highlight: "Funil completo de marketing e produto em um só lugar — com relatório estratégico gerado por IA",
    imageSrc: growthOsCaseImage,
    href: "https://youtu.be/oJyN6APFjuA",
    cta: "Assistir vídeo",
    video: true,
  },
  {
    category: "Automação com IA",
    title: "Conexão Ativa",
    description:
      "Monitora canal do Telegram e transforma mensagens de texto ou áudio em artigos otimizados para SEO: transcrição com OpenAI, redação estruturada com Claude, busca de imagem no Tavily e publicação automática no WordPress, Facebook e Instagram.",
    highlight: "Do Telegram ao portal publicado em minutos",
    imageSrc: automacaoCaseImage,
    href: "https://youtu.be/W5IOzuOQIVw",
    cta: "Assistir vídeo",
    video: true,
  },
  {
    category: "Automação com IA",
    title: "99Freelas Sniper",
    description:
      "Painel local que varre projetos no 99Freelas, filtra por whitelist/blacklist, gera propostas com Gemini e envia lances via Playwright.",
    highlight: "Prospecção e lances no 99Freelas no piloto automático — com revisão humana antes do envio",
    imageSrc: freelasSniperCaseImage,
    href: "https://youtu.be/0PwsGTaO3KI",
    cta: "Assistir vídeo",
    video: true,
  },
  {
    category: "MicroSaaS",
    title: "Cultura Fluxo Finance",
    description:
      "Plataforma B2B para gestão financeira e compliance de projetos culturais. Controle de orçamento por rubricas, análise de notas fiscais via IA e gestão de assinaturas.",
    highlight: "Automação de processos complexos de prestação de contas com análise de conformidade de documentos",
    imageSrc: culturaFluxoCaseImage,
    href: "https://execucaofinanceira.web.app/",
    cta: "Ver projeto ao vivo",
  },
];

const techStack = [
  { name: "React 19", icon: Code2 },
  { name: "Next.js 15", icon: Zap },
  { name: "TypeScript", icon: Code2 },
  { name: "Firebase Suite", icon: Database },
  { name: "Supabase", icon: Database },
  { name: "OpenAI GPT-4o", icon: Bot },
  { name: "Google Gemini", icon: Sparkles },
  { name: "Claude", icon: Brain },
  { name: "ElevenLabs", icon: Mic2 },
  { name: "HeyGen", icon: Film },
  { name: "Flutter", icon: Code2 },
  { name: "Dart", icon: Code2 },
];

const faqs = [
  {
    question: "Eu realmente preciso preparar algo para a call?",
    answer:
      "De forma alguma. Só precisamos que você saiba descrever em termos simples qual tarefa do seu time consome mais tempo hoje.",
  },
  {
    question: "A call de diagnóstico tem algum custo oculto?",
    answer:
      "Não. O diagnóstico é 100% gratuito. Nós fazemos isso porque boa parte das empresas que vê o potencial de ROI da automação escolhe nos contratar para desenvolvê-la, mas você é livre para usar o desenho técnico como quiser.",
  },
  {
    question: "E se o meu processo não puder ser automatizado?",
    answer:
      "Nós seremos os primeiros a te dizer isso logo no início da call. Não queremos desperdiçar o seu tempo nem o nosso.",
  },
];

type CalendlyWindow = Window & {
  Calendly?: {
    initInlineWidget?: (options: { url: string; parentElement: HTMLElement }) => void;
  };
};

type CalendlyMessageEvent = MessageEvent<{
  event?: string;
  payload?: unknown;
}>;

const isCalendlyEvent = (event: CalendlyMessageEvent): boolean =>
  event.origin === "https://calendly.com" &&
  typeof event.data?.event === "string" &&
  event.data.event.startsWith("calendly.");

const trackDiagnosticCta = (ctaPosition: string) => {
  trackEvent("diagnostico_cta_click", {
    page: "diagnostico",
    cta_position: ctaPosition,
    target: "calendly",
  });
};

const DiagnosticoPage = () => {
  useEffect(() => {
    document.title = "Diagnóstico de Automação & ROI | BuildAI";

    const scriptId = "calendly-inline-widget-script";
    const widget = document.querySelector<HTMLElement>(".calendly-inline-widget");
    const initCalendly = () => {
      if (!widget || widget.childElementCount > 0) return;
      (window as CalendlyWindow).Calendly?.initInlineWidget?.({
        url: calendlyUrl,
        parentElement: widget,
      });
      trackEvent("calendly_widget_loaded", {
        page: "diagnostico",
        calendly_url: calendlyUrl,
      });
    };

    const handleCalendlyMessage = (event: CalendlyMessageEvent) => {
      if (!isCalendlyEvent(event)) return;

      const calendlyEvent = event.data.event;
      if (calendlyEvent === "calendly.profile_page_viewed") {
        trackEvent("calendly_profile_viewed", { page: "diagnostico" });
      }
      if (calendlyEvent === "calendly.event_type_viewed") {
        trackEvent("calendly_event_type_viewed", { page: "diagnostico" });
      }
      if (calendlyEvent === "calendly.date_and_time_selected") {
        trackEvent("calendly_date_selected", { page: "diagnostico" });
      }
      if (calendlyEvent === "calendly.event_scheduled") {
        trackEvent("calendly_event_scheduled", {
          page: "diagnostico",
          calendly_url: calendlyUrl,
        });
        trackEvent("generate_lead", {
          page: "diagnostico",
          method: "calendly",
          value: 1,
        });
      }
    };

    window.addEventListener("message", handleCalendlyMessage);

    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      initCalendly();
      return () => window.removeEventListener("message", handleCalendlyMessage);
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "text/javascript";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = initCalendly;
    document.body.appendChild(script);

    return () => window.removeEventListener("message", handleCalendlyMessage);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#0B0F19] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[42rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[24rem] w-[24rem] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-[110px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between">
          <a href="/" aria-label="BuildAI" className="flex items-center gap-3">
            <img src={buildaiLogo} alt="BuildAI" className="h-9 w-auto" />
          </a>
          <a
            href="#calendly"
            onClick={() => trackDiagnosticCta("header")}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_32px_rgba(59,130,246,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_44px_rgba(99,102,241,0.45)] sm:px-5"
          >
            Garantir Diagnóstico Gratuito
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </header>

      <section className="relative px-4 pb-16 pt-16 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-28">
        <div className="container grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-100">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.85)]" />
              Vagas limitadas para esta semana
            </div>

            <h1 className="max-w-5xl text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-7xl">
              Descubra onde sua operação está{" "}
              <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                sangrando margem de lucro
              </span>{" "}
              (Em apenas 15 minutos)
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              Sem reuniões chatas. Você nos diz onde seu time perde tempo em planilhas ou sistemas,
              nós desenhamos a arquitetura de automação com IA e te entregamos o cálculo exato de ROI
              na hora. Se não se pagar de cara, nós mesmos te avisamos.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#calendly"
                onClick={() => trackDiagnosticCta("hero_primary")}
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(59,130,246,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_56px_rgba(99,102,241,0.55)]"
              >
                <CalendarDays className="h-5 w-5" />
                Agendar Meu Diagnóstico de 15 min
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <p className="text-sm font-medium text-cyan-100">👉 Avaliação técnica 100% gratuita.</p>
            </div>

            <div className="mt-10 grid max-w-3xl grid-cols-3 gap-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur"
                >
                  <div className="text-2xl font-extrabold text-white sm:text-3xl">{metric.value}</div>
                  <div className="mt-1 text-xs text-slate-400 sm:text-sm">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-blue-500/20 to-indigo-600/20 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Diagnóstico estimado</p>
                  <p className="text-2xl font-bold text-white">ROI em 15 min</p>
                </div>
                <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-200">
                  <BarChart3 className="h-7 w-7" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  ["Horas manuais por mês", "120h"],
                  ["Custo operacional exposto", "R$ 18k"],
                  ["Payback estimado", "45 dias"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-400">{label}</span>
                      <span className="font-mono text-lg font-bold text-cyan-200">{value}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                <CheckCircle2 className="mb-2 h-5 w-5" />
                Se a conta não fechar, a recomendação é não desenvolver. Simples assim.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="brand-eyebrow">Sem enrolação</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
              Como Funciona o Diagnóstico Sem Enrolação
            </h2>
            <p className="mt-4 text-slate-400">
              Três blocos rápidos para sair da call sabendo o que automatizar, como automatizar e
              quanto isso pode economizar.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="group relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:bg-white/[0.06]"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="rounded-2xl border border-blue-400/20 bg-blue-400/10 p-3 text-blue-200">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-sm text-slate-500">0{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-400">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="calendly" className="px-4 py-16 sm:py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2rem] border border-blue-400/20 bg-gradient-to-b from-blue-950/40 to-slate-950 p-6 shadow-[0_0_70px_rgba(59,130,246,0.18)] sm:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
            <div className="mx-auto max-w-3xl text-center">
              <span className="brand-eyebrow">Agenda técnica</span>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
                Escolha o melhor horário para seu diagnóstico técnico
              </h2>
              <p className="mt-4 text-slate-300">
                A reunião é curta, objetiva e feita para identificar retorno financeiro real antes de qualquer proposta.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-5xl">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
                <div
                  className="calendly-inline-widget min-w-[320px]"
                  data-url={calendlyUrl}
                  style={{ height: 700 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-24">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-3xl">
              <span className="brand-eyebrow">Portfólio BuildAI</span>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
                Resultados que falam por si
              </h2>
              <p className="mt-4 text-slate-400">
                Cases reais em automação, MicroSaaS, IA generativa e software sob medida.
              </p>
            </div>
            <a
              href="#calendly"
              onClick={() => trackDiagnosticCta("portfolio_section")}
              className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-5 py-3 text-sm font-bold text-blue-100 transition hover:border-blue-300/60 hover:bg-blue-400/20"
            >
              Quero mapear meu ROI
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {portfolio.map((project) => (
              <article
                key={project.title}
                className="group flex min-h-[480px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-white/[0.06]"
              >
                <div className="relative h-44 overflow-hidden border-b border-white/10 bg-slate-900">
                  <img
                    src={project.imageSrc}
                    alt={`Preview do case ${project.title}`}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/20 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur ${
                        categoryStyles[project.category]
                      }`}
                    >
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/35 p-2 text-white backdrop-blur">
                    {project.video ? (
                      <PlayCircle className="h-5 w-5" />
                    ) : (
                      <ExternalLink className="h-5 w-5" />
                    )}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{project.description}</p>
                  <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm font-medium leading-6 text-cyan-100">
                    {project.highlight}
                  </div>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackEvent("diagnostico_portfolio_click", {
                        page: "diagnostico",
                        project_title: project.title,
                        project_category: project.category,
                        destination_type: project.video ? "video" : "project",
                      })
                    }
                    className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-blue-200 transition hover:text-white"
                  >
                    {project.cta}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="brand-eyebrow">Stack dominada</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
              As ferramentas que dominamos
            </h2>
            <p className="mt-4 text-slate-400">
              Escolhemos stack pela relação entre velocidade de entrega, manutenção e ROI.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center transition hover:border-indigo-400/50 hover:bg-indigo-400/10"
                >
                  <Icon className="mx-auto h-5 w-5 text-cyan-200" />
                  <p className="mt-3 text-sm font-semibold text-slate-200">{tech.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="brand-eyebrow">Objeções finais</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
              Perguntas frequentes antes de agendar
            </h2>
            <p className="mt-4 text-slate-400">
              A ideia é simples: uma call curta, sem custo e com clareza técnica.
            </p>
            <a
              href="#calendly"
              onClick={() => trackDiagnosticCta("faq_section")}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.02]"
            >
              Garantir Diagnóstico Gratuito
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${index}`}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5"
              >
                <AccordionTrigger className="text-left text-base font-bold text-white hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="leading-7 text-slate-400">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="container">
          <div className="rounded-[2rem] border border-blue-400/20 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-cyan-500/10 p-8 text-center sm:p-12">
            <ShieldCheck className="mx-auto h-10 w-10 text-cyan-200" />
            <h2 className="mt-5 text-3xl font-bold text-white sm:text-5xl">
              Quer descobrir se automação se paga na sua operação?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Reserve 15 minutos. Se não existir ROI claro, você economiza semanas de tentativa e erro.
            </p>
            <a
              href="#calendly"
              onClick={() => trackDiagnosticCta("final_cta")}
              className="mt-8 inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-base font-extrabold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              Agendar Meu Diagnóstico de 15 min
              <CalendarDays className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} BuildAI. Todos os direitos reservados.</p>
          <a href="/termos" className="transition hover:text-blue-200">
            Termos de uso
          </a>
        </div>
      </footer>
    </main>
  );
};

export default DiagnosticoPage;
