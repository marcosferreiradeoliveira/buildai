import { useParams } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/NotFound";
import { getSegmentLandingContent } from "@/content/landing";

const SegmentPage = () => {
  const { segmentSlug } = useParams<{ segmentSlug: string }>();

  if (!segmentSlug) {
    return <NotFound />;
  }

  const content = getSegmentLandingContent(segmentSlug);

  if (!content) {
    return <NotFound />;
  }

  return <LandingPage content={content} />;
};

export default SegmentPage;
