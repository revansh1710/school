import  { PrismaClient } from "@/generated/prisma/client"

import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";
const prisma = new PrismaClient({
  adapter: new PrismaPostgresAdapter({
    connectionString: process.env.DATABASE_URL??'',
  }),
});
export default prisma