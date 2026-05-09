import os, json, re
import google.generativeai as genai
from dotenv import load_dotenv
from app.models.schemas import PresentationJSON

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

SLIDE_PROMPT_TEMPLATE = """
You are an expert presentation designer and content strategist.
Create a professional, engaging presentation for the topic below.

Topic: {prompt}
Number of slides: {slide_count}
Language: {language}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{{
  "title": "Main Presentation Title",
  "slides": [
    {{
      "type": "title",
      "title": "Main Title",
      "subtitle": "Engaging subtitle here",
      "image_keyword": "technology abstract",
      "speaker_notes": "Welcome the audience..."
    }},
    {{
      "type": "agenda",
      "title": "Agenda",
      "points": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"],
      "speaker_notes": "Today we will cover..."
    }},
    {{
      "type": "content",
      "title": "Slide Title",
      "points": [
        "Key point one with brief explanation",
        "Key point two with impact",
        "Key point three with data"
      ],
      "image_keyword": "relevant keyword for unsplash",
      "speaker_notes": "Speaker note here"
    }},
    {{
      "type": "statistic",
      "title": "By The Numbers",
      "stat": "87%",
      "stat_label": "of companies report AI improves productivity",
      "points": ["Supporting point 1", "Supporting point 2"],
      "speaker_notes": "These numbers tell a story..."
    }},
    {{
      "type": "comparison",
      "title": "Before vs After",
      "points": ["Before: Manual process", "After: AI-automated", "Benefit: 10x faster"],
      "speaker_notes": "The contrast is clear..."
    }},
    {{
      "type": "conclusion",
      "title": "Key Takeaways",
      "points": ["Main insight 1", "Main insight 2", "Call to action"],
      "image_keyword": "success future",
      "speaker_notes": "To summarize everything..."
    }}
  ]
}}

Rules:
- Exactly {slide_count} slides
- Max 5 bullet points per slide
- Bullet points: concise, max 12 words each
- image_keyword: 2-4 words for Unsplash search (only for title/content/conclusion slides)
- Include title, agenda, at least one statistic, and conclusion slide
- speaker_notes: 1-2 sentences, conversational
- Make content professional and engaging
- Return ONLY JSON, nothing else
"""

SUMMARY_PROMPT_TEMPLATE = """
You are an expert at distilling complex information into clear, professional summaries.

Summarize the following text:
---
{text}
---

Provide:
1. A concise executive summary (3-5 sentences)
2. Key points (5-8 bullet points)
3. Main conclusions (2-3 sentences)

Format your response clearly with these three sections labeled.
"""

def clean_json_response(text: str) -> str:
    """Strip markdown code fences if present."""
    text = text.strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*",     "", text)
    text = re.sub(r"\s*```$",     "", text)
    return text.strip()

async def generate_presentation_json(
    prompt: str, slide_count: int, language: str = "English"
) -> dict:
    full_prompt = SLIDE_PROMPT_TEMPLATE.format(
        prompt=prompt, slide_count=slide_count, language=language
    )
    response = model.generate_content(full_prompt)
    cleaned  = clean_json_response(response.text)
    data     = json.loads(cleaned)

    # Ensure we have the right count
    if len(data.get("slides", [])) < slide_count:
        raise ValueError(f"Gemini returned fewer slides than requested.")
    data["slides"] = data["slides"][:slide_count]
    return data

async def summarize_text(text: str) -> str:
    prompt   = SUMMARY_PROMPT_TEMPLATE.format(text=text[:20000])
    response = model.generate_content(prompt)
    return response.text

async def extract_keywords_for_slides(slides: list) -> list:
    """Return only slides that need images, capped intelligently."""
    keyword_slides = [
        s for s in slides
        if s.get("image_keyword") and s.get("type") in ("title", "content", "conclusion")
    ]
    total = len(slides)
    limit = 2 if total <= 5 else 4 if total <= 10 else 5
    return keyword_slides[:limit]
