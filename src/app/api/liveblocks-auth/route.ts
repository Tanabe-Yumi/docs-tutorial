import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

const colors = [
  "#4285f4",
  "#ea4335",
  "#fbbc04",
  "#34a853",
  "#ff6d01",
  "#46bdc6",
  "#87ceeb",
  "#8dcf9b",
  "#b400ff",
  "#6c3e1c",
  "#78909c",
  "#2f2f2f",
];

// room にアクセスする場合に実行
export async function POST(req: Request) {
  const { sessionClaims } = await auth();
  if (!sessionClaims) {
    return new Response("Unauthorized", { status: 401 });
  }
  // Clerk の sessionClaims に組織情報が含まれる場合の型定義
  type SessionClaimsWithOrg = typeof sessionClaims & {
    o?: { id?: string };
  };
  const orgId = ((sessionClaims as SessionClaimsWithOrg)?.o?.id ??
    undefined) as string | undefined;

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

  // 名前を数字に変換し、個別の色を作成 (→ 共同編集中のカーソル位置を示すカラー)
  const name =
    user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous";
  const nameToNumber = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = Math.abs(nameToNumber) % colors.length;

  // 接続
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: name,
      avatar: user.imageUrl,
      color: colors[index],
    },
  });
  session.allow(room, session.FULL_ACCESS);
  const { body, status } = await session.authorize();

  return new Response(body, { status });
}
