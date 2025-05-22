-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trigger function to update 'updated_at' columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    gdpr_consent_given_at TIMESTAMPTZ,
    gdpr_consent_details TEXT,
    CONSTRAINT fk_auth_users FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- test_questions Table
CREATE TABLE test_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_text TEXT NOT NULL,
    question_type TEXT, -- e.g., 'yes-no', 'multiple-choice'
    options JSONB, -- for multiple-choice answers
    created_at TIMESTAMPTZ DEFAULT now()
);

-- test_sessions Table
CREATE TABLE test_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    raw_score_encrypted TEXT,
    analysis_summary_encrypted TEXT
);

-- test_answers Table
CREATE TABLE test_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES test_questions(id) ON DELETE CASCADE,
    answer_value_encrypted TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- chat_sessions Table
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ
);

-- chat_messages Table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- e.g., 'user', 'ai', 'admin'
    message_content_encrypted TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_type TEXT, -- e.g., 'generated_report', 'user_upload'
    storage_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    version INTEGER DEFAULT 1
);

-- appointments Table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    requested_at TIMESTAMPTZ DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'pending', -- e.g., 'pending', 'confirmed', 'completed', 'cancelled'
    preferred_time_slot_start TIMESTAMPTZ,
    preferred_time_slot_end TIMESTAMPTZ,
    notes_encrypted TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER appointments_updated_at_trigger
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
