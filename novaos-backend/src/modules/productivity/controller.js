const { Task, Meeting, Document } = require("./model");
const { extractTextFromImage } = require("./ocrService");
const { processMeetingAudio } = require("./transcriptionService");

// =============================================
// ===== TASKS =====
// =============================================

exports.createTask = async (req, res) => {
  try {
    const { title, assignedTo, priority, deadline } = req.body;
    const task = await Task.create({
      companyId: req.user.companyId,
      title,
      assignedTo,
      priority,
      deadline
    });
    res.status(201).json({ success: true, message: "Task created", data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ companyId: req.user.companyId }).sort({ createdAt: -1 });
    res.json({ success: true, message: "Tasks retrieved", data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task updated", data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task deleted", data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =============================================
// ===== MEETINGS =====
// =============================================

exports.transcribeMeeting = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No audio file uploaded" });
    }

    const meeting = await Meeting.create({
      companyId: req.user.companyId,
      title: req.body.title || req.file.originalname,
      audioFileName: req.file.filename,
      status: "processing"
    });

    // respond immediately, process in background so the request doesn't hang
    res.status(202).json({
      success: true,
      message: "Processing started",
      data: { meetingId: meeting._id, status: meeting.status }
    });

    try {
      const { transcript, summary, actionItems } = await processMeetingAudio(req.file.path);
      meeting.transcript = transcript;
      meeting.summary = summary;
      meeting.actionItems = actionItems;
      meeting.status = "done";
      await meeting.save();
    } catch (processingErr) {
      meeting.status = "failed";
      await meeting.save();
      console.error("Meeting processing failed:", processingErr.message);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, companyId: req.user.companyId });
    if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });
    res.json({ success: true, message: "Meeting retrieved", data: meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ ADDED: Get all meetings for the company
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ companyId: req.user.companyId })
      .sort({ createdAt: -1 });
    res.json({ success: true, message: "Meetings retrieved", data: meetings });
  } catch (err) {
    console.error('❌ Error fetching meetings:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// =============================================
// ===== DOCUMENTS =====
// =============================================

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const document = await Document.create({
      companyId: req.user.companyId,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      status: "processing"
    });

    res.status(202).json({
      success: true,
      message: "Processing started",
      data: { documentId: document._id, status: document.status }
    });

    try {
      const ocrText = await extractTextFromImage(req.file.path);
      document.ocrText = ocrText;
      document.status = "done";
      await document.save();
    } catch (ocrErr) {
      document.status = "failed";
      await document.save();
      console.error("OCR failed:", ocrErr.message);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, companyId: req.user.companyId });
    if (!document) return res.status(404).json({ success: false, message: "Document not found" });
    res.json({ success: true, message: "Document retrieved", data: document });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// ===== GET ALL DOCUMENTS =====
exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ companyId: req.user.companyId })
      .sort({ createdAt: -1 });
    res.json({ success: true, message: "Documents retrieved", data: documents });
  } catch (err) {
    console.error('❌ Error fetching documents:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};