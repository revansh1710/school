"use client"

import { useState } from "react"
import { User, BookOpen, Hash, Calendar, GraduationCap, Feather, ChevronDown, ChevronUp, CreditCard, Mail, Users } from "lucide-react"

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false)
      return
    }
    if ((window as any).Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

interface AttendanceSummary {
  present: number
  absent: number
  late: number
  excused: number
  total: number
  percentage: number
}

interface AttendanceRecord {
  date: string | Date
  status: string
  remarks: string | null
}

interface Attendance {
  summary: AttendanceSummary
  records: AttendanceRecord[]
}

interface Invoice {
  id: string
  amount: number
  description: string
  status: string
  dueDate: string
  createdAt: string
}

interface Teacher {
  id: string
  name: string
  email: string
  subject: string
  isClassTeacher: boolean
}

interface Student {
  id: string
  firstName: string
  lastName: string
  admissionStatus: string
  class_name: string
  section_name: string
  rollNumber: number
  dateOfBirth: string
  gender: string
  attendance: Attendance
  invoices?: Invoice[]
  teachers?: Teacher[]
}

export default function EnrolledStudents({ students }: { students: Student[] }) {
  const [expandedStudents, setExpandedStudents] = useState<Record<string, boolean>>({})
  const [expandedTeachers, setExpandedTeachers] = useState<Record<string, boolean>>({})
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null)

  const toggleHistory = (studentId: string) => {
    setExpandedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }))
  }

  const toggleTeachers = (studentId: string) => {
    setExpandedTeachers(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }))
  }

  const handlePayInvoice = async (invoiceId: string, amount: number, studentName: string) => {
    setPaymentLoading(invoiceId)
    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Please check your internet connection.")
        setPaymentLoading(null)
        return
      }

      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId })
      })

      if (!res.ok) {
        const errData = await res.json()
        alert(errData.error || "Failed to initiate payment")
        setPaymentLoading(null)
        return
      }

      const orderData = await res.json()
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "School Portal",
        description: `Payment for ${studentName}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          setPaymentLoading(invoiceId)
          try {
            const verifyRes = await fetch("/api/payments/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                invoiceId: invoiceId
              })
            })

            if (verifyRes.ok) {
              alert("Payment successful! The student is now enrolled.")
              window.location.reload()
            } else {
              const err = await verifyRes.json()
              alert(err.error || "Payment verification failed")
            }
          } catch (verifyErr) {
            console.error(verifyErr)
            alert("An error occurred during payment verification.")
          } finally {
            setPaymentLoading(null)
          }
        },
        prefill: {
          name: studentName,
        },
        theme: {
          color: "#BA7517"
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(null)
          }
        }
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()

    } catch (error) {
      console.error("Payment error:", error)
      alert("An unexpected error occurred during payment initiation.")
      setPaymentLoading(null)
    }
  }

  if (!students || students.length === 0) return null

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 mb-8"
      style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
    >
      {/* Google Fonts import via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        .artisan-card {
          background: #FFFDF8;
          border: 0.5px solid #E8DFC8;
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.25s ease;
          position: relative;
        }
        .artisan-card:hover {
          border-color: #EF9F27;
        }
        .card-top-rule {
          height: 3px;
          background: repeating-linear-gradient(
            to right,
            #BA7517 0px,
            #BA7517 6px,
            transparent 6px,
            transparent 10px
          );
        }
        .artisan-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #FAEEDA;
          border: 1px solid #EF9F27;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .artisan-avatar-text {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 500;
          color: #633806;
          line-height: 1;
          letter-spacing: 0.03em;
        }
        .artisan-name {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 500;
          color: #1a1209;
          margin: 0 0 5px;
          line-height: 1.25;
        }
        .artisan-badge {
          display: inline-block;
          font-family: 'EB Garamond', serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3B6D11;
          background: #EAF3DE;
          border: 0.5px solid #639922;
          border-radius: 2px;
          padding: 1px 7px;
        }
        .artisan-label {
          font-family: 'EB Garamond', serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8a7a5e;
          line-height: 1.2;
          margin: 0 0 1px;
        }
        .artisan-value {
          font-family: 'EB Garamond', serif;
          font-size: 14.5px;
          color: #2c1f0a;
          line-height: 1.2;
        }
        .artisan-divider {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 2px 0 6px;
        }
        .artisan-divider-line {
          flex: 1;
          height: 0.5px;
          background: #E8DFC8;
        }
        .artisan-divider-diamond {
          width: 5px;
          height: 5px;
          background: #BA7517;
          transform: rotate(45deg);
          flex-shrink: 0;
        }
        .artisan-detail-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 5px 0;
          border-bottom: 0.5px dashed #E8DFC8;
        }
        .artisan-detail-row:last-child {
          border-bottom: none;
        }
        .artisan-detail-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
          color: #BA7517;
        }
        .artisan-footer {
          padding: 7px 20px;
          border-top: 0.5px solid #E8DFC8;
          background: #FBF7EE;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }
        .artisan-footer-text {
          font-family: 'EB Garamond', serif;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #8a7a5e;
          font-style: italic;
        }
        .artisan-section-heading {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 500;
          font-style: italic;
          color: #1a1209;
          letter-spacing: 0.01em;
          margin: 0;
          line-height: 1.2;
        }
        .artisan-section-sub {
          font-family: 'EB Garamond', serif;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8a7a5e;
          margin: 2px 0 0;
        }
        .artisan-header-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid #BA7517;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #BA7517;
        }
        .artisan-header-rule {
          height: 1.5px;
          background: #E8DFC8;
          margin: 0 0 2rem;
          position: relative;
        }
        .artisan-header-rule::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 56px;
          height: 2px;
          background: #BA7517;
          margin-top: -0.5px;
        }
        .email-contact-btn:hover {
          border-color: #EF9F27 !important;
          background-color: #FAEEDA !important;
          color: #633806 !important;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.25rem" }}>
        <div className="artisan-header-icon">
          <GraduationCap size={20} />
        </div>
        <div>
          <p className="artisan-section-sub">Academic Register</p>
          <h2 className="artisan-section-heading">Enrolled Students</h2>
        </div>
      </div>

      <div className="artisan-header-rule" />

      {/* Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {students.map((student) => (
          <div key={student.id} className="artisan-card">
            {/* Dashed top stripe */}
            <div className="card-top-rule" />

            {/* Card Header */}
            <div
              style={{
                padding: "1rem 1.25rem 0.85rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                borderBottom: "0.5px solid #E8DFC8",
              }}
            >
              <div className="artisan-avatar">
                <span className="artisan-avatar-text">
                  {student.firstName[0]}
                  {student.lastName?.[0] ?? ""}
                </span>
              </div>
              <div>
                <p className="artisan-name">
                  {student.firstName} {student.lastName}
                </p>
                <span className="artisan-badge">{student.admissionStatus}</span>
              </div>
            </div>

            {/* Card Body */}
            <div style={{ padding: "0.9rem 1.25rem 1rem" }}>
              {/* Ornamental divider */}
              <div className="artisan-divider" style={{ marginTop: "0.1rem" }}>
                <div className="artisan-divider-line" />
                <div className="artisan-divider-diamond" />
                <div className="artisan-divider-line" />
              </div>

              {/* Class */}
              <div className="artisan-detail-row">
                <div className="artisan-detail-icon">
                  <BookOpen size={15} />
                </div>
                <div>
                  <p className="artisan-label">Class</p>
                  <p className="artisan-value">{student.class_name || "Pending assignment"}</p>
                </div>
              </div>

              {/* Section */}
              <div className="artisan-detail-row">
                <div className="artisan-detail-icon">
                  <User size={15} />
                </div>
                <div>
                  <p className="artisan-label">Section</p>
                  <p className="artisan-value">{student.section_name || "Pending assignment"}</p>
                </div>
              </div>

              {/* Roll Number */}
              <div className="artisan-detail-row">
                <div className="artisan-detail-icon">
                  <Hash size={15} />
                </div>
                <div>
                  <p className="artisan-label">Roll Number</p>
                  <p className="artisan-value">{student.rollNumber || "Pending assignment"}</p>
                </div>
              </div>

              {/* Date of Birth */}
              {student.dateOfBirth && (
                <div className="artisan-detail-row">
                  <div className="artisan-detail-icon">
                    <Calendar size={15} />
                  </div>
                  <div>
                    <p className="artisan-label">Date of Birth</p>
                    <p className="artisan-value">
                      {new Date(student.dateOfBirth).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}



              {/* Invoices Section */}
              {student.invoices && student.invoices.length > 0 && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "0.5px solid #E8DFC8" }}>
                  <p className="artisan-label" style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CreditCard size={12} style={{ color: "#BA7517" }} />
                    <span>Invoices & Fees</span>
                  </p>
                  
                  <div>
                    {student.invoices.map((invoice) => {
                      const isPending = invoice.status === 'PENDING'
                      const isPaid = invoice.status === 'PAID'
                      
                      let statusColor = "#B45309"
                      let statusBg = "#FFF8E6"
                      let statusBorder = "#D97706"
                      if (isPaid) {
                        statusColor = "#3B6D11"
                        statusBg = "#EAF3DE"
                        statusBorder = "#639922"
                      } else if (invoice.status === 'WAIVED') {
                        statusColor = "#4B5563"
                        statusBg = "#F3F4F6"
                        statusBorder = "#9CA3AF"
                      } else if (invoice.status === 'FAILED') {
                        statusColor = "#9B1C1C"
                        statusBg = "#FDF2F2"
                        statusBorder = "#F05252"
                      }

                      return (
                        <div 
                          key={invoice.id}
                          style={{
                            backgroundColor: "#FFF",
                            border: "0.5px solid #E8DFC8",
                            borderRadius: "6px",
                            padding: "10px",
                            marginBottom: "8px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#1a1209" }}>
                                {invoice.description}
                              </p>
                              <p style={{ margin: 0, fontSize: "12px", color: "#8a7a5e" }}>
                                Due: {new Date(invoice.dueDate).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                              <p style={{ margin: 0, fontSize: "15px", fontWeight: "bold", color: "#633806", fontFamily: "'Playfair Display', serif" }}>
                                ₹{parseFloat(invoice.amount.toString()).toLocaleString("en-IN")}
                              </p>
                              <span style={{
                                display: "inline-block",
                                marginTop: "4px",
                                fontSize: "10px",
                                fontWeight: "500",
                                letterSpacing: "0.05em",
                                color: statusColor,
                                backgroundColor: statusBg,
                                border: `0.5px solid ${statusBorder}`,
                                borderRadius: "2px",
                                padding: "1px 4px",
                                textTransform: "uppercase"
                              }}>
                                {invoice.status}
                              </span>
                            </div>
                          </div>

                          {isPending && (
                            <button
                              onClick={() => handlePayInvoice(invoice.id, invoice.amount, student.firstName + " " + student.lastName)}
                              disabled={paymentLoading === invoice.id}
                              style={{
                                width: "100%",
                                backgroundColor: "#BA7517",
                                color: "#FFF",
                                border: "none",
                                borderRadius: "4px",
                                padding: "6px 12px",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "background-color 0.2s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                marginTop: "4px"
                              }}
                            >
                              <span>{paymentLoading === invoice.id ? "Processing..." : "Pay with Razorpay"}</span>
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="artisan-footer">
              <Feather size={12} color="#8a7a5e" />
              <span className="artisan-footer-text">Student record</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}