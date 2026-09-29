import React from "react";
import { client } from "@/sanity/lib/client";
import CareerApplicationsManager, { Application } from "@/app/components/staff/CareerApplicationsManager";
import { Briefcase, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StaffCareersPage() {
  let applications: Application[] = [];

  try {
    const groq = `*[_type == "careerEnquiry"] | order(createdAt desc){
      _id,
      applicantName,
      email,
      phone,
      positionAppliedFor,
      message,
      status,
      aiScreeningScore,
      aiRecommendation,
      aiMissingQualifications,
      aiScreeningSummary,
      aiScreenedAt,
      aiExecutiveBrief,
      createdAt
    }`;
    applications = await client.fetch(groq);
  } catch (error) {
    console.error("Failed to fetch career applications:", error);
  }

  const total = applications.length;
  const screenedCount = applications.filter((a) => a.aiScreeningScore !== undefined).length;
  const recommendedCount = applications.filter(
    (a) => a.aiRecommendation === "Recommend Interview" || (a.aiScreeningScore && a.aiScreeningScore >= 80)
  ).length;
  const pendingCount = applications.filter((a) => a.status === "new" || a.status === "ai_screened").length;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              <Sparkles className="h-4 w-4" />
              <span>AI-Assisted Recruitment & Human-in-the-Loop</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Faculty & Staff Hiring Pipeline
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Review inbound teacher and staff applications pre-screened against CBSE eligibility criteria.
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium uppercase tracking-wider">Total Received</span>
              <Briefcase className="h-4 w-4" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-950">{total}</p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-indigo-600">
              <span className="text-xs font-medium uppercase tracking-wider">AI Pre-Screened</span>
              <Sparkles className="h-4 w-4" />
            </div>
            <p className="mt-3 text-2xl font-bold text-indigo-600">{screenedCount}</p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-emerald-600">
              <span className="text-xs font-medium uppercase tracking-wider">Recommended</span>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <p className="mt-3 text-2xl font-bold text-emerald-600">{recommendedCount}</p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-amber-600">
              <span className="text-xs font-medium uppercase tracking-wider">Awaiting Decision</span>
              <AlertCircle className="h-4 w-4" />
            </div>
            <p className="mt-3 text-2xl font-bold text-amber-600">{pendingCount}</p>
          </div>
        </div>

        {/* Applications Manager Component */}
        <CareerApplicationsManager initialApplications={applications} />
      </div>
    </div>
  );
}
