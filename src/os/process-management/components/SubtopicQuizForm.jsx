import React, { useState } from 'react';
import QuizQuestion from './QuizQuestion';
import './SubtopicQuizForm.css';

/**
 * SubtopicQuizForm
 * 
 * An in-line question set form placed at the end of each theory subtopic.
 * Allows students to immediately test their comprehension of the topic they just read!
 */
export default function SubtopicQuizForm({ quizData }) {
  const { title, description, questions } = quizData;

  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [unansweredList, setUnansweredList] = useState([]);
  const [validationMsg, setValidationMsg] = useState(null);

  const handleSelectOption = (questionId, optionId) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
    setUnansweredList((prev) => prev.filter((id) => id !== questionId));
    setValidationMsg(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitted) return;

    // Validation: Ensure all questions are answered
    const missing = questions.filter((q) => !answers[q.id]).map((q) => q.id);
    if (missing.length > 0) {
      setUnansweredList(missing);
      setValidationMsg(`Please select an answer for all ${questions.length} questions before submitting.`);
      return;
    }

    // Grade answers
    let calculated = 0;
    questions.forEach((q) => {
      const selected = answers[q.id];
      const opt = q.options.find((o) => o.id === selected);
      if (opt?.isCorrect) calculated += 1;
    });

    setScore(calculated);
    setIsSubmitted(true);
    setValidationMsg(null);
  };

  const handleRetry = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setUnansweredList([]);
    setValidationMsg(null);
  };

  return (
    <div className="subtopic-quiz-wrapper font-mono">
      <div className="subtopic-quiz-header">
        <div className="subtopic-quiz-title-area">
          <span className="subtopic-quiz-badge">CHECKPOINT_EXAM</span>
          <h4 className="subtopic-quiz-title font-body">{title}</h4>
          <p className="subtopic-quiz-desc font-body">{description}</p>
        </div>

        {isSubmitted && (
          <span className="subtopic-score-pill">
            Score: {score} / {questions.length} {score === questions.length ? '🌟 Perfect!' : '✓ Graded'}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="subtopic-quiz-form">
        {questions.map((q, idx) => (
          <QuizQuestion
            key={q.id}
            question={q}
            index={idx}
            selectedOption={answers[q.id]}
            onSelectOption={handleSelectOption}
            isSubmitted={isSubmitted}
            isUnanswered={unansweredList.includes(q.id)}
          />
        ))}

        {validationMsg && (
          <div className="subtopic-validation-msg font-body">
            <span>⚠️ {validationMsg}</span>
          </div>
        )}

        <div className="subtopic-submit-row">
          {!isSubmitted ? (
            <button type="submit" className="subtopic-submit-btn font-body">
              Submit Checkpoint Answers ➔
            </button>
          ) : (
            <button type="button" className="subtopic-retry-btn font-body" onClick={handleRetry}>
              ↺ Retry Checkpoint
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
