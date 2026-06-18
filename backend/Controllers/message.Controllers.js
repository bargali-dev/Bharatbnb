import Message from "../Modules/message.Modules.js";

export const getMessages = async (req, res) => {
  try {
    const { room } = req.query;

    const messages = await Message.find({ room }).populate("sender", "name");

    res.status(200).json({
      messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
