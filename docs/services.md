# Frontend Services

This document describes the JavaScript services used in the Ciberabogados frontend application. These services encapsulate logic for interacting with backend systems (like Supabase) and external APIs (like an AI service).

## `chatService.js`

*   **File Path**: `frontend/src/services/chatService.js`
*   **Purpose**: Handles operations related to chat sessions and messages, primarily interacting with the Supabase backend for persistence.
*   **Dependencies**: `supabaseClient.js` (mocked or actual Supabase client).

### Key Functions

1.  **`startChatSession(userId, diagnosticTestSessionId = null, initialContextSummary = null)`**
    *   **Parameters**:
        *   `userId` (String): The ID of the user starting the session.
        *   `diagnosticTestSessionId` (String, Optional): ID of a related diagnostic test session.
        *   `initialContextSummary` (String, Optional): Plaintext summary of initial context.
    *   **Returns**: `Promise<{id: string} | null>` - An object containing the new chat session ID, or `null` on error.
    *   **Interaction**: Inserts a new record into the `chat_sessions` table in Supabase.
    *   **Encryption Note**: `initialContextSummary` is intended for server-side encryption (passed as `initial_context_summary_encrypted`).

2.  **`saveChatMessage(sessionId, sender, messageContent, messageType = 'text', relatedEntities = null)`**
    *   **Parameters**:
        *   `sessionId` (String): The ID of the chat session.
        *   `sender` (String): 'user', 'ai', or 'system'.
        *   `messageContent` (String): Plaintext content of the message.
        *   `messageType` (String, Optional): Type of message (e.g., 'text', 'document_suggestion'), defaults to 'text'.
        *   `relatedEntities` (Object, Optional): Plaintext object of related entities.
    *   **Returns**: `Promise<object | null>` - The saved message object from Supabase, or `null` on error.
    *   **Interaction**: Inserts a new record into the `chat_messages` table in Supabase.
    *   **Encryption Note**: `messageContent` (for `message_content_encrypted`) and `relatedEntities` (for `related_entities_encrypted`) are intended for server-side encryption.

3.  **`getChatHistory(sessionId)`**
    *   **Parameters**:
        *   `sessionId` (String): The ID of the chat session.
    *   **Returns**: `Promise<Array<object> | null>` - An array of message objects for the session, ordered by timestamp, or `null` on error.
    *   **Interaction**: Selects records from the `chat_messages` table in Supabase.
    *   **Decryption Note**: Assumes server-side decryption for `message_content_encrypted` and `related_entities_encrypted` when data is retrieved. The current mock setup might return plaintext if it was stored as such.

4.  **`getChatSession(sessionId)`**
    *   **Parameters**:
        *   `sessionId` (String): The ID of the chat session.
    *   **Returns**: `Promise<object | null>` - The chat session object, or `null` on error.
    *   **Interaction**: Selects a record from the `chat_sessions` table in Supabase.
    *   **Decryption Note**: Assumes server-side decryption for `initial_context_summary_encrypted`.

## `testService.js`

*   **File Path**: `frontend/src/services/testService.js`
*   **Purpose**: Manages operations related to diagnostic tests, including submission of answers and retrieval of results from Supabase.
*   **Dependencies**: `supabaseClient.js`.

### Key Functions

1.  **`submitDiagnosticTest(userId, answers, analysisResults, questionsData)`**
    *   **Parameters**:
        *   `userId` (String): The ID of the user.
        *   `answers` (Object): Raw answers from the user (keyed by question ID).
        *   `analysisResults` (Object): Results from `testAnalyzer.js` (includes `primaryArea`, `riskLevel`, `recommendations`).
        *   `questionsData` (Object): The full questions JSON structure.
    *   **Returns**: `Promise<{sessionId: string} | null>` - An object containing the new test session ID, or `null` on error.
    *   **Interaction**:
        *   Inserts a record into the `test_sessions` table (storing parts of `analysisResults`).
        *   Batch inserts records into the `test_answers` table (storing user `answers`).
    *   **Encryption Note**: `analysisResults` (for `raw_score_encrypted`, `analysis_summary_encrypted`) and `answers` (for `answer_value_encrypted`) are intended for server-side encryption.

2.  **`getTestResultsForUser(userId)`**
    *   **Parameters**:
        *   `userId` (String): The ID of the user.
    *   **Returns**: `Promise<Array<object> | null>` - An array of test session summary objects, or `null` on error.
    *   **Interaction**: Selects records from the `test_sessions` table in Supabase.
    *   **Decryption Note**: Assumes server-side decryption for encrypted fields. The service currently attempts to `JSON.parse` `analysis_summary_encrypted`.

3.  **`getTestDetails(testSessionId)`**
    *   **Parameters**:
        *   `testSessionId` (String): The ID of the test session.
    *   **Returns**: `Promise<Array<object> | null>` - An array of detailed answer objects for the session, or `null` on error.
    *   **Interaction**: Selects records from the `test_answers` table in Supabase.
    *   **Decryption Note**: Assumes server-side decryption. The service currently attempts to `JSON.parse` `answer_value_encrypted`.

## `aiChatService.js`

*   **File Path**: `frontend/src/services/aiChatService.js`
*   **Purpose**: Handles interactions with the AI API, including prompt construction and processing responses. Currently uses a mocked implementation.
*   **Dependencies**: None (besides internal logic).

### Key Functions

1.  **`constructPrompt(message, conversationHistory, diagnosticContext, legalArea)`**
    *   **Parameters**:
        *   `message` (String): The current user message.
        *   `conversationHistory` (Array): Array of previous message objects.
        *   `diagnosticContext` (Object): Context from a diagnostic test.
        *   `legalArea` (String): The identified legal area.
    *   **Returns**: `String` - The fully constructed prompt to be sent to the AI.
    *   **Interaction**: Purely client-side logic.

2.  **`sendMessageToAI(message, conversationHistory, diagnosticContext)`**
    *   **Parameters**:
        *   `message` (String): The current user message.
        *   `conversationHistory` (Array): Array of previous message objects.
        *   `diagnosticContext` (Object): Context from a diagnostic test.
    *   **Returns**: `Promise<{text: string, message_type?: string, extractedEntities?: object, suggestedActions?: Array<string>}>` - A promise resolving to the AI's response object.
    *   **Interaction**:
        *   Calls `constructPrompt` to build the AI prompt.
        *   **Currently Mocked**: Simulates an API call with a delay and generates mock responses based on keywords in the message and `legalArea` from `diagnosticContext`.
        *   In a real implementation, this would make an HTTP request to an AI API endpoint.
    *   **API Key Note**: Would require an API key (e.g., `VITE_AI_API_KEY`) for a real AI service, typically handled in the request headers.I have already generated `README.md` (Turn 60), created the `/docs` directory (Turn 61), generated `/docs/data_structures.md` (Turn 62), and generated `/docs/services.md` (Turn 63).

Now, I will create `/docs/user_manual.md`.
