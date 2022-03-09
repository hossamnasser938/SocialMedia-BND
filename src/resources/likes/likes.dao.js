import { ObjectId } from "mongodb";

let likesCollection;

export default class LikesDAO {
  static async injectDB(conn) {
    if (likesCollection) return;

    try {
      likesCollection = await conn.db(process.env.DB).collection("likes");
    } catch (err) {
      console.log("unable to connect likes DAO", err);
    }
  }

  static async likePost(postId, userId) {
    const like = {
      postId: new ObjectId(postId),
      userId,
    };

    try {
      const likeExist = await likesCollection.find(like).toArray();
      if (likeExist.length > 0) {
        const errMessage = "User already liked post";
        console.log(`user ${userId} already liked post ${postId} LikesDAO`);
        return { success: false, error: errMessage };
      }

      like.createdAt = new Date();

      const result = await likesCollection.insertOne(like);
      return { success: !!result.insertedId };
    } catch (err) {
      console.log("Failed to like post LikesDAO", err);
      return { success: false };
    }
  }

  static async unlikePost(postId, userId) {
    const likeQuery = {
      postId: new ObjectId(postId),
      userId,
    };

    try {
      const result = await likesCollection.deleteOne(likeQuery);
      return result.deletedCount === 1;
    } catch (err) {
      console.log("Failed to unlike post LikesDAO", err);
      return false;
    }
  }

  static async getPostLikes(postId, page = 1) {
    try {
      const pipeline = [
        { $match: { postId: new ObjectId(postId) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * +process.env.PAGE_ITEMS_COUNT },
        { $limit: +process.env.PAGE_ITEMS_COUNT },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$user", 0] }, "$$ROOT"],
            },
          },
        },
        {
          $project: {
            user: 0,
            createdAt: 0,
            userId: 0,
            postId: 0,
            password: 0,
            _id: 0,
          },
        },
      ];

      const likes = likesCollection.aggregate(pipeline).toArray();
      return likes;
    } catch (err) {
      console.log("Failed to get post likes LikesDAO", err);
      return [];
    }
  }
}
