import Booking from "../Modules/booking.Modules.js";
import Listing from "../Modules/listing.Modules.js";
import User from "../Modules/user.Modules.js";

export const createBooking = async (req, res) => {
  try {
     console.log("Params:", req.params);
    console.log("Body:", req.body);
    console.log("User:", req.userId);
    const { id } = req.params;
    const { checkIn, checkOut, totalRent, buddyId } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      return res.status(400).json({ message: "Invalid dates" });
    }

    if (listing.isBooked) {
      return res.status(400).json({ message: "Listing already booked" });
    }

    const booking = await Booking.create({
      checkIn,
      checkOut,
      totalRent,
      host: listing.host,
      guest: req.userId,
      listing: listing._id,
      buddy: buddyId || null,
    });

    await User.findByIdAndUpdate(req.userId, {
      $push: { booking: booking._id },
    });

    listing.isBooked = true;
    listing.guest = req.userId;
    listing.buddy = buddyId || null;
    await listing.save({ validateBeforeSave: false });

    res.status(201).json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing || !listing.isBooked) {
      return res.status(404).json({ message: "No active booking found" });
    }

    const booking = await Booking.findOne({ listing: listing._id });

    if (booking) {
      await User.findByIdAndUpdate(booking.guest, {
        $pull: { booking: booking._id },
      });

      await Booking.findByIdAndDelete(booking._id);
    }

    listing.isBooked = false;
    listing.guest = null;
    await listing.save({ validateBeforeSave: false });

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
