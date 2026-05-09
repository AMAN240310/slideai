import uuid
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
import requests, io
from PIL import Image as PILImage

PAGE_W, PAGE_H = landscape(A4)

THEME_COLORS = {
    "dark":    {"bg": "#0D1017", "primary": "#6C63FF", "text": "#FFFFFF", "sub": "#AAAACC"},
    "light":   {"bg": "#FFFFFF", "primary": "#4F46E5", "text": "#1A1A2E", "sub": "#646480"},
    "ocean":   {"bg": "#042A4A", "primary": "#00B4D8", "text": "#F0F9FF", "sub": "#70B8D0"},
    "forest":  {"bg": "#082A14", "primary": "#2D6A4F", "text": "#D8F3DC", "sub": "#95D5B2"},
    "sunset":  {"bg": "#1A0533", "primary": "#FF6348", "text": "#FFF0F5", "sub": "#FF9080"},
    "minimal": {"bg": "#FAFAFA", "primary": "#222222", "text": "#222222", "sub": "#666666"},
}


def _hex(h): return HexColor(h)


def draw_slide_to_pdf(c: canvas, slide_data: dict, theme: dict, img_url: str = None, pg: int = 1):
    bg      = _hex(theme["bg"])
    primary = _hex(theme["primary"])
    text_c  = _hex(theme["text"])
    sub_c   = _hex(theme["sub"])

    # Background
    c.setFillColor(bg)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    slide_type = slide_data.get("type", "content")
    title      = slide_data.get("title", "")
    points     = slide_data.get("points", [])

    if slide_type == "title":
        if img_url:
            try:
                r   = requests.get(img_url, timeout=8)
                img = PILImage.open(io.BytesIO(r.content))
                c.drawInlineImage(img, 0, 0, PAGE_W, PAGE_H)
                c.setFillColor(_hex("#000000"))
                c.setFillAlpha(0.6)
                c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
                c.setFillAlpha(1.0)
            except:
                pass

        c.setFillColor(primary)
        c.rect(0.5*inch, 3.2*inch, 0.08*inch, 1.4*inch, fill=1, stroke=0)

        c.setFillColor(text_c)
        c.setFont("Helvetica-Bold", 36)
        c.drawString(0.8*inch, 4.2*inch, title[:60])

        subtitle = slide_data.get("subtitle", "")
        if subtitle:
            c.setFillColor(_hex(theme["primary"]))
            c.setFont("Helvetica", 18)
            c.drawString(0.8*inch, 3.6*inch, subtitle[:80])

    elif slide_type in ("content", "comparison"):
        # Left accent bar
        c.setFillColor(primary)
        c.rect(0, 0, 0.06*inch, PAGE_H, fill=1, stroke=0)

        c.setFillColor(text_c)
        c.setFont("Helvetica-Bold", 26)
        c.drawString(0.6*inch, PAGE_H - 1.0*inch, title[:60])

        c.setFillColor(primary)
        c.rect(0.6*inch, PAGE_H - 1.3*inch, PAGE_W - 1.2*inch, 2, fill=1, stroke=0)

        c.setFillColor(text_c)
        c.setFont("Helvetica", 15)
        for i, pt in enumerate(points[:5]):
            y = PAGE_H - 1.9*inch - i * 0.65*inch
            c.setFillColor(primary)
            c.circle(0.75*inch, y + 0.07*inch, 0.05*inch, fill=1, stroke=0)
            c.setFillColor(text_c)
            c.drawString(0.95*inch, y, pt[:90])

    elif slide_type == "statistic":
        stat       = slide_data.get("stat", "")
        stat_label = slide_data.get("stat_label", "")
        c.setFillColor(text_c)
        c.setFont("Helvetica-Bold", 20)
        c.drawCentredString(PAGE_W/2, PAGE_H - 1.2*inch, title)
        c.setFillColor(primary)
        c.setFont("Helvetica-Bold", 80)
        c.drawCentredString(PAGE_W/2, PAGE_H/2 + 0.5*inch, stat)
        c.setFillColor(_hex(theme["sub"]))
        c.setFont("Helvetica", 16)
        c.drawCentredString(PAGE_W/2, PAGE_H/2 - 0.4*inch, stat_label[:80])

    elif slide_type == "agenda":
        c.setFillColor(primary)
        c.rect(0, 0, 3.5*inch, PAGE_H, fill=1, stroke=0)
        c.setFillColor(text_c)
        c.setFont("Helvetica-Bold", 24)
        c.drawString(0.4*inch, PAGE_H - 1.0*inch, "AGENDA")
        for i, pt in enumerate(points[:6]):
            y = PAGE_H - 1.8*inch - i*0.7*inch
            c.setFont("Helvetica-Bold", 13)
            c.drawString(0.4*inch, y, f"{i+1}. {pt[:35]}")
        c.setFillColor(text_c)
        c.setFont("Helvetica-Bold", 30)
        c.drawString(4.0*inch, PAGE_H - 1.0*inch, title[:30])

    elif slide_type == "conclusion":
        c.setFillColor(primary)
        c.rect(0.5*inch, PAGE_H - 1.1*inch, 1.5*inch, 4, fill=1, stroke=0)
        c.setFillColor(_hex(theme["sub"]))
        c.setFont("Helvetica-Bold", 14)
        c.drawString(0.5*inch, PAGE_H - 1.3*inch, "KEY TAKEAWAYS")
        c.setFillColor(text_c)
        c.setFont("Helvetica-Bold", 28)
        c.drawString(0.5*inch, PAGE_H - 1.9*inch, title[:50])
        c.setFont("Helvetica", 15)
        for i, pt in enumerate(points[:4]):
            y = PAGE_H - 2.8*inch - i * 0.65*inch
            c.setFillColor(primary)
            c.rect(0.5*inch, y + 0.05*inch, 0.2*inch, 0.2*inch, fill=1, stroke=0)
            c.setFillColor(text_c)
            c.drawString(0.9*inch, y, pt[:90])

    # Page number
    c.setFillColor(sub_c)
    c.setFont("Helvetica", 9)
    c.drawRightString(PAGE_W - 0.4*inch, 0.3*inch, str(pg))


def generate_pdf(presentation_data: dict, theme_name: str, image_map: dict) -> tuple:
    theme    = THEME_COLORS.get(theme_name, THEME_COLORS["dark"])
    file_id  = str(uuid.uuid4())[:8]
    filename = f"app/generated/slideai_{file_id}.pdf"

    c = canvas.Canvas(filename, pagesize=landscape(A4))
    for i, slide_data in enumerate(presentation_data["slides"]):
        img_url = image_map.get(i)
        draw_slide_to_pdf(c, slide_data, theme, img_url, i + 1)
        c.showPage()

    c.save()
    return filename, file_id
