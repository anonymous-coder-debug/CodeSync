import { Code2, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-bg-border/60 bg-bg-soft/50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 font-display text-lg font-semibold text-white">
              <Code2 className="text-accent" size={20} />
              CodeSync
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Real-time collaborative coding rooms for teams, classrooms, and interviews.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="mb-3 text-sm font-semibold text-slate-200">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>Features</li>
                <li>How it works</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-slate-200">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>About</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-slate-200">Connect</h4>
              <div className="flex gap-3">
                <Github size={18} className="text-slate-500 transition hover:text-accent" />
                <Twitter size={18} className="text-slate-500 transition hover:text-accent" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-bg-border/60 pt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} CodeSync. Built by Vaibhav, Vaishnavi and the CodeSync team.
        </div>
      </div>
    </footer>
  );
}
