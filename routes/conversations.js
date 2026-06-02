import express from "express";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { isLoggedIn } from "../utils/isLoggedIn.js";

const router = express.Router();

router.get("/", isLoggedIn, async (req, res) => {
  const userId = req.user._id;

  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("participants", "username email")
    .populate("listing")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

  res.render("messages/inbox", { conversations, userId });
});

router.get("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const conversation = await Conversation.findById(id)
    .populate("participants", "username email")
    .populate("listing");

  if (!conversation) return res.status(404).send("Conversation not found");

  const other = conversation.participants.filter(
    (p) => p._id.toString() !== userId.toString()
  )[0];

  const messages = await Message.find({ conversation: id })
    .populate("sender", "username")
    .sort({ createdAt: 1 });

  res.render("messages/chat", {
    conversation,
    messages,
    userId,
    other,
  });
});

export default router;
