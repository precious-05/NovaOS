#!/usr/bin/env python3
"""
Whisper Transcription Script for NovaOS
Usage: python transcribe.py <audio_file_path>
Output: JSON with transcript, summary, and action items
"""

import sys
import json
import os
import whisper

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "No audio file provided",
            "transcript": "",
            "summary": "",
            "actionItems": []
        }))
        sys.exit(1)
    
    audio_path = sys.argv[1]
    
    if not os.path.exists(audio_path):
        print(json.dumps({
            "error": f"Audio file not found: {audio_path}",
            "transcript": "",
            "summary": "",
            "actionItems": []
        }))
        sys.exit(1)
    
    try:
        # Load Whisper model
        print(f"Loading Whisper model...", file=sys.stderr)
        model = whisper.load_model("base")
        
        # Transcribe audio
        print(f"Transcribing audio: {audio_path}", file=sys.stderr)
        result = model.transcribe(audio_path)
        transcript = result["text"].strip()
        print(f"Transcription complete: {len(transcript)} characters", file=sys.stderr)
        
        # Generate a simple summary (first few sentences)
        sentences = transcript.split('. ')
        summary = '. '.join(sentences[:3]) + '.' if sentences else "No summary available."
        
        # Extract action items (simple keyword-based)
        action_items = []
        keywords = ["action", "todo", "need to", "must", "should", "will", "follow up"]
        for sentence in sentences:
            for keyword in keywords:
                if keyword.lower() in sentence.lower():
                    action_items.append(sentence.strip())
                    break
        
        # Limit action items
        action_items = action_items[:5]
        
        # Output JSON
        output = {
            "transcript": transcript,
            "summary": summary,
            "actionItems": action_items
        }
        print(json.dumps(output))
        
    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "transcript": f"Error: {str(e)}",
            "summary": "Summary not available",
            "actionItems": ["Check Whisper installation"]
        }), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()