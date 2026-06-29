import { getCurrentUser } from "../../../../lib/auth"
import { query } from "../../../../lib/db"
import Razorpay from "razorpay"

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { invoiceId } = body

    if (!invoiceId) {
      return Response.json({ error: "Invoice ID required" }, { status: 400 })
    }

    // Verify parent is authorized to pay this invoice
    const authCheck = await query(`
      SELECT i.*
      FROM "Invoice" i
      JOIN "ParentStudent" ps ON i."studentId" = ps."studentId"
      WHERE i.id = $1 AND ps."parentId" = $2
    `, [invoiceId, user.id])

    if (authCheck.rows.length === 0) {
      return Response.json({ error: "Invoice not found or unauthorized" }, { status: 404 })
    }

    const invoice = authCheck.rows[0]
    if (invoice.status !== 'PENDING') {
      return Response.json({ error: "Invoice is already paid or waived" }, { status: 400 })
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder"
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret_placeholder"

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    // Razorpay amount is in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(parseFloat(invoice.amount) * 100)

    const order = (await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: invoice.id,
    })) as any

    // Save the razorpayOrderId on the invoice
    await query(`
      UPDATE "Invoice"
      SET "razorpayOrderId" = $1
      WHERE id = $2
    `, [order.id, invoice.id])

    return Response.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    })

  } catch (error) {
    console.error("Create order error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
