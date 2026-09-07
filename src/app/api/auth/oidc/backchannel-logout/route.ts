import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyLogoutToken } from "@/lib/oidc-logout";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    if (body.length > 32768) throw new Error('Oversized logout request');
    const token = new URLSearchParams(body).get('logout_token') ?? '';
    const claims = await verifyLogoutToken(token, process.env.OIDC_ISSUER ?? 'https://auth.tt829.cn/realms/tt829', process.env.OIDC_CLIENT_ID!);
    await prisma.session.deleteMany({where: {oidcSid: claims.sid, ...(claims.sub ? {user: {oidcSubject: claims.sub}} : {})}});
    return new NextResponse(null, {status: 200, headers: {'Cache-Control': 'no-store'}});
  } catch {
    return new NextResponse('Invalid logout token', {status: 400});
  }
}
