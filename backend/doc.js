import "dotenv/config";
DZ

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
   model: "gemini-embedding-2"
});


const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY,
});
 
const pineconeIndex = pinecone.Index("rag-companychat");
export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex, maxConcurrency:5 });

export async function indexTheDoc(filepath) {
  try {
    const loader = new PDFLoader(filepath, { splitPages: false });
    const docs = await loader.load();
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