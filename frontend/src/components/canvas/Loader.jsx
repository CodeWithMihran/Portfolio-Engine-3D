import { Html, useProgress } from '@react-three/drei';

export default function CanvasLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-300/30 border-t-violet-300" />
        <p className="mt-4 text-sm font-semibold text-slate-100">{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}
