// routes/history.js
import express from "express";
import mongoose from "mongoose";
import MoodEntry from "../ME.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const items = await MoodEntry.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate("userId", "email") 
      .lean();

    return res.json(items);
  } catch (e) {
    console.error("History GET error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { emotion, timestamp } = req.body;
    if (!emotion) return res.status(400).json({ error: "emotion is required" });

    const doc = await MoodEntry.create({
      userId,
      emotion,
      timestamp: timestamp ? new Date(timestamp) : undefined,
    });

    const idsToKeep = await MoodEntry.find({ userId })
      .sort({ timestamp: -1 })  
      .limit(10)               
      .distinct("_id");        

    await MoodEntry.deleteMany({
      userId,
      _id: { $nin: idsToKeep }, 
    });

    return res.status(201).json(doc);
  } catch (e) {
    console.error("History POST error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});


router.post("/:userId/import", async (req, res) => {
  try {
    const { userId } = req.params;
    const entries = Array.isArray(req.body.entries) ? req.body.entries : [];
    if (!entries.length) return res.json({ inserted: 0 });

    const docs = entries
      .filter((e) => e && e.emotion)
      .map((e) => ({
        userId,
        emotion: e.emotion,
        timestamp: e.timestamp ? new Date(e.timestamp) : new Date(),
      }));

    const insertedDocs = await MoodEntry.insertMany(docs, { ordered: false });

   
    const populated = await MoodEntry.find({
      _id: { $in: insertedDocs.map((d) => d._id) },
    }).populate("userId", "email");

    return res.json({ inserted: populated });
  } catch (e) {
    console.error("History IMPORT error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;