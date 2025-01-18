import { Router } from "express";
import { userAuth } from "../middleware/auth.js";
import { ValidateProfileData } from "../utils/validation.js";

const ProfileRouter = Router();

ProfileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { user } = req
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

ProfileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const { user } = req; // Extract user from request
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }



    const isEditAllowed = ValidateProfileData(req.body);
    if (!isEditAllowed) {
      return res.status(400).json({ message: "Invalid profile data" });
    }

    Object.keys(req.body).forEach((key) => {
      if (user[key] !== undefined) user[key] = req.body[key];
    });

    await user.save(); // Save the updated user
    res.status(200).json({ message: `${user.firstName}'s profile updated successfully` });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default ProfileRouter;



