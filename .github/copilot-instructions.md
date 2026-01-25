# Docs Tutorial - AI Agent Instructions

## プロジェクト概要

Next.js、Tiptap、Liveblocks、Convexで構築された**リアルタイム協調編集ドキュメントエディタ**。ユーザーはドキュメントを作成、編集、共有でき、リアルタイムカーソルやコメント機能による協調編集を実現します。

## アーキテクチャ

### 3層構成

**フロントエンド**: Next.js 15 + React 19

- 場所: `src/app` と `src/components`
- サーバーレンダリング: App Routerで `(home)` と `documents/[documentId]` ルートグループに対応
- 認証: `src/middleware.ts` に配置されたミドルウェアを使用したClerk認証

**バックエンド**: Convex（サーバーレスデータベース + API）

- 場所: `convex/` ディレクトリ
- `convex/schema.ts` のスキーマが `documents` テーブルをオーナー/組織分離で定義
- `convex/documents.ts` の関数がクエリ/ミューテーション（`get`, `getById`, `create`）をエクスポート
- `convex/auth.config.ts` の認証設定がClerkプロバイダを統合

**リアルタイム協調編集**: Liveblocks

- Room ID = Document ID（ドキュメント単位の協調編集を有効化）
- `src/app/api/liveblocks-auth/route.ts` 経由の認証検証（ドキュメント所有権または組織メンバー資格を確認）
- `@liveblocks/react-tiptap` 拡張機能を経由してTiptapエディタと統合

### データフロー

1. ユーザーがログイン → Clerk → middleware.ts → ConvexClientProvider（統合認証）
2. ホームページが `documents.get` をページネーション/検索付きでクエリ
3. ドキュメント編集ページがLiveblocks付きRoomプロバイダをセットアップ
4. Tiptapエディタが協調編集拡張機能で初期化
5. 編集内容がLiveblocks経由で同期 → Convexに保存
6. 複数ユーザーがリアルタイム更新を確認（カーソル、コンテンツ変更）

### 主要な統合ポイント

- **Clerk → Convex**: Clerkテンプレート経由でJWTに `organization_id` を追加（`documents.ts` のコメント参照）
- **Liveblocks → Convex**: 認証エンドポイントがルーム接続前にドキュメントアクセスを検証
- **状態管理**: Zustandストア（`use-editor-store.ts`）がTiptapエディタをグローバルに公開

## 開発ワークフロー

### スクリプト

```bash
npm run dev         # Next.js開発サーバー起動（ポート3000）
npx convex dev      # Convexバックエンド起動（スキーマ同期、リアルタイム同期有効化）
npm run build       # 本番ビルド
npm run lint        # ESLint チェック
```

完全な機能のためには、フロントエンドとバックエンドを並行して実行する必要があります。

### スキーマ & データベース

- `convex/schema.ts` を変更 → `npx convex dev` を実行 → マイグレーションが自動で適用
- Convexは `convex/_generated/api.d.ts` のTypeScriptタイプを自動生成
- スキーマ内の検索インデックスが `documents.title` の全文検索を有効化

## コード規約

### コンポーネント構造

- `src/app/(home)/` → ドキュメント一覧/作成UI
- `src/app/documents/[documentId]/` → エディタページ
  - `room.tsx` がLiveblocks プロバイダでチルドレンをラップ
  - `editor.tsx` が拡張機能付きTiptapインスタンスを設定
  - `page.tsx` がRoom + Editor + Toolbar + Threads を構成
  - カスタムTiptap拡張機能は `src/extensions/` に配置（FontSizeExtension、LineHeightExtension）

### スタイリング

- レイアウト用に `globals.css` 内のTailwind CSS
- UIキット用にRadix UIコンポーネント（ボタン、ダイアログ、メニュー等）
- Tailwindクラス適用が機能しない場合はインライン `style` 小道具で動的スタイル指定（例：`editor.tsx` のエディタパディング）

### 状態管理

- **グローバルエディタ状態**: Zustandストア `useEditorStore()` がTiptapエディタインスタンスを保有
  - すべてのTiptapイベント（onCreate、onUpdate、onSelectionUpdate等）で同期
  - ツールバー/スレッドコンポーネントがドキュメントコンテンツのクエリ/変更に使用
- **UI状態**: React フック（useState）でローカルUI（モーダル、ローディング等）を管理
- **リモート状態**: Convexクエリがデータ変更時に自動で再レンダリング

### 認証 & 認可

- Clerk JWTが `ConvexProviderWithClerk` ラッパー経由でConvexに送信
- ドキュメントアクセス: 所有者 OR 組織メンバー
- ルームアクセス: Liveblocks接続前に認証エンドポイントで検証
- 組織IDは `sessionClaims.o.id` から抽出（カスタムJWTクレーム）

## 主要ファイルリファレンス

| ファイル                                    | 目的                                                               |
| ------------------------------------------- | ------------------------------------------------------------------ |
| `convex/schema.ts`                          | 検索インデックス付きのデータベーススキーマ                         |
| `convex/documents.ts`                       | クエリ/ミューテーションAPI（get、getById、create、update、delete） |
| `src/app/api/liveblocks-auth/route.ts`      | Liveblocksアクセス制御                                             |
| `src/store/use-editor-store.ts`             | グローバルTiptapエディタ状態                                       |
| `src/app/documents/[documentId]/editor.tsx` | Tiptap設定 + 拡張機能                                              |
| `src/app/documents/[documentId]/room.tsx`   | Liveblocksプロバイダセットアップ                                   |
| `src/components/convex-client-provider.tsx` | Clerk + Convex認証ラッパー                                         |

## よくあるタスク

**新規ドキュメントフィールド追加**: `schema.ts` のインデックス定義を更新 → `documents.ts` のミューテーションに追加 → `npx convex dev` を再起動

**Tiptap拡張機能追加**: `src/extensions/` にファイル作成 → `editor.tsx` にインポート → `extensions` 配列で設定

**ツールバー修正**: `useEditorStore()` 経由でエディタインスタンスが利用可能 → エディタメソッド（bold、setFont等）を呼び出し

**協調編集機能追加**: Rootプロバイダ内のコンポーネントで Liveblocks フック（`useMutation`、`useStorage`、`useBroadcastEvent`）を使用

## 注釈

- コード全体に日本語コメントが推論内容を説明（「// 」を検索して確認可能）
- Liveblocks型は `liveblocks.config.ts` で部分的に定義（Presence、Storageは現在空→必要に応じて追加）
- 検索はConvexの全文インデックスを使用し、オーナー/組織でフィルタリング
- コンポーネントがConvexフックまたはLiveblocks コンテキストを使用する場合、リアルタイム更新は自動的に機能
