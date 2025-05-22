// src/services/testService.js
import supabase from '../lib/supabaseClient'; // Adjust path as needed

const TEST_SESSIONS_TABLE = 'test_sessions';
const TEST_ANSWERS_TABLE = 'test_answers';
// Assuming test_questions table is populated separately or questions are identified by their string IDs from JSON

/**
 * Submits the diagnostic test results to Supabase.
 * @param {string} userId The ID of the user.
 * @param {object} answers - Raw answers from the user (e.g., { laboral_q1: { value: 'si', detail: '...' } }).
 * @param {object} analysisResults - Results from testAnalyzer.js
 *                                 (e.g., { primaryArea, riskLevel, recommendations, detailedScores }).
 * @param {object} questionsData - The full questions JSON for mapping question IDs.
 * @returns {Promise<{sessionId: string} | null>} The new test session ID or null on error.
 */
export const submitDiagnosticTest = async (userId, answers, analysisResults, questionsData) => {
  try {
    // TODO: Encryption for analysisResults.riskLevel (as raw_score_encrypted) and
    // analysisResults.recommendations + primaryArea (as analysis_summary_encrypted)
    // should be handled by a Supabase DB function (RPC) or server-side logic.
    // For now, we pass plaintext or a structured representation.
    const sessionPayload = {
      user_id: userId,
      raw_score_encrypted: analysisResults.riskLevel, // Example: storing risk level as score
      analysis_summary_encrypted: JSON.stringify({ // Example: storing rich summary
        primaryArea: analysisResults.primaryArea,
        recommendations: analysisResults.recommendations,
        // Potentially add overall score from analysisResults.detailedScores if needed
      }),
      // completed_at will be set by Supabase (default now()) or could be set here
    };

    const { data: sessionData, error: sessionError } = await supabase
      .from(TEST_SESSIONS_TABLE)
      .insert(sessionPayload)
      .select('id')
      .single();

    if (sessionError) throw sessionError;
    if (!sessionData || !sessionData.id) throw new Error('Failed to create test session.');

    const sessionId = sessionData.id;

    // Prepare answers for batch insert
    const answerInserts = [];
    for (const area of questionsData.areas) {
      for (const question of area.preguntas) {
        const questionId = question.id; // This is the string ID like 'laboral_q1'
        const answerObj = answers[questionId];

        if (answerObj) {
          // TODO: Encryption for answerObj.value and answerObj.detail (as answer_value_encrypted)
          // should be handled by a Supabase DB function (RPC) or server-side logic.
          // For now, we pass plaintext or stringified object.
          // The DB schema for test_answers has 'answer_value_encrypted' (TEXT) and 'question_id' (UUID).
          // Here, we are assuming 'question_id' in test_answers table will store the string ID from JSON
          // OR that a mapping mechanism exists if test_questions table uses UUIDs.
          // For simplicity now, let's assume test_answers.question_id can store the string id for now,
          // or we'd need to fetch/map to UUIDs from a DB `test_questions` table.
          // Storing as JSON string for now if it has value+detail.
          const answerToStore = typeof answerObj === 'object' ? JSON.stringify(answerObj) : String(answerObj.value !== undefined ? answerObj.value : answerObj);


          answerInserts.push({
            session_id: sessionId,
            question_id: questionId, // This is the string ID from JSON, e.g., "laboral_q1"
            answer_value_encrypted: answerToStore, // Mark for server-side encryption
          });
        }
      }
    }

    if (answerInserts.length > 0) {
      const { error: answersError } = await supabase
        .from(TEST_ANSWERS_TABLE)
        .insert(answerInserts);

      if (answersError) throw answersError;
    }

    return { sessionId };
  } catch (error) {
    console.error('Error submitting diagnostic test:', error.message);
    return null;
  }
};

/**
 * Retrieves past test session summaries for a user.
 * @param {string} userId The ID of the user.
 * @returns {Promise<Array<object> | null>} Array of test session objects or null on error.
 */
export const getTestResultsForUser = async (userId) => {
  try {
    // TODO: Decryption for raw_score_encrypted and analysis_summary_encrypted
    // should be handled by a Supabase DB function (RPC) or view.
    const { data, error } = await supabase
      .from(TEST_SESSIONS_TABLE)
      .select('id, created_at, raw_score_encrypted, analysis_summary_encrypted') // Select desired fields
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    // Simulate decryption for client-side if it were client-side encrypted
    return data?.map(session => {
      let analysis_summary = null;
      try {
        // Attempt to parse if it's a JSON string, otherwise use as is (or handle error)
        analysis_summary = session.analysis_summary_encrypted ? JSON.parse(session.analysis_summary_encrypted) : null;
      } catch (e) {
        console.warn('Failed to parse analysis_summary_encrypted for session:', session.id, e);
        analysis_summary = session.analysis_summary_encrypted; // Keep as string if not parsable
      }
      return {
        ...session,
        analysis_summary: analysis_summary, 
      };
    });
  } catch (error) {
    console.error('Error retrieving test results for user:', error.message);
    return null;
  }
};

/**
 * Retrieves detailed answers for a specific test session.
 * @param {string} testSessionId The ID of the test session.
 * @returns {Promise<Array<object> | null>} Array of answer objects or null on error.
 */
export const getTestDetails = async (testSessionId) => {
  try {
    // TODO: Decryption for answer_value_encrypted
    // should be handled by a Supabase DB function (RPC) or view.
    const { data, error } = await supabase
      .from(TEST_ANSWERS_TABLE)
      .select('question_id, answer_value_encrypted') // Select desired fields
      .eq('session_id', testSessionId);

    if (error) throw error;
    // Simulate decryption
     return data?.map(answer => {
        let answer_value = null;
        try {
            // Attempt to parse if it's a JSON string, otherwise use as is
            answer_value = answer.answer_value_encrypted ? JSON.parse(answer.answer_value_encrypted) : null;
        } catch (e) {
            // If not a JSON string, it might be a simple string like "si", "no", etc.
            answer_value = answer.answer_value_encrypted;
        }
        return {
         ...answer,
         answer_value: answer_value,
        };
     });
  } catch (error) {
    console.error('Error retrieving test details:', error.message);
    return null;
  }
};

export default {
  submitDiagnosticTest,
  getTestResultsForUser,
  getTestDetails,
};
