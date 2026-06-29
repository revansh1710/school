"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, User, Grid, List } from "lucide-react"

interface TimetableEntry {
  id: string
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  startTime: string
  endTime: string
  subject: string
  teacher_name: string | null
  room: string | null
}

interface Student {
  id: string
  firstName: string
  lastName: string
  class_name: string
  section_name: string
  timetable: TimetableEntry[]
}

const DAYS_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'] as const;

const formatTime = (timeStr: string) => {
  // timeStr is usually in format "HH:MM:SS" or "HH:MM"
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
};

export default function TimetableDashboard({ students }: { students: Student[] }) {
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly')
  const [activeDay, setActiveDay] = useState<typeof DAYS_ORDER[number]>('MONDAY')

  const hasTimetable = students.some(s => s.timetable && s.timetable.length > 0)

  if (!students || students.length === 0 || !hasTimetable) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto">
        <span className="text-4xl mb-3">🗓️</span>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No Timetable Scheduled</h3>
        <p className="text-sm text-gray-500 text-center">
          Weekly timetable schedule is available once a student is fully enrolled and class sections are active.
        </p>
      </div>
    )
  }

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-4 mb-8"
      style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        .artisan-card {
          background: #FFFDF8;
          border: 0.5px solid #E8DFC8;
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.25s ease;
          position: relative;
          margin-bottom: 2rem;
        }
        .artisan-card:hover {
          border-color: #EF9F27;
        }
        .card-top-rule {
          height: 3px;
          background: repeating-linear-gradient(
            to right,
            #BA7517 0px,
            #BA7517 6px,
            transparent 6px,
            transparent 10px
          );
        }
        .artisan-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #FAEEDA;
          border: 1px solid #EF9F27;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .artisan-avatar-text {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 500;
          color: #633806;
          line-height: 1;
          letter-spacing: 0.03em;
        }
        .artisan-name {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 500;
          color: #1a1209;
          margin: 0 0 3px;
          line-height: 1.25;
        }
        .artisan-class-subtitle {
          font-family: 'EB Garamond', serif;
          font-size: 12px;
          letter-spacing: 0.05em;
          color: #8a7a5e;
          text-transform: uppercase;
        }
        .artisan-section-heading {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 500;
          font-style: italic;
          color: #1a1209;
          letter-spacing: 0.01em;
          margin: 0;
          line-height: 1.2;
        }
        .artisan-section-sub {
          font-family: 'EB Garamond', serif;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8a7a5e;
          margin: 2px 0 0;
        }
        .artisan-header-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid #BA7517;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #BA7517;
        }
        .artisan-header-rule {
          height: 1.5px;
          background: #E8DFC8;
          margin: 0 0 1.5rem;
          position: relative;
        }
        .artisan-header-rule::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 56px;
          height: 2px;
          background: #BA7517;
          margin-top: -0.5px;
        }

        /* Toggle Buttons styling */
        .toggle-btn {
          font-family: 'EB Garamond', serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 6px 12px;
          border: 0.5px solid #E8DFC8;
          background: #FFFDF8;
          color: #633806;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .toggle-btn.active {
          background: #BA7517;
          color: #FFF;
          border-color: #BA7517;
        }

        /* Weekly View Grid Table */
        .weekly-grid {
          display: grid;
          grid-template-columns: 80px repeat(5, 1fr);
          border: 0.5px solid #E8DFC8;
          background: #FFF;
          border-radius: 8px;
          overflow: hidden;
        }
        .grid-header-cell {
          font-family: 'Playfair Display', serif;
          font-weight: 500;
          text-align: center;
          background: #FBF7EE;
          padding: 12px 6px;
          font-size: 14px;
          border-bottom: 0.5px solid #E8DFC8;
          border-right: 0.5px solid #E8DFC8;
          color: #633806;
        }
        .grid-header-cell:last-child {
          border-right: none;
        }
        .grid-time-cell {
          font-family: 'EB Garamond', serif;
          font-size: 12px;
          font-weight: 600;
          color: #8a7a5e;
          text-align: center;
          padding: 14px 4px;
          border-bottom: 0.5px dashed #E8DFC8;
          border-right: 0.5px solid #E8DFC8;
          background: #FFFDF8;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .grid-slot-cell {
          border-bottom: 0.5px dashed #E8DFC8;
          border-right: 0.5px dashed #E8DFC8;
          padding: 10px;
          min-height: 80px;
          background: #FFF;
          transition: background-color 0.2s;
        }
        .grid-slot-cell:hover {
          background: #FFFDF5;
        }
        .grid-slot-cell:last-child {
          border-right: none;
        }
        .weekly-grid-row:last-child .grid-time-cell,
        .weekly-grid-row:last-child .grid-slot-cell {
          border-bottom: none;
        }

        .slot-subject {
          font-family: 'Playfair Display', serif;
          font-weight: 500;
          font-size: 13.5px;
          color: #1a1209;
          margin-bottom: 4px;
        }
        .slot-meta {
          font-family: 'EB Garamond', serif;
          font-size: 11px;
          color: #8a7a5e;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 2px;
        }

        /* Day Selector for Mobile / Daily View */
        .day-tab {
          font-family: 'EB Garamond', serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 8px 14px;
          border: none;
          background: transparent;
          color: #8a7a5e;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .day-tab.active {
          color: #BA7517;
          border-bottom-color: #BA7517;
        }

        /* Timeline list view */
        .timeline-container {
          position: relative;
          padding-left: 20px;
          border-left: 1px solid #E8DFC8;
          margin-left: 10px;
          margin-top: 1.5rem;
        }
        .timeline-item {
          position: relative;
          margin-bottom: 1.5rem;
        }
        .timeline-item::before {
          content: '';
          position: absolute;
          left: -25px;
          top: 6px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #BA7517;
          border: 2px solid #FFFDF8;
        }
      `}</style>

      {/* Header & Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div className="artisan-header-icon">
            <Calendar size={20} />
          </div>
          <div>
            <p className="artisan-section-sub">Academic Schedule</p>
            <h2 className="artisan-section-heading">Class Timetable</h2>
          </div>
        </div>

        {/* View toggles */}
        <div style={{ display: "flex", borderRadius: "6px", overflow: "hidden" }}>
          <button 
            className={`toggle-btn ${viewMode === 'weekly' ? 'active' : ''}`}
            onClick={() => setViewMode('weekly')}
            style={{ borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px" }}
          >
            <Grid size={13} />
            <span>Weekly Grid</span>
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => setViewMode('daily')}
            style={{ borderTopRightRadius: "6px", borderBottomRightRadius: "6px" }}
          >
            <List size={13} />
            <span>Daily View</span>
          </button>
        </div>
      </div>

      <div className="artisan-header-rule" />

      {students.map((student) => {
        if (!student.timetable || student.timetable.length === 0) return null

        // 1. Group weekly timetable by time slots and days
        const uniqueTimeSlots = Array.from(
          new Set(
            student.timetable.map(t => `${t.startTime}-${t.endTime}`)
          )
        ).sort((a, b) => a.localeCompare(b));

        return (
          <div key={student.id} className="artisan-card">
            <div className="card-top-rule" />

            {/* Student card header */}
            <div
              style={{
                padding: "1rem 1.25rem 0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                borderBottom: "0.5px solid #E8DFC8",
              }}
            >
              <div className="artisan-avatar">
                <span className="artisan-avatar-text">
                  {student.firstName[0]}
                  {student.lastName?.[0] ?? ""}
                </span>
              </div>
              <div>
                <p className="artisan-name">
                  {student.firstName} {student.lastName}
                </p>
                <span className="artisan-class-subtitle">
                  {student.class_name} — Section {student.section_name} Weekly Schedule
                </span>
              </div>
            </div>

            {/* Timetable view */}
            <div style={{ padding: "1.25rem" }}>
              {viewMode === 'weekly' ? (
                /* ── WEEKLY GRID VIEW ── */
                <div style={{ overflowX: "auto" }}>
                  <div className="weekly-grid" style={{ minWidth: "750px" }}>
                    {/* Header Row */}
                    <div className="grid-header-cell">Time</div>
                    {DAYS_ORDER.map(day => (
                      <div key={day} className="grid-header-cell">{day}</div>
                    ))}

                    {/* Slot Rows */}
                    {uniqueTimeSlots.map((slotStr, rowIndex) => {
                      const [start, end] = slotStr.split('-');
                      const displayTime = `${formatTime(start)}\n-\n${formatTime(end)}`;

                      return (
                        <div key={slotStr} style={{ display: "contents" }} className="weekly-grid-row">
                          {/* Time Column */}
                          <div className="grid-time-cell" style={{ whiteSpace: "pre-line", lineHeight: 1.3 }}>
                            {displayTime}
                          </div>

                          {/* Day Columns */}
                          {DAYS_ORDER.map(day => {
                            const entry = student.timetable.find(t => 
                              t.dayOfWeek === day && `${t.startTime}-${t.endTime}` === slotStr
                            );

                            return (
                              <div key={day} className="grid-slot-cell">
                                {entry ? (
                                  <div>
                                    <p className="slot-subject">{entry.subject}</p>
                                    {entry.teacher_name && (
                                      <p className="slot-meta">
                                        <User size={10} style={{ color: "#BA7517" }} />
                                        <span>{entry.teacher_name}</span>
                                      </p>
                                    )}
                                    {entry.room && (
                                      <p className="slot-meta">
                                        <MapPin size={10} style={{ color: "#BA7517" }} />
                                        <span>{entry.room}</span>
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontSize: "12px", color: "#E0D7C4" }}>—</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ── DAILY VIEW ── */
                <div>
                  {/* Day tabs selection */}
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    borderBottom: "1px solid #E8DFC8", 
                    marginBottom: "1rem" 
                  }}>
                    {DAYS_ORDER.map(day => {
                      const dayCount = student.timetable.filter(t => t.dayOfWeek === day).length;
                      return (
                        <button
                          key={day}
                          className={`day-tab ${activeDay === day ? 'active' : ''}`}
                          onClick={() => setActiveDay(day)}
                          style={{ flex: 1 }}
                        >
                          <span>{day.substring(0, 3)} ({dayCount})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Day timetable list */}
                  {student.timetable.filter(t => t.dayOfWeek === activeDay).length > 0 ? (
                    <div className="timeline-container">
                      {student.timetable
                        .filter(t => t.dayOfWeek === activeDay)
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map((entry) => (
                          <div key={entry.id} className="timeline-item">
                            <div style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              backgroundColor: "#FFF",
                              border: "0.5px solid #E8DFC8",
                              borderRadius: "6px",
                              padding: "10px 14px",
                              marginLeft: "5px"
                            }}>
                              <div>
                                <p style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#1a1209", fontFamily: "'Playfair Display', serif" }}>
                                  {entry.subject}
                                </p>
                                <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                                  {entry.teacher_name && (
                                    <p style={{ margin: 0, fontSize: "12px", color: "#8a7a5e", display: "flex", alignItems: "center", gap: "4px" }}>
                                      <User size={11} style={{ color: "#BA7517" }} />
                                      <span>{entry.teacher_name}</span>
                                    </p>
                                  )}
                                  {entry.room && (
                                    <p style={{ margin: 0, fontSize: "12px", color: "#8a7a5e", display: "flex", alignItems: "center", gap: "4px" }}>
                                      <MapPin size={11} style={{ color: "#BA7517" }} />
                                      <span>{entry.room}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#BA7517" }}>
                                <Clock size={12} />
                                <span style={{ fontSize: "12.5px", fontWeight: "600" }}>
                                  {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "2rem", color: "#8a7a5e", fontStyle: "italic" }}>
                      No classes scheduled for {activeDay}.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  )
}
