import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Cpu, TerminalSquare, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../landingPage/Navbar';
import Footer from '../landingPage/Footer';
import LoginForm from './LoginForm';
import './styles/Auth.css';

export default function LoginPage() {
  const { user, logout, authModalMode, setAuthModalMode } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlMode = searchParams.get('mode');
  useEffect(() => {
    if (urlMode === 'register' || urlMode === 'login') {
      setAuthModalMode(urlMode);
    }
  }, [urlMode, setAuthModalMode]);

  return (
    <div className="min-h-screen bg-background text-textMain flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4">
        {/* Glow behind the card */}
        <div className="w-full max-w-md relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-xl opacity-75 pointer-events-none" />

          <div className="relative rounded-2xl bg-card border border-borderLine shadow-2xl p-2">
            {user ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg shadow-indigo-500/30">
                  {user.avatar || 'SZ'}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-2">
                  <CheckCircle size={12} /> SESSION ACTIVE
                </div>
                <h2 className="text-2xl font-extrabold text-textMain mb-1">
                  {user.name}
                </h2>
                <p className="text-sm text-textMuted mb-2">{user.email}</p>
                <p className="text-xs font-mono text-primary font-semibold mb-6">
                  ROLE: {user.role}
                </p>

                <div className="flex flex-col gap-3">
                  <Link
                    to="/simulation"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold bg-primary text-white shadow-lg shadow-indigo-500/25 hover:opacity-90 transition-all"
                  >
                    <Cpu size={18} />
                    <span>Open Digital Logic Simulation</span>
                  </Link>

                  <Link
                    to="/learn/process-management/sandbox"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold bg-background border border-borderLine text-textMain hover:bg-card transition-all"
                  >
                    <TerminalSquare size={18} />
                    <span>Launch Process Sandbox</span>
                  </Link>

                  <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-all mt-2"
                  >
                    <LogOut size={16} />
                    <span>Sign Out of Session</span>
                  </button>
                </div>
              </div>
            ) : (
              <LoginForm
                initialMode={authModalMode}
                onSuccess={() => navigate('/')}
              />
            )}
          </div>

          <div className="text-center mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-textMain transition-colors"
            >
              <ArrowLeft size={14} /> Back to System Zero Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
