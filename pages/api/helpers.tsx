import { NextApiRequest, NextApiResponse } from 'next';
import { findHelperWordsWithHelper } from '@/app/lib/data_prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Debut de la requete")
  if (req.method === 'GET') {
    
    const { query } = req.query;

    if (typeof query !== 'string') {
      res.status(400).json({ error: 'Le paramètre de requête "query" doit être une chaîne.' });
      return;
    }

    try {
      const helper = await findHelperWordsWithHelper(query);

      if (helper) {
        res.status(200).json(helper);
      } else {
        res.status(404).json({ error: 'Helper non trouvé.' });
      }
    } catch (error) {
      console.error('Erreur lors de la recherche du Helper:', error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la recherche du Helper.' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée. Seule la méthode GET est acceptée.' });
  }
}