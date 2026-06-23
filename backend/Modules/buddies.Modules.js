import mongoose from "mongoose";

const buddySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    selectedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    city: {
      type: String,
    },

    checkIn: {
      type: String,
      required: true,
    },

    checkOut: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "any"],
      default: "any",
    },
    // type: {
    //   type: String,
    //   enum: ["search", "request"],
    //   default: "search",
    // },


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
