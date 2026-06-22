# 🎖️ SSB Practice Simulator

A full-stack web app that helps Indian Armed Forces aspirants prepare for the **Services Selection Board (SSB)** — one of the toughest officer selection processes in the world.

🔗 **Live:** [ssb-prep.vercel.app](https://ssb-prep.vercel.app) &nbsp;|&nbsp; ⭐ Star if you find it useful!

---

## 🧠 What is SSB?

The SSB is a 5-day psychological and leadership assessment conducted by the Indian Armed Forces to select officers. Candidates go through written psychological tests, group tasks, and a personal interview — all designed to evaluate their Officer Like Qualities (OLQs).

Most aspirants struggle because there's **no realistic way to practice** these tests before the actual selection. This project solves that.

---

## 💡 What Does This App Do?

SSB Practice Simulator lets candidates practice all the major SSB psychological tests and conduct a **realistic AI-powered personal interview** — from the comfort of their browser.

### Practice Tests
- **WAT** — Word Association Test
- **TAT** — Thematic Apperception Test (image-based story writing)
- **SRT** — Situation Reaction Test
- **SDT** — Self Description Test
- **Lecturette** — Timed group discussion speech

### 🤖 AI Interview Simulator
The standout feature. Candidates fill in a **Personal Information Questionnaire (PIQ)** — the same form used in real SSB — and the app launches a full personal interview powered by **Groq**.

The AI acts as an SSB Interviewing Officer, asks tailored questions based on the candidate's background, and provides preparation advice at the end. Powered by **Groq** for fast inference. Available in **Chat mode** and **Voice mode** (spoken conversation using the Web Speech API).

> The simulator does not score or judge candidates — it purely provides a realistic practice environment.

---

## 🛠️ Built With

**Frontend:** React · Vite · React Router · Web Speech API  
**Backend:** Node.js · Express · Groq API (LLaMA via `groq-sdk`)  
**Database:** PostgreSQL (Supabase)  
**Deployment:** Vercel (frontend) · Railway/Render (backend)

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- A [Groq API key](https://console.groq.com/)
- A PostgreSQL database (e.g., [Supabase](https://supabase.com/))

### Backend

```bash
cd ssb-backend
npm install
```

Create `.env`:
```env
GROQ_API_KEY=your_key_here
FRONTEND_URL=http://localhost:8081
PORT=3001
DATABASE_URL=your_postgres_connection_string
```

```bash
npm run dev
```

### Frontend

```bash
cd ssb-frontend
npm install
```

Create `.env`:
```env
VITE_API_BASE_URL=http://localhost:3001
```

```bash
npm run dev
```

---

## ⚠️ Disclaimer

This is an independent project with **no affiliation** to the Indian Armed Forces or any official SSB authority. It is intended purely as a practice aid for aspirants.

---

