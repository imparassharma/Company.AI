import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
console.log("Groq key present:", !!process.env.GOOGLE_API_KEY);
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-embedding-2"
});

try {
  const test = await embeddings.embedQuery("hello world");
  console.log("✅ Dimension:", test.length);
} catch (err) {
  console.error("❌ Error:", err.message);
}