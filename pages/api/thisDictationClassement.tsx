import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface TopScore {
  id: string;
  score: number;
  pourcentage: number;
  correct_words: number;
  incorrect_words: number;
  userId: string;
  userName: string;
  user: {
    id: string;
    name: string;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { dictationId } = req.query;

  if (!dictationId || typeof dictationId !== 'string') {
    return res.status(400).json({ message: 'dictationId manquant ou de type invalide' });
  }

  try {
    const topScores: TopScore[] = await prisma.$queryRaw`
      SELECT 
        s.id, 
        COALESCE(s.score, 0) as score, 
        COALESCE(s.pourcentage, 0) as pourcentage, 
        COALESCE(s.timer, 0) as timer, 
        COALESCE(s.correct_words, 0) as correct_words, 
        COALESCE(s.incorrect_words, 0) as incorrect_words, 
        COALESCE(s.user_id, '') as "userId", 
        COALESCE(u.id, '') as "user.id", 
        COALESCE(u.name, 'Utilisateur inconnu') as "user.name"
      FROM "public"."score" s
      LEFT JOIN "public"."User" u ON s.user_id = u.id
      WHERE s.dictation_id = ${Prisma.sql`${dictationId}`}
      ORDER BY s.score DESC
      LIMIT 10;
    `;

    const uniqueTopScores = topScores.reduce((acc: TopScore[], current: TopScore) => {
      const userExists = acc.find((score) => score.userId === current.userId);
      if (!userExists) {
        acc.push(current);
      }
      return acc;
    }, []);

    res.status(200).json({ topScores: uniqueTopScores });
  } catch (error) {
    console.error('Error fetching top scores:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}