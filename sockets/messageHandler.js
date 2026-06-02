import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";

export default function (io) {

  io.on("connection", (socket) => {
    const user = socket.request.user;

    if (!user) {
      socket.disconnect(true);
      return;
    }

    const checkAuth = async (conversationId) => {
      try {
        const conv = await Conversation.findById(conversationId);
        if (!conv) return null;
        const isParticipant = conv.participants.some((p) => p.toString() === user._id.toString());
        return isParticipant ? conv : null;
      } catch (err) {
        return null;
      }
    };

    socket.on("joinConversation", async ({ conversationId }) => {
      const conv = await checkAuth(conversationId);
      if (!conv) return;
      socket.join(conversationId);
    });

    socket.on("sendMessage", async ({ conversationId, text }) => {
      if (!text || !conversationId) return;

      try {
        const conv = await checkAuth(conversationId);
        if (!conv) return;

        const msg = await Message.create({
          conversation: conversationId,
          sender: user._id,
          text,
        });

        conv.lastMessage = msg._id;

        conv.participants.forEach(async (id) => {
          if (id.toString() !== user._id.toString()) {
            const existing = conv.unreadCounts.find((u) => u.user.toString() === id.toString());
            if (existing) existing.count += 1;
            else conv.unreadCounts.push({ user: id, count: 1 });

            const recentNotif = await Notification.findOne({ user: id, link: `/conversations/${conversationId}`, read: false });
            if (!recentNotif) {
              await Notification.create({
                user: id,
                type: "new_message",
                title: "New Message",
                message: `You have a new message from ${user.username}`,
                link: `/conversations/${conversationId}`
              });
            }
          }
        });

        await conv.save();

        const populatedMsg = await Message.findById(msg._id)
          .populate("sender", "username")
          .lean();

        io.to(conversationId).emit("newMessage", {
          ...populatedMsg,
          conversation: conversationId,
        });

        socket.to(conversationId).emit("delivered", {
          conversationId,
          messageId: msg._id,
        });

      } catch (err) {
        console.error("sendMessage error:", err);
      }
    });

    socket.on("typing", async ({ conversationId, userId }) => {
      const conv = await checkAuth(conversationId);
      if (!conv) return;
      socket.to(conversationId).emit("typing", { userId });
    });

    socket.on("stopTyping", async ({ conversationId, userId }) => {
      const conv = await checkAuth(conversationId);
      if (!conv) return;
      socket.to(conversationId).emit("stopTyping", { userId });
    });

    socket.on("clearChat", async ({ conversationId }) => {
      const conv = await checkAuth(conversationId);
      if (!conv) return;
      await Message.deleteMany({ conversation: conversationId });
      io.to(conversationId).emit("chatCleared");
    });

    socket.on("markRead", async ({ conversationId }) => {
      try {
        const conv = await checkAuth(conversationId);
        if (!conv) return;

        const userId = user._id;

        await Message.updateMany(
          { conversation: conversationId, readBy: { $ne: userId } },
          { $addToSet: { readBy: userId } }
        );

        conv.unreadCounts = conv.unreadCounts.map((u) =>
          u.user.toString() === userId.toString()
            ? { user: u.user, count: 0 }
            : u
        );
        await conv.save();

        io.to(conversationId).emit("seen", { conversationId, userId });

        console.log("👁 Messages marked as seen in", conversationId);

      } catch (err) {
        console.error("markRead error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", user.username);
    });
  });
}
