const express = require('express');
const router = express.Router();
const Message = require('../models/messages');
const nodemailer = require('nodemailer');

// ✉️ Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS  // your app password
  }
});

// 📨 POST /api/messages
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 1️⃣ Save message to DB
    const newMessage = new Message({ name, email, subject, message });
    const savedMessage = await newMessage.save();

    // 2️⃣ Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // your own address, or multiple if needed
      subject: `New message from ${name}: ${subject}`,
      text: `
You received a new message from your website contact form:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Sent at: ${new Date().toLocaleString()}
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');

    // 3️⃣ Respond to frontend
    res.status(201).json(savedMessage);

  } catch (err) {
    console.error("❌ Error saving or emailing message:", err);
    res.status(500).json({ error: 'Failed to save or email message' });
  }
});

// 🧾 GET /api/messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// ✅ PUT /api/messages/:id/read
router.put('/messages/:id/read', async (req, res) => {
  try {
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
});

// ❌ DELETE /api/messages/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Duplicate PUT fixed — this one is fine
router.put("/:id/read", async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json({ success: true, message });
  } catch (err) {
    console.error("Error marking as read:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
