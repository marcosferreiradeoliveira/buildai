import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LandingContent } from "@/types/landing";

type FooterSectionProps = {
  content: LandingContent["contact"];
};

const FooterSection = ({ content }: FooterSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nome é obrigatório";
    if (!form.email.trim()) e.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
    if (!form.message.trim()) e.message = "Mensagem é obrigatória";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    toast({
      title: content.successTitle,
      description: content.successDescription,
    });
    setForm({ name: "", email: "", message: "" });
    setErrors({});
  };

  return (
    <footer id="contato" className="py-24 sm:py-32 border-t border-border" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">{content.eyebrow}</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-3 mb-6">
              {content.title} <span className="gradient-text">{content.highlightedText}</span>?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-md leading-relaxed">
              {content.description}
            </p>

            <div className="flex gap-4">
              {content.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
                >
                  <span className="text-xs capitalize">{social.label.charAt(0).toUpperCase()}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <input
                type="text"
                placeholder="Seu nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition"
                maxLength={100}
              />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                type="email"
                placeholder="Seu email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition"
                maxLength={255}
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <textarea
                placeholder="Conte sobre seu projeto..."
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition resize-none"
                maxLength={1000}
              />
              {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-semibold text-sm hover:opacity-90 transition neon-glow"
            >
              {content.submitLabel}
            </button>
          </motion.form>
        </div>

        <div className="mt-20 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {content.copyrightName}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
