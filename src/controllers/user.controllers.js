import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const sort = req.query.sort || "-createdAt";
    const skip = (page - 1) * limit;

    const query = { role: "user" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const usersPromise = User.find(query)
      .select("-bookmarks -followedCategories")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const countPromise = User.countDocuments(query);

    const [users, totalUsers] = await Promise.all([usersPromise, countPromise]);

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          totalPages,
          totalUsers,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userIdToDelete = req.params.id;
    const currentAdminId = req.user._id.toString();

    if (userIdToDelete === currentAdminId) {
      const error = new Error("You cannot delete your own account.");
      error.statusCode = 400;
      throw error;
    }

    const deletedUser = await User.findByIdAndDelete(userIdToDelete);

    if (!deletedUser) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
