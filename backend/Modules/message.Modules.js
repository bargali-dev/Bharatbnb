import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Message", messageSchema);
