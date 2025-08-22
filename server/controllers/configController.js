const Config = require("../models/Config");

const getConfig = async (req, res) => {
  try {
    // Find one config, or create a default one if none exists.
    let config = await Config.findOne();
    if (!config) {
      config = await new Config().save();
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateConfig = async (req, res) => {
  const { autoCloseEnabled, confidenceThreshold, slaHours } = req.body;
  try {
    let config = await Config.findOne();

    if (config) {
      config.autoCloseEnabled = autoCloseEnabled ?? config.autoCloseEnabled;
      config.confidenceThreshold =
        confidenceThreshold ?? config.confidenceThreshold;
      config.slaHours = slaHours ?? config.slaHours;
      const updatedConfig = await config.save();
      res.json(updatedConfig);
    } else {
      // If no config exists, create one with the provided settings.
      const newConfig = await new Config({
        autoCloseEnabled,
        confidenceThreshold,
        slaHours,
      }).save();
      res.status(201).json(newConfig);
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getConfig, updateConfig };
