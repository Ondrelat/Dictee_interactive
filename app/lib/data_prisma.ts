import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getDictationById(id: string) {
  try {
    const dictation = await prisma.dictation.findUnique({
      where: {
        id: id,
      },
    });

    return dictation!;
  } catch (error) {
    console.error('Error fetching dictation:', error);
    throw new Error('Error fetching dictation');
  } finally {
    await prisma.$disconnect();
  }
}