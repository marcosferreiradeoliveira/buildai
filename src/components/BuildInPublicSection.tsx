import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const timeline = [
  { date: "Semana 1", title: "Descoberta & Planejamento", description: "Entendemos seu problema, definimos escopo e escolhemos a stack ideal.", status: "done" },
  { date: "Semana 2-3", title: "MVP & Prototipação", description: "Desenvolvimento ágil com entregas diárias. Você acompanha tudo em tempo real.", status: "done" },
  { date: "Semana 4", title: "Testes & Feedback", description: "Ciclo de testes com usuários reais. Ajustes rápidos baseados em dados.", status: "active" },
  { date: "Semana 5+", title: "Deploy & Iteração", description: "Lançamento, monitoramento e melhoria contínua com métricas de sucesso.", status: "upcoming" },
];

const BuildInPublicSection = () => {
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
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Build-in-Public</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mt-3">
            Transparência <span className="gradient-text">total</span> no processo
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Você acompanha cada etapa do desenvolvimento. Sem surpresas, sem caixas-pretas.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

          {timeline.map((item, i) => (
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
