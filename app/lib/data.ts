import { sql } from '@vercel/postgres';
import { Dictation } from './definitions';

export async function fetchDictationById(id: string) {
  const data = await sql<Dictation>

    try {
      const data = await sql<Dictation>`
        SELECT
          dictations.id,
          dictations.text,
          dictations.level,
          dictations.audiourl,
          dictations.audioname
        FROM dictations
        WHERE dictations.id = ${id};
      `;
      return data.rows[0];
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch invoice.');
    }
}