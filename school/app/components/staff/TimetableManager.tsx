"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, User, Plus, Edit2, Trash2, X, AlertCircle, Check } from "lucide-react"

interface TimetableEntry {
  id: string
  sectionId: string
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  startTime: string
  endTime: string
  subject: string
  teacherId: string | null
  teacher_name: string | null
  room: string | null
}

interface Teacher {
  id: string
  name: string
}

interface TimetableManagerProps {
  initialTimetable: TimetableEntry[]
  sectionId: string
  className: string
  sectionName: string
  teachers: Teacher[]
}

const DAYS_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const;

const formatTime = (timeStr: string) => {
  if (!timeStr) return "";
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
};

// Strips seconds if present (e.g., "08:30:00" -> "08:30")
const cleanTimeInput = (timeStr: string) => {
  if (!timeStr) return "";
  const parts = timeStr.split(':');
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return timeStr;
};

export default function TimetableManager({
  initialTimetable,
  sectionId,
  className,
  sectionName,
  teachers
}: TimetableManagerProps) {
  const [timetable, setTimetable] = useState<TimetableEntry[]>(initialTimetable)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [dayOfWeek, setDayOfWeek] = useState<typeof DAYS_ORDER[number]>('MONDAY')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [subject, setSubject] = useState('')
  const [teacherId, setTeacherId] = useState('')
  const [room, setRoom] = useState('')

  const openAddModal = () => {
    setEditingId(null)
    setDayOfWeek('MONDAY')
    setStartTime('08:30')
    setEndTime('09:30')
    setSubject('')
    setTeacherId('')
    setRoom('')
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const openEditModal = (entry: TimetableEntry) => {
    setEditingId(entry.id)
    setDayOfWeek(entry.dayOfWeek)
    setStartTime(cleanTimeInput(entry.startTime))
    setEndTime(cleanTimeInput(entry.endTime))
    setSubject(entry.subject)
    setTeacherId(entry.teacherId || '')
    setRoom(entry.room || '')
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    if (startTime >= endTime) {
      setErrorMessage("Start time must be before end time.")
      setLoading(false)
      return
    }

    const payload = {
      id: editingId,
      sectionId,
      dayOfWeek,
      startTime,
      endTime,
      subject,
      teacherId: teacherId || null,
      room: room || null
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const response = await fetch('/api/staff/timetable', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "An error occurred while saving the slot.")
      }

      // Refresh timetable list
      if (editingId) {
        setTimetable(prev => prev.map(item => item.id === editingId ? {
          ...item,
          dayOfWeek,
          startTime,
          endTime,
          subject,
          teacherId: teacherId || null,
          teacher_name: teachers.find(t => t.id === teacherId)?.name || null,
          room: room || null
        } : item))
        setSuccessMessage("Timetable slot updated successfully.")
      } else {
        const newEntry: TimetableEntry = {
          id: data.entry.id,
          sectionId: data.entry.sectionId,
          dayOfWeek: data.entry.dayOfWeek,
          startTime: data.entry.startTime,
          endTime: data.entry.endTime,
          subject: data.entry.subject,
          teacherId: data.entry.teacherId,
          teacher_name: teachers.find(t => t.id === data.entry.teacherId)?.name || null,
          room: data.entry.room
        }
        setTimetable(prev => [...prev, newEntry])
        setSuccessMessage("New timetable slot added successfully.")
      }

      setIsModalOpen(false)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setErrorMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class slot from the timetable?")) {
      return
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/staff/timetable?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete slot.")
      }

      setTimetable(prev => prev.filter(item => item.id !== id))
      setSuccessMessage("Timetable slot removed successfully.")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setErrorMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Organize timetable by day
  const timetableByDay = DAYS_ORDER.reduce((acc, day) => {
    acc[day] = timetable
      .filter(item => item.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
    return acc
  }, {} as Record<typeof DAYS_ORDER[number], TimetableEntry[]>)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm gap-4">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
            Class Teacher Dashboard
          </span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Manage Timetable - {className} {sectionName}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Create, modify, and manage the weekly class schedule below. All changes sync immediately with parents' dashboards.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm hover:shadow active:scale-95 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Schedule Slot
        </button>
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

      {/* Grid View of Weekly Days */}
      <div className="grid grid-cols-1 gap-6">
        {DAYS_ORDER.map(day => {
          const dayEntries = timetableByDay[day]
          return (
            <div key={day} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-bold text-slate-800 capitalize tracking-wide">{day.toLowerCase()}</h3>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">
                  {dayEntries.length} {dayEntries.length === 1 ? 'Slot' : 'Slots'}
                </span>
              </div>

              {dayEntries.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm italic">
                  No slots scheduled for {day.toLowerCase()}.
                </div>
              ) : (
                <div className="p-6 divide-y divide-slate-100">
                  {dayEntries.map(entry => (
                    <div key={entry.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Class Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1">
                        {/* Timings */}
                        <div className="flex items-center gap-2.5 text-slate-700">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <div className="text-sm font-semibold">
                            {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                          </div>
                        </div>

                        {/* Subject */}
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                          <span className="text-sm font-bold text-slate-800">{entry.subject}</span>
                        </div>

                        {/* Teacher */}
                        <div className="flex items-center gap-2 text-slate-600">
                          <User className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="text-sm">{entry.teacher_name || 'Unassigned'}</span>
                        </div>

                        {/* Room */}
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="text-sm">{entry.room ? `Room ${entry.room}` : 'No Room'}</span>
                        </div>
                      </div>

                      {/* CRUD Actions */}
                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => openEditModal(entry)}
                          className="p-2 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                          title="Edit Class Slot"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                          title="Delete Class Slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-95 transition-all">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">
                {editingId ? 'Edit Schedule Slot' : 'Add New Schedule Slot'}
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
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Day of Week</label>
                <select
                  value={dayOfWeek}
                  onChange={e => setDayOfWeek(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                  required
                >
                  {DAYS_ORDER.map(d => (
                    <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics, English"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Teacher</label>
                <select
                  value={teacherId}
                  onChange={e => setTeacherId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Room / Location</label>
                <input
                  type="text"
                  placeholder="e.g. 101, Lab A"
                  value={room}
                  onChange={e => setRoom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                />
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
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center min-w-[80px]"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
