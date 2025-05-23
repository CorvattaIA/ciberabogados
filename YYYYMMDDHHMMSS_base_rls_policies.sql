-- RLS Policies for tables in the initial base schema

-- users Table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow individual user select access" ON users;
CREATE POLICY "Allow individual user select access" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow individual user update access" ON users;
CREATE POLICY "Allow individual user update access" ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- INSERT for 'users' is typically handled by backend/triggers upon 'auth.users' creation or service roles.
-- DELETE for 'users' might be restricted or handled by specific functions for account deletion.

-- test_questions Table
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read access to test questions" ON test_questions;
CREATE POLICY "Allow authenticated read access to test questions" ON test_questions FOR SELECT USING (auth.role() = 'authenticated');
-- INSERT, UPDATE, DELETE for 'test_questions' are likely restricted to an admin/service role.

-- test_sessions Table
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow user to select their own test sessions" ON test_sessions;
CREATE POLICY "Allow user to select their own test sessions" ON test_sessions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow user to insert their own test sessions" ON test_sessions;
CREATE POLICY "Allow user to insert their own test sessions" ON test_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow user to update their own test sessions" ON test_sessions;
CREATE POLICY "Allow user to update their own test sessions" ON test_sessions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- test_answers Table
ALTER TABLE test_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow user to select their own test answers" ON test_answers;
CREATE POLICY "Allow user to select their own test answers" ON test_answers FOR SELECT USING (auth.uid() = (SELECT user_id FROM test_sessions WHERE id = session_id));

DROP POLICY IF EXISTS "Allow user to insert answers for their own test sessions" ON test_answers;
CREATE POLICY "Allow user to insert answers for their own test sessions" ON test_answers FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM test_sessions WHERE id = session_id));

-- documents Table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow user to select their own documents" ON documents;
CREATE POLICY "Allow user to select their own documents" ON documents FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow user to insert their own documents" ON documents;
CREATE POLICY "Allow user to insert their own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow user to delete their own documents" ON documents;
CREATE POLICY "Allow user to delete their own documents" ON documents FOR DELETE USING (auth.uid() = user_id);

-- appointments Table
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow user to select their own appointments" ON appointments;
CREATE POLICY "Allow user to select their own appointments" ON appointments FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow user to insert new appointments for themselves" ON appointments;
CREATE POLICY "Allow user to insert new appointments for themselves" ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow user to update their own appointments" ON appointments;
CREATE POLICY "Allow user to update their own appointments" ON appointments FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Note on Privileges:
-- It's assumed that the 'authenticated' role (and potentially 'service_role') has the necessary
-- base SELECT, INSERT, UPDATE, DELETE privileges on the tables themselves.
-- RLS policies further refine what rows can be accessed/modified.
-- Example:
-- GRANT SELECT ON test_questions TO authenticated;
-- GRANT SELECT, INSERT, UPDATE ON test_sessions TO authenticated;
-- etc. for all tables and relevant operations. These are typically set up
-- during initial table creation or role setup.
-- GRANT USAGE ON SCHEMA public TO authenticated; (or other relevant schemas)
-- GRANT USAGE ON SCHEMA auth TO authenticated; (for auth.uid() and auth.role())
