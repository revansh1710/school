"use client"

import { useState } from "react"
import AdmissionStatus from "../components/admissions/AdmissionStatus"
import DocumentUpload from "../components/admissions/documentUpload"
import InterviewScheduler from "../components/admissions/InterviewScheduler"

export default function DashboardTabs({ enquiries }: { enquiries: any[] }) {
  const [activeTab, setActiveTab] = useState(0)

  if (!enquiries || enquiries.length === 0) return null

  const activeEnquiry = enquiries[activeTab]

  return (
    <div className="max-w-6xl mx-auto">
      {/* TABS HEADER */}
      {enquiries.length > 1 && (
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
          {enquiries.map((enq, idx) => (
            <button
              key={enq._id}
              onClick={() => setActiveTab(idx)}
              className={`px-8 py-4 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap \${
                activeTab === idx
                  ? "border-amber-600 text-amber-700 bg-amber-50"
                  : "border-transparent hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                  {enq.grade}
                </span>
                <span className="text-base">{enq.studentName || `Student \${idx + 1}`}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* TAB CONTENT */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10" key={activeEnquiry._id}>
        
        <AdmissionStatus status={activeEnquiry.status} />

        {/* DOCUMENTS UPLOAD */}
        {(activeEnquiry.status === "new" || activeEnquiry.status === "contacted" || activeEnquiry.documentsStatus === "pending") && (
           <div className="mt-16">
             <DocumentUpload enquiryId={activeEnquiry._id} requiredDocs={activeEnquiry.requiredDocuments} />
           </div>
        )}

        {/* INTERVIEW SCHEDULER */}
        {activeEnquiry.status === 'documents_submitted' && activeEnquiry.interviewApprovalStatus !== 'pending' && (
           <div className="mt-16 mb-20">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Schedule Your Interview</h2>
              <p className="text-center text-gray-500 mb-8">Please choose a date and time for your admission interview.</p>
              <InterviewScheduler enquiryId={activeEnquiry._id} />
           </div>
        )}

        {/* INTERVIEW PENDING STATE */}
        {activeEnquiry.interviewApprovalStatus === 'pending' && activeEnquiry.status !== 'interview_scheduled' && (
          <div className="text-center p-8 bg-amber-50 rounded-xl border border-amber-200 mt-16 shadow-sm max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-inner">
              <span className="text-2xl">⏳</span>
            </div>
            <h3 className="text-amber-800 font-bold text-2xl mb-2 tracking-tight">Interview Request Pending</h3>
            <p className="text-amber-700 max-w-md mx-auto leading-relaxed">
              Your requested interview time is pending validation by the school administration. We will notify you via email shortly.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}