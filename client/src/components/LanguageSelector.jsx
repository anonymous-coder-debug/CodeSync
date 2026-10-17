import { LANGUAGE_LIST } from '../utils/languageConfig';

export default function LanguageSelector({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-bg-border bg-bg-soft px-3 py-1.5 text-sm text-slate-200 outline-none transition focus:border-accent/60 disabled:opacity-50"
    >
      {LANGUAGE_LIST.map((lang) => (
        <option key={lang.id} value={lang.id}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
