const express = require("express");
const { createClient } = require("redis");

const app = express();
app.use(express.json());

// =======================
// REDIS SETUP
// =======================
const client = createClient({
  url: process.env.REDIS_URL
});

client.on("error", (err) => console.log("Redis Error ❌", err));

// =======================
// ROUTES
// =======================

// HOME
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// TEACH
app.post("/teach", async (req, res) => {
  const { ask, ans } = req.body;

  if (!ask || !ans) {
    return res.json({ error: "Missing data" });
  }

  await client.set(ask.toLowerCase(), ans);

  res.json({ success: true });
});

// DELETE
app.post("/delete", async (req, res) => {
  const { key } = req.body;

  if (!key) {
    return res.json({ error: "Missing key" });
  }

  await client.del(key.toLowerCase());

  res.json({ success: true });
});

// CHAT
app.get("/chat", async (req, res) => {
  const text = req.query.text?.toLowerCase();

  if (!text) {
    return res.json({ reply: "No text" });
  }

  const reply = await client.get(text);

  return res.json({
    reply: reply || "I don't know"
  });
});

// =======================
// START SERVER (IMPORTANT FIX)
// =======================
async function start() {
  await client.connect();
  console.log("Redis Connected ✔");

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log("Server running on " + PORT);
  });
}

start();
