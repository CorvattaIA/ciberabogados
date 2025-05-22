import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';

const DiagnosticResults = ({ questions, testAnswers }) => {
  const [isLoading, setIsLoading] = useState(false); // For future use
  const [error, setError] = useState(null); // For future use

  if (isLoading) {
    return <div className="text-center p-10">Cargando resultados...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-danger">Error al cargar los resultados: {error}</div>;
  }

  if (!questions || !testAnswers) {
    return <div className="text-center p-10 text-warning">No se han proporcionado datos para mostrar los resultados.</div>;
  }

  const getAnswerText = (question, answerValue) => {
    if (answerValue === null || answerValue === undefined || answerValue === 'not_answered') {
      return <span className="text-gray-500 italic">No respondida</span>;
    }
    if (question.type === 'yes-no') {
      return answerValue === 'yes' ? 'Sí' : 'No';
    }
    if (question.type === 'multiple-choice' && question.options) {
      const selectedOption = question.options.find(opt => opt.value === answerValue);
      return selectedOption ? selectedOption.text : <span className="text-warning italic">Opción no válida</span>;
    }
    return <span className="text-text">{String(answerValue)}</span>;
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl bg-white shadow-lg rounded-lg my-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Resultados de tu Diagnóstico de Seguridad</h1>
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-secondary mb-3">Resumen General</h2>
        <Card className="p-6 bg-light">
          <p className="text-text">
            Basado en tus respuestas, hemos identificado algunas áreas potenciales de riesgo y oportunidades
            de mejora en tu seguridad digital. Este informe detalla tus respuestas para que puedas
            revisarlas. Te recomendamos discutir estos resultados con nuestro asistente de IA para obtener
            orientación inmediata o solicitar asesoría personalizada con nuestros expertos legales para un
            análisis más profundo.
          </p>
        </Card>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-secondary mb-4">Revisión Detallada de Respuestas</h2>
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id} className="p-4">
              <h3 className="text-md font-semibold text-text mb-2">{question.text}</h3>
              <p className="text-sm">
                Tu respuesta: {getAnswerText(question, testAnswers[question.id])}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="pt-6 border-t">
        <h2 className="text-xl font-semibold text-secondary mb-4 text-center">Siguientes Pasos</h2>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link to="/chat">
            <Button variant="primary" size="md" className="w-full">
              Hablar con Asistente IA
            </Button>
          </Link>
          <Link to="/solicitar-asesoria">
            <Button variant="secondary" size="md" className="w-full">
              Solicitar Asesoría Humana
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DiagnosticResults;
