# ⚡ StressCheck

**StressCheck** is a live heart rate monitoring app built to track real-time stress levels during the epic **Real Madrid vs Arsenal** second leg match.  
It captures heart BPM from a **Garmin watch** via **Bluetooth**, streams the data through a lightweight backend, and visualizes it with a dynamic frontend.

Whether you're chilled, stressed, or completely losing it — StressCheck shows it live! ❤️‍🔥

---

## 🚀 Overview

- **Heartbeat Service**: Connects to a Garmin watch via Bluetooth and sends live BPM data.
- **Flask Backend API**: Receives BPM data and streams it in real-time using Server-Sent Events (SSE).
- **React Frontend**: Displays heart rate trends, stress levels, emojis, and live sound effects.

> **Current Setup:** Mock BPM data is generated until the Garmin device is connected.

---

## 🛠 System Architecture

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

