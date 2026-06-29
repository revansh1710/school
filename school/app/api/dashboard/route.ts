import { getCurrentUser } from "../../../lib/auth"
import { client } from "../../../sanity/lib/client"
import { getRequiredDocumentsForEnquiry } from "../../../lib/admissionConfig"
import { query } from "../../../lib/db"
import { provisionStudentForEnquiry } from "../../../lib/studentProvision"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const enquiries = await client.fetch(
      `*[_type == "admissionEnquiry" && email == $email]{
        _id,
        parentName,
        email,
        studentName,
        grade,
        gradeCategory,
        requiredDocuments,
        documentsStatus,
        status,
        interviewDate,
        interviewApprovalStatus,
        documents
      }`,
      { email: user.email },
      { cache: 'no-store' }
    )

    const formattedEnquiries = enquiries && enquiries.length > 0 ? enquiries.map((enquiry: any) => {
      const requiredDocs = getRequiredDocumentsForEnquiry(enquiry)
      const uploadedDocs = enquiry.documents || {}
      const uploadedCount = Object.keys(uploadedDocs).length
      const allDocsUploaded = requiredDocs.length > 0 && uploadedCount === requiredDocs.length

      return {
        _id: enquiry._id,
        parentName: enquiry.parentName,
        studentName: enquiry.studentName,
        grade: enquiry.grade,
        gradeCategory: enquiry.gradeCategory,
        status: enquiry.status ?? "new",
        documentsStatus: enquiry.documentsStatus || "pending",
        interviewDate: enquiry.interviewDate || null,
        interviewApprovalStatus: enquiry.interviewApprovalStatus || "none",
        requiredDocuments: requiredDocs,
        uploadedDocuments: uploadedDocs,
        stats: {
          total: requiredDocs.length,
          uploaded: uploadedCount,
          completed: allDocsUploaded
        }
      }
    }) : []

    // Auto-provision student records for any ACCEPTED enquiries
    const acceptedEnquiries = formattedEnquiries.filter((e: any) => e.status === "accepted")
    for (const enquiry of acceptedEnquiries) {
      try {
        await provisionStudentForEnquiry(user.id, enquiry.studentName, enquiry.grade)
      } catch (err) {
        console.error(`Error auto-provisioning student for enquiry ${enquiry._id}:`, err)
      }
    }

    const studentRes = await query(`
      SELECT s.*, c.name as class_name, sec.name as section_name
      FROM "Student" s
      JOIN "ParentStudent" ps ON s.id = ps."studentId"
      LEFT JOIN "Class" c ON s."classId" = c.id
      LEFT JOIN "Section" sec ON s."sectionId" = sec.id
      WHERE ps."parentId" = $1
    `, [user.id])

    const studentIds = studentRes.rows.map((s: any) => s.id)
    const sectionIds = Array.from(new Set(studentRes.rows.map((s: any) => s.sectionId).filter(Boolean)))
    let attendanceRecords: any[] = []
    let invoices: any[] = []
    let teachers: any[] = []

    if (studentIds.length > 0) {
      const queries: Promise<any>[] = [
        query(`
          SELECT ar."studentId", ar.status, ar.remarks, a.date
          FROM "AttendanceRecord" ar
          JOIN "Attendance" a ON ar."attendanceId" = a.id
          WHERE ar."studentId" = ANY($1)
          ORDER BY a.date DESC
        `, [studentIds]),
        query(`
          SELECT * FROM "Invoice"
          WHERE "studentId" = ANY($1)
          ORDER BY "createdAt" DESC
        `, [studentIds])
      ]

      if (sectionIds.length > 0) {
        queries.push(
          query(`
            SELECT ts."sectionId", ts.id, ts."isClassTeacher", ts.subject, u.email, u."parentName" as name
            FROM "TeacherSection" ts
            JOIN "User" u ON ts."teacherId" = u.id
            WHERE ts."sectionId" = ANY($1)
          `, [sectionIds])
        )
      }

      const results = await Promise.all(queries)
      attendanceRecords = results[0].rows
      invoices = results[1].rows
      if (results[2]) {
        teachers = results[2].rows
      }
    }

    const enrolledStudents = studentRes.rows.map((student: any) => {
      const studentAtt = attendanceRecords.filter(r => r.studentId === student.id)
      const studentInvoices = invoices.filter(i => i.studentId === student.id)
      const studentTeachers = teachers.filter(t => t.sectionId === student.sectionId)
      
      const present = studentAtt.filter(r => r.status === 'PRESENT').length
      const absent = studentAtt.filter(r => r.status === 'ABSENT').length
      const late = studentAtt.filter(r => r.status === 'LATE').length
      const excused = studentAtt.filter(r => r.status === 'EXCUSED').length
      const total = studentAtt.length
      
      const attended = present + late
      const percentage = total > 0 ? Math.round((attended / total) * 100) : 100

      return {
        ...student,
        attendance: {
          summary: { present, absent, late, excused, total, percentage },
          records: studentAtt.map(r => ({
            date: r.date,
            status: r.status,
            remarks: r.remarks
          }))
        },
        invoices: studentInvoices.map(i => ({
          id: i.id,
          amount: i.amount,
          description: i.description,
          status: i.status,
          dueDate: i.dueDate,
          createdAt: i.createdAt
        })),
        teachers: studentTeachers.map(t => ({
          id: t.id,
          name: t.name,
          email: t.email,
          subject: t.subject,
          isClassTeacher: t.isClassTeacher
        }))
      }
    })

    return Response.json({ 
      enquiries: formattedEnquiries,
      enrolledStudents 
    })

  } catch (error) {
    console.error("Dashboard API error:", error)

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
