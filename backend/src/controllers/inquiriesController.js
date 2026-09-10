const { readDb, writeDb } = require('../config/db');
const { sendInquiryEmails, sendInquiryReplyEmail } = require('../services/emailService');

exports.getAllInquiries = (req, res) => {
  const db = readDb();
  res.json({ success: true, data: db.inquiries });
};

exports.submitInquiry = async (req, res) => {
  const db = readDb();
  const newInquiry = {
    id: `inq-${Date.now()}`,
    name: req.body.name || 'Anonymous Client',
    email: req.body.email || '',
    phone: req.body.phone || '',
    company: req.body.company || 'Direct Client',
    service: req.body.service || req.body.inquiryType || 'GENERAL INQUIRY',
    budget: req.body.budget || 'Flexible',
    subject: req.body.subject || req.body.inquiryType || 'New Web Project Request',
    message: req.body.message || '',
    date: new Date().toLocaleString(),
    status: 'Unread',
    priority: req.body.priority || 'High'
  };
  db.inquiries.unshift(newInquiry);
  writeDb(db);

  // Trigger async email dispatch (non-blocking for fast UI response)
  sendInquiryEmails(newInquiry).catch((err) => {
    console.warn('⚠️ Error sending inquiry email:', err.message);
  });

  res.status(201).json({ success: true, data: newInquiry, message: 'Inquiry submitted successfully and email notification dispatched!' });
};

exports.updateInquiryStatus = (req, res) => {
  const db = readDb();
  const index = db.inquiries.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }
  db.inquiries[index].status = req.body.status || db.inquiries[index].status;
  writeDb(db);
  res.json({ success: true, data: db.inquiries[index] });
};

exports.replyToInquiry = async (req, res) => {
  try {
    const db = readDb();
    const inquiry = db.inquiries.find((i) => i.id === req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    const { replyMessage, replySubject } = req.body;
    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ success: false, message: 'Reply message text is required' });
    }

    if (!inquiry.email || !inquiry.email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Invalid recipient email address on record' });
    }

    const result = await sendInquiryReplyEmail({
      to: inquiry.email,
      clientName: inquiry.name,
      originalSubject: inquiry.subject,
      replySubject: replySubject || `Re: ${inquiry.subject}`,
      replyMessage: replyMessage.trim()
    });

    inquiry.status = 'Replied';
    inquiry.lastRepliedAt = new Date().toISOString();
    writeDb(db);

    res.json({
      success: true,
      message: `Email reply successfully sent to ${inquiry.email}`,
      simulated: result.simulated || false,
      data: inquiry
    });
  } catch (err) {
    console.error('Failed to process inquiry email reply:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error dispatching email reply' });
  }
};

exports.deleteInquiry = (req, res) => {
  const db = readDb();
  db.inquiries = db.inquiries.filter((i) => i.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Inquiry record deleted' });
};

