"use client"

import { useState } from "react"
import { sendWelcomeMail } from '../../lib/utils/mailService'
export default function AdmissionsEnquiryForm() {
  const [form, setForm] = useState({
    parentName: "",
    email: "",
    phone: "",
    studentName: "",
    grade: "",
    message: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/admissions/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSuccess(true)
        setForm({ parentName: "", email: "", phone: "", studentName: "", grade: "", message: "" })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        .enq-wrap {
          font-family: 'Outfit', sans-serif;
          background: #F9F6F1;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .enq-wrap::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,151,90,0.09), transparent 65%);
          pointer-events: none;
        }

        .enq-wrap::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -80px;
          width: 380px; height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139,110,82,0.06), transparent 65%);
          pointer-events: none;
        }

        .enq-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 560px;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(184,151,90,0.18);
          padding: 3rem 3rem 2.75rem;
        }

        @media (max-width: 520px) {
          .enq-card { padding: 2rem 1.5rem; }
        }

        .enq-top-line {
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #B8975A, transparent);
          margin-bottom: 1.5rem;
        }

        .enq-label {
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #B8975A;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .enq-heading {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 400;
          color: #1C1917;
          line-height: 1.15;
          margin-bottom: 0.5rem;
        }

        .enq-heading em {
          font-style: italic;
          color: #B8975A;
        }

        .enq-subtext {
          font-size: 0.85rem;
          color: #9E8A76;
          font-weight: 300;
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        .enq-form {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .enq-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
        }

        @media (max-width: 480px) {
          .enq-row { grid-template-columns: 1fr; }
        }

        .enq-field {
          position: relative;
          background: #F9F6F1;
          border: 1px solid rgba(184,151,90,0.15);
          margin-top: -1px;
          margin-left: -1px;
          transition: background 0.25s ease, border-color 0.25s ease;
        }

        .enq-field:focus-within {
          background: #fff;
          border-color: rgba(184,151,90,0.55);
          z-index: 1;
        }

        .enq-field-label {
          display: block;
          font-size: 0.58rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #B8975A;
          font-weight: 600;
          padding: 0.85rem 1rem 0;
        }

        .enq-input,
        .enq-textarea,
        .enq-select {
          display: block;
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          padding: 0.3rem 1rem 0.85rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #1C1917;
          line-height: 1.5;
        }

        .enq-input::placeholder,
        .enq-textarea::placeholder {
          color: #C4B0A0;
        }

        .enq-select {
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
        }

        .enq-select-wrap {
          position: relative;
        }

        .enq-select-wrap::after {
          content: '↓';
          position: absolute;
          right: 1rem;
          bottom: 0.85rem;
          font-size: 0.75rem;
          color: #B8975A;
          pointer-events: none;
        }

        .enq-textarea {
          resize: vertical;
          min-height: 90px;
        }

        .enq-submit-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 1.75rem;
          flex-wrap: wrap;
        }

        .enq-note {
          font-size: 0.72rem;
          color: #C4B0A0;
          font-weight: 300;
        }

        .enq-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 2rem;
          background: #1C1917;
          color: #F9F6F1;
          font-family: 'Outfit', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 600;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease;
        }

        .enq-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #B8975A, #8B6E52);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .enq-btn:hover:not(:disabled)::before { opacity: 1; }
        .enq-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .enq-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .enq-btn span { position: relative; z-index: 1; }

        .enq-btn-arrow {
          position: relative;
          z-index: 1;
          transition: transform 0.25s ease;
        }

        .enq-btn:hover:not(:disabled) .enq-btn-arrow { transform: translateX(4px); }

        /* Loading spinner */
        .enq-spinner {
          position: relative;
          z-index: 1;
          width: 14px; height: 14px;
          border: 1.5px solid rgba(249,246,241,0.3);
          border-top-color: #F9F6F1;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Success state */
        .enq-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem 1rem;
          gap: 1rem;
        }

        .enq-success-icon {
          width: 52px; height: 52px;
          border: 1.5px solid rgba(184,151,90,0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #B8975A;
          font-size: 1.4rem;
          animation: pop-in 0.5s cubic-bezier(0.16,1,0.3,1);
        }

        @keyframes pop-in {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }

        .enq-success-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: #1C1917;
        }

        .enq-success-sub {
          font-size: 0.85rem;
          color: #9E8A76;
          font-weight: 300;
          line-height: 1.7;
          max-width: 320px;
        }
      `}</style>

      <div className="enq-wrap">
        <div className="enq-card">
          <div className="enq-top-line" />

          {success ? (
            <div className="enq-success">
              <div className="enq-success-icon">✓</div>
              <div className="enq-success-title">Enquiry Received</div>
              <p className="enq-success-sub">
                Thank you for reaching out. Our admissions team will get back to you within 1–2 working days.
              </p>
            </div>
          ) : (
            <>
              <p className="enq-label">Admissions 2025–26</p>
              <h2 className="enq-heading">Send an <em>Enquiry</em></h2>
              <p className="enq-subtext">
                Fill in the details below and we'll get back to you shortly.
              </p>

              <form className="enq-form" onSubmit={handleSubmit}>

                {/* Row 1 — Parent & Email */}
                <div className="enq-row">
                  <div className="enq-field">
                    <label className="enq-field-label" htmlFor="parentName">Parent Name</label>
                    <input
                      id="parentName"
                      className="enq-input"
                      name="parentName"
                      placeholder="Full name"
                      value={form.parentName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="enq-field">
                    <label className="enq-field-label" htmlFor="email">Email</label>
                    <input
                      id="email"
                      className="enq-input"
                      name="email"
                      type="email"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Row 2 — Phone & Student */}
                <div className="enq-row">
                  <div className="enq-field">
                    <label className="enq-field-label" htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      className="enq-input"
                      name="phone"
                      placeholder="+91 00000 00000"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="enq-field">
                    <label className="enq-field-label" htmlFor="studentName">Student Name</label>
                    <input
                      id="studentName"
                      className="enq-input"
                      name="studentName"
                      placeholder="Child's full name"
                      value={form.studentName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Grade — full width select */}
                <div className="enq-field">
                  <label className="enq-field-label" htmlFor="grade">Grade Applying For</label>
                  <div className="enq-select-wrap">
                    <select
                      id="grade"
                      className="enq-select"
                      name="grade"
                      value={form.grade}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select a grade</option>
                      {["Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
                        "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"].map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="enq-field">
                  <label className="enq-field-label" htmlFor="message">Message <span style={{ color: "#C4B0A0", fontWeight: 300, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                  <textarea
                    id="message"
                    className="enq-textarea"
                    name="message"
                    placeholder="Any specific questions or requirements..."
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                <div className="enq-submit-row">
                  <button className="enq-btn" type="submit" disabled={loading}>
                    {loading ? (
                      <><span>Sending</span><div className="enq-spinner" /></>
                    ) : (
                      <><span>Submit Enquiry</span><span className="enq-btn-arrow">→</span></>
                    )}
                  </button>
                </div>

              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}