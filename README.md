# AI-Powered Student Assistant

Hey! This is my MERN stack project where I built a web app that helps students learn better using AI. You can type any question, pick what you want (explanation, quiz, summary, or writing help), and get an instant AI-generated response powered by Google Gemini.

I built this as part of my internship assignment and honestly had a lot of fun figuring out the AI integration part!

---

## What does it do?

There are 4 modes you can use:

- **Explain Concept** - Type any topic and get a simple, beginner-friendly explanation
- **Generate MCQs** - Get 3 multiple choice questions on any topic (great for exam prep!)
- **Summarize Text** - Paste a long paragraph and get a short summary
- **Improve Writing** - Paste your writing and get grammar/clarity improvements

---

## Tech I used

- React.js (frontend)
- Node.js + Express (backend)
- Google Gemini API (AI)
- Tailwind CSS (styling)
- dotenv, nodemon (dev tools)

---

## How to run this locally

You'll need Node.js and a Gemini API key. You can get a free key at https://aistudio.google.com/app/apikey

**Step 1 - Clone and open the project**
```bash
git clone <repo-url>
cd AI-Powered_assistant
```

**Step 2 - Setup the backend**
```bash
cd server
npm install
```

Create a `.env` file in the server folder and add:
```
GEMINI_API_KEY=your_key_here
PORT=5000
```

Then start the server:
```bash
npm run dev
```

**Step 3 - Setup the frontend** (open a new terminal)
```bash
cd client
npm install
npm start
```

Now open http://localhost:3000 and you're good to go!

---

## Project Structure

```
AI-Powered_assistant/
├── client/
│   └── src/
│       ├── App.js          → the whole UI is here
│       ├── index.js
│       └── index.css
│
└── server/
    ├── server.js           → starts the server
    ├── app.js              → express setup
    ├── routes/
    │   └── ai.routes.js    → defines the API route
    ├── controllers/
    │   └── ai.controller.js → handles validation
    └── services/
        ├── ai.service.js       → talks to Gemini API
        └── prompt.service.js   → builds the prompts
```

---

## The AI part — how I integrated Gemini

The main API endpoint is `POST /api/ai/generate`. The frontend sends the user's text and selected mode to this endpoint.

On the backend, instead of just forwarding the raw text to Gemini, I first pass it through `prompt.service.js` which builds a proper structured prompt. Then `ai.service.js` sends that to Gemini and returns the response.

I kept the Gemini API call in a separate service file (`ai.service.js`) instead of putting it directly in the route handler. This keeps things clean and makes it easy to swap the AI provider later if needed.

The API key is stored in `.env` and never hardcoded anywhere in the code.

---

## Prompt Engineering — this was the most interesting part!

Honestly, this was my favorite part of the project. I learned that how you ask the AI something completely changes the quality of the response.

**The main idea:** I never send the raw user input directly to Gemini. Every request goes through `prompt.service.js` which wraps it in a structured prompt.

Each prompt has 4 parts:
1. A role for the AI (like "you are a university instructor")
2. Context about the situation
3. Constraints (word limits, format rules)
4. A guardrail so the AI doesn't make things up

---

### Explain Mode

```
You are an experienced university instructor.
Explain the following concept to a beginner student.
Use simple language. Keep the explanation under 150 words.
If you are not sure about something, say so.

Concept: [what the user typed]
```

Why I did it this way — giving it the "university instructor" role makes it sound confident and clear. The 150 word limit stops it from writing an essay. The "if not sure, say so" part is important because it stops the AI from confidently making up wrong information.

---

### MCQ Mode

```
You are an expert exam question designer.
Generate exactly 3 MCQs based on the topic below.
Return ONLY valid JSON in this format:
{"questions":[{"question":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct_answer":"A","explanation":"..."}]}

Topic: [what the user typed]
```

This one was tricky. I force it to return JSON because the frontend parses it and shows interactive question cards. If I didn't enforce the format, the AI would sometimes return plain text and the UI would break. The "explanation" field was my own addition — I thought it would be more useful for students to understand why an answer is correct.

---

### Summarize Mode

```
You are a content editor. Summarize the following text in 50-100 words.
Only use information from the text provided.

Text: [what the user typed]
```

The "only use information from the text" rule is really important here. Without it, the AI sometimes adds extra context or facts from its training data that weren't in the original text, which defeats the purpose of summarizing.

---

### Improve Writing Mode

```
You are a professional writing coach.
Improve the grammar, clarity and flow of the text below.
Do not change the original meaning.

Text: [what the user typed]
```

The "do not change the original meaning" constraint is the key one here. Early testing showed that without it, the AI would sometimes completely rewrite the text in its own style instead of just fixing the grammar.

---

## One thing I'd improve if I had more time

I'd add a history feature so students can see their previous questions and responses. Also streaming responses would feel much better UX-wise instead of waiting for the full response.

---

## API reference

**POST** `/api/ai/generate`

Request:
```json
{
  "prompt": "Explain JavaScript closures",
  "mode": "explain"
}
```

Response:
```json
{
  "success": true,
  "mode": "explain",
  "response": "A closure is..."
}
```

Valid modes: `explain`, `mcq`, `summarize`, `improve`

---

Made by **Gayatri Ingole**
MERN Stack Frontend Developer Intern — Assignment 1