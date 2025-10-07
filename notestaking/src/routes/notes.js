import { Router } from "express";
import Note from "../models/Note.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import mongoose from "mongoose";

const router = Router();

/**
 * POST /api/notes
 * Create a note
 * Body: { title: string, content: string }
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const note = await Note.create({
      title: req.body.title,
      content: req.body.content
    });
    res.status(201).json(note);
  })
);

/**
 * GET /api/notes
 * List notes (optional search & pagination)
 * Query:
 *  - q: search in title/content
 *  - page (default 1), limit (default 10), sort (default "-updatedAt")
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const {
      q,
      page = 1,
      limit = 10,
      sort = "-updatedAt" // newest first
    } = req.query;

    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { content: { $regex: q, $options: "i" } }
          ]
        }
      : {};

    const p = Math.max(parseInt(page, 10) || 1, 1);
    const l = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

    const [items, total] = await Promise.all([
      Note.find(filter).sort(sort).skip((p - 1) * l).limit(l).lean(),
      Note.countDocuments(filter)
    ]);

    res.json({
      page: p,
      limit: l,
      total,
      items
    });
  })
);

/**
 * GET /api/notes/:id
 * Read a single note
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  })
);

/**
 * PATCH /api/notes/:id
 * Update a note (partial)
 * Body: { title?, content? }
 */
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const update = {};
    if (typeof req.body.title === "string") update.title = req.body.title;
    if (typeof req.body.content === "string") update.content = req.body.content;

    const note = await Note.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  })
);

/**
 * DELETE /api/notes/:id
 * Delete a note
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Note not found" });
    res.status(204).send();
  })
);

export default router;
