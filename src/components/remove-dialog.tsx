"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface RemoveDialogProps {
  documentId: Id<"documents">;
  onPostProcess?: () => void;
  children: React.ReactNode;
}

// stopPropagation: 親要素へイベント実行が伝わらなくなる
// - 例) コンポーネントA にクリックイベントを設定している
//       コンポーネントB にクリックイベントを設定している
//       コンポーネントA の children に B を配置
//       B をクリックしたときに、A のクリックイベントが発火するのを避ける

export const RemoveDialog = ({
  documentId,
  onPostProcess,
  children,
}: RemoveDialogProps) => {
  const router = useRouter();
  const remove = useMutation(api.documents.removeById);
  const [isRemoving, setIsRemoving] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);

    // ダイアログが閉じられたとき、親のメニューも閉じる
    if (!newOpen) {
      onPostProcess?.();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This wikk permanently delete your
            document.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.stopPropagation();
              handleOpenChange(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isRemoving}
            onClick={(e) => {
              e.stopPropagation();
              setIsRemoving(true);

              // 削除直後にドキュメントID が DB に存在せずエラーページが表示されるのを回避するため、先に遷移
              router.push("/");

              remove({ id: documentId })
                .catch(() => toast.error("Something went wrong"))
                .then(() => toast.success("Document removed"))
                .finally(() => setIsRemoving(false));
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
