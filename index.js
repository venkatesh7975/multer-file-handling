const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 3002;

// Set up storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Save with timestamp
  },
});

// Initialize multer with storage configuration
const upload = multer({ storage });

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

// Set the view engine to serve EJS files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Route to display the upload form and uploaded images
app.get("/", (req, res) => {
  const images = fs.readdirSync("./uploads").map((file) => ({
    filename: file,
    path: `/uploads/${file}`,
  }));
  console.log(images);
  res.render("index", { images }); // Pass images to the EJS template
});

// Route to handle file upload
app.post("/upload", upload.array("images"), (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files uploaded.");
  }
  res.redirect("/"); // Redirect to the home page after upload
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
