import { Quiz } from '../Models/Quiz.js';
import { Question } from '../Models/Quiz.js';
import User from '../Models/User.js';

const randomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const createQuiz = async (req, res) => {
  try {
    console.log(req.body);
    let { title, questions, startingDate, endingDate } = req.body;
    let quizcode = randomString(5); 
    let createdBy = req.user._id;

    const questionDocs = await Promise.all(
      questions.map(async (question) => {
        console.log(question,question.options);
        const formattedOptions = question.options.map((option) => ({
          optionText: option.length > 0 ? option : null,
          isCorrect: option.correctAnswer || false,
        }));

        const newQuestion = new Question({
          quizId: null, 
          questionText: question.questionText,
          options: formattedOptions, 
          points: question.points || 0, 
        });

        return await newQuestion.save();
      })
    );

    const newQuiz = new Quiz({
      title,
      questions: questionDocs.map((q) => q._id), 
      startingDate,
      endingDate,
      createdBy,
      quizcode,
    });

    const savedQuiz = await newQuiz.save();

    await Question.updateMany(
      { _id: { $in: questionDocs.map((q) => q._id) } },
      { $set: { quizId: savedQuiz._id } }
    );
    console.log(savedQuiz);
    return res.status(200).json(savedQuiz);
  } catch (error) {
    console.error(error);  
    return res.status(500).json({ message: 'An error occurred while creating the quiz.' });
  }
};

const evaluateQuiz = async (req, res) => {
  try {
    const { quizId, userAnswers } = req.body;
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    let totalScore = 0;

    for (let i = 0; i < userAnswers.length; i++) {
      const userAnswer = userAnswers[i]; 
      const question = await Question.findById(userAnswer.questionId);

      if (question) {
        const correctOption = question.options.find((option) => option.isCorrect);

        if (correctOption && correctOption.optionText === userAnswer.selectedOption) {
          totalScore += question.points;
        } else {
          totalScore += 0;
        }
      }
    }

    // Return total score
    return res.status(200).json({ totalScore });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while evaluating the quiz.' });
  }
};

export { createQuiz, evaluateQuiz };
