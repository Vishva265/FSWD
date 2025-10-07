import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"]
    },
    content: {
      type: String,
      required: [true, "Content is required"]
    }
    // timestamps added below will provide createdAt & updatedAt
  },
  { timestamps: true }
);

export default mongoose.model("Note", NoteSchema);
