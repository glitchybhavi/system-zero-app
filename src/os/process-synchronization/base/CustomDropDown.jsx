import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "../styles/CustomDropDown.css"

export default function CustomDropDown({
    value,
    onChange, 
    options
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropDownRef = useRef(null); 

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside); 
    }, []); 

    let selectedLabel = value; 

    for(let i = 0; i < options.length; i++) {
        if (options[i].value === value) {
            selectedLabel = options[i].label; 
            break;
        }
    }

    function handleSelect(optionValue) {
    onChange(optionValue);
    setIsOpen(false);
  }


  return (
    <div className="custom-dropdown-container" ref={dropDownRef}>
      <button
        type="button"
        className={`dropdown-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          size={15}
          className={`dropdown-chevron ${isOpen ? 'open' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="dropdown-menu-glass">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span>{opt.label}</span>
          
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

