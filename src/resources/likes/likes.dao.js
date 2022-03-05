import { ObjectId } from "mongodb";
import { PAGE_ITEMS_COUNT } from "../../utils/constants";

let likesCollection;

export default class LikesDAO {
  static async injectDB(conn) {
    if (likesCollection) {
      return;
    }

    try {
      likesCollection = await conn.db(process.env.DB).collection("likes");
    } catch (err) {
      console.log("unable to connect likes DAO", err);
    }
  }

  static async likePost(postId, userId) {
    try {
      const likeDoc = {
        postId: new ObjectId(postId),
        userId,
        createdAt: new ObjectId(),
      };

      const result = await likesCollection.insertOne(likeDoc);
      return !!result.insertedId;
    } catch (err) {
      console.log("Failed to like post LikesDAO", err);
      return false;
    }
  }

  static async unlikePost(postId, userId) {
    try {
      const result = await likesCollection.deleteOne({
        postId: new ObjectId(postId),
        userId,
      });
      return result.deletedCount === 1;
    } catch (err) {
      console.log("Failed to unlike post LikesDAO", err);
      return false;
    }
  }

  static async getPostLikes(postId, page) {
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
        { $skip: (page - 1) * PAGE_ITEMS_COUNT },
        { $limit: PAGE_ITEMS_COUNT },
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
