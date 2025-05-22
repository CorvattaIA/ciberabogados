import React, { useState } from 'react';
import Button from '../common/Button'; // Assuming Button.jsx is in src/components/common
import { PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const InputMessage = ({ onSendMessage, isLoading }) => {
  const [messageText, setMessageText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim() === '' || isLoading) {
      return;
    }
    onSendMessage(messageText);
    setMessageText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-4 bg-light border-t border-gray-200">
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder="Escribe tu mensaje aquí..."
        className="flex-grow px-3 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        disabled={isLoading}
      />
      <Button
        type="submit"
        variant="primary"
        disabled={isLoading || messageText.trim() === ''}
        className="px-4 py-2 min-w-[100px] flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
            Enviando...
          </>
        ) : (
          <>
            <PaperAirplaneIcon className="h-5 w-5 mr-2 transform rotate-45" />
            Enviar
          </>
        )}
      </Button>
    </form>
  );
};

export default InputMessage;
