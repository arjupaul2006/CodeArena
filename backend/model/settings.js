import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // 1. ACCOUNT SETTINGS
    account: {
      username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      profileImage: {
        type: String,
        default: "", 
      }
    },

    // 2. EDITOR PREFERENCES
    editor: {
      theme: {
        type: String,
        enum: ["vs-dark", "vs", "hc-black", "hc-light"],
        default: "vs-dark",
      },

      fontFamily: {
        type: String,
        default: "Fira Code",
      },

      fontSize: {
        type: Number,
        min: 12,
        max: 24,
        default: 16,
      },

      fontWeight: {
        type: String,
        enum: ["300", "400", "500", "600", "700"],
        default: "400",
      },

      lineHeight: {
        type: Number,
        min: 0,
        max: 50,
        default: 24,
      },

      letterSpacing: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },

      tabSize: {
        type: Number,
        enum: [2, 4, 8],
        default: 4,
      },

      wordWrap: {
        type: String,
        enum: ["on", "off", "wordWrapColumn", "bounded"],
        default: "off",
      },

      minimap: {
        type: Boolean,
        default: false,
      },

      lineNumbers: {
        type: String,
        enum: ["on", "off", "relative", "interval"],
        default: "on",
      },

      folding: {
        type: Boolean,
        default: true,
      },

      autoIndent: {
        type: String,
        enum: ["none", "keep", "brackets", "advanced", "full"],
        default: "full",
      },

      autoClosingBrackets: {
        type: String,
        enum: ["always", "languageDefined", "beforeWhitespace", "never"],
        default: "always",
      },

      formatOnPaste: {
        type: Boolean,
        default: true,
      },

      formatOnType: {
        type: Boolean,
        default: false,
      },

      matchBrackets: {
        type: String,
        enum: ["never", "near", "always"],
        default: "always",
      },

      cursorStyle: {
        type: String,
        enum: ["line", "block", "underline"],
        default: "line",
      },

      smoothScrolling: {
        type: Boolean,
        default: true,
      },

      fontLigatures: {
        type: Boolean,
        default: true,
      },

      defaultLanguage: {
        type: String,
        enum: ["cpp", "c", "python", "java", "javascript"],
        default: "cpp",
      },
    },

    // 3. APPEARANCE SETTINGS
    appearance: {
      theme: {
        type: String,
        enum: ["dark", "light", "system"],
        default: "dark",
      },

      accentColor: {
        type: String,
        enum: ["green", "blue", "purple", "orange"],
        default: "green",
      },

      density: {
        type: String,
        enum: ["comfortable", "compact"],
        default: "comfortable",
      },

      sidebarCollapsed: {
        type: Boolean,
        default: false,
      },

      animations: {
        type: Boolean,
        default: true,
      },
    },

    // 4. NOTIFICATION SETTINGS
    notifications: {
      contestReminders: {
        type: Boolean,
        default: true,
      },

      contestAnnouncements: {
        type: Boolean,
        default: true,
      },

      contestResults: {
        type: Boolean,
        default: true,
      },

      leaderboardUpdates: {
        type: Boolean,
        default: false,
      },

      newProblems: {
        type: Boolean,
        default: true,
      },

      platformAnnouncements: {
        type: Boolean,
        default: true,
      },

      securityAlerts: {
        type: Boolean,
        default: true,
      },

      weeklyProgressReport: {
        type: Boolean,
        default: false,
      },

      productUpdates: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
    collection: "settings",
  },
);

const UserSettings = mongoose.model("UserSettings", userSettingsSchema);

export default UserSettings;
