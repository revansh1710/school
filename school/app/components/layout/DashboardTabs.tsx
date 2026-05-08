"use client"

import { useState } from "react"
import AdmissionStatus from "../../components/admissions/AdmissionStatus"
import DocumentUpload from "../../components/admissions/documentUpload"
import InterviewScheduler from "../../components/admissions/InterviewScheduler"

export default function DashboardTabs({ enquiries }: { enquiries: any[] }) {
  const [activeTab, setActiveTab] = useState(0)
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const handleWithdraw = async (enquiryId: string, studentName: string) => {
      if (!window.confirm(`Are you sure you want to withdraw the application for ${studentName || 'this student'}?`)) {
          return
      }

      setIsWithdrawing(true)
      try {
          const res = await fetch("/api/admissions/withdraw", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ enquiryId })
          })
          const data = await res.json()
          if (data.success) {
              if (data.fullyWithdrawn) {
                  window.location.href = "/auth/login"
              } else {
                  window.location.reload()
              }
          } else {
              alert(data.error || "Failed to withdraw application.")
          }
      } catch (error) {
          console.error(error)
          alert("Failed to withdraw application.")
      } finally {
          setIsWithdrawing(false)
      }
  }

  if (!enquiries || enquiries.length === 0) return null

  const activeEnquiry = enquiries[activeTab]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* TABS HEADER */}
      {enquiries.length > 1 && (
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 overflow-x-auto hide-scrollbar">
          {enquiries.map((enq, idx) => (
            <button
              key={enq._id}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 min-w-30 px-4 py-2.5 rounded-lg text-left transition-all duration-150 ${activeTab === idx
                  ? "bg-white shadow-sm border border-gray-200"
                  : "hover:bg-gray-200/60"
                }`}
            >
              <span className="block text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-0.5">
                {enq.grade}
              </span>
              <span className={`block text-sm font-medium ${activeTab === idx ? "text-gray-900" : "text-gray-500"}`}>
                {enq.studentName || `Student ${idx + 1}`}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* TAB CONTENT */}
      <div
        className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-3"
        key={activeEnquiry._id}
      >



        {/* DOCUMENT UPLOAD */}
        {(activeEnquiry.status === "new" ||
          activeEnquiry.status === "contacted" ||
          activeEnquiry.documentsStatus === "pending") && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-4">
                Required documents
              </p>
              <DocumentUpload
                enquiryId={activeEnquiry._id}
                requiredDocs={activeEnquiry.requiredDocuments}
              />
            </div>
          )}

        {/* INTERVIEW SCHEDULER */}
        {activeEnquiry.status === "documents_submitted" &&
          activeEnquiry.interviewApprovalStatus !== "pending" && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-1">
                Schedule interview
              </p>
              <p className="text-sm text-gray-500 mb-5">
                Choose a date and time for your admission interview.
              </p>
              <InterviewScheduler enquiryId={activeEnquiry._id} />
            </div>
          )}

        {/* INTERVIEW PENDING BANNER */}
        {activeEnquiry.interviewApprovalStatus === "pending" &&
          activeEnquiry.status !== "interview_scheduled" && (
            <div className="flex items-start gap-3.5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-white border border-amber-200 text-base">
                ⏳
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800 mb-0.5">
                  Interview request pending
                </p>
                <p className="text-sm text-amber-700/80 leading-relaxed">
                  Your requested interview time is pending validation by the school administration.
                  We'll notify you via email shortly.
                </p>
              </div>
            </div>
          )}

        {/* ADMISSION STATUS */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-3">
            Admission status
          </p>
          <AdmissionStatus status={activeEnquiry.status} />
        </div>

        {/* WITHDRAW BUTTON */}
        {activeEnquiry.status !== "enrolled" && activeEnquiry.status !== "withdrawn" && (
           <div className="flex justify-end pt-2 pb-4 pr-2">
             <button
               onClick={() => handleWithdraw(activeEnquiry._id, activeEnquiry.studentName)}
               disabled={isWithdrawing}
               className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline transition-colors disabled:opacity-50"
             >
               {isWithdrawing ? "Withdrawing..." : `Withdraw Application`}
             </button>
           </div>
        )}

      </div>
    </div>
  )
}