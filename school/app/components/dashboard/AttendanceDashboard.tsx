"use client"

import { useState } from "react"
import { Calendar, ChevronDown, ChevronUp } from "lucide-react"

interface AttendanceSummary {
  present: number
  absent: number
  late: number
  excused: number
  total: number
  percentage: number
}

interface AttendanceRecord {
  date: string | Date
  status: string
  remarks: string | null
}

interface Attendance {
  summary: AttendanceSummary
  records: AttendanceRecord[]
}

interface Student {
  id: string
  firstName: string
  lastName: string
  class_name: string
  section_name: string
  rollNumber: number
  attendance: Attendance
}

export default function AttendanceDashboard({ students }: { students: Student[] }) {
  const [expandedStudents, setExpandedStudents] = useState<Record<string, boolean>>({})

  const toggleHistory = (studentId: string) => {
    setExpandedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }))
  }

  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto">
        <span className="text-4xl mb-3">📅</span>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No Attendance Records</h3>
        <p className="text-sm text-gray-500 text-center">
          Attendance tracking is available once a student is fully enrolled in a class section.
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        .artisan-card {
          background: #FFFDF8;
          border: 0.5px solid #E8DFC8;
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.25s ease;
          position: relative;
          margin-bottom: 1.5rem;
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
        .artisan-label {
          font-family: 'EB Garamond', serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8a7a5e;
          line-height: 1.2;
          margin: 0 0 1px;
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
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.25rem" }}>
        <div className="artisan-header-icon">
          <Calendar size={20} />
        </div>
        <div>
          <p className="artisan-section-sub">Attendance Register</p>
          <h2 className="artisan-section-heading">Student Attendance logs</h2>
        </div>
      </div>

      <div className="artisan-header-rule" />

      {students.map((student) => (
        <div key={student.id} className="artisan-card">
          <div className="card-top-rule" />

          {/* Student Header */}
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
                {student.class_name || "Class pending"} — Section {student.section_name || "Pending"} (Roll #{student.rollNumber || "-"})
              </span>
            </div>
          </div>

          {/* Attendance Stats Body */}
          <div style={{ padding: "1.25rem" }}>
            {student.attendance ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <p className="artisan-label" style={{ margin: 0 }}>Attendance Rate</p>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: student.attendance.summary.percentage >= 90 ? "#3B6D11" : student.attendance.summary.percentage >= 75 ? "#B45309" : "#9B1C1C"
                  }}>
                    {student.attendance.summary.percentage}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div style={{ height: "6px", backgroundColor: "#FAEEDA", borderRadius: "3px", overflow: "hidden", marginBottom: "0.75rem" }}>
                  <div style={{
                    height: "100%",
                    width: `${student.attendance.summary.percentage}%`,
                    backgroundColor: student.attendance.summary.percentage >= 90 ? "#639922" : student.attendance.summary.percentage >= 75 ? "#D97706" : "#F05252",
                    borderRadius: "3px",
                    transition: "width 0.5s ease-out"
                  }} />
                </div>

                {/* Detailed metrics grid */}
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(4, 1fr)", 
                  gap: "4px", 
                  textAlign: "center", 
                  backgroundColor: "#FDFDFB", 
                  border: "0.5px solid #F3EDE0", 
                  borderRadius: "4px", 
                  padding: "8px 2px" 
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: "10px", color: "#8a7a5e", textTransform: "uppercase", letterSpacing: "0.05em" }}>Present</p>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold", color: "#3B6D11" }}>{student.attendance.summary.present}</p>
                  </div>
                  <div style={{ borderLeft: "0.5px solid #E8DFC8" }}>
                    <p style={{ margin: 0, fontSize: "10px", color: "#8a7a5e", textTransform: "uppercase", letterSpacing: "0.05em" }}>Absent</p>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold", color: "#9B1C1C" }}>{student.attendance.summary.absent}</p>
                  </div>
                  <div style={{ borderLeft: "0.5px solid #E8DFC8" }}>
                    <p style={{ margin: 0, fontSize: "10px", color: "#8a7a5e", textTransform: "uppercase", letterSpacing: "0.05em" }}>Late</p>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold", color: "#B45309" }}>{student.attendance.summary.late}</p>
                  </div>
                  <div style={{ borderLeft: "0.5px solid #E8DFC8" }}>
                    <p style={{ margin: 0, fontSize: "10px", color: "#8a7a5e", textTransform: "uppercase", letterSpacing: "0.05em" }}>Excused</p>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold", color: "#4B5563" }}>{student.attendance.summary.excused}</p>
                  </div>
                </div>

                {/* Collapsible Daily History List */}
                {student.attendance.records.length > 0 ? (
                  <div style={{ marginTop: "1rem" }}>
                    <button 
                      onClick={() => toggleHistory(student.id)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        padding: "6px",
                        background: "#FBF7EE",
                        border: "0.5px solid #E8DFC8",
                        borderRadius: "4px",
                        color: "#BA7517",
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      <span>{expandedStudents[student.id] ? "Hide Daily History" : "View Daily History"}</span>
                      {expandedStudents[student.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {expandedStudents[student.id] && (
                      <div style={{ 
                        marginTop: "0.5rem", 
                        maxHeight: "220px", 
                        overflowY: "auto", 
                        border: "0.5px solid #E8DFC8", 
                        borderRadius: "4px", 
                        backgroundColor: "#FFF",
                        padding: "4px"
                      }}>
                        {student.attendance.records.map((record, index) => {
                          let statusColor = "#3B6D11";
                          let statusBg = "#EAF3DE";
                          let statusBorder = "#639922";
                          if (record.status === 'ABSENT') {
                            statusColor = "#9B1C1C";
                            statusBg = "#FDF2F2";
                            statusBorder = "#F05252";
                          } else if (record.status === 'LATE') {
                            statusColor = "#B45309";
                            statusBg = "#FFF8E6";
                            statusBorder = "#D97706";
                          } else if (record.status === 'EXCUSED') {
                            statusColor = "#4B5563";
                            statusBg = "#F3F4F6";
                            statusBorder = "#9CA3AF";
                          }

                          return (
                            <div 
                              key={index} 
                              style={{ 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "center",
                                padding: "6px 8px", 
                                borderBottom: index === student.attendance.records.length - 1 ? "none" : "0.5px dashed #E8DFC8",
                                fontSize: "13px"
                              }}
                            >
                              <span style={{ color: "#2c1f0a" }}>
                                {new Date(record.date).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </span>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                {record.remarks && (
                                  <span 
                                    title={record.remarks}
                                    style={{ 
                                      fontSize: "11px", 
                                      color: "#8a7a5e", 
                                      fontStyle: "italic",
                                      maxWidth: "150px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap"
                                    }}
                                  >
                                    {record.remarks}
                                  </span>
                                )}
                                <span style={{
                                  fontSize: "10px",
                                  fontWeight: "500",
                                  letterSpacing: "0.05em",
                                  color: statusColor,
                                  backgroundColor: statusBg,
                                  border: `0.5px solid ${statusBorder}`,
                                  borderRadius: "2px",
                                  padding: "1px 4px",
                                  textTransform: "uppercase"
                                }}>
                                  {record.status}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center mt-3 font-sans italic">No daily records logged yet.</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center font-sans">No attendance records generated yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
