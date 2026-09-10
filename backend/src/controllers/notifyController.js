const { sendMaintenanceSubscribeEmail } = require('../services/emailService');
const { readDb, writeDb } = require('../config/db');

exports.subscribeNotify = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.',
      });
    }

    const cleanedEmail = email.trim().toLowerCase();

    // Store in local db.json subscriptions list
    const db = readDb();
    if (!db.subscriptions) db.subscriptions = [];

    const existing = db.subscriptions.find((s) => s.email === cleanedEmail);
    if (!existing) {
      db.subscriptions.unshift({
        id: `sub-${Date.now()}`,
        email: cleanedEmail,
        subscribedAt: new Date().toISOString(),
      });
      writeDb(db);
    }

    // Trigger Nodemailer email notification
    sendMaintenanceSubscribeEmail(cleanedEmail).catch((err) => {
      console.warn('⚠️ Error sending maintenance subscribe email:', err.message);
    });

    res.status(200).json({
      success: true,
      message: 'Subscribed successfully! You will be notified when WeProvision is back live.',
    });
  } catch (error) {
    console.error('❌ Error subscribing for notification:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Subscription failed',
    });
  }
};
