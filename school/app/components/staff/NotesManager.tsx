"use client"

import { useState, useEffect } from "react"
import { BookOpen, Plus, Edit2, Trash2, X, AlertCircle, Check, Link2, Calendar, User, FileText } from "lucide-react"

interface Section {
  id: string
  name: string
  classId: string
  class_name: string
  isClassTeacher: boolean
  subject: string | null
}

interface ClassNote {
  id: string
  sectionId: string
  teacherId: string | null
  teacher_name: string | null
  subject: string
  title: string
  content: string
  fileUrl: string | null
  createdAt: string
}

interface NotesManagerProps {
  sections: Section[]
  currentUserId: string
}

export default function NotesManager({ sections, currentUserId }: NotesManagerProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '')
  const [notes, setNotes] = useState<ClassNote[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [saving, setSaving] = useState(false)

  // Find active section details
  const activeSection = sections.find(s => s.id === selectedSectionId)

  // Fetch notes when active section changes
  const fetchNotes = async (sectionId: string) => {
    if (!sectionId) return
    setLoading(true)
    setErrorMessage(null)
    try {
      const response = await fetch(`/api/staff/notes?sectionId=${sectionId}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to load class notes")
      }
      setNotes(data.notes || [])
    } catch (err: any) {
      setErrorMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes(selectedSectionId)
  }, [selectedSectionId])

  const openAddModal = () => {
    setEditingId(null)
    setTitle('')
    // Prefill subject if the teacher is assigned a specific subject in this section
    setSubject(activeSection?.subject || '')
    setContent('')
    setFileUrl('')
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const openEditModal = (note: ClassNote) => {
    setEditingId(note.id)
    setTitle(note.title)
    setSubject(note.subject)
    setContent(note.content)
    setFileUrl(note.fileUrl || '')
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMessage(null)

    const payload = {
      id: editingId,
      sectionId: selectedSectionId,
      title,
      subject,
      content,
      fileUrl: fileUrl || null
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const response = await fetch('/api/staff/notes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "An error occurred while saving the class note.")
      }

      setSuccessMessage(editingId ? "Class note updated successfully." : "Class note created successfully.")
      setIsModalOpen(false)
      fetchNotes(selectedSectionId)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setErrorMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class note?")) {
      return
    }

    setErrorMessage(null)
    try {
      const response = await fetch(`/api/staff/notes?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete class note.")
      }

      setSuccessMessage("Class note deleted successfully.")
      setNotes(prev => prev.filter(n => n.id !== id))
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setErrorMessage(err.message)
    }
  }

  const canModify = (note: ClassNote) => {
    // True if creator of the note OR class teacher of the active section
    return note.teacherId === currentUserId || activeSection?.isClassTeacher === true
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Study Material & Updates
          </span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Class Notes Manager</h2>
          <p className="text-slate-500 text-sm">
            Publish syllabus notes, references, assignments information, or attachments for students.
          </p>
        </div>

        {/* Section Selector & Add Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Section:</span>
            <select
              value={selectedSectionId}
              onChange={e => setSelectedSectionId(e.target.value)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold bg-white text-slate-800"
            >
              {sections.map(s => (
                <option key={s.id} value={s.id}>
                  {s.class_name} {s.name} {s.isClassTeacher ? '(Class Teacher)' : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm active:scale-95 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Class Note
          </button>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMessage && (
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-800 px-5 py-4 rounded-xl border border-emerald-100 shadow-sm animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 bg-rose-50 text-rose-800 px-5 py-4 rounded-xl border border-rose-100 shadow-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Notes Feed Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm mt-2">Loading notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 px-6 text-center max-w-2xl mx-auto space-y-3">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto text-xl">
            📝
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No Class Notes Yet</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Get started by creating the first study note, reading assignment, or document link for your students in {activeSection?.class_name} {activeSection?.name}.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-sm rounded-xl transition-all"
          >
            Create Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map(note => (
            <div key={note.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              {/* Note Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide">
                    {note.subject}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(note.createdAt)}
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 text-lg leading-snug mb-2">
                  {note.title}
                </h3>

                {/* Content */}
                <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed line-clamp-6">
                  {note.content}
                </p>
              </div>

              {/* Note Footer */}
              <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>By {note.teacher_name || 'Staff Member'}</span>
                </div>

                <div className="flex items-center gap-2">
                  {note.fileUrl && (
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-white border border-slate-200 hover:border-slate-300 px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      Attachment
                    </a>
                  )}

                  {canModify(note) && (
                    <div className="flex items-center border-l border-slate-200 pl-2 gap-1">
                      <button
                        onClick={() => openEditModal(note)}
                        className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                        title="Edit Note"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notes Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-95 transition-all">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">
                {editingId ? 'Edit Class Note' : 'Add New Class Note'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Sanskrit, Mathematics, Science"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 1 Vowels Study Guide"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Content / Instructions</label>
                <textarea
                  placeholder="Write the note description, syllabus information, or assignment instructions here..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Attachment Link / URL (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... or pdf url"
                    value={fileUrl}
                    onChange={e => setFileUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Provide a clickable link to documents, images, slide decks, or folders stored online.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center min-w-[80px]"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
