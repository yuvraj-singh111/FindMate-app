# 🏠 FlatMate — AI Flatmate Compatibility Matcher

A full-stack app that uses Claude AI to match flatmates based on personality and lifestyle compatibility.

---

## 🗂 Project Structure

```
flatmate-app/
├── backend/          ← Node + Express + Socket.io
│   ├── server.js
│   ├── models/       ← MongoDB schemas (User, Match, Message)
│   ├── routes/       ← API routes (auth, users, matches, chat, ai)
│   ├── middleware/   ← JWT auth guard
│   └── controllers/  ← AI compatibility logic
│
└── frontend/         ← React app
    └── src/
        ├── pages/    ← Login, Signup, ProfileSetup, Dashboard, Swipe, MatchDetail, Chat
        ├── components/ ← Navbar
        └── context/  ← AuthContext (global login state)
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally (or MongoDB Atlas URI)
- An Anthropic API key (get one at console.anthropic.com)

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and fill in your values:
#   MONGO_URI=mongodb://localhost:27017/flatmate-app
#   JWT_SECRET=any_long_random_string
#   ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

Backend runs on: http://localhost:5000

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

---

## 🔑 Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/flatmate-app
JWT_SECRET=your_super_secret_jwt_key
ANTHROPIC_API_KEY=sk-ant-your-key-here
CLIENT_URL=http://localhost:3000
```

---

## 🧠 How the AI Works

1. User fills in their profile (sleep schedule, cleanliness, food habits, "About Me" paragraph)
2. When two users mutually like each other, the backend sends both profiles to Claude
3. Claude analyzes personality + preferences and returns:
   - A compatibility score (0–100)
   - List of similarities ("Both night owls", "Love cooking")
   - List of potential conflicts ("Different cleanliness expectations")
   - A 2–3 sentence plain-English summary
4. If the Anthropic API is unavailable, a rule-based fallback kicks in automatically

---

## 📡 API Reference

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/signup | Create account |
| POST | /api/auth/login | Login |
| GET  | /api/auth/me | Get current user |

### Users
| Method | Route | Description |
|--------|-------|-------------|
| GET  | /api/users/discover | Get profiles to swipe on |
| PUT  | /api/users/profile | Update your profile |
| GET  | /api/users/:id | Get a user's profile |

### Matches
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/matches/like/:id | Like someone |
| POST | /api/matches/dislike/:id | Skip someone |
| GET  | /api/matches | Get all your matches |
| GET  | /api/matches/:matchId | Get match details + AI insights |

### Chat
| Method | Route | Description |
|--------|-------|-------------|
| GET  | /api/chat/:matchId | Fetch message history |
| POST | /api/chat/:matchId | Send a message |

### AI
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/ai/analyze/:userId | Get AI compatibility with a user |

---

## 🔌 Real-time Events (Socket.io)

| Event | Direction | Description |
|-------|-----------|-------------|
| user_online | client→server | Register user as online |
| join_room | client→server | Join a chat room |
| send_message | client→server | Send a message |
| receive_message | server→client | Receive a new message |
| typing | client→server | User is typing |
| user_typing | server→client | Tell others someone is typing |
| stop_typing | client→server | User stopped typing |
| online_users | server→client | Broadcast online user list |

---

## 🎨 Design System

- **Fonts**: Syne (headings) + DM Sans (body)
- **Theme**: Dark — bg `#0a0a0f`, card `#16161f`
- **Accent**: Red `#ff6b6b`, Green `#6bcb77`, Yellow `#ffd93d`, Blue `#4d96ff`
- All CSS variables defined in `frontend/src/index.css`

---

## 🚀 Deploying

### Backend → Railway / Render
1. Push to GitHub
2. Connect repo to Railway or Render
3. Add environment variables in the dashboard
4. Deploy

### Frontend → Vercel / Netlify
1. In `frontend/package.json`, change `"proxy"` to your deployed backend URL
2. Or set `REACT_APP_SERVER_URL=https://your-backend.railway.app` in frontend env
3. Deploy with `npm run build`

---

## 🛣 What to build next

- [ ] Photo upload (Cloudinary / S3)
- [ ] Push notifications when you get a match
- [ ] In-app video call (WebRTC)
- [ ] Advanced filters (budget range, location radius)
- [ ] Admin dashboard to review flagged users
- [ ] Mobile app with React Native (same backend!)
