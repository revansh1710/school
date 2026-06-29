import LoginComponent from '../../components/Login';
import {redirect} from 'next/navigation';
import {getCurrentUser} from '../../../lib/auth'
import Header from '@/app/components/Header';
import Footer from '../../components/Footer'
export default async function Login(){
  const User=await getCurrentUser();
  if(User){
    redirect('/dashboard')
  }
  return(
    <>
    <Header/>
    <LoginComponent/>
    <Footer/>
    </>
  )
}