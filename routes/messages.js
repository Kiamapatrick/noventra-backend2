const express = require('express');
const router = express.Router();
const Message = require('../models/messages');

// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = new Message({ name, email, subject, message });
    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage);
  } catch (err) {
     console.error("Error saving message:", err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});
// GET /api/messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    console.log(messages.map(msg => msg.createdAt));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
});
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
//DELETE /api/messages
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

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
