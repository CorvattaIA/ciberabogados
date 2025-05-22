-- Assuming uuid-ossp extension and update_updated_at_column function are already created.
-- Also assuming 'users' and 'test_sessions' tables exist.

-- Drop existing tables if they exist, to ensure the new schema is applied
-- (This is for development; in production, use ALTER TABLE for modifications)
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;

-- chat_sessions Table
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    diagnostic_test_session_id UUID REFERENCES test_sessions(id) ON DELETE SET NULL,
    initial_context_summary_encrypted TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER chat_sessions_updated_at_trigger
BEFORE UPDATE ON chat_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- chat_messages Table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- e.g., 'user', 'ai', 'system'
    message_content_encrypted TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text', -- e.g., 'text', 'document_suggestion', 'legal_term_explanation', 'error'
    related_entities_encrypted JSONB,
    timestamp TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER chat_messages_updated_at_trigger
BEFORE UPDATE ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for chat_sessions
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow user to select their own chat sessions" ON chat_sessions;
CREATE POLICY "Allow user to select their own chat sessions" ON chat_sessions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow user to insert their own chat sessions" ON chat_sessions;
CREATE POLICY "Allow user to insert their own chat sessions" ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow user to update their own chat sessions" ON chat_sessions;
CREATE POLICY "Allow user to update their own chat sessions" ON chat_sessions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow user to select messages from their own chat sessions" ON chat_messages;
CREATE POLICY "Allow user to select messages from their own chat sessions" ON chat_messages FOR SELECT USING (auth.uid() = (SELECT user_id FROM chat_sessions WHERE id = session_id));

DROP POLICY IF EXISTS "Allow user to insert their own user messages into their own chat sessions" ON chat_messages;
CREATE POLICY "Allow user to insert their own user messages into their own chat sessions" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM chat_sessions WHERE id = session_id) AND sender = 'user');

-- Note: AI/System messages should be inserted via a service role key which bypasses RLS or via specific policies for a 'service_role'.
-- Example for a service role (if one were formally defined and used):
-- DROP POLICY IF EXISTS "Allow service role to insert AI/system messages" ON chat_messages;
-- CREATE POLICY "Allow service role to insert AI/system messages" ON chat_messages FOR INSERT TO service_role WITH CHECK (sender IN ('ai', 'system'));
