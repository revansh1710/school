import { query } from "./db"

export async function provisionStudentForEnquiry(
  userId: string,
  studentName: string,
  grade: string | null | undefined
): Promise<any> {
  const nameParts = (studentName || "Unknown").trim().split(/\s+/)
  const firstName = nameParts[0]
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""

  // 1. Check if matching student already exists for this parent
  const checkRes = await query(`
    SELECT s.*, c.name as class_name, sec.name as section_name
    FROM "Student" s
    JOIN "ParentStudent" ps ON s.id = ps."studentId"
    LEFT JOIN "Class" c ON s."classId" = c.id
    LEFT JOIN "Section" sec ON s."sectionId" = sec.id
    WHERE ps."parentId" = $1 
      AND LOWER(TRIM(s."firstName")) = LOWER(TRIM($2)) 
      AND LOWER(TRIM(s."lastName")) = LOWER(TRIM($3))
  `, [userId, firstName, lastName])

  if (checkRes.rows.length > 0) {
    return checkRes.rows[0]
  }

  // 2. Find Class and available Section/Roll Number
  let classId = null
  let sectionId = null
  let rollNumber = null

  if (grade) {
    const classRes = await query('SELECT id FROM "Class" WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))', [grade])
    if (classRes.rows.length > 0) {
      classId = classRes.rows[0].id

      const sectionRes = await query(`
        SELECT s.id, s."maxCapacity", COUNT(st.id) as current_count
        FROM "Section" s
        LEFT JOIN "Student" st ON st."sectionId" = s.id
        WHERE s."classId" = $1
        GROUP BY s.id, s."maxCapacity"
        HAVING COUNT(st.id) < s."maxCapacity"
        ORDER BY current_count ASC
        LIMIT 1
      `, [classId])

      if (sectionRes.rows.length > 0) {
        sectionId = sectionRes.rows[0].id
        rollNumber = parseInt(sectionRes.rows[0].current_count, 10) + 1
      }
    }
  }

  // 3. Perform transactional inserts
  try {
    await query('BEGIN')

    const studentRes = await query(
      'INSERT INTO "Student" ("firstName", "lastName", "admissionStatus", "classId", "sectionId", "rollNumber") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [firstName, lastName, 'ACCEPTED', classId, sectionId, rollNumber]
    )
    const student = studentRes.rows[0]

    await query(
      'INSERT INTO "ParentStudent" ("parentId", "studentId") VALUES ($1, $2)',
      [userId, student.id]
    )

    const gradeName = grade || "Admission"
    const invoiceAmount = 25000
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    await query(
      'INSERT INTO "Invoice" ("studentId", amount, description, status, "dueDate") VALUES ($1, $2, $3, $4, $5)',
      [student.id, invoiceAmount, `Admission Fee - ${gradeName}`, 'PENDING', dueDate]
    )

    await query('COMMIT')

    // Retrieve full created student with class_name and section_name
    const fullStudentRes = await query(`
      SELECT s.*, c.name as class_name, sec.name as section_name
      FROM "Student" s
      LEFT JOIN "Class" c ON s."classId" = c.id
      LEFT JOIN "Section" sec ON s."sectionId" = sec.id
      WHERE s.id = $1
    `, [student.id])

    return fullStudentRes.rows[0]
  } catch (err) {
    await query('ROLLBACK')
    console.error("Failed to provision student in transaction:", err)
    throw err
  }
}
