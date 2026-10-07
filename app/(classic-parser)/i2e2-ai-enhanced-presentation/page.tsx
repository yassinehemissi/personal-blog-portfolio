import { generateClassicPage, generateClassicMetadata } from "@/classic/classic-parser";

export const generateMetadata = () =>
  generateClassicMetadata("i2e2-ai-enhanced-presentation", { canonical: "/i2e2-ai-enhanced-presentation" });

export default generateClassicPage("i2e2-ai-enhanced-presentation");
