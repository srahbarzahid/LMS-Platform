import prisma from "./src/prisma.js";

async function verifyMySQL() {
  try {
    const dbResult = await prisma.$queryRaw`SELECT DATABASE() as dbName, VERSION() as mysqlVersion;`;
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const courseCount = await prisma.course.count();
    
    console.log("==========================================");
    console.log("MYSQL CONNECTION STATUS: CONNECTED & LIVE");
    console.log("==========================================");
    console.log("Database Name  :", dbResult[0].dbName);
    console.log("MySQL Version  :", dbResult[0].mysqlVersion);
    console.log("Users in DB    :", userCount);
    console.log("Categories DB  :", categoryCount);
    console.log("Courses in DB  :", courseCount);
    console.log("==========================================");
  } catch (error) {
    console.error("MySQL Connection Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyMySQL();
