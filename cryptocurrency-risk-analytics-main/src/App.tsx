import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { lazy, Suspense } from "react";

const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Markets = lazy(() => import("./pages/Markets"));
const CoinDetail = lazy(() => import("./pages/CoinDetail"));
const Analytics = lazy(() => import("./pages/Analytics"));
const News = lazy(() => import("./pages/News"));
const ArchivePage = lazy(() => import("./pages/Archive"));
const Compare = lazy(() => import("./pages/Compare"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const Trade = lazy(() => import("./pages/Trade"));
const AiAssistant = lazy(() => import("./pages/AiAssistant"));
const SystemArchitecture = lazy(() => import("./pages/SystemArchitecture"));
const Repository = lazy(() => import("./pages/Repository"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/coin/:id" element={<CoinDetail />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/news" element={<News />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/trade" element={<Trade />} />
              <Route path="/ai-assistant" element={<AiAssistant />} />
              <Route path="/system-architecture" element={<SystemArchitecture />} />
              <Route path="/repository" element={<Repository />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
