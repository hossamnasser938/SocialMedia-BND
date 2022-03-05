import { ObjectId } from "mongodb";

let postSubscribersCollection;

export default class PostSubscribersDAO {
  static async injectDB(conn) {
    if (postSubscribersCollection) {
      return;
    }

    try {
      postSubscribersCollection = await conn
        .db(process.env.DB)
        .collection("postSubscribers");
    } catch (err) {
      console.log("unable to connect postSubscribers DAO", err);
    }
  }

  static async subscribe(postId, userId) {
    try {
      const postSubscriberDoc = {
        postId: new ObjectId(postId),
        userId,
        createdAt: new Date(),
      };
      const result = await postSubscribersCollection.insertOne(
        postSubscriberDoc
      );
      return !!result.insertedId;
    } catch (err) {
      console.log("Failed to create postSubscriber PostSubscribersDAO", err);
      return false;
    }
  }

  static async unsubscribe(postId, userId) {
    try {
      const postSubscriberDoc = { postId: new ObjectId(postId), userId };
      const result = await postSubscribersCollection.remove(postSubscriberDoc);
      return !!result.deletedCount;
    } catch (err) {
      console.log("Failed to remove postSubscriber PostSubscribersDAO", err);
      return false;
    }
  }

  static async getPostSubscribers(postId) {
    const pipeline = [
      { $match: { postId: new ObjectId(postId) } },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
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
      { $project: { email: 1, _id: 0 } },
    ];

    const postSubscribers = await postSubscribersCollection
      .aggregate(pipeline)
      .toArray();

    return postSubscribers;
  }
}
