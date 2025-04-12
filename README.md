# StressCheck

**StressCheck** is a live heart rate monitoring app built to track real-time stress levels during the epic **Real Madrid vs Arsenal** second leg match.  
It captures heart BPM from a **Garmin watch** via **Bluetooth**, streams the data through a lightweight backend, and visualizes it with a dynamic frontend.

Whether you're chilled, stressed, or completely losing it — StressCheck shows it live! ❤️🔥

---

## 🚀 Overview

- **Heartbeat Service**: Connects to a Garmin watch via Bluetooth (or mocks data) and sends live BPM data.
- **Flask Backend API**: Receives BPM data and streams it in real-time using Server-Sent Events (SSE).
- **React Frontend**: Displays heart rate trends, stress levels, emojis, and music.

> **Current Setup:** Mock BPM data is generated locally until the Garmin device is connected.

---

## 🛠️ System Architecture

```mermaid
flowchart TD
    A[Garmin Watch (Bluetooth)] --> B(Heartbeat Service - Local PC)
    B -->|POST bpm data| C(Flask Backend API - Hosted on Heroku)
    C -->|Server-Sent Events (SSE)| D(React Frontend - Hosted on Vercel/Netlify)

    subgraph Local Machine
      B
    end

    subgraph Cloud Services
      C
      D
    end
```

---

## 📂 Project Structure

```
/
├── backend/       # Flask backend API (Heroku deployed)
├── frontend/      # React frontend (Vercel or Netlify deployed)
├── heartbeat/     # Local Heartbeat service (mocking or reading Garmin BPM)
├── README.md
```

---

## 🛠️ Development Setup

### 1. Backend (Flask API)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Linux/macOS
# OR
venv\Scripts\activate      # Windows

pip install -r requirements.txt

# Run backend locally
python app.py
```
App available at:  
➡️ `http://localhost:5000`

---

### 2. Frontend (React App)

```bash
cd frontend
npm install
npm run dev
```
Frontend available at:  
➡️ `http://localhost:5173`

(You'll need to adjust the API base URL if developing locally)

---

### 3. Heartbeat Service (Mock BPM Sender)

```bash
cd heartbeat
pip install requests

# Run locally (send to localhost backend)
python service.py

# OR send directly to Heroku backend
python service.py --remote
```

✅ `--remote` flag sends BPMs to Heroku instead of localhost.

---

## 🚀 Deployment

### 1. Backend (Heroku)

- Use **monorepo buildpack** and **Python buildpack**:
  ```bash
  heroku buildpacks:clear -a your-app-name
  heroku buildpacks:add -i 1 https://github.com/lstoll/heroku-buildpack-monorepo -a your-app-name
  heroku buildpacks:add -i 2 heroku/python -a your-app-name
  heroku config:set APP_BASE=backend -a your-app-name
  git push heroku main
  ```

- Confirm live at:
  ```
  https://your-app-name.herokuapp.com/
  ```

✅ Make sure you have a `Procfile` inside `backend/`:

```
web: gunicorn app:app
```

---

### 2. Frontend (Vercel or Netlify)

- Go to Vercel or Netlify dashboard
- Connect your GitHub repository
- Set build command:
  ```
  npm run build
  ```
- Set publish directory:
  ```
  dist
  ```
- Set environment variable:
  ```
  VITE_BACKEND_URL=https://your-backend.herokuapp.com
  ```

✅ Then deploy and go live!

---

## 🧐 Important Commands Reference

| Task | Command |
|:-----|:--------|
| Run Backend locally | `python app.py` inside `backend/` |
| Run Frontend locally | `npm run dev` inside `frontend/` |
| Run Heartbeat service locally | `python service.py` inside `heartbeat/` |
| Run Heartbeat service to Heroku | `python service.py --remote` |
| Deploy Backend to Heroku | `git push heroku main` |
| Open Backend Heroku URL | `heroku open -a your-app-name` |
| View Heroku logs | `heroku logs --tail -a your-app-name` |

---

## 🧪 Notes

- Backend uses **Server Sent Events (SSE)** for real-time updates.
- Frontend uses **EventSource** to stream live BPM updates.
- Heartbeat service currently mocks BPM data; Garmin device integration coming soon.

---

# 💪 Status: 
✅ Backend deployed  
✅ Frontend ready  
✅ Heartbeat service live  
✅ Real-time graph running

---

# 🏆 StressCheck

**See your heart racing when it matters!** ❤️🔥🏟️️
