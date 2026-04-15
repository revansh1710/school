import {admissionsQuery} from '../lib/queries/admission'
import AdmissionsPageComponent from '../components/admissions/admission';
import AdmissionsEnquiryForm from '../components/admissions/admissionEnquiryForm';
import AdmissionHeader from '../components/admissions/AdmissionHeader';
import { client } from "@/sanity/lib/client";
export default async function Home() {
    const admissionData=await client.fetch(admissionsQuery)
    return(
        <>
        <AdmissionHeader/>
        <AdmissionsPageComponent data={admissionData}/>
        <AdmissionsEnquiryForm/>
        </>
    )
}