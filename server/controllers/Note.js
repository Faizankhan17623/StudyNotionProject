const Note    = require("../models/Note")
const Course  = require("../models/Course")

// Verify the requesting student is enrolled in the course
const verifyEnrollment = async (userId, courseId) => {
  const course = await Course.findById(courseId).select("studentsEnroled instructor")
  if (!course) return false
  const isEnrolled   = course.studentsEnroled.some((id) => id.toString() === userId.toString())
  const isInstructor = course.instructor.toString() === userId.toString()
  return isEnrolled || isInstructor
}

// POST /api/v1/course/addNote
exports.addNote = async (req, res) => {
  try {
    const { courseId, sectionId, subsectionId, body, videoTimestamp } = req.body
    const userId = req.user.id

    if (!courseId || !sectionId || !subsectionId || !body?.trim()) {
      return res.status(400).json({ success: false, message: "courseId, sectionId, subsectionId and body are required" })
    }

    const allowed = await verifyEnrollment(userId, courseId)
    if (!allowed) {
      return res.status(403).json({ success: false, message: "You must be enrolled to add notes" })
    }

    const note = await Note.create({
      user:           userId,
      course:         courseId,
      section:        sectionId,
      subsection:     subsectionId,
      body:           body.trim(),
      videoTimestamp: Number(videoTimestamp) || 0,
    })

    return res.status(201).json({ success: true, data: note })
  } catch (error) {
    console.error("addNote error:", error)
    return res.status(500).json({ success: false, message: "Could not save note" })
  }
}

// GET /api/v1/course/getNotes?courseId=&subsectionId=
exports.getNotes = async (req, res) => {
  try {
    const { courseId, subsectionId } = req.query
    const userId = req.user.id

    if (!courseId || !subsectionId) {
      return res.status(400).json({ success: false, message: "courseId and subsectionId are required" })
    }

    const notes = await Note.find({ user: userId, course: courseId, subsection: subsectionId })
      .sort({ videoTimestamp: 1 }) // ordered by video position

    return res.status(200).json({ success: true, data: notes })
  } catch (error) {
    console.error("getNotes error:", error)
    return res.status(500).json({ success: false, message: "Could not fetch notes" })
  }
}

// GET /api/v1/course/getAllCourseNotes?courseId=
// Returns all notes for a course grouped by subsection — used on the notes dashboard page
exports.getAllCourseNotes = async (req, res) => {
  try {
    const { courseId } = req.query
    const userId = req.user.id

    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" })
    }

    const notes = await Note.find({ user: userId, course: courseId })
      .populate("section",    "sectionName")
      .populate("subsection", "title")
      .sort({ "section": 1, videoTimestamp: 1 })

    return res.status(200).json({ success: true, data: notes })
  } catch (error) {
    console.error("getAllCourseNotes error:", error)
    return res.status(500).json({ success: false, message: "Could not fetch notes" })
  }
}

// DELETE /api/v1/course/deleteNote
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.body
    const userId = req.user.id

    if (!noteId) {
      return res.status(400).json({ success: false, message: "noteId is required" })
    }

    const note = await Note.findById(noteId)
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" })
    }
    if (note.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "You can only delete your own notes" })
    }

    await Note.findByIdAndDelete(noteId)
    return res.status(200).json({ success: true, message: "Note deleted" })
  } catch (error) {
    console.error("deleteNote error:", error)
    return res.status(500).json({ success: false, message: "Could not delete note" })
  }
}

// PUT /api/v1/course/editNote
exports.editNote = async (req, res) => {
  try {
    const { noteId, body } = req.body
    const userId = req.user.id

    if (!noteId || !body?.trim()) {
      return res.status(400).json({ success: false, message: "noteId and body are required" })
    }

    const note = await Note.findById(noteId)
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" })
    }
    if (note.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "You can only edit your own notes" })
    }

    note.body = body.trim()
    await note.save()

    return res.status(200).json({ success: true, data: note })
  } catch (error) {
    console.error("editNote error:", error)
    return res.status(500).json({ success: false, message: "Could not edit note" })
  }
}
