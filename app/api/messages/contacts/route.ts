import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';
import { getCurrentUser } from '@/app/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const me = await getCurrentUser(req);
    if (!me) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    let where: any = {};

    if (me.role === 'ADMIN') {
      // admin can see everyone
      where = {};
    } else if (me.role === 'EMPLOYEE') {
      // employees can message clients and admins
      where = { role: { in: ['CLIENT', 'ADMIN'] } };
    } else if (me.role === 'CLIENT') {
      // clients can message employees and admins
      where = { role: { in: ['EMPLOYEE', 'ADMIN'] } };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        employee: { select: { name: true } },
        client: { select: { name: true } },
      },
      orderBy: { email: 'asc' },
    });

    return NextResponse.json({ message: 'Contacts', data: users }, { status: 200 });
  } catch (err) {
    console.error('[CONTACTS] -', err);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
