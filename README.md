# 🛰️ Real-Time ISS + AI News Dashboard

A production-ready, modern React dashboard that tracks the **International Space Station live**, shows the **latest AI & space news**, and includes an **AI-powered chatbot** — all in one place.

---

## ✨ Features

### 🛰️ ISS Live Tracker
- Real-time ISS position updated every **10 seconds**
- Interactive **Leaflet world map** with animated ISS marker and orbital trail
- Live stats: latitude, longitude, altitude, velocity, visibility
- **Reverse geocoding** — shows country/ocean beneath ISS
- **People in Space** section listing all crew members
- Real-time **speed chart** (Recharts)

### 📰 News Dashboard
- Powered by **NewsData.io API**
- Categories: Technology · AI · Space · Science
- **Debounced search**, category filters, sorting
- Featured top headline banner
- **Infinite scroll** load-more pagination
- Missing image fallback handling
- Persists selected category in `localStorage`

### 🤖 AI Chatbot
- Powered by **Mistral-7B-Instruct** via Hugging Face Inference API
- Floating button with open/close animation
- Chat history persisted in `localStorage` (last 50 messages)
- **Markdown rendering** for bot responses
- Typing indicator animation
- Enter to send, Shift+Enter for newline
- Clear chat button
- Error handling with toast notifications

### 📊 Charts & Visualizations
- Real-time ISS **speed line chart** (last 20 readings)
- News category **donut pie chart**
- Full **ISS world map** view

### 🎨 UI/UX
- **Dark / Light mode** toggle (persisted)
- Glassmorphism cards with hover effects
- Framer Motion page transitions & animations
- Responsive sidebar + top navbar
- Custom scrollbar
- Loading skeletons & empty states
- React Error Boundary
- Toast notifications (react-hot-toast)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM v6 |
| Animation | Framer Motion |
| Charts | Recharts |
| Maps | React Leaflet + Leaflet |
| HTTP | Axios |
| Markdown | React Markdown |
| Toasts | React Hot Toast |
| Icons | Lucide React |

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone <repo-url>
cd iss-dashboard
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```
Edit `.env`:
```env
VITE_NEWSDATA_API_KEY=your_newsdata_api_key
VITE_HF_API_KEY=your_huggingface_api_key
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 4. Build for Production
```bash
npm run build
```

---

## 🔑 API Keys

| Service | Variable | Sign Up |
|---------|----------|---------|
| NewsData.io | `VITE_NEWSDATA_API_KEY` | [newsdata.io](https://newsdata.io) |
| Hugging Face | `VITE_HF_API_KEY` | [huggingface.co](https://huggingface.co/settings/tokens) |

ISS and Nominatim APIs are **free, no key required**.

---

## 📁 Project Structure

```
src/
├── assets/              # Static assets
├── chatbot/
│   └── Chatbot.jsx      # Floating AI chat window
├── charts/
│   ├── SpeedChart.jsx   # ISS real-time speed line chart
│   └── NewsPieChart.jsx # News category distribution
├── components/
│   ├── Layout.jsx       # App shell with sidebar + navbar
│   ├── Sidebar.jsx      # Navigation sidebar
│   ├── Navbar.jsx       # Top bar with theme toggle
│   ├── StatCard.jsx     # Reusable metric card
│   ├── NewsCard.jsx     # News article card
│   ├── SkeletonCard.jsx # Loading skeleton
│   └── ErrorBoundary.jsx
├── context/
│   └── ThemeContext.jsx # Dark/light theme
├── hooks/
│   ├── useISS.js        # ISS polling hook (10s interval)
│   ├── useNews.js       # News fetching with debounce
│   └── useChat.js       # Chatbot state & localStorage
├── map/
│   └── ISSMap.jsx       # Leaflet map with ISS marker + trail
├── pages/
│   ├── DashboardPage.jsx
│   ├── ISSPage.jsx
│   ├── NewsPage.jsx
│   └── ChartsPage.jsx
├── services/
│   ├── issService.js    # ISS + Nominatim API calls
│   ├── newsDataService.js
│   └── chatbotService.js
└── utils/
    └── formatters.js    # Date, speed, coordinate formatters
```

---

## ☁️ Deploy to Vercel

```bash
npm install -g vercel
vercel deploy
```

Set environment variables in Vercel dashboard:
- `VITE_NEWSDATA_API_KEY`
- `VITE_HF_API_KEY`

---

## 🔮 Future Improvements
- Add ISS pass-over prediction for your location
- More news sources (Guardian API, NYT)
- Chat with context from current news
- Offline PWA support
- ISS crew detailed bios
- Historical ISS orbit replay

---

## 📄 License
MIT
