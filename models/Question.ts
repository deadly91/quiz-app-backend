import mongoose from "mongoose";

export interface IQuestion {
  text: string;
  options: string[];
  correctAnswer: string;
  category?: string;
  timeLimit?: number;
}

const questionSchema = new mongoose.Schema<IQuestion>({
  text: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: (v: string[]) => v.length === 4,
  },
  correctAnswer: { type: String, required: true },
  category: { type: String, default: "react-native" },
  timeLimit: { type: Number, default: 10 },
});

export default mongoose.model("Question", questionSchema);
