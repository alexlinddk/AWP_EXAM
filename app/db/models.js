import { mongoose } from "mongoose";

const { Schema } = mongoose;

const tagSchema = new Schema({ type: String });

const profileSchema = new Schema(
  {
    profileImgUrl: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true
    },
    tags: [tagSchema],
    websiteUrl: {
      type: String
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      minLength: [3, "TUsername is too short"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const models = [
  {
    name: "Profile",
    schema: profileSchema,
    collection: "profiles",
  },
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
];
