import { NextResponse } from "next/server";
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

    // Prepare base document
    const newEnquiry: any = {
      _type: "careerEnquiry",
      applicantName,
      email,
      phone: phone || "",
      positionAppliedFor: positionAppliedFor || "",
      message: message || "",
      status: "new",
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

    // Create document
    await serverClient.create(newEnquiry);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Career application submit error:", error);
    return NextResponse.json({ error: "Failed to submit application. Please try again." }, { status: 500 });
  }
}
