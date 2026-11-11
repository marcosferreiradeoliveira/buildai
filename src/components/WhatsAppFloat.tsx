import WhatsAppLink from "@/components/WhatsAppLink";

const WhatsAppFloat = () => (
  <WhatsAppLink
    source="float"
    ariaLabel="Falar no WhatsApp"
    className="fixed bottom-[88px] left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg neon-glow transition hover:opacity-90 max-[480px]:bottom-[88px] min-[481px]:bottom-[max(2rem,env(safe-area-inset-bottom))] min-[481px]:left-auto min-[481px]:right-4"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.6 5.95L0 24l6.3-1.65a11.9 11.9 0 0 0 5.76 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.16-3.45-8.44zM12.07 21.3h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.74.98 1-3.64-.22-.37a9.37 9.37 0 0 1-1.44-5.01c0-5.18 4.22-9.4 9.42-9.4 2.51 0 4.87.98 6.65 2.76a9.35 9.35 0 0 1 2.75 6.64c0 5.19-4.22 9.55-9.28 9.55zm5.16-7.02c-.28-.14-1.67-.82-1.93-.92-.26-.1-.45-.14-.64.14-.19.28-.73.92-.9 1.11-.16.19-.33.21-.61.07-.28-.14-1.18-.43-2.25-1.38-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.47.1-.19.05-.35-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.35-.26.28-1 1-1 2.43s1.02 2.82 1.17 3.02c.14.19 2.01 3.07 4.87 4.31.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.67-.68 1.9-1.34.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.54-.33z" />
    </svg>
  </WhatsAppLink>
);

export default WhatsAppFloat;
