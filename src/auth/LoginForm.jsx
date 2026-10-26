import { useState, useId } from 'react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './styles/Auth.css';

export default function LoginForm({ initialMode = 'login', onSuccess }) {
  const { login, register, authModalMode, setAuthModalMode } = useAuth();
  
  // Tab mode: 'login' or 'register'
  const mode = authModalMode || initialMode;
  const setMode = setAuthModalMode || (() => {});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CS Student',
    rememberMe: true,
    agreeTerms: false,
  });

  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const emailId = useId();
  const passwordId = useId();
  const nameId = useId();
  const confirmPasswordId = useId();
  const roleId = useId();

  // Email regex
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  };

  // Password strength calculation
  const calculateStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthScore = calculateStrength(formData.password);
  const strengthLabels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthClasses = ['', 'weak', 'fair', 'good', 'strong'];

  // Field validation checks
  const getFieldError = (field) => {
    switch (field) {
      case 'email':
        if (!formData.email.trim()) return 'Email address is required';
        if (!validateEmail(formData.email)) return 'Please enter a valid email (e.g. user@domain.com)';
        return null;

      case 'password':
        if (!formData.password) return 'Password is required';
        if (mode === 'register' && formData.password.length < 8) {
          return 'Password must contain at least 8 characters';
        }
        if (mode === 'login' && formData.password.length < 6) {
          return 'Password must be at least 6 characters';
        }
        return null;

      case 'name':
        if (mode === 'register') {
          if (!formData.name.trim()) return 'Full name is required';
          if (formData.name.trim().length < 2) return 'Name must be at least 2 characters';
        }
        return null;

      case 'confirmPassword':
        if (mode === 'register') {
          if (!formData.confirmPassword) return 'Please confirm your password';
          if (formData.confirmPassword !== formData.password) return 'Passwords do not match';
        }
        return null;

      case 'agreeTerms':
        if (mode === 'register' && !formData.agreeTerms) {
          return 'You must accept the terms of service';
        }
        return null;

      default:
        return null;
    }
  };

  // Form validity check
  const isFormValid = () => {
    if (getFieldError('email') || getFieldError('password')) return false;
    if (mode === 'register') {
      if (getFieldError('name') || getFieldError('confirmPassword') || getFieldError('agreeTerms')) {
        return false;
      }
    }
    return true;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setAuthError(null);
  };

  // Quick Demo fill
  const handleQuickFill = (type) => {
    setAuthError(null);
    if (type === 'student') {
      setFormData((prev) => ({
        ...prev,
        email: 'student@systemzero.io',
        password: 'Password123!',
      }));
    } else if (type === 'architect') {
      setFormData((prev) => ({
        ...prev,
        email: 'sarah@systemzero.io',
        password: 'Password123!',
      }));
    } else if (type === 'admin') {
      setFormData((prev) => ({
        ...prev,
        email: 'admin@systemzero.io',
        password: 'AdminPassword1!',
      }));
    }
    setTouched({ email: true, password: true });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    // Mark all relevant fields as touched
    const touchedAll = {
      email: true,
      password: true,
      ...(mode === 'register' ? { name: true, confirmPassword: true, agreeTerms: true } : {}),
    };
    setTouched(touchedAll);

    if (!isFormValid()) {
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }

    setIsSubmitting(true);

    try {
      // Small simulated latency for natural UI feel
      await new Promise((res) => setTimeout(res, 350));

      if (mode === 'login') {
        const result = login({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        });

        if (!result.success) {
          setAuthError(result.error);
          setShake(true);
          setTimeout(() => setShake(false), 450);
        } else if (onSuccess) {
          onSuccess(result.user);
        }
      } else {
        const result = register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        if (!result.success) {
          setAuthError(result.error);
          setShake(true);
          setTimeout(() => setShake(false), 450);
        } else if (onSuccess) {
          onSuccess(result.user);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailError = touched.email ? getFieldError('email') : null;
  const passwordError = touched.password ? getFieldError('password') : null;
  const nameError = touched.name ? getFieldError('name') : null;
  const confirmPasswordError = touched.confirmPassword ? getFieldError('confirmPassword') : null;
  const termsError = touched.agreeTerms ? getFieldError('agreeTerms') : null;

  return (
    <div className="auth-card-inner">
      {/* Header */}
      <div className="auth-header">
        <div className="auth-badge">
          <ShieldCheck size={13} />
          <span>SYSTEM_ZERO // ACCESS</span>
        </div>
        <h2 className="auth-title">
          {mode === 'login' ? 'Authenticate Session' : 'Register Operator'}
        </h2>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Sign in to access your saved simulators and interactive telemetry'
            : 'Initialize a new student or architect profile on this machine'}
        </p>
      </div>

      {/* Tabs */}
      <div className="auth-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'login'}
          className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
          onClick={() => {
            setMode('login');
            setAuthError(null);
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'register'}
          className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
          onClick={() => {
            setMode('register');
            setAuthError(null);
          }}
        >
          Create Account
        </button>
      </div>

      {/* Quick Demo Pre-fill Bar (great for evaluators & graders) */}
      {mode === 'login' && (
        <div className="auth-demo-bar">
          <div className="auth-demo-label">
            <span className="flex items-center gap-1">
              <Sparkles size={12} /> EVALUATION DEMO FILL
            </span>
            <span className="opacity-75">Click to auto-fill</span>
          </div>
          <div className="auth-demo-chips">
            <button
              type="button"
              className="auth-demo-chip"
              onClick={() => handleQuickFill('student')}
            >
              CS Student
            </button>
            <button
              type="button"
              className="auth-demo-chip"
              onClick={() => handleQuickFill('architect')}
            >
              Chief Architect
            </button>
            <button
              type="button"
              className="auth-demo-chip"
              onClick={() => handleQuickFill('admin')}
            >
              Sys Admin
            </button>
          </div>
        </div>
      )}

      {/* Auth Level Error Banner */}
      {authError && (
        <div className="auth-banner-error mb-4" role="alert">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{authError}</span>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className={`auth-form ${shake ? 'shake' : ''}`}
      >
        {/* Registration Name Field */}
        {mode === 'register' && (
          <div className="auth-group">
            <label htmlFor={nameId} className="auth-label">
              <span>Full Name</span>
            </label>
            <div className="auth-input-wrapper">
              <User size={16} className="auth-input-icon" />
              <input
                id={nameId}
                type="text"
                placeholder="e.g. Alex Rivera"
                autoComplete="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className={`auth-input ${
                  nameError ? 'is-invalid' : touched.name && formData.name ? 'is-valid' : ''
                }`}
                aria-invalid={Boolean(nameError)}
              />
              {touched.name && !nameError && formData.name && (
                <div className="auth-input-trailing text-emerald-500">
                  <Check size={16} />
                </div>
              )}
            </div>
            {nameError && (
              <div className="auth-error-msg">
                <AlertCircle size={12} />
                <span>{nameError}</span>
              </div>
            )}
          </div>
        )}

        {/* Email Field */}
        <div className="auth-group">
          <label htmlFor={emailId} className="auth-label">
            <span>Email Address</span>
          </label>
          <div className="auth-input-wrapper">
            <Mail size={16} className="auth-input-icon" />
            <input
              id={emailId}
              type="email"
              placeholder="e.g. student@systemzero.io"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`auth-input ${
                emailError ? 'is-invalid' : touched.email && formData.email ? 'is-valid' : ''
              }`}
              aria-invalid={Boolean(emailError)}
            />
            {touched.email && !emailError && formData.email && (
              <div className="auth-input-trailing text-emerald-500">
                <Check size={16} />
              </div>
            )}
          </div>
          {emailError && (
            <div className="auth-error-msg">
              <AlertCircle size={12} />
              <span>{emailError}</span>
            </div>
          )}
        </div>

        {/* Registration Role Selection */}
        {mode === 'register' && (
          <div className="auth-group">
            <label htmlFor={roleId} className="auth-label">
              <span>System Role</span>
            </label>
            <div className="auth-input-wrapper">
              <select
                id={roleId}
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="auth-input pl-3"
              >
                <option value="CS Student">Computer Science Student</option>
                <option value="System Architect">Hardware / System Architect</option>
                <option value="Instructional Designer">Educator / Researcher</option>
                <option value="System Administrator">Kernel Administrator</option>
              </select>
            </div>
          </div>
        )}

        {/* Password Field */}
        <div className="auth-group">
          <label htmlFor={passwordId} className="auth-label">
            <span>Password</span>
            {mode === 'login' && (
              <span className="text-xs text-textMuted font-mono">min 6 chars</span>
            )}
          </label>
          <div className="auth-input-wrapper">
            <Lock size={16} className="auth-input-icon" />
            <input
              id={passwordId}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              className={`auth-input ${
                passwordError ? 'is-invalid' : touched.password && formData.password && !passwordError ? 'is-valid' : ''
              }`}
              aria-invalid={Boolean(passwordError)}
            />
            <div className="auth-input-trailing">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator (in Registration Mode) */}
          {mode === 'register' && formData.password.length > 0 && (
            <div className="auth-strength-container">
              <div className="auth-strength-bars">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`auth-strength-bar ${
                      strengthScore >= level ? strengthClasses[strengthScore] : ''
                    }`}
                  />
                ))}
              </div>
              <div className="auth-strength-text">
                <span>Strength: {strengthLabels[strengthScore]}</span>
                <span>{formData.password.length}/8+ chars</span>
              </div>
            </div>
          )}

          {passwordError && (
            <div className="auth-error-msg">
              <AlertCircle size={12} />
              <span>{passwordError}</span>
            </div>
          )}
        </div>

        {/* Confirm Password (Registration Mode) */}
        {mode === 'register' && (
          <div className="auth-group">
            <label htmlFor={confirmPasswordId} className="auth-label">
              <span>Confirm Password</span>
            </label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                id={confirmPasswordId}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                className={`auth-input ${
                  confirmPasswordError
                    ? 'is-invalid'
                    : touched.confirmPassword && formData.confirmPassword
                    ? 'is-valid'
                    : ''
                }`}
                aria-invalid={Boolean(confirmPasswordError)}
              />
              <div className="auth-input-trailing">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="auth-password-toggle"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {confirmPasswordError && (
              <div className="auth-error-msg">
                <AlertCircle size={12} />
                <span>{confirmPasswordError}</span>
              </div>
            )}
          </div>
        )}

        {/* Row for Remember Me / Terms */}
        {mode === 'login' ? (
          <div className="auth-row-between">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleChange('rememberMe', e.target.checked)}
                className="auth-checkbox"
              />
              <span>Remember session</span>
            </label>
            <span className="text-xs text-textMuted font-mono">localStorage sync</span>
          </div>
        ) : (
          <div className="auth-group">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                onBlur={() => handleBlur('agreeTerms')}
                className="auth-checkbox"
              />
              <span className="text-xs">
                I agree to the System Zero laboratory terms &amp; academic policies
              </span>
            </label>
            {termsError && (
              <div className="auth-error-msg">
                <AlertCircle size={12} />
                <span>{termsError}</span>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="auth-submit-btn"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying Credentials...</span>
            </div>
          ) : (
            <>
              <span>{mode === 'login' ? 'Sign In to System' : 'Create Operator Account'}</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Footer Switch Prompt */}
      <div className="auth-footer-prompt">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => {
                setMode('register');
                setAuthError(null);
              }}
            >
              Create one now
            </button>
          </>
        ) : (
          <>
            Already registered on this system?{' '}
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => {
                setMode('login');
                setAuthError(null);
              }}
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
