import { User } from "../models/user.js";

export default class UserService {
  static async getAll() {
    try {
      const user = await User.find();
      return user;
    } catch (error) {
      console.log(`Could not fetch users ${error}`);
    }
  }

  static async create(data) {
    try {
      return await new User(data).save();
    } catch (error) {
      console.log(error);
    }
  }
  static async getUser(query) {
    try {
      const user = await User.findOne(query);
      return user;
    } catch (error) {
      console.log(`User not found. ${error}`);
    }
  }

  static async update(query, updateUser) {
    try {
      return await User.findOneAndUpdate(query, updateUser, { new: true });
    } catch (error) {
      console.log(`Could not update User ${error}`);
    }
  }

  static async delete(query) {
    try {
      const deletedResponse = await Student.findOneAndDelete(query);
      return deletedResponse;
    } catch (error) {
      console.log(`Could not delete User ${error}`);
    }
  }
}
