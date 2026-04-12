const Question = require("../models/Question")
const Course = require("../models/Course")

// Helper — check if user is enrolled student or course instructor
const canAccessCourse = async (userId, courseId) => {
  const course = await Course.findById(courseId).select("studentsEnroled instructor")
  if (!course) return { allowed: false, isInstructor: false }
  const isInstructor = course.instructor.toString() === userId.toString()
  const isEnrolled = course.studentsEnroled.some(
    (id) => id.toString() === userId.toString()
  )
  return { allowed: isInstructor || isEnrolled, isInstructor }
}

// POST /api/v1/course/askQuestion
exports.askQuestion = async (req, res) => {
  try {
    const { title, body, courseId, subsectionId } = req.body
    const userId = req.user.id

    if (!title || !body || !courseId || !subsectionId) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }

    const { allowed } = await canAccessCourse(userId, courseId)
    if (!allowed) {
      return res.status(403).json({ success: false, message: "You must be enrolled to ask questions" })
    }

    const question = await Question.create({
      title,
      body,
      author: userId,
      course: courseId,
      subsection: subsectionId,
    })

    await question.populate("author", "firstName lastName image")

    return res.status(201).json({ success: true, data: question })
  } catch (error) {
    console.error("askQuestion error:", error)
    return res.status(500).json({ success: false, message: "Could not post question" })
  }
}

// GET /api/v1/course/getQuestions?courseId=&subsectionId=&page=1&limit=20
exports.getQuestions = async (req, res) => {
  try {
    const { courseId, subsectionId, page = 1, limit = 20 } = req.query
    const userId = req.user.id

    if (!courseId || !subsectionId) {
      return res.status(400).json({ success: false, message: "courseId and subsectionId are required" })
    }

    const { allowed } = await canAccessCourse(userId, courseId)
    if (!allowed) {
      return res.status(403).json({ success: false, message: "Access denied" })
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [questions, total] = await Promise.all([
      Question.find({ course: courseId, subsection: subsectionId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("author", "firstName lastName image")
        .populate("answers.author", "firstName lastName image"),
      Question.countDocuments({ course: courseId, subsection: subsectionId }),
    ])

    return res.status(200).json({
      success: true,
      data: questions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    })
  } catch (error) {
    console.error("getQuestions error:", error)
    return res.status(500).json({ success: false, message: "Could not fetch questions" })
  }
}

// POST /api/v1/course/answerQuestion
exports.answerQuestion = async (req, res) => {
  try {
    const { questionId, body } = req.body
    const userId = req.user.id

    if (!questionId || !body) {
      return res.status(400).json({ success: false, message: "questionId and body are required" })
    }

    const question = await Question.findById(questionId)
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" })
    }

    const { allowed, isInstructor } = await canAccessCourse(userId, question.course)
    if (!allowed) {
      return res.status(403).json({ success: false, message: "Access denied" })
    }

    question.answers.push({ body, author: userId, isInstructorAnswer: isInstructor })
    await question.save()
    await question.populate("author", "firstName lastName image")
    await question.populate("answers.author", "firstName lastName image")

    return res.status(200).json({ success: true, data: question })
  } catch (error) {
    console.error("answerQuestion error:", error)
    return res.status(500).json({ success: false, message: "Could not post answer" })
  }
}

// PUT /api/v1/course/upvoteQuestion
// Adds upvote. If user had a downvote, that is removed first (mutual exclusion).
exports.toggleUpvote = async (req, res) => {
  try {
    const { questionId } = req.body
    const userId = req.user.id

    if (!questionId) {
      return res.status(400).json({ success: false, message: "questionId is required" })
    }

    const question = await Question.findById(questionId)
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" })
    }

    const alreadyUpvoted = question.upvotes.some((id) => id.toString() === userId.toString())

    if (alreadyUpvoted) {
      // Toggle off
      question.upvotes.pull(userId)
    } else {
      // Add upvote and remove any existing downvote
      question.upvotes.addToSet(userId)
      question.downvotes.pull(userId)
    }

    await question.save()

    return res.status(200).json({
      success: true,
      upvotes: question.upvotes.length,
      downvotes: question.downvotes.length,
      upvoted: !alreadyUpvoted,
    })
  } catch (error) {
    console.error("toggleUpvote error:", error)
    return res.status(500).json({ success: false, message: "Could not update upvote" })
  }
}

// PUT /api/v1/course/downvoteQuestion
// Adds downvote. If user had an upvote, that is removed first (mutual exclusion).
exports.toggleDownvote = async (req, res) => {
  try {
    const { questionId } = req.body
    const userId = req.user.id

    if (!questionId) {
      return res.status(400).json({ success: false, message: "questionId is required" })
    }

    const question = await Question.findById(questionId)
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" })
    }

    const alreadyDownvoted = question.downvotes.some((id) => id.toString() === userId.toString())

    if (alreadyDownvoted) {
      // Toggle off
      question.downvotes.pull(userId)
    } else {
      // Add downvote and remove any existing upvote
      question.downvotes.addToSet(userId)
      question.upvotes.pull(userId)
    }

    await question.save()

    return res.status(200).json({
      success: true,
      upvotes: question.upvotes.length,
      downvotes: question.downvotes.length,
      downvoted: !alreadyDownvoted,
    })
  } catch (error) {
    console.error("toggleDownvote error:", error)
    return res.status(500).json({ success: false, message: "Could not update downvote" })
  }
}

// PUT /api/v1/course/resolveQuestion  — instructor only
exports.toggleResolved = async (req, res) => {
  try {
    const { questionId } = req.body
    const userId = req.user.id

    if (!questionId) {
      return res.status(400).json({ success: false, message: "questionId is required" })
    }

    const question = await Question.findById(questionId)
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" })
    }

    const course = await Course.findById(question.course).select("instructor")
    if (!course || course.instructor.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Only the course instructor can resolve questions" })
    }

    question.isResolved = !question.isResolved
    await question.save()

    return res.status(200).json({ success: true, isResolved: question.isResolved })
  } catch (error) {
    console.error("toggleResolved error:", error)
    return res.status(500).json({ success: false, message: "Could not update question" })
  }
}
