from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.units import inch
import uuid, textwrap

PAGE_W, PAGE_H = A4

def generate_summary_pdf(summary_text: str) -> tuple:
    file_id  = str(uuid.uuid4())[:8]
    filename = f"app/generated/summary_{file_id}.pdf"
    c        = canvas.Canvas(filename, pagesize=A4)

    # Header bar
    c.setFillColor(HexColor("#4F46E5"))
    c.rect(0, PAGE_H - 1.2*inch, PAGE_W, 1.2*inch, fill=1, stroke=0)

    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 22)
    c.drawString(0.6*inch, PAGE_H - 0.8*inch, "AI-Generated Summary")

    c.setFillColor(HexColor("#111111"))
    c.setFont("Helvetica", 11)

    lines  = summary_text.split("\n")
    y      = PAGE_H - 1.6*inch
    margin = 0.6*inch

    for line in lines:
        wrapped = textwrap.wrap(line, width=90) or [""]
        for wl in wrapped:
            if y < 0.8*inch:
                c.showPage()
                y = PAGE_H - 0.8*inch
            is_header = line.startswith("#") or (line.isupper() and len(line) < 60)
            c.setFont("Helvetica-Bold" if is_header else "Helvetica", 13 if is_header else 11)
            c.setFillColor(HexColor("#4F46E5") if is_header else HexColor("#111111"))
            c.drawString(margin, y, wl)
            y -= 0.25*inch
        y -= 0.05*inch

    c.save()
    return filename, file_id
