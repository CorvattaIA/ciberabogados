// src/lib/supabaseClient.js
// Real implementation would use createClient from '@supabase/supabase-js'
// For now, this is a mock for chatService.js to run without erroring on import.
console.log('Mock Supabase client loaded. Replace with actual Supabase client.');

const mockSupabase = {
  from: (tableName) => ({
    insert: (records) => {
      console.log(`Mock Supabase: INSERT into ${tableName}`, records);
      // Simulate Supabase returning the inserted record, possibly with an ID
      const recordWithId = Array.isArray(records) ? records.map(r => ({ id: 'mock-uuid-' + Math.random().toString(36).substr(2, 9), ...r })) : { id: 'mock-uuid-' + Math.random().toString(36).substr(2, 9), ...records };
      return { 
        select: () => ({ 
          single: () => Promise.resolve({ data: Array.isArray(recordWithId) ? recordWithId[0] : recordWithId, error: null}) 
        }) 
      };
    },
    select: (columns = '*') => {
      console.log(`Mock Supabase: SELECT ${columns} from ${tableName}`);
      return {
        eq: (column, value) => {
          console.log(`Mock Supabase: WHERE ${column} = ${value}`);
          return {
            order: () => Promise.resolve({ data: [], error: null }), // Default empty for lists
            single: () => Promise.resolve({ data: {}, error: null }) // Default empty for single
          };
        },
        single: () => Promise.resolve({ data: {}, error: null }) // Default empty for single direct select
      };
    },
  }),
  // Add other Supabase methods or auth mock if needed by other services later
};

export default mockSupabase;
