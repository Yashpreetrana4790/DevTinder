import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import User from "../models/User.js";
const authRouter = express.Router();
//login , signup , logout , profile (get) , profile (patch) , password Update (post)

authRouter.post("/signup", async (req, res) => {
  const { password, firstName, lastName, email, age, gender } = req.body;

  if (!password || !firstName || !lastName || !email || !age || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash the password 
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user object
    const userObj = {
      password: passwordHash,
      firstName,
      lastName,
      email,
      age,
      gender,
    };

    // Save user in the database
    const user = new User(userObj);
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", details: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});


authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentails" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await user.validatePassword(password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentails" });
    }


    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

    // Set the JWT token as a cookie
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ message: "Login successful" });


  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

export default authRouter;
