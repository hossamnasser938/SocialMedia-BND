import { ObjectId } from "mongodb";
import { PAGE_ITEMS_COUNT } from "../../utils/constants";

let commentsCollection;

const commentsUsersLookupStage = {
  $lookup: {
    from: "users",
    let: { userId: "$userId" },
    pipeline: [
      { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
      { $project: { _id: 0, email: 1 } },
    ],
    as: "createdUser",
  },
};

const commentsHideUserIdProjectStage = { $project: { userId: 0 } };

const commentsReduceLookupArraysSetStage = {
  $set: { createdUser: { $arrayElemAt: ["$createdUser", 0] } },
};

export default class CommentsDAO {
  static async injectDB(conn) {
    if (commentsCollection) {
      return;
    }

    try {
      commentsCollection = await conn.db(process.env.DB).collection("comments");
    } catch (err) {
      console.log("unable to connect comments DAO", err);
    }
  }

  static async createComment(commentText, userId, postId) {
    const comment = {
      text: commentText,
      userId,
      postId: new ObjectId(postId),
      createdAt: new Date(),
    };

    try {
      const result = await commentsCollection.insertOne(comment);
      return !!result.insertedId;
    } catch (err) {
      console.log("Failed to create comment CommentsDAO", err);
      return false;
    }
  }

  static async getPostComments(postId, page) {
    try {
      const pipeline = [
        { $match: { postId: new ObjectId(postId) } },
        commentsUsersLookupStage,
        commentsHideUserIdProjectStage,
        commentsReduceLookupArraysSetStage,
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * 10 },
        { $limit: PAGE_ITEMS_COUNT },
      ];

      const postComments = await commentsCollection
        .aggregate(pipeline)
        .toArray();

      return postComments;
    } catch (err) {
      console.log("Failed to get post comments CommentsDAO", err);
      return [];
    }
  }

  static async getComment(commentId) {
    try {
      const pipeline = [
        { $match: { _id: new ObjectId(commentId) } },
        commentsUsersLookupStage,
        commentsHideUserIdProjectStage,
        commentsReduceLookupArraysSetStage,
      ];

      const commentsMatched = await commentsCollection
        .aggregate(pipeline)
        .toArray();

      const comment = commentsMatched.length === 1 ? commentsMatched[0] : null;
      return comment;
    } catch (err) {
      console.log("Failed to get comment CommentsDAO", err);
      return null;
    }
  }
}
