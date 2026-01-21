import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// データ取得関数 (API エンドポイント)
// - スキーマが変更されると、get メソッドの戻り値の型もリアルタイムに更新される
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});

// ドキュメント作成用メソッド
// 戻り値: insert data の id
export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.insert("documents", {
      title: args.title ?? "Untitled document",
      ownerId: user.subject,
      initialContent: args.initialContent,
    });
  },
});
