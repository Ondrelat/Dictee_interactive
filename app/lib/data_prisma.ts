'use server';

import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export async function getDictationById(id: string) {
  const debutDictee = performance.now();
  console.log("debut prisma dictee")
  try {
    const dictation = await prisma.dictation.findUnique({
      where: {
        id: id,
      },
    });

    const finDictee = performance.now();
    console.log("fin prisma dictee")
    console.log(finDictee - debutDictee)

    return dictation!;
  } catch (error) {
    console.error('Error fetching dictation:', error);
    throw new Error('Error fetching dictation');
  } finally {
    await prisma.$disconnect();
  }
}

export async function getRandomDictationByLevel(level: string) {
  const startTime = performance.now();
  console.log("Début de la requête Prisma pour obtenir une dictée aléatoire");

  try {
    const dictations = await prisma.dictation.findMany({
      where: {
        level: level,
      },
    });

    if (dictations.length === 0) {
      throw new Error(`Aucune dictée trouvée pour le niveau ${level}`);
    }

    const randomIndex = Math.floor(Math.random() * dictations.length);
    const randomDictation = dictations[randomIndex];

    const endTime = performance.now();
    console.log("Fin de la requête Prisma pour obtenir une dictée aléatoire");
    console.log(`Temps d'exécution : ${endTime - startTime} ms`);

    return randomDictation;
  } catch (error) {
    console.error('Erreur lors de la récupération d\'une dictée aléatoire :', error);
    throw new Error('Erreur lors de la récupération d\'une dictée aléatoire');
  } finally {
    await prisma.$disconnect();
  }
}

export async function getHelperbyWord(wordName: string) {
  if (!wordName) {
    throw new Error('wordName doit être une chaîne de caractères non vide.');
  }

  try {
    const helper = await prisma.helper.findFirst({
      where: {
        helper_word: {
          some: {
            word: {
              name: wordName,
            },
          },
        },
      },
      orderBy: {
        number_vote: 'desc',
      },
      include: {
        helper_word: {
          include: {
            word: true,
          },
        },
      },
    });

    return helper;
  } catch (error) {
    console.error(error);
    throw new Error('Une erreur s\'est produite');
  } finally {
    await prisma.$disconnect();
  }
}

export async function findHelperWordsWithHelper(wordName: string) {
    const wordNameMaj = wordName.toUpperCase();

    const helperWordsWithHelpers = await prisma.helper_word.findMany({
      where: {
        word: {
          name: wordNameMaj, // Utilisez le nom du mot pour filtrerr
        },
      },
      include: {
        word: true, // Inclure les détails du mot
        helper: {
          include: {
            description: true, // Inclure les descriptions du helper associé
          },
        },
      },
    });
    return helperWordsWithHelpers;
} 
