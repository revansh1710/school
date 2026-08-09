"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, ClipboardList, BookOpen, AlertCircle } from "lucide-react"

interface ScheduleEntry {
  id: string
  subject: string
  examDate: string
  startTime: string
  endTime: string
  room: string | null
}

interface Exam {
  id: string
  name: string
  examDate: string | null
  schedule: ScheduleEntry[]
}

interface Student {
  id: string
  firstName: string
  lastName: string
  class_name: string
  section_name: string
  exams: Exam[]
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

export default function ExamTimetableFeed({ students }: { students: Student[] }) {
  const [activeStudentId, setActiveStudentId] = useState<string>(students[0]?.id || '')
  const [selectedExamId, setSelectedExamId] = useState<string>('')

  const activeStudent = students.find(s => s.id === activeStudentId)
  const exams = activeStudent?.exams || []

  // Default to first exam if none selected
  const activeExamId = selectedExamId || exams[0]?.id || ''
  const activeExam = exams.find(e => e.id === activeExamId)
  const schedule = activeExam?.schedule || []

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusPill = (examDateStr: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const examDate = new Date(examDateStr)
    examDate.setHours(0, 0, 0, 0)

    if (examDate.getTime() < today.getTime()) {
      return { text: "Completed", className: "bg-slate-100 text-slate-500 border-slate-200" }
    } else if (examDate.getTime() === today.getTime()) {
      return { text: "Today", className: "bg-amber-50 text-amber-700 border-amber-200 animate-pulse font-bold" }
    } else {
      return { text: "Scheduled", className: "bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold" }
    }
  }

  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] bg-[#FFFDF8] border border-[#E8DFC8] rounded-xl p-8 max-w-2xl mx-auto shadow-sm">
        <span className="text-4xl mb-3">📋</span>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No Academic Records</h3>
        <p className="text-sm text-gray-500 text-center">
          Exam timetables are visible once student enrollment is complete and dates are scheduled.
        </p>
      </div>
    )
  }

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-4 mb-8"
      style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Cinzel:wght@500;600;700&display=swap');

        .artisan-card {
          background: #FFFDF8;
          border: 0.5px solid #E8DFC8;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 4px 20px -2px rgba(139, 90, 26, 0.05);
        }
        .card-top-rule {
          height: 4px;
          background: repeating-linear-gradient(
            to right,
            #BA7517 0px,
            #BA7517 8px,
            transparent 8px,
            transparent 12px
          );
        }
        .artisan-badge {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #633806;
          background: #FAEEDA;
          border: 1px solid #E8DFC8;
          padding: 3px 10px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .artisan-header-title {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #1a1209;
        }
        .artisan-header-sub {
          font-family: 'Cinzel', serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #8a7a5e;
        }
        .artisan-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #E8DFC8 20%, #E8DFC8 80%, transparent);
          margin: 1rem 0;
        }
        .empty-parchment {
          background: #FFFDF8;
          border: 1px dashed #E8DFC8;
          border-radius: 12px;
          padding: 3rem 2rem;
          text-align: center;
        }
        .schedule-row {
          transition: border-color 0.25s ease;
        }
        .schedule-row:hover {
          border-color: #EF9F27;
        }
      `}</style>

      {/* Student Selector Tabs */}
      {students.length > 1 && (
        <div className="flex justify-center gap-3 mb-6">
          {students.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setActiveStudentId(s.id)
                setSelectedExamId('')
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeStudentId === s.id
                  ? 'bg-[#633806] text-[#FFFDF8] shadow-md border border-[#633806]'
                  : 'bg-[#FFFDF8] text-[#8a7a5e] border border-[#E8DFC8] hover:bg-[#FAEEDA]/50'
              }`}
            >
              {s.firstName} {s.lastName}
            </button>
          ))}
        </div>
      )}

      {/* Main Board Container */}
      <div className="space-y-6">
        {/* Banner header */}
        <div className="text-center py-6 px-4 bg-[#FFFDF8] border border-[#E8DFC8] rounded-2xl relative shadow-sm overflow-hidden">
          <div className="card-top-rule absolute top-0 left-0 right-0"></div>
          <span className="text-3xl mb-1 block">📅</span>
          <h1 className="artisan-header-title">Examination Timetable</h1>
          <p className="artisan-header-sub mt-1">
            Official test dates and locations for {activeStudent?.firstName} ({activeStudent?.class_name} {activeStudent?.section_name})
          </p>
        </div>

        {/* Filters Panel */}
        {exams.length > 0 && (
          <div className="flex flex-wrap items-center justify-between bg-[#FFFDF8] border border-[#E8DFC8] px-5 py-3.5 rounded-xl gap-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-[#8a7a5e] font-semibold uppercase tracking-wider">
              <ClipboardList className="w-4 h-4 text-[#BA7517]" />
              Select Examination:
            </div>
            
            <div>
              <select
                value={activeExamId}
                onChange={e => setSelectedExamId(e.target.value)}
                className="px-3.5 py-1.5 border border-[#E8DFC8] rounded-lg focus:outline-none text-xs font-bold uppercase tracking-wider bg-white text-[#633806]"
              >
                {exams.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Schedule List */}
        {exams.length === 0 ? (
          <div className="empty-parchment">
            <AlertCircle className="w-12 h-12 text-[#E8DFC8] mx-auto mb-3" />
            <h3 className="font-bold text-[#1a1209] text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              No Exams Scheduled
            </h3>
            <p className="text-sm text-[#8a7a5e] max-w-sm mx-auto">
              There are no examinations configured for {activeStudent?.firstName}'s class at this time.
            </p>
          </div>
        ) : schedule.length === 0 ? (
          <div className="empty-parchment">
            <Calendar className="w-12 h-12 text-[#E8DFC8] mx-auto mb-3" />
            <h3 className="font-bold text-[#1a1209] text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Timetable Pending
            </h3>
            <p className="text-sm text-[#8a7a5e] max-w-sm mx-auto">
              The exam schedule for "{activeExam?.name}" is currently being prepared by the class teacher.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedule.map(entry => {
              const status = getStatusPill(entry.examDate)
              return (
                <div key={entry.id} className="artisan-card schedule-row border border-[#E8DFC8] bg-[#FFFDF8] hover:border-[#EF9F27] transition-all duration-200">
                  <div className="card-top-rule"></div>

                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1">
                      {/* Date */}
                      <div className="flex items-center gap-2.5 text-[#1a1209]">
                        <Calendar className="w-4.5 h-4.5 text-[#BA7517] shrink-0" />
                        <span className="text-base font-bold">{formatDate(entry.examDate)}</span>
                      </div>

                      {/* Subject */}
                      <div className="flex items-center gap-2.5">
                        <span className="artisan-badge">
                          {entry.subject}
                        </span>
                      </div>

                      {/* Timing */}
                      <div className="flex items-center gap-2 text-[#8a7a5e]">
                        <Clock className="w-4 h-4 text-[#BA7517] shrink-0" />
                        <span className="text-sm font-medium">
                          {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-[#8a7a5e]">
                        <MapPin className="w-4 h-4 text-[#BA7517] shrink-0" />
                        <span className="text-sm font-medium">
                          {entry.room ? `Room ${entry.room}` : 'Main Examination Hall'}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="self-start md:self-center">
                      <span className={`px-2.5 py-1 rounded-md text-xs border ${status.className}`}>
                        {status.text}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
