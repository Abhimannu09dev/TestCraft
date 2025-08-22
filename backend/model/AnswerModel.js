const { mongoose } = require("mongoose");

const AnswerSchema = new mongoose.Schema(
  {
    questionSet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionSet",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    responses: {
      type: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          selectedChoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
        },
      ],
      required: true,
      validate: {
        validator: function (responses) {
          return responses.length > 0;
        },
        message: "At least one response is required.",
      },
      default: [],
    },
    score: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for performance
AnswerSchema.index({ user: 1 });
AnswerSchema.index({ questionSet: 1 });
AnswerSchema.index({ submittedAt: -1 });

//  Pre-save hook to calculate score and total
AnswerSchema.pre("save", async function (next) {
  try {
    const questionSet = await mongoose.model("QuestionSet").findById(this.questionSet);
    if (!questionSet) {
      return next(new Error("Invalid questionSet ID"));
    }
    this.total = questionSet.questions.length;
    this.score = this.responses.reduce((score, response) => {
      const question = questionSet.questions.id(response.questionId);
      if (!question) return score;
      const correctChoice = question.choices.find((choice) => choice.correctAnswer);
      return response.selectedChoiceId.equals(correctChoice._id) ? score + 1 : score;
    }, 0);
    next();
  } catch (error) {
    next(error);
  }
});

const AnswerModel = mongoose.model("Answer", AnswerSchema);
module.exports = AnswerModel;