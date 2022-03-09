import { ObjectId } from "mongodb";

let otpsCollection;

export default class OtpsDAO {
  static async injectDB(conn) {
    if (otpsCollection) return;

    try {
      otpsCollection = await conn.db(process.env.DB).collection("otps");
    } catch (err) {
      console.log("unable to connect otps DAO", err);
    }
  }

  static async insertOtp(userId, code) {
    const otpDoc = { code, userId, createdAt: new Date() };

    try {
      const result = await otpsCollection.insertOne(otpDoc);
      return !!result.insertedId;
    } catch (err) {
      console.log("failed to insert otp doc", err);
      return false;
    }
  }

  static async getOtp(userId, code) {
    const otpQuery = { userId: new ObjectId(userId), code };

    try {
      const result = await otpsCollection.findOne(otpQuery);
      return result;
    } catch (err) {
      console.log("failed to find otp doc", err);
      return null;
    }
  }
}
