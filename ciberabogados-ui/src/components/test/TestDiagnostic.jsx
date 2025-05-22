import React, { useState, useEffect, useCallback } from 'react';
import questionsJsonData from '../../data/diagnosticQuestions.json'; // Direct import
import QuestionDisplay from './QuestionDisplay';
import SummaryScreen from './SummaryScreen';
import Button from '../common/Button';
import Card from '../common/Card';

import { analyzeAnswers } from '../../logic/testAnalyzer';
import testService from '../../services/testService';

const MOCK_USER_ID = 'mock-user-123'; // Replace with actual user ID from auth context later

const TestDiagnostic = () => {
  const [questionsData, setQuestionsData] = useState(null);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testStage, setTestStage] = useState('loading'); // 'loading', 'inProgress', 'summary', 'submitting', 'submitted'
  const [errorState, setErrorState] = useState(null);
  const [submissionData, setSubmissionData] = useState(null); // To store sessionId and analysisResults

  useEffect(() => {
    setQuestionsData(questionsJsonData);
    setTestStage('inProgress');
    setErrorState(null); // Clear error on re-init
    setSubmissionData(null); // Clear submission data on re-init
  }, []);

  const handleAnswerChange = useCallback((questionId, value, detail) => {
    setAnswers(prevAnswers => {
      if (detail !== undefined) {
        return { ...prevAnswers, [questionId]: { value, detail } };
      }
      return { ...prevAnswers, [questionId]: value };
    });
  }, []);

  const currentArea = questionsData?.areas[currentAreaIndex];
  const currentQuestion = currentArea?.preguntas[currentQuestionIndex];

  const totalAreas = questionsData?.areas.length || 0;
  const questionsInCurrentArea = currentArea?.preguntas.length || 0;

  const handleNextQuestion = () => {
    setErrorState(null); // Clear error on navigation
    if (currentQuestionIndex < questionsInCurrentArea - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleNextArea();
    }
  };

  const handlePreviousQuestion = () => {
    setErrorState(null); // Clear error on navigation
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      handlePreviousArea(true); // true to go to last question of previous area
    }
  };

  const handleNextArea = () => {
    if (currentAreaIndex < totalAreas - 1) {
      setCurrentAreaIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      setTestStage('summary');
    }
  };

  const handlePreviousArea = (goToLastQuestion = false) => {
    if (currentAreaIndex > 0) {
      setCurrentAreaIndex(prev => prev - 1);
      if (goToLastQuestion && questionsData) {
        const prevAreaQuestionsCount = questionsData.areas[currentAreaIndex - 1].preguntas.length;
        setCurrentQuestionIndex(prevAreaQuestionsCount - 1);
      } else {
        setCurrentQuestionIndex(0);
      }
    }
  };

  const handleGoToQuestion = (areaId, questionIdx) => {
    setErrorState(null); // Clear error when navigating
    const areaIdx = questionsData.areas.findIndex(area => area.id === areaId);
    if (areaIdx !== -1) {
      setCurrentAreaIndex(areaIdx);
      setCurrentQuestionIndex(questionIdx);
      setTestStage('inProgress');
    }
  };

  const handleSubmitTest = async () => {
    setTestStage('submitting');
    setErrorState(null);
    try {
      const analysisResults = analyzeAnswers(answers, questionsData);
      console.log('Analysis Results:', analysisResults);

      const submissionResult = await testService.submitDiagnosticTest(
        MOCK_USER_ID,
        answers,
        analysisResults,
        questionsData
      );

      if (submissionResult && submissionResult.sessionId) {
        setSubmissionData({
          sessionId: submissionResult.sessionId,
          analysis: analysisResults,
        });
        setTestStage('submitted');
      } else {
        throw new Error('La sumisión del test no devolvió un ID de sesión.');
      }
    } catch (err) {
      console.error('Error submitting test:', err);
      setErrorState(`Error al enviar el test: ${err.message || 'Por favor, inténtelo de nuevo.'}`);
      setTestStage('summary'); // Revert to summary to allow retry or review
    }
  };
  
  const resetTest = () => {
    setQuestionsData(questionsJsonData); // Re-initialize with original data
    setCurrentAreaIndex(0);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTestStage('inProgress');
    setErrorState(null);
    setSubmissionData(null);
  };


  const overallProgress = totalAreas > 0 ? ((currentAreaIndex) / totalAreas) * 100 : 0;
  const areaProgress = questionsInCurrentArea > 0 ? ((currentQuestionIndex + 1) / questionsInCurrentArea) * 100 : 0;


  if (testStage === 'loading' || !questionsData) {
    return <div className="text-center p-10">Cargando Test de Diagnóstico...</div>;
  }
  
  if (testStage === 'submitting') {
    return (
      <Card className="text-center p-10 max-w-xl mx-auto my-10">
        <h2 className="text-2xl font-bold text-primary mb-4">Enviando respuestas...</h2>
        <p className="text-text mb-6">Por favor, espere un momento.</p>
        {/* Add a spinner icon here later if desired */}
      </Card>
    );
  }


  if (testStage === 'submitted') {
    return (
      <Card className="text-center p-10 max-w-xl mx-auto my-10">
        <h2 className="text-2xl font-bold text-success mb-4">¡Gracias por completar el test!</h2>
        <p className="text-text mb-2">Tus respuestas han sido registradas.</p>
        {submissionData?.sessionId && <p className="text-sm text-secondary mb-1">ID de Sesión: {submissionData.sessionId}</p>}
        {submissionData?.analysis?.primaryArea && <p className="text-sm text-secondary mb-1">Área Principal de Enfoque: {submissionData.analysis.primaryArea}</p>}
        {submissionData?.analysis?.riskLevel && <p className="text-sm text-secondary mb-4">Nivel de Riesgo Estimado: {submissionData.analysis.riskLevel.toUpperCase()}</p>}
        
        <p className="text-text mb-6">En breve te contactaremos o puedes explorar los siguientes pasos.</p>
        {/* 
          TODO: Future enhancement - Pass submissionData to a dedicated results display component
          For now, we just show a summary here and a reset button.
          Example: <Link to={`/test-results/${submissionData.sessionId}`}><Button>Ver Resultados Detallados</Button></Link>
        */}
        <Button onClick={resetTest} variant="primary">
            Realizar otro test (Reset)
        </Button>
      </Card>
    );
  }

  if (testStage === 'summary') {
    return (
      <SummaryScreen
        answers={answers}
        questionsData={questionsData}
        onEditAnswer={handleGoToQuestion}
        onSubmit={handleSubmitTest}
        error={errorState} // Pass error to summary screen
      />
    );
  }

  // testStage === 'inProgress'
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <Card className="p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-primary mb-2 text-center">
          Test de Diagnóstico: {currentArea?.nombre}
        </h1>
        
        {errorState && (
            <div className="my-4 p-3 bg-danger text-white rounded-md text-center">
                <p>{errorState}</p>
            </div>
        )}
        
        <div className="mb-2">
          <p className="text-sm text-secondary text-center">Progreso Total del Test</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-secondary text-center">Progreso en: {currentArea?.nombre}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div
              className="bg-success h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${areaProgress}%` }}
            ></div>
          </div>
        </div>


        {currentQuestion && (
          <QuestionDisplay
            question={currentQuestion}
            currentAnswer={answers[currentQuestion.id]}
            onAnswerChange={handleAnswerChange}
          />
        )}

        <div className="mt-8 flex flex-col space-y-3">
          <div className="flex justify-between space-x-3">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentAreaIndex === 0 && currentQuestionIndex === 0}
              variant="secondary"
              className="flex-1"
            >
              Anterior
            </Button>
            <Button
              onClick={handleNextQuestion}
              variant="primary"
              className="flex-1"
            >
              {currentQuestionIndex === questionsInCurrentArea - 1 && currentAreaIndex === totalAreas - 1
                ? 'Ver Resumen'
                : currentQuestionIndex === questionsInCurrentArea - 1
                ? 'Siguiente Área'
                : 'Siguiente Pregunta'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestDiagnostic;
