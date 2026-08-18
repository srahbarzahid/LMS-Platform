import { prisma } from "../src/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // Hashed default passwords
  const adminPassword = await bcrypt.hash("admin123", 12);
  const instructorPassword = await bcrypt.hash("Hisham@123", 12);
  const studentPassword = await bcrypt.hash("Rahbar@123", 12);

  // 1. Create Super Admin User
  await prisma.user.upsert({
    where: { email: "admin@pitech.com" },
    update: { password: adminPassword },
    create: {
      name: "Super Admin",
      email: "admin@pitech.com",
      password: adminPassword,
      role: "ADMIN",
      isEmailVerified: true,
      bio: "System Administrator for Pi Tech LMS Platform",
    },
  });

  // 2. Create Instructor User
  await prisma.user.upsert({
    where: { email: "hisham@gmail.com" },
    update: { password: instructorPassword, name: "Hisham" },
    create: {
      name: "Hisham",
      email: "hisham@gmail.com",
      password: instructorPassword,
      role: "INSTRUCTOR",
      isEmailVerified: true,
      designation: "Senior Software Architect & Educator",
      bio: "10+ years teaching web development and data structures.",
    },
  });

  // 3. Create Student User
  await prisma.user.upsert({
    where: { email: "rahbar@gmail.com" },
    update: { password: studentPassword, name: "Rahbar Zahid" },
    create: {
      name: "Rahbar Zahid",
      email: "rahbar@gmail.com",
      password: studentPassword,
      role: "STUDENT",
      isEmailVerified: true,
      college: "Stanford University",
    },
  });

  // 4. Create Categories
  const categories = [
    { name: "Development", slug: "development", description: "Web, Mobile, and Software Development", icon: "Code" },
    { name: "Design", slug: "design", description: "UI/UX, Graphic Design, and Figma", icon: "Palette" },
    { name: "Business", slug: "business", description: "Entrepreneurship, Finance, and Management", icon: "Briefcase" },
    { name: "Marketing", slug: "marketing", description: "Digital Marketing, SEO, and Social Media", icon: "Megaphone" },
    { name: "Data Science", slug: "data-science", description: "Machine Learning, AI, and Python", icon: "Database" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // 5. Default Platform Settings
  await prisma.platformSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      lmsName: "Pi Tech LMS Platform",
      supportEmail: "support@pitech.com",
      supportPhone: "+1-800-555-0199",
    },
  });

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
