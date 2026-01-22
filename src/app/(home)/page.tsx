"use client";

import React from "react";
import { usePaginatedQuery } from "convex/react";
import { useSearchParam } from "@/hooks/use-search-param";
import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";
// convex によって自動生成された API エンドポイント
import { api } from "../../../convex/_generated/api";
import { DocumentsTable } from "./documents-table";

const Home = () => {
  const [search] = useSearchParam();

  // ページネーションありの get メソッド
  // - 第一引数: 実行する関数
  // - 第二引数: 関数に渡す引数
  // - 第三引数: ページネーションのオプション
  const { results, status, loadMore } = usePaginatedQuery(
    api.documents.get,
    { search },
    { initialNumItems: 5 }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplatesGallery />
        <DocumentsTable
          documents={results}
          loadMore={loadMore}
          status={status}
        />
      </div>
    </div>
  );
};

export default Home;
