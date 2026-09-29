"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Search,
  Filter,
  FileText,
  Printer,
  Copy,
  Check,
  Loader2,
  X,
  HelpCircle,
  FileCheck2,
  Building2,
  Compass,
  RefreshCw,
} from "lucide-react";

export interface InquiryProbe {
  probeQuestion: string;
  pedagogicalRationale: string;
  focusArea: string;
}

export interface ExecutiveBrief {
  deNoisedSummary: string;
  statutoryCompliance: string;
  tenureContinuity: string;
  humanInquiryGuide: InquiryProbe[];
  documentChecklist: string[];
  generatedAt: string;
}

export interface Application {
  _id: string;
  applicantName: string;
  email: string;
  phone?: string;
  positionAppliedFor?: string;
  message?: string;
  status: string;
  aiScreeningScore?: number;
  aiRecommendation?: string;
  aiMissingQualifications?: string[];
  aiScreeningSummary?: string;
  aiScreenedAt?: string;
  aiExecutiveBrief?: ExecutiveBrief;
  createdAt: string;
}

interface Props {
  initialApplications: Application[];
}

export default function CareerApplicationsManager({ initialApplications }: Props) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [messageToast, setMessageToast] = useState<string | null>(null);

  // Executive Dossier Modal State
  const [activeDossierApp, setActiveDossierApp] = useState<Application | null>(null);
  const [generatingDossierId, setGeneratingDossierId] = useState<string | null>(null);
  const [copiedDossier, setCopiedDossier] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.positionAppliedFor || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    setMessageToast(null);

    try {
      const res = await fetch("/api/staff/careers/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
      );
      setMessageToast(`Application updated to ${newStatus.replace("_", " ")}`);
      setTimeout(() => setMessageToast(null), 3000);
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenDossier = async (app: Application, force = false) => {
    if (app.aiExecutiveBrief && !force) {
      setActiveDossierApp(app);
      return;
    }

    setGeneratingDossierId(app._id);
    setMessageToast(null);

    try {
      const res = await fetch("/api/staff/careers/generate-dossier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: app._id, force }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate dossier");
      }

      const updatedApp: Application = {
        ...app,
        aiExecutiveBrief: data.executiveBrief,
      };

      setApplications((prev) =>
        prev.map((a) => (a._id === app._id ? updatedApp : a))
      );

      setActiveDossierApp(updatedApp);
      setMessageToast("Principal's Executive Dossier synthesized successfully");
      setTimeout(() => setMessageToast(null), 3000);
    } catch (err: any) {
      alert("Error generating dossier: " + err.message);
    } finally {
      setGeneratingDossierId(null);
    }
  };

  const handleCopyDossier = () => {
    if (!activeDossierApp || !activeDossierApp.aiExecutiveBrief) return;
    const b = activeDossierApp.aiExecutiveBrief;

    let text = `CONFIDENTIAL — PRINCIPAL'S INTERVIEW DOSSIER\n`;
    text += `Candidate: ${activeDossierApp.applicantName}\n`;
    text += `Role: ${activeDossierApp.positionAppliedFor || "General Faculty"}\n`;
    text += `Generated: ${new Date(b.generatedAt).toLocaleString()}\n\n`;
    text += `==============================================\n`;
    text += `1. FACTUAL DE-NOISED SUMMARY:\n${b.deNoisedSummary}\n\n`;
    text += `2. STATUTORY & CBSE AFFILIATION ASSESSMENT:\n${b.statutoryCompliance}\n\n`;
    text += `3. TENURE & MOBILITY ANALYSIS:\n${b.tenureContinuity}\n\n`;
    text += `4. HUMAN INQUIRY GUIDE (INTERVIEW PROBES):\n`;
    b.humanInquiryGuide.forEach((p, idx) => {
      text += `\n[Probe ${idx + 1}] (${p.focusArea}):\n`;
      text += `Question: "${p.probeQuestion}"\n`;
      text += `Rationale for Committee: ${p.pedagogicalRationale}\n`;
    });
    text += `\n==============================================\n`;
    text += `5. PHYSICAL DOCUMENT SCRUTINY CHECKLIST:\n`;
    b.documentChecklist.forEach((doc, idx) => {
      text += `[ ] ${doc}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2500);
  };

  const handleToggleDocCheck = (doc: string) => {
    setCheckedDocs((prev) => ({ ...prev, [doc]: !prev[doc] }));
  };

  const getScoreBadge = (score?: number) => {
    if (score === undefined || score === null) return null;
    if (score >= 80) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          <Sparkles className="h-3 w-3 text-emerald-600" />
          {score}/100 Match
        </span>
      );
    }
    if (score >= 60) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
          <Clock className="h-3 w-3 text-amber-600" />
          {score}/100 Potential
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
        <AlertTriangle className="h-3 w-3 text-rose-600" />
        {score}/100 Low Match
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {messageToast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{messageToast}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates, positions, email..."
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="all">All Statuses ({applications.length})</option>
            <option value="ai_screened">AI Screened</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="reviewed">Reviewed</option>
            <option value="new">New</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Briefcase className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-sm font-semibold text-slate-900">No applications found</h3>
          <p className="mt-1 text-xs text-slate-500">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search query or filters."
              : "Inbound candidate applications will appear here with automated AI screening."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApps.map((app) => {
            const isExpanded = expandedId === app._id;
            const isGeneratingDossier = generatingDossierId === app._id;
            const hasDossier = !!app.aiExecutiveBrief;

            return (
              <div
                key={app._id}
                className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs transition hover:shadow-md"
              >
                {/* Main Card Row */}
                <div className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Candidate Info */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h4 className="text-base font-bold text-slate-950">
                          {app.applicantName}
                        </h4>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                          {app.positionAppliedFor || "General Faculty"}
                        </span>
                        {getScoreBadge(app.aiScreeningScore)}
                        {hasDossier && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                            <FileCheck2 className="h-3 w-3" />
                            Dossier Ready
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {app.email}
                        </span>
                        {app.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {app.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions & Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Principal's Executive Brief Button */}
                      <button
                        onClick={() => handleOpenDossier(app)}
                        disabled={isGeneratingDossier}
                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-60 ${
                          hasDossier
                            ? "bg-slate-900 text-white hover:bg-slate-800"
                            : "bg-indigo-600 text-white hover:bg-indigo-500"
                        }`}
                      >
                        {isGeneratingDossier ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                            <span>Auditing Dossier...</span>
                          </>
                        ) : hasDossier ? (
                          <>
                            <FileText className="h-3.5 w-3.5 text-indigo-300" />
                            <span>Principal&apos;s Dossier</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                            <span>Synthesize Brief</span>
                          </>
                        )}
                      </button>

                      {/* Status Dropdown */}
                      <select
                        value={app.status}
                        disabled={updatingId === app._id}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 cursor-pointer"
                      >
                        <option value="new">Status: New</option>
                        <option value="ai_screened">Status: AI Screened</option>
                        <option value="reviewed">Status: Reviewed</option>
                        <option value="interview_scheduled">Status: Interview Scheduled</option>
                        <option value="offered">Status: Offered</option>
                        <option value="hired">Status: Hired</option>
                        <option value="rejected">Status: Rejected</option>
                      </select>

                      {/* Expand / Details Toggle */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : app._id)}
                        className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <span>{isExpanded ? "Hide" : "Details"}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* AI Quick Recommendation Banner */}
                  {app.aiRecommendation && (
                    <div className="mt-4 flex items-center gap-2 rounded-2xl bg-indigo-50/70 px-4 py-2 text-xs text-indigo-900 border border-indigo-100">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-600" />
                      <span className="font-semibold">AI Pre-Screening:</span>
                      <span>{app.aiRecommendation}</span>
                    </div>
                  )}
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/70 p-6 space-y-4">
                    {/* AI Assessment Details */}
                    {app.aiScreeningSummary && (
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                          Pre-Screening Initial Audit
                        </h5>
                        <p className="mt-2 text-xs leading-relaxed text-slate-700">
                          {app.aiScreeningSummary}
                        </p>

                        {app.aiMissingQualifications && app.aiMissingQualifications.length > 0 && (
                          <div className="mt-3">
                            <span className="text-[11px] font-semibold text-rose-700">
                              Identified Missing Requirements:
                            </span>
                            <ul className="mt-1 list-disc list-inside text-xs text-rose-600 space-y-0.5">
                              {app.aiMissingQualifications.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Applicant Cover Letter */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Candidate Cover Letter / Statement
                      </h5>
                      <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-slate-700">
                        {app.message || "No cover letter message provided."}
                      </p>
                    </div>

                    {/* Action Buttons for Staff */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleStatusChange(app._id, "interview_scheduled")}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition cursor-pointer"
                        >
                          Approve & Schedule Interview
                        </button>
                        <button
                          onClick={() => handleStatusChange(app._id, "reviewed")}
                          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        >
                          Mark as Reviewed
                        </button>
                        <button
                          onClick={() => handleStatusChange(app._id, "rejected")}
                          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                        >
                          Reject Application
                        </button>
                      </div>

                      <button
                        onClick={() => handleOpenDossier(app)}
                        className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2 text-xs font-semibold text-indigo-900 hover:bg-indigo-100 transition cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Open Principal&apos;s Interview Pack</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* THE PRINCIPAL'S EXECUTIVE BRIEF & CHARACTER DOSSIER MODAL */}
      {/* ========================================================= */}
      {activeDossierApp && activeDossierApp.aiExecutiveBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-rose-300 ring-1 ring-rose-400/40">
                    Confidential
                  </span>
                  <span className="text-xs text-slate-400">
                    For Principal & Selection Committee Only
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-400" />
                  Candidate Executive Brief & Interview Pack
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyDossier}
                  className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition cursor-pointer"
                  title="Copy as Markdown Interview Sheet"
                >
                  {copiedDossier ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-300" />
                      <span>Copy Brief</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition cursor-pointer"
                  title="Print Interview Dossier"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-300" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => handleOpenDossier(activeDossierApp, true)}
                  disabled={generatingDossierId === activeDossierApp._id}
                  className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition cursor-pointer disabled:opacity-50"
                  title="Re-audit candidate"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${generatingDossierId === activeDossierApp._id ? "animate-spin" : ""}`} />
                  <span>Re-audit</span>
                </button>

                <button
                  onClick={() => setActiveDossierApp(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Candidate Metadata Strip */}
            <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-slate-400">Candidate: </span>
                  <span className="font-bold text-slate-900">{activeDossierApp.applicantName}</span>
                </div>
                <div>
                  <span className="text-slate-400">Target Role: </span>
                  <span className="font-semibold text-slate-800">{activeDossierApp.positionAppliedFor || "General Faculty"}</span>
                </div>
                <div>
                  <span className="text-slate-400">Email: </span>
                  <span className="font-medium text-slate-700">{activeDossierApp.email}</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                Audited: {new Date(activeDossierApp.aiExecutiveBrief.generatedAt).toLocaleString()}
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Section 1: Factual De-Noised Profile */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                  <span>1. Factual De-Noised Profile (Verifiable Academic & Teaching Core)</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {activeDossierApp.aiExecutiveBrief.deNoisedSummary}
                </p>
              </div>

              {/* Section 2: Two Column Grid (CBSE Compliance & Tenure Continuity) */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* CBSE Compliance */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>2. CBSE Affiliation & OASIS Audit</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-700">
                    {activeDossierApp.aiExecutiveBrief.statutoryCompliance}
                  </p>
                </div>

                {/* Tenure Continuity */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                    <Compass className="h-4 w-4 text-amber-600" />
                    <span>3. Tenure Stability & Mobility</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-700">
                    {activeDossierApp.aiExecutiveBrief.tenureContinuity}
                  </p>
                </div>
              </div>

              {/* Section 3: The Human Inquiry Guide (Probes) */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-950">
                    <HelpCircle className="h-4 w-4 text-indigo-600" />
                    <span>4. The Human Inquiry Guide (Targeted Interview Probes)</span>
                  </div>
                  <span className="text-[11px] text-indigo-700 font-medium">
                    Questions designed to probe pedagogical instincts & moral judgment
                  </span>
                </div>

                <div className="mt-4 space-y-3.5">
                  {activeDossierApp.aiExecutiveBrief.humanInquiryGuide.map((probe, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200/80 bg-white p-4 transition hover:border-indigo-300"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          Probe {i + 1} &bull; {probe.focusArea}
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-semibold text-slate-900 leading-snug">
                        &ldquo;{probe.probeQuestion}&rdquo;
                      </p>

                      <div className="mt-2.5 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-100">
                        <span className="font-semibold text-slate-800">Interviewer Guidance: </span>
                        <span>{probe.pedagogicalRationale}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Physical Document Checklist */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                  <FileCheck2 className="h-4 w-4 text-slate-700" />
                  <span>5. Physical Document Scrutiny Checklist (Mandatory for Interview Day)</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Registrar / Interview panel must physically inspect original credentials before formal appointment.
                </p>

                <div className="mt-3.5 grid gap-2 sm:grid-cols-2">
                  {activeDossierApp.aiExecutiveBrief.documentChecklist.map((doc, idx) => {
                    const isChecked = !!checkedDocs[doc];
                    return (
                      <label
                        key={idx}
                        onClick={() => handleToggleDocCheck(doc)}
                        className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs transition cursor-pointer select-none ${
                          isChecked
                            ? "border-emerald-300 bg-emerald-50/60 text-emerald-900"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100/70"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className={isChecked ? "line-through opacity-80" : "font-medium"}>
                          {doc}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Zero-Trust Verification Complete &bull; Permanent Record in Sanity</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(activeDossierApp._id, "interview_scheduled")}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition cursor-pointer"
                >
                  Confirm Interview Schedule
                </button>
                <button
                  onClick={() => setActiveDossierApp(null)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
