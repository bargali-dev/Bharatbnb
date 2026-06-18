import mongoose from "mongoose";

const buddySchema = new mongoose.Schema(
  {
    // 👤 Current User (who is searching)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👤 Selected Buddy (after matching)
    selectedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // 🏠 Property reference (VERY IMPORTANT)
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    // 📍 Location
    city: {
      type: String,
    },

    // 📅 Dates
    checkIn: {
      type: String,
      required: true,
    },

    checkOut: {
      type: String,
      required: true,
    },

    // 🚻 Optional preference
    gender: {
      type: String,
      enum: ["male", "female", "any"],
      default: "any",
    },
    // 🔥 NEW TYPE (IMPORTANT)
    // type: {
    //   type: String,
    //   enum: ["search", "request"],
    //   default: "search",
    // },

    // 🔥 NEW STATUS (IMPORTANT)
    status: {
      type: String,
      enum: ["searching", "matched", "booked","accepted","rejected"],
      default: "searching",
    },

    isConfirmed: {
      type: Boolean,
      default: false,
    },

    isReadyToBook: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Buddy", buddySchema);
