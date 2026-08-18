import { prisma } from "../prisma.js";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
const uploadDir = path.join(process.cwd(), "uploads");
const generateCertificate = async (req, res) => {
  try {
    const studentId = req.user?.userId;
    const courseId = req.params.courseId;
    if (!studentId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: studentId, courseId }
    });
    if (!enrollment || enrollment.status !== "COMPLETED") {
      res.status(400).json({ message: "Course is not fully completed" });
      return;
    }
    const existing = await prisma.certificate.findFirst({
      where: { userId: studentId, courseId }
    });
    if (existing) {
      res.json(existing);
      return;
    }
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    const certificateId = `CERT-${courseId.substring(0, 5).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const verificationUrl = `http://localhost:5173/verify-certificate/${certificateId}`;
    const qrDataUrl = await QRCode.toDataURL(verificationUrl);
    const pdfFilename = `certificate-${certificateId}.pdf`;
    const pdfPath = path.join(uploadDir, pdfFilename);
    const doc = new PDFDocument({ layout: "landscape", size: "A4" });
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);
    doc.rect(0, 0, 841.89, 595.28).fill("#ffffff");
    doc.fillColor("#1e293b").fontSize(40).text("CERTIFICATE OF COMPLETION", 0, 100, { align: "center" });
    doc.fontSize(20).text("This is proudly presented to", 0, 180, { align: "center" });
    doc.fillColor("#f97316").fontSize(35).text(student?.name || "Student", 0, 230, { align: "center" });
    doc.fillColor("#64748b").fontSize(16).text("for successfully completing the course", 0, 290, { align: "center" });
    doc.fillColor("#1e293b").fontSize(25).text(course?.title || "Course", 0, 330, { align: "center" });
    const dateStr = (/* @__PURE__ */ new Date()).toLocaleDateString();
    doc.fontSize(12).text(`Date Issued: ${dateStr}`, 100, 480);
    doc.text(`Certificate ID: ${certificateId}`, 100, 500);
    doc.end();
    await new Promise((resolve) => writeStream.on("finish", resolve));
    const certificate = await prisma.certificate.create({
      data: {
        certificateId,
        userId: studentId,
        courseId,
        instructorId: course?.instructorId,
        completionDate: /* @__PURE__ */ new Date(),
        certificateUrl: `/uploads/${pdfFilename}`,
        qrCodeUrl: qrDataUrl,
        verificationUrl
      }
    });
    res.status(201).json(certificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate certificate" });
  }
};
const getStudentCertificates = async (req, res) => {
  try {
    const studentId = req.user?.userId;
    const certificates = await prisma.certificate.findMany({
      where: { userId: studentId },
      include: { course: true, user: true }
    });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const verifyCertificate = async (req, res) => {
  try {
    const certificateId = req.params.certificateId;
    const certificate = await prisma.certificate.findUnique({
      where: { certificateId },
      include: { course: true, user: { select: { name: true } } }
    });
    if (!certificate) {
      res.status(404).json({ message: "Certificate not found or invalid" });
      return;
    }
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export {
  generateCertificate,
  getStudentCertificates,
  verifyCertificate
};
