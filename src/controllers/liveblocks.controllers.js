import { Liveblocks } from "@liveblocks/node";
import { LIVEBLOCKS_SECRET_KEY } from "../../configs/env.js";
import User from "../models/user.model.js";

const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET_KEY,
});

export const authenticateLiveblocks = async (req, res) => {
  const user = req.user;

  const { room } = req.body;

  console.log("Liveblocks Auth User:", user);

  if (!user) {
    return res.status(403).json({ message: "User not identified" });
  }

  // Identifying Users for Liveblocks (Prepare Session)
  const session = liveblocks.prepareSession(user._id.toString(), {
    userInfo: {
      name: user.name || "Anonymous",
      avatar: user.avatar,
      role: user.role,
    },
  });

  // Authorization for Room
  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { body, status } = await session.authorize();
  return res.status(status).send(body);
};

export const resolveUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: "userIds array is required" });
    }

    const users = await User.find(
      { _id: { $in: userIds } },
      { name: 1, email: 1, role: 1, avatar: 1 }
    );

    const userMap = users.map((user) => ({
      name: user.name,
      avatar: user.avatar,
    }));

    return res.status(200).json(userMap);
  } catch (error) {
    console.error("Resolve Users Error:", error);
    return res.status(500).json({ message: "Failed to resolve users" });
  }
};
