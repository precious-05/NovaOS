// ocrService.js
// Uses tesseract.js (pure JS/WASM port of Tesseract) — no separate binary install needed.
// npm install tesseract.js

const Tesseract = require("tesseract.js");

async function extractTextFromImage(filePath) {
  const result = await Tesseract.recognize(filePath, "eng", {
    logger: () => {} // set to console.log if you want progress logs while testing
  });
  return result.data.text.trim();
}

module.exports = { extractTextFromImage };
