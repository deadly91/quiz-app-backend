import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    role: { type: String, enum: ["player", "admin"], default: "player" },
    IsBanned: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now },
    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
