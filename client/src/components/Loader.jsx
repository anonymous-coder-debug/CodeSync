import { Loader2 } from 'lucide-react';

export default function Loader({ label = 'Loading...', size = 20, fullScreen = false }) {
  const content = (
    <div className="flex items-center justify-center gap-2 text-slate-400">
      <Loader2 size={size} className="animate-spin text-accent" />
      <span className="text-sm">{label}</span>
    </div>
  );

  if (fullScreen) {
    return <div className="flex min-h-[60vh] w-full items-center justify-center">{content}</div>;
  }

  return content;
}
