from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum

class ThemeEnum(str, Enum):
    dark    = "dark"
    light   = "light"
    ocean   = "ocean"
    forest  = "forest"
    sunset  = "sunset"
    minimal = "minimal"

class FileTypeEnum(str, Enum):
    pptx = "pptx"
    pdf  = "pdf"

class GenerateRequest(BaseModel):
    prompt:      str          = Field(..., min_length=3, max_length=2000)
    slide_count: int          = Field(default=8, ge=3, le=20)
    theme:       ThemeEnum    = ThemeEnum.dark
    file_type:   FileTypeEnum = FileTypeEnum.pptx
    language:    str          = "English"

class SummarizeRequest(BaseModel):
    text:        str = Field(..., min_length=50, max_length=50000)
    export_type: Optional[Literal["pdf", "slides"]] = None

class SlideContent(BaseModel):
    type:          str
    title:         str
    subtitle:      Optional[str]  = None
    points:        Optional[list] = None
    image_keyword: Optional[str]  = None
    speaker_notes: Optional[str]  = None
    stat:          Optional[str]  = None
    stat_label:    Optional[str]  = None

class PresentationJSON(BaseModel):
    title:  str
    slides: list[SlideContent]
