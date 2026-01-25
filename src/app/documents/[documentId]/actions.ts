"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { use } from "react";

export async function getUsers() {
  const { sessionClaims } = await auth();
  const clerk = await clerkClient();

  // 同じ組織内のユーザーを全て取得
  const response = await clerk.users.getUserList({
    organizationId: [(sessionClaims as any)?.o?.id as string],
  });

  const users = response.data.map((user) => ({
    id: user.id,
    // Google 認証でない場合(メール認証)は fullName が存在しないため、email を使用
    name:
      user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
    avatar: user.imageUrl,
  }));

  return users;
}
