import React from 'react';
import Button from '../common/Button';
import Card from '../common/Card';

const SummaryScreen = ({ answers, questionsData, onEditAnswer, onSubmit }) => {
  if (!questionsData || !questionsData.areas) {
    return <div className="p-4 text-center text-danger">Error: No se pudieron cargar las preguntas para el resumen.</div>;
  }

  const getAnswerDisplay = (question, answer) => {
    if (answer === undefined || answer === null) {
      return <span className="italic text-gray-500">No respondida</span>;
    }
    const answerValue = typeof answer === 'object' && answer !== null ? answer.value : answer;
    const detailValue = typeof answer === 'object' && answer !== null ? answer.detail : '';

    let displayValue = '';
    if (question.tipo_respuesta === 'si_no' || question.tipo_respuesta === 'si_no_detalle') {
      displayValue = answerValue === 'si' ? 'Sí' : 'No';
    } else if ((question.tipo_respuesta === 'si_no_talvez' || question.tipo_respuesta === 'multiple_choice') && question.opciones) {
      const selectedOption = question.opciones.find(opt => opt.valor === answerValue);
      displayValue = selectedOption ? selectedOption.texto : <span className="italic text-warning">Opción inválida</span>;
    } else {
      displayValue = String(answerValue);
    }

    return (
      <>
        <span className="font-semibold">{displayValue}</span>
        {detailValue && <p className="text-sm text-gray-600 pl-4 mt-1">Detalle: {detailValue}</p>}
      </>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">Resumen de Respuestas</h2>
      {questionsData.areas.map((area, areaIndex) => (
        <Card key={area.id} className="mb-6 p-4">
          <h3 className="text-xl font-semibold text-secondary mb-4 border-b pb-2">{area.nombre}</h3>
          {area.preguntas.map((question, questionIndex) => (
            <div key={question.id} className="mb-4 pb-2 border-b border-gray-100 last:border-b-0">
              <div className="flex justify-between items-start">
                <p className="text-md text-text flex-1 mr-4">{question.texto}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEditAnswer(area.id, questionIndex)}
                  className="text-xs"
                >
                  Editar
                </Button>
              </div>
              <div className="mt-2 pl-2">
                {getAnswerDisplay(question, answers[question.id])}
              </div>
            </div>
          ))}
        </Card>
      ))}
      <div className="mt-8 text-center">
        <Button variant="success" size="lg" onClick={onSubmit}>
          Enviar Respuestas
        </Button>
      </div>
    </div>
  );
};

export default SummaryScreen;
