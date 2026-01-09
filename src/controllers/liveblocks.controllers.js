import { Liveblocks } from "@liveblocks/node";
import { LIVEBLOCKS_SECRET_KEY } from "../../configs/env.js";
import User from "../models/user.model.js";

const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET_KEY,
});

export const authenticateLiveblocks = async (req, res) => {
  const user = req.user;

  const { room } = req.body;

  let session;

  if (user) {
    session = liveblocks.prepareSession(user._id.toString(), {
      userInfo: {
        name: user.name || "Anonymous",
        avatar: user.avatar,
        role: user.role,
        isGuest: false,
      },
    });

    // Authorization for Room
    if (room) {
      session.allow(room, session.FULL_ACCESS);
    }
  } else {
    const guestId = `guest-${Math.floor(Math.random() * 10000)}`;
    session = liveblocks.prepareSession(guestId, {
      userInfo: {
        name: "Guest",
        avatar: "",
        isGuest: true,
      },
    });
    if (room) {
      session.allow(room, session.READ_ACCESS);
    }
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
      { name: 1, role: 1, avatar: 1 }
    );

    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    const orderedUsers = userIds.map((id) => {
      const user = userMap[id];

      if (user) {
        return {
          name: user.name,
          avatar: user.avatar,
        };
      }

      return {
        name: "Deleted User",
        avatar: "",
      };
    });

    return res.status(200).json(orderedUsers);
  } catch (error) {
    console.error("Resolve Users Error:", error);
    return res.status(500).json({ message: "Failed to resolve users" });
  }
};
