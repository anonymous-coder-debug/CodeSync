import { Terminal, Loader2, AlertTriangle } from 'lucide-react';

export default function OutputConsole({ result, isRunning, error }) {
  return (
    <div className="flex h-full flex-col bg-[#0A0D12]">
      <div className="flex items-center gap-2 border-b border-bg-border px-4 py-2.5">
        <Terminal size={15} className="text-accent" />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Output</h3>
        {isRunning && <Loader2 size={13} className="ml-auto animate-spin text-accent" />}
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed">
        {isRunning && <p className="text-slate-500">Running your code...</p>}

        {!isRunning && error && (
          <div className="flex items-start gap-2 text-red-400">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!isRunning && !error && !result && (
          <p className="text-slate-600">Click "Run" to execute your code. Output will appear here.</p>
        )}

        {!isRunning && result && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="rounded bg-bg-card px-2 py-0.5">{result.status}</span>
              {result.time && <span>{result.time}s</span>}
              {result.memory && <span>{result.memory} KB</span>}
            </div>

            {result.compileOutput && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-amber-400">Compile output</p>
                <pre className="whitespace-pre-wrap text-amber-300/90">{result.compileOutput}</pre>
              </div>
            )}

            {result.stdout && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-slate-500">stdout</p>
                <pre className="whitespace-pre-wrap text-slate-200">{result.stdout}</pre>
              </div>
            )}

            {result.stderr && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-red-400">stderr</p>
                <pre className="whitespace-pre-wrap text-red-300/90">{result.stderr}</pre>
              </div>
            )}

            {!result.stdout && !result.stderr && !result.compileOutput && (
              <p className="text-slate-600">Program ran with no output.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
