import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Cpu, TerminalSquare, HardDrive, LogOut, CheckCircle } from 'lucide-react';
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
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-card border border-borderLine shadow-lg p-2">
            {user ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-lg font-bold mb-3">
                  {user.avatar || 'SZ'}
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-3">
                  <CheckCircle size={12} /> Active Session
                </div>
                <h2 className="text-xl font-bold text-textMain mb-1">
                  {user.name}
                </h2>
                <p className="text-xs text-textMuted mb-1">{user.email}</p>
                <p className="text-[11px] font-mono text-primary font-medium mb-6">
                  {user.role}
                </p>

                <div className="flex flex-col gap-2.5">
                  <Link
                    to="/os/disk"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium bg-primary text-white hover:opacity-90 transition-all shadow-sm"
                  >
                    <HardDrive size={16} />
                    <span>Open Storage &amp; Disk Scheduling</span>
                  </Link>

                  <Link
                    to="/simulation"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium bg-background border border-borderLine text-textMain hover:bg-card transition-all"
                  >
                    <Cpu size={16} />
                    <span>Digital Logic Simulation</span>
                  </Link>

                  <Link
                    to="/learn/process-management/sandbox"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium bg-background border border-borderLine text-textMain hover:bg-card transition-all"
                  >
                    <TerminalSquare size={16} />
                    <span>Process Management Sandbox</span>
                  </Link>

                  <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-all mt-2"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
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

          <div className="text-center mt-5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-textMain transition-colors"
            >
              <ArrowLeft size={13} /> Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
