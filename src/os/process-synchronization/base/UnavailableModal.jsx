import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import '../styles/UnavailableModal.css';

export default function UnavailableModal(props) {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  let modalTitle = 'Currently Unavailable';
  if (props.title) {
    modalTitle = props.title;
  }

  let feature = 'selected';
  if (props.featureName) {
    feature = props.featureName;
  }

  let modalMessage = `The ${feature} interactive simulation module is currently under development and not available yet.`;
  if (props.message) {
    modalMessage = props.message;
  }

  return (
    <div className="sim-container">
      <div className="modal-backdrop">
        <div className="modal-card">
          <div className="modal-icon-box">
            <AlertCircle className="modal-icon" size={26} />
          </div>

          <h2 className="modal-title">{modalTitle}</h2>
          <p className="modal-message">{modalMessage}</p>

          <div className="modal-actions">
            <button type="button" className="modal-btn" onClick={goBack}>
              <ArrowLeft className="btn-icon" size={18} />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}