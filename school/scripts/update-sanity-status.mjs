import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function run() {
  const email = 'testmanualparent@school.local';
  const targetStatus = process.argv[2] || 'documents_submitted';

  try {
    const enquiry = await serverClient.fetch(
      `*[_type == "admissionEnquiry" && email == $email][0]`,
      { email }
    );

    if (!enquiry) {
      console.error('Enquiry not found for email:', email);
      return;
    }

    console.log(`Updating enquiry ${enquiry._id} to status: ${targetStatus}`);

    let patchData = { status: targetStatus };

    if (targetStatus === 'documents_submitted') {
      patchData.documentsStatus = 'submitted';
    } else if (targetStatus === 'interview_scheduled') {
      patchData.interviewApprovalStatus = 'approved';
      patchData.interviewDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 days from now
    }

    await serverClient
      .patch(enquiry._id)
      .set(patchData)
      .commit();

    console.log('Sanity document updated successfully.');
  } catch (e) {
    console.error('Error updating Sanity:', e);
  }
}

run();
