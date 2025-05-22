import React, { useState, useEffect, useCallback } from 'react';
import MessageList from './MessageList';
import InputMessage from './InputMessage';
import ActionPanel from './ActionPanel';
import { v4 as uuidv4 } from 'uuid'; // For generating temporary message IDs

import chatService from '../../services/chatService';
import aiChatService from '../../services/aiChatService';

// At the top of ChatInterface.jsx
const MOCK_USER_ID = 'mock-user-123'; // Replace with actual user ID from auth context later

const ChatInterface = ({ diagnosticContext }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Tracks AI response loading
  const [error, setError] = useState(null);
  const [currentChatSessionId, setCurrentChatSessionId] = useState(null);

  // Initialize chat session and potentially load welcome message
  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const session = await chatService.startChatSession(
          MOCK_USER_ID,
          diagnosticContext?.testSessionId,
          diagnosticContext?.summary // Pass summary as initial context (will be plaintext for now)
        );

        if (!session || !session.id) {
          throw new Error("Failed to start chat session.");
        }
        setCurrentChatSessionId(session.id);

        let initialUserMessageForAI = "Hola, necesito ayuda.";
        if (diagnosticContext?.summary) {
          initialUserMessageForAI = `He completado un test de diagnóstico con el siguiente resumen: "${diagnosticContext.summary}". ¿Podrías ayudarme a entenderlo mejor o indicarme los siguientes pasos?`;
        } else if (diagnosticContext?.testSessionId) {
          initialUserMessageForAI = `Acabo de completar un test de diagnóstico (ID: ${diagnosticContext.testSessionId}). ¿Qué debo hacer ahora?`;
        }
        
        const aiWelcomeResponse = await aiChatService.sendMessageToAI(
            initialUserMessageForAI,
            [], 
            diagnosticContext
        );

        if (aiWelcomeResponse && aiWelcomeResponse.text) {
          const welcomeAiMessage = {
            id: uuidv4(),
            text: aiWelcomeResponse.text,
            sender: 'ai',
            timestamp: new Date().toISOString(),
            message_type: aiWelcomeResponse.message_type || 'text',
          };
          
          const savedAiMsg = await chatService.saveChatMessage(
            session.id,
            'ai',
            welcomeAiMessage.text,
            welcomeAiMessage.message_type,
          );
          
          setMessages([{ ...welcomeAiMessage, id: savedAiMsg?.id || welcomeAiMessage.id }]);
        } else {
            const fallbackWelcome = {
                id: uuidv4(),
                text: "Hola, soy tu asistente legal IA. ¿Cómo puedo ayudarte hoy?",
                sender: 'ai',
                timestamp: new Date().toISOString(),
                message_type: 'text',
            };
            await chatService.saveChatMessage(session.id, 'ai', fallbackWelcome.text, fallbackWelcome.message_type);
            setMessages([fallbackWelcome]);
        }

      } catch (err) {
        console.error("Error initializing chat session:", err);
        setError("No se pudo iniciar la sesión de chat. Inténtalo de nuevo más tarde.");
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [diagnosticContext]);

  const handleSendMessage = useCallback(async (messageText) => {
    if (!currentChatSessionId) {
      setError("La sesión de chat no está activa.");
      setMessages(prev => [...prev, { id: uuidv4(), text: "Error: No hay sesión activa.", sender: 'system', message_type: 'error', timestamp: new Date().toISOString() }]);
      return;
    }

    const tempUserMessageId = 'temp-user-' + Date.now();
    const userMessage = {
      id: tempUserMessageId,
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
      message_type: 'text',
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const savedUserMessage = await chatService.saveChatMessage(currentChatSessionId, 'user', messageText);
      if (savedUserMessage && savedUserMessage.id !== tempUserMessageId) {
        setMessages(prev => prev.map(msg => msg.id === tempUserMessageId ? { ...msg, id: savedUserMessage.id } : msg));
      } else if (!savedUserMessage) {
         console.warn("Failed to save user message to DB for message:", messageText);
         setMessages(prev => prev.map(msg => msg.id === tempUserMessageId ? { ...msg, error: 'No enviado' } : msg));
      }
      
      const aiResponse = await aiChatService.sendMessageToAI(messageText, messages, diagnosticContext);

      if (aiResponse && aiResponse.text) {
        const tempAiMessageId = 'temp-ai-' + Date.now();
        const aiMessage = {
          id: tempAiMessageId,
          text: aiResponse.text,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          message_type: aiResponse.message_type || 'text',
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);

        const savedAiMessage = await chatService.saveChatMessage(
          currentChatSessionId,
          'ai',
          aiMessage.text,
          aiMessage.message_type,
        );
        if (savedAiMessage && savedAiMessage.id !== tempAiMessageId) {
            setMessages(prev => prev.map(msg => msg.id === tempAiMessageId ? { ...msg, id: savedAiMessage.id } : msg));
        } else if (!savedAiMessage) {
            console.warn("Failed to save AI message to DB for response:", aiMessage.text);
        }

      } else {
        throw new Error("No response from AI service or empty response.");
      }

    } catch (err) {
      console.error("Error sending message or getting AI response:", err);
      const errorMessage = {
        id: uuidv4(),
        text: "Lo siento, no pude procesar tu mensaje o generar una respuesta. Por favor, inténtalo de nuevo.",
        sender: 'system',
        timestamp: new Date().toISOString(),
        message_type: 'error',
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      setError("Error al comunicar con el asistente IA.");
    } finally {
      setIsLoading(false);
    }
  }, [currentChatSessionId, messages, diagnosticContext]);

  const handleActionRequest = useCallback(async (actionType) => {
    console.log('Action requested:', actionType, "Session ID:", currentChatSessionId);
    
    let systemMessageText = `Acción solicitada: ${actionType}.`;
    if (actionType === 'export_chat') {
      if (!messages || messages.length === 0) {
        systemMessageText = "No hay mensajes para exportar.";
      } else {
        try {
          let chatContent = `Chat Exportado de Ciberabogados\nSession ID: ${currentChatSessionId || 'N/A'}\nExported At: ${new Date().toLocaleString()}\n\n`;
          messages.forEach(msg => {
            const time = new Date(msg.timestamp).toLocaleTimeString();
            chatContent += `[${time}] ${msg.sender.toUpperCase()}: ${msg.text}\n`;
            if (msg.message_type && msg.message_type !== 'text') {
              chatContent += `  (Tipo de mensaje: ${msg.message_type})\n`;
            }
          });
          
          const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `ciberabogados_chat_${currentChatSessionId || 'session'}.txt`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          systemMessageText = "Chat exportado como ciberabogados_chat.txt";
        } catch (exportError) {
          console.error("Error exporting chat:", exportError);
          systemMessageText = "Error al exportar el chat.";
        }
      }
    } else {
        systemMessageText += " Esta funcionalidad se implementará en futuras versiones.";
    }

    const systemMessage = {
        id: uuidv4(),
        text: systemMessageText,
        sender: 'system',
        timestamp: new Date().toISOString(),
        message_type: 'text' // Or 'system_notification'
    };
    setMessages(prevMessages => [...prevMessages, systemMessage]);

    // Save system message to DB if chat session is active
    if (currentChatSessionId) {
        try {
            await chatService.saveChatMessage(
                currentChatSessionId,
                'system',
                systemMessage.text,
                systemMessage.message_type
            );
        } catch (saveError) {
            console.error("Error saving system message for action:", saveError);
        }
    }
  }, [currentChatSessionId, messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden my-5">
      {error && !messages.some(m => m.message_type === 'error' && m.text.includes(error)) && (
        <div className="p-3 bg-danger text-white text-center text-sm">
          Error: {error}
        </div>
      )}
      <MessageList messages={messages} />
      <ActionPanel onActionRequest={handleActionRequest} />
      <InputMessage onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;
