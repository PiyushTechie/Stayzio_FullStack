import express from "express";
import Notification from "../models/Notification.js";
import { isLoggedIn } from "../utils/isLoggedIn.js";

const router = express.Router();

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.get("/unread-count", isLoggedIn, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user._id, read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
});

router.post("/mark-read", isLoggedIn, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

export default router;
