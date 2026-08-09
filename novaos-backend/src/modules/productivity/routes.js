const express = require("express");
const multer = require("multer");
const path = require("path");

const authMiddleware = require("../../shared/middleware/authMiddleware"); // Member 1's shared middleware
const {
  createTask, getTasks, updateTask, deleteTask,
  transcribeMeeting, getMeeting,
  uploadDocument, getDocument
} = require("./controller");

const router = express.Router();

// Multer storage — saves to a local uploads folder for now.
// Swap `destination` for Cloudflare R2 / S3 upload logic later if needed.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../../uploads")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// all routes require a logged-in user (Member 1's JWT middleware)
router.use(authMiddleware);

// Tasks
router.get("/tasks", getTasks);
router.post("/tasks", createTask);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

// Meetings
router.post("/meetings/transcribe", upload.single("audio"), transcribeMeeting);
router.get("/meetings/:id", getMeeting);

// Documents
router.post("/documents/upload", upload.single("file"), uploadDocument);
router.get("/documents/:id", getDocument);

module.exports = router;
