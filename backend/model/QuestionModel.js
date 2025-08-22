const { mongoose } = require("mongoose");

const questionSetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    questions: {
      type: [
        {
          questionText: {
            type: String,
            required: true,
          },
          choices: {
            type: [
              {
                label: {
                  type: String,
                  required: true,
                },
                text: {
                  type: String,
                  required: true,
                },
                correctAnswer: {
                  type: Boolean,
                  default: false,
                },
              },
            ],
            validate: [
              {
                validator: function (choices) {
                  return choices.length >= 2 && choices.length <= 4;
                },
                message: "Each question must have between 2 and 4 choices.",
              },
              {
                validator: function (choices) {
                  return choices.filter((choice) => choice.correctAnswer).length === 1;
                },
                message: "Each question must have exactly one correct answer.",
              },
              {
                validator: function (choices) {
                  const labels = choices.map((choice) => choice.label);
                  return new Set(labels).size === labels.length;
                },
                message: "Choice labels must be unique within a question.",
              },
            ],
          },
        },
      ],
      required: true,
      validate: {
        validator: function (questions) {
          return questions.length > 0;
        },
        message: "A question set must contain at least one question.",
      },
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for performance
questionSetSchema.index({ createdBy: 1 });
questionSetSchema.index({ title: 1 });

const QuestionSet = mongoose.model("QuestionSet", questionSetSchema);
module.exports = QuestionSet;