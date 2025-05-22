// src/services/chatService.js
import supabase from '../lib/supabaseClient'; // Adjust path as needed

const CHAT_SESSIONS_TABLE = 'chat_sessions';
const CHAT_MESSAGES_TABLE = 'chat_messages';

/**
 * Starts a new chat session in Supabase.
 * @param {string} userId The ID of the user starting the session.
 * @param {string} [diagnosticTestSessionId] Optional ID of the diagnostic test session.
 * @param {string} [initialContextSummary] Optional summary of the initial context (plaintext).
 * @returns {Promise<{id: string} | null>} The new chat session ID or null on error.
 */
export const startChatSession = async (userId, diagnosticTestSessionId = null, initialContextSummary = null) => {
  try {
    // TODO: Encryption for initialContextSummary should be handled by a Supabase DB function (RPC)
    // The 'initial_context_summary_encrypted' field in DB expects encrypted text.
    // For now, we pass plaintext if provided, or it remains null.
    const { data, error } = await supabase
      .from(CHAT_SESSIONS_TABLE)
      .insert({
        user_id: userId,
        diagnostic_test_session_id: diagnosticTestSessionId,
        initial_context_summary_encrypted: initialContextSummary, // Mark for server-side encryption
      })
      .select('id')
      .single();

    if (error) throw error;
    return data ? { id: data.id } : null;
  } catch (error) {
    console.error('Error starting chat session:', error.message);
    return null;
  }
};

/**
 * Saves a chat message to Supabase.
 * @param {string} sessionId The ID of the chat session.
 * @param {'user' | 'ai' | 'system'} sender The sender of the message.
 * @param {string} messageContent The content of the message (plaintext).
 * @param {string} [messageType='text'] The type of message.
 * @param {object} [relatedEntities=null] Related entities (plaintext).
 * @returns {Promise<object | null>} The saved message object or null on error.
 */
export const saveChatMessage = async (sessionId, sender, messageContent, messageType = 'text', relatedEntities = null) => {
  try {
    // TODO: Encryption for messageContent and relatedEntities should be handled by a Supabase DB function (RPC).
    // The 'message_content_encrypted' and 'related_entities_encrypted' fields in DB expect encrypted text.
    // For now, we pass plaintext.
    const { data, error } = await supabase
      .from(CHAT_MESSAGES_TABLE)
      .insert({
        session_id: sessionId,
        sender,
        message_content_encrypted: messageContent, // Mark for server-side encryption
        message_type: messageType,
        related_entities_encrypted: relatedEntities, // Mark for server-side encryption
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving chat message:', error.message);
    return null;
  }
};

/**
 * Retrieves the chat history for a given session.
 * @param {string} sessionId The ID of the chat session.
 * @returns {Promise<Array<object> | null>} Array of message objects or null on error.
 */
export const getChatHistory = async (sessionId) => {
  try {
    // TODO: Decryption for message_content_encrypted and related_entities_encrypted
    // should be handled by a Supabase DB function (RPC) or view.
    // For now, this will return the fields as they are stored (i.e., plaintext in this mock setup).
    const { data, error } = await supabase
      .from(CHAT_MESSAGES_TABLE)
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    // Simulate decryption for client-side if it were client-side encrypted
    // return data.map(msg => ({
    // ...msg,
    // message_content: decrypt(msg.message_content_encrypted),
    // related_entities: decrypt(msg.related_entities_encrypted),
    // }));
    return data;
  } catch (error) {
    console.error('Error retrieving chat history:', error.message);
    return null;
  }
};

/**
 * Retrieves details for a specific chat session.
 * @param {string} sessionId The ID of the chat session.
 * @returns {Promise<object | null>} Chat session object or null on error.
 */
export const getChatSession = async (sessionId) => {
  try {
    // TODO: Decryption for initial_context_summary_encrypted if needed here.
    const { data, error } = await supabase
      .from(CHAT_SESSIONS_TABLE)
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error retrieving chat session:', error.message);
    return null;
  }
};

export default {
  startChatSession,
  saveChatMessage,
  getChatHistory,
  getChatSession,
};
