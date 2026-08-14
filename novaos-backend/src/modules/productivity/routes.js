const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const authMiddleware = require("../../shared/middleware/authMiddleware");

// ===== IMPORT CONTROLLER FUNCTIONS =====
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  transcribeMeeting,
  getMeeting,
  getMeetings,
  uploadDocument,
  getDocument,
  getDocuments   // ← ADDED
} = require("./controller");

const router = express.Router();

// =============================================
// ===== MULTER CONFIGURATION =====
// =============================================

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for audio files
const audioFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/mp4', 'audio/mp3'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed'), false);
  }
};

// File filter for document/images
const documentFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Multer upload instances
const upload = multer({ 
  storage, 
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: audioFilter 
});

const uploadDocumentMiddleware = multer({ 
  storage, 
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: documentFilter 
});

// =============================================
// ===== ROUTES (All Protected) =====
// =============================================

router.use(authMiddleware);

// ===== TASKS =====
router.get("/tasks", getTasks);
router.post("/tasks", createTask);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

// ===== MEETINGS =====
router.post("/meetings/transcribe", upload.single("file"), transcribeMeeting);
router.get("/meetings", getMeetings);
router.get("/meetings/:id", getMeeting);

// ===== DOCUMENTS =====
router.post("/documents/upload", uploadDocumentMiddleware.single("file"), uploadDocument);
router.get("/documents", getDocuments);      // ← ADDED - Get all documents
router.get("/documents/:id", getDocument);   // Get single document

module.exports = router;