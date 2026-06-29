import StudentManager from "@/app/components/admin/StudentManager"
import { query } from "../../../../lib/db"
import { serverClient } from "@/app/lib/sanity/serverClient"
import { getStaffUser } from "../../../../lib/adminAuth"
import { redirect } from "next/navigation"

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
    status?: string
    class?: string
  }>
}) {
  const user = await getStaffUser()
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect("/admin/login")
  }
  const isSuperAdmin = user.role === 'SUPER_ADMIN'

  const params = await searchParams
  const search = params.search || ""
  const status = params.status || ""
  const classId = params.class || ""

  // Fetch data in parallel
  const [studentRes, classesRes, sectionsRes, sanityEnquiries] = await Promise.all([
    isSuperAdmin
      ? query(`
          SELECT 
            s.*, 
            c.name as class_name, 
            sec.name as section_name,
            u.email as parent_email
          FROM "Student" s
          LEFT JOIN "Class" c ON s."classId" = c.id
          LEFT JOIN "Section" sec ON s."sectionId" = sec.id
          LEFT JOIN "ParentStudent" ps ON s.id = ps."studentId"
          LEFT JOIN "User" u ON ps."parentId" = u.id
        `)
      : query(`
          SELECT 
            s.*, 
            c.name as class_name, 
            sec.name as section_name,
            u.email as parent_email
          FROM "Student" s
          JOIN "AdminClass" ac ON s."classId" = ac."classId" AND ac."adminId" = $1
          LEFT JOIN "Class" c ON s."classId" = c.id
          LEFT JOIN "Section" sec ON s."sectionId" = sec.id
          LEFT JOIN "ParentStudent" ps ON s.id = ps."studentId"
          LEFT JOIN "User" u ON ps."parentId" = u.id
        `, [user.id]),
    isSuperAdmin
      ? query('SELECT id, name FROM "Class" ORDER BY "order" ASC')
      : query(`
          SELECT c.id, c.name 
          FROM "Class" c 
          JOIN "AdminClass" ac ON c.id = ac."classId" 
          WHERE ac."adminId" = $1 
          ORDER BY c."order" ASC
        `, [user.id]),
    isSuperAdmin
      ? query('SELECT id, "classId", name FROM "Section" ORDER BY name ASC')
      : query(`
          SELECT s.id, s."classId", s.name 
          FROM "Section" s 
          JOIN "AdminClass" ac ON s."classId" = ac."classId" 
          WHERE ac."adminId" = $1 
          ORDER BY s.name ASC
        `, [user.id]),
    serverClient.fetch(`*[_type == "admissionEnquiry"]`)
  ])

  // Map PG students
  const pgStudents = studentRes.rows.map((row: any) => ({
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    admissionStatus: row.admissionStatus,
    classId: row.classId,
    sectionId: row.sectionId,
    rollNumber: row.rollNumber,
    class_name: row.class_name,
    section_name: row.section_name,
    parent_email: row.parent_email,
    isSanityOnly: false,
    enrollmentType: row.enrollmentType,
    feeWaiverReason: row.feeWaiverReason,
    approvedBy: row.approvedBy,
    enrolledAt: row.enrolledAt ? new Date(row.enrolledAt).toISOString() : null,
  }))

  const classes = classesRes.rows
  const mergedStudents = [...pgStudents]

  // Merge Sanity enquiries
  for (const enquiry of sanityEnquiries) {
    if (enquiry.status === "withdrawn") {
      continue
    }

    const email = enquiry.email?.toLowerCase().trim() || ""
    const name = enquiry.studentName?.toLowerCase().trim() || ""

    // Match conditions: same parent email and student name
    const isMatched = pgStudents.some((pg: any) => {
      const pgEmail = pg.parent_email?.toLowerCase().trim() || ""
      const pgName = `${pg.firstName} ${pg.lastName}`.toLowerCase().trim()
      return pgEmail === email && pgName === name
    })

    if (!isMatched) {
      const studentName = enquiry.studentName || "Unknown"
      const nameParts = studentName.trim().split(" ")
      const firstName = nameParts[0]
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""

      const grade = enquiry.grade || ""
      const matchingClass = classes.find((c: any) => c.name.toLowerCase().trim() === grade.toLowerCase().trim())
      
      if (!matchingClass && !isSuperAdmin) {
        continue
      }

      const resolvedClassId = matchingClass ? matchingClass.id : null
      const resolvedClassName = matchingClass ? matchingClass.name : (grade || null)

      let admissionStatus = "ENQUIRY"
      if (enquiry.status === "new" || enquiry.status === "contacted") {
        admissionStatus = "ENQUIRY"
      } else if (enquiry.status === "documents_submitted") {
        admissionStatus = "DOCUMENTS"
      } else if (enquiry.status === "interview_scheduled") {
        admissionStatus = "INTERVIEW"
      } else if (enquiry.status === "accepted") {
        admissionStatus = "ACCEPTED"
      } else if (enquiry.status === "rejected") {
        admissionStatus = "REJECTED"
      }

      mergedStudents.push({
        id: enquiry._id,
        firstName,
        lastName,
        admissionStatus,
        classId: resolvedClassId,
        sectionId: null,
        rollNumber: null,
        class_name: resolvedClassName,
        section_name: null,
        parent_email: enquiry.email || null,
        isSanityOnly: true,
        enrollmentType: null,
        feeWaiverReason: null,
        approvedBy: null,
        enrolledAt: null,
      })
    }
  }

  // Filter in memory
  let filteredStudents = mergedStudents

  if (search) {
    const searchLower = search.toLowerCase()
    filteredStudents = filteredStudents.filter((s: any) => 
      s.firstName.toLowerCase().includes(searchLower) ||
      s.lastName.toLowerCase().includes(searchLower) ||
      (s.rollNumber !== null && String(s.rollNumber).includes(searchLower)) ||
      s.id.toLowerCase().includes(searchLower)
    )
  }

  if (status) {
    filteredStudents = filteredStudents.filter((s: any) => s.admissionStatus === status)
  }

  if (classId) {
    filteredStudents = filteredStudents.filter((s: any) => s.classId === classId)
  }

  // Sort: class order, then section name, then roll number, then name
  const classOrderMap = new Map(classes.map((c: any, index: number) => [c.id, index]))
  filteredStudents.sort((a: any, b: any) => {
    const orderA = a.classId ? (classOrderMap.get(a.classId) ?? 9999) : 9999
    const orderB = b.classId ? (classOrderMap.get(b.classId) ?? 9999) : 9999
    if (orderA !== orderB) return orderA - orderB

    const secA = a.section_name || ""
    const secB = b.section_name || ""
    if (secA !== secB) return secA.localeCompare(secB)

    const rollA = a.rollNumber ?? 9999
    const rollB = b.rollNumber ?? 9999
    if (rollA !== rollB) return rollA - rollB

    const nameA = `${a.firstName} ${a.lastName}`
    const nameB = `${b.firstName} ${b.lastName}`
    return nameA.localeCompare(nameB)
  })

  return (
    <div className="flex flex-col space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Students Database</h2>
        <p className="text-sm text-slate-500 mt-1">Manage and view all enrolled and prospective students</p>
      </div>

      <StudentManager
        initialStudents={filteredStudents}
        classes={classes}
        sections={sectionsRes.rows}
        currentSearch={search}
        currentStatus={status}
        currentClassId={classId}
      />
    </div>
  )
}


