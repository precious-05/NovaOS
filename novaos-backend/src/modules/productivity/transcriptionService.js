// transcriptionService.js
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Process meeting audio file using Whisper (Python)
 * @param {string} audioFilePath - Path to the audio file
 * @returns {Promise<{transcript: string, summary: string, actionItems: string[]}>}
 */
async function processMeetingAudio(audioFilePath) {
  console.log(`🎤 Processing audio file: ${audioFilePath}`);
  
  // Check if file exists
  if (!fs.existsSync(audioFilePath)) {
    throw new Error(`Audio file not found: ${audioFilePath}`);
  }

  // Path to the Python script
  const scriptPath = path.join(__dirname, 'scripts', 'transcribe.py');
  
  // Check if script exists
  if (!fs.existsSync(scriptPath)) {
    console.error(`❌ Python script not found at: ${scriptPath}`);
    // Fallback: return dummy data if script doesn't exist
    return {
      transcript: "Transcription not available. Please install Whisper.",
      summary: "Summary not available.",
      actionItems: ["Install Whisper for transcription"]
    };
  }

  try {
    // Call Python script with the audio file path
    const { stdout, stderr } = await execPromise(
      `python "${scriptPath}" "${audioFilePath}"`,
      { timeout: 300000 } // 5 minute timeout
    );

    if (stderr) {
      console.warn(`⚠️ Python stderr: ${stderr}`);
    }

    // Parse the JSON output from Python
    const result = JSON.parse(stdout);
    console.log(`✅ Transcription complete: ${result.transcript?.length || 0} characters`);
    
    return {
      transcript: result.transcript || "",
      summary: result.summary || "",
      actionItems: result.actionItems || []
    };
  } catch (error) {
    console.error(`❌ Transcription failed:`, error.message);
    
    // Return fallback data so the meeting doesn't fail
    return {
      transcript: "Transcription processing failed. Please check Whisper installation.",
      summary: "Summary not available due to processing error.",
      actionItems: ["Check Whisper installation and try again"]
    };
  }
}

module.exports = { processMeetingAudio };