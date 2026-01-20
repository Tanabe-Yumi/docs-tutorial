import { parseAsString, useQueryState } from "nuqs";

// nuqs: useQueryState
// - useState と同じ使い方ができる
//   - const [urlX, setUrlX] = useQueryState();
// - 変更すると、ブラウザの URL も変更される
// - 第一引数: クエリのキー
//   - ?key=value
//   - value は setUrlX(value) で設定（クライアント側）
// - clearOnDefault: true
//   - setUrlX() に falsy な値が渡されたとき、そのままクエリに入力せず
//     対象のクエリ部分を削除する
//     - `?key=`にならない
// オプションを毎回定義する手間をなくすため、またキー（第一引数）のスペルミスによるバグをなくすため、ラッパーを作成

export function useSearchParam() {
  return useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true })
  );
}
