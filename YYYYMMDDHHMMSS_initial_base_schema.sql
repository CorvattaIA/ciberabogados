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
    -- Note: In a real scenario, might also include 'category' or 'area_id' if questions are fixed per area
    -- However, current app logic uses string IDs from JSON, so this table might be for reference or future use
);

-- test_sessions Table
CREATE TABLE test_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ DEFAULT now(), -- Set when test is finalized
    raw_score_encrypted TEXT,
    analysis_summary_encrypted TEXT
);

-- test_answers Table
CREATE TABLE test_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL, -- Stores string ID from JSON like 'laboral_q1'
    answer_value_encrypted TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
    -- If test_questions used UUIDs and were stored in DB, question_id would be UUID and FK.
    -- FOREIGN KEY (question_id) REFERENCES test_questions(id) ON DELETE CASCADE
);

-- documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_type TEXT, -- e.g., 'generated_report', 'user_upload'
    storage_path TEXT NOT NULL, -- Could reference Supabase Storage path
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
