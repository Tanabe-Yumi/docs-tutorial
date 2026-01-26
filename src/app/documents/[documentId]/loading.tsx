import { FullscreenLoader } from "@/components/fullscreen-loader";

// このディレクトリ配下で await 待ち中に表示

const LoadingPage = () => {
  return <FullscreenLoader label="Document loading..." />;
};

export default LoadingPage;
