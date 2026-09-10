const Setting = require('../models/Setting');
const { readDb, writeDb } = require('../config/db');

// Get all system settings (including maintenance mode status)
exports.getSettings = async (req, res) => {
  try {
    let maintenanceMode = false;

    // 1. Try fetching from MongoDB if connected
    if (Setting.db && Setting.db.readyState === 1) {
      const settingDoc = await Setting.findOne({ key: 'maintenanceMode' }).lean();
      if (settingDoc !== null && settingDoc !== undefined) {
        maintenanceMode = Boolean(settingDoc.value);
      } else {
        const db = readDb();
        maintenanceMode = Boolean(db.settings?.maintenanceMode);
      }
    } else {
      // 2. Fallback to db.json
      const db = readDb();
      maintenanceMode = Boolean(db.settings?.maintenanceMode);
    }

    res.json({
      success: true,
      settings: {
        maintenanceMode,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching settings:', error.message);
    const db = readDb();
    res.json({
      success: true,
      settings: {
        maintenanceMode: Boolean(db.settings?.maintenanceMode),
      },
    });
  }
};

// Toggle or update Maintenance Mode status (Admin action)
exports.toggleMaintenanceMode = async (req, res) => {
  try {
    let newStatus;

    // Read current state
    const db = readDb();
    let currentMode = Boolean(db.settings?.maintenanceMode);

    if (Setting.db && Setting.db.readyState === 1) {
      const existing = await Setting.findOne({ key: 'maintenanceMode' });
      if (existing) {
        currentMode = Boolean(existing.value);
      }
    }

    // Determine target mode
    if (req.body.maintenanceMode !== undefined) {
      newStatus = Boolean(req.body.maintenanceMode);
    } else {
      newStatus = !currentMode;
    }

    // Update MongoDB
    if (Setting.db && Setting.db.readyState === 1) {
      await Setting.findOneAndUpdate(
        { key: 'maintenanceMode' },
        { key: 'maintenanceMode', value: newStatus },
        { upsert: true, returnDocument: 'after' }
      );
    }

    // Update db.json
    if (!db.settings) db.settings = {};
    db.settings.maintenanceMode = newStatus;
    writeDb(db);

    console.log(`🔧 [Maintenance Mode] Updated by Admin to: ${newStatus ? 'ON (Maintenance Enabled)' : 'OFF (Website Live)'}`);

    res.json({
      success: true,
      message: `Maintenance mode ${newStatus ? 'enabled' : 'disabled'} successfully`,
      settings: {
        maintenanceMode: newStatus,
      },
    });
  } catch (error) {
    console.error('❌ Error toggling maintenance mode:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update maintenance mode',
    });
  }
};
