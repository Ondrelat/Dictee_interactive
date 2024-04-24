import { NextApiRequest, NextApiResponse } from 'next';
import { createScore } from '@/app/lib/data_prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { score, correct_words, incorrect_words, pourcentage, timer, userEmail, dictationId, note } = req.body;
  
      try {
        const createdScore = await createScore({
          score,
          correct_words,
          incorrect_words,
          pourcentage,
          timer,
          userEmail,
          dictationId,
          note,
        });
  
        res.status(200).json(createdScore);
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du score:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de l\'enregistrement du score.' });
      }
    } else {
      res.status(405).json({ error: 'Méthode non autorisée. Seule la méthode POST est acceptée.' });
    }
  }