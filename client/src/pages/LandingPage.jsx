import { Link } from 'react-router-dom';
import {
  Code2,
  Users,
  MessageSquare,
  Zap,
  ShieldCheck,
  Play,
  ArrowRight,
  GitBranch,
  Terminal,
  Sparkles,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const FEATURES = [
  {
    icon: Users,
    title: 'Real-time collaboration',
    desc: 'Every keystroke syncs instantly across everyone in the room, powered by Socket.io.',
  },
  {
    icon: Code2,
    title: 'Multi-language editor',
    desc: 'Monaco-powered editing with syntax highlighting for JavaScript, Python, C++, and Java.',
  },
  {
    icon: Play,
    title: 'Instant code execution',
    desc: 'Run code on the spot and see stdout, stderr, and compile errors in a live console.',
  },
  {
    icon: MessageSquare,
    title: 'Built-in room chat',
    desc: 'Discuss approach and debug together without ever leaving the editor.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by default',
    desc: 'JWT auth, hashed passwords, and rate-limited APIs keep your rooms safe.',
  },
  {
    icon: Zap,
    title: 'Zero setup',
    desc: 'Create a room, share the ID, and start coding together in under 10 seconds.',
  },
];

const STEPS = [
  { title: 'Create a room', desc: 'Pick a language and spin up a fresh coding room with one click.' },
  { title: 'Share the room ID', desc: 'Send your unique room ID to teammates, students, or interview candidates.' },
  { title: 'Code together live', desc: 'Edit, run, and chat in real time — everyone sees the same code, instantly.' },
];

export default function LandingPage() {
  return (
    <MainLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-bg-border/60 px-6 pb-24 pt-20 sm:pt-28">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              'radial-gradient(600px circle at 20% 10%, rgba(94,234,212,0.12), transparent 60%), radial-gradient(500px circle at 85% 30%, rgba(139,92,246,0.12), transparent 60%)',
          }}
        />

        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-bg-border bg-bg-card px-4 py-1.5 text-xs text-slate-400 animate-fadeInUp">
            <Sparkles size={13} className="text-accent" />
            Real-time collaborative coding, reimagined
          </div>

          <h1 className="animate-fadeInUp font-display text-4xl font-bold leading-tight text-white sm:text-6xl" style={{ animationDelay: '0.05s' }}>
            Code together.
            <br />
            <span className="bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">
              In real time.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl animate-fadeInUp text-lg text-slate-400" style={{ animationDelay: '0.1s' }}>
            CodeSync is a shared coding room where your team writes, runs, and debugs code
            together — no clones, no screen sharing, no "can you paste that in Slack?"
          </p>

          <div className="mt-10 flex animate-fadeInUp flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: '0.15s' }}>
            <Link to="/register" className="btn-primary px-6 py-3 text-base">
              Start coding for free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary px-6 py-3 text-base">
              I have an account
            </Link>
          </div>
        </div>

        {/* Editor mockup */}
        <div className="mx-auto mt-16 max-w-4xl animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="card overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 border-b border-bg-border bg-bg-soft px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
              <span className="ml-3 font-mono text-xs text-slate-500">room-8F2K1Q9 — main.js</span>
              <div className="ml-auto flex -space-x-2">
                <div className="h-6 w-6 rounded-full border-2 border-bg-card bg-accent" />
                <div className="h-6 w-6 rounded-full border-2 border-bg-card bg-violet" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
              <pre className="col-span-2 overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-slate-300">
{`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1)
       + fibonacci(n - 2);
}

console.log(fibonacci(10));
// Vaishnavi is typing...`}
              </pre>
              <div className="border-t border-bg-border p-4 font-mono text-xs text-slate-500 sm:border-l sm:border-t-0">
                <p className="mb-2 flex items-center gap-1.5 text-slate-400">
                  <Terminal size={12} className="text-accent" /> Output
                </p>
                <p className="text-accent">55</p>
                <p className="mt-1 text-slate-600">Process exited (0)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS CODESYNC */}
      <section className="border-b border-bg-border/60 bg-bg-soft/40 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-semibold text-white">What is CodeSync?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            CodeSync is a lightweight, browser-based coding room. Think of it as a shared
            whiteboard — but for real code, with a real compiler behind it. Perfect for pair
            programming, technical interviews, teaching, or quick debugging sessions with a friend.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-semibold text-white">Everything you need to code together</h2>
            <p className="mt-3 text-slate-400">One room. Every tool your team needs.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6 transition hover:border-accent/40 hover:shadow-glow">
                <f.icon className="mb-4 text-accent" size={24} />
                <h3 className="font-semibold text-slate-100">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-bg-border/60 bg-bg-soft/40 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-semibold text-white">How it works</h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step, idx) => (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-bg-card font-display text-lg font-semibold text-accent">
                  {idx + 1}
                </div>
                <h3 className="font-semibold text-slate-100">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CODESYNC */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold text-white">Why teams choose CodeSync</h2>
            <ul className="mt-6 space-y-4">
              {[
                'No installs — works entirely in the browser',
                'True multi-user editing, not just cursor sharing',
                'Built-in compiler support for 4 languages out of the box',
                'Clean, distraction-free dark interface built for developers',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300">
                  <GitBranch size={16} className="mt-1 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-8">
            <p className="font-mono text-sm leading-relaxed text-slate-400">
              <span className="text-violet">// </span>Built for the moments that matter:
              <br />
              <span className="text-accent">01</span> pair programming sessions
              <br />
              <span className="text-accent">02</span> live technical interviews
              <br />
              <span className="text-accent">03</span> teaching a friend to code
              <br />
              <span className="text-accent">04</span> debugging together, remotely
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-bg-border/60 px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-accent/20 bg-gradient-to-br from-bg-card to-bg-soft p-10 text-center shadow-glow">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Ready to code together?
          </h2>
          <p className="mt-3 text-slate-400">Create your first room in under a minute. No credit card required.</p>
          <Link to="/register" className="btn-primary mt-6 px-6 py-3 text-base">
            Get started for free <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
