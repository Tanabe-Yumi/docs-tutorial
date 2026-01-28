"use server";

import { ConvexHttpClient } from "convex/browser";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getDocuments(ids: Id<"documents">[]) {
  return await convex.query(api.documents.getByIds, { ids });
}

export async function getUsers() {
  const { sessionClaims } = await auth();
  const clerk = await clerkClient();

  // Clerk の sessionClaims に組織情報が含まれる場合の型定義
  type SessionClaimsWithOrg = typeof sessionClaims & {
    o?: { id?: string };
  };
  // 同じ組織内のユーザーを全て取得
  const response = await clerk.users.getUserList({
    organizationId: [(sessionClaims as SessionClaimsWithOrg)?.o?.id as string],
  });

  const users = response.data.map((user) => ({
    id: user.id,
    // Google 認証でない場合(メール認証)は fullName が存在しないため、email を使用
    name:
      user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
    avatar: user.imageUrl,
    color: "",
  }));

  return users;
}
