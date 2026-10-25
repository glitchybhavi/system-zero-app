import { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check } from 'lucide-react';
import { applyConfig } from '../store/configSlice';
import { SyncUIContext } from '../context/SyncUIContext';

export default function SimulationConfigModal() {
  const syncUI = useContext(SyncUIContext);
  const dispatch = useDispatch();

  const currentBalance = useSelector((state) => state.config?.initialBalance ?? state.raceCondition?.initialBalance ?? 100);
  const currentStep = useSelector((state) => state.config?.incrementValue ?? state.raceCondition?.incrementValue ?? 10);

  const [guide, setGuide] = useState(false);
  const [balance, setBalance] = useState(String(currentBalance));
  const [step, setStep] = useState(String(currentStep));
  const [error, setError] = useState('');
  const [errorField, setErrorField] = useState('');

  useEffect(() => {
    if (syncUI?.isConfigOpen) {
      setGuide(syncUI.showGuide ?? false);
      setBalance(String(currentBalance));
      setStep(String(currentStep));
      setError('');
      setErrorField('');
    }
  }, [syncUI?.isConfigOpen, syncUI?.showGuide, currentBalance, currentStep]);

  function handleClose() {
    setError('');
    setErrorField('');
    syncUI?.setIsConfigOpen(false);
  }

  useEffect(() => {
    if (!syncUI?.isConfigOpen) return;
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        handleClose();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [syncUI?.isConfigOpen]);

  if (!syncUI) {
    return null;
  }

  if (!syncUI.isConfigOpen) {
    return null;
  }

  function isInteger(str) {
    const trimmed = str.trim();
    if (trimmed === '') {
      return false;
    }
    return /^-?\d+$/.test(trimmed);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!isInteger(balance)) {
      setError('Enter a valid number');
      setErrorField('balance');
      return;
    }

    const balNum = Number(balance);
    if (balNum < 0) {
      setError('Initial balance cannot be negative.');
      setErrorField('balance');
      return;
    }

    if (balNum > 10000) {
      setError('Initial balance cannot exceed 10000.');
      setErrorField('balance');
      return;
    }

    if (!isInteger(step)) {
      setError('Enter a valid number');
      setErrorField('step');
      return;
    }

    const stepNum = Number(step);
    if (stepNum <= 0) {
      setError('Increment value must be greater than 0.');
      setErrorField('step');
      return;
    }

    setError('');
    setErrorField('');
    dispatch(applyConfig({ initialBalance: balNum, incrementValue: stepNum }));
    syncUI.setShowGuide(guide);
    syncUI.setIsConfigOpen(false);
  }

  function handleReset() {
    setBalance('100');
    setStep('10');
    setError('');
    setErrorField('');
    setGuide(false); 
  }


  let errorDisplay = null;
  if (error !== '') {
    errorDisplay = (
      <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '14px', textAlign: 'left' }}>
        {error}
      </div>
    );
  }

  let balanceBorder = '1px solid rgba(255, 255, 255, 0.15)';
  if (errorField === 'balance') {
    balanceBorder = '1px solid #f87171';
  }

  let stepBorder = '1px solid rgba(255, 255, 255, 0.15)';
  if (errorField === 'step') {
    stepBorder = '1px solid #f87171';
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '440px', textAlign: 'left' }}>
        <h2 className="modal-title" style={{ marginBottom: '16px' }}>Simulation Configurations</h2>

        <form onSubmit={handleSubmit}>
          {errorDisplay}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', marginBottom: '6px' }}>
              Initial Vault Balance (₹)
            </label>
            <input
              type="text"
              inputMode='numeric'
              value={balance}
              onChange={(e) => {
                setBalance(e.target.value);
                if (errorField === 'balance') {
                  setError('');
                  setErrorField('');
                }
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: balanceBorder,
                background: '#141722',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', marginBottom: '6px' }}>
              Increment Amount per Step (₹)
            </label>
            <input
              type="text"
              inputMode='numeric'
              value={step}
              onChange={(e) => {
                setStep(e.target.value);
                if (errorField === 'step') {
                  setError('');
                  setErrorField('');
                }
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: stepBorder,
                background: '#141722',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <label
            htmlFor="guideToggle"
            style={{
              marginBottom: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              id="guideToggle"
              checked={guide}
              onChange={(e) => setGuide(e.target.checked)}
              style={{ display: 'none' }}
            />
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '5px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: guide ? '#ffffff' : '#141722',
                border: guide ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: guide ? '0 0 10px rgba(255, 255, 255, 0.2)' : 'none',
                transition: 'background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
                flexShrink: 0,
              }}
            >
              {guide && <Check size={12} strokeWidth={3.5} color="#000000" />}
            </span>
            <span style={{ fontSize: '13px', color: guide ? '#f1f5f9' : '#a1a1aa', fontWeight: 500 }}>
              Guided Text Assist
            </span>
          </label>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'transparent',
                color: '#cbd5e1',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'transparent',
                color: '#cbd5e1',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn"
              style={{ width: 'auto', padding: '8px 18px' }}
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
