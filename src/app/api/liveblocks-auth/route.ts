import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

// room にアクセスする場合に実行
export async function POST(req: Request) {
  const { sessionClaims } = await auth();
  if (!sessionClaims) {
    return new Response("Unauthorized", { status: 401 });
  }
  const orgId = ((sessionClaims as any)?.o?.id ?? undefined) as
    | string
    | undefined;

  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // POST リクエスト時に自動で含まれる room 情報を参照
  const { room } = await req.json();

  // ドキュメントが見つからない場合、接続しない
  const document = await convex.query(api.documents.getById, { id: room });
  if (!document) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 所有者 もしくは 組織メンバー のどちらでもなければ接続しない
  const isOwner = document.ownerId === user.id;
  // - 組織のドキュメント かつ 組織ID が同じ
  // - !!(...) : 強制的に boolean に変換 (ダブルノット演算子)
  const isOrganizationMember = !!(
    document.organizationId && document.organizationId === orgId
  );
  if (!isOwner && !isOrganizationMember) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 接続
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name:
        user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
      avatar: user.imageUrl,
    },
  });
  session.allow(room, session.FULL_ACCESS);
  const { body, status } = await session.authorize();

  return new Response(body, { status });
}
