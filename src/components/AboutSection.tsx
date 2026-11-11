import { useState } from "react";
import { useUi } from "@/i18n/LanguageContext";

const AboutSection = () => {
  const ui = useUi();
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <section id="quem-faz" className="py-24 sm:py-32">
      <div className="container mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center sm:flex-row sm:text-left">
        {photoFailed ? (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xl font-semibold text-primary" aria-hidden="true">
            MF
          </div>
        ) : (
          <img
            src="/marcos.webp"
            alt="Marcos Ferreira"
            width={96}
            height={96}
            loading="lazy"
            decoding="async"
            onError={() => setPhotoFailed(true)}
            className="h-24 w-24 shrink-0 rounded-full object-cover"
          />
        )}
        <div>
          <h2 className="text-3xl font-heading font-bold">{ui.about.title}</h2>
          {/* TODO Marcos confirmar */}
          <p className="mt-3 text-muted-foreground leading-relaxed">{ui.about.body}</p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
