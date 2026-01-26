# Collaborative Docs

Create documents collaboratively!  

Next.js、Tiptap、Liveblocks、Convexで構築された**リアルタイム共同編集ドキュメントエディタ**。  
ユーザーはドキュメントを作成、編集、共有でき、リアルタイムカーソルやコメント機能による共同編集を実現します。

## ローカルサーバー起動

```bash
# frontend
npm install
npm run dev

# backend
npx convex dev
```

正常な動作のためには、フロントエンドとバックエンドを並行して実行する必要があります。

## 使用技術

### フロントエンド

- 言語: TypeScript
- フレームワーク: Next.js 15 (App Router)
  - React 19
- スタイル: Tailwind CSS, Shadcn UI
- 認証: Clerk

### バックエンド

- 言語: TypeScript
- フレームワーク: Next.js 15 (App Router)
  - React 19
- データベース: Convex

### その他

- エディタ: Tiptap
- リアルタイム共同編集: Liveblocks
- 状態管理: Zustand
- バージョン管理: Git, GitHub
