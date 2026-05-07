import express from "express";
import cors from "cors";
import { Chat } from "./chat.js"
const app = express();
import path from "path";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "../public")));
console.log("Serving from:",path.join(process.cwd(), "../public"));

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});