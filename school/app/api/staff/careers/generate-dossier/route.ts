import { NextResponse } from "next/server";
import { getStaffUser } from "@/lib/adminAuth";
import { serverClient } from "@/app/lib/sanity/serverClient";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // 1. Role-based verification
    const user = await getStaffUser();
    if (!user || user.role !== "STAFF") {
      return NextResponse.json({ error: "Unauthorized. Staff login required." }, { status: 401 });
    }

    const { id, force = false } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Candidate application ID is required." }, { status: 400 });
    }

    // 2. Fetch application from Sanity
    const application = await serverClient.fetch(
      `*[_type == "careerEnquiry" && _id == $id][0]{
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
        aiExecutiveBrief,
        "resumeUrl": resume.asset->url
      }`,
      { id }
    );

    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    // If already generated and not forced, return cached brief
    if (application.aiExecutiveBrief && !force) {
      return NextResponse.json({
        success: true,
        cached: true,
        executiveBrief: application.aiExecutiveBrief,
      });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service key is not configured on the server." },
        { status: 500 }
      );
    }

    // 3. Synthesize the Principal's Executive Brief
    const prompt = `You are the Chief of Staff and Senior Regulatory Advisor to the School Principal.
The Principal and School Selection Committee are preparing to interview this candidate.
Your task is to prepare a strictly confidential, executive-level Briefing & Character Dossier.
Do NOT output generic corporate fluff. Be precise, grounded in CBSE Bye-Laws Section 5.3, and hyper-focused on human pedagogy, ethics, and tenure continuity.

Candidate Details:
- Name: ${application.applicantName}
- Position Applied: ${application.positionAppliedFor || "Faculty"}
- Email: ${application.email}
- Phone: ${application.phone || "Not specified"}
- AI Pre-Screening Summary: ${application.aiScreeningSummary || "N/A"}
- Pre-Screening Missing Qualifications: ${(application.aiMissingQualifications || []).join(", ") || "None"}
- Candidate's Cover Letter / Statement:
${application.message || "No cover statement submitted."}

Synthesis Directives:
1. De-Noised Summary: Strip away emotional marketing, self-flattery, and generic buzzwords. Summarize the verifiable academic degrees, subject alignment, and documented teaching background in 2-3 clear sentences.
2. Statutory Compliance Assessment: Evaluate against CBSE Affiliation Bye-Laws Section 5.3 (PGT/TGT/PRT requirements, mandatory B.Ed status, subject degree alignment, and CTET requirements).
3. Tenure Stability & Continuity: Analyze career stability, gap periods, transitions between school boards (e.g. ICSE vs CBSE), and potential reasons for mobility.
4. Human Inquiry Guide (3 to 4 High-Caliber Probes):
   - Formulate 3-4 profound, non-generic interview questions specifically for the Principal to ask.
   - For each question, explain the exact pedagogical, behavioral, or regulatory rationale (what the interviewer should listen for and look out for).
   - Tag each question with a focus area (e.g., "Classroom Pedagogy", "Handling Conflict & Parents", "Board Transition", "Integrity & Ethics").
5. Physical Document Checklist: List 4-6 specific original physical documents the school registrar must demand and verify in-person on interview day before an offer letter is issued.`;

    const { object: executiveBrief } = await generateObject({
      model: google("gemini-3.6-flash"),
      schema: z.object({
        deNoisedSummary: z.string().describe("Factual summary stripped of resume fluff"),
        statutoryCompliance: z.string().describe("CBSE Bye-Laws & OASIS compliance analysis"),
        tenureContinuity: z.string().describe("Career tenure, stability, and transition observations"),
        humanInquiryGuide: z.array(
          z.object({
            probeQuestion: z.string().describe("Targeted question for the Principal to ask"),
            pedagogicalRationale: z.string().describe("Why to ask this and what signals to listen for"),
            focusArea: z.string().describe("Domain category, e.g., Pedagogy, Conflict, Ethics"),
          })
        ).min(3).max(4),
        documentChecklist: z.array(z.string()).describe("Mandatory original documents to inspect"),
      }),
      prompt,
    });

    const fullBrief = {
      ...executiveBrief,
      generatedAt: new Date().toISOString(),
    };

    // 4. Persist into Sanity
    await serverClient.patch(id).set({ aiExecutiveBrief: fullBrief }).commit();

    return NextResponse.json({
      success: true,
      cached: false,
      executiveBrief: fullBrief,
    });
  } catch (error: any) {
    console.error("Failed to generate Principal's Executive Brief:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate executive brief" },
      { status: 500 }
    );
  }
}
