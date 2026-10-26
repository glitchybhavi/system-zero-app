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
      <div className="modal-error-message">
        {error}
      </div>
    );
  }

  let balanceClass = 'modal-text-input';
  if (errorField === 'balance') {
    balanceClass = 'modal-text-input has-error';
  }

  let stepClass = 'modal-text-input';
  if (errorField === 'step') {
    stepClass = 'modal-text-input has-error';
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-config-card">
        <h2 className="modal-title">Simulation Configurations</h2>

        <form onSubmit={handleSubmit}>
          {errorDisplay}

          <div className="modal-field-group">
            <label className="modal-field-label">
              Initial Vault Balance (₹)
            </label>
            <input
              type="text"
              inputMode="numeric"
              className={balanceClass}
              value={balance}
              onChange={(e) => {
                setBalance(e.target.value);
                if (errorField === 'balance') {
                  setError('');
                  setErrorField('');
                }
              }}
            />
          </div>

          <div className="modal-field-group">
            <label className="modal-field-label">
              Increment Amount per Step (₹)
            </label>
            <input
              type="text"
              inputMode="numeric"
              className={stepClass}
              value={step}
              onChange={(e) => {
                setStep(e.target.value);
                if (errorField === 'step') {
                  setError('');
                  setErrorField('');
                }
              }}
            />
          </div>

          <label htmlFor="guideToggle" className="modal-checkbox-label-wrap">
            <input
              type="checkbox"
              id="guideToggle"
              checked={guide}
              onChange={(e) => setGuide(e.target.checked)}
              className="modal-hidden-checkbox"
            />
            <span className={`modal-checkbox-box ${guide ? 'checked' : ''}`}>
              {guide && <Check size={12} strokeWidth={3.5} className="modal-check-icon" />}
            </span>
            <span className={`modal-checkbox-text ${guide ? 'active' : ''}`}>
              Guided Text Assist
            </span>
          </label>

          <div className="modal-btn-actions">
            <button
              type="button"
              className="modal-btn-secondary"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              type="button"
              className="modal-btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-config-apply-btn"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
