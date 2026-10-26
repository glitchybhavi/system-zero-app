import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './styles/Auth.css';

export default function AuthToast() {
  const { toast, dismissToast } = useAuth();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
    error: <AlertCircle size={18} className="text-rose-400 shrink-0" />,
    info: <Info size={18} className="text-indigo-400 shrink-0" />,
  };

  return (
    <div className={`auth-toast-container ${toast.type || 'info'}`} role="status">
      {icons[toast.type] || icons.info}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={dismissToast}
        className="opacity-70 hover:opacity-100 transition-opacity ml-2"
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}
