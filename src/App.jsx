import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import MatchPage from "./pages/MatchPage";
import TicketsPage from "./pages/TicketsPage";
import { useTicketStore } from "./store/useTicketStore";
import { useMatchStore } from "./store/useMatchStore";
import { Home, Ticket, Crosshair } from "lucide-react";

function NavLink({ to, icon: Icon, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      aria-label={`Navigate to ${children}`}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-body font-600 transition-all duration-150 
        ${isActive
          ? 'bg-amber/15 text-amber'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface'
        }`}
    >
      <Icon size={16} />
      <span className="hidden sm:inline">{children}</span>
    </Link>
  );
}

function App() {
  const loadTickets = useTicketStore(state => state.loadTickets);
  const loadMatchConfig = useMatchStore(state => state.loadMatchConfig);

  useEffect(() => {
    loadTickets();
    loadMatchConfig();
  }, [loadTickets, loadMatchConfig]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-base">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#141826',
              border: '1px solid #252D42',
              color: '#EDF0FF',
              fontFamily: '"Inter", sans-serif',
              fontWeight: '500',
              borderRadius: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
          }}
        />

        <header className="bg-elevated border-b border-overlay sticky top-0 z-30">
          <div className="max-w-7xl mx-auto flex gap-1 items-center px-4 py-3">
            <div className="font-heading font-[800] text-xl text-text-primary mr-6 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Tambola
            </div>
            <NavLink to="/" icon={Home}>Home</NavLink>
            <NavLink to="/tickets" icon={Ticket}>Tickets</NavLink>
            <NavLink to="/match" icon={Crosshair}>Match</NavLink>
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/match" element={<MatchPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
