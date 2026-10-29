import { useState, useId } from 'react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './styles/Auth.css';

export default function LoginForm({ initialMode = 'login', onSuccess }) {
  const { login, register, authModalMode, setAuthModalMode } = useAuth();

  const mode = authModalMode || initialMode;
  const setMode = setAuthModalMode || (() => {});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: true,
  });

  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const emailId = useId();
  const passwordId = useId();
  const nameId = useId();
  const confirmPasswordId = useId();

  // Email format validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  };

  // Field validation checks
  const getFieldError = (field) => {
    switch (field) {
      case 'email':
        if (!formData.email.trim()) return 'Email is required';
        if (!validateEmail(formData.email)) return 'Enter a valid email address';
        return null;

      case 'password':
        if (!formData.password) return 'Password is required';
        if (formData.password.length < 6) return 'Password must be at least 6 characters';
        return null;

      case 'name':
        if (mode === 'register') {
          if (!formData.name.trim()) return 'Name is required';
          if (formData.name.trim().length < 2) return 'Name must be at least 2 characters';
        }
        return null;

      case 'confirmPassword':
        if (mode === 'register') {
          if (!formData.confirmPassword) return 'Please confirm your password';
          if (formData.confirmPassword !== formData.password) return 'Passwords do not match';
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
      if (getFieldError('name') || getFieldError('confirmPassword')) return false;
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

  // Quick Demo fill (clean & discreet for fast viva testing)
  const handleQuickFill = (email, password) => {
    setAuthError(null);
    setFormData((prev) => ({
      ...prev,
      email,
      password,
    }));
    setTouched({ email: true, password: true });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    const touchedAll = {
      email: true,
      password: true,
      ...(mode === 'register' ? { name: true, confirmPassword: true } : {}),
    };
    setTouched(touchedAll);

    if (!isFormValid()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((res) => setTimeout(res, 300));

      if (mode === 'login') {
        const result = login({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        });

        if (!result.success) {
          setAuthError(result.error);
          setShake(true);
          setTimeout(() => setShake(false), 400);
        } else if (onSuccess) {
          onSuccess(result.user);
        }
      } else {
        const result = register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'CS Student',
        });

        if (!result.success) {
          setAuthError(result.error);
          setShake(true);
          setTimeout(() => setShake(false), 400);
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

  return (
    <div className="auth-card-inner">
      {/* Header */}
      <div className="auth-header">
        <h2 className="auth-title">
          {mode === 'login' ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Enter your credentials to access your session.'
            : 'Fill in your details to get started.'}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
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
          Register
        </button>
      </div>

      {/* Global Auth Error Banner */}
      {authError && (
        <div className="auth-banner-error mb-4" role="alert">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{authError}</span>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className={`auth-form ${shake ? 'shake' : ''}`}
      >
        {/* Name (Registration Only) */}
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
                placeholder="Alex Rivera"
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

        {/* Email */}
        <div className="auth-group">
          <label htmlFor={emailId} className="auth-label">
            <span>Email</span>
          </label>
          <div className="auth-input-wrapper">
            <Mail size={16} className="auth-input-icon" />
            <input
              id={emailId}
              type="email"
              placeholder="name@example.com"
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

        {/* Password */}
        <div className="auth-group">
          <label htmlFor={passwordId} className="auth-label">
            <span>Password</span>
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
          {passwordError && (
            <div className="auth-error-msg">
              <AlertCircle size={12} />
              <span>{passwordError}</span>
            </div>
          )}
        </div>

        {/* Confirm Password (Registration Only) */}
        {mode === 'register' && (
          <div className="auth-group">
            <label htmlFor={confirmPasswordId} className="auth-label">
              <span>Confirm Password</span>
            </label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                id={confirmPasswordId}
                type="password"
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
            </div>
            {confirmPasswordError && (
              <div className="auth-error-msg">
                <AlertCircle size={12} />
                <span>{confirmPasswordError}</span>
              </div>
            )}
          </div>
        )}

        {/* Remember Me */}
        {mode === 'login' && (
          <div className="auth-row-between">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleChange('rememberMe', e.target.checked)}
                className="auth-checkbox"
              />
              <span>Remember me</span>
            </label>
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
              <span>Please wait...</span>
            </div>
          ) : (
            <>
              <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Subtle Demo Quick Fill (Clean, understated helper for presentation) */}
      {mode === 'login' && (
        <div className="mt-4 pt-4 border-t border-borderLine/50 flex items-center justify-between text-xs text-textMuted">
          <span>Demo account:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('student@systemzero.io', 'Password123!')}
              className="text-primary hover:underline font-mono"
            >
              student
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@systemzero.io', 'AdminPassword1!')}
              className="text-primary hover:underline font-mono"
            >
              admin
            </button>
          </div>
        </div>
      )}

      {/* Mode Switch Footer */}
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
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
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
