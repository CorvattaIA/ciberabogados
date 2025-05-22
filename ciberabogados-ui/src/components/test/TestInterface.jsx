import React, { useState, useEffect } from 'react';
import { mockQuestions } from './mockQuestions';
import Button from '../common/Button'; // Assuming Button.jsx is in src/components/common

const TestInterface = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false); // For future API calls
  const [error, setError] = useState(null); // For displaying errors

  const totalQuestions = mockQuestions.length;
  const currentQuestion = mockQuestions[currentQuestionIndex];

  useEffect(() => {
    // Initialize answers if needed (e.g., pre-fill with 'no_answer')
    const initialAnswers = {};
    mockQuestions.forEach(q => {
      initialAnswers[q.id] = null; // Or a default like 'not_answered'
    });
    setAnswers(initialAnswers);
  }, []);

  const handleAnswerSelect = (questionId, answerValue) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answerValue,
    }));
    // Optionally, auto-advance to next question or enable 'Siguiente'
    // For now, just enabling 'Siguiente' is handled by its disabled logic
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleSubmitTest = () => {
    console.log('Test Submitted. Answers:', answers);
    // Later: Navigate to results page, send data to backend, etc.
    alert('Test finalizado. Revisa la consola para ver tus respuestas.');
  };

  if (isLoading) {
    return <div className="text-center p-10">Cargando preguntas...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-danger">Error: {error}</div>;
  }

  if (!currentQuestion) {
    return <div className="text-center p-10">No hay preguntas disponibles.</div>;
  }

  const isCurrentQuestionAnswered = answers[currentQuestion.id] !== null;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl bg-white shadow-lg rounded-lg my-10">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">Test de Diagnóstico de Seguridad</h2>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-secondary mb-1">
          <span>Pregunta {currentQuestionIndex + 1} de {totalQuestions}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-success h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Display */}
      <div className="bg-light p-6 rounded-md mb-6 min-h-[100px]">
        <p className="text-lg font-semibold text-text">{currentQuestion.text}</p>
      </div>

      {/* Answer Options */}
      <div className="space-y-4 mb-8">
        {currentQuestion.type === 'yes-no' && (
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <Button
              onClick={() => handleAnswerSelect(currentQuestion.id, 'yes')}
              variant={answers[currentQuestion.id] === 'yes' ? 'success' : 'primary'}
              className={`w-full ${answers[currentQuestion.id] === 'yes' ? 'ring-2 ring-success ring-opacity-75' : ''}`}
            >
              Sí
            </Button>
            <Button
              onClick={() => handleAnswerSelect(currentQuestion.id, 'no')}
              variant={answers[currentQuestion.id] === 'no' ? 'success' : 'primary'}
              className={`w-full ${answers[currentQuestion.id] === 'no' ? 'ring-2 ring-success ring-opacity-75' : ''}`}
            >
              No
            </Button>
          </div>
        )}

        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          currentQuestion.options.map((option) => (
            <Button
              key={option.value}
              onClick={() => handleAnswerSelect(currentQuestion.id, option.value)}
              variant={answers[currentQuestion.id] === option.value ? 'success' : 'primary'}
              className={`w-full text-left justify-start ${answers[currentQuestion.id] === option.value ? 'ring-2 ring-success ring-opacity-75' : ''}`}
            >
              {option.text}
            </Button>
          ))
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="secondary"
        >
          Anterior
        </Button>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button
            onClick={handleNextQuestion}
            disabled={!isCurrentQuestionAnswered}
            variant="primary"
          >
            Siguiente
          </Button>
        ) : (
          <Button
            onClick={handleSubmitTest}
            disabled={!isCurrentQuestionAnswered}
            variant="success"
          >
            Finalizar Test
          </Button>
        )}
      </div>
    </div>
  );
};

export default TestInterface;
