import { ChevronRight } from "lucide-react";

export default function SettingsSidebar({ sections, activeSection, onSelect }) {
  return (
    <nav className="h-fit rounded-2xl border border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] p-2 shadow-lg">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = section.id === activeSection;
        return (
          <button type="button" key={section.id} onClick={() => onSelect(section.id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${isActive ? "bg-[#dcecdf] dark:bg-[#24382b] text-[#2f6b45] dark:text-[#86c79a]" : "text-[#547060] dark:text-[#aabdaf] hover:bg-[#e8f3e8] dark:hover:bg-[#1a241d] dark:bg-[#111813]"}`}>
            <Icon className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">{section.label}</span>
              <span className="mt-0.5 block truncate text-[11px] text-[#668170] dark:text-[#aabdaf]">{section.description}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
          </button>
        );
      })}
    </nav>
  );
}
