import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/NotFound";
import { buildLandingContentFromLead, loadLeadPageBySlug } from "@/lib/leadPages";
import { LeadPageConfig } from "@/types/lead";

const LeadLandingPage = () => {
  const { leadSlug } = useParams<{ leadSlug: string }>();
  const [lead, setLead] = useState<LeadPageConfig | null | undefined>(undefined);

  useEffect(() => {
    if (!leadSlug) {
      setLead(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const data = await loadLeadPageBySlug(leadSlug);
        if (!cancelled) setLead(data);
      } catch {
        if (!cancelled) setLead(null);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [leadSlug]);

  if (!leadSlug) {
    return <NotFound />;
  }

  if (lead === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground text-sm">
        Carregando…
      </div>
    );
  }

  if (lead === null) {
    return <NotFound />;
  }

  const content = buildLandingContentFromLead(lead);

  return <LandingPage content={content} />;
};

export default LeadLandingPage;
