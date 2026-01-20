import { query } from "./_generated/server";

// データ取得関数 (API エンドポイント)
// - スキーマが変更されると、get メソッドの戻り値の型もリアルタイムに更新される
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});
