# 🧘 SerenSpace

> Breathe. Be still. Begin again.

A meditation and mindfulness web app built for college students.

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
The `.env` file is already included. Update the API URL to match your teammate's backend:
```
VITE_API_URL=http://localhost:5000
```

### 3. Run the dev server
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```
src/
  components/
    NavBar.jsx          → Top navigation bar
    ProtectedRoute.jsx  → Redirect to /login if no token
  context/
    AuthContext.jsx     → Login, register, logout + JWT storage
  pages/
    Landing.jsx         → Home page with hero + features
    Login.jsx           → Login form with validation
    Signup.jsx          → Signup form with validation
    Dashboard.jsx       → Stats, quote, feature cards
    Library.jsx         → Meditation sessions grid + player
    Breathe.jsx         → ✨ Animated breathing circle
    Journal.jsx         → Mood tracker + Recharts line chart
    Timer.jsx           → Pomodoro timer with SVG progress ring
  App.jsx               → Routes setup
  main.jsx              → React entry point
  index.css             → Global styles, aurora bg, glass cards
```

---

## 🔌 Backend API Endpoints (your teammate's job)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register → returns `{ token, user }` |
| POST | `/api/auth/login` | Login → returns `{ token, user }` |
| GET | `/api/sessions` | Get all meditation sessions |
| POST | `/api/sessions/log` | Log a completed focus session |
| GET | `/api/journal` | Get all journal entries |
| POST | `/api/journal` | Create a new journal entry |

All protected routes need: `Authorization: Bearer <token>`

Token is stored in `localStorage` as `seren_token`.

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary text | `#2d2538` |
| Muted text | `#8c7fa0` |
| Accent | `#a78bca` |
| Heading font | Cormorant Garamond |
| Body font | DM Sans |

---

## 📦 Tech Stack

- React 18 + Vite
- React Router v6
- Framer Motion (animations)
- Recharts (mood chart)
- Tailwind CSS
