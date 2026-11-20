import { ChevronRight } from "lucide-react";

export default function SettingsSidebar({ sections, activeSection, onSelect }) {
  return (
    <nav className="h-fit rounded-2xl border border-[#b7d2bb] bg-[#f4faf1] p-2 shadow-lg">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = section.id === activeSection;
        return (
          <button type="button" key={section.id} onClick={() => onSelect(section.id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${isActive ? "bg-[#dcecdf] text-[#2f6b45]" : "text-[#547060] hover:bg-[#e8f3e8]"}`}>
            <Icon className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">{section.label}</span>
              <span className="mt-0.5 block truncate text-[11px] text-[#668170]">{section.description}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
          </button>
        );
      })}
    </nav>
  );
}
