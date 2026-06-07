import express from "express";
import cors from "cors";
import { Chat } from "./chat.js"
const app = express();
//import path from "path";

// Middleware
app.use(
  cors({
    origin: "https://companychat-ai.web.app",
     methods: ["GET", "POST"],
  })
);
app.use(express.json());
// app.use(express.static(path.join(process.cwd(), "../public")));   //offline use
// console.log("Serving from:",path.join(process.cwd(), "../public"));

// API route
app.post("/api/chat", async (req, res) => {
  try {
    const { question } = req.body;

    const answer = await Chat(question);
    console.log(answer);

    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: Date.now(),
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});