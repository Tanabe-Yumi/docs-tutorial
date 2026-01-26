"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Room } from "./room";
import { Toolbar } from "./toolbar";
import { api } from "../../../../convex/_generated/api";

interface DocumentProps {
  preloadedDocument: Preloaded<typeof api.documents.getById>;
}

export const Document = ({ preloadedDocument }: DocumentProps) => {
  // props でドキュメント情報を受け取っているが、自分または他の誰かに更新された場合に反映するため、convex に接続し取得する
  // - 初期値はサーバーコンポーネントで高速に取得し、その後はクライアントコンポーネントで随時更新する
  const document = usePreloadedQuery(preloadedDocument);

  return (
    <Room>
      <div className="min-h-screen bg-[#fafbfd]">
        <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#fafbfd] print:hidden">
          <Navbar data={document} />
          <Toolbar />
        </div>
        <div className="pt-[114px] print:pt-0">
          {/* Liveblock Room */}
          <Editor initialContent={document.initialContent} />
        </div>
      </div>
    </Room>
  );
};
