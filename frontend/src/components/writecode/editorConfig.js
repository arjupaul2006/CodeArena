
export const getEditorConfig = (settings) => {
  return {
    autoClosingBrackets: settings.autoClosingBrackets,
    autoIndent: settings.autoIndent,
    cursorStyle: settings.cursorStyle,

    folding: settings.folding,

    fontFamily: settings.fontFamily,
    fontLigatures: settings.fontLigatures,
    fontSize: settings.fontSize,
    fontWeight: settings.fontWeight,

    formatOnPaste: settings.formatOnPaste,
    formatOnType: settings.formatOnType,

    letterSpacing: settings.letterSpacing,
    lineHeight: settings.lineHeight,

    lineNumbers:
      settings.lineNumbers === "true" ||
      settings.lineNumbers === "on"
        ? "on"
        : "off",

    matchBrackets: settings.matchBrackets,

    minimap: {
      enabled: settings.minimap === true ||
               settings.minimap === "true"
    },

    smoothScrolling: settings.smoothScrolling,
    tabSize: settings.tabSize,

    wordWrap:
      settings.wordWrap === "true" ||
      settings.wordWrap === "on"
        ? "on"
        : "off"
  };
};

export const getEditorLanguage = (language) => {
  const languages = {
    "C++": "cpp",
    "C": "c",
    "Python": "python",
    "Java": "java",
    "JavaScript": "javascript"
  };

  return languages[language] || "cpp";
};
