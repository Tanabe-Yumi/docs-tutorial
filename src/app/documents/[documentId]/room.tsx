"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullscreenLoader } from "@/components/fullscreen-loader";

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();

  return (
    <LiveblocksProvider
      throttle={16}
      // ドキュメントアクセス時の認証エンドポイントを指定（カスタム）
      // - 自身が所有 もしくは 所属組織 の場合のみ接続許可
      // - POST リクエスト、引数に ID
      authEndpoint="/api/liveblocks-auth"
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
