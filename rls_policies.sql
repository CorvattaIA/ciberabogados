-- Enable RLS and define policies for each table

-- users Table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual user select access" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow individual user update access" ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- INSERT for 'users' is typically handled by backend/triggers upon 'auth.users' creation or service roles.
-- DELETE for 'users' might be restricted or handled by specific functions for account deletion.

-- test_questions Table
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access to test questions" ON test_questions FOR SELECT USING (auth.role() = 'authenticated');
-- INSERT, UPDATE, DELETE for 'test_questions' are likely restricted to an admin/service role.

-- test_sessions Table
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user to select their own test sessions" ON test_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user to insert their own test sessions" ON test_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user to update their own test sessions" ON test_sessions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- test_answers Table
ALTER TABLE test_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user to select their own test answers" ON test_answers FOR SELECT USING (auth.uid() = (SELECT user_id FROM test_sessions WHERE id = session_id));
CREATE POLICY "Allow user to insert answers for their own test sessions" ON test_answers FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM test_sessions WHERE id = session_id));

-- chat_sessions Table
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user to select their own chat sessions" ON chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user to insert their own chat sessions" ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- chat_messages Table
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user to select messages from their own chat sessions" ON chat_messages FOR SELECT USING (auth.uid() = (SELECT user_id FROM chat_sessions WHERE id = session_id));
CREATE POLICY "Allow user to insert messages into their own chat sessions" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM chat_sessions WHERE id = session_id) AND (sender = 'user' OR sender = 'ai'));
-- Note: The 'sender = 'ai'' part in chat_messages INSERT might be better handled by a service role if AI messages are inserted server-side.

-- documents Table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user to select their own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user to insert their own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user to delete their own documents" ON documents FOR DELETE USING (auth.uid() = user_id);

-- appointments Table
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user to select their own appointments" ON appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user to insert new appointments for themselves" ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user to update their own appointments" ON appointments FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- Admin/service roles would need separate policies for managing all appointments (e.g., changing status to 'confirmed').

-- Grant usage on schemas for authenticated role if not already done
-- (This is often needed for RLS policies with subqueries to function correctly for users)
-- GRANT USAGE ON SCHEMA public TO authenticated; -- Or specific schema if tables are not in public
-- GRANT USAGE ON SCHEMA auth TO authenticated; -- For auth.uid() and auth.role()

-- Note: It's assumed that the 'authenticated' role has the necessary SELECT, INSERT, UPDATE, DELETE privileges on the tables themselves.
-- RLS policies further refine what rows can be accessed/modified.
-- If these base privileges are missing, RLS policies alone won't grant access.
-- Example:
-- GRANT SELECT ON test_questions TO authenticated;
-- GRANT SELECT, INSERT, UPDATE ON test_sessions TO authenticated;
-- etc. for all tables and relevant operations. These are typically set up during initial table creation or role setup.
