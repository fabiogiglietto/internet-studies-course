#!/usr/bin/env python3
"""Convert a PDF to Markdown using the Gemini API."""

import sys
import os
import google.generativeai as genai

def convert_pdf_to_md(pdf_path, output_path, prompt):
    api_key = os.environ.get("GEMINI_API_KEY") or sys.argv[4] if len(sys.argv) > 4 else os.environ["GEMINI_API_KEY"]
    genai.configure(api_key=api_key)

    print(f"Uploading {pdf_path}...")
    pdf_file = genai.upload_file(pdf_path)

    print("Sending to Gemini for conversion...")
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(
        [pdf_file, prompt],
        generation_config=genai.types.GenerationConfig(
            temperature=0.1,
            max_output_tokens=65536,
        ),
    )

    text = response.text

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text)

    print(f"Written to {output_path} ({len(text)} chars)")
    return text

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    output_path = sys.argv[2]
    prompt = sys.argv[3]
    convert_pdf_to_md(pdf_path, output_path, prompt)
