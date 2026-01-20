import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// スキーマを定義
// - convex dashboard(ブラウザ)にリアルタイムに反映される

// index
// - index を作成しておくことで、データ取得/検索時に拘束に処理できる
// - 全てのデータを取得する
// - 第一引数: クライアントから呼び出すときに指定する、index の名前
// - 第二引数: フィルターやソートするときに使うフィールド

// searchIndex
// - 特定のフィールドから検索する
// - searchField: 検索するフィールド
// - filterFields: ここに指定したフィールドでフィルターした中から検索する

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    initialContent: v.optional(v.string()),
    ownerId: v.string(),
    // for collaboration
    roomId: v.optional(v.string()),
    // for authentication
    organizationId: v.optional(v.string()),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["ownerId", "organizationId"],
    }),
});
