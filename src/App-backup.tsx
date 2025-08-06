import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SimpleAppProvider } from './lib/simple-app-context';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Workspaces from './pages/Workspaces';
import Programs from './pages/Programs';
import Assets from './pages/Assets';
import Vulnerabilities from './pages/Vulnerabilities';
import Methodologies from './pages/Methodologies';
import Playbooks from './pages/Playbooks';
import Techniques from './pages/Techniques';
import Payloads from './pages/Payloads';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import MainLayout from './components/layout/main-layout';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SimpleAppProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/app" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="workspaces" element={<Workspaces />} />
              <Route path="programs" element={<Programs />} />
              <Route path="assets" element={<Assets />} />
              <Route path="vulnerabilities" element={<Vulnerabilities />} />
              <Route path="methodologies" element={<Methodologies />} />
              <Route path="playbooks" element={<Playbooks />} />
              <Route path="techniques" element={<Techniques />} />
              <Route path="payloads" element={<Payloads />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SimpleAppProvider>
  </QueryClientProvider>
);

export default App;
