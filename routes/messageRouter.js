import express from "express";
import Conversation from "../models/Conversation.js";
import Listing from "../models/listing.js";
import { isLoggedIn } from "../utils/isLoggedIn.js";

const router = express.Router();

router.get("/:listingId", isLoggedIn, async (req, res) => {
    const { listingId } = req.params;
    const userId = req.user._id;

    const listing = await Listing.findById(listingId).populate("owner");
    if (!listing) return res.status(404).send("Listing not found");

    const hostId = listing.owner._id;

    if (hostId.toString() === userId.toString()) {
        req.flash("error", "You cannot message yourself.");
        return res.redirect(`/listings/${listingId}`);
    }

    let existing = await Conversation.findOne({
        listing: listingId,
        participants: { $all: [userId, hostId] }
    });

    if (!existing) {
        existing = await Conversation.create({
            listing: listingId,
            participants: [userId, hostId],
            unreadCounts: [
                { user: userId, count: 0 },
                { user: hostId, count: 0 }
            ]
        });
    }

    res.redirect(`/conversations/${existing._id}`);
});

export default router;
