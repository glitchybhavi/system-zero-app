import React from 'react';
import './QuizQuestion.css';

/**
 * QuizQuestion (Reusable Component)
 * 
 * Props:
 * - question: Question object { id, question, options }
 * - index: Current question index number (0, 1, 2...)
 * - selectedOption: ID of currently selected option (e.g., 'a', 'b')
 * - onSelectOption: Callback function (questionId, optionId) => void
 * - isSubmitted: Boolean indicating if quiz has been graded
 * - isUnanswered: Boolean flag if the user tried to submit without answering this question
 */
export default function QuizQuestion({
  question,
  index,
  selectedOption,
  onSelectOption,
  isSubmitted,
  isUnanswered,
}) {
  const chosenOptionObj = question.options.find((opt) => opt.id === selectedOption);

  return (
    <div className={`quiz-question-card ${isUnanswered ? 'card-unanswered-error' : ''}`}>
      <div className="question-header">
        <span className="question-number-badge">Q{index + 1}</span>
        <h4 className="question-title">{question.question}</h4>
        {isUnanswered && (
          <span className="unanswered-warning-tag">⚠️ Required</span>
        )}
      </div>

      <div className="options-container" role="radiogroup" aria-label={question.question}>
        {question.options.map((option) => {
          const isSelected = selectedOption === option.id;
          
          let optionClass = 'option-label';
          if (isSubmitted) {
            if (option.isCorrect) {
              optionClass += ' option-correct';
            } else if (isSelected && !option.isCorrect) {
              optionClass += ' option-incorrect';
            }
          } else if (isSelected) {
            optionClass += ' option-selected';
          }

          return (
            <label key={option.id} className={optionClass}>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                checked={isSelected}
                disabled={isSubmitted}
                onChange={() => onSelectOption(question.id, option.id)}
                className="option-radio-input"
              />
              <span className="option-letter">{option.id.toUpperCase()}</span>
              <span className="option-text">{option.text}</span>
              {isSubmitted && option.isCorrect && (
                <span className="correct-check">✓ Correct</span>
              )}
              {isSubmitted && isSelected && !option.isCorrect && (
                <span className="incorrect-cross">✕ Incorrect</span>
              )}
            </label>
          );
        })}
      </div>

      {/* Explanation shown after submission */}
      {isSubmitted && chosenOptionObj && (
        <div className={`explanation-box ${chosenOptionObj.isCorrect ? 'exp-success' : 'exp-warning'}`}>
          <div className="exp-title">
            {chosenOptionObj.isCorrect ? '✅ Explanation:' : '💡 Review Explanation:'}
          </div>
          <p className="exp-text">{chosenOptionObj.explanation}</p>
        </div>
      )}
    </div>
  );
}
