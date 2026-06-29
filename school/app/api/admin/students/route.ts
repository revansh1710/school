import { query } from "../../../../lib/db"
import { getStaffUser } from "../../../../lib/adminAuth"
import { serverClient } from "../../../../app/lib/sanity/serverClient"

function mapPostgresStatusToSanity(status: string): string {
  switch (status) {
    case "ENQUIRY":
      return "new"
    case "DOCUMENTS":
      return "documents_submitted"
    case "INTERVIEW":
      return "interview_scheduled"
    case "ACCEPTED":
    case "ENROLLED":
      return "accepted"
    case "REJECTED":
      return "rejected"
    default:
      return "new"
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { 
      id, 
      firstName, 
      lastName, 
      rollNumber, 
      admissionStatus, 
      classId, 
      sectionId, 
      isSanityOnly,
      enrollmentType,
      feeWaiverReason,
      approvedBy,
      customFeeWaiverReason
    } = body

    if (!id || !firstName || !lastName || !admissionStatus) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (user.role === 'ADMIN') {
      if (isSanityOnly) {
        const doc = await serverClient.fetch(`*[_id == $id][0]`, { id })
        const currentGrade = doc?.grade?.toLowerCase().trim()

        const adminClassesRes = await query(`
          SELECT c.name, c.id 
          FROM "AdminClass" ac 
          JOIN "Class" c ON ac."classId" = c.id 
          WHERE ac."adminId" = $1
        `, [user.id])
        const managedClassNames = adminClassesRes.rows.map((r: any) => r.name.toLowerCase().trim())
        const managedClassIds = adminClassesRes.rows.map((r: any) => r.id)

        if (currentGrade && !managedClassNames.includes(currentGrade)) {
          return Response.json({ error: "Unauthorized: You do not manage the class of this applicant" }, { status: 403 })
        }

        if (classId && !managedClassIds.includes(classId)) {
          return Response.json({ error: "Unauthorized: Target class is not managed by you" }, { status: 403 })
        }
      } else {
        const studentCheck = await query(`
          SELECT s."classId" 
          FROM "Student" s
          JOIN "AdminClass" ac ON s."classId" = ac."classId"
          WHERE s.id = $1 AND ac."adminId" = $2
        `, [id, user.id])
        if (studentCheck.rows.length === 0) {
          return Response.json({ error: "Unauthorized: You do not manage this student's class" }, { status: 403 })
        }

        if (classId) {
          const adminClassCheck = await query(`
            SELECT 1 FROM "AdminClass" 
            WHERE "adminId" = $1 AND "classId" = $2
          `, [user.id, classId])
          if (adminClassCheck.rows.length === 0) {
            return Response.json({ error: "Unauthorized: Target class is not managed by you" }, { status: 403 })
          }
        }
      }
    }

    if (isSanityOnly) {
      let className = null
      if (classId) {
        const classRes = await query('SELECT name FROM "Class" WHERE id = $1', [classId])
        if (classRes.rows.length > 0) {
          className = classRes.rows[0].name
        }
      }

      const sanityStatus = mapPostgresStatusToSanity(admissionStatus)
      const patchData: any = {
        studentName: `${firstName} ${lastName}`.trim(),
        status: sanityStatus,
      }

      if (className) {
        patchData.grade = className
      }

      if (sanityStatus === "documents_submitted") {
        patchData.documentsStatus = "submitted"
      }

      await serverClient
        .patch(id)
        .set(patchData)
        .commit()

      return Response.json({ success: true })
    } else {
      const targetClassId = classId || null
      const targetSectionId = sectionId || null
      const targetRollNumber = rollNumber ? parseInt(rollNumber, 10) : null

      // Get current student status and enrolledAt
      const studentRes = await query(
        'SELECT "admissionStatus", "enrolledAt" FROM "Student" WHERE id = $1',
        [id]
      )
      
      const currentStudent = studentRes.rows[0]
      
      let targetEnrolledAt = null
      let targetEnrollmentType = null
      let targetFeeWaiverReason = null
      let targetApprovedBy = null

      // Automatically generate a new Academic Fee invoice if promoted (transition from ENROLLED to ACCEPTED)
      if (currentStudent?.admissionStatus === 'ENROLLED' && admissionStatus === 'ACCEPTED') {
        let className = "Admission"
        if (targetClassId) {
          const classRes = await query('SELECT name FROM "Class" WHERE id = $1', [targetClassId])
          if (classRes.rows.length > 0) {
            className = classRes.rows[0].name
          }
        }
        const invoiceAmount = 25000
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 14)

        await query(
          'INSERT INTO "Invoice" ("studentId", amount, description, status, "dueDate") VALUES ($1, $2, $3, $4, $5)',
          [id, invoiceAmount, `Academic Fee - ${className}`, 'PENDING', dueDate]
        )
      }

      if (admissionStatus === 'ENROLLED') {
        targetEnrolledAt = currentStudent?.enrolledAt || new Date()
        targetEnrollmentType = enrollmentType || 'PAID'
        targetFeeWaiverReason = enrollmentType === 'PAID' ? null : (feeWaiverReason === 'Other' ? customFeeWaiverReason : feeWaiverReason)
        if (!targetFeeWaiverReason) targetFeeWaiverReason = null
        targetApprovedBy = enrollmentType === 'PAID' ? null : (approvedBy || null)

        // Automatically mark pending invoices as WAIVED if enrollment type is fee waiver or manual approval
        if (targetEnrollmentType === 'FEE_WAIVER' || targetEnrollmentType === 'MANUAL_APPROVAL') {
          await query(`
            UPDATE "Invoice"
            SET status = 'WAIVED'
            WHERE "studentId" = $1 AND status = 'PENDING'
          `, [id])
        }
      }

      await query(`
        UPDATE "Student"
        SET "firstName" = $1,
            "lastName" = $2,
            "rollNumber" = $3,
            "admissionStatus" = $4,
            "classId" = $5,
            "sectionId" = $6,
            "enrollmentType" = $7,
            "feeWaiverReason" = $8,
            "approvedBy" = $9,
            "enrolledAt" = $10
        WHERE id = $11
      `, [
        firstName, 
        lastName, 
        targetRollNumber, 
        admissionStatus, 
        targetClassId, 
        targetSectionId, 
        targetEnrollmentType, 
        targetFeeWaiverReason, 
        targetApprovedBy, 
        targetEnrolledAt,
        id
      ])

      return Response.json({ success: true })
    }
  } catch (error) {
    console.error("Error updating student:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const isSanityOnly = searchParams.get("isSanityOnly") === "true"

    if (!id) {
      return Response.json({ error: "id parameter is required" }, { status: 400 })
    }

    if (user.role === 'ADMIN') {
      if (isSanityOnly) {
        const doc = await serverClient.fetch(`*[_id == $id][0]`, { id })
        const currentGrade = doc?.grade?.toLowerCase().trim()

        const adminClassesRes = await query(`
          SELECT c.name 
          FROM "AdminClass" ac 
          JOIN "Class" c ON ac."classId" = c.id 
          WHERE ac."adminId" = $1
        `, [user.id])
        const managedClassNames = adminClassesRes.rows.map((r: any) => r.name.toLowerCase().trim())

        if (currentGrade && !managedClassNames.includes(currentGrade)) {
          return Response.json({ error: "Unauthorized: You do not manage the class of this applicant" }, { status: 403 })
        }
      } else {
        const studentCheck = await query(`
          SELECT 1 
          FROM "Student" s
          JOIN "AdminClass" ac ON s."classId" = ac."classId"
          WHERE s.id = $1 AND ac."adminId" = $2
        `, [id, user.id])
        if (studentCheck.rows.length === 0) {
          return Response.json({ error: "Unauthorized: You do not manage this student's class" }, { status: 403 })
        }
      }
    }

    if (isSanityOnly) {
      await serverClient.delete(id)
    } else {
      await query('DELETE FROM "Student" WHERE id = $1', [id])
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting student:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
