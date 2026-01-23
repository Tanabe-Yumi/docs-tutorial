"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getUsers } from "./actions";

type User = { id: string; name: string; avatar: string };

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();
  const [users, setUsers] = useState<User[]>([]);

  // useMemo
  // - 再レンダリングのたびに fetchUsers 関数が生成されるのを防ぐ
  // - 依存配列の値に変更があったときに fetchUsers を実行する
  //   - ※関数の生成と実行は異なる
  // - useEffect の依存配列に入れたい場合、レンダリングのたびに関数が再生成されると依存先が変わり
  //   結局 useEffect の処理が実行されてしまうため useMemo でメモ化する
  //   - 再レンダリングのたびに getUsers() しないため
  //   - useCallback とどちらが良い??

  const fetchUsers = useMemo(
    () => async () => {
      try {
        const list = await getUsers();
        setUsers(list);
      } catch {
        toast.error("Failed to fetch users");
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <LiveblocksProvider
      throttle={16}
      // ドキュメントアクセス時の認証エンドポイントを指定（カスタム）
      // - 自身が所有 もしくは 所属組織 の場合のみ接続許可
      // - POST リクエスト、引数に ID
      authEndpoint="/api/liveblocks-auth"
      // コメント、エディタ、通知のユーザー情報を解決
      // - users: 同じ組織の全ユーザー
      // - userIds: ルーム(ドキュメント)にアクセスしたことがあるユーザー?
      resolveUsers={({ userIds }) => {
        return userIds.map(
          (userId) => users.find((user) => user.id === userId) ?? undefined
        );
      }}
      // メンション提案を解決 (@xxx)
      // - 組織内のユーザーの名前のうち、入力文字列を含むユーザーだけ返す
      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;

        if (text) {
          filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase())
          );
        }

        return filteredUsers.map((user) => user.id);
      }}
      resolveRoomsInfo={() => []}
    >
      {/* roomID = documentID */}
      <RoomProvider id={params.documentId as string}>
        <ClientSideSuspense
          fallback={<FullscreenLoader label="Room loading..." />}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
