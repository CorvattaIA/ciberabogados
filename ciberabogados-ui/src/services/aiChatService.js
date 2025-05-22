// src/services/aiChatService.js

/**
 * Generates a specialized prompt for the AI based on the legal area and context.
 * @param {string} message The current user message.
 * @param {Array<{sender: 'user' | 'ai' | 'system', text: string}>} conversationHistory Array of previous messages.
 * @param {object} diagnosticContext Context from the diagnostic test (e.g., { testSessionId: 'uuid', summary: 'User concerned about X', legalArea: 'laboral' }).
 * @param {string} legalArea The identified legal area (e.g., 'laboral', 'civil', 'penal').
 * @returns {string} The constructed prompt.
 */
const constructPrompt = (message, conversationHistory, diagnosticContext, legalArea) => {
  let prompt = `System: You are Ciberabogados AI, a specialized legal assistant. Your current area of expertise is ${legalArea || 'General Legal Information'} in [Default Jurisdiction - e.g., Spain].`;

  if (diagnosticContext) {
    prompt += `
User's Diagnostic Test Summary (${diagnosticContext.legalArea || legalArea || 'N/A'} Focus):`;
    if (diagnosticContext.summary) {
      prompt += `
- Summary: ${diagnosticContext.summary}`;
    }
    // Add more specific fields from diagnosticContext if available and relevant
  }

  prompt += `

Conversation History (last 5 messages):`;
  const recentHistory = conversationHistory.slice(-5);
  recentHistory.forEach(msg => {
    prompt += `
${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`;
  });

  prompt += `

Current User Message:`;
  prompt += `
User: ${message}`;

  prompt += `

Your Task:
1. Analyze the user's message in the context of their diagnostic summary (if any) and conversation history.
2. Provide clear, concise, and legally informative answers relevant to ${legalArea || 'the user query'}.
3. If complex legal terms are used by you, explain them. If the user explicitly asks for an explanation of a term, provide it.
4. Identify any relevant legal entities (dates, names, monetary amounts, law references) if possible.
5. Maintain a supportive and professional tone.
6. If asked for estimations on time/cost, provide general information or state that a human consultation is needed for specifics. (e.g., "Para una estimación precisa de tiempos y costos, es necesaria una consulta con un especialista. De forma muy general, procesos similares pueden tardar X, pero esto varía enormemente.")
7. If asked to suggest documents ("documentos necesito", "qué papeles"), list relevant ones based on the context.
Respond directly to the Current User Message.`;

  if (legalArea === 'laboral') {
    prompt += `

Specific Labor Law Considerations:
- Pay attention to details like contract types, dismissal reasons, salary issues, working hours, etc.
- Refer to common labor law concepts when applicable.`;
  }
  // Add more else if blocks for other legal areas

  return prompt;
};

/**
 * Sends a message to the (mocked) AI API.
 * @param {string} message The current user message.
 * @param {Array<{sender: 'user' | 'ai' | 'system', text: string}>} conversationHistory Array of previous messages.
 * @param {object} diagnosticContext Context from the diagnostic test.
 * @returns {Promise<{text: string, message_type?: string, extractedEntities?: object, suggestedActions?: Array<string>}>}
 */
export const sendMessageToAI = async (message, conversationHistory, diagnosticContext) => {
  const legalArea = diagnosticContext?.legalArea || 'general';
  const fullPrompt = constructPrompt(message, conversationHistory, diagnosticContext, legalArea);

  console.log("---- Mock AI Service ----");
  console.log("Sending to AI (Full Prompt):", fullPrompt);

  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API call delay

  let aiResponseText = "Esta es una respuesta simulada del Asistente IA. ";
  let message_type = 'text'; // Default message type

  const lowerCaseMessage = message.toLowerCase();

  if (lowerCaseMessage.includes("explícame") || lowerCaseMessage.includes("que es") || lowerCaseMessage.includes("qué es")) {
    const term = lowerCaseMessage.split("es ")[1] || lowerCaseMessage.split("explícame ")[1] || "ese término legal";
    aiResponseText = `Claro, te explico sobre "${term}": [Explicación simulada del término legal "${term}"]. Es un concepto importante en el ámbito de ${legalArea}. Generalmente se refiere a... [más detalles].`;
    message_type = 'legal_term_explanation';
  } else if (lowerCaseMessage.includes("documentos necesito") || lowerCaseMessage.includes("que papeles") || lowerCaseMessage.includes("qué papeles")) {
    aiResponseText = "Para tu situación, podrías necesitar los siguientes documentos (simulación): \n1. Contrato de trabajo (si aplica). \n2. Comunicaciones relevantes (emails, cartas). \n3. Documento de identidad. \nConsidera que esto es una orientación general.";
    message_type = 'document_suggestion';
  } else if (lowerCaseMessage.includes("cuanto tiempo") || lowerCaseMessage.includes("cuánto tiempo") || lowerCaseMessage.includes("cuanto cuesta") || lowerCaseMessage.includes("cuánto cuesta")) {
    aiResponseText = "Para una estimación precisa de tiempos y costos, es necesaria una consulta con un especialista. De forma muy general, y sin conocer los detalles específicos de tu caso, algunos procesos legales pueden tomar desde unas semanas hasta varios meses, y los costos varían considerablemente. Esta es solo una estimación general y no un presupuesto.";
    message_type = 'text'; // Or a specific type like 'estimation_info' if needed for UI
  } else if (legalArea === 'laboral' && (lowerCaseMessage.includes("despido") || lowerCaseMessage.includes("contrato"))) {
    aiResponseText += `Dado que mencionas un tema laboral como "${message}", te puedo comentar que las leyes de ${legalArea} son complejas. ¿Tienes alguna pregunta específica sobre tu contrato o la situación de despido?`;
  } else if (lowerCaseMessage.includes("ayuda")) {
    aiResponseText += "Estoy aquí para ayudarte con información legal general. ¿Qué necesitas saber? ";
  } else {
    aiResponseText += `He procesado tu mensaje: "${message}". ¿En qué más puedo ayudarte?`;
  }

  console.log("---- Mock AI Service ----");
  console.log("Received from AI:", { text: aiResponseText, message_type });

  return Promise.resolve({
    text: aiResponseText,
    message_type: message_type,
    // extractedEntities: { ... }, // Example
    // suggestedActions: ['request_human_consult'], // Example
  });
};

export default {
  sendMessageToAI,
  constructPrompt,
};
