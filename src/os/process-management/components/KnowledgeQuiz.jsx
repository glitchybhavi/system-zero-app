import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { recordExamResult, resetExamResult } from '../store/processSlice';
import QuizQuestion from './QuizQuestion';
import QuizSubmitModal from './QuizSubmitModal';
import QuizToast from './QuizToast';
import { useProgress } from '../context/ProgressContext';
import { COLLECTIVE_FINAL_EXAM } from '../data/processManagementQuizData';
import './KnowledgeQuiz.css';

export default function KnowledgeQuiz() {
  const dispatch = useDispatch();
  // 5. Consuming API & Async State
  const [questions, setQuestions] = useState(COLLECTIVE_FINAL_EXAM);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // 1. Form State (tracks user answers as { q1: 'b', q2: 'a' })
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // 2. Validation State (tracks IDs of unanswered questions)
  const [unansweredList, setUnansweredList] = useState([]);

  // 3. Modal & Toast State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // 4. Global Progress Context
  const { completedModules, markModuleCompleted } = useProgress();
  const isModuleDone = Boolean(completedModules?.['process-management']);

  // Fetch quiz questions asynchronously on component mount
  const fetchQuestions = () => {
    fetch('/quiz-data.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load quiz questions.');
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data);
        } else {
          setQuestions(COLLECTIVE_FINAL_EXAM);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setQuestions(COLLECTIVE_FINAL_EXAM);
        setFetchError(null);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Update answer selection for a specific question
  const handleSelectOption = (questionId, optionId) => {
    if (isSubmitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));

    // If this question was flagged as unanswered, clear its error flag
    setUnansweredList((prev) => prev.filter((id) => id !== questionId));
  };

  // 2. Validation before showing submit confirmation modal
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (isSubmitted) return;

    // Check for any question without an answer
    const missing = questions
      .filter((q) => !answers[q.id])
      .map((q) => q.id);

    if (missing.length > 0) {
      setUnansweredList(missing);
      setToast({
        type: 'warning',
        message: `Please answer all questions before submitting (${missing.length} remaining).`,
      });
      return;
    }

    // Validation passed: clear errors and prompt confirmation modal
    setUnansweredList([]);
    setIsModalOpen(true);
  };

  // 3. Grade quiz after modal confirmation
  const handleConfirmSubmit = () => {
    setIsModalOpen(false);

    let calculatedScore = 0;
    questions.forEach((q) => {
      const selectedId = answers[q.id];
      const chosenOpt = q.options.find((opt) => opt.id === selectedId);
      if (chosenOpt?.isCorrect) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setIsSubmitted(true);

    const passingScore = Math.ceil(questions.length * 0.6); // 60% passing threshold (e.g. 8/12)
    const isPassed = calculatedScore >= passingScore;

    // 4. Update Redux Toolkit Global Store
    dispatch(
      recordExamResult({
        score: calculatedScore,
        total: questions.length,
        isPassed,
      })
    );

    if (isPassed) {
      // 5. Update Context API
      markModuleCompleted('process-management');
      setToast({
        type: 'success',
        message: `🎉 Great job! You scored ${calculatedScore}/${questions.length}. Module marked as Completed!`,
      });
    } else {
      setToast({
        type: 'info',
        message: `Quiz graded: ${calculatedScore}/${questions.length}. You need ${passingScore}/${questions.length} to pass.`,
      });
    }
  };

  // Reset quiz to retry
  const handleResetQuiz = () => {
    dispatch(resetExamResult());
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setUnansweredList([]);
    setToast({
      type: 'info',
      message: 'Quiz reset. You can now try again!',
    });
  };

  return (
    <div className="quiz-panel font-mono">
      {/* 3. Toast Notification */}
      <QuizToast toast={toast} onClose={() => setToast(null)} />

      {/* 3. Confirmation Modal */}
      <QuizSubmitModal
        isOpen={isModalOpen}
        totalQuestions={questions.length}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsModalOpen(false)}
      />

      {/* Header Row */}
      <div className="quiz-header-row">
        <div className="quiz-title-box">
          <span className="quiz-badge-tag">KNOWLEDGE_CHECK</span>
          <h3 className="quiz-title-text font-body">Process Management Diagnostic Quiz</h3>
        </div>

        <div className="quiz-meta-pills">
          <span className="meta-pill">Questions: {questions.length}</span>
          {isSubmitted && (
            <span className="meta-pill score-tag">Score: {score} / {questions.length}</span>
          )}
          {isModuleDone && (
            <span className="meta-pill completed-badge-pill">✓ Module Completed</span>
          )}
        </div>
      </div>

      {/* 5. Loading and Error Handling */}
      {isLoading && (
        <div className="quiz-loading-box">
          <div className="quiz-spinner" />
          <p>Fetching diagnostic questions from API...</p>
        </div>
      )}

      {fetchError && !isLoading && (
        <div className="quiz-error-box">
          <p>⚠️ {fetchError}</p>
          <button type="button" className="quiz-retry-btn" onClick={fetchQuestions}>
            Retry Fetching
          </button>
        </div>
      )}

      {/* 1. Main Form with Reusable QuizQuestion Components */}
      {!isLoading && !fetchError && (
        <form onSubmit={handleFormSubmit} className="quiz-form">
          {questions.map((question, index) => (
            <QuizQuestion
              key={question.id}
              question={question}
              index={index}
              selectedOption={answers[question.id]}
              onSelectOption={handleSelectOption}
              isSubmitted={isSubmitted}
              isUnanswered={unansweredList.includes(question.id)}
            />
          ))}

          {/* Graded Summary */}
          {isSubmitted && (
            <div className="quiz-score-banner font-body">
              <div>
                <div className="score-details-title">
                  {score >= Math.ceil(questions.length * 0.6)
                    ? '🎉 Mastery Achieved!'
                    : '📚 Keep Practicing!'}
                </div>
                <p className="score-details-sub">
                  {score >= Math.ceil(questions.length * 0.6)
                    ? 'You have demonstrated a solid understanding of PCB, context switching, and process lifecycles.'
                    : 'Review the explanations above and retake the quiz to earn your module completion badge.'}
                </p>
              </div>
              <div className="score-number font-mono">
                {score} / {questions.length}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="quiz-form-footer">
            {!isSubmitted ? (
              <button type="submit" className="quiz-submit-btn">
                Submit Quiz ➔
              </button>
            ) : (
              <button type="button" className="quiz-reset-btn" onClick={handleResetQuiz}>
                ↺ Retake Quiz
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
