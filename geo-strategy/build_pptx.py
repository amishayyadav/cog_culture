"""Generate a basic .pptx file from SLIDES.md.

This is a fallback for when you can't use Gamma.app. It produces a clean,
plain deck that you can polish manually in PowerPoint or Keynote.

Usage:
    pip install python-pptx
    python build_pptx.py

Output:
    GEO_Strategy_Deck.pptx
"""

from __future__ import annotations

import re
from pathlib import Path

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

SLIDES_MD = Path(__file__).parent / "SLIDES.md"
OUTPUT = Path(__file__).parent / "GEO_Strategy_Deck.pptx"

PRIMARY = RGBColor(0x25, 0x63, 0xEB)  # blue-600
DARK = RGBColor(0x0F, 0x17, 0x2A)     # slate-900
GRAY = RGBColor(0x64, 0x74, 0x8B)     # slate-500


def parse_slides(md: str) -> list[dict]:
    """Split markdown into slide dicts. Drops the leading instruction block."""
    chunks = [c.strip() for c in md.split("\n---\n") if c.strip()]
    slides = []
    for chunk in chunks:
        # Skip the "How to use this file" preamble
        if chunk.startswith("# GEO Product Strategy Deck"):
            continue
        if "How to use this file" in chunk and chunk.startswith(">"):
            continue

        # Strip speaker notes
        body = re.split(r"\n>\s*Speaker notes:", chunk)[0].strip()

        # Title = first heading line
        lines = body.splitlines()
        title = ""
        body_lines: list[str] = []
        for line in lines:
            if not title and line.startswith("#"):
                title = re.sub(r"^#+\s*", "", line).strip()
            else:
                body_lines.append(line)
        slides.append({"title": title or "Slide", "body": "\n".join(body_lines).strip()})
    return slides


def add_title_slide(prs: Presentation, title: str, subtitle: str) -> None:
    layout = prs.slide_layouts[0]
    slide = prs.slides.add_slide(layout)
    slide.shapes.title.text = title
    if len(slide.placeholders) > 1:
        slide.placeholders[1].text = subtitle
    for para in slide.shapes.title.text_frame.paragraphs:
        for run in para.runs:
            run.font.color.rgb = PRIMARY
            run.font.size = Pt(44)
            run.font.bold = True


def add_content_slide(prs: Presentation, title: str, body: str) -> None:
    layout = prs.slide_layouts[5]  # Title only
    slide = prs.slides.add_slide(layout)
    slide.shapes.title.text = title
    for para in slide.shapes.title.text_frame.paragraphs:
        for run in para.runs:
            run.font.color.rgb = DARK
            run.font.size = Pt(32)
            run.font.bold = True

    # Add a text box for body content
    left, top, width, height = Inches(0.5), Inches(1.5), Inches(9), Inches(5.5)
    tx = slide.shapes.add_textbox(left, top, width, height)
    tf = tx.text_frame
    tf.word_wrap = True

    # Convert markdown body to flat bullets
    first = True
    for raw in body.splitlines():
        line = raw.rstrip()
        if not line:
            continue
        # Skip table delimiter lines
        if re.match(r"^\s*\|[\s\-:|]+\|\s*$", line):
            continue
        # Strip markdown emphasis
        text = re.sub(r"\*\*(.+?)\*\*", r"\1", line)
        text = re.sub(r"\*(.+?)\*", r"\1", text)
        text = re.sub(r"`([^`]+)`", r"\1", text)
        text = text.lstrip("- ").lstrip("* ").lstrip("> ").strip()
        if not text:
            continue

        para = tf.paragraphs[0] if first else tf.add_paragraph()
        para.text = text[:300]
        para.alignment = PP_ALIGN.LEFT
        for run in para.runs:
            run.font.size = Pt(16)
            run.font.color.rgb = DARK
        first = False


def main() -> None:
    md = SLIDES_MD.read_text(encoding="utf-8")
    slides = parse_slides(md)

    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Cover slide
    add_title_slide(
        prs,
        "Source Influence Engine",
        "Closing the loop between content and LLM citations · GEO Product Strategy",
    )

    # Content slides — skip the cover (already rendered) and the closing thank-you
    for s in slides:
        title = s["title"]
        # Skip dupes / cover
        if title.lower().startswith("source influence engine"):
            continue
        add_content_slide(prs, title, s["body"])

    prs.save(OUTPUT)
    print(f"✅ Wrote {OUTPUT.name} ({len(prs.slides)} slides)")
    print("   Open it in PowerPoint or Keynote and polish the layout.")
    print("   For a much nicer auto-designed result, paste SLIDES.md into Gamma.app instead.")


if __name__ == "__main__":
    main()
