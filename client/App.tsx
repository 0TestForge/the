import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GrowGarden from "./pages/GrowGarden";
import GrowGardenAll from "./pages/GrowGardenAll";
import BloxFruits from "./pages/BloxFruits";
import BloxFruitsAll from "./pages/BloxFruitsAll";
import MM2 from "./pages/MM2";
import MM2All from "./pages/MM2All";
import Brainrot from "./pages/Brainrot";
import BrainrotAll from "./pages/BrainrotAll";
import Chat from "./pages/Chat";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Blade from "./pages/Blade";
import { Layout } from "@/components/layout/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/grow" element={<GrowGarden />} />
            <Route path="/grow/all" element={<GrowGardenAll />} />
            <Route path="/mm" element={<MM2 />} />
            <Route path="/mm/all" element={<MM2All />} />
            <Route path="/brainrot" element={<Brainrot />} />
            <Route path="/brainrot/all" element={<BrainrotAll />} />
            <Route path="/blox" element={<BloxFruits />} />
            <Route path="/blox/all" element={<BloxFruitsAll />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/blade" element={<Blade />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
