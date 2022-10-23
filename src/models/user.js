import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  onboarded: { type: Boolean, default: false },
  username: String,
  token: String,
});
export const User = mongoose.model("user", UserSchema);
