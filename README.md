# RIGSENSE - AI-Powered PC Builder

**RIGSENSE** is an intelligent PC Configuration Assistant that uses **Weighted Scoring AI** (Heuristic Optimization) to build the perfect computer for your specific budget and use case.

## 🧠 The Architecture (How it works)
This is a **Full-Stack Application** with a Microservice-style Architecture:
*   **Frontend (React + Vite):** A beautiful Glassmorphism UI where users interact, customize, and visualize builds.
*   **Backend (Node.js + Express):** The API Gateway that manages requests, user data, and database connections.
*   **AI Engine (Python):** A specialized optimization script that solves the "Knapsack Problem" to mathematically maximize performance per rupee.
*   **Database (MongoDB Atlas):** Stores 700+ PC components with live specs.

---

## 🚀 Features

### 🖥️ AI Build Generator
*   **Smart Allocation:** Intelligently splits budget based on Use Case (Gaming, Editing, Programming).
*   **Multi-Tier Options:** Generates 3 distinct builds:
    *   **Performance:** Max FPS/Speed (pushing the budget limit).
    *   **Balanced:** Good all-rounder with quality components.
    *   **Reliability:** Focus on future-proofing and high-end brands.

### 🛠️ Manual Builder (Custom Mode)
*   **Full Control:** Hand-pick every component.
*   **Bottleneck Detection:** Real-time analysis of CPU vs GPU balance.
*   **Compatibility Guard:** Automatically prevents mismatched sockets (e.g., AMD CPU on Intel Board) or wrong RAM types.
*   **Power Calculator:** Warns if PSU wattage is insufficient.

### 👤 User Ecosystem
*   **Google Login:** Seamless sign-in via Firebase.
*   **Save & Share:** Save your favorite configurations to your profile.
*   **Profile Management:** Custom username and build history.

---

## 📁 Project Structure

*   **📂 `frontend/`**: React Application.
    *   `src/pages/Builder.jsx`: Main Builder Logic (AI + Manual).
    *   `src/components/`: Reusable UI elements (Cards, Modals, Buttons).
*   **📂 `backend/`**: Node.js Server.
    *   `index.js`: Main Entry point.
    *   `controllers/`: Logic for Auth and Build generation.
    *   `ai/`: Python script (`optimizer.py`) for the AI Engine.
    *   `models/`: Mongoose Schemas.

---

## 🚀 How to Run (Step-by-Step)

You need to run **Two Terminals** at the same time (one for Frontend, one for Backend).

### Prerequisites
1.  **Node.js** & **npm** installed.
2.  **Python 3.x** installed (with `pandas`, `numpy`).
3.  **MongoDB Atlas** account (or local MongoDB).
4.  **Firebase Project** (for Auth).

### Terminal 1: backend
```bash
cd backend
npm install   # (Only first time)
npm run dev
```
*(Runs on Port 5000)*

### Terminal 2: frontend
```bash
cd frontend
npm install   # (Only first time)
npm run dev
```
*(Runs on Port 5173)*

### Environment Setup
1.  Navigate to `backend/`.
2.  Copy `.env.example` to a new file named `.env`.
3.  Add your MongoDB Connection String and JWT Secret.
4.  **Important:** Place your Firebase Service Account Key JSON file at `backend/config/serviceAccountKey.json`.

---

## 🛠 Tech Stack
*   **Frontend:** React, Framer Motion, Three.js, Styled Components.
*   **Backend:** Node.js, Express, MongoDB (Mongoose), Firebase Admin.
*   **AI Layer:** Python (Pandas, NumPy).

## 🔮 Roadmap
*   [x] AI Weighted Scoring Implementation.
*   [x] User Authentication (Google Login).
*   [x] Manual Builder Mode with Compatibility Checks.
*   [ ] Community Build Sharing (Public Gallery).
*   [ ] Price History Tracking.

---
*Created for the RIGSENSE Project 2026*
