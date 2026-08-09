"use client"

import { useState } from "react"
import { Calendar, User, Printer, Award, FileText, CheckCircle2, AlertTriangle } from "lucide-react"

interface SubjectScore {
  subject: string
  obtained: number
  max: number
}

interface ExamResult {
  id: string
  examId: string
  examName: string
  examDate: string | null
  marks: SubjectScore[]
  remarks: string
  createdAt: string
}

interface Student {
  id: string
  firstName: string
  lastName: string
  rollNumber: number
  class_name: string
  section_name: string
  results: ExamResult[]
}

export default function ResultsFeed({ students }: { students: Student[] }) {
  const [activeStudentId, setActiveStudentId] = useState<string>(students[0]?.id || '')
  const [selectedExamId, setSelectedExamId] = useState<string>('')

  const activeStudent = students.find(s => s.id === activeStudentId)
  const results = activeStudent?.results || []

  // Default to first exam if none selected
  const activeExamId = selectedExamId || results[0]?.id || ''
  const activeResult = results.find(r => r.id === activeExamId)

  const handlePrint = () => {
    window.print()
  }

  const getSubjectGrade = (obtained: number, max: number) => {
    const pct = (obtained / max) * 100
    if (pct >= 90) return { grade: 'A+', color: 'text-emerald-700', label: 'Outstanding' }
    if (pct >= 80) return { grade: 'A', color: 'text-emerald-600', label: 'Excellent' }
    if (pct >= 70) return { grade: 'B', color: 'text-indigo-600', label: 'Very Good' }
    if (pct >= 60) return { grade: 'C', color: 'text-amber-600', label: 'Good' }
    if (pct >= 50) return { grade: 'D', color: 'text-amber-700', label: 'Satisfactory' }
    if (pct >= 35) return { grade: 'E', color: 'text-orange-700', label: 'Pass' }
    return { grade: 'F', color: 'text-rose-600', label: 'Fail' }
  }

  // Calculate totals
  const totalMax = activeResult?.marks.reduce((acc, m) => acc + m.max, 0) || 0
  const totalObtained = activeResult?.marks.reduce((acc, m) => acc + m.obtained, 0) || 0
  const overallPercentage = totalMax > 0 ? parseFloat(((totalObtained / totalMax) * 100).toFixed(1)) : 0
  
  // Determine overall status
  const isFailedAny = activeResult?.marks.some(m => (m.obtained / m.max) * 100 < 35)
  const overallStatus = overallPercentage >= 35 && !isFailedAny ? 'PASSED' : 'FAILED'

  const overallGrade = getSubjectGrade(totalObtained, totalMax).grade

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
        .report-header-title {
          font-family: 'Cinzel', serif;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #1a1209;
        }
        .report-header-sub {
          font-family: 'Cinzel', serif;
          font-size: 13px;
          letter-spacing: 0.1em;
          color: #8a7a5e;
        }
        .report-table th {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #633806;
          background: #FAEEDA;
          border: 1px solid #E8DFC8;
          text-transform: uppercase;
        }
        .report-table td {
          font-family: 'EB Garamond', serif;
          font-size: 16px;
          border: 1px solid #E8DFC8;
          color: #2c251e;
        }
        .signature-line {
          border-top: 1px dashed #BA7517;
          width: 140px;
          margin-top: 40px;
        }

        /* ══════════════════════════════════════════
           PRINT LAYOUT OPTIMIZATION (window.print)
        ══════════════════════════════════════════ */
        @media print {
          /* Hide all screen-only elements */
          body * {
            visibility: hidden;
          }
          /* Show only the active printable card */
          .printable-report-card, .printable-report-card * {
            visibility: visible;
          }
          .printable-report-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
          }
          .card-top-rule {
            background: #BA7517 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .report-table th {
            background: #FAEEDA !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Student Selector (Tabs) */}
      {students.length > 1 && (
        <div className="flex justify-center gap-3 mb-6 no-print">
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

      {/* Exam Selector Panel */}
      {results.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#FFFDF8] border border-[#E8DFC8] px-5 py-3 rounded-xl gap-4 mb-6 shadow-sm no-print">
          <div className="flex items-center gap-2 text-sm text-[#8a7a5e] font-semibold uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#BA7517]" />
            Select Examination:
          </div>

          <div className="flex items-center gap-3">
            <select
              value={activeExamId}
              onChange={e => setSelectedExamId(e.target.value)}
              className="px-3.5 py-1.5 border border-[#E8DFC8] rounded-lg focus:outline-none text-xs font-bold uppercase tracking-wider bg-white text-[#633806]"
            >
              {results.map(r => (
                <option key={r.id} value={r.id}>
                  {r.examName}
                </option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#BA7517] hover:bg-[#A06010] text-[#FFFDF8] rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 ? (
        <div className="bg-[#FFFDF8] border border-dashed border-[#E8DFC8] rounded-2xl py-16 px-6 text-center max-w-xl mx-auto space-y-3">
          <FileText className="w-12 h-12 text-[#E8DFC8] mx-auto" />
          <h3 className="font-bold text-[#1a1209] text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            No Examination Records
          </h3>
          <p className="text-sm text-[#8a7a5e] max-w-sm mx-auto">
            Exam report cards and grades are published once classroom examinations are completed and graded.
          </p>
        </div>
      ) : !activeResult ? (
        <div className="text-center py-12 text-slate-400">Loading exam result sheet...</div>
      ) : (
        /* Printable Report Card Card */
        <div className="artisan-card printable-report-card">
          <div className="card-top-rule"></div>

          <div className="p-8 space-y-8">
            {/* School Header Title Block */}
            <div className="text-center space-y-2 border-b-2 border-double border-[#E8DFC8] pb-6">
              <span className="text-2xl block mb-1">🏛️</span>
              <p className="report-header-sub">Academic Progress Transcript</p>
              {activeResult.examDate && (
                <p className="text-xs text-[#8a7a5e] font-semibold tracking-widest uppercase">
                  Exam Date: {new Date(activeResult.examDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>

            {/* Student Metadata Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-[#FAEEDA]/30 p-4 rounded-xl border border-[#E8DFC8] text-sm">
              <div>
                <span className="text-[10px] font-bold text-[#8a7a5e] uppercase tracking-wider block">Student Name</span>
                <span className="font-bold text-[#1a1209] text-base mt-0.5 block">
                  {activeStudent?.firstName} {activeStudent?.lastName}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8a7a5e] uppercase tracking-wider block">Roll Number</span>
                <span className="font-bold text-[#1a1209] text-base mt-0.5 block">
                  {activeStudent?.rollNumber || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8a7a5e] uppercase tracking-wider block">Class Grade</span>
                <span className="font-bold text-[#1a1209] text-base mt-0.5 block">
                  {activeStudent?.class_name}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8a7a5e] uppercase tracking-wider block">Section</span>
                <span className="font-bold text-[#1a1209] text-base mt-0.5 block">
                  {activeStudent?.section_name}
                </span>
              </div>
            </div>

            {/* Marks Sheet Table */}
            <div>
              <table className="w-full text-left report-table border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-3 border w-12 text-center">S.No</th>
                    <th className="px-4 py-3 border">Subject Name</th>
                    <th className="px-4 py-3 border text-center w-28">Max Marks</th>
                    <th className="px-4 py-3 border text-center w-28">Obtained</th>
                    <th className="px-4 py-3 border text-center w-24">Grade</th>
                    <th className="px-4 py-3 border text-center w-28">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {activeResult.marks.map((m, idx) => {
                    const gradeInfo = getSubjectGrade(m.obtained, m.max)
                    return (
                      <tr key={m.subject} className="hover:bg-[#FAEEDA]/10 transition-colors">
                        <td className="px-4 py-3 text-center font-semibold text-slate-500">{idx + 1}</td>
                        <td className="px-4 py-3 font-bold text-[#1a1209] capitalize">{m.subject.toLowerCase()}</td>
                        <td className="px-4 py-3 text-center font-medium">{m.max}</td>
                        <td className="px-4 py-3 text-center font-bold text-[#1a1209]">{m.obtained}</td>
                        <td className={`px-4 py-3 text-center font-extrabold ${gradeInfo.color}`}>
                          {gradeInfo.grade}
                        </td>
                        <td className="px-4 py-3 text-center text-xs italic text-slate-500">
                          {gradeInfo.label}
                        </td>
                      </tr>
                    )
                  })}
                  
                  {/* Totals Row */}
                  <tr className="bg-[#FAEEDA]/20 font-bold border-t-2 border-[#E8DFC8]">
                    <td colSpan={2} className="px-4 py-3 text-right uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif", fontSize: '12px' }}>
                      Aggregate Total
                    </td>
                    <td className="px-4 py-3 text-center">{totalMax}</td>
                    <td className="px-4 py-3 text-center text-[#1a1209]">{totalObtained}</td>
                    <td className="px-4 py-3 text-center text-[#BA7517] font-extrabold">{overallGrade}</td>
                    <td className="px-4 py-3 text-center text-xs text-[#8a7a5e]">
                      {overallPercentage}% Marks
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Results Status Callout */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-[#FAEEDA]/20 border border-[#E8DFC8] rounded-xl gap-4">
              <div className="flex items-center gap-3">
                {overallStatus === 'PASSED' ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
                )}
                <div>
                  <span className="text-[10px] font-bold text-[#8a7a5e] uppercase tracking-wider block">Result Status</span>
                  <span className={`font-bold text-lg leading-none ${overallStatus === 'PASSED' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {overallStatus === 'PASSED' ? 'PROMOTED / PASSED' : 'RE-EXAMINATION / FAILED'}
                  </span>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <span className="text-[10px] font-bold text-[#8a7a5e] uppercase tracking-wider block">Academic Grade</span>
                <span className="font-extrabold text-2xl text-[#BA7517] tracking-tight">{overallGrade}</span>
              </div>
            </div>

            {/* Remarks Section */}
            {activeResult.remarks && (
              <div className="p-4 bg-[#FFFDF8] border border-[#E8DFC8] rounded-xl">
                <span className="text-[10px] font-bold text-[#8a7a5e] uppercase tracking-wider block">Teacher's Evaluation / Remarks</span>
                <p className="text-slate-700 italic text-sm mt-1 leading-relaxed">
                  "{activeResult.remarks}"
                </p>
              </div>
            )}

            {/* Signatures Panel */}
            <div className="flex justify-between px-6 pt-8 border-t border-[#E8DFC8]/50">
              <div className="flex flex-col items-center">
                <div className="signature-line"></div>
                <span className="text-[10px] font-bold text-[#8a7a5e] uppercase tracking-wider mt-2">Class Teacher</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="signature-line"></div>
                <span className="text-[10px] font-bold text-[#8a7a5e] uppercase tracking-wider mt-2">Principal Seal</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
