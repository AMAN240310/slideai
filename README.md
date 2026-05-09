# 🎯 SlideAI — AI Presentation Generator

A production-ready Gamma-like AI presentation platform built with **React + FastAPI + Gemini + Unsplash**.

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- [Gemini API Key](https://aistudio.google.com)
- [Unsplash API Key](https://unsplash.com/developers)

---

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env` (copy from `.env.example`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
UNSPLASH_SECRET_KEY=your_unsplash_secret_key_here
```

Run backend:
```bash
uvicorn app.main:app --reload --port 8000
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit → **http://localhost:5173**

---

## 🌐 Production Build

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 🎨 Features

- **AI-Powered**: Gemini AI generates professional slide content from a single prompt
- **6 Themes**: Dark, Ocean, Forest, Sunset, Minimal & Light
- **Auto Images**: Unsplash integration fetches perfect images for each slide
- **PPT & PDF Export**: Download as editable PowerPoint or print-ready PDF
- **AI Summarizer**: Paste long text and get an instant structured summary

---

## 🔧 Troubleshooting

| Issue | Fix |
|-------|-----|
| `GEMINI_API_KEY` invalid | Check [aistudio.google.com](https://aistudio.google.com) and ensure billing is enabled |
| Unsplash 403 error | Verify your Access Key is in `.env`; free tier allows 50 req/hr |
| `python-pptx` import error | Run `pip install python-pptx` in your activated venv |
| CORS error | Ensure Vite proxy is configured; backend running on port 8000 |

---

## 🚀 Deployment

**Backend → Railway / Render**
```
# Procfile
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Frontend → Vercel / Netlify**
```bash
cd frontend && npm run build
# Deploy the dist/ folder
```

Update `frontend/src/services/api.js` for production:
```js
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });
```
