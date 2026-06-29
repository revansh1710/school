"use client"

import { Mail, Users } from "lucide-react"

interface Teacher {
  id: string
  name: string
  email: string
  subject: string
  isClassTeacher: boolean
}

interface Student {
  id: string
  firstName: string
  lastName: string
  class_name: string
  section_name: string
  rollNumber: number
  teachers: Teacher[]
}

export default function TeachersDashboard({ students }: { students: Student[] }) {
  const hasEnrolledStudentsWithTeachers = students.some(s => s.teachers && s.teachers.length > 0)

  if (!students || students.length === 0 || !hasEnrolledStudentsWithTeachers) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto">
        <span className="text-4xl mb-3">👥</span>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No Teacher Assignments</h3>
        <p className="text-sm text-gray-500 text-center">
          The subject teachers directory is available once a student is fully enrolled and classes are assigned.
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
        .email-contact-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 0.5px solid #E8DFC8;
          background-color: #FFFDF8;
          color: #BA7517;
          transition: all 0.2s;
        }
        .email-contact-btn:hover {
          border-color: #EF9F27 !important;
          background-color: #FAEEDA !important;
          color: #633806 !important;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.25rem" }}>
        <div className="artisan-header-icon">
          <Users size={20} />
        </div>
        <div>
          <p className="artisan-section-sub">Directory</p>
          <h2 className="artisan-section-heading">Class Teachers & Directory</h2>
        </div>
      </div>

      <div className="artisan-header-rule" />

      {students.map((student) => {
        if (!student.teachers || student.teachers.length === 0) return null

        return (
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
                  {student.class_name || "Class pending"} — Section {student.section_name || "Pending"}
                </span>
              </div>
            </div>

            {/* Subject Teachers Grid */}
            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "10px" }}>
              {student.teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  style={{
                    backgroundColor: "#FFF",
                    border: "0.5px solid #E8DFC8",
                    borderRadius: "6px",
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <p style={{ margin: 0, fontSize: "14.5px", fontWeight: "600", color: "#1a1209" }}>
                        {teacher.name}
                      </p>
                      {teacher.isClassTeacher && (
                        <span style={{
                          fontSize: "9px",
                          fontWeight: "600",
                          letterSpacing: "0.05em",
                          color: "#3B6D11",
                          backgroundColor: "#EAF3DE",
                          border: "0.5px solid #639922",
                          borderRadius: "2px",
                          padding: "0.5px 4px",
                          textTransform: "uppercase"
                        }}>
                          Class Teacher
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: "12.5px", color: "#8a7a5e" }}>
                      Subject: {teacher.subject || "General"}
                    </p>
                  </div>
                  
                  {teacher.email && (
                    <a
                      href={`mailto:${teacher.email}`}
                      title={`Email ${teacher.name}`}
                      className="email-contact-btn"
                    >
                      <Mail size={13} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
