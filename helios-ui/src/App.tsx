import { useState } from 'react';
import "./App.css";

const BACKEND_URL = 'https://aeterna-unified-production.up.railway.app';

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('✅ Registration successful! Welcome to AETERNA.');
        setRegistered(true);
        console.log('Registration success:', data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage(`❌ Registration failed: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('❌ Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-400">⚡ AETERNA.WEBSITE</h1>
          <div className="text-sm text-gray-400">Production Ready SaaS Platform</div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Left - Features */}
          <div>
            <h2 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              The Ultimate Test Automation Platform
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              87.5% Superior to Cypress, Selenium & Playwright
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-green-400">
                <span>✅</span> Self-Healing Scripts
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span>✅</span> AI-Powered Element Detection
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span>✅</span> Natural Language Commands
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span>✅</span> Multi-Browser Swarm Testing
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span>✅</span> 6 SaaS Applications Included
              </div>
            </div>

            <button 
              onClick={() => setShowRegister(true)}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-bold text-lg transition"
            >
              Get Started Now
            </button>
          </div>

          {/* Right - Pricing */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
            {!showRegister ? (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-6">Choose Your Plan</h3>
                
                <div className="border border-gray-600 rounded-lg p-4 hover:border-purple-500 cursor-pointer transition">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">Starter</span>
                    <span className="text-purple-400 font-bold">$49/mo</span>
                  </div>
                  <p className="text-gray-400 text-sm">3 SaaS apps</p>
                </div>

                <div className="border border-purple-500 rounded-lg p-4 bg-purple-500/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">Professional</span>
                    <span className="text-purple-400 font-bold">$199/mo</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">All 6 SaaS apps (MOST POPULAR)</p>
                  <div className="inline-block bg-purple-600 px-2 py-1 rounded text-xs">RECOMMENDED</div>
                </div>

                <div className="border border-gray-600 rounded-lg p-4 hover:border-purple-500 cursor-pointer transition">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">Enterprise</span>
                    <span className="text-purple-400 font-bold">Custom</span>
                  </div>
                  <p className="text-gray-400 text-sm">Full customization</p>
                </div>

                <button 
                  onClick={() => setShowRegister(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-bold mt-4 transition"
                >
                  Register Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <h3 className="text-2xl font-bold mb-6">
                  {registered ? '🎉 Welcome!' : 'Create Account'}
                </h3>
                
                {message && (
                  <div className={`p-3 rounded ${message.includes('✅') ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                    {message}
                  </div>
                )}

                {!registered && (
                  <>
                    <input 
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                    />
                    
                    <input 
                      type="password"
                      placeholder="Password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                    />

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-bold transition disabled:opacity-50"
                    >
                      {loading ? 'Registering...' : 'Complete Registration'}
                    </button>
                  </>
                )}

                <button 
                  type="button"
                  onClick={() => { setShowRegister(false); setMessage(''); setRegistered(false); }}
                  className="w-full text-gray-400 hover:text-white py-2"
                >
                  {registered ? 'Continue to Dashboard' : 'Back'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-800/30 border-t border-gray-700 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-purple-400">14/16</div>
            <div className="text-gray-400">Win Rate vs Competitors</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">20x</div>
            <div className="text-gray-400">Faster Execution</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">€462k</div>
            <div className="text-gray-400">Monthly Revenue Potential</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-400">99.97%</div>
            <div className="text-gray-400">Uptime Guarantee</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
