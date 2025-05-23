# Data Structures

This document outlines the key data structures used in the Ciberabogados platform, primarily focusing on the Supabase database schema and important JSON structures used by the frontend.

## Supabase Table Schemas

The following tables are defined in the Supabase PostgreSQL database.

### `users`

Stores user-specific information, linked to Supabase Auth.

| Column                  | Data Type     | Constraints                                  | Description                                           |
| :---------------------- | :------------ | :------------------------------------------- | :---------------------------------------------------- |
| `id`                    | `UUID`        | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()`  | Unique identifier for the user, FK to `auth.users.id` |
| `email`                 | `TEXT`        | `UNIQUE`, `NOT NULL`                         | User's email address.                                 |
| `full_name`             | `TEXT`        |                                              | User's full name.                                     |
| `created_at`            | `TIMESTAMPTZ` | `DEFAULT now()`                              | Timestamp of user creation.                           |
| `updated_at`            | `TIMESTAMPTZ` | `DEFAULT now()`                              | Timestamp of last update (auto-updated by trigger).   |
| `gdpr_consent_given_at` | `TIMESTAMPTZ` |                                              | Timestamp when GDPR consent was given.                |
| `gdpr_consent_details`  | `TEXT`        |                                              | Details of GDPR consent (e.g., version, scope).       |
**Foreign Keys**: `id` references `auth.users(id) ON DELETE CASCADE`.
**Encryption Note**: Personal details might be subject to further field-level encryption in a production environment if required beyond Supabase's standard protections.

### `test_questions`

Stores the diagnostic test questions. (Note: Currently, questions are primarily sourced from a JSON file in the frontend. This table might be for future reference or a more dynamic question system).

| Column          | Data Type     | Constraints                                  | Description                                               |
| :-------------- | :------------ | :------------------------------------------- | :-------------------------------------------------------- |
| `id`            | `UUID`        | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()`  | Unique identifier for the question.                       |
| `question_text` | `TEXT`        | `NOT NULL`                                   | The text of the question.                                 |
| `question_type` | `TEXT`        |                                              | Type of question (e.g., 'yes-no', 'multiple-choice').     |
| `options`       | `JSONB`       |                                              | JSON array of options for multiple-choice questions.      |
| `created_at`    | `TIMESTAMPTZ` | `DEFAULT now()`                              | Timestamp of question creation.                           |

### `test_sessions`

Represents a single instance of a user taking a diagnostic test.

| Column                         | Data Type     | Constraints                                  | Description                                               |
| :----------------------------- | :------------ | :------------------------------------------- | :-------------------------------------------------------- |
| `id`                           | `UUID`        | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()`  | Unique identifier for the test session.                   |
| `user_id`                      | `UUID`        | `NOT NULL`, `REFERENCES users(id)`           | The user who took the test.                               |
| `created_at`                   | `TIMESTAMPTZ` | `DEFAULT now()`                              | Timestamp when the session was started.                   |
| `completed_at`                 | `TIMESTAMPTZ` | `DEFAULT now()`                              | Timestamp when the test was completed/submitted.          |
| `raw_score_encrypted`          | `TEXT`        |                                              | Encrypted raw score or risk level (e.g., "alto", "medio").|
| `analysis_summary_encrypted` | `TEXT`        |                                              | Encrypted summary of the analysis (e.g., primary area, recommendations). |
**Encryption Note**: `raw_score_encrypted` and `analysis_summary_encrypted` are intended to store encrypted data.

### `test_answers`

Stores the user's answers for a specific test session.

| Column                   | Data Type     | Constraints                                  | Description                                               |
| :----------------------- | :------------ | :------------------------------------------- | :-------------------------------------------------------- |
| `id`                     | `UUID`        | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()`  | Unique identifier for the answer.                         |
| `session_id`             | `UUID`        | `NOT NULL`, `REFERENCES test_sessions(id)`   | The test session this answer belongs to.                  |
| `question_id`            | `TEXT`        | `NOT NULL`                                   | String identifier of the question (e.g., 'laboral_q1').   |
| `answer_value_encrypted` | `TEXT`        |                                              | Encrypted user's answer (could be simple value or JSON string for detailed answers). |
| `created_at`             | `TIMESTAMPTZ` | `DEFAULT now()`                              | Timestamp of answer creation.                             |
**Encryption Note**: `answer_value_encrypted` is intended to store encrypted data.

### `chat_sessions`

Represents a single chat session between a user and the AI.

| Column                               | Data Type     | Constraints                                  | Description                                               |
| :----------------------------------- | :------------ | :------------------------------------------- | :-------------------------------------------------------- |
| `id`                                 | `UUID`        | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()`  | Unique identifier for the chat session.                   |
| `user_id`                            | `UUID`        | `NOT NULL`, `REFERENCES users(id)`           | The user participating in the chat.                       |
| `diagnostic_test_session_id`       | `UUID`        | `REFERENCES test_sessions(id) ON DELETE SET NULL` | Optional link to a diagnostic test session.             |
| `initial_context_summary_encrypted`| `TEXT`        |                                              | Encrypted summary of initial context (e.g., from test).   |
| `created_at`                         | `TIMESTAMPTZ` | `DEFAULT now()`                              | Timestamp when the session started.                       |
| `ended_at`                           | `TIMESTAMPTZ` |                                              | Timestamp when the session ended (if applicable).         |
| `updated_at`                         | `TIMESTAMPTZ` | `DEFAULT now()`                              | Timestamp of last update (auto-updated by trigger).       |
**Encryption Note**: `initial_context_summary_encrypted` is intended to store encrypted data.

### `chat_messages`

Stores individual messages within a chat session.

| Column                        | Data Type     | Constraints                                  | Description                                               |
| :---------------------------- | :------------ | :------------------------------------------- | :-------------------------------------------------------- |
| `id`                          | `UUID`        | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()`  | Unique identifier for the message.                        |
| `session_id`                  | `UUID`        | `NOT NULL`, `REFERENCES chat_sessions(id)`   | The chat session this message belongs to.                 |
| `sender`                      | `TEXT`        | `NOT NULL`                                   | Who sent the message (e.g., 'user', 'ai', 'system').      |
| `message_content_encrypted`   | `TEXT`        | `NOT NULL`                                   | Encrypted content of the message.                         |
| `message_type`                | `TEXT`        | `NOT NULL`, `DEFAULT 'text'`                 | Type of message (e.g., 'text', 'document_suggestion').    |
| `related_entities_encrypted`  | `JSONB`       |                                              | Encrypted JSON object of related entities in the message. |
| `timestamp`                   | `TIMESTAMPTZ` | `DEFAULT now()`                              | Timestamp of when the message was sent/received.          |
| `updated_at`                  | `TIMESTAMPTZ` | `DEFAULT now()`                              | Timestamp of last update (auto-updated by trigger).       |
**Encryption Note**: `message_content_encrypted` and `related_entities_encrypted` are intended to store encrypted data.

### `documents`

Stores metadata about documents related to users (e.g., generated reports, user uploads).

| Column          | Data Type     | Constraints                                  | Description                                               |
| :-------------- | :------------ | :------------------------------------------- | :-------------------------------------------------------- |
| `id`            | `UUID`        | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()`  | Unique identifier for the document.                       |
| `user_id`       | `UUID`        | `NOT NULL`, `REFERENCES users(id)`           | The user this document belongs to.                        |
| `document_name` | `TEXT`        | `NOT NULL`                                   | Name of the document.                                     |
| `document_type` | `TEXT`        |                                              | Type of document (e.g., 'generated_report').            |
| `storage_path`  | `TEXT`        | `NOT NULL`                                   | Path to the document in Supabase Storage or other storage.|
| `file_size`     | `BIGINT`      |                                              | Size of the file in bytes.                                |
| `mime_type`     | `TEXT`        |                                              | MIME type of the file.                                    |
| `created_at`    | `TIMESTAMPTZ` | `DEFAULT now()`                              | Timestamp of document creation/upload.                    |
| `version`       | `INTEGER`     | `DEFAULT 1`                                  | Version number of the document.                           |

### `appointments`

Stores information about appointment requests made by users.

| Column                        | Data Type     | Constraints                                  | Description                                               |
| :---------------------------- | :------------ | :------------------------------------------- | :-------------------------------------------------------- |
| `id`                          | `UUID`        | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()`  | Unique identifier for the appointment.                    |
| `user_id`                     | `UUID`        | `NOT NULL`, `REFERENCES users(id)`           | The user requesting the appointment.                      |
| `requested_at`                | `TIMESTAMPTZ` | `DEFAULT now()`                              | Timestamp when the appointment was requested.             |
| `status`                      | `TEXT`        | `NOT NULL`, `DEFAULT 'pending'`              | Status of the appointment (e.g., 'pending', 'confirmed'). |
| `preferred_time_slot_start`   | `TIMESTAMPTZ` |                                              | Start of the user's preferred time slot.                  |
| `preferred_time_slot_end`     | `TIMESTAMPTZ` |                                              | End of the user's preferred time slot.                    |
| `notes_encrypted`             | `TEXT`        |                                              | Encrypted notes or reasons for the appointment.           |
| `updated_at`                  | `TIMESTAMPTZ` | `DEFAULT now()`                              | Timestamp of last update (auto-updated by trigger).       |
**Encryption Note**: `notes_encrypted` is intended to store encrypted data.

## JSON Structures

### `diagnosticQuestions.json`

This file, located at `frontend/src/data/diagnosticQuestions.json`, defines the structure and content of the diagnostic test.

*   **Root**: An object containing a single key `areas`.
*   **`areas` (Array)**: A list of legal area objects.
    *   **Area Object**:
        *   `id` (String): A unique identifier for the area (e.g., "laboral").
        *   `nombre` (String): The display name of the area (e.g., "Laboral").
        *   `preguntas` (Array): A list of question objects for this area.
            *   **Pregunta (Question) Object**:
                *   `id` (String): A unique identifier for the question (e.g., "laboral_q1").
                *   `texto` (String): The full text of the question.
                *   `tipo_respuesta` (String): The type of answer expected. Examples:
                    *   `"si_no"`: Simple Yes/No.
                    *   `"si_no_detalle"`: Yes/No with an optional text area for details if "Yes".
                    *   `"multiple_choice"`: User selects one from several options.
                    *   `"si_no_talvez"`: Yes/No/Not Sure (implemented via multiple choice options).
                *   `detalle_placeholder` (String, Optional): Placeholder text for the detail input field (used with `si_no_detalle`).
                *   `opciones` (Array, Optional): A list of option objects (used with `multiple_choice` and `si_no_talvez`).
                    *   **Opción (Option) Object**:
                        *   `valor` (String): The value stored when this option is selected.
                        *   `texto` (String): The display text for this option.I have already generated `README.md` (Turn 60) and created the `/docs` directory (Turn 61). I have also generated `/docs/data_structures.md` in the previous turn (Turn 62).

Now, I will create `/docs/services.md`.
