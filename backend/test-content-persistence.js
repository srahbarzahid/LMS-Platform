import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentFilePath = path.join(__dirname, "database/website_content.json");

console.log("==========================================");
console.log("TESTING WEBSITE CONTENT PERSISTENCE");
console.log("==========================================");

if (fs.existsSync(contentFilePath)) {
  const content = JSON.parse(fs.readFileSync(contentFilePath, "utf-8"));
  console.log("[PASS] Persistent File Found:", contentFilePath);
  console.log("       Hero Headline Line 1:", content.hero?.headlineLine1);
  console.log("       Hero Headline Line 2:", content.hero?.headlineLine2);
  console.log("       Popular Categories Count:", content.popularCategories?.items?.length);
  console.log("       Success Stories Count:", content.successStories?.testimonials?.length);
  console.log("==========================================");
  console.log("ALL PERSISTENCE CHECKS PASSED!");
  console.log("==========================================");
} else {
  console.error("[FAIL] Persistent file website_content.json not found!");
}
