import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bot,
  Brain,
  CalendarDays,
  Calculator,
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
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SeoHead from "@/components/SeoHead";
import WhatsAppCtaBand from "@/components/WhatsAppCtaBand";
import { trackEvent } from "@/lib/analytics";
import buildaiLogo from "@/assets/buildai-logo-transparent.png";
import encartes640 from "@/assets/cases/encartes-640.webp";
import encartes960 from "@/assets/cases/encartes-960.webp";
import encartesJpeg from "@/assets/cases/encartes-960.jpg";
import greensky640 from "@/assets/cases/greensky-640.webp";
import greensky960 from "@/assets/cases/greensky-960.webp";
import greenskyJpeg from "@/assets/cases/greensky-960.jpg";
import conexao640 from "@/assets/cases/conexao-640.webp";
import conexao960 from "@/assets/cases/conexao-960.webp";
import conexaoJpeg from "@/assets/cases/conexao-960.jpg";
import newsgen640 from "@/assets/cases/newsgen-640.webp";
import newsgen960 from "@/assets/cases/newsgen-960.webp";
import newsgenJpeg from "@/assets/cases/newsgen-960.jpg";
import growth640 from "@/assets/cases/growth-640.webp";
import growth960 from "@/assets/cases/growth-960.webp";
import growthJpeg from "@/assets/cases/growth-960.jpg";

const calendlyUrl = "https://calendly.com/buildaidev/30min";
const urgentCtaClass =
  "group inline-flex items-center justify-center gap-3 rounded-2xl border border-yellow-200/70 bg-gradient-to-r from-yellow-300 via-cyan-300 to-blue-400 px-6 py-4 text-base font-extrabold text-slate-950 shadow-[0_0_44px_rgba(250,204,21,0.55)] ring-2 ring-yellow-200/25 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_0_70px_rgba(34,211,238,0.65)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-200/60";
const urgentCtaSmallClass =
  "group inline-flex items-center justify-center gap-2 rounded-full border border-yellow-200/70 bg-gradient-to-r from-yellow-300 via-cyan-300 to-blue-400 px-4 py-2.5 text-sm font-extrabold text-slate-950 shadow-[0_0_34px_rgba(250,204,21,0.48)] ring-2 ring-yellow-200/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_54px_rgba(34,211,238,0.58)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-200/60 sm:px-5";

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

const caseSizes = "(min-width: 1280px) 28rem, (min-width: 768px) 46vw, 100vw";

const portfolio = [
  {
    category: "Automação com IA",
    title: "Gerador de Encartes para Varejo/Supermercado",
    description:
      "Pega um layout do Photoshop, uma planilha e uma pasta de imagens, e gera encartes, catálogos, cards e banners em lote, sem montar peça por peça na mão.",
    highlight:
      "Produção em lote de encartes e peças de varejo a partir de um layout e de uma planilha, sem retrabalho manual.",
    imageSrc: encartesJpeg,
    imageSrcSet: `${encartesJpeg} 960w`,
    webpSrcSet: `${encartes640} 640w, ${encartes960} 960w`,
    href: "https://psdautomator.vercel.app/",
    cta: "Ver projeto ao vivo",
  },
  {
    category: "Software Sob Medida",
    title: "Green Sky",
    description:
      "Site da operadora de parapente e asa delta (São Conrado e Niterói), com catálogo de experiências, pagamento no site ou conversa no WhatsApp, seis idiomas e contador público do fundo de impacto.",
    highlight: "Reservas online com pagamento no site ou conversa no WhatsApp — turismo de aventura no Rio.",
    imageSrc: greenskyJpeg,
    imageSrcSet: `${greenskyJpeg} 960w`,
    webpSrcSet: `${greensky640} 640w, ${greensky960} 960w`,
    href: "https://greensky.com.br/",
    cta: "Ver projeto ao vivo",
  },
  {
    category: "Automação com IA",
    title: "Conexão Ativa — Automação de Notícias",
    description:
      "Monitora um canal do Telegram, estrutura o artigo, busca imagem e publica no portal, no Facebook e no Instagram, com repostagem em portais secundários quando cabe.",
    highlight: "Do Telegram ao portal, ao Facebook e ao Instagram, sem o time copiar e colar o mesmo conteúdo em três lugares.",
    imageSrc: conexaoJpeg,
    imageSrcSet: `${conexaoJpeg} 960w`,
    webpSrcSet: `${conexao640} 640w, ${conexao960} 960w`,
    href: "https://youtu.be/W5IOzuOQIVw",
    cta: "Assistir vídeo",
    video: true,
  },
  {
    category: "Content Factory",
    title: "NewsGen AI",
    description:
      "A partir de um texto, gera narração e vídeo com apresentador virtual. Também traduz um vídeo já gravado, mantendo áudio e imagem alinhados.",
    highlight: "Roteiro, voz e montagem de vídeo informativo num só fluxo.",
    imageSrc: newsgenJpeg,
    imageSrcSet: `${newsgenJpeg} 960w`,
    webpSrcSet: `${newsgen640} 640w, ${newsgen960} 960w`,
    href: "https://ai-video-news-generator--video-generator-39001.us-central1.hosted.app/",
    cta: "Ver projeto ao vivo",
  },
  {
    category: "MicroSaaS",
    title: "GrowthOS",
    description:
      "Painel de growth com visão de receita, funil e canais. Conecta as fontes de anúncio e de e-mail, e um analista de IA monta o relatório a partir dos dados sincronizados.",
    highlight: "Funil de marketing e produto no mesmo lugar, com relatório estratégico gerado por IA.",
    imageSrc: growthJpeg,
    imageSrcSet: `${growthJpeg} 960w`,
    webpSrcSet: `${growth640} 640w, ${growth960} 960w`,
    href: "https://youtu.be/oJyN6APFjuA",
    cta: "Assistir vídeo",
    video: true,
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

const scrollToCalendly = () => {
  document.getElementById("calendly")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

const getPaybackEstimate = (monthlyLoss: number): string => {
  if (monthlyLoss < 3000) return "45 dias";
  if (monthlyLoss <= 10000) return "30 dias";
  return "15 dias";
};

type RangeControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  prefix?: string;
  onChange: (value: number) => void;
};

const RangeControl = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  prefix,
  onChange,
}: RangeControlProps) => {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <label className="block rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 font-mono text-sm font-bold text-cyan-100">
          {prefix}
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-300 outline-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-cyan-300 [&::-moz-range-thumb]:shadow-[0_0_24px_rgba(34,211,238,0.8)] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-cyan-300 [&::-webkit-slider-thumb]:shadow-[0_0_24px_rgba(34,211,238,0.8)]"
        style={{
          background: `linear-gradient(90deg, #22d3ee 0%, #60a5fa ${progress}%, rgba(30,41,59,0.95) ${progress}%, rgba(30,41,59,0.95) 100%)`,
        }}
      />
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>
          {prefix}
          {min}
          {unit}
        </span>
        <span>
          {prefix}
          {max}
          {unit}
        </span>
      </div>
    </label>
  );
};

const RoiCalculator = () => {
  const [teamSize, setTeamSize] = useState(5);
  const [weeklyHours, setWeeklyHours] = useState(8);
  const [hourlyCost, setHourlyCost] = useState(40);

  const wastedHours = Math.round(teamSize * weeklyHours * 4.33);
  const monthlyLoss = wastedHours * hourlyCost;
  const payback = getPaybackEstimate(monthlyLoss);

  const handleAutomateClick = () => {
    trackDiagnosticCta("roi_calculator");
    trackEvent("roi_calculator_cta_click", {
      page: "diagnostico",
      team_size: teamSize,
      weekly_hours: weeklyHours,
      hourly_cost: hourlyCost,
      wasted_hours: wastedHours,
      monthly_loss: monthlyLoss,
      payback_estimate: payback,
    });
    scrollToCalendly();
  };

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-cyan-400/25 via-blue-500/20 to-indigo-600/25 blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/25 bg-[#0F172A]/85 p-5 shadow-[0_0_80px_rgba(34,211,238,0.16)] backdrop-blur-xl sm:p-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-cyan-200">Calculadora de ROI</p>
            <h2 className="mt-1 text-2xl font-extrabold text-white">Quanto custa não automatizar?</h2>
          </div>
          <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-3 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.22)]">
            <Calculator className="h-7 w-7" />
          </div>
        </div>

        <div className="space-y-4">
          <RangeControl
            label="Tamanho do Time"
            value={teamSize}
            min={1}
            max={30}
            unit=" pessoas"
            onChange={setTeamSize}
          />
          <RangeControl
            label="Horas Perdidas"
            value={weeklyHours}
            min={2}
            max={40}
            unit="h/sem"
            onChange={setWeeklyHours}
          />
          <RangeControl
            label="Custo da Hora do Time"
            value={hourlyCost}
            min={20}
            max={150}
            prefix="R$ "
            onChange={setHourlyCost}
          />
        </div>

        <div className="mt-6 rounded-3xl border border-orange-300/20 bg-gradient-to-br from-orange-500/15 via-red-500/10 to-cyan-400/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100/80">
            Custo Mensal Exposto
          </p>
          <div className="mt-2 bg-gradient-to-r from-orange-300 via-yellow-200 to-cyan-200 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
            {formatCurrency(monthlyLoss)}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock3 className="h-4 w-4 text-cyan-200" />
              <span className="text-sm">Horas Desperdiçadas/Mês</span>
            </div>
            <p className="mt-2 font-mono text-3xl font-extrabold text-white">{wastedHours}h</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="h-4 w-4 text-yellow-200" />
              <span className="text-sm">Payback Estimado</span>
            </div>
            <p className="mt-2 font-mono text-3xl font-extrabold text-cyan-100">{payback}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-yellow-200/20 bg-yellow-200/10 p-4">
          <p className="text-sm font-semibold leading-6 text-yellow-50">
            Seu time está perdendo {wastedHours} horas que poderiam ser automatizadas. Vamos zerar esse custo?
          </p>
          <button type="button" onClick={handleAutomateClick} className={`${urgentCtaSmallClass} mt-4`}>
            Automatizar este processo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const DiagnosticoPage = () => {
  useEffect(() => {
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
      <SeoHead
        title="Diagnóstico de Automação & ROI | BuildAI"
        description="Diagnóstico de automação e ROI. A BuildAI desenvolve apps, sistemas sob medida e automação com IA para reduzir trabalho manual."
        previewImageSrc="/preview.jpeg"
        faviconHref="/favicon.png"
      />
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
            className={urgentCtaSmallClass}
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
                className={urgentCtaClass}
              >
                <CalendarDays className="h-5 w-5" />
                Agendar Meu Diagnóstico de 15 min
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <p className="text-sm font-medium text-cyan-100">👉 Avaliação técnica 100% gratuita.</p>
            </div>

          </div>

          <RoiCalculator />
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
              <div className="mb-6 flex flex-col items-center justify-center gap-3 text-center">
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackDiagnosticCta("calendly_top")}
                  className={urgentCtaClass}
                >
                  <CalendarDays className="h-5 w-5" />
                  Escolher horário agora
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-100/80">
                  Poucos horários disponíveis esta semana
                </p>
              </div>
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
              className={urgentCtaSmallClass}
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
                  <picture>
                    <source type="image/webp" srcSet={project.webpSrcSet} sizes={caseSizes} />
                    <img
                      src={project.imageSrc}
                      srcSet={project.imageSrcSet}
                      sizes={caseSizes}
                      alt={`Preview do case ${project.title}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                  </picture>
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
          <WhatsAppCtaBand source="diagnostico_cases" className="mt-10" />
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
              className={`${urgentCtaSmallClass} mt-8`}
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
              className={`${urgentCtaClass} mt-8`}
            >
              Agendar Meu Diagnóstico de 15 min
              <CalendarDays className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <div className="px-4 pb-16">
        <WhatsAppCtaBand source="diagnostico_end" className="container" />
      </div>

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
