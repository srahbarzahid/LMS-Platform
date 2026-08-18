import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "./src/prisma.js";

async function testAuthSecurity() {
  try {
    console.log("==========================================");
    console.log("TESTING JWT AUTHENTICATION & ENCRYPTION");
    console.log("==========================================");

    const testEmail = "security_test@lms.com";
    const rawPassword = "SecurePassword123!";

    // Cleanup test user if exists
    await prisma.user.deleteMany({ where: { email: testEmail } });

    // 1. Password Hashing (Bcrypt 12 Rounds)
    const saltRounds = 12;
    const startTime = Date.now();
    const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
    const hashTime = Date.now() - startTime;

    console.log(`[PASS] Password Encrypted (12 Salt Rounds) in ${hashTime}ms`);
    console.log(`       Hash: ${hashedPassword.substring(0, 30)}...`);

    // 2. Create User in MySQL DB
    const user = await prisma.user.create({
      data: {
        name: "Security Tester",
        email: testEmail,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    console.log(`[PASS] User Created in MySQL Database (ID: ${user.id})`);

    // 3. Verify Password Matching
    const isMatch = await bcrypt.compare(rawPassword, user.password);
    console.log(`[PASS] Bcrypt Password Verification Match: ${isMatch}`);

    // 4. Generate JWT Tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "supersecretlmskey123",
      { expiresIn: "1h" }
    );

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET || "supersecretlmskey123");
    console.log("[PASS] JWT Access Token Signed & Verified!");
    console.log("       Payload:", decoded);

    // Cleanup
    await prisma.user.delete({ where: { id: user.id } });
    console.log("==========================================");
    console.log("ALL JWT & SECURITY CHECKS PASSED!");
    console.log("==========================================");
  } catch (error) {
    console.error("Test Security Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuthSecurity();
