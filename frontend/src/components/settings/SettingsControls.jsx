export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-[#3f7d55]" : "bg-[#b7d2bb] dark:bg-[#405747]"}`}>
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white dark:bg-[#172019] shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

export function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-[#d5e7d7] dark:border-[#405747] py-4 last:border-b-0">
      <div>
        <p className="text-sm font-semibold text-[#244333] dark:text-[#edf4ef]">{label}</p>
        {description && <p className="mt-1 text-xs text-[#668170] dark:text-[#aabdaf]">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function SelectControl({ name, value, onChange, children, ariaLabel }) {
  return (
    <select name={name} value={value} onChange={(event) => onChange(event.target.value)} aria-label={ariaLabel} className="rounded-lg border border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] px-3 py-2 text-sm text-[#385a43] dark:text-[#aabdaf] outline-none focus:border-[#3f7d55] focus:ring-1 focus:ring-[#3f7d55]">
      {children}
    </select>
  );
}
