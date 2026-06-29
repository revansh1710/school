"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, Edit2, Trash2, X, AlertTriangle, CheckCircle2 } from "lucide-react"

interface Student {
  id: string
  firstName: string
  lastName: string
  admissionStatus: string
  classId: string | null
  sectionId: string | null
  rollNumber: number | null
  class_name: string | null
  section_name: string | null
  isSanityOnly: boolean
  enrollmentType?: string | null
  feeWaiverReason?: string | null
  approvedBy?: string | null
  enrolledAt?: string | null
}

interface ClassItem {
  id: string
  name: string
}

interface SectionItem {
  id: string
  classId: string
  name: string
}

interface StudentManagerProps {
  initialStudents: Student[]
  classes: ClassItem[]
  sections: SectionItem[]
  currentSearch: string
  currentStatus: string
  currentClassId: string
}

export default function StudentManager({
  initialStudents,
  classes,
  sections,
  currentSearch,
  currentStatus,
  currentClassId,
}: StudentManagerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State for search and filter inputs
  const [searchInput, setSearchInput] = useState(currentSearch)
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [selectedClass, setSelectedClass] = useState(currentClassId)

  // Edit Modal State
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [editForm, setEditForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    rollNumber: "",
    admissionStatus: "",
    classId: "",
    sectionId: "",
    isSanityOnly: false,
    enrollmentType: "PAID",
    feeWaiverReason: "",
    approvedBy: "",
    customFeeWaiverReason: "",
  })

  // Delete State
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Sync state with URL search params when they change
  useEffect(() => {
    setSearchInput(currentSearch)
    setSelectedStatus(currentStatus)
    setSelectedClass(currentClassId)
  }, [currentSearch, currentStatus, currentClassId])

  // Apply URL filters
  const applyFilters = (updates: { search?: string; status?: string; classId?: string }) => {
    const params = new URLSearchParams(searchParams.toString())

    if (updates.search !== undefined) {
      if (updates.search) params.set("search", updates.search)
      else params.delete("search")
    }
    if (updates.status !== undefined) {
      if (updates.status) params.set("status", updates.status)
      else params.delete("status")
    }
    if (updates.classId !== undefined) {
      if (updates.classId) params.set("class", updates.classId)
      else params.delete("class")
    }

    router.push(`/admin/students?${params.toString()}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters({ search: searchInput })
  }

  const handleClearFilters = () => {
    setSearchInput("")
    setSelectedStatus("")
    setSelectedClass("")
    router.push("/admin/students")
  }

  // Edit actions
  const openEditModal = (student: Student) => {
    setEditingStudent(student)
    setEditForm({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      rollNumber: student.rollNumber !== null ? student.rollNumber.toString() : "",
      admissionStatus: student.admissionStatus,
      classId: student.classId || "",
      sectionId: student.sectionId || "",
      isSanityOnly: student.isSanityOnly,
      enrollmentType: student.enrollmentType || "PAID",
      feeWaiverReason: student.feeWaiverReason || "",
      approvedBy: student.approvedBy || "",
      customFeeWaiverReason: "",
    })
    setError(null)
  }

  const closeEditModal = () => {
    setEditingStudent(null)
  }

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditForm(prev => {
      const updated = { ...prev, [name]: value }
      // If class changes, reset section
      if (name === "classId") {
        updated.sectionId = ""
      }
      return updated
    })
  }

  const saveStudentChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/admin/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (res.ok) {
        setSuccessMessage("Student record updated successfully")
        setEditingStudent(null)
        router.refresh()
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        const data = await res.json()
        setError(data.error || "Failed to save changes")
      }
    } catch {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Delete actions
  const handleDeleteConfirm = async () => {
    if (!deletingStudentId) return
    setLoading(true)
    setError(null)

    const student = initialStudents.find(s => s.id === deletingStudentId)
    const isSanityOnly = student?.isSanityOnly || false

    try {
      const res = await fetch(`/api/admin/students?id=${deletingStudentId}&isSanityOnly=${isSanityOnly}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setSuccessMessage("Student deleted successfully")
        setDeletingStudentId(null)
        router.refresh()
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        const data = await res.json()
        setError(data.error || "Failed to delete student")
      }
    } catch {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Get available sections for selected class in edit form
  const availableSections = sections.filter(s => s.classId === editForm.classId)

  return (
    <div className="flex flex-col space-y-6">
      {/* Success Notification */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-500 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" />
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Filters Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, roll no or ID..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-slate-400"
            />
          </form>

          {/* Select Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Class Filter */}
            <div className="flex items-center gap-1.5 text-sm w-full sm:w-auto">
              <span className="text-slate-500 font-medium whitespace-nowrap">Class:</span>
              <select
                value={selectedClass}
                onChange={e => {
                  setSelectedClass(e.target.value)
                  applyFilters({ classId: e.target.value })
                }}
                className="block w-full sm:w-40 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="">All Classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-sm w-full sm:w-auto">
              <span className="text-slate-500 font-medium whitespace-nowrap">Status:</span>
              <select
                value={selectedStatus}
                onChange={e => {
                  setSelectedStatus(e.target.value)
                  applyFilters({ status: e.target.value })
                }}
                className="block w-full sm:w-44 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="ENROLLED">Enrolled</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="INTERVIEW">Interview</option>
                <option value="DOCUMENTS">Documents</option>
                <option value="ENQUIRY">Enquiry</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(currentSearch || currentStatus || currentClassId) && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Class & Section
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {initialStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200 shadow-sm">
                        {student.firstName[0]}
                        {student.lastName?.[0] || ""}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">
                            {student.firstName} {student.lastName}
                          </span>
                          {student.isSanityOnly && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wide">
                              Applicant
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-500">ID: {student.id.substring(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {student.class_name || "Unassigned"}
                    </div>
                    <div className="text-sm text-slate-500">
                      {student.isSanityOnly ? "Assign section on Accept" : (student.section_name ? `Section ${student.section_name}` : "Section -")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                      {student.isSanityOnly ? "N/A" : (student.rollNumber || "N/A")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        student.admissionStatus === "ENROLLED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : student.admissionStatus === "ACCEPTED"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : student.admissionStatus === "REJECTED"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {student.admissionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(student)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Student"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => setDeletingStudentId(student.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {initialStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No students match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in scale-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">Edit Student Record</h3>
              <button
                onClick={closeEditModal}
                className="p-1 rounded-lg hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveStudentChanges} className="p-6 space-y-4">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-start gap-2">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={editForm.firstName}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={editForm.lastName}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Class
                  </label>
                  <select
                    name="classId"
                    value={editForm.classId}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Unassigned</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Section
                  </label>
                  <select
                    name="sectionId"
                    value={editForm.sectionId}
                    onChange={handleEditFormChange}
                    disabled={!editForm.classId || editForm.isSanityOnly}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{editForm.isSanityOnly ? "Assign on Accept" : "Unassigned"}</option>
                    {!editForm.isSanityOnly && availableSections.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Roll Number
                  </label>
                  <input
                    type="number"
                    name="rollNumber"
                    value={editForm.rollNumber}
                    onChange={handleEditFormChange}
                    disabled={editForm.isSanityOnly}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={editForm.isSanityOnly ? "Assign on Accept" : "e.g. 15"}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Admission Status
                  </label>
                  <select
                    name="admissionStatus"
                    required
                    value={editForm.admissionStatus}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="ENQUIRY">Enquiry</option>
                    <option value="DOCUMENTS">Documents</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="ENROLLED">Enrolled</option>
                  </select>
                </div>
              </div>

              {editForm.admissionStatus === "ENROLLED" && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4 col-span-2 text-left">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Enrollment Audit Trail</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Enrollment Type
                      </label>
                      <select
                        name="enrollmentType"
                        value={editForm.enrollmentType}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="PAID">Paid</option>
                        <option value="FEE_WAIVER">Fee Waiver</option>
                        <option value="MANUAL_APPROVAL">Manual Approval</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Approved By
                      </label>
                      <input
                        type="text"
                        name="approvedBy"
                        value={editForm.approvedBy}
                        onChange={handleEditFormChange}
                        placeholder="e.g. Principal / Administrator"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {(editForm.enrollmentType === "FEE_WAIVER" || editForm.enrollmentType === "MANUAL_APPROVAL") && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Reason
                      </label>
                      <select
                        name="feeWaiverReason"
                        value={editForm.feeWaiverReason}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="">-- Select Reason --</option>
                        <option value="Scholarship">Scholarship</option>
                        <option value="Staff Child">Staff Child</option>
                        <option value="Management Approval">Management Approval</option>
                        <option value="Existing Student Migration">Existing Student Migration</option>
                        <option value="Other">Other</option>
                      </select>
                      {editForm.feeWaiverReason === "Other" && (
                        <input
                          type="text"
                          name="customFeeWaiverReason"
                          value={editForm.customFeeWaiverReason}
                          onChange={handleEditFormChange}
                          placeholder="Specify custom reason"
                          className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in scale-in-95 duration-200 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 border border-red-200 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Delete Student?</h3>
                <p className="text-sm text-slate-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete this student record from the database? This will also remove any related parent-student associations.
            </p>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                disabled={loading}
                onClick={() => setDeletingStudentId(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-500 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
