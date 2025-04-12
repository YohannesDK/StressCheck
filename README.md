# ⚡ StressCheck

**StressCheck** is a live heart rate monitoring app designed to track stress levels during the thrilling **Real Madrid vs Arsenal** second leg match.  
It captures real-time BPM data from a **Garmin watch** via **Bluetooth**, streams the data through a lightweight **Flask backend**, and visualizes it with a dynamic **React frontend**.

Whether you're chilled, stressed, or completely losing it — StressCheck shows it live! ❤️‍🔥

---

## 🚀 Overview

- **Heartbeat Service**: Local service that connects via Bluetooth to a Garmin watch (mocked for now) and sends BPM data to the backend.
- **Flask Backend API**: Hosted on Heroku, receives BPM data and streams it in real-time using **Server-Sent Events (SSE)**.
- **React Frontend**: Hosted on Vercel, displays live heart rate trends, stress levels, emojis, and dynamic graphs.

> **Current Setup:** The heartbeat service generates **mock BPM data** until real Garmin device support is connected.

---

## 🛠 System Architecture

```mermaid
flowchart TD
    A[Garmin Watch (Bluetooth)] --> B(Heartbeat Service - Local PC)
    B -->|POST bpm data| C(Flask Backend API - Hosted on Heroku)
    C -->|Server-Sent Events (SSE)| D(React Frontend - Hosted on Vercel)

    subgraph Local Machine
      B
    end

    subgraph Cloud Services
      C
      D
    end

