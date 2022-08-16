import { mongoose } from "mongoose";

const { Schema } = mongoose;

const tagSchema = new Schema({ type: String });

const profileSchema = new Schema(
  {
    profileImgUrl: {
      type: String,
      required: true,
      default: 
      "https://avatars.dicebear.com/api/male/alexlind.svg"
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    bio: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      required: true
    },
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
      minLength: [3, "Username is too short"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be at least 8 characters long"]
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
