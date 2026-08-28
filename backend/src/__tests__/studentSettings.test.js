import { describe, it, expect } from "@jest/globals";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import studentSettingsRoutes from "../routes/studentSettings.routes.js";
import adminSettingsRoutes from "../routes/adminSettings.routes.js";
const app = express();
app.use(express.json());
app.use("/api/student/settings", studentSettingsRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
const JWT_SECRET = process.env.JWT_SECRET || "test_secret";
process.env.JWT_SECRET = JWT_SECRET;
const generateToken = (role = "STUDENT") => {
  return jwt.sign({ userId: "test-student-id", role }, JWT_SECRET);
};
describe("Student Settings API Endpoints", () => {
  const studentToken = generateToken("STUDENT");
  const adminToken = generateToken("ADMIN");
  describe("Authentication & Role Protection", () => {
    it("should reject unauthenticated requests to student settings", async () => {
      const res = await request(app).get("/api/student/settings/profile");
      expect(res.status).toBe(401);
    });
    it("should allow student access to student profile", async () => {
      const res = await request(app).get("/api/student/settings/profile").set("Authorization", `Bearer ${studentToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    });
    it("integration test: confirming a student CANNOT access admin platform settings (403 Forbidden)", async () => {
      const res = await request(app).get("/api/admin/settings/platform").set("Authorization", `Bearer ${studentToken}`);
      expect(res.status).toBe(403);
      expect(res.body.message).toContain("Forbidden");
    });
  });
  describe("Student Profile Endpoints & Validation", () => {
    it("should return student profile data", async () => {
      const res = await request(app).get("/api/student/settings/profile").set("Authorization", `Bearer ${studentToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBeDefined();
    });
    it("should reject profile update with invalid email format", async () => {
      const res = await request(app).patch("/api/student/settings/profile").set("Authorization", `Bearer ${studentToken}`).send({ email: "bad-email-format" });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("valid email address");
    });
    it("should reject profile update with invalid gender choice", async () => {
      const res = await request(app).patch("/api/student/settings/profile").set("Authorization", `Bearer ${studentToken}`).send({ gender: "InvalidGender" });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("valid gender option");
    });
  });
  describe("Password Change Validation", () => {
    it("should reject weak password change requests", async () => {
      const res = await request(app).post("/api/student/settings/change-password").set("Authorization", `Bearer ${studentToken}`).send({
        currentPassword: "oldPassword123!",
        newPassword: "short",
        confirmPassword: "short"
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("at least 8 characters long");
    });
    it("should reject when new password and confirm password do not match", async () => {
      const res = await request(app).post("/api/student/settings/change-password").set("Authorization", `Bearer ${studentToken}`).send({
        currentPassword: "oldPassword123!",
        newPassword: "StrongPassword1!",
        confirmPassword: "DifferentPassword1!"
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("do not match");
    });
  });
  describe("Notification JSON Preferences", () => {
    it("should retrieve student notification preferences", async () => {
      const res = await request(app).get("/api/student/settings/notifications").set("Authorization", `Bearer ${studentToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.emailNotifications).toBeDefined();
    });
    it("should update JSON notification preferences", async () => {
      const payload = {
        emailNotifications: true,
        inAppNotifications: false,
        courseNotifications: {
          newAssignment: true,
          gradePosted: true,
          deadlineReminder: true,
          announcements: false
        }
      };
      const res = await request(app).patch("/api/student/settings/notifications").set("Authorization", `Bearer ${studentToken}`).send({ notificationPreferences: payload });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    });
  });
  describe("UI Preferences", () => {
    it("should validate theme value on preferences update", async () => {
      const res = await request(app).patch("/api/student/settings/preferences").set("Authorization", `Bearer ${studentToken}`).send({ theme: "UnsupportedTheme" });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Theme must be one of");
    });
  });
  describe("Account Deactivation (Soft Delete)", () => {
    it("should require password confirmation to deactivate account", async () => {
      const res = await request(app).post("/api/student/settings/deactivate").set("Authorization", `Bearer ${studentToken}`).send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Password confirmation is required");
    });
  });
});
