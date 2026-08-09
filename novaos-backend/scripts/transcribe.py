"""
transcribe.py
Usage: python3 transcribe.py <path-to-audio-file>
Prints the transcript to stdout (nothing else — Node reads stdout directly).

Setup (one time):
    pip install openai-whisper
    # also needs ffmpeg installed on the system (apt install ffmpeg / brew install ffmpeg)
"""

import sys
import whisper

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 transcribe.py <audio_file>", file=sys.stderr)
        sys.exit(1)

    audio_path = sys.argv[1]

    # "base" model is a good free speed/accuracy tradeoff for meeting audio.
    # Use "small" if you have GPU/time and want better accuracy.
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)

    print(result["text"].strip())

if __name__ == "__main__":
    main()
