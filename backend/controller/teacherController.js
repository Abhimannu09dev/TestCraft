const QuestionSet = require("../model/QuestionModel");

// Create a function to create a question
async function createQuestionSetController(req, res) {
    const data = req.body;
    const { id, role } = req.user;
    if(role != "teacher"){
        return res.status(403).json({message: "Only teachers can create question sets"});
    }

    const finalData = {
    ...data,
    createdBy: id,
    };

    const createSet = new QuestionSet(finalData);
    await createSet.save();

    res.status(201).json({
    message: "Question Set Created Successfully",
    });
}

module.exports = {
  createQuestionSetController,
};