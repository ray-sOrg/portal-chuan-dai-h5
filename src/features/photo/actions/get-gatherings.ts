'use server';

import { prisma } from '@/lib/prisma';
import type { GatheringOption } from '../types';

export async function getGatherings(): Promise<GatheringOption[]> {
  const gatherings = await prisma.gathering.findMany({
    orderBy: { date: 'desc' },
    select: {
      id: true,
      title: true,
      date: true,
    },
  });

  return gatherings;
}
