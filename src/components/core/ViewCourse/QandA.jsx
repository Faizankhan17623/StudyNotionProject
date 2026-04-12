import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import { BiUpvote, BiSolidUpvote, BiDownvote, BiSolidDownvote } from "react-icons/bi"
import { BsChevronDown, BsCheckCircleFill } from "react-icons/bs"
import { FiSend, FiMessageSquare } from "react-icons/fi"
import { VscLoading } from "react-icons/vsc"

import {
  getQuestionsForLecture,
  askQuestion,
  answerQuestion,
  toggleUpvoteQuestion,
  toggleDownvoteQuestion,
  toggleResolveQuestion,
} from "../../../services/operations/courseAPI"

// ─── helpers ────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

function Avatar({ user }) {
  if (user?.image) {
    return (
      <img
        src={user.image}
        alt={user.firstName}
        className="h-8 w-8 rounded-full object-cover flex-shrink-0"
      />
    )
  }
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase()
  return (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full
                    bg-yellow-50 text-xs font-bold text-richblack-900">
      {initials}
    </div>
  )
}

// ─── Answer item ─────────────────────────────────────────────────────────────

function AnswerItem({ answer }) {
  return (
    <div className="flex gap-3 rounded-lg bg-richblack-800 p-4">
      <Avatar user={answer.author} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-richblack-5">
            {answer.author?.firstName} {answer.author?.lastName}
          </span>
          {answer.isInstructorAnswer && (
            <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-[11px]
                             font-bold text-richblack-900">
              INSTRUCTOR
            </span>
          )}
          <span className="text-xs text-richblack-400">{timeAgo(answer.createdAt)}</span>
        </div>
        <p className="text-sm text-richblack-200 leading-relaxed whitespace-pre-wrap">
          {answer.body}
        </p>
      </div>
    </div>
  )
}

// ─── Single question card ─────────────────────────────────────────────────────

function QuestionCard({ question, currentUserId, isInstructor, token, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [answerText, setAnswerText] = useState("")
  const [submittingAnswer, setSubmittingAnswer] = useState(false)
  const [upvoting, setUpvoting] = useState(false)
  const [downvoting, setDownvoting] = useState(false)
  const [resolving, setResolving] = useState(false)
  const answerRef = useRef(null)

  const upvoted = question.upvotes?.some((id) => id === currentUserId || id?._id === currentUserId)
  const downvoted = question.downvotes?.some((id) => id === currentUserId || id?._id === currentUserId)
  const netScore = (question.upvotes?.length ?? 0) - (question.downvotes?.length ?? 0)

  const handleUpvote = async (e) => {
    e.stopPropagation()
    if (upvoting || downvoting) return
    setUpvoting(true)
    const result = await toggleUpvoteQuestion(question._id, token)
    if (result) onUpdate(question._id, {
      upvotes: result.upvoted
        ? [...(question.upvotes ?? []), currentUserId]
        : (question.upvotes ?? []).filter((id) => id !== currentUserId && id?._id !== currentUserId),
      // server removes downvote when upvoting
      downvotes: result.upvoted
        ? (question.downvotes ?? []).filter((id) => id !== currentUserId && id?._id !== currentUserId)
        : question.downvotes,
    })
    setUpvoting(false)
  }

  const handleDownvote = async (e) => {
    e.stopPropagation()
    if (downvoting || upvoting) return
    setDownvoting(true)
    const result = await toggleDownvoteQuestion(question._id, token)
    if (result) onUpdate(question._id, {
      downvotes: result.downvoted
        ? [...(question.downvotes ?? []), currentUserId]
        : (question.downvotes ?? []).filter((id) => id !== currentUserId && id?._id !== currentUserId),
      // server removes upvote when downvoting
      upvotes: result.downvoted
        ? (question.upvotes ?? []).filter((id) => id !== currentUserId && id?._id !== currentUserId)
        : question.upvotes,
    })
    setDownvoting(false)
  }

  const handleResolve = async () => {
    if (resolving) return
    setResolving(true)
    const result = await toggleResolveQuestion(question._id, token)
    if (result) onUpdate(question._id, { isResolved: result.isResolved })
    setResolving(false)
  }

  const handleAnswer = async (e) => {
    e.preventDefault()
    if (!answerText.trim() || submittingAnswer) return
    setSubmittingAnswer(true)
    const updated = await answerQuestion({ questionId: question._id, body: answerText.trim() }, token)
    if (updated) {
      onUpdate(question._id, { answers: updated.answers })
      setAnswerText("")
    }
    setSubmittingAnswer(false)
  }

  const handleExpand = () => {
    setExpanded((v) => !v)
    if (!expanded) {
      setTimeout(() => answerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 150)
    }
  }

  return (
    <div className={`rounded-xl border transition-colors ${
      question.isResolved
        ? "border-caribbeangreen-200/30 bg-richblack-800"
        : "border-richblack-700 bg-richblack-800"
    }`}>
      {/* Question header — always visible */}
      <div
        className="flex cursor-pointer items-start gap-3 p-4"
        onClick={handleExpand}
      >
        {/* Vote column */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            onClick={handleUpvote}
            disabled={upvoting || downvoting}
            className={`flex flex-col items-center rounded-lg px-2 py-1
                        transition-colors hover:bg-richblack-700 ${
                          upvoted ? "text-yellow-50" : "text-richblack-400"
                        }`}
          >
            {upvoted
              ? <BiSolidUpvote className="text-lg" />
              : <BiUpvote className="text-lg" />
            }
          </button>
          <span className={`text-xs font-bold leading-none ${
            netScore > 0 ? "text-yellow-50" : netScore < 0 ? "text-red-400" : "text-richblack-400"
          }`}>
            {netScore}
          </span>
          <button
            onClick={handleDownvote}
            disabled={downvoting || upvoting}
            className={`flex flex-col items-center rounded-lg px-2 py-1
                        transition-colors hover:bg-richblack-700 ${
                          downvoted ? "text-red-400" : "text-richblack-400"
                        }`}
          >
            {downvoted
              ? <BiSolidDownvote className="text-lg" />
              : <BiDownvote className="text-lg" />
            }
          </button>
        </div>

        {/* Content column */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {question.isResolved && (
              <span className="flex items-center gap-1 rounded-full bg-caribbeangreen-200/20
                               px-2 py-0.5 text-[11px] font-bold text-caribbeangreen-100">
                <BsCheckCircleFill className="text-[10px]" /> RESOLVED
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-richblack-400">
              <FiMessageSquare />
              {question.answers?.length ?? 0} {question.answers?.length === 1 ? "answer" : "answers"}
            </span>
          </div>

          <p className="text-sm font-semibold text-richblack-5 leading-snug line-clamp-2">
            {question.title}
          </p>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-richblack-400">
            <Avatar user={question.author} />
            <span>{question.author?.firstName} {question.author?.lastName}</span>
            <span>·</span>
            <span>{timeAgo(question.createdAt)}</span>
          </div>
        </div>

        {/* Expand chevron */}
        <BsChevronDown
          className={`mt-1 flex-shrink-0 text-richblack-400 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-richblack-700 px-4 pb-4 pt-4">
          {/* Question body */}
          <p className="mb-5 text-sm text-richblack-200 leading-relaxed whitespace-pre-wrap">
            {question.body}
          </p>

          {/* Instructor resolve button */}
          {isInstructor && (
            <button
              onClick={handleResolve}
              disabled={resolving}
              className={`mb-5 flex items-center gap-1.5 rounded-lg border px-3 py-1.5
                          text-xs font-semibold transition-colors ${
                            question.isResolved
                              ? "border-richblack-600 text-richblack-400 hover:border-richblack-500"
                              : "border-caribbeangreen-200/50 text-caribbeangreen-100 hover:bg-caribbeangreen-200/10"
                          }`}
            >
              <BsCheckCircleFill />
              {resolving ? "Updating…" : question.isResolved ? "Mark as Unresolved" : "Mark as Resolved"}
            </button>
          )}

          {/* Answers */}
          {question.answers?.length > 0 && (
            <div className="mb-4 flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-richblack-400">
                {question.answers.length} {question.answers.length === 1 ? "Answer" : "Answers"}
              </p>
              {question.answers.map((ans) => (
                <AnswerItem key={ans._id} answer={ans} />
              ))}
            </div>
          )}

          {/* Answer form */}
          <div ref={answerRef}>
            <form onSubmit={handleAnswer} className="flex items-end gap-2">
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Write your answer…"
                rows={2}
                className="flex-1 resize-none rounded-lg border border-richblack-600
                           bg-richblack-900 px-3 py-2.5 text-sm text-richblack-5
                           placeholder-richblack-400 outline-none transition-colors
                           focus:border-yellow-50"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAnswer(e) }
                }}
              />
              <button
                type="submit"
                disabled={!answerText.trim() || submittingAnswer}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center
                           rounded-lg bg-yellow-50 text-richblack-900 transition-opacity
                           hover:opacity-90 disabled:opacity-40"
              >
                {submittingAnswer
                  ? <VscLoading className="animate-spin" />
                  : <FiSend />
                }
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Q&A component ───────────────────────────────────────────────────────

export default function QandA({ courseId, subSectionId }) {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { courseEntireData } = useSelector((state) => state.viewCourse)

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAskForm, setShowAskForm] = useState(false)
  const [askTitle, setAskTitle] = useState("")
  const [askBody, setAskBody] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState("recent") // "recent" | "upvoted" | "downvoted"

  const isInstructor =
    user?.accountType === "Instructor" &&
    courseEntireData?.instructor?._id === user?._id

  // Fetch questions whenever the lecture changes
  useEffect(() => {
    if (!courseId || !subSectionId || !token) return
    setLoading(true)
    setQuestions([])
    setShowAskForm(false)
    setSortBy("recent")

    getQuestionsForLecture(courseId, subSectionId, token).then((res) => {
      setQuestions(res?.data ?? [])
      setLoading(false)
    })
  }, [courseId, subSectionId, token])

  // Patch a single question in state after upvote/answer/resolve
  const handleUpdate = (questionId, patch) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === questionId ? { ...q, ...patch } : q))
    )
  }

  const sortedQuestions = [...questions].sort((a, b) => {
    if (sortBy === "upvoted") {
      return (b.upvotes?.length ?? 0) - (a.upvotes?.length ?? 0)
    }
    if (sortBy === "downvoted") {
      return (b.downvotes?.length ?? 0) - (a.downvotes?.length ?? 0)
    }
    // "recent" — newest first (default from server, maintain order)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const handleAsk = async (e) => {
    e.preventDefault()
    if (!askTitle.trim() || !askBody.trim() || submitting) return
    setSubmitting(true)
    const newQ = await askQuestion(
      { title: askTitle.trim(), body: askBody.trim(), courseId, subsectionId: subSectionId },
      token
    )
    if (newQ) {
      setQuestions((prev) => [newQ, ...prev])
      setAskTitle("")
      setAskBody("")
      setShowAskForm(false)
    }
    setSubmitting(false)
  }

  return (
    <div className="mt-2 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-richblack-5">
          Questions
          {questions.length > 0 && (
            <span className="ml-2 rounded-full bg-richblack-700 px-2 py-0.5 text-xs
                             font-normal text-richblack-300">
              {questions.length}
            </span>
          )}
        </h3>
        <button
          onClick={() => setShowAskForm((v) => !v)}
          className="rounded-lg border border-yellow-50 px-4 py-1.5 text-xs font-semibold
                     text-yellow-50 transition-colors hover:bg-yellow-50 hover:text-richblack-900"
        >
          {showAskForm ? "Cancel" : "+ Ask a Question"}
        </button>
      </div>

      {/* Sort filter */}
      {questions.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-richblack-400">Sort by:</span>
          {[
            { label: "Most Recent", value: "recent" },
            { label: "Most Upvoted", value: "upvoted" },
            { label: "Most Downvoted", value: "downvoted" },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSortBy(value)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                sortBy === value
                  ? value === "downvoted"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-yellow-50/10 text-yellow-50"
                  : "text-richblack-400 hover:text-richblack-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Ask form */}
      {showAskForm && (
        <form
          onSubmit={handleAsk}
          className="flex flex-col gap-3 rounded-xl border border-yellow-50/30
                     bg-richblack-800 p-4"
        >
          <h4 className="text-sm font-semibold text-richblack-5">Ask a new question</h4>
          <input
            type="text"
            value={askTitle}
            onChange={(e) => setAskTitle(e.target.value)}
            placeholder="Title — describe your question in one line"
            maxLength={150}
            className="rounded-lg border border-richblack-600 bg-richblack-900 px-3 py-2.5
                       text-sm text-richblack-5 placeholder-richblack-400 outline-none
                       transition-colors focus:border-yellow-50"
            required
          />
          <textarea
            value={askBody}
            onChange={(e) => setAskBody(e.target.value)}
            placeholder="Describe your question in detail…"
            rows={4}
            className="resize-none rounded-lg border border-richblack-600 bg-richblack-900
                       px-3 py-2.5 text-sm text-richblack-5 placeholder-richblack-400
                       outline-none transition-colors focus:border-yellow-50"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAskForm(false)}
              className="rounded-lg px-4 py-2 text-sm text-richblack-400
                         hover:text-richblack-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!askTitle.trim() || !askBody.trim() || submitting}
              className="flex items-center gap-2 rounded-lg bg-yellow-50 px-5 py-2
                         text-sm font-semibold text-richblack-900 transition-opacity
                         hover:opacity-90 disabled:opacity-50"
            >
              {submitting && <VscLoading className="animate-spin" />}
              Post Question
            </button>
          </div>
        </form>
      )}

      {/* Questions list */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-richblack-400">
          <VscLoading className="animate-spin text-xl" />
          <span className="text-sm">Loading questions…</span>
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-xl border border-richblack-700 py-12 text-center">
          <FiMessageSquare className="mx-auto mb-3 text-3xl text-richblack-500" />
          <p className="text-sm font-medium text-richblack-400">No questions yet</p>
          <p className="mt-1 text-xs text-richblack-500">
            Be the first to ask something about this lecture
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sortedQuestions.map((q) => (
            <QuestionCard
              key={q._id}
              question={q}
              currentUserId={user?._id}
              isInstructor={isInstructor}
              token={token}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
