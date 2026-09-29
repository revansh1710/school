import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { client } from "../../../../sanity/lib/client";
import { serverClient } from "../../../lib/sanity/serverClient";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const applicantName = formData.get("applicantName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const positionAppliedFor = formData.get("positionAppliedFor") as string;
    const message = formData.get("message") as string;
    const resumeFile = formData.get("resume") as File | null;
    const portfolioFile = formData.get("portfolio") as File | null;

    if (!applicantName || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Automated Zero-Trust AI Pre-Screening using Gemini 3.6 Flash
    let aiScreeningScore = 50;
    let aiRecommendation = "Potential Fit";
    let aiMissingQualifications: string[] = [];
    let aiScreeningSummary = "Automated pre-screening completed.";

    // Extract text from cover letter and uploaded resume file (if text/readable)
    let candidateSubmissionText = message ? `COVER LETTER / MESSAGE:\n${message}\n` : "";
    if (resumeFile && resumeFile.size > 0 && resumeFile.size < 500_000) {
      try {
        const fileContent = await resumeFile.text();
        if (fileContent && !fileContent.includes("\u0000")) {
          candidateSubmissionText += `\nRESUME CONTENT:\n${fileContent.slice(0, 3000)}\n`;
        }
      } catch (e) {
        // Binary file, skip inline text append
      }
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (apiKey && candidateSubmissionText.trim()) {
      try {
        const { object } = await generateObject({
          model: google("gemini-3.6-flash"),
          schema: z.object({
            score: z.number().min(0).max(100),
            recommendation: z.enum([
              "Recommend Interview",
              "Missing Mandatory Certification",
              "Potential Fit",
              "Under-qualified",
            ]),
            missingQualifications: z.array(z.string()),
            summary: z.string(),
          }),
          prompt: `You are the Official CBSE Faculty Recruitment Screener for the School.
Evaluate this application for the position: "${positionAppliedFor || "Teaching Position"}".

Candidate Name: ${applicantName}
Candidate Submission (Cover letter and/or resume):
${candidateSubmissionText}

STRICT CBSE EVALUATION CRITERIA:
1. Mandatory B.Ed Rule (Zero-Assumption):
   - A candidate is ONLY considered to hold a Bachelor of Education (B.Ed) if it is EXPLICITLY listed in their education/certifications.
   - If B.Ed is simply omitted or not mentioned anywhere, you MUST treat it as MISSING. Never assume or infer a candidate has a B.Ed.
2. Experience & Domain Evaluation:
   - Scrutinize the Experience section: If experience only lists informal home tutoring, non-school accounting/clerical jobs, or fresh graduate status with no recognized CBSE institutional classroom teaching, flag "Lack of formal institutional classroom teaching experience".
   - Subject Alignment: A Commerce degree (B.Com) does NOT satisfy the CBSE Mathematics qualification (requires M.Sc/B.Sc Mathematics).
3. Recommendation & Scoring:
   - If B.Ed is missing (either omitted OR denied): Recommendation MUST be "Missing Mandatory Certification" or "Under-qualified", score capped at 30-45.
   - If degree is irrelevant and candidate has no institutional teaching experience: Score capped at 25-40.
   - Candidates with relevant subject degree, explicitly listed B.Ed, and 2+ years of institutional teaching experience qualify for 80-100 with "Recommend Interview".`,
        });

        aiScreeningScore = object.score;
        aiRecommendation = object.recommendation;
        aiMissingQualifications = object.missingQualifications;
        aiScreeningSummary = object.summary;
      } catch (aiErr) {
        console.warn("[Apply Pre-Screening AI Error, using fallback]", aiErr);
      }
    }

    // Fallback negation-aware evaluation if Gemini was unreachable
    if (aiScreeningSummary === "Automated pre-screening completed.") {
      const lowerMessage = (message || "").toLowerCase();
      const hasNegationOfBed = /not\s+(have|possess)?\s*(a\s*)?b\.?ed/i.test(lowerMessage) || 
                               /no\s+b\.?ed/i.test(lowerMessage) || 
                               /without\s+b\.?ed/i.test(lowerMessage);
      const hasBed = (lowerMessage.includes("b.ed") || lowerMessage.includes("bachelor of education")) && !hasNegationOfBed;
      const hasMathDegree = lowerMessage.includes("m.sc") || lowerMessage.includes("b.sc") || lowerMessage.includes("mathematics");
      
      if (!hasBed) {
        aiMissingQualifications.push("Mandatory Bachelor of Education (B.Ed)");
        aiRecommendation = "Missing Mandatory Certification";
        aiScreeningScore = 40;
      } else if (!hasMathDegree) {
        aiMissingQualifications.push("Relevant subject degree in Mathematics");
        aiRecommendation = "Under-qualified";
        aiScreeningScore = 55;
      } else {
        aiRecommendation = "Recommend Interview";
        aiScreeningScore = 90;
      }
      aiScreeningSummary = `Pre-screening fallback: B.Ed verified: ${hasBed}. Subject degree verified: ${hasMathDegree}.`;
    }

    // Prepare base document with AI screening fields
    const newEnquiry: any = {
      _type: "careerEnquiry",
      applicantName,
      email,
      phone: phone || "",
      positionAppliedFor: positionAppliedFor || "",
      message: message || "",
      status: "ai_screened",
      aiScreeningScore,
      aiRecommendation,
      aiMissingQualifications,
      aiScreeningSummary,
      aiScreenedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Handle File Uploads
    if (resumeFile && resumeFile.size > 0) {
      const resumeAsset = await client.assets.upload("file", resumeFile);
      newEnquiry.resume = {
        _type: "file",
        asset: { _ref: resumeAsset._id },
      };
    }

    if (portfolioFile && portfolioFile.size > 0) {
      const portfolioAsset = await client.assets.upload("file", portfolioFile);
      newEnquiry.portfolio = {
        _type: "file",
        asset: { _ref: portfolioAsset._id },
      };
    }

    // Create document in Sanity
    const createdDoc = await serverClient.create(newEnquiry);

    return NextResponse.json({
      success: true,
      documentId: createdDoc._id,
      screening: {
        score: aiScreeningScore,
        recommendation: aiRecommendation,
      },
    });

  } catch (error: any) {
    console.error("Career application submit error:", error);
    return NextResponse.json({ error: "Failed to submit application. Please try again." }, { status: 500 });
  }
}
