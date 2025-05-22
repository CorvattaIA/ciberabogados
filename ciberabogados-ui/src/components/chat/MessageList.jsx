import React, { useEffect, useRef } from 'react';
import { UserCircleIcon, SparklesIcon, InformationCircleIcon, BookOpenIcon } from '@heroicons/react/24/solid'; // Added BookOpenIcon

const MessageList = ({ messages = [] }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSenderIcon = (sender, messageType) => {
    if (sender === 'user') return <UserCircleIcon className="h-8 w-8 text-primary" />;
    if (sender === 'ai') {
      if (messageType === 'legal_term_explanation') {
        return <BookOpenIcon className="h-8 w-8 text-secondary" />;
      }
      return <SparklesIcon className="h-8 w-8 text-secondary" />;
    }
    // For 'system' messages
    return <InformationCircleIcon className="h-8 w-8 text-gray-500" />;
  };

  const getMessageAlignment = (sender) => {
    return sender === 'user' ? 'items-end' : 'items-start';
  };

  const getMessageBubbleStyle = (sender, messageType) => {
    let baseStyle = "px-4 py-2 rounded-lg max-w-xs md:max-w-md lg:max-w-lg break-words shadow-sm";
    if (sender === 'user') {
      baseStyle += " bg-primary text-white";
    } else if (sender === 'ai') {
      baseStyle += " bg-gray-100 text-text"; // Slightly lighter gray for AI
      if (messageType === 'legal_term_explanation') {
        baseStyle += " border-l-4 border-blue-500"; // Distinct border for explanations
      } else if (messageType === 'document_suggestion') {
        baseStyle += " border-l-4 border-green-500"; 
      }
    } else { // system
      baseStyle += " bg-indigo-100 text-indigo-700 border border-indigo-300"; // System messages distinct
    }
    
    if (messageType === 'error' && sender !== 'user') { // Errors from AI or System
        baseStyle = "px-4 py-2 rounded-lg max-w-xs md:max-w-md lg:max-w-lg break-words shadow-sm bg-red-100 text-red-700 border-l-4 border-danger";
    }


    return baseStyle;
  };

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-grow p-6 text-center text-gray-500">
        No hay mensajes aún. Comienza la conversación.
      </div>
    );
  }

  return (
    <div className="flex-grow p-4 md:p-6 space-y-4 overflow-y-auto bg-background">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex flex-col ${getMessageAlignment(msg.sender)}`}>
          <div className="flex items-start space-x-2">
            {msg.sender !== 'user' && getSenderIcon(msg.sender, msg.message_type)}
            <div className={getMessageBubbleStyle(msg.sender, msg.message_type)}>
              <p className="text-sm">{msg.text}</p>
            </div>
            {msg.sender === 'user' && getSenderIcon(msg.sender, msg.message_type)}
          </div>
          <span className={`text-xs text-gray-400 mt-1 px-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            {formatTimestamp(msg.timestamp)}
          </span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
