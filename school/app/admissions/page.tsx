import {admissionsQuery} from '../lib/queries/admission'
import AdmissionsPageComponent from '../components/admissions/admission';
import AdmissionsEnquiryForm from '../components/admissions/admissionEnquiryForm';
import { client } from "@/sanity/lib/client";
import {getCurrentUser} from '../../lib/auth'
export default async function Home() {
    const admissionData=await client.fetch(admissionsQuery)
    return(
        <>
        <AdmissionsPageComponent data={admissionData}/>
        <AdmissionsEnquiryForm/>
        </>
    )
}