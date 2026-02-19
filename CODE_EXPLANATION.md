# 📘 RIGSENSE - Technical Code Deep Dive

This document explains the **internal architecture** of RIGSENSE. Use this to understand *how* the code works under the hood.

---

## 🏗️ 1. Architecture Overview (The "Big Picture")

RIGSENSE follows a **Client-Server Architecture** (Monorepo) augmented by a **Python AI Microservice**:

1.  **Frontend (`/frontend`)**: A React Single Page Application (SPA). It handles the UI, animations, and user intent.
2.  **Backend (`/backend`)**: A REST API (Express.js). It processes data, connects to MongoDB, handles Auth, and orchestrates the AI logic.
3.  **AI Engine (`/backend/ai`)**: A Python script (`optimizer.py`) running locally via spawn. It performs complex mathematical optimization (Knapsack Problem).
4.  **Database (MongoDB Atlas)**: Stores component data (Processors, GPUs, RAM, etc.) and User Profiles.
5.  **Auth (Firebase + JWT)**: Handles identity verification and session management.

---

## 🎨 2. Frontend Deep Dive (`/frontend`)

The frontend is built with **React + Vite**. It features a Glassmorphism design system.

### Core Files
*   **`src/main.jsx`**: The entry point.
*   **`src/App.jsx`**: The router (`/`, `/build`, `/login`, `/builder` redirect).
*   **`src/context/AuthContext.jsx`**: Manages user session state using Firebase and Backend verification.

### Key Pages & Components
#### `src/pages/Builder.jsx`
This is the "Brain" of the frontend.
*   **Modes:** Toggles between "AI Builder" (Automatic) and "Manual Builder" (Custom).
*   **State Management:** Tracks `budget`, `useCase`, `buildResult`, and `manualSelections`.
*   **Integration:** Calls `generateBuild()` (AI) or local logic for manual selection.

#### `src/components/ManualBuilder.jsx`
*   **Purpose:** Allows experienced users to hand-pick parts.
*   **Features:**
    *   Fetches all compatible parts from backend.
    *   Tracks "Bottleneck Percentage" (CPU vs GPU balance).
    *   Calculates total wattage and verifies PSU.
    *   Syncs selections back to `Builder.jsx` state.

#### `src/components/BuildResult.jsx`
*   **Purpose:** Displays the generated PC build.
*   **Interactivity:** Allows users to Edit specific parts, Save the build to their profile, or Reset.

#### `src/components/ui/animated-shader-background.jsx`
*   **Technology:** **Three.js** and **GLSL Shaders**.
*   **Effect:** Creates the signature "Purple Smoke" fractal background.

---

## ⚙️ 3. Backend Deep Dive (`/backend`)

The backend is a **Node.js** server running **Express**.

### Core Files
*   **`index.js`**: Server entry point. Connects DB, Middleware, Routes.
*   **`controllers/buildController.js`**:
    *   **The Orchestrator:** Receives build request.
    *   **AI Hand-off:** Spawns a Python process to run `optimizer.py`.
    *   **Response:** Sends the optimized build list back to Frontend.
*   **`controllers/authController.js`**:
    *   Handles Google Login (verifies Firebase Token).
    *   Manages User Profile (Username, Avatar).
    *   Saves Builds to MongoDB.

### The AI Logic (`ai/optimizer.py`)
This script implements the **Knapsack Algorithm** variant.
1.  **Input:** Budget, Use Case (Gaming/Workstation).
2.  **Data:** Loads all parts from CSV/DB dump.
3.  **Process:**
    *   Assigns weights to components based on Use Case (e.g., Gaming = High GPU weight).
    *   Filters incompatible parts (Socket matching, DDR type).
    *   Iteratively selects the best combination that fits under the budget ceiling.
4.  **Output:** Returns JSON of the selected build.

---

## 🔐 4. Authentication System

We use a **Hybrid Auth** approach:
1.  **Firebase Auth:** Handles the actual Sign-In (Google Popup). It provides a secure ID Token.
2.  **Backend Verification:**
    *   Frontend sends Firebase Token to `/api/users/google-login`.
    *   Backend verifies token using `firebase-admin`.
    *   Backend checks/creates the User in MongoDB.
    *   Backend returns user profile (and optionally a JWT for session).

---

## 💾 5. Database Schema (`models/`)

*   **`Component.js`**: `part` (type), `name`, `price`, `specs` (watage, socket, etc.), `performance_score`.
*   **`User.js`**: `username`, `email`, `firebaseUid`, `savedBuilds` (Array of build objects).

---

## 🔄 6. Data Flow Example (AI Build)

1.  **User** sets Budget ₹1.5L & Case "Gaming".
2.  **Frontend** POSTs to `/api/build`.
3.  **Backend** spawns `python ai/optimizer.py 150000 Gaming`.
4.  **Python Script** loads data, runs optimization, prints JSON result to stdout.
5.  **Backend** captures JSON, parses it, and sends response.
6.  **Frontend** renders 3 tabs: "Performance", "Balanced", "Reliability".

---
*Created for the RIGSENSE Project 2026*
