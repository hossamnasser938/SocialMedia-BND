import { ObjectId } from "mongodb";

let usersCollection;

export default class UsersDAO {
  static async injectDB(conn) {
    if (usersCollection) {
      return;
    }

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
      return !!result.insertedId;
    } catch (err) {
      console.log("Failed to create user UsersDAO", err);
      return false;
    }
  }
}
