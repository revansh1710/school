"use client";

import React, { useState } from "react";

type JobPosting = {
  _id: string;
  title: string;
  location?: string;
  employmentType?: string;
  summary: string;
  requirements?: string[];
};

interface JobPostingListProps {
  postings: JobPosting[];
}

export default function JobPostingList({ postings }: JobPostingListProps) {
  const [applyingForId, setApplyingForId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleApplyClick = (id: string) => {
    setApplyingForId(id);
    setSubmitSuccess(false);
    setSubmitError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, role: JobPosting) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("positionAppliedFor", role.title);
      formData.append("jobId", role._id);

      const res = await fetch("/api/career/apply", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!postings || postings.length === 0) {
    return (
      <div className="mt-10 rounded-4xl border border-slate-200 bg-white p-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <h3 className="text-xl font-semibold text-slate-900">No open roles currently</h3>
        <p className="mt-3 text-slate-600">
          Check back later or send your resume to careers@school.edu.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6 xl:grid-cols-3">
      {postings.map((role) => (
        <article
          key={role._id}
          className="animate-fade-in-up overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] flex flex-col"
        >
          <div className="bg-sky-900/95 px-6 py-6 text-white">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-200">
              {role.location || "On Campus"}
              {role.employmentType ? ` • ${role.employmentType}` : ""}
            </p>
            <h3 className="mt-3 text-2xl font-semibold">{role.title}</h3>
          </div>
          <div className="flex-1 space-y-6 px-6 py-8 flex flex-col justify-between">
            <div className="space-y-6">
              <p className="text-sm leading-7 text-slate-700">{role.summary}</p>
              
              {applyingForId !== role._id && role.requirements && role.requirements.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    What we look for
                  </p>
                  <ul className="space-y-3 text-sm leading-7 text-slate-600">
                    {role.requirements.map((requirement, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-sky-800" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Inline Application Form */}
              {applyingForId === role._id && (
                <div className="mt-4 border-t border-slate-200 pt-6">
                  {submitSuccess ? (
                    <div className="rounded-2xl bg-green-50 p-4 text-green-800 text-center">
                      <h4 className="font-semibold mb-2">Application Submitted!</h4>
                      <p className="text-sm">Thank you for applying. Our team will review your application and get back to you soon.</p>
                      <button 
                        onClick={() => setApplyingForId(null)}
                        className="mt-4 text-sm font-medium text-green-700 underline"
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={(e) => handleSubmit(e, role)} className="space-y-4">
                      <h4 className="font-semibold text-slate-900 text-lg mb-4">Apply for {role.title}</h4>
                      
                      {submitError && (
                        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                          {submitError}
                        </div>
                      )}

                      <div>
                        <label htmlFor={`applicantName-${role._id}`} className="block text-sm font-medium text-slate-700">Full Name *</label>
                        <input required type="text" name="applicantName" id={`applicantName-${role._id}`} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
                      </div>
                      
                      <div>
                        <label htmlFor={`email-${role._id}`} className="block text-sm font-medium text-slate-700">Email Address *</label>
                        <input required type="email" name="email" id={`email-${role._id}`} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
                      </div>
                      
                      <div>
                        <label htmlFor={`phone-${role._id}`} className="block text-sm font-medium text-slate-700">Phone Number</label>
                        <input type="tel" name="phone" id={`phone-${role._id}`} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
                      </div>

                      <div>
                        <label htmlFor={`resume-${role._id}`} className="block text-sm font-medium text-slate-700">Resume / CV (PDF, DOCX) *</label>
                        <input required type="file" name="resume" id={`resume-${role._id}`} accept=".pdf,.doc,.docx" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sky-700 hover:file:bg-sky-100" />
                      </div>

                      <div>
                        <label htmlFor={`portfolio-${role._id}`} className="block text-sm font-medium text-slate-700">Portfolio / Additional Documents</label>
                        <input type="file" name="portfolio" id={`portfolio-${role._id}`} accept=".pdf,.doc,.docx" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-slate-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-100" />
                      </div>
                      
                      <div>
                        <label htmlFor={`message-${role._id}`} className="block text-sm font-medium text-slate-700">Cover Letter / Message</label>
                        <textarea name="message" id={`message-${role._id}`} rows={4} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"></textarea>
                      </div>
                      
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setApplyingForId(null)}
                          className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 rounded-full bg-sky-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:opacity-50"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Application"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Apply Button */}
            {applyingForId !== role._id && (
              <div className="pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100">
                <button
                  onClick={() => handleApplyClick(role._id)}
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Apply now
                </button>
                <span className="text-xs uppercase tracking-[0.24em] text-slate-500 sm:text-sm">
                  Immediate start considered
                </span>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
