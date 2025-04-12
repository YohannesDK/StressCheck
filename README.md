# StressCheck

**StressCheck** is a live heart rate monitoring app built to track real-time stress levels during the epic **Real Madrid vs Arsenal** second leg match.  
It captures heart BPM from a **Polar H9 chest strap** via **Bluetooth**, streams the data through a lightweight backend, and visualizes it with a dynamic frontend.

Whether you're chilled, stressed, or completely losing it — StressCheck shows it live! ❤️🔥

![StressCheck Screenshot](/appimg.png)

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://stress-check-eight.vercel.app)
![Frontend](https://img.shields.io/badge/Frontend-Vercel-success?style=for-the-badge&logo=vercel)
![Backend](https://img.shields.io/badge/Backend-Heroku-success?style=for-the-badge&logo=heroku)
![Built with](https://img.shields.io/badge/Built%20with-React%20%7C%20Flask-blue?style=for-the-badge&logo=react)

---

## 🚀 Overview

- **Heartbeat Service**: Connects to a Polar H9 via Bluetooth (or mocks data) and sends live BPM.
- **Flask Backend API**: Receives BPM data and streams it in real-time via Server-Sent Events (SSE).
- **React Frontend**: Displays heart rate, stress levels, emojis, and background music.

---

## 🛠️ System Architecture

```mermaid
flowchart TD
    A[Polar H9 (Bluetooth)] --> B(Heartbeat Service - Local PC)
    B -->|POST bpm data| C(Flask Backend API - Hosted on Heroku)
    C -->|Server-Sent Events (SSE)| D(React Frontend - Hosted on Vercel)

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
├── frontend/      # React frontend (Vercel deployed)
├── heartbeat/     # Heartbeat service (mock or real BPM)
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

Make sure to set VITE_BACKEND_URL correctly if needed.

---

### 3. Heartbeat Service (Mock BPM Sender)

```bash
cd heartbeat
pip install requests, bleak

# Run locally (send to localhost backend)
python service.py

# OR send directly to Heroku backend
python service.py --remote
```

✅ `--remote` flag sends BPMs to Heroku instead of localhost. <br>
✅ `--mock` send mock data instead, if you dont have BPM data avaible

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
- Heartbeat service can sends either real or mock bpm data to the backend in heroku.

---