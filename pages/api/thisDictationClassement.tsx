import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

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
      SELECT s.id, s.score, s.pourcentage, s.timer, s.correct_words, s.incorrect_words, s.user_id AS "userId", u.id AS "user.id", u.name AS "user.name"
      FROM "public"."score" s
      JOIN "public"."User" u ON s.user_id = u.id
      WHERE s.dictation_id = ${dictationId}
      ORDER BY s.score DESC
      LIMIT 10;
    `;

    console.log(topScores)

    const uniqueTopScores = topScores.reduce((acc: TopScore[], current: TopScore) => {
      const userExists = acc.find((score) => score.userId === current.userId);
      if (!userExists) {
        acc.push(current);
      }
      return acc;
    }, []);

    res.status(200).json({ topScores: uniqueTopScores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
  
}