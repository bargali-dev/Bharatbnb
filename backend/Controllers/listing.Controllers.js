import uploadOnCloudinary from "../Config/Cloudinary.js";
import Listing from "../Modules/listing.Modules.js";
import User from "../Modules/user.Modules.js";

export const addListing = async (req, res) => {
  if (
    !req.files ||
    !req.files.image1 ||
    !req.files.image2 ||
    !req.files.image3
  ) {
    return res.status(400).json({ message: "All images are required" });
  }
   let { title, description, rent, city, landMark, category } = req.body;
  if (!title || !description || !rent || !city) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  try {
    console.log("FILES:", req.files);
    console.log("BODY:", req.body);
    
  const existingListing = await Listing.findOne({
    host: req.userId,
    title: title.trim(),
    city: city.trim(),
    landmark: landMark.trim(),
  });

  if (existingListing) {
    return res.status(400).json({
      message: "Listing already exists",
    });
  }

    let host = req.userId;
    let image1 = await uploadOnCloudinary(req.files.image1[0].path);
    let image2 = await uploadOnCloudinary(req.files.image2[0].path);
    let image3 = await uploadOnCloudinary(req.files.image3[0].path);

    let listing = await Listing.create({
      title,
      description,
      rent,
      city,
      landmark: landMark,
      category,
      image1,
      image2,
      image3,
      host,
    });
    let user = await User.findByIdAndUpdate(
      host,
      { $push: { listing: listing._id } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }
    return res.status(202).json(listing);
  } catch (error) {
    return res.status(500).json({ message: `Add Listing ${error}` });
  }
};

export const getListing = async (req, res) => {
  try {
    const listing = await Listing.find().sort({ createdAt: -1 });
    console.log(listing)
    return res.status(200).json(listing);
  } catch (error) {
    console.log("getListing error:", error);
    return res.status(500).json({ message: "getListing error" });
  }
};

export const findListing = async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    return res.status(200).json(listing);
  } catch (error) {
    return res.status(500).json(`findListing ${error}`);
  }
};

export const updateListing = async (req, res) => {
  if (
    !req.files ||
    !req.files.image1 ||
    !req.files.image2 ||
    !req.files.image3
  ) {
    return res.status(400).json({ message: "All images are required" });
  }

  try {
    console.log("FILES:", req.files);
    console.log("BODY:", req.body);
    let image1;
    let image2;
    let image3;
    let { id } = req.params;
    let { title, description, rent, city, landMark } = req.body;
    if (req.files.image1) {
      image1 = await uploadOnCloudinary(req.files.image1[0].path);
    }
    if (req.files.image2) {
      image2 = await uploadOnCloudinary(req.files.image2[0].path);
    }
    if (req.files.image3) {
      image3 = await uploadOnCloudinary(req.files.image3[0].path);
    }

    let listing = await Listing.findByIdAndUpdate(
      id,
      {
        title,
        description,
        rent,
        city,
        landmark: landMark,
       
        image1,
        image2,
        image3,
      },
      { new: true }
    );
    return res.status(202).json(listing);
  } catch (error) {
    return res.status(500).json(`${error}`);
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const user = await User.findByIdAndUpdate(
      listing.host,
      { $pull: { listing: listing._id } },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const ratingListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const listing = await Listing.findByIdAndUpdate(
      id,
      { rating: Number(rating) },
      { new: true },
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ rating: listing.rating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const search = async(req,res) =>{
  try {
    const {query} = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
   const listing = await Listing.find({
     $or: [
       { landmark: { $regex: query, $options: "i" } },
       { city: { $regex: query, $options: "i" } },
       { title: { $regex: query, $options: "i" } },
     ],
   });

    return res.status(200).json({listing});
    
  } catch (error) {
    return res.status(500).json({ message: `Searching Error ${error}` });
  }
}
