import {cookies} from 'next/headers';
import prisma from '../../../lib/prisma';

export async function POST(){
    try{
        const cookieStore=await cookies();
        const sessionId=cookieStore.get("session")?.value;
        if(sessionId){
            await prisma.session.delete({
                where:{id:sessionId}
            }).catch(()=>{})
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