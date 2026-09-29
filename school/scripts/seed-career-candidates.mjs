import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const candidates = [
  {
    _type: "careerEnquiry",
    applicantName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43210",
    positionAppliedFor: "PGT Mathematics (Senior Secondary)",
    message: `Respected Principal and Selection Committee,\n\nI am writing to formally apply for the Senior Secondary PGT Mathematics faculty position at your esteemed institution.\n\nQualifications & Pedagogical Credentials:\n- Master of Science (M.Sc) in Pure Mathematics from Delhi University (81% aggregate).\n- Bachelor of Education (B.Ed) from Central Institute of Education, Delhi University (NCTE Approved).\n- Central Teacher Eligibility Test (CTET) Paper-II Qualified (2020).\n\nTeaching Experience (5 Years in Recognized CBSE Institutions):\n- PGT Mathematics at Delhi Public School, R.K. Puram (July 2021 – Present): Instructing Classes 11 and 12 with standard pass rates exceeding 94%. Mentored 4 students for the Regional Mathematical Olympiad (RMO).\n- TGT Mathematics at Modern Vidya Mandir, Noida (June 2019 – June 2021): Taught Classes 9 and 10, instituting weekly doubt-clearing sessions and hands-on geometry laboratory workshops.\n\nI align strictly with CBSE competency-based assessment guidelines and look forward to contributing to your school's academic excellence.\n\nWarm regards,\nPriya Sharma`,
    status: "interview_scheduled",
    aiScreeningScore: 92,
    aiRecommendation: "Recommend Interview",
    aiMissingQualifications: [],
    aiScreeningSummary: "Candidate holds verified M.Sc Mathematics, NCTE-recognized B.Ed, and CTET Paper-II. 5 years of verified institutional CBSE senior secondary classroom experience with high student board achievement. Exceeds CBSE Affiliation Bye-Laws Section 5.3 statutory requirements for PGT.",
    aiScreenedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    aiExecutiveBrief: {
      deNoisedSummary: "M.Sc Mathematics (Delhi University, 81%) and B.Ed (CIE, DU, NCTE-recognized). CTET Paper-II certified. 5 years uninterrupted CBSE institutional classroom teaching (DPS R.K. Puram & Modern Vidya Mandir) instructing senior secondary calculus, vectors, and algebra.",
      statutoryCompliance: "Full statutory compliance with CBSE Affiliation Bye-Laws Section 5.3 (PGT Post Graduate + B.Ed norm). Fully OASIS portal registrable with zero compliance friction.",
      tenureContinuity: "High tenure stability. Two clear multi-year institutional appointments (2.0 yrs and 3.2 yrs) with planned academic transition. No unexplained career voids.",
      humanInquiryGuide: [
        {
          focusArea: "Classroom Pedagogy & NEP 2020",
          probeQuestion: "CBSE has shifted 50% of Class 12 mathematics questions to competency and application-based problems. How do you prepare students who are accustomed to rote formula application for high-order thinking questions in Calculus?",
          pedagogicalRationale: "Assess if candidate teaches conceptual derivation or formula drills. Listen for student-centered problem solving and real-world mathematical modeling."
        },
        {
          focusArea: "Student Empathy & Doubt Clearing",
          probeQuestion: "Mathematics anxiety is common in Classes 11 and 12 when transitioning from basic Class 10 concepts. Describe your strategy when a student scoring 95 in Class 10 suddenly fails their first Class 11 trigonometry assessment.",
          pedagogicalRationale: "Evaluate pastoral care, emotional intelligence, and ability to rebuild confidence without assigning blame."
        },
        {
          focusArea: "Parental Engagement",
          probeQuestion: "How do you handle a parent who aggressively disputes the internal assessment marks given to their child in pre-board examinations?",
          pedagogicalRationale: "Tests diplomacy, adherence to transparent grading rubrics, and emotional composure under pressure."
        }
      ],
      documentChecklist: [
        "Original M.Sc Mathematics Degree & Consolidated Marksheets",
        "Original B.Ed Degree Certificate with NCTE Affiliation Proof",
        "CTET Paper-II Qualified Marksheet & Certificate",
        "Relieving Letter and Service Certificate from Delhi Public School",
        "Valid Photo ID (Aadhaar / Voter ID)"
      ],
      generatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  },
  {
    _type: "careerEnquiry",
    applicantName: "Rahul Verma",
    email: "rahul.verma89@example.com",
    phone: "+91 91234 56789",
    positionAppliedFor: "TGT Mathematics / Science",
    message: `Dear Hiring Team,\n\nI am applying for the teacher position in Mathematics. I completed my B.Com (Honours) from Pune University in 2021. I have been running a private coaching center for local students for 3 years, teaching Math and Accounts up to Class 10.\n\nPlease note: I do not possess a Bachelor of Education (B.Ed) or formal teacher training degree at this time, but I am very passionate about student success and fast at learning.\n\nLooking forward to an interview opportunity.\n\nSincerely,\nRahul Verma`,
    status: "ai_screened",
    aiScreeningScore: 35,
    aiRecommendation: "Missing Mandatory Certification",
    aiMissingQualifications: [
      "Mandatory Bachelor of Education (B.Ed)",
      "Relevant Undergraduate Degree in Mathematics/Science (Candidate holds B.Com)",
      "Lack of recognized institutional classroom teaching experience"
    ],
    aiScreeningSummary: "Statutory Red Flag: Candidate explicitly lacks a Bachelor of Education (B.Ed) and holds a Commerce degree (B.Com) rather than Mathematics/Science. Experience is limited to unaccredited private coaching without institutional CBSE classroom records. Appointment would breach CBSE Affiliation Bye-Laws Section 5.3.",
    aiScreenedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
  },
  {
    _type: "careerEnquiry",
    applicantName: "Ananya Sengupta",
    email: "ananya.sengupta@example.com",
    phone: "+91 97654 32109",
    positionAppliedFor: "PGT English Literature",
    message: `To The Principal,\n\nI seek to apply for the position of Senior Secondary English Faculty. I hold an M.A. in English Literature from Jadavpur University (First Class) and a regular B.Ed from St. Xavier's College of Education, Kolkata.\n\nFor the past 7 years, I have served as the Senior English Teacher at St. Augustine's High School (ICSE/ISC Board), training ISC candidates in Shakespearean drama and 20th-century poetry.\n\nI have recently relocated to this city due to family commitments and am eager to transition my deep pedagogical experience into a progressive CBSE institution.\n\nWarm regards,\nAnanya Sengupta`,
    status: "reviewed",
    aiScreeningScore: 88,
    aiRecommendation: "Recommend Interview",
    aiMissingQualifications: [
      "CBSE Board Assessment Pattern Familiarity (Prior experience is 100% ICSE/ISC)"
    ],
    aiScreeningSummary: "Strong academic foundation: M.A. English (First Class) + recognized B.Ed. 7 years of senior classroom teaching experience under CISCE/ISC board. Qualified under CBSE Section 5.3. Transition requires evaluation of CBSE assessment pattern adaptation.",
    aiScreenedAt: new Date(Date.now() - 86400000 * 1.2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    aiExecutiveBrief: {
      deNoisedSummary: "M.A. English Literature (Jadavpur University) and B.Ed (St. Xavier's College). 7 years continuous senior secondary classroom experience at St. Augustine's (CISCE board) teaching ISC English Literature and Language. Strong academic pedigree.",
      statutoryCompliance: "Fully compliant with CBSE Affiliation Bye-Laws Section 5.3 for PGT English. Eligible for immediate OASIS registration.",
      tenureContinuity: "Exceptional institutional loyalty: 7 consecutive years at a single reputable institution. Relocation is family-driven; verified bona fide move.",
      humanInquiryGuide: [
        {
          focusArea: "Board Curriculum & Evaluation Transition",
          probeQuestion: "You have taught ISC English for 7 years, which places heavy emphasis on stylistic essay-writing and detailed textual excerpts. CBSE Class 12 English Core has a very different format focusing on formal note-making, business correspondence, and NCERT-specific thematic rubrics. How quickly can you calibrate your marking to CBSE benchmarks?",
          pedagogicalRationale: "Examine whether candidate acknowledges the structural differences between CISCE and CBSE, or dismisses CBSE as 'easier'. Look for humility and willingness to study CBSE marking schemes."
        },
        {
          focusArea: "Inclusive Language Pedagogy",
          probeQuestion: "In an ICSE school, students often enter with high English fluency. In our diverse CBSE classrooms, students come from varying linguistic backgrounds. How do you ensure first-generation English learners do not feel intimidated during text analysis?",
          pedagogicalRationale: "Probes inclusive classroom management and differentiated instruction techniques for students with mixed language proficiencies."
        },
        {
          focusArea: "Co-Curricular Debate & MUN Leadership",
          probeQuestion: "English department faculty are expected to mentor the school's Model United Nations (MUN) and Debating Society. What past experience do you have in coaching students for competitive public speaking?",
          pedagogicalRationale: "Identifies institutional value-add beyond textbook syllabus delivery."
        }
      ],
      documentChecklist: [
        "Original M.A. English Degree & Year-wise Marksheets",
        "Original B.Ed Degree Certificate",
        "Relieving & Character Certificate from St. Augustine's High School",
        "7 Years Service Experience Book / Salary Slips",
        "Proof of Permanent Address / Relocation Verification"
      ],
      generatedAt: new Date(Date.now() - 86400000 * 1.2).toISOString()
    }
  }
];

async function seed() {
  console.log("Seeding benchmark candidate applications into Sanity...");
  try {
    for (const c of candidates) {
      // Check if candidate already exists
      const existing = await client.fetch(
        `*[_type == "careerEnquiry" && email == $email][0]._id`,
        { email: c.email }
      );

      if (existing) {
        console.log(`Updating existing record for ${c.applicantName} (${c.email})...`);
        await client.patch(existing).set(c).commit();
      } else {
        console.log(`Creating new record for ${c.applicantName} (${c.email})...`);
        await client.create(c);
      }
    }
    console.log("Candidate benchmark seed complete!");
  } catch (err) {
    console.error("Error seeding candidates:", err);
  }
}

seed();
