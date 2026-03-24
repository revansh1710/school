import LoginComponent from '../../components/Login';
import {redirect} from 'next/navigation';
import {getCurrentUser} from '../../../lib/auth'
export default async function Login(){
  const User=await getCurrentUser();
  if(User){
    redirect('/dashboard')
  }
  return(
    <>
    <LoginComponent/>
    </>
  )
}