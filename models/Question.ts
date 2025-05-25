import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  category: { type: String, default: "react-native" },
  timeLimit: { type: Number, default: 10 }, // seconds
});

export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema);
