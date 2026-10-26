import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Binary, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { setInstruction } from './store/isaSlice';
import { useIsaContext } from './context/IsaContext';

const OPCODES = [
  { name: 'AND', bin: '000', desc: 'Bitwise AND memory with AC' },
  { name: 'ADD', bin: '001', desc: 'Add memory word to AC' },
  { name: 'LDA', bin: '010', desc: 'Load AC from memory' },
  { name: 'STA', bin: '011', desc: 'Store AC to memory' },
  { name: 'BUN', bin: '100', desc: 'Branch unconditionally' },
];

const PRESET_ADDRESSES = ['0x020', '0x08A', '0x150', '0x3A0'];

export default function InstructionFormatSection() {
  const dispatch = useDispatch();
  const reduxInstruction = useSelector((state) => state.isa.instruction);
  const { displayRadix } = useIsaContext();

  // Controlled form state
  const [formMode, setFormMode] = useState(reduxInstruction.mode);
  const [formOpcode, setFormOpcode] = useState(reduxInstruction.opcode);
  const [formAddress, setFormAddress] = useState(reduxInstruction.address);
  const [addressError, setAddressError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync with redux changes (e.g. if control unit toggles opcode)
  useEffect(() => {
    setFormMode(reduxInstruction.mode);
    setFormOpcode(reduxInstruction.opcode);
    setFormAddress(reduxInstruction.address);
  }, [reduxInstruction.mode, reduxInstruction.opcode, reduxInstruction.address]);

  const selectedOp = OPCODES.find((op) => op.name === formOpcode) || OPCODES[1];

  // Address validation helper
  const validateAddress = (val) => {
    const trimmed = val.trim();
    if (!trimmed) {
      return 'Address cannot be empty';
    }
    const cleanHex = trimmed.startsWith('0x') || trimmed.startsWith('0X')
      ? trimmed.slice(2)
      : trimmed;

    if (!/^[0-9A-Fa-f]{1,3}$/.test(cleanHex)) {
      return 'Must be a 12-bit hex address (0x000 to 0xFFF)';
    }

    const num = parseInt(cleanHex, 16);
    if (isNaN(num) || num < 0 || num > 4095) {
      return 'Address out of 12-bit range (0 - 4095)';
    }

    return '';
  };

  const handleAddressChange = (e) => {
    const val = e.target.value;
    setFormAddress(val);
    if (addressError) {
      setAddressError(validateAddress(val));
    }
  };

  const handlePresetClick = (addr) => {
    setFormAddress(addr);
    setAddressError('');
    dispatch(
      setInstruction({
        mode: formMode,
        opcode: formOpcode,
        address: addr,
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateAddress(formAddress);
    if (error) {
      setAddressError(error);
      return;
    }

    setAddressError('');
    const cleanHex = formAddress.trim().startsWith('0x') || formAddress.trim().startsWith('0X')
      ? `0x${formAddress.trim().slice(2).toUpperCase().padStart(3, '0')}`
      : `0x${formAddress.trim().toUpperCase().padStart(3, '0')}`;

    dispatch(
      setInstruction({
        mode: formMode,
        opcode: formOpcode,
        address: cleanHex,
      })
    );

    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 2000);
  };

  const full16Bit = reduxInstruction.full16Bit;
  const currentAddressInt = parseInt(reduxInstruction.address, 16) || 0;
  const displayAddress = displayRadix === 'dec' ? `${currentAddressInt}` : reduxInstruction.address;

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-6 border-b border-borderLine">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Left: Interactive Dialogue Card with React Form Handling */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00f2fe]/20 text-[#00f2fe]">
                  <Binary size={20} />
                </div>
                <h3 className="font-mono font-bold text-xl text-textMain">Instruction Word Format</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Redux Linked
              </span>
            </div>
            
            <p className="text-sm text-textMuted leading-relaxed mb-5">
              Every computer command is packaged into a 16-bit word. The CPU splits this word into addressing mode, operation code, and operand address.
            </p>

            {/* Controlled HTML Form */}
            <form onSubmit={handleSubmit} className="bg-background/80 p-4 rounded-xl border border-borderLine space-y-4 font-mono text-xs">
              
              {/* 1. Addressing Mode Selector */}
              <div>
                <span className="text-textMuted block mb-1.5">1. Addressing Mode [I] (Bit 15):</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormMode('0');
                      dispatch(setInstruction({ mode: '0', opcode: formOpcode, address: formAddress }));
                    }}
                    className={`py-1.5 px-3 rounded border text-xs transition-all ${
                      formMode === '0'
                        ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#8b5cf6] font-bold'
                        : 'bg-background border-borderLine text-textMuted hover:text-textMain'
                    }`}
                  >
                    Direct (I = 0)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormMode('1');
                      dispatch(setInstruction({ mode: '1', opcode: formOpcode, address: formAddress }));
                    }}
                    className={`py-1.5 px-3 rounded border text-xs transition-all ${
                      formMode === '1'
                        ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#8b5cf6] font-bold'
                        : 'bg-background border-borderLine text-textMuted hover:text-textMain'
                    }`}
                  >
                    Indirect (I = 1)
                  </button>
                </div>
              </div>

              {/* 2. Opcode Selector */}
              <div>
                <span className="text-textMuted block mb-1.5">2. Operation Code (Bits 14–12):</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {OPCODES.map((op) => (
                    <button
                      key={op.name}
                      type="button"
                      onClick={() => {
                        setFormOpcode(op.name);
                        dispatch(setInstruction({ mode: formMode, opcode: op.name, address: formAddress }));
                      }}
                      className={`py-1.5 text-xs rounded border transition-all ${
                        formOpcode === op.name
                          ? 'bg-[#ff007f]/20 border-[#ff007f] text-[#ff007f] font-bold'
                          : 'bg-background border-borderLine text-textMuted hover:text-textMain'
                      }`}
                    >
                      {op.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Controlled Address Input with Form Validation */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="address-input" className="text-textMuted block">
                    3. Target Address (Bits 11–0):
                  </label>
                  {addressError && (
                    <span className="text-red-400 text-[10px] flex items-center gap-1">
                      <AlertCircle size={10} /> {addressError}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    id="address-input"
                    type="text"
                    value={formAddress}
                    onChange={handleAddressChange}
                    placeholder="e.g. 0x08A"
                    maxLength={6}
                    className={`w-full py-1.5 px-3 rounded border font-mono text-xs bg-background transition-all outline-none ${
                      addressError
                        ? 'border-red-500/80 focus:border-red-500 text-red-400'
                        : 'border-borderLine focus:border-primary text-textMain'
                    }`}
                  />
                  <button
                    type="submit"
                    className="py-1.5 px-3 rounded bg-[#00f2fe]/20 hover:bg-[#00f2fe]/30 border border-[#00f2fe]/40 text-[#00f2fe] font-bold text-xs whitespace-nowrap transition-all shadow-sm"
                  >
                    Latch
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-textMuted">Presets:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {PRESET_ADDRESSES.map((addr) => (
                      <button
                        key={addr}
                        type="button"
                        onClick={() => handlePresetClick(addr)}
                        className={`py-0.5 px-1.5 text-[10px] rounded border transition-all ${
                          reduxInstruction.address === addr
                            ? 'bg-[#00f2fe]/20 border-[#00f2fe] text-[#00f2fe] font-bold'
                            : 'bg-background border-borderLine text-textMuted hover:text-textMain'
                        }`}
                      >
                        {addr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Feedback Banner */}
              {submitSuccess && (
                <div className="text-[11px] text-[#1fd655] bg-[#1fd655]/10 border border-[#1fd655]/30 p-2 rounded flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  <span>Instruction successfully latched into CPU register!</span>
                </div>
              )}

              {/* Live Binary Readout */}
              <div className="pt-2 border-t border-borderLine flex justify-between items-center text-xs">
                <span className="text-textMuted">Binary Stream:</span>
                <span className="font-bold tracking-wider">
                  <span className="text-[#8b5cf6]">{reduxInstruction.mode}</span>{' '}
                  <span className="text-[#ff007f]">{selectedOp.bin}</span>{' '}
                  <span className="text-[#00f2fe]">
                    {(currentAddressInt & 0xfff).toString(2).padStart(12, '0')}
                  </span>
                </span>
              </div>

            </form>
          </div>
        </div>

        {/* Right: Pure React 2D Visualizer */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between border-b border-borderLine pb-3 mb-5">
              <span className="font-mono text-xs text-textMuted tracking-wider uppercase flex items-center gap-1.5">
                <Layers size={14} className="text-primary" /> 16-Bit Instruction Register
              </span>
              <span className="font-mono text-[11px] text-textMuted">
                IR: 0x{parseInt(full16Bit, 2).toString(16).toUpperCase().padStart(4, '0')}
              </span>
            </div>

            {/* Sliced 3-Field Register Display */}
            <div className="w-full grid grid-cols-12 gap-1.5 font-mono text-center mb-6">
              
              {/* Field 1: Mode [I] */}
              <div className="col-span-2 p-3 rounded-xl border border-[#8b5cf6]/40 bg-[#8b5cf6]/10 text-[#8b5cf6] flex flex-col justify-center items-center">
                <span className="text-[10px] opacity-75">I (15)</span>
                <span className="text-lg font-bold">{reduxInstruction.mode}</span>
                <span className="text-[9px] uppercase tracking-wider mt-0.5 font-sans">
                  {reduxInstruction.mode === '0' ? 'Direct' : 'Indirect'}
                </span>
              </div>

              {/* Field 2: Opcode */}
              <div className="col-span-4 p-3 rounded-xl border border-[#ff007f]/40 bg-[#ff007f]/10 text-[#ff007f] flex flex-col justify-center items-center">
                <span className="text-[10px] opacity-75">OPCODE (14-12)</span>
                <span className="text-lg font-bold">{selectedOp.bin}</span>
                <span className="text-[10px] font-bold mt-0.5">{selectedOp.name}</span>
              </div>

              {/* Field 3: Address */}
              <div className="col-span-6 p-3 rounded-xl border border-[#00f2fe]/40 bg-[#00f2fe]/10 text-[#00f2fe] flex flex-col justify-center items-center">
                <span className="text-[10px] opacity-75">ADDRESS (11-0)</span>
                <span className="text-lg font-bold">{displayAddress}</span>
                <span className="text-[9px] opacity-80 mt-0.5 truncate max-w-full">
                  12-bit Pointer
                </span>
              </div>

            </div>

            {/* Individual 16-Bit Cell Strip */}
            <div className="w-full mb-6">
              <span className="text-[10px] font-mono text-textMuted block mb-2 text-center">
                Physical Bit Grid [15 ... 0]
              </span>
              <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 w-full text-center font-mono text-[10px]">
                {full16Bit.split('').map((bit, index) => {
                  let cellColor = 'text-[#00f2fe] border-[#00f2fe]/30 bg-[#00f2fe]/5';
                  if (index === 0) {
                    cellColor = 'text-[#8b5cf6] border-[#8b5cf6]/40 bg-[#8b5cf6]/10';
                  } else if (index >= 1 && index <= 3) {
                    cellColor = 'text-[#ff007f] border-[#ff007f]/40 bg-[#ff007f]/10';
                  }
                  return (
                    <div
                      key={index}
                      className={`p-1 rounded border font-bold ${cellColor} transition-all`}
                    >
                      {bit}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decoded Synthesis Box */}
            <div className="w-full bg-background/80 p-4 rounded-xl border border-borderLine font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-textMuted">
                <span>Decoded Command:</span>
                <span className="text-primary font-bold text-sm">
                  {selectedOp.name} {reduxInstruction.address}
                </span>
              </div>
              <div className="text-[11px] text-textMuted leading-relaxed flex items-start gap-1.5 pt-1 border-t border-borderLine">
                <CheckCircle2 size={13} className="text-[#1fd655] shrink-0 mt-0.5" />
                <span>
                  {reduxInstruction.mode === '0'
                    ? `Operands are read directly from physical memory cell ${reduxInstruction.address}.`
                    : `Address ${reduxInstruction.address} holds a secondary pointer to the effective address.`}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
