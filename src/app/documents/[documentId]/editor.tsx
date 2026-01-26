"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useStorage } from "@liveblocks/react";

import { useEditorStore } from "@/store/use-editor-store";
import { FontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import { Ruler } from "./ruler";
import { Threads } from "./threads";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/constants/margins";

interface EditorProps {
  initialContent?: string | undefined;
}

export const Editor = ({ initialContent }: EditorProps) => {
  const liveBlocks = useLiveblocksExtension({
    initialContent,
    // ドキュメントを開いたときのコンテンツ読み込み速度向上
    offlineSupport_experimental: true,
  });
  const { setEditor } = useEditorStore();
  const leftMargin =
    useStorage((root) => root.leftMargin) ?? LEFT_MARGIN_DEFAULT;
  const rightMargin =
    useStorage((root) => root.rightMargin) ?? RIGHT_MARGIN_DEFAULT;

  const editor = useEditor({
    // tiptap editor のイベントリスナー
    // - イベント発生時に editor をストアに動悸させる
    // editor が最初に作られたとき
    onCreate({ editor }) {
      // editor-store(zustand) に保存され、useEditorStore を使ってどこからでもアクセスできる
      setEditor(editor);
    },
    // エディターが閉じられたとき
    onDestroy() {
      setEditor(null);
    },
    // content 更新時
    onUpdate({ editor }) {
      setEditor(editor);
    },
    // selection 更新時
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    // エディターの state 更新時
    onTransaction({ editor }) {
      setEditor(editor);
    },
    // エディターがフォーカスされたとき
    onFocus({ editor }) {
      setEditor(editor);
    },
    // エディターのフォーカスが外れたとき
    onBlur({ editor }) {
      setEditor(editor);
    },
    // content がスキーマにマッチしない
    onContentError({ editor }) {
      setEditor(editor);
    },
    editorProps: {
      attributes: {
        // Ruler コンポーネントで変更 → Liveblocks storage に保存 → Editor コンポーネントで取得し設定
        // 動的であり、Tailwind は使えないため style を設定
        style: `padding-left: ${leftMargin}px; padding-right: ${rightMargin}px;`,
        // Tiptap エディターの CSS 設定
        class:
          "focus:outline-none print:border-0 bg-white border border-[#c7c7c7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
    },
    extensions: [
      // for collaboration
      liveBlocks,
      StarterKit.configure({
        // Liveblocks の履歴を使用するため、tiptap の履歴は無効化
        history: false,
      }),
      LineHeightExtension.configure({
        type: ["heading", "paragraph"],
        defaultLineHeight: "normal",
      }),
      FontSizeExtension,
      FontFamily,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TaskItem.configure({
        nested: true,
      }),
      TaskList,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Table,
      TableCell,
      TableHeader,
      TableRow,
      Image,
      ImageResize,
    ],
    immediatelyRender: false,
  });

  return (
    <div className="size-full overflow-x-auto bg-[#f9fbfd] px-4 print:p-0 print:bg-white print:overflow-visible">
      <Ruler />
      {/* ↓背景 */}
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
        <Threads editor={editor} />
      </div>
    </div>
  );
};
