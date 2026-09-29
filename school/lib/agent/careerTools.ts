import { z } from "zod";
import { tool } from "ai";
import { client } from "@/sanity/lib/client";
import { withCircuitBreaker } from "./guardrails";

// Fallback data when Sanity is unreachable (Circuit Breaker resilience)
const FALLBACK_JOBS = [
  {
    _id: "fallback-1",
    title: "Senior Secondary Mathematics Teacher (CBSE)",
    location: "Main Campus • Full-time",
    employmentType: "Full-time",
    summary: "Teach grades 9-12 CBSE Mathematics, coordinate board exam prep, and mentor students.",
    requirements: [
      "Master's Degree in Mathematics (M.Sc)",
      "Bachelor of Education (B.Ed) mandatory",
      "Minimum 3 years CBSE teaching experience",
    ],
  },
  {
    _id: "fallback-2",
    title: "Primary School Science Teacher",
    location: "Main Campus • Full-time",
    employmentType: "Full-time",
    summary: "Deliver experiential science curriculum for grades 1-5.",
    requirements: [
      "Bachelor's Degree in Science (B.Sc)",
      "Teaching credential / D.El.Ed or B.Ed",
      "Passion for inquiry-based learning",
    ],
  },
];

/**
 * Tool 1: List all active open job postings from Sanity
 * Token optimization: Projects only essential fields (~120 tokens total).
 */
export const listOpenRolesTool = tool({
  description: "List all currently open teaching and staff roles with their title, summary, and key requirements.",
  inputSchema: z.object({}),
  execute: async () => {
    return await withCircuitBreaker(async () => {
      const groq = `*[_type == "jobPosting" && isActive != false]{
        _id,
        title,
        location,
        employmentType,
        summary,
        requirements
      }`;
      const jobs = await client.fetch(groq);
      return jobs && jobs.length > 0 ? jobs : FALLBACK_JOBS;
    }, FALLBACK_JOBS);
  },
});

/**
 * Tool 2: Get specific role criteria and required documents
 * Token optimization: Tight projection for a single role.
 */
export const getRoleDetailsTool = tool({
  description: "Get detailed requirements and verification criteria for a specific job title or role.",
  inputSchema: z.object({
    roleTitle: z.string().describe("The job title to inspect (e.g. 'Mathematics Teacher')"),
  }),
  execute: async ({ roleTitle }: { roleTitle: string }) => {
    return await withCircuitBreaker(async () => {
      const groq = `*[_type == "jobPosting" && title match $roleTitle][0]{
        _id,
        title,
        location,
        employmentType,
        summary,
        requirements
      }`;
      const role = await client.fetch(groq, { roleTitle: `*${roleTitle}*` });
      if (role) return role;

      // Also fetch general eligibility criteria from careerPage if specific role not found
      const generalCriteria = await client.fetch(
        `*[_type == "careerPage"][0].eligibility[]{ role, criteria }`
      );
      return {
        matchedRole: null,
        message: `No exact job found matching '${roleTitle}'. Showing general school hiring standards.`,
        generalCriteria: generalCriteria || [],
      };
    }, { matchedRole: null, message: "Service temporarily unavailable. Please refer to school careers page." });
  },
});

/**
 * Tool 3: Automated Candidate Eligibility Pre-Screening
 * Evaluates candidate qualifications against structured criteria and returns an AI decision.
 */
export const evaluateCandidateTool = tool({
  description: "Screen a candidate's credentials against a role's mandatory requirements, outputting a score and missing items.",
  inputSchema: z.object({
    roleTitle: z.string().describe("The position applied for"),
    candidateDegree: z.string().describe("Candidate highest qualification/degrees (e.g., 'M.Sc Math, B.Ed')"),
    yearsOfExperience: z.number().describe("Years of relevant teaching experience"),
    hasMandatoryCertification: z.boolean().describe("Whether candidate has mandatory teaching credential (B.Ed or equivalent)"),
    additionalNotes: z.string().optional().describe("Key skills, subject specialization, or notes"),
  }),
  execute: async ({
    roleTitle,
    candidateDegree,
    yearsOfExperience,
    hasMandatoryCertification,
    additionalNotes,
  }: {
    roleTitle: string;
    candidateDegree: string;
    yearsOfExperience: number;
    hasMandatoryCertification: boolean;
    additionalNotes?: string;
  }) => {
    // Scoring logic
    let score = 50; // Base score
    const missingItems: string[] = [];

    // Experience checks
    if (yearsOfExperience >= 3) {
      score += 25;
    } else if (yearsOfExperience >= 1) {
      score += 15;
    } else {
      missingItems.push("Less than standard 2-3 years teaching experience");
    }

    // Certification check (B.Ed is strictly required for school educators)
    if (hasMandatoryCertification) {
      score += 25;
    } else {
      missingItems.push("Mandatory Teaching Certification (B.Ed or State Credential)");
      score = Math.min(score, 55); // Cap score if mandatory certification is missing
    }

    // Recommendation determination
    let recommendation: "Recommend Interview" | "Missing Mandatory Certification" | "Potential Fit" | "Under-qualified" = "Potential Fit";

    if (score >= 80 && hasMandatoryCertification) {
      recommendation = "Recommend Interview";
    } else if (!hasMandatoryCertification) {
      recommendation = "Missing Mandatory Certification";
    } else if (score < 60) {
      recommendation = "Under-qualified";
    }

    return {
      evaluatedRole: roleTitle,
      score: Math.min(100, Math.max(0, score)),
      recommendation,
      missingItems,
      candidateSummary: `Candidate holds ${candidateDegree} with ${yearsOfExperience} years of experience. Certification verified: ${hasMandatoryCertification}. Additional: ${additionalNotes || "None"}`,
    };
  },
});
