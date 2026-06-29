"use client"

import { useState } from "react"
import { Calendar, User, Link2, BookOpen, Search, Filter } from "lucide-react"

interface ClassNote {
  id: string
  subject: string
  title: string
  content: string
  fileUrl: string | null
  createdAt: string
  teacher_name: string | null
}

interface Student {
  id: string
  firstName: string
  lastName: string
  class_name: string
  section_name: string
  notes: ClassNote[]
}

export default function NotesFeed({ students }: { students: Student[] }) {
  const [activeStudentId, setActiveStudentId] = useState<string>(students[0]?.id || '')
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL')

  const activeStudent = students.find(s => s.id === activeStudentId)
  const notes = activeStudent?.notes || []

  // Extract unique subjects for filtering
  const uniqueSubjects = Array.from(new Set(notes.map(n => n.subject.toUpperCase())))

  const filteredNotes = selectedSubject === 'ALL'
    ? notes
    : notes.filter(n => n.subject.toUpperCase() === selectedSubject)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] bg-[#FFFDF8] border border-[#E8DFC8] rounded-xl p-8 max-w-2xl mx-auto shadow-sm">
        <span className="text-4xl mb-3">📝</span>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No Academic Records</h3>
        <p className="text-sm text-gray-500 text-center">
          Class study materials and notes are visible once student enrollment is complete.
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
          transition: all 0.3s ease;
          position: relative;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px -2px rgba(139, 90, 26, 0.05);
        }
        .artisan-card:hover {
          border-color: #EF9F27;
          box-shadow: 0 6px 24px -2px rgba(139, 90, 26, 0.09);
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
        .artisan-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 500;
          color: #1a1209;
          line-height: 1.3;
        }
        .artisan-meta {
          font-family: 'EB Garamond', serif;
          font-size: 13px;
          color: #8a7a5e;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .artisan-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #E8DFC8 20%, #E8DFC8 80%, transparent);
          margin: 1rem 0;
        }
        .artisan-content {
          font-family: 'EB Garamond', serif;
          font-size: 16px;
          line-height: 1.65;
          color: #2c251e;
          white-space: pre-wrap;
        }
        .artisan-btn-download {
          font-family: 'Cinzel', serif;
          font-size: 12px;
          letter-spacing: 0.06em;
          color: #FFFDF8;
          background: #BA7517;
          border: 1px solid #BA7517;
          padding: 6px 14px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          text-shadow: 0 1px 1px rgba(0,0,0,0.1);
        }
        .artisan-btn-download:hover {
          background: #A06010;
          border-color: #A06010;
          box-shadow: 0 2px 8px rgba(186, 117, 23, 0.25);
        }
        .empty-parchment {
          background: #FFFDF8;
          border: 1px dashed #E8DFC8;
          border-radius: 12px;
          padding: 3rem 2rem;
          text-align: center;
        }
      `}</style>

      {/* Student Selection Tabs */}
      {students.length > 1 && (
        <div className="flex justify-center gap-3 mb-6">
          {students.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setActiveStudentId(s.id)
                setSelectedSubject('ALL')
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
          <span className="text-3xl mb-1 block">📜</span>
          <h2 className="text-2xl font-semibold text-[#1a1209] tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
            Class Study Materials & Notes
          </h2>
          <p className="text-sm text-[#8a7a5e] italic mt-1">
            Weekly academic files, notes, and references for {activeStudent?.firstName} ({activeStudent?.class_name} {activeStudent?.section_name})
          </p>
        </div>

        {/* Filters Panel */}
        {notes.length > 0 && (
          <div className="flex flex-wrap items-center justify-between bg-[#FFFDF8] border border-[#E8DFC8] px-5 py-3.5 rounded-xl gap-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-[#8a7a5e] font-semibold uppercase tracking-wider">
              <Filter className="w-4 h-4 text-[#BA7517]" />
              Filter by Subject:
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubject('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  selectedSubject === 'ALL'
                    ? 'bg-[#BA7517] text-white border border-[#BA7517]'
                    : 'bg-white text-[#8a7a5e] border border-[#E8DFC8] hover:bg-[#FAEEDA]/40'
                }`}
              >
                All Subjects
              </button>
              {uniqueSubjects.map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    selectedSubject === sub
                      ? 'bg-[#BA7517] text-white border border-[#BA7517]'
                      : 'bg-white text-[#8a7a5e] border border-[#E8DFC8] hover:bg-[#FAEEDA]/40'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Class Notes Feed */}
        {filteredNotes.length === 0 ? (
          <div className="empty-parchment">
            <BookOpen className="w-12 h-12 text-[#E8DFC8] mx-auto mb-3" />
            <h3 className="font-bold text-[#1a1209] text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              No Class Notes Published
            </h3>
            <p className="text-sm text-[#8a7a5e] max-w-sm mx-auto">
              {selectedSubject === 'ALL'
                ? `No class notes have been published yet for ${activeStudent?.firstName}'s section.`
                : `No notes published for the subject "${selectedSubject}" yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNotes.map(note => (
              <div key={note.id} className="artisan-card">
                <div className="card-top-rule"></div>
                
                <div className="p-6">
                  {/* Subject Tag & Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <span className="artisan-badge self-start">
                      {note.subject}
                    </span>
                    
                    <div className="artisan-meta">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#BA7517]" />
                        {formatDate(note.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#BA7517]" />
                        By {note.teacher_name || 'Staff Member'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="artisan-title mb-4">
                    {note.title}
                  </h3>

                  <div className="artisan-divider"></div>

                  {/* Body Content */}
                  <p className="artisan-content">
                    {note.content}
                  </p>

                  {/* Attachment Section */}
                  {note.fileUrl && (
                    <div className="mt-6 pt-4 border-t border-[#E8DFC8]/50 flex items-center justify-between">
                      <span className="text-xs text-[#8a7a5e] italic flex items-center gap-1">
                        <Link2 className="w-3.5 h-3.5 text-[#BA7517]" />
                        File attachment uploaded by teacher
                      </span>
                      <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="artisan-btn-download"
                      >
                        Download Material
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
