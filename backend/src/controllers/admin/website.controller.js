import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to persistent website_content.json file
const contentFilePath = path.join(__dirname, "../../../database/website_content.json");

// Helper to read content from disk safely
const readPersistentContent = () => {
  try {
    if (fs.existsSync(contentFilePath)) {
      const rawData = fs.readFileSync(contentFilePath, "utf-8");
      return JSON.parse(rawData);
    }
  } catch (err) {
    console.error("Error reading website_content.json:", err);
  }
  return {
    hero: {
      badgeText: "Save Time On Your Studies",
      headlineLine1: "Learn New Skills.",
      headlineLine2: "Achieve Your Dreams.",
      headline: "Learn New Skills.\nAchieve Your Dreams.",
      subtitle: "Explore thousands of online courses from expert instructors. Level up your skills, discover new hobbies, and take your career to the next level.",
      ctaText: "View Courses",
      ctaLink: "/courses",
    },
    popularCategories: {
      sectionTitle: "Our Popular Categories",
      sectionSubtitle: "Explore courses across various high-demand industries.",
      items: [
        { id: "1", name: "Development", count: "120+ Courses", icon: "Code", slug: "development" },
        { id: "2", name: "Design", count: "80+ Courses", icon: "Palette", slug: "design" },
        { id: "3", name: "Business", count: "60+ Courses", icon: "Briefcase", slug: "business" },
        { id: "4", name: "Marketing", count: "40+ Courses", icon: "Megaphone", slug: "marketing" },
      ],
    },
    successStories: { sectionTitle: "Success Stories", sectionSubtitle: "See how Pi Tech has helped thousands of students transform their careers.", testimonials: [] },
    contactInfo: { email: "pibotsacademy@gmail.com", phone: "+91 91884 11223", timing: "Mon-Sat, 9am-6pm IST", office: "Pi BOTS Makerhub, Mampad, Kerala 676542, India" },
    footer: { copyright: "© 2026 Pi Tech LMS Platform. All Rights Reserved." },
    faqs: [],
  };
};

// Helper to write content to disk persistently
const savePersistentContent = (data) => {
  try {
    const dir = path.dirname(contentFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(contentFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving to website_content.json:", err);
  }
};

const adminWebsiteController = {
  // GET /api/admin/content & GET /api/public/content
  getWebsiteContent: async (req, res) => {
    try {
      const data = readPersistentContent();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Get website content error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  // PUT /api/admin/content
  updateWebsiteContent: async (req, res) => {
    try {
      const currentContent = readPersistentContent();
      const { hero, popularCategories, successStories, contactInfo, footer, faqs } = req.body;

      // Complete replacement of sections to ensure deletions are persisted permanently
      const updatedContent = {
        ...currentContent,
        ...(hero && { hero }),
        ...(popularCategories && { popularCategories }),
        ...(successStories && { successStories }),
        ...(contactInfo && { contactInfo }),
        ...(footer && { footer }),
        ...(faqs && { faqs }),
      };

      // Save to disk permanently
      savePersistentContent(updatedContent);

      res.status(200).json({
        success: true,
        message: "Website content updated successfully and saved permanently",
        data: updatedContent,
      });
    } catch (error) {
      console.error("Update website content error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
};

export { adminWebsiteController };
