import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { BsCloudCheck } from "react-icons/bs";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface DocumentInputProps {
  title: string;
  id: Id<"documents">;
}

export const DocumentInput = ({ title, id }: DocumentInputProps) => {
  const [value, setValue] = useState(title);
  const [isError, setIsError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const mutate = useMutation(api.documents.updateById);

  const debouncedUpdate = useDebounce((newValue: string) => {
    if (newValue === title) return;

    setIsPending(true);
    mutate({ id, title: newValue })
      .then(() => toast.success("Document updated"))
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsPending(false));
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // local の値は input の変更に追従して変更
    setValue(newValue);
    // DB(convex) 上のデータ変更は送らせて実行
    // - 1文字入力されるたびに DB に Update をかけないため
    debouncedUpdate(newValue);
  };

  // submit した場合は時間を置かず即時反映
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsPending(true);
    mutate({ id, title: value })
      .then(() => {
        toast.success("Document updated");
        setIsEditing(false);
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsPending(false));
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="relative w-fit max-w-[50ch]">
          <span className="invisible whitespace-pre px-1.5 text-lg">
            {value || " "}
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={() => setIsEditing(false)}
            className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate"
          />
        </form>
      ) : (
        <span
          onClick={() => {
            // 関数内の処理は非同期的に行われるため、すぐに focus すると input 要素がレンダリングされておらず失敗する
            // そのため、setTimeout を用いて少し時間をおいてから focus する
            setIsEditing(true);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
          className="text-lg px-1.5 cursor-pointer truncate"
        >
          {title}
        </span>
      )}
      <BsCloudCheck />
    </div>
  );
};
