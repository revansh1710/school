import {admissionsQuery} from '../lib/queries/admission'
import AdmissionsPageComponent from '../components/admissions/admission';
import AdmissionsEnquiryForm from '../components/admissions/admissionEnquiryForm';
import Header from '../components/Header';
import Footer from '../components/Footer'
import { client } from "@/sanity/lib/client";
import {getCurrentUser} from '../../lib/auth'
export default async function Home() {
    const admissionData=await client.fetch(admissionsQuery)
    const user=await getCurrentUser();
    return(
        <>
        <Header user={user}/>
        <AdmissionsPageComponent data={admissionData}/>
        <AdmissionsEnquiryForm/>
        <Footer/>
        </>
    )
}