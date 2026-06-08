import "dotenv/config";
import fs from "fs";
import pdf from "pdf-parse";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
   model: "gemini-embedding-2"
});


const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY,
});
 
const pineconeIndex = pinecone.Index("rag-companychat");
export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex, maxConcurrency:5 });

export async function loadPDF(filepath) {
  const buffer = fs.readFileSync(filepath);

  const data = await pdf(buffer);

  const docs = [
    new Document({
      pageContent: data.text,
      metadata: {
        source: filepath,
      },
    }),
  ];

  return docs;
}

export async function indexTheDoc(filepath) {
  try {
    const docs = await reader.loadPDF();
    console.log("✅ PDF loaded");

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`✅ Chunks created: ${splitDocs.length}`);

    console.log("⏳ Generating embeddings via Google...");
    await vectorStore.addDocuments(splitDocs);

    console.log("🎉 Successfully indexed to Pinecone!");
  } catch (error) {
    console.error("❌ Indexing failed:", error);
  }
}