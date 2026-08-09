"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, Edit2, Trash2, X, AlertCircle, Check, Clock, MapPin, Clipboard } from "lucide-react"

interface Exam {
  id: string
  name: string
  examDate: string | null
}

interface ExamTimetableEntry {
  id: string
  examId: string
  sectionId: string
  subject: string
  examDate: string
  startTime: string
  endTime: string
  room: string | null
}

interface ExamTimetableManagerProps {
  exams: Exam[]
  sectionId: string
  className: string
  sectionName: string
  subjects: string[]
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return ""
  const parts = timeStr.split(':')
  if (parts.length < 2) return timeStr
  const hours = parseInt(parts[0], 10)
  const minutes = parts[1]
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes} ${ampm}`
}

const cleanTimeInput = (timeStr: string) => {
  if (!timeStr) return ""
  const parts = timeStr.split(':')
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`
  }
  return timeStr
}

export default function ExamTimetableManager({
  exams,
  sectionId,
  className,
  sectionName,
  subjects
}: ExamTimetableManagerProps) {
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '')
  const [entries, setEntries] = useState<ExamTimetableEntry[]>([])
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [subject, setSubject] = useState(subjects[0] || '')
  const [examDate, setExamDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('12:00')
  const [room, setRoom] = useState('')

  const fetchTimetable = async (examId: string) => {
    if (!examId) return
    setLoading(true)
    setErrorMessage(null)
    try {
      const response = await fetch(`/api/staff/exam-timetable?examId=${examId}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to load exam schedule.")
      }
      setEntries(data.entries || [])
    } catch (err: any) {
      setErrorMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedExamId) {
      fetchTimetable(selectedExamId)
    } else {
      setEntries([])
    }
  }, [selectedExamId])

  const openAddModal = () => {
    setEditingId(null)
    setSubject(subjects[0] || '')
    setExamDate('')
    setStartTime('09:00')
    setEndTime('12:00')
    setRoom('')
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const openEditModal = (entry: ExamTimetableEntry) => {
    setEditingId(entry.id)
    setSubject(entry.subject)
    
    // Format date string to YYYY-MM-DD
    const dateObj = new Date(entry.examDate)
    const formattedDate = dateObj.toISOString().split('T')[0]
    setExamDate(formattedDate)
    
    setStartTime(cleanTimeInput(entry.startTime))
    setEndTime(cleanTimeInput(entry.endTime))
    setRoom(entry.room || '')
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMessage(null)

    if (startTime >= endTime) {
      setErrorMessage("Start time must be before end time.")
      setSaving(false)
      return
    }

    const payload = {
      id: editingId,
      examId: selectedExamId,
      subject,
      examDate,
      startTime,
      endTime,
      room: room || null
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const response = await fetch('/api/staff/exam-timetable', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "An error occurred while saving the slot.")
      }

      setSuccessMessage(editingId ? "Exam schedule slot updated." : "Exam schedule slot added.")
      setIsModalOpen(false)
      fetchTimetable(selectedExamId)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setErrorMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exam schedule entry?")) {
      return
    }

    setErrorMessage(null)
    try {
      const response = await fetch(`/api/staff/exam-timetable?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete slot.")
      }

      setEntries(prev => prev.filter(item => item.id !== id))
      setSuccessMessage("Exam schedule entry deleted.")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setErrorMessage(err.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm gap-4">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
            Exam Scheduler Portal
          </span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Exam Timetable - {className} {sectionName}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Build and manage test dates, slot timings, and room allocations for scheduled exams.
          </p>
        </div>

        {exams.length > 0 && (
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm active:scale-95 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Exam Slot
          </button>
        )}
      </div>

      {/* Selector and Status */}
      {exams.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Active Exam:</span>
          <select
            value={selectedExamId}
            onChange={e => setSelectedExamId(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold bg-white text-slate-800"
          >
            {exams.map(e => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Success/Error alerts */}
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

      {/* Exam Timetable Display */}
      {exams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 px-6 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-4xl block">📋</span>
          <h3 className="font-bold text-slate-800 text-lg">No Exams Setup Yet</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            You must create an Exam entry in the "Manage Results" tab before you can build the exam schedule.
          </p>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm mt-2">Loading exam timetable...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 px-6 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-4xl block">🗓️</span>
          <h3 className="font-bold text-slate-800 text-lg">No Timetable Set</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            There are no exam date slots scheduled for this exam yet.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-sm rounded-xl transition-all"
          >
            Schedule First Slot
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 divide-y divide-slate-100">
            {entries.map(entry => {
              const formattedDate = new Date(entry.examDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })

              return (
                <div key={entry.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="text-sm font-semibold">{formattedDate}</span>
                    </div>

                    {/* Subject */}
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                      <span className="text-sm font-bold text-slate-800 capitalize">{entry.subject.toLowerCase()}</span>
                    </div>

                    {/* Timings */}
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm">{formatTime(entry.startTime)} - {formatTime(entry.endTime)}</span>
                    </div>

                    {/* Room */}
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm">{entry.room ? `Room ${entry.room}` : 'No Room'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => openEditModal(entry)}
                      className="p-2 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-lg border border-transparent hover:border-slate-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg border border-transparent hover:border-rose-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-95 transition-all">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">
                {editingId ? 'Edit Exam Slot' : 'Add Exam Slot'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                  required
                >
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Exam Date</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Room Location (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 101, Examination Hall A"
                  value={room}
                  onChange={e => setRoom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
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
