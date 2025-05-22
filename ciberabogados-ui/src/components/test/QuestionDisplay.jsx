import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const QuestionDisplay = ({ question, currentAnswer, onAnswerChange }) => {
  const [internalDetail, setInternalDetail] = useState('');

  useEffect(() => {
    // Initialize internalDetail if currentAnswer has detail
    if (currentAnswer && currentAnswer.detail !== undefined) {
      setInternalDetail(currentAnswer.detail);
    } else {
      setInternalDetail(''); // Reset if no detail or answer changes
    }
  }, [currentAnswer]);

  const handleSimpleAnswer = (value) => {
    onAnswerChange(question.id, value);
  };

  const handleSiNoDetalleAnswer = (value) => {
    if (value === 'si') {
      onAnswerChange(question.id, value, internalDetail);
    } else {
      setInternalDetail(''); // Clear detail if 'No' is selected
      onAnswerChange(question.id, value, ''); // Send empty detail
    }
  };

  const handleDetailChange = (e) => {
    const newDetail = e.target.value;
    setInternalDetail(newDetail);
    // If 'si' is already selected, update the answer with new detail
    if (currentAnswer && currentAnswer.value === 'si') {
      onAnswerChange(question.id, 'si', newDetail);
    }
  };

  const getButtonVariant = (optionValue) => {
    const answerValue = currentAnswer?.value !== undefined ? currentAnswer.value : currentAnswer;
    return answerValue === optionValue ? 'success' : 'primary';
  };
  
  const getRingClass = (optionValue) => {
    const answerValue = currentAnswer?.value !== undefined ? currentAnswer.value : currentAnswer;
    return answerValue === optionValue ? 'ring-2 ring-success ring-offset-1' : '';
  }


  return (
    <div className="p-6 bg-white shadow-md rounded-lg my-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{question.texto}</h3>
      <div className="space-y-3">
        {question.tipo_respuesta === 'si_no' && (
          <div className="flex space-x-3">
            <Button
              onClick={() => handleSimpleAnswer('si')}
              variant={getButtonVariant('si')}
              className={`w-full ${getRingClass('si')}`}
            >
              Sí
            </Button>
            <Button
              onClick={() => handleSimpleAnswer('no')}
              variant={getButtonVariant('no')}
              className={`w-full ${getRingClass('no')}`}
            >
              No
            </Button>
          </div>
        )}

        {question.tipo_respuesta === 'si_no_detalle' && (
          <>
            <div className="flex space-x-3">
              <Button
                onClick={() => handleSiNoDetalleAnswer('si')}
                variant={getButtonVariant('si')}
                className={`w-full ${getRingClass('si')}`}
              >
                Sí
              </Button>
              <Button
                onClick={() => handleSiNoDetalleAnswer('no')}
                variant={getButtonVariant('no')}
                className={`w-full ${getRingClass('no')}`}
              >
                No
              </Button>
            </div>
            {currentAnswer && currentAnswer.value === 'si' && (
              <Input
                type="textarea"
                placeholder={question.detalle_placeholder || "Por favor, especifique..."}
                value={internalDetail}
                onChange={handleDetailChange}
                className="mt-3 w-full p-2 border border-gray-300 rounded-md"
                label="Detalles adicionales:"
              />
            )}
          </>
        )}

        {(question.tipo_respuesta === 'si_no_talvez' || question.tipo_respuesta === 'multiple_choice') &&
          question.opciones && (
            <div className={`flex ${question.opciones.length > 2 ? 'flex-col space-y-2' : 'flex-row space-x-3'}`}>
              {question.opciones.map((opcion) => (
                <Button
                  key={opcion.valor}
                  onClick={() => handleSimpleAnswer(opcion.valor)}
                  variant={getButtonVariant(opcion.valor)}
                  className={`w-full ${getRingClass(opcion.valor)}`}
                >
                  {opcion.texto}
                </Button>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default QuestionDisplay;
