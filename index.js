const express = require("express");
const app = express();

app.use(express.json());

// HOME
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// CHAT API
app.get("/chat", (req, res) => {
  const text = req.query.text;

  if (!text) return res.json({ reply: "No text" });

  if (text.toLowerCase() === "hi") {
    return res.json({ reply: "Hello baby 😘" });
  }

  return res.json({ reply: "I don't know" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});
