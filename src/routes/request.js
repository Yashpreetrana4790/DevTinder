import express from "express";
import { userAuth } from "../middleware/auth.js";


const requestRouter = express.Router();

requestRouter.post("/sendingConnectionRequest", userAuth, async (req, res) => {
  try {

    res.status(200).json({ message: "Connection request sent successfully" });
  } catch (error) {
    console.error("Error sending connection request:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default requestRouter;