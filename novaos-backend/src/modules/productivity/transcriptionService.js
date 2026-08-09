// transcriptionService.js
// Step 1: audio -> text using local Whisper (via a Python script, since Node doesn't
//         have a mature free Whisper binding — Python's openai-whisper is the reliable free option)
// Step 2: text -> summary + action items using Groq (Llama 3.3 70B)
//
// npm install groq-sdk
// pip install openai-whisper  (one-time, on the machine running the backend)

const { execFile } = require("child_process");
const path = require("path");
const Groq = require("groq-sdk");

// Lazily created — NOT at module load time. server.js requires app.js (which
// pulls in this file) BEFORE it calls dotenv.config(), so if we build the
// Groq client at the top level here, process.env.GROQ_API_KEY is still
// undefined at that point. Creating it inside the function that uses it
// guarantees .env has already been loaded by then.
let groqClient = null;
function getGroqClient() {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

function runWhisper(audioFilePath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../../../scripts/transcribe.py");
    execFile("python", [scriptPath, audioFilePath], { maxBuffer: 1024 * 1024 * 20 }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      resolve(stdout.trim());
    });
  });
}

async function summarizeTranscript(transcript) {
  const prompt = `You are given a meeting transcript. Return ONLY valid JSON, no markdown fences, no extra text, in this exact shape:
{"summary": "2-4 sentence summary", "actionItems": ["item 1", "item 2"]}

Transcript:
${transcript}`;

  const response = await getGroqClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });

  const raw = response.choices[0].message.content.trim();
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // fallback if the model didn't return clean JSON
    return { summary: cleaned, actionItems: [] };
  }
}

async function processMeetingAudio(audioFilePath) {
  const transcript = await runWhisper(audioFilePath);
  const { summary, actionItems } = await summarizeTranscript(transcript);
  return { transcript, summary, actionItems };
}

module.exports = { processMeetingAudio };
