import Buddy from "../Modules/buddies.Modules.js";
import { io } from "../index.js";
import Listing from "../Modules/listing.Modules.js";
import User from "../Modules/user.Modules.js";

// ==============================
// 🔍 FIND + MATCH BUDDY
// ==============================
export const findBuddy = async (req, res) => {
  try {
    const { city, checkIn, checkOut, gender, propertyId } = req.body;

    if (!city || !checkIn || !checkOut || !propertyId) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    // ❗ REMOVE OLD ENTRY
    await Buddy.deleteMany({
      user: req.userId,
      property: propertyId,
      checkIn,
      checkOut,
    });

    // ✅ CREATE NEW ENTRY
    const newBuddy = await Buddy.create({
      user: req.userId,
      city,
      checkIn,
      checkOut,
      gender,
      property: propertyId,
      status: "searching",
    });

    // 🔥 STRICT MATCH
    const buddies = await Buddy.find({
      city,
      checkIn,
      checkOut,
      property: propertyId,
      status: "searching",
      user: { $ne: req.userId },
    })
      .populate("user", "name email")
      .populate("property");

    const room = `${propertyId}-${checkIn}-${checkOut}`;

    if (buddies.length > 0) {
      const matchedBuddy = buddies[0];

      if (matchedBuddy.user._id.toString() === req.userId.toString()) {
        return res.status(200).json({
          message: "Skipping self match",
          buddies: [],
        });
      }

      // ✅ UPDATE BOTH
      await Buddy.findByIdAndUpdate(newBuddy._id, {
        status: "matched",
        selectedUser: matchedBuddy.user._id,
      });

      await Buddy.findByIdAndUpdate(matchedBuddy._id, {
        status: "matched",
        selectedUser: req.userId,
      });

      const updatedBuddies = await Buddy.find({
        _id: { $in: [newBuddy._id, matchedBuddy._id] },
      })
        .populate("user", "name email")
        .populate("property");

      io.to(room).emit("buddyFound", updatedBuddies);

      return res.status(200).json({
        message: "Buddy Found 🎉",
        buddies: updatedBuddies,
      });
    }

    return res.status(200).json({
      message: "Searching for buddy...",
      buddies: [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// ==============================
// 🔁 CHECK MATCH (Polling)
// ==============================
export const checkBuddy = async (req, res) => {
  try {
    const { city, checkIn, checkOut, propertyId } = req.body;

    const buddies = await Buddy.find({
      city,
      checkIn,
      checkOut,
      property: propertyId,
      status: "matched",
      user: { $ne: req.userId },
    })
      .populate("user", "name email")
      .populate("property");

    return res.status(200).json({
      message: buddies.length > 0 ? "Buddy Found 🎉" : "Still searching...",
      buddies,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// ==============================
// ✅ CONFIRM (User A / User B)
// ==============================
export const confirmBuddy = async (req, res) => {
  try {
    const { buddyId } = req.body;

    const currentBuddy = await Buddy.findByIdAndUpdate(
      buddyId,
      { isConfirmed: true },
      { new: true },
    );

    if (!currentBuddy) {
      return res.status(404).json({ message: "Buddy not found" });
    }

    // 🔥 FIND MATCHED USER
    const matchedBuddy = await Buddy.findOne({
      user: currentBuddy.selectedUser,
      property: currentBuddy.property,
      checkIn: currentBuddy.checkIn,
      checkOut: currentBuddy.checkOut,
    });

    const room = `${currentBuddy.property}-${currentBuddy.checkIn}-${currentBuddy.checkOut}`;

    // 🚀 SEND CONFIRM UPDATE
    io.to(room).emit("confirmUpdate", {
      userId: currentBuddy.user,
      message: "User confirmed ✅",
    });

    // 🔥 BOTH CONFIRMED
    if (matchedBuddy && matchedBuddy.isConfirmed) {
      io.to(room).emit("bothConfirmed", {
        message: "Both users confirmed 🎉",
      });
    }

    return res.status(200).json({
      message: "Confirmed successfully",
      currentBuddy,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// 📩 SEND REQUEST (NEW - IMPORTANT)
// ==============================
// export const sendBuddyRequest = async (req, res) => {
//   try {
//     const senderId = req.userId;
//     const { receiverId, propertyId, checkIn, checkOut } = req.body;

//     const buddy = await Buddy.create({
//       user: senderId,
//       selectedUser: receiverId,
//       property: propertyId,
//       checkIn,
//       checkOut,
//       type: "request", 
//       status: "pending",
//     });

//     // 🔥 POPULATE DATA (IMPORTANT FIX)
//     const populatedBuddy = await Buddy.findById(buddy._id)
//       .populate("user", "name email")
//       .populate("property");

//     const receiverSocketId = global.onlineUsers?.[receiverId];

//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("buddyRequest", {
//         requestId: buddy._id,
//         fromUser: populatedBuddy.user, // ✅ FULL DATA
//         property: populatedBuddy.property, // ✅ FULL DATA
//       });
//     }

//     return res.status(200).json({
//       message: "Request sent",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: error.message });
//   }
// };
// export const sendBuddyRequest = async (req, res) => {
//   try {
//     const senderId = req.userId;
//     const { receiverId, propertyId, checkIn, checkOut } = req.body;

//      if (senderId.toString() === receiverId.toString()) {
//           return res.status(400).json({
//             message: "You cannot send request to yourself",
//           });
//        }


//     const buddy = await Buddy.create({
//       user: senderId,
//       selectedUser: receiverId,
//       property: propertyId,
//       checkIn,
//       checkOut,
//       status: "searching",
//     });

//     // 🔥 POPULATE DATA (IMPORTANT FIX)
//     const populatedBuddy = await Buddy.findById(buddy._id)
//       .populate("user", "name email")
//       .populate("property");

//     const receiverSocketId = global.onlineUsers?.[receiverId];

//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("buddyRequest", {
//         requestId: buddy._id,
//         fromUser: populatedBuddy.user, // ✅ FULL DATA
//         property: populatedBuddy.property, // ✅ FULL DATA
//       });
//     }

//     return res.status(200).json({
//       message: "Request sent",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: error.message });
//   }
// };

export const sendBuddyRequest = async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId, propertyId, checkIn, checkOut } = req.body;

    // 🔥 FIND EXISTING MATCH
    const buddy = await Buddy.findOne({
      user: senderId,
      selectedUser: receiverId,
      property: propertyId,
      checkIn,
      checkOut,
      status: "matched",
    });

    if (!buddy) {
      return res.status(404).json({
        message: "Match not found",
      });
    }

    // ✅ UPDATE STATUS (NOT CREATE)
    buddy.status = "searching"; // or "pending"
    await buddy.save();

    const populatedBuddy = await Buddy.findById(buddy._id)
      .populate("user", "name email")
      .populate("property");

    const receiverSocketId = global.onlineUsers?.[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("buddyRequest", {
        requestId: buddy._id,
        fromUser: populatedBuddy.user,
        property: populatedBuddy.property,
      });
    }

    return res.status(200).json({
      message: "Request sent",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    console.log(req.userId);
    const requests = await Buddy.find({
      $or: [
        { selectedUser: req.userId }, // received
        { user: req.userId }, // sent
      ],
      // status: "searching", // ✅ ONLY THIS ADDED
    })
      .populate("user", "name email")
      .populate("selectedUser", "name email")
      .populate("property");
      console.log(requests);

    return res.status(200).json({
      requests,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
// ==============================
// ✅ ACCEPT REQUEST
// ==============================
export const acceptBuddyRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const buddy = await Buddy.findById(requestId)
      .populate("user", "name email")
      .populate("property");

    if (!buddy) {
      return res.status(404).json({ message: "Request not found" });
    }

    buddy.status = "accepted";
    await buddy.save();

    // const room = `${buddy.property._id}-${buddy.checkIn}-${buddy.checkOut}`;

    // io.to(room).emit("requestAccepted", {
    //   message: "Buddy request accepted ✅",
    //   buddy,
    // });
    
    const senderId = buddy.user._id.toString();
    const senderSocketId = global.onlineUsers?.[senderId];

    if (senderSocketId) {
      io.to(senderSocketId).emit("requestAccepted", {
        requestId: buddy._id,
        message: "Your request was accepted ✅",
        buddy,
      });
    }

    return res.status(200).json({
      message: "Request accepted",
      buddy,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// ==============================
// ❌ REJECT REQUEST
// ==============================
export const rejectBuddyRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const buddy = await Buddy.findById(requestId);

    if (!buddy) {
      return res.status(404).json({ message: "Request not found" });
    }

    buddy.status = "rejected";
    await buddy.save();

    // const room = `${buddy.property}-${buddy.checkIn}-${buddy.checkOut}`;

    // io.to(room).emit("requestRejected", {
    //   message: "Buddy request rejected ❌",
    //   requestId,
    // });

        const senderId = buddy.user.toString();
        const senderSocketId = global.onlineUsers?.[senderId];

        if (senderSocketId) {
          io.to(senderSocketId).emit("requestRejected", {
            requestId,
            message: "Your request was rejected ❌",
          });
        }

    return res.status(200).json({
      message: "Request rejected",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// ==============================
// 📥 GET ALL REQUESTS (FOR USER B)
// ==============================
