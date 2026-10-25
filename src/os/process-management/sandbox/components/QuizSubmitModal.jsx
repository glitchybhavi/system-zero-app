import React from 'react';

/**
 * QuizSubmitModal (Modal Component)
 * 
 * Simple confirmation dialog using standard React conditional rendering.
 */
export default function QuizSubmitModal({
  isOpen,
  totalQuestions,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="quiz-modal-backdrop" onClick={onCancel}>
      <div 
        className="quiz-modal-card" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal itself
      >
        <div className="modal-header">
          <span className="modal-icon">📝</span>
          <h3 className="modal-title">Ready to Submit Quiz?</h3>
        </div>

        <p className="modal-description">
          You have answered all <strong>{totalQuestions} questions</strong>.
          <br />
          Once submitted, your responses will be locked and your grade will be recorded.
        </p>

        <div className="modal-actions">
          <button 
            type="button" 
            className="modal-btn modal-btn-secondary" 
            onClick={onCancel}
          >
            Review Answers
          </button>
          <button 
            type="button" 
            className="modal-btn modal-btn-primary" 
            onClick={onConfirm}
          >
            Yes, Grade My Quiz ➔
          </button>
        </div>
      </div>
    </div>
  );
}
