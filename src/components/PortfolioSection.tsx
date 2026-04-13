import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const projects = [
  {
    title: "AutoFlow AI",
    category: "Automação com IA",
    metric: "Redução de 40% no custo operacional",
    description: "Sistema de automação inteligente para processos de atendimento ao cliente com agentes de IA.",
  },
  {
    title: "MetricHub",
    category: "MicroSaaS",
    metric: "3.000 usuários em 90 dias",
    description: "Dashboard analítico para e-commerces com integrações automáticas e insights em tempo real.",
  },
  {
    title: "LegalDocs Pro",
    category: "Software Sob Medida",
    metric: "200h/mês economizadas",
    description: "Plataforma de geração e gestão de documentos jurídicos com IA generativa integrada.",
  },
];

const PortfolioSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="portfolio" className="py-24 sm:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Portfólio</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mt-3">
            Resultados que <span className="gradient-text">falam</span> por si
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group p-8 rounded-2xl bg-card border border-border neon-border-hover transition-all duration-500"
            >
              <span className="text-[10px] uppercase tracking-widest text-neon-blue font-semibold">
                {project.category}
              </span>
              <h3 className="text-xl font-heading font-semibold mt-3 mb-2">{project.title}</h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{project.description}</p>
              <div className="pt-4 border-t border-border">
                <div className="text-sm font-semibold gradient-text">{project.metric}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
