import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FiTrash2, FiEdit2, FiSave, FiX, FiFileText } from "react-icons/fi"
import { VscLoading } from "react-icons/vsc"
import { addNote, getNotes, deleteNote, editNote } from "../../../services/operations/courseAPI"

// ─── Format video seconds → HH:MM:SS ─────────────────────────────────────────
function formatVideoTime(seconds) {
  const s = Math.floor(seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [h, m, sec].map((v) => String(v).padStart(2, "0")).join(":")
}

// ─── Format date → DD MMMM YY ─────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day:   "2-digit",
    month: "long",
    year:  "2-digit",
  })
}

// ─── Single note card ─────────────────────────────────────────────────────────
function NoteCard({ note, onSeekTo, onDelete, onEdit }) {
  const [editing, setEditing]     = useState(false)
  const [editBody, setEditBody]   = useState(note.body)
  const [saving, setSaving]       = useState(false)
  const [deleting, setDeleting]   = useState(false)

  const handleSave = async () => {
    if (!editBody.trim() || saving) return
    setSaving(true)
    const updated = await onEdit(note._id, editBody.trim())
    if (updated) setEditing(false)
    setSaving(false)
  }

  const handleDelete = async () => {
    if (deleting) return
    setDeleting(true)
    await onDelete(note._id)
    setDeleting(false)
  }

  return (
    <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-4">
      {/* Timestamp + date row */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => onSeekTo(note.videoTimestamp)}
          className="flex items-center gap-1.5 rounded-full bg-yellow-50/10 px-3 py-1
                     text-xs font-bold text-yellow-50 transition-colors
                     hover:bg-yellow-50/20"
          title="Jump to this moment in the video"
        >
          ▶ {formatVideoTime(note.videoTimestamp)}
        </button>
        <span className="text-xs text-richblack-400">
          {formatDate(note.createdAt)}
        </span>
      </div>

      {/* Body — view or edit */}
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            rows={3}
            autoFocus
            className="w-full resize-none rounded-lg border border-yellow-50
                       bg-richblack-900 px-3 py-2.5 text-sm text-richblack-5
                       outline-none"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!editBody.trim() || saving}
              className="flex items-center gap-1.5 rounded-lg bg-yellow-50 px-3 py-1.5
                         text-xs font-semibold text-richblack-900 transition-opacity
                         hover:opacity-90 disabled:opacity-50"
            >
              {saving ? <VscLoading className="animate-spin" /> : <FiSave />}
              Save
            </button>
            <button
              onClick={() => { setEditing(false); setEditBody(note.body) }}
              className="flex items-center gap-1.5 rounded-lg border border-richblack-600
                         px-3 py-1.5 text-xs text-richblack-400 hover:text-richblack-200"
            >
              <FiX /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <p className="flex-1 text-sm leading-relaxed text-richblack-200 whitespace-pre-wrap">
            {note.body}
          </p>
          <div className="flex shrink-0 gap-1">
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg p-1.5 text-richblack-400 transition-colors
                         hover:bg-richblack-700 hover:text-yellow-50"
              title="Edit note"
            >
              <FiEdit2 className="text-sm" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg p-1.5 text-richblack-400 transition-colors
                         hover:bg-richblack-700 hover:text-red-400"
              title="Delete note"
            >
              {deleting
                ? <VscLoading className="animate-spin text-sm" />
                : <FiTrash2 className="text-sm" />
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Notes component ─────────────────────────────────────────────────────
export default function Notes({ courseId, sectionId, subSectionId, capturedTimestamp, onSeekTo }) {
  const { token } = useSelector((state) => state.auth)

  const [notes, setNotes]         = useState([])
  const [loading, setLoading]     = useState(false)
  const [body, setBody]           = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Fetch notes whenever the lecture changes
  useEffect(() => {
    if (!courseId || !subSectionId || !token) return
    setLoading(true)
    setNotes([])
    getNotes(courseId, subSectionId, token).then((data) => {
      setNotes(data ?? [])
      setLoading(false)
    })
  }, [courseId, subSectionId, token])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!body.trim() || submitting) return
    setSubmitting(true)
    const newNote = await addNote(
      {
        courseId,
        sectionId,
        subsectionId: subSectionId,
        body:         body.trim(),
        videoTimestamp: capturedTimestamp,
      },
      token
    )
    if (newNote) {
      // Insert in sorted position by videoTimestamp
      setNotes((prev) =>
        [...prev, newNote].sort((a, b) => a.videoTimestamp - b.videoTimestamp)
      )
      setBody("")
    }
    setSubmitting(false)
  }

  const handleDelete = async (noteId) => {
    const ok = await deleteNote(noteId, token)
    if (ok) setNotes((prev) => prev.filter((n) => n._id !== noteId))
  }

  const handleEdit = async (noteId, newBody) => {
    const updated = await editNote(noteId, newBody, token)
    if (updated) {
      setNotes((prev) => prev.map((n) => (n._id === noteId ? updated : n)))
    }
    return updated
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Add note form */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 rounded-xl border border-yellow-50/20
                   bg-richblack-800 p-4"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-richblack-5">Add a note</h4>
          {/* Show the timestamp that will be saved */}
          <span className="rounded-full bg-yellow-50/10 px-3 py-0.5 text-xs
                           font-bold text-yellow-50">
            ▶ {formatVideoTime(capturedTimestamp)}
          </span>
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your note here…"
          rows={3}
          className="resize-none rounded-lg border border-richblack-600
                     bg-richblack-900 px-3 py-2.5 text-sm text-richblack-5
                     placeholder-richblack-400 outline-none transition-colors
                     focus:border-yellow-50"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(e) }
          }}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!body.trim() || submitting}
            className="flex items-center gap-2 rounded-lg bg-yellow-50 px-5 py-2
                       text-sm font-semibold text-richblack-900 transition-opacity
                       hover:opacity-90 disabled:opacity-50"
          >
            {submitting && <VscLoading className="animate-spin" />}
            Save Note
          </button>
        </div>
      </form>

      {/* Notes list */}
      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-richblack-400">
            <VscLoading className="animate-spin text-xl" />
            <span className="text-sm">Loading notes…</span>
          </div>
        ) : notes.length === 0 ? (
          <div className="rounded-xl border border-richblack-700 py-10 text-center">
            <FiFileText className="mx-auto mb-3 text-3xl text-richblack-500" />
            <p className="text-sm font-medium text-richblack-400">No notes yet</p>
            <p className="mt-1 text-xs text-richblack-500">
              Pause the video and write your first note above
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-richblack-400">
              {notes.length} {notes.length === 1 ? "note" : "notes"} — sorted by video position
            </p>
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onSeekTo={onSeekTo}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
