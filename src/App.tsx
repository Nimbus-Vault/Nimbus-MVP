import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './lib/supabase-app-context';
import { ThemeProvider } from '@/components/theme-provider';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Workspaces from './pages/Workspaces';
import Platforms from './pages/Platforms';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Assets from './pages/Assets';
import Functionalities from './pages/Functionalities';
import Technologies from './pages/Technologies';
import Behaviors from './pages/Behaviors';
import Vulnerabilities from './pages/Vulnerabilities';
import AtomicVulnerabilities from './pages/AtomicVulnerabilities';
import LogicFlaws from './pages/LogicFlaws';
import Methodologies from './pages/Methodologies';
import Playbooks from './pages/Playbooks';
import Techniques from './pages/Techniques';
import Payloads from './pages/Payloads';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import AssetDetail from './pages/AssetDetail';
import VulnerabilityClassDetail from './pages/VulnerabilityClassDetail';
import SuggestionDemo from './pages/SuggestionDemo';
import MainLayout from './components/layout/main-layout';
import Signup from './pages/Signup';

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="nimbus-ui-theme">
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/app" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="workspaces" element={<Workspaces />} />
                <Route path="platforms" element={<Platforms />} />
                <Route path="programs" element={<Programs />} />
                <Route path="programs/:id" element={<ProgramDetail />} />
                <Route path="programs/:programId/assets/:assetId" element={<AssetDetail />} />
                <Route path="functionalities" element={<Functionalities />} />
                <Route path="technologies" element={<Technologies />} />
                <Route path="behaviors" element={<Behaviors />} />
                <Route path="vulnerability-classes" element={<Vulnerabilities />} />
                <Route path="vulnerability-classes/:id" element={<VulnerabilityClassDetail />} />
                <Route path="atomic-vulns" element={<AtomicVulnerabilities />} />
                <Route path="logic-flaws" element={<LogicFlaws />} />
                <Route path="methodologies" element={<Methodologies />} />
                <Route path="playbooks" element={<Playbooks />} />
                <Route path="techniques" element={<Techniques />} />
                <Route path="payloads" element={<Payloads />} />
                <Route path="suggestion-demo" element={<SuggestionDemo />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
