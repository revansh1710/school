"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Users, Save, CheckCircle2, XCircle, Clock, FileText } from "lucide-react"

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE"

interface AssignedSection {
  id: string
  name: string
  class_name: string
  isClassTeacher: boolean
  subject: string | null
}

interface Student {
  id: string
  firstName: string
  lastName: string
  rollNumber: number | null
}

interface AttendanceRecord {
  studentId?: string
  status: AttendanceStatus
  remarks: string
}

type AttendanceRecordMap = Record<string, AttendanceRecord>

export default function StaffAttendancePage() {
  const [sections, setSections] = useState<AssignedSection[]>([])
  const [selectedSection, setSelectedSection] = useState<AssignedSection | null>(null)
  
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecordMap>({})
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    fetch("/api/staff/sections")
      .then(res => res.json())
      .then(data => {
        setSections(data.sections || [])
        setLoading(false)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!selectedSection) return

    setLoading(true)
    fetch(`/api/staff/attendance?sectionId=${selectedSection.id}&date=${today}`)
      .then(res => res.json())
      .then(data => {
        setStudents(data.students || [])
        
        // Initialize records mapping
        const recordsMap: AttendanceRecordMap = {}
        
        // Default everyone to PRESENT if no records exist yet
        ;(data.students || []).forEach((s: Student) => {
          recordsMap[s.id] = { status: 'PRESENT', remarks: '' }
        })

        // Override with existing records from DB
        if (data.records && data.records.length > 0) {
          data.records.forEach((r: AttendanceRecord & { studentId: string }) => {
            recordsMap[r.studentId] = { status: r.status, remarks: r.remarks || '' }
          })
        }
        
        setAttendanceRecords(recordsMap)
        setLoading(false)
      })
      .catch(console.error)
  }, [selectedSection, today])

  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status: newStatus }
    }))
  }

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }))
  }

  const handleSave = async () => {
    if (!selectedSection) return
    setSaving(true)
    setMessage("")

    const payloadRecords = Object.keys(attendanceRecords).map(studentId => ({
      studentId,
      status: attendanceRecords[studentId].status,
      remarks: attendanceRecords[studentId].remarks
    }))

    try {
      const res = await fetch("/api/staff/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: selectedSection.id,
          date: today,
          records: payloadRecords
        })
      })

      if (res.ok) {
        setMessage("Attendance saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Failed to save attendance.")
      }
    } catch {
      setMessage("Error saving attendance.")
    } finally {
      setSaving(false)
    }
  }

  if (loading && sections.length === 0) return <div className="p-8">Loading your classes...</div>

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto h-[calc(100vh-10rem)]">
      
      {/* Sidebar: Sections List */}
      <div className="w-full md:w-80 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="font-semibold text-slate-800">My Classes</h2>
          <p className="text-xs text-slate-500 mt-1">Select a class to take attendance</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sections.length === 0 && (
            <p className="text-sm text-slate-500 text-center p-4">No sections assigned.</p>
          )}
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                selectedSection?.id === sec.id 
                  ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                  : 'bg-white border-transparent hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${selectedSection?.id === sec.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                  {sec.class_name} - {sec.name}
                </span>
                <Users className={`w-4 h-4 ${selectedSection?.id === sec.id ? 'text-indigo-500' : 'text-slate-400'}`} />
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center">
                {sec.isClassTeacher ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Class Teacher</span>
                ) : (
                  <span>Subject: {sec.subject || 'General'}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Area: Roster & Attendance */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {selectedSection ? (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="font-bold text-slate-800 text-lg">
                  {selectedSection.class_name} - Section {selectedSection.name}
                </h2>
                <p className="text-sm text-slate-500">Date: {format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
            
            {message && (
              <div className={`p-3 text-center text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                <div className="flex justify-center items-center h-32 text-slate-500">Loading students...</div>
              ) : students.length === 0 ? (
                <div className="text-center text-slate-500 mt-10">No enrolled students in this section.</div>
              ) : (
                <div className="space-y-3">
                  {students.map(student => {
                    const record = attendanceRecords[student.id] || { status: 'PRESENT', remarks: '' }
                    return (
                      <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                        <div className="flex items-center mb-4 sm:mb-0">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200">
                            {student.rollNumber || "-"}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-bold text-slate-800">{student.firstName} {student.lastName}</h3>
                            <p className="text-xs text-slate-500">ID: {student.id.substring(0,8)}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                          
                          {/* Remarks Input */}
                          {record.status !== 'PRESENT' && (
                            <div className="relative w-full sm:w-48">
                              <FileText className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
                              <input
                                type="text"
                                placeholder="Reason / Remarks"
                                value={record.remarks}
                                onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          )}

                          {/* Status Toggles */}
                          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                            <button
                              onClick={() => handleStatusChange(student.id, 'PRESENT')}
                              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                                record.status === 'PRESENT' ? 'bg-white text-green-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> P
                            </button>
                            <button
                              onClick={() => handleStatusChange(student.id, 'ABSENT')}
                              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                                record.status === 'ABSENT' ? 'bg-white text-red-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" /> A
                            </button>
                            <button
                              onClick={() => handleStatusChange(student.id, 'LATE')}
                              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                                record.status === 'LATE' ? 'bg-white text-amber-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5 mr-1" /> L
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <Users className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-slate-600">No Section Selected</h3>
            <p className="text-sm mt-1 text-center">Select a class from the sidebar to view the roster and mark attendance.</p>
          </div>
        )}
      </div>

    </div>
  )
}
