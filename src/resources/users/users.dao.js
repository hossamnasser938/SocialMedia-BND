import { ObjectId } from "mongodb";

let usersCollection;

export default class UsersDAO {
  static async injectDB(conn) {
    if (usersCollection) return;

    try {
      usersCollection = await conn.db(process.env.DB).collection("users");
    } catch (err) {
      console.log("unable to connect users DAO", err);
    }
  }

  static async getUserById(id) {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    return user;
  }

  static async getUserByEmail(email) {
    const user = await usersCollection.findOne({ email });
    return user;
  }

  static async createUser(email, password) {
    try {
      const user = { email, password, verified: false, createdAt: new Date() };
      const result = await usersCollection.insertOne(user);
      return { success: !!result.insertedId, userId: result.insertedId };
    } catch (err) {
      console.log("Failed to create user UsersDAO", err);
      return { success: false, error: err };
    }
  }

  static async updateUser(userId, newUser) {
    const query = { _id: new ObjectId(userId) };

    try {
      const result = await usersCollection.updateOne(query, { $set: newUser });
      return !!result.modifiedCount;
    } catch (err) {
      console.log("Failed to update user UsersDAO", err);
      return false;
    }
  }
}
