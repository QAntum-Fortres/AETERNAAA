import { SovereignHUD } from './components/SovereignHUD';
import ClientPortal from './components/ClientPortal';
import { useState, useEffect } from 'react';
import "./App.css";
import "./LegacyComponents.css";

const BACKEND_URL = 'https://aeternaaa-production.up.railway.app';
type AppMode = 'client' | 'admin';

function App() {
  const [mode, setMode] = useState<AppMode>('client');

  // Check URL params for admin mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'admin') {
      setMode('admin');
    }
  }, []);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden selection:bg-cyan-500/30">
      {/* Mode Toggle */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <button 
          onClick={() => setMode('client')}
          className={`px-3 py-1 rounded-lg text-sm transition ${mode === 'client' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'}`}
        >
          🌐 Client
        </button>
        <button 
          onClick={() => setMode('admin')}
          className={`px-3 py-1 rounded-lg text-sm transition ${mode === 'admin' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'}`}
        >
          👑 Admin
        </button>
      </div>

      {/* Render based on mode */}
      {mode === 'client' ? <ClientPortal /> : <SovereignHUD />}
    </div>
  );
}

export default App;
