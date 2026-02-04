const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { blocked: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error blocking user" });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { blocked: false },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unblocking user" });
  }
};

