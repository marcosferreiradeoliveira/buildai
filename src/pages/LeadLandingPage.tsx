import { useParams } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/NotFound";
import { buildLandingContentFromLead, getLeadPageBySlug } from "@/lib/leadPages";

const LeadLandingPage = () => {
  const { leadSlug } = useParams<{ leadSlug: string }>();

  if (!leadSlug) {
    return <NotFound />;
  }

  const lead = getLeadPageBySlug(leadSlug);

  if (!lead) {
    return <NotFound />;
  }

  const content = buildLandingContentFromLead(lead);

  return <LandingPage content={content} />;
};

export default LeadLandingPage;
