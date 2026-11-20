const { default: UserSettings } = require("../model/settings");

module.exports.getAllSettings = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const settings = await UserSettings.findOne({ userId: user._id });
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.updateSettings = async (req, res) => {
  try {
    const user = req.user;
    const { preferences } = req.body;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const updatedSettings = await UserSettings.findOneAndUpdate(
      { userId: user._id },
      preferences,
      { new: true, upsert: true },
    );
    res.json(updatedSettings);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
