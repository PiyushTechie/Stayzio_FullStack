import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  ],
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  unreadCounts: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      count: { type: Number, default: 0 }
    }
  ]
}, { timestamps: true });

conversationSchema.index({ participants: 1, listing: 1 }, { unique: true });
conversationSchema.index({ participants: 1, updatedAt: -1 });

export default mongoose.model("Conversation", conversationSchema);
