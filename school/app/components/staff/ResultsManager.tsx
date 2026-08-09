"use client"

import { useState, useEffect } from "react"
import { Award, Plus, Trash2, Edit3, X, Check, AlertCircle, FileSpreadsheet, User, ChevronRight, Save } from "lucide-react"

interface Exam {
  id: string
  name: string
  examDate: string | null
}

interface Student {
  id: string
  firstName: string
  lastName: string
  rollNumber: number
}

interface SubjectScore {
  subject: string
  obtained: number
  max: number
}

interface StudentResultState {
  studentId: string
  marks: SubjectScore[]
  remarks: string
  hasChanged?: boolean
}

interface ResultsManagerProps {
  initialExams: Exam[]
  sectionId: string
  className: string
  sectionName: string
  subjects: string[]
}

export default function ResultsManager({
  initialExams,
  sectionId,
  className,
  sectionName,
  subjects
}: ResultsManagerProps) {
  // Deduplicate and initialize subject list combining query subjects and standard fallbacks
  const initialSubjects = Array.from(new Set([
    ...subjects,
    ...['Mathematics', 'Science', 'English', 'Sanskrit', 'Social Studies']
  ]))
  const [subjectList, setSubjectList] = useState<string[]>(initialSubjects)
  const [customSubject, setCustomSubject] = useState('')

  const [exams, setExams] = useState<Exam[]>(initialExams)
  const [selectedExamId, setSelectedExamId] = useState<string>(initialExams[0]?.id || '')
  
  // Student & Marks State
  const [students, setStudents] = useState<Student[]>([])
  const [resultsMap, setResultsMap] = useState<Record<string, StudentResultState>>({})
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Exam Creation Modal
  const [isExamModalOpen, setIsExamModalOpen] = useState(false)
  const [newExamName, setNewExamName] = useState('')
  const [newExamDate, setNewExamDate] = useState('')

  // Marks Entry Modal
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null)
  const [tempMarks, setTempMarks] = useState<SubjectScore[]>([])
  const [tempRemarks, setTempRemarks] = useState('')

  // Fetch results when exam changes
  const fetchResults = async (examId: string) => {
    if (!examId) return
    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/staff/results?examId=${examId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch student results.")
      }

      setStudents(data.students || [])

      // Extract any unique subjects that exist in the database results
      const dbResultSubjects: string[] = []
      data.results.forEach((r: any) => {
        if (Array.isArray(r.marks)) {
          r.marks.forEach((m: any) => {
            if (m.subject && !dbResultSubjects.includes(m.subject)) {
              dbResultSubjects.push(m.subject)
            }
          })
        }
      })

      // Merge current list with any dbResultSubjects
      const mergedSubjectList = Array.from(new Set([
        ...initialSubjects,
        ...dbResultSubjects
      ]))

      // Build key-value map of existing results
      const map: Record<string, StudentResultState> = {}
      
      // Seed all students with default empty marks
      data.students.forEach((s: Student) => {
        map[s.id] = {
          studentId: s.id,
          marks: mergedSubjectList.map(sub => ({ subject: sub, obtained: 0, max: 100 })),
          remarks: ''
        }
      })

      // Overwrite with database records
      data.results.forEach((r: any) => {
        const dbMarks = Array.isArray(r.marks) ? r.marks : []
        
        const mergedMarks = mergedSubjectList.map(sub => {
          const matched = dbMarks.find((m: any) => m.subject.toLowerCase() === sub.toLowerCase())
          return {
            subject: sub,
            obtained: matched ? matched.obtained : 0,
            max: matched ? matched.max : 100
          }
        })

        map[r.studentId] = {
          studentId: r.studentId,
          marks: mergedMarks,
          remarks: r.remarks || ''
        }
      })

      setResultsMap(map)
      setSubjectList(mergedSubjectList)
    } catch (err: any) {
      setErrorMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedExamId) {
      fetchResults(selectedExamId)
    } else {
      setStudents([])
      setResultsMap({})
    }
  }, [selectedExamId])

  const handleAddCustomSubject = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!customSubject.trim()) return

    const newSub = customSubject.trim()
    const alreadyExists = subjectList.some(s => s.toLowerCase() === newSub.toLowerCase())
    if (alreadyExists) {
      alert("Subject already exists.")
      return
    }

    setSubjectList(prev => [...prev, newSub])

    setResultsMap(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(studentId => {
        next[studentId] = {
          ...next[studentId],
          marks: [
            ...next[studentId].marks,
            { subject: newSub, obtained: 0, max: 100 }
          ],
          hasChanged: true
        }
      })
      return next
    })

    setCustomSubject('')
  }

  // Create Exam Header
  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newExamName) return
    setErrorMessage(null)

    try {
      const response = await fetch('/api/staff/results/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId,
          name: newExamName,
          examDate: newExamDate || null
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to create exam.")
      }

      setExams(prev => [data.exam, ...prev])
      setSelectedExamId(data.exam.id)
      setIsExamModalOpen(false)
      setNewExamName('')
      setNewExamDate('')
      setSuccessMessage("Exam created successfully. You can now enter marks.")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setErrorMessage(err.message)
    }
  }

  // Delete Exam Header
  const handleDeleteExam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exam? This will permanently delete all grades and marks sheets associated with this exam.")) {
      return
    }

    setErrorMessage(null)
    try {
      const response = await fetch(`/api/staff/results/exams?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete exam.")
      }

      const updated = exams.filter(e => e.id !== id)
      setExams(updated)
      setSelectedExamId(updated[0]?.id || '')
      setSuccessMessage("Exam deleted successfully.")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setErrorMessage(err.message)
    }
  }

  // Edit Marks Modal opener
  const openMarksModal = (studentId: string) => {
    const record = resultsMap[studentId]
    if (!record) return

    setActiveStudentId(studentId)
    setTempMarks(JSON.parse(JSON.stringify(record.marks))) // deep copy
    setTempRemarks(record.remarks)
    setIsExamModalOpen(false)
  }

  // Apply changes from modal to client state
  const handleApplyMarks = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeStudentId) return

    setResultsMap(prev => ({
      ...prev,
      [activeStudentId]: {
        studentId: activeStudentId,
        marks: tempMarks,
        remarks: tempRemarks,
        hasChanged: true
      }
    }))

    setActiveStudentId(null)
  }

  // Batch Save all marks to Postgres
  const handleSaveAllResults = async () => {
    setSaving(true)
    setErrorMessage(null)

    // Gather records that have been edited
    const updatedRecords = Object.values(resultsMap).filter(r => r.hasChanged)

    if (updatedRecords.length === 0) {
      setErrorMessage("No marks changes detected to save.")
      setSaving(false)
      return
    }

    try {
      const response = await fetch('/api/staff/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: selectedExamId,
          results: updatedRecords.map(r => ({
            studentId: r.studentId,
            marks: r.marks,
            remarks: r.remarks
          }))
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save marks.")
      }

      // Reset change flags
      setResultsMap(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(key => {
          next[key].hasChanged = false
        })
        return next
      })

      setSuccessMessage("All student exam marks published and saved successfully!")
      setTimeout(() => setSuccessMessage(null), 4000)
    } catch (err: any) {
      setErrorMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  const hasUnsavedChanges = Object.values(resultsMap).some(r => r.hasChanged)

  const activeStudent = students.find(s => s.id === activeStudentId)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm gap-4">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
            Class Registrar Dashboard
          </span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Manage Exam Results - {className} {sectionName}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Create exams, edit student report cards, and publish scores to the parent dashboard.
          </p>
        </div>

        <button
          onClick={() => setIsExamModalOpen(true)}
          className="inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm active:scale-95 gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Exam
        </button>
      </div>

      {/* Selector and Save Bar */}
      {exams.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Exam:</span>
            <select
              value={selectedExamId}
              onChange={e => setSelectedExamId(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold bg-white text-slate-800"
            >
              {exams.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name} {e.examDate ? `(${new Date(e.examDate).toLocaleDateString()})` : ''}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleDeleteExam(selectedExamId)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
              title="Delete Active Exam"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {hasUnsavedChanges && (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5 animate-pulse">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Unsaved modifications detected
              </span>
              <button
                onClick={handleSaveAllResults}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-sm rounded-xl transition-all shadow-sm gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save & Publish'}
              </button>
            </div>
          )}
          
          {/* Active Subjects Banner */}
          <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 w-full">
            <span className="font-bold text-slate-500 uppercase tracking-wider mr-1">Active Report Subjects:</span>
            {subjectList.map(s => (
              <span key={s} className="px-2 py-0.5 bg-white border border-slate-200 rounded font-semibold text-slate-700 capitalize">
                {s.toLowerCase()}
              </span>
            ))}
            
            <div className="flex items-center gap-1.5 ml-auto pt-2 sm:pt-0">
              <input
                type="text"
                placeholder="New Subject"
                value={customSubject}
                onChange={e => setCustomSubject(e.target.value)}
                className="px-2 py-1 border border-slate-200 rounded text-xs w-28 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              />
              <button
                type="button"
                onClick={handleAddCustomSubject}
                className="px-2.5 py-1 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 text-xs shadow-sm transition-all"
              >
                + Add Subject
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Student List Sheet */}
      {exams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 px-6 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-4xl block">📊</span>
          <h3 className="font-bold text-slate-800 text-lg">No Exams Created Yet</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            To start entering student grades, first create an exam entry (e.g. "Quarterly Exam" or "Final Term").
          </p>
          <button
            onClick={() => setIsExamModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-sm rounded-xl transition-all"
          >
            Create Exam Entry
          </button>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm mt-2">Loading students list...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-12 px-6 text-center text-slate-400 italic text-sm">
          No students are currently enrolled in {className} {sectionName}.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">Roll No</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Remarks</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(s => {
                const record = resultsMap[s.id]
                const totalMax = record?.marks.reduce((acc, m) => acc + m.max, 0) || 0
                const totalObtained = record?.marks.reduce((acc, m) => acc + m.obtained, 0) || 0
                const percent = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0

                // Check if any marks have been loaded/modified
                const isEntered = totalObtained > 0 || record?.remarks

                return (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                      {s.rollNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {s.firstName.substring(0, 1)}{s.lastName.substring(0, 1)}
                        </div>
                        <div className="text-sm font-bold text-slate-800">
                          {s.firstName} {s.lastName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isEntered ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          Total: {totalObtained}/{totalMax} ({percent}%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-500">
                          Pending
                        </span>
                      )}
                      {record?.hasChanged && (
                        <span className="ml-2 text-[10px] text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded font-semibold animate-pulse">
                          Modified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                      {record?.remarks || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openMarksModal(s.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 rounded-lg text-xs font-semibold bg-white hover:bg-indigo-50/20 transition-all shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Enter Marks
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Exam Creation Modal */}
      {isExamModalOpen && !activeStudentId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-95 transition-all">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">Create Exam Sheet</h3>
              <button
                onClick={() => setIsExamModalOpen(false)}
                className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Exam Title</label>
                <input
                  type="text"
                  placeholder="e.g. Mid-Term Examination, Terminal Test 1"
                  value={newExamName}
                  onChange={e => setNewExamName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Exam Date (Optional)</label>
                <input
                  type="date"
                  value={newExamDate}
                  onChange={e => setNewExamDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Marks Entry Modal */}
      {activeStudentId && activeStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-95 transition-all">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  Report Card - {activeStudent.firstName} {activeStudent.lastName}
                </h3>
                <p className="text-xs text-slate-500">Roll Number: {activeStudent.rollNumber || 'N/A'}</p>
              </div>
              <button
                onClick={() => setActiveStudentId(null)}
                className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyMarks} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide border-b pb-1">Subject-wise Scores</h4>
                
                <div className="space-y-3">
                  {tempMarks.map((m, idx) => (
                    <div key={m.subject} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 gap-4">
                      <span className="text-sm font-semibold text-slate-700 capitalize flex-1">{m.subject.toLowerCase()}</span>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Obtained"
                          value={m.obtained}
                          min={0}
                          max={m.max}
                          onChange={e => {
                            const val = parseFloat(e.target.value) || 0
                            setTempMarks(prev => prev.map((item, i) => i === idx ? { ...item, obtained: val } : item))
                          }}
                          className="w-20 px-2 py-1 text-center border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-bold bg-white"
                          required
                        />
                        <span className="text-slate-400 text-sm">/</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={m.max}
                          min={1}
                          onChange={e => {
                            const val = parseFloat(e.target.value) || 100
                            setTempMarks(prev => prev.map((item, i) => i === idx ? { ...item, max: val } : item))
                          }}
                          className="w-16 px-2 py-1 text-center border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-slate-500 bg-white"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Teacher Remarks / Feedback</label>
                <textarea
                  placeholder="e.g. Excellent child. Attentive in Sanskrit lessons."
                  value={tempRemarks}
                  onChange={e => setTempRemarks(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveStudentId(null)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
                >
                  Apply Grades
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
