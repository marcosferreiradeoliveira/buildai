import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AnalyticsPageView from "@/components/AnalyticsPageView";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "./pages/Index.tsx";

const AdminLeadGeneratorPage = lazy(() => import("./pages/AdminLeadGeneratorPage.tsx"));
const DiagnosticoPage = lazy(() => import("./pages/DiagnosticoPage.tsx"));
const LeadLandingPage = lazy(() => import("./pages/LeadLandingPage.tsx"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage.tsx"));
const SegmentPage = lazy(() => import("./pages/SegmentPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AnalyticsPageView />
        <WhatsAppFloat />
        <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/diagnostico" element={<DiagnosticoPage />} />
          <Route path="/admin" element={<AdminLeadGeneratorPage />} />
          <Route path="/admin/gerar" element={<AdminLeadGeneratorPage />} />
          <Route path="/lp/:leadSlug" element={<LeadLandingPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/:segmentSlug" element={<SegmentPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
