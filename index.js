const express = require("express");
const { createClient } = require("redis");

const app = express();
app.use(express.json());

// =======================
// REDIS CONNECT
// =======================
const client = createClient({
  url: process.env.REDIS_URL
});

client.connect()
  .then(() => console.log("Redis Connected ✔"))
  .catch((err) => console.log("Redis Error ❌", err));

// =======================
// HOME
// =======================
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// =======================
// TEACH API
// =======================
app.post("/teach", async (req, res) => {
  try {
    const { ask, ans } = req.body;

    if (!ask || !ans) {
      return res.json({ error: "Missing ask or ans" });
    }

    await client.set(ask.toLowerCase(), ans);

    res.json({
      success: true,
      ask,
      ans
    });

  } catch (e) {
    res.json({ error: "Teach failed" });
  }
});

// =======================
// DELETE API
// =======================
app.post("/delete", async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.json({ error: "Missing key" });
    }

    await client.del(key.toLowerCase());

    res.json({
      success: true,
      deleted: key
    });

  } catch (e) {
    res.json({ error: "Delete failed" });
  }
});

// =======================
// CHAT API
// =======================
app.get("/chat", async (req, res) => {
  try {
    const text = req.query.text?.toLowerCase();

    if (!text) {
      return res.json({ reply: "No text" });
    }

    const reply = await client.get(text);

    if (reply) {
      return res.json({ reply });
    }

    return res.json({ reply: "I don't know" });

  } catch (e) {
    res.json({ reply: "Error occurred" });
  }
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
