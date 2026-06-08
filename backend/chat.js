import OpenAI from "openai";
import "dotenv/config";
import { vectorStore } from "./doc.js";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function Chat(question) {
  console.log({
  tracing: process.env.LANGCHAIN_TRACING_V2,
  project: process.env.LANGCHAIN_PROJECT,
  hasKey: !!process.env.LANGCHAIN_API_KEY,
});
  const relevantChunks = await vectorStore.similaritySearch(question, 1);
  const context = relevantChunks.map((chunk) => chunk.pageContent).join("\n\n");

  const SYSTEM_PROMPT =
    "You are an assistant for question-answering tasks. Use the given relevant pieces of retrieved context to answer the question. Don't answer directly copying and pasting from chunks but add your innovation and brain to it and answer in the best way possible for user asking query to a company bot system. Also if person is greeting, saying hi/hello or saying goodbye or something then you can reply to those by greeting the user again in this case. If you don't know the answer say I don't know *Strict Instruction*: Only answer question for which you find match in given relevant pieces of context chunks, If user asks question other than provied context then reply Please ask queries related to company only. Don't include jargons or special characters in the reply such as */[]/%/# etc.`;";

  const userquery = `Question: ${question}
    Relevant context : ${context}
    Answer:`;

  const Completion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userquery,
      },
    ],
    model: "openai/gpt-oss-120b",
    temperature: 1,
  });

  return Completion.choices[0].message.content;
}
