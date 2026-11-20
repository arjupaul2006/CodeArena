import { SelectControl, SettingRow, Toggle } from "./SettingsControls";

const editorToggles = [
  ["wordWrap", "Word Wrap", "Wrap long lines in the editor"],
  ["minimap", "Minimap", "Show a code overview at the right"],
  ["lineNumbers", "Line Numbers", "Show line numbers beside code"],
  ["folding", "Code Folding", "Collapse blocks of code"],
  ["autoCompletion", "Auto Completion", "Suggest code while typing"],
  ["formatOnPaste", "Format On Paste", "Format pasted code automatically"],
  ["formatOnType", "Format On Type", "Format code while typing"],
  ["smoothScrolling", "Smooth Scrolling", "Animate editor scrolling"],
  ["fontLigatures", "Font Ligatures", "Use programming font ligatures"],
];

export default function EditorPreferences({ editorData, setEditorData }) {
  const updateEditor = (key, value) => {
    setEditorData((current) => ({ ...current, [key]: value }));
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Change Theme */}
        <SettingRow
          label="Editor Theme"
          description="Choose the editor color scheme"
        >
          <SelectControl
            value={editorData.theme || "vs-dark"}
            onChange={(value) => updateEditor("theme", value)}
            ariaLabel="Editor theme"
          >
            {["vs", "vs-dark", "hc-black", "hc-light"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </SelectControl>
        </SettingRow>

        {/* Change Font Family */}
        <SettingRow label="Font Family">
          <SelectControl
            value={editorData.fontFamily}
            onChange={(value) => updateEditor("fontFamily", value)}
            ariaLabel="Font family"
          >
            {["Consolas", "Fira Code", "JetBrains Mono"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </SelectControl>
        </SettingRow>

        {/* Change Font Size */}
        <SettingRow label="Font Size" description={`${editorData.fontSize}px`}>
          <input
            type="range"
            min="12"
            max="24"
            value={editorData.fontSize}
            onChange={(event) =>
              updateEditor("fontSize", Number(event.target.value))
            }
            aria-label="Font size"
            className="accent-[#3f7d55]"
          />
        </SettingRow>

        {/* Change Font Weight */}
        <SettingRow label="Font Weight">
          <SelectControl
            value={editorData.fontWeight}
            onChange={(value) => updateEditor("fontWeight", value)}
            ariaLabel="Font weight"
          >
            {["300", "400", "500", "600", "700"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectControl>
        </SettingRow>

        {/* Change Line Height */}
        <SettingRow
          label="Line Height"
          description={`${editorData.lineHeight}px`}
        >
          <input
            type="range"
            min="12"
            max="50"
            value={editorData.lineHeight}
            onChange={(event) =>
              updateEditor("lineHeight", Number(event.target.value))
            }
            aria-label="Line height"
            className="accent-[#3f7d55]"
          />
        </SettingRow>

        {/* Change Letter Spacing */}
        <SettingRow
          label="Letter Spacing"
          description={`${editorData.letterSpacing}px`}
        >
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={editorData.letterSpacing}
            onChange={(event) =>
              updateEditor("letterSpacing", Number(event.target.value))
            }
            aria-label="Letter spacing"
            className="accent-[#3f7d55]"
          />
        </SettingRow>

        {/* Change Tab Size */}
        <SettingRow label="Tab Size">
          <SelectControl
            value={editorData.tabSize}
            onChange={(value) => updateEditor("tabSize", Number(value))}
            ariaLabel="Tab size"
          >
            {[2, 4, 8].map((item) => (
              <option key={item} value={item}>
                {item} spaces
              </option>
            ))}
          </SelectControl>
        </SettingRow>

        {/* Change Auto Indent */}
        <SettingRow label="Auto Indent">
          <SelectControl
            value={editorData.autoIndent}
            onChange={(value) => updateEditor("autoIndent", value)}
            ariaLabel="Auto indent"
          >
            {["none", "keep", "brackets", "advanced", "full"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectControl>
        </SettingRow>

        {/* Change Auto Closing Brackets */}
        <SettingRow label="Auto Closing Brackets">
          <SelectControl
            value={editorData.autoClosingBrackets}
            onChange={(value) => updateEditor("autoClosingBrackets", value)}
            ariaLabel="Auto closing brackets"
          >
            {["always", "languageDefined", "beforeWhitespace", "never"].map(
              (item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ),
            )}
          </SelectControl>
        </SettingRow>

        {/* Change Match Brackets */}
        <SettingRow label="Match Brackets">
          <SelectControl
            value={editorData.matchBrackets}
            onChange={(value) => updateEditor("matchBrackets", value)}
            ariaLabel="Match brackets"
          >
            {["never", "near", "always"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectControl>
        </SettingRow>

        {/* Change Cursor Style */}
        <SettingRow label="Cursor Style">
          <SelectControl
            value={editorData.cursorStyle}
            onChange={(value) => updateEditor("cursorStyle", value)}
            ariaLabel="Cursor style"
          >
            {["line", "block", "underline"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectControl>
        </SettingRow>

        {/* Change Default Language */}
        <SettingRow label="Default Language">
          <SelectControl
            value={editorData.defaultLanguage}
            onChange={(value) => updateEditor("defaultLanguage", value)}
            ariaLabel="Default language"
          >
            {["C++", "Python", "Java", "JavaScript", "C"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </SelectControl>
        </SettingRow>
      </div>


      <div className="mt-3 divide-y divide-[#d5e7d7]">
        {editorToggles.map(([key, label, description]) => (
          <SettingRow key={key} label={label} description={description}>
            <Toggle
              checked={editorData[key]}
              onChange={(value) => updateEditor(key, value)}
              label={label}
            />
          </SettingRow>
        ))}
      </div>
    </div>
  );
}
