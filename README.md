# RIGSENSE - AI-Powered PC Builder

**RIGSENSE** is an intelligent PC Configuration Assistant that uses **Weighted Scoring AI** (Heuristic Optimization) to build the perfect computer for your specific budget and use case.

## 🧠 The Architecture (How it works)
This is a **Full-Stack Application** with a Microservice Architecture:
*   **Frontend (React + Vite):** The beautiful Glassmorphism UI where users interact.
*   **Backend (Node.js + Express):** The API Gateway that manages requests and data.
*   **Database (MongoDB Atlas):** Stores 700+ PC components with live specs.
*   **AI Engine (Python):** (Coming Soon) A smart microservice that solves the "Knapsack Problem" to mathematically optimize value.

---

## 📁 Project Structure
The project is split into two distinct folders:

*   **📂 `frontend/`**: Contains the React Application.
    *   `src/pages/Builder.jsx`: Main UI.
    *   `src/components/`: Reusable UI elements.
*   **📂 `backend/`**: Contains the Server & Logic.
    *   `server.js`: Main Entry point.
    *   `models/`: Database Schemas.
    *   `scripts/`: Data Seeding tools.

---

## 🚀 How to Run (Step-by-Step)

You need to run **Two Terminals** at the same time (one for Frontend, one for Backend).

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
3.  Add your MongoDB Connection String.

---

## 🛠 Tech Stack
*   **Frontend:** React, Framer Motion, Three.js, Styled Components.
*   **Backend:** Node.js, Express, MongoDB (Mongoose).
*   **AI Layer:** Python (Pandas, NumPy).

## 🔮 Future Roadmap
*   [ ] Python AI Integration (Weighted Scoring).
*   [ ] User Authentication (Save Builds).
*   [ ] Multi-Build Generation (Performance vs Value options).
