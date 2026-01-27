# Collaborative Docs

### リアルタイム共同編集ドキュメントエディタ

Next.js、Tiptap、Liveblocks、Convexで構築  
ユーザーはドキュメントを作成、編集、共有でき、リアルタイムカーソルやコメント機能による共同編集を実現  

Create documents collaboratively!  

![A8C132BE-C857-4CD0-B90F-56213BD16A8C](https://github.com/user-attachments/assets/8a930671-5c64-4012-bfaa-d96edc7f1a8d)

## サービスURL (Vercel)
https://collaborative-docs-rosy.vercel.app/

## ローカルサーバー起動

```bash
# frontend
npm run dev

# backend
npx convex dev
```

正常な動作のためには、フロントエンドとバックエンドを並行して実行する必要があります。

### 依存パッケージのインストール
```bash
npm install --legacy-peer-deps
```

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
- ホスティング: Vercel
