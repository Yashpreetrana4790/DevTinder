import User from "../models/User.js";
import jwt from "jsonwebtoken"


export const userAuth = async (req, res, next) => {

  try {
    const cookies = req?.cookies;
    if (!cookies?.token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedObj = await jwt.verify(cookies.token, process.env.JWT_SECRET_KEY);
    if (!decodedObj) {
      return res.status(401).json({ message: "Unauthorized" });
    }


    const { userId } = decodedObj;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next()
    return decodedObj;
  } catch (error) {

    return res.status(401).json({ message: "Unauthorized" });
  }

}