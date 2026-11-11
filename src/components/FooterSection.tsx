import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import SocialLinks from "@/components/SocialLinks";
import WhatsAppLink from "@/components/WhatsAppLink";
import { COMPANY_CITY, COMPANY_CNPJ, COMPANY_EMAIL } from "@/config/company";
import { LandingContent } from "@/types/landing";
import { useUi } from "@/i18n/LanguageContext";
import { openWhatsApp } from "@/lib/whatsapp";

type FooterSectionProps = {
  content: LandingContent["contact"];
};

const FooterSection = ({ content }: FooterSectionProps) => {
  const ref = useRef(null);
  const ui = useUi();
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!form.name.trim()) e.name = ui.footer.nameRequired;
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = ui.footer.emailInvalid;
    if (phoneDigits && phoneDigits.length < 10) e.phone = ui.footer.phoneInvalid;
    if (!form.message.trim()) e.message = ui.footer.messageRequired;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const message = ui.footer.whatsappIntro(form.name, form.email, form.phone, form.company, form.message);
    openWhatsApp(message, "contact_form");
    setForm({ name: "", email: "", phone: "", company: "", message: "" });
    setErrors({});
    setSubmitted(true);
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
            <span className="brand-eyebrow">{content.eyebrow}</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-3 mb-6">
              {content.title} <span className="gradient-text">{content.highlightedText}</span>?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-md leading-relaxed">
              {content.description}
            </p>

            <SocialLinks />
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-5 pb-28"
          >
            <div className="rounded-lg border border-border bg-card px-4 py-3">
              <WhatsAppLink source="contact" className="text-sm font-semibold text-primary hover:underline">
                {ui.footer.preferWhatsApp}
              </WhatsAppLink>
            </div>

            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-lg border border-success/40 bg-success/10 px-4 py-3"
              >
                <p className="text-sm font-semibold text-foreground">{content.successTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{content.successDescription}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder={ui.footer.namePlaceholder}
                required
                aria-required="true"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition"
                maxLength={100}
              />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <textarea
                placeholder={ui.footer.messagePlaceholder}
                required
                aria-required="true"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition resize-none"
                maxLength={1000}
              />
              {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
            </div>
            <details className="rounded-lg border border-border px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold">{ui.footer.moreDetails}</summary>
              <div className="mt-4 space-y-5">
                <div>
                  <input
                    type="email"
                    placeholder={ui.footer.emailPlaceholder}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition"
                    maxLength={255}
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={ui.footer.phonePlaceholder}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
                      className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition"
                      maxLength={16}
                    />
                    {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      autoComplete="organization"
                      placeholder={ui.footer.companyPlaceholder}
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition"
                      maxLength={120}
                    />
                  </div>
                </div>
              </div>
            </details>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-semibold text-sm hover:opacity-90 transition neon-glow"
            >
              {content.submitLabel}
            </button>
            </form>
          </motion.div>
        </div>

        <div className="mt-20 pt-8 border-t border-border text-center text-xs text-muted-foreground space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {COMPANY_EMAIL ? <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a> : null}
            {COMPANY_CITY ? <span>{COMPANY_CITY}</span> : null}
            {COMPANY_CNPJ ? <span>{COMPANY_CNPJ}</span> : null}
            <Link to={ui.footer.privacy} className="hover:text-foreground">{ui.footer.privacyLabel}</Link>
          </div>
          <p>© {new Date().getFullYear()} {content.copyrightName}. {ui.footer.rightsReserved}</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
