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
    const userQuery = { _id: new ObjectId(id) };

    try {
      const user = await usersCollection.findOne(userQuery);
      return user;
    } catch (err) {
      console.log("Failed to get user UsersDAO", err);
      return null;
    }
  }

  static async getUserByEmail(email) {
    const userQuery = { email };

    try {
      const user = await usersCollection.findOne(userQuery);
      return user;
    } catch (err) {
      console.log("Failed to get user UsersDAO", err);
      return null;
    }
  }

  static async createUser(email, password) {
    const user = { email, password, verified: false, createdAt: new Date() };

    try {
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
