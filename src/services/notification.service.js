import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export async function createNotificationsForNewArticle(article) {
  try {
    const usersToNotify = await User.find({
      followedCategories: article.category_id,
    }).select("_id");

    if (usersToNotify.length === 0) return;

    const notifications = usersToNotify.map((user) => ({
      recipient: user._id,
      type: "new_article",
      article: article._id,
      category: article.category_id,
      message: `New articles: "${article.title}"`,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      //   console.log(
      //     `[Notification] Created ${notifications.length} notifications for article "${article.title}"`
      //   );
    }

    // Real-time with Socket.io
    // if (global.io) {
    //   usersToNotify.forEach(user => {
    //     global.io.to(user._id.toString()).emit("new_notification", { ... });
    //   });
    // }
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
}
