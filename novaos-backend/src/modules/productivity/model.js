const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// tasks collection
const taskSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
  title: { type: String, required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  deadline: { type: Date },
  status: { type: String, enum: ["pending", "in-progress", "done"], default: "pending" }
}, { timestamps: true });

// meetings collection
const meetingSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
  title: { type: String, required: true },
  audioFileName: { type: String },
  transcript: { type: String, default: "" },
  summary: { type: String, default: "" },
  actionItems: { type: [String], default: [] },
  status: { type: String, enum: ["processing", "done", "failed"], default: "processing" },
  date: { type: Date, default: Date.now }
});

// documents collection
const documentSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
  fileName: { type: String, required: true },
  fileUrl: { type: String },
  ocrText: { type: String, default: "" },
  status: { type: String, enum: ["processing", "done", "failed"], default: "processing" },
  uploadedAt: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", taskSchema);
const Meeting = mongoose.model("Meeting", meetingSchema);
const Document = mongoose.model("Document", documentSchema);

module.exports = { Task, Meeting, Document };
