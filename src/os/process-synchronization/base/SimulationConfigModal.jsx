import { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyConfig } from '../store/raceConditionSlice';
import { SyncUIContext } from '../context/SyncUIContext';

export default function SimulationConfigModal() {
  const syncUI = useContext(SyncUIContext);
  const dispatch = useDispatch();

  const currentBalance = useSelector((state) => state.raceCondition.initialBalance);
  const currentStep = useSelector((state) => state.raceCondition.incrementValue);

  const [balance, setBalance] = useState(String(currentBalance));
  const [step, setStep] = useState(String(currentStep));
  const [error, setError] = useState('');
  const [errorField, setErrorField] = useState('');

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
    syncUI.setIsConfigOpen(false);
  }

  function handleReset() {
    setBalance('100');
    setStep('10');
    setError('');
    setErrorField('');
  }

  function handleClose() {
    setError('');
    setErrorField('');
    syncUI.setIsConfigOpen(false);
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
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-card" style={{ maxWidth: '440px', textAlign: 'left' }} onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title" style={{ marginBottom: '16px' }}>Simulation Parameters</h2>

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
