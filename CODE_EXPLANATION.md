# 📘 RIGSENSE - Technical Code Deep Dive

This document explains the **internal architecture** of RIGSENSE. Use this to understand *how* the code works under the hood.

---

## 🏗️ 1. Architecture Overview (The "Big Picture")

RIGSENSE follows a **Client-Server Architecture** (Monorepo):

1.  **Frontend (`/frontend`)**: A React Single Page Application (SPA). It handles the UI, animations, and user intent.
2.  **Backend (`/backend`)**: A REST API (Express.js). It processes data, connects to MongoDB, and executes logic.
3.  **Database (MongoDB Atlas)**: Stores component data (Processors, GPUs, RAM, etc.).

---

## 🎨 2. Frontend Deep Dive (`/frontend`)

The frontend is built with **React + Vite**.

### Core Files
*   **`src/main.jsx`**: The entry point. It mounts the React App to the DOM.
*   **`src/App.jsx`**: The main router. It decides which page to show (`Home` vs `Builder`).

### Key Components
#### `src/pages/Builder.jsx`
This is the "Brain" of the frontend.
*   **State Management (`useState`):** Tracks `budget`, `useCase`, and `isBuilding`.
*   **API Calls:** Uses `fetch()` to send data to `http://localhost:5000/api/build`.
*   **Visuals:** Uses `framer-motion` for the smooth fade-in effects.

#### `src/components/ui/animated-shader-background.jsx`
*   **Technology:** Uses **Three.js** and **GLSL Shaders**.
*   **How it works:** It creates a mathematical function (Fractal Brownian Motion) that runs on the GPU, creating the "Purple Smoke" effect.
*   **Optimization:** It uses a low-resolution render target upscaled to fit the screen to save battery.

---

## ⚙️ 3. Backend Deep Dive (`/backend`)

The backend is a **Node.js** server running **Express**.

### Core Files
*   **`index.js`**: The server starter.
    *   Connects to MongoDB (`connectDB()`).
    *   Sets up CORS (so Frontend can talk to Backend).
    *   Listens on Port 5000.

### The Logic (`controllers/buildController.js`)
This is where the magic happens (currently).
1.  **Receive:** Gets `{ budget: 100000, useCase: "Gaming" }` from Frontend.
2.  **Fetch:** Downloads ALL parts from MongoDB.
3.  **Filter:** Removes incompatible parts (e.g., Don't put an Intel CPU in an AMD Motherboard).
4.  **Allocate:** Splits budget (e.g., 40% for GPU if "Gaming").
5.  **Select:** Picks the best part that fits in the allocated budget slice.
6.  **Return:** Sends the final JSON list back to the Frontend.

### The Database Model (`models/Component.js`)
Defines the "Shape" of our data using **Mongoose Schema**.
*   `part`: String (e.g., "gpu")
*   `price`: Number (e.g., 30000)
*   `performance_score`: Number (for future AI)

---

## 🧠 4. AI Layer (Coming Soon)
We are moving the "Logic" from Node.js to **Python**.
*   **Why?** Node.js is good at "serving", but Python is better at "math".
*   **Plan:** We will use the **Knapsack Algorithm** to mathematically prove which combination of parts gives the highest total performance score for the price.

---

## 🔄 5. Data Flow Example

1.  **User** slides budget to ₹1.5 Lakh and clicks "Build".
2.  **Frontend** sends `POST` request to Backend.
3.  **Backend** asks MongoDB for parts.
4.  **Backend** runs the compatibility logic.
5.  **Backend** sends JSON response: `{ cpu: "Ryzen 7", gpu: "RTX 4070"... }`.
6.  **Frontend** receives JSON and renders the `BuildResult` card with animation.

---
*Created for the RIGSENSE Project 2026*
