import { ObjectId } from "mongodb";
import { PAGE_ITEMS_COUNT } from "../../utils/constants";

let postsCollection;

const postsCommentsLookupStage = {
  $lookup: {
    from: "comments",
    let: { postId: "$_id" },
    pipeline: [
      { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },
      { $sort: { createdAt: -1 } },
      { $limit: PAGE_ITEMS_COUNT },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$user", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $project: {
          password: 0,
          userId: 0,
          postId: 0,
          user: 0,
        },
      },
    ],
    as: "comments",
  },
};

const postsLikesLookupStage = {
  $lookup: {
    from: "likes",
    let: { postId: "$_id" },
    pipeline: [
      { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },
      { $sort: { createdAt: -1 } },
      { $limit: PAGE_ITEMS_COUNT },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$user", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $project: { _id: 0, email: 1 },
      },
    ],
    as: "userLikes",
  },
};

const postsAuthUserLookupStages = (userId) => [
  {
    $lookup: {
      from: "likes",
      let: { postId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$postId", "$$postId"], $eq: ["$userId", userId] },
          },
        },
      ],
      as: "isUserLiked",
    },
  },
  {
    $set: {
      isUserLiked: {
        $cond: [{ $eq: [{ $size: "$isUserLiked" }, 1] }, true, false],
      },
    },
  },
];

const postsCreatedUserLookupStage = {
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

const postsReduceLookupArraysSetStage = {
  $set: { createdUser: { $arrayElemAt: ["$createdUser", 0] } },
};

const postsHideUserIdProjectionStage = { $project: { userId: 0 } };

export default class PostsDAO {
  static async injectDB(conn) {
    if (postsCollection) {
      return;
    }

    try {
      postsCollection = await conn.db(process.env.DB).collection("posts");
    } catch (err) {
      console.log("unable to connect posts DAO", err);
    }
  }

  static async getPosts(authUserId, userId, page = 1) {
    try {
      const pipeline = [
        { $match: userId ? { userId: new ObjectId(userId) } : {} },
        postsCommentsLookupStage,
        postsLikesLookupStage,
        ...postsAuthUserLookupStages(authUserId),
        postsCreatedUserLookupStage,
        postsReduceLookupArraysSetStage,
        postsHideUserIdProjectionStage,
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * 10 },
        { $limit: PAGE_ITEMS_COUNT },
      ];
      const posts = await postsCollection.aggregate(pipeline).toArray();
      return posts;
    } catch (err) {
      console.log("failed to get posts PostsDAO", err);
      return [];
    }
  }

  static async getPost(postId, authUserId) {
    try {
      const pipeline = [
        { $match: { _id: new ObjectId(postId) } },
        postsCommentsLookupStage,
        postsLikesLookupStage,
        ...postsAuthUserLookupStages(authUserId),
        postsCreatedUserLookupStage,
        postsReduceLookupArraysSetStage,
        postsHideUserIdProjectionStage,
      ];
      const postsMatched = await postsCollection.aggregate(pipeline).toArray();
      const post = postsMatched.length === 1 ? postsMatched[0] : null;
      return post;
    } catch (err) {
      console.log("failed to get posts PostsDAO", err);
      return null;
    }
  }

  static async createPost(text, userId) {
    const postDoc = { text, userId, createdAt: new Date() };

    try {
      const result = await postsCollection.insertOne(postDoc);
      return { success: !!result.insertedId, postId: result.insertedId };
    } catch (err) {
      console.log("Failed to create post PostsDAO", err);
      return { success: false };
    }
  }
}
