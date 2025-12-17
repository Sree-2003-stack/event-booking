const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
console.log("MONGO_URI FROM ENV:", process.env.MONGO_URI);


const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB CONNECTED"))
  .catch((err) => {
    console.error("❌ MongoDB ERROR:", err.message);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
