"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Shield, User as UserIcon } from "lucide-react"

interface StaffMember {
  id: string
  name: string
  username: string
}

interface Assignment {
  id: string
  teacherName: string
  teacherUsername: string
  isClassTeacher: boolean
  subject: string | null
}

interface Section {
  id: string
  name: string
  assignments: Assignment[]
}

interface ManagedClass {
  id: string
  name: string
  sections: Section[]
}

export default function AdminStaffManagementPage() {
  const [classes, setClasses] = useState<ManagedClass[]>([])
  const [staffList, setStaffList] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  // Form states for new assignment
  const [addingToSection, setAddingToSection] = useState<string | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [isClassTeacher, setIsClassTeacher] = useState(false)
  const [subject, setSubject] = useState("")

  // Super Admin AdminClass states
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [adminsList, setAdminsList] = useState<StaffMember[]>([])
  const [adminAssignments, setAdminAssignments] = useState<any[]>([])
  const [addingAdminToClass, setAddingAdminToClass] = useState<string | null>(null)
  const [selectedAdmin, setSelectedAdmin] = useState("")

  const loadData = (showLoading = true) => {
    if (showLoading) setLoading(true)
    fetch("/api/admin/staff-assignments")
      .then(res => res.json())
      .then(data => {
        if (data.classes) setClasses(data.classes)
        if (data.staff) setStaffList(data.staff)
        setIsSuperAdmin(!!data.isSuperAdmin)
        if (data.admins) setAdminsList(data.admins)
        if (data.adminAssignments) setAdminAssignments(data.adminAssignments)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddAssignment = async (e: React.FormEvent<HTMLFormElement>, sectionId: string) => {
    e.preventDefault()
    setMessage("")
    if (!selectedTeacher) return

    try {
      const res = await fetch("/api/admin/staff-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD",
          sectionId,
          teacherId: selectedTeacher,
          isClassTeacher,
          subject
        })
      })

      if (res.ok) {
        setAddingToSection(null)
        setSelectedTeacher("")
        setIsClassTeacher(false)
        setSubject("")
        loadData(false) // reload data
      } else {
        const d = await res.json()
        setMessage(d.error || "Failed to add assignment")
      }
    } catch {
      setMessage("Error adding assignment")
    }
  }

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to remove this teacher from this section?")) return
    
    setMessage("")
    try {
      const res = await fetch("/api/admin/staff-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          assignmentId
        })
      })

      if (res.ok) {
        loadData(false)
      } else {
        const d = await res.json()
        setMessage(d.error || "Failed to remove assignment")
      }
    } catch {
      setMessage("Error removing assignment")
    }
  }

  const handleAddAdminAssignment = async (e: React.FormEvent<HTMLFormElement>, classId: string) => {
    e.preventDefault()
    setMessage("")
    if (!selectedAdmin) return

    try {
      const res = await fetch("/api/admin/staff-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_ADMIN_CLASS",
          classId,
          adminId: selectedAdmin
        })
      })

      if (res.ok) {
        setAddingAdminToClass(null)
        setSelectedAdmin("")
        loadData(false)
      } else {
        const d = await res.json()
        setMessage(d.error || "Failed to add admin assignment")
      }
    } catch {
      setMessage("Error adding admin assignment")
    }
  }

  const handleDeleteAdminAssignment = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to remove this administrator from this class?")) return

    setMessage("")
    try {
      const res = await fetch("/api/admin/staff-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE_ADMIN_CLASS",
          assignmentId
        })
      })

      if (res.ok) {
        loadData(false)
      } else {
        const d = await res.json()
        setMessage(d.error || "Failed to remove admin assignment")
      }
    } catch {
      setMessage("Error removing admin assignment")
    }
  }

  if (loading && classes.length === 0) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Management</h2>
        <p className="text-sm text-slate-500 mt-1">Assign teachers to classes and sections under your administration.</p>
      </div>

      {message && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium border border-red-200">
          {message}
        </div>
      )}

      <div className="space-y-6">
        {classes.length === 0 && (
          <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500">
            You do not currently manage any classes.
          </div>
        )}

        {classes.map(cls => {
          const classAdmins = adminAssignments.filter((a: any) => a.classId === cls.id)
          return (
            <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-800">{cls.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {cls.sections.length} Sections
                </span>
              </div>
              
              {isSuperAdmin && (
                <div className="px-6 py-3 bg-indigo-50/20 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Class Admins:</span>
                    {classAdmins.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No admins assigned</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {classAdmins.map((admin: any) => (
                          <span key={admin.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-indigo-100 text-indigo-700 shadow-sm">
                            {admin.admin_name} ({admin.admin_username})
                            <button 
                              onClick={() => handleDeleteAdminAssignment(admin.id)}
                              className="text-indigo-400 hover:text-red-500 transition-colors ml-1 font-bold text-sm leading-none"
                              title="Remove Admin"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {addingAdminToClass === cls.id ? (
                    <form onSubmit={(e) => handleAddAdminAssignment(e, cls.id)} className="flex items-center gap-2">
                      <select
                        required
                        value={selectedAdmin}
                        onChange={e => setSelectedAdmin(e.target.value)}
                        className="py-1 px-2 border border-slate-300 bg-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">-- Choose Admin --</option>
                        {adminsList.map(a => (
                          <option key={a.id} value={a.id}>{a.name} ({a.username})</option>
                        ))}
                      </select>
                      <button type="submit" className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">Save</button>
                      <button 
                        type="button" 
                        onClick={() => { setAddingAdminToClass(null); setSelectedAdmin(""); }} 
                        className="px-2.5 py-1 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <button 
                      onClick={() => setAddingAdminToClass(cls.id)}
                      className="inline-flex items-center px-2.5 py-1 border border-indigo-200 rounded-lg text-xs font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Assign Admin
                    </button>
                  )}
                </div>
              )}
            
            <div className="divide-y divide-slate-100">
              {cls.sections.map(sec => (
                <div key={sec.id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-700 flex items-center">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mr-3 text-sm">
                        {sec.name}
                      </span>
                      Section {sec.name}
                    </h4>
                    
                    {addingToSection !== sec.id && (
                      <button 
                        onClick={() => setAddingToSection(sec.id)}
                        className="mt-3 sm:mt-0 inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Assign Teacher
                      </button>
                    )}
                  </div>

                  {addingToSection === sec.id && (
                    <form onSubmit={(e) => handleAddAssignment(e, sec.id)} className="mb-6 p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex flex-col sm:flex-row gap-4 items-end">
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Select Teacher</label>
                        <select 
                          required
                          value={selectedTeacher}
                          onChange={e => setSelectedTeacher(e.target.value)}
                          className="block w-full py-2 px-3 border border-slate-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">-- Choose Staff --</option>
                          {staffList.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.username})</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-full sm:w-32">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Role Type</label>
                        <label className="flex items-center py-2 text-sm text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={isClassTeacher}
                            onChange={e => setIsClassTeacher(e.target.checked)}
                            className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          Class Teacher
                        </label>
                      </div>
                      <div className="w-full sm:w-48">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Math, English"
                          value={subject}
                          onChange={e => setSubject(e.target.value)}
                          className="block w-full py-2 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button type="button" onClick={() => setAddingToSection(null)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Save</button>
                      </div>
                    </form>
                  )}

                  {sec.assignments.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No teachers assigned to this section yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {sec.assignments.map(assign => (
                        <div key={assign.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white hover:border-blue-100 hover:shadow-sm transition-all group">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-slate-500">
                              <UserIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 flex items-center">
                                {assign.teacherName}
                                {assign.isClassTeacher && (
                                  <span title="Class Teacher">
                                    <Shield className="w-3.5 h-3.5 text-blue-500 ml-1.5" aria-hidden="true" />
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-slate-500">{assign.subject || "General"} - {assign.teacherUsername}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteAssignment(assign.id)}
                            className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                            title="Remove Assignment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
