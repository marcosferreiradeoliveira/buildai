import { useUi } from "@/i18n/LanguageContext";

const FaqSection = () => {
  const ui = useUi();

  return (
    <section id="perguntas" className="py-24 sm:py-32">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="text-3xl font-heading font-bold sm:text-4xl">{ui.faq.title}</h2>
        <div className="mt-8 divide-y divide-border rounded-2xl border border-border">
          {ui.faq.items.map((item) => (
            <details key={item.question} className="group px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold [&::-webkit-details-marker]:hidden">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
