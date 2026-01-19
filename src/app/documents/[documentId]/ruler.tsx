import { useRef, useState } from "react";
import { MarsIcon } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { max } from "date-fns";

const markers = Array.from({ length: 83 }, (_, i) => i);
// -> [0, 1, 2, ..., 82]

export const Ruler = () => {
  const [leftMargin, setLeftMargin] = useState(56);
  const [rightMargin, setRightMargin] = useState(56);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  // useRef
  // - ref 属性に useRef コンポーネントを指定した HTML要素の、情報を取得することができる
  //   - 高さとか、横幅とか、値とか、文字列とか
  const rulerRef = useRef<HTMLDivElement>(null);

  const handleLeftMouseDown = () => {
    setIsDraggingLeft(true);
  };

  const handleRightMouseDown = () => {
    setIsDraggingRight(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const PAGE_WIDTH = 816;
    const MINIMUM_SPACE = 100;
    if ((isDraggingLeft || isDraggingRight) && rulerRef.current) {
      // rulerRef 配下の #ruler-container 要素を取得
      const container = rulerRef.current.querySelector("#ruler-container");
      if (container) {
        // #ruler-container 要素のサイズと、ビューポートに対する位置を取得
        // - bottom, height, left, rignt, top, width, x, y
        // - 実際にレンダリングされた後の値
        const containerRect = container.getBoundingClientRect();
        // ルーラー左端からマウスまでの距離（x軸）
        // - e.clientX: マウスの x座標
        // - containerRect.left: ブラウザ画面左端から、#ruler-container 左端までのピクセル数
        const relativeX = e.clientX - containerRect.left;
        // relativeX を正規化: ルーラーの横幅内での位置に変換
        // - ルーラーの右端より右なら一番右(PAGE_WIDTH)
        // - ルーラーの左端より左なら一番左(0)
        const rawPosition = Math.max(0, Math.min(PAGE_WIDTH, relativeX));

        if (isDraggingLeft) {
          // -rightMargin: 右のマーカーより右に行かないため
          // -MINIMUM_SPACE: 2つのマーカーの間に、最小でも MINIMUM_SPACE を開けるため
          const maxLeftMargin = PAGE_WIDTH - rightMargin - MINIMUM_SPACE;
          const newLeftMargin = Math.min(rawPosition, maxLeftMargin);
          setLeftMargin(newLeftMargin); // TODO: Make clollaborative (with other users)
        } else if (isDraggingRight) {
          const maxRightMargin = PAGE_WIDTH - leftMargin - MINIMUM_SPACE;
          const newRightMargin = Math.max(PAGE_WIDTH - rawPosition, 0);
          const constrainedRightMargin = Math.min(
            newRightMargin,
            maxRightMargin
          );
          setRightMargin(constrainedRightMargin); // TODO: Make clollaborative (with other users)
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
  };

  const handleLeftDoubleClick = () => {
    setLeftMargin(56);
  };

  const handleRightDoubleClick = () => {
    setRightMargin(56);
  };

  // div-1: rulerRef を設定
  // └ div-2: #ruler-container
  //   └ ▼Marker-left
  //   └ ▼Marker-right

  return (
    <div
      ref={rulerRef}
      onMouseMove={handleMouseMove}
      // マウスボタンが離されたとき
      onMouseUp={handleMouseUp}
      // マウスカーソルが要素外に出たとき
      onMouseLeave={handleMouseUp}
      className="w-[816px] mx-auto h-6 border-b border-gray-300 flex items-end relative select-none print:hidden"
    >
      <div id="ruler-container" className="w-full h-full relative">
        <Marker
          // editor のマージンに合わせる
          position={leftMargin}
          isLeft={true}
          isDragging={isDraggingLeft}
          onMouseDown={handleLeftMouseDown}
          onDoubleClick={handleLeftDoubleClick}
        />
        <Marker
          position={rightMargin}
          isLeft={false}
          isDragging={isDraggingRight}
          onMouseDown={handleRightMouseDown}
          onDoubleClick={handleRightDoubleClick}
        />
        <div className="absolute inset-x-0 bottom-0 h-full">
          <div className="relative h-full w-[816px]">
            {markers.map((marker) => {
              const position = (marker * 816) / 82;
              return (
                <div
                  key={marker}
                  className="absolute bottom-0"
                  style={{ left: `${position}px` }}
                >
                  {/* 10メモリごとに長い縦線と数字を入れる */}
                  {marker % 10 === 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500" />
                      <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                        {marker / 10 + 1}
                      </span>
                    </>
                  )}
                  {/* 5メモリごとに長い縦線を入れる */}
                  {marker % 5 === 0 && marker % 10 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500" />
                  )}
                  {/* 1メモリごとに短い縦線を入れる */}
                  {marker % 5 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MarkerProps {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({
  position,
  isLeft,
  isDragging,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => {
  return (
    <div
      className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
      style={{ [isLeft ? "left" : "right"]: `${position}px` }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
      <div
        className="absolute left-1/2 top-4 transform -translate-x-1/2"
        style={{
          height: "100vh",
          width: "1px",
          transform: "scaleX(0.5)",
          backgroundColor: "#3b72f6",
          display: isDragging ? "block" : "none",
        }}
      />
    </div>
  );
};
