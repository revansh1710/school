import { getCurrentUser } from "../../../../lib/auth"
import { query } from "../../../../lib/db"
import crypto from "crypto"

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, invoiceId } = body

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !invoiceId) {
      return Response.json({ error: "Missing verification parameters" }, { status: 400 })
    }

    // Cryptographically verify the signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret_placeholder"
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    const isSignatureValid = generatedSignature === razorpay_signature

    if (!isSignatureValid) {
      return Response.json({ error: "Invalid payment signature verification failed" }, { status: 400 })
    }

    // Fetch and check invoice authorization
    const invoiceRes = await query(`
      SELECT i.*
      FROM "Invoice" i
      JOIN "ParentStudent" ps ON i."studentId" = ps."studentId"
      WHERE i.id = $1 AND ps."parentId" = $2
    `, [invoiceId, user.id])

    if (invoiceRes.rows.length === 0) {
      return Response.json({ error: "Invoice not found or unauthorized" }, { status: 404 })
    }

    const invoice = invoiceRes.rows[0]
    if (invoice.status !== 'PENDING') {
      return Response.json({ error: "Invoice is already processed" }, { status: 400 })
    }

    const now = new Date()

    // 1. Update Invoice table
    await query(`
      UPDATE "Invoice"
      SET status = 'PAID',
          "razorpayPaymentId" = $1,
          "paidAt" = $2
      WHERE id = $3
    `, [razorpay_payment_id, now, invoice.id])

    // 2. Update Student table to ENROLLED
    await query(`
      UPDATE "Student"
      SET "admissionStatus" = 'ENROLLED',
          "enrollmentType" = 'PAID',
          "enrolledAt" = $1
      WHERE id = $2
    `, [now, invoice.studentId])

    return Response.json({ success: true })

  } catch (error) {
    console.error("Verify payment error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
