import  {Pool}  from 'pg'


export const pool: Pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL!
});