import {cookies} from 'next/headers';
import { query } from '../../../../lib/db';

export async function POST(){
    try{
        const cookieStore=await cookies();
        const sessionId=cookieStore.get("session")?.value;
        if(sessionId){
            await query('DELETE FROM "Session" WHERE id = $1', [sessionId]).catch(()=>{})
        }
        cookieStore.set("session","",{
            maxAge:0,
            path:'/'
        })
        return Response.json({success:true})
    }catch(error){
        console.error("Logout error:",error)
        return Response.json(
            {error:"Logout Failed"},
            {status:500}
        )
    }
}