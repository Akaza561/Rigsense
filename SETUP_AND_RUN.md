# 🚀 RigSense - Setup & Run Guide

Welcome, friend! 👋 Use this guide to set up the **RigSense** project on your local machine.

---

## 🛠 Prerequisites

Before you start, make sure you have these installed:
1.  **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2.  **Python** (v3.8 or higher) - [Download](https://www.python.org/)
3.  **Git** - [Download](https://git-scm.com/)
4.  A **Code Editor** (VS Code recommended)

---

## 📥 1. Clone & Install Dependencies

Open your terminal and run:

```bash
# 1. Clone the repository
git clone <repository-url>
cd RIGSENSE

# 2. Install Backend Dependencies
cd backend
npm install

# 3. Install Frontend Dependencies
cd ../frontend
npm install
```

---

## 🔥 2. Firebase Authentication Setup (Crucial Step)

RigSense uses Firebase for Google Login. You need to create your own Firebase project.

### A. Create Project & Enable Auth
1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** -> Name it `RigSense-Dev`.
3.  In the sidebar, go to **Build** -> **Authentication**.
4.  Click **"Get started"**.
5.  Select **Google** as a Sign-in provider -> **Enable** it -> Save.

### B. Get Frontend Config
1.  Click the **Gear Icon** (Project Settings) -> General.
2.  Scroll to "Your apps" -> Click **Web (</>)**.
3.  Register app (Name: `RigSense Web`).
4.  **Copy the `firebaseConfig` object**.
5.  Open `frontend/src/firebase.js` in your code editor.
6.  **Replace** the existing `firebaseConfig` with YOURS.

### C. Get Backend Service Account
1.  In Project Settings, go to **Service accounts** tab.
2.  Click **"Generate new private key"** -> Download the JSON file.
3.  **Rename** the downloaded JSON file (which might have a long name like `rigsense-dev-firebase-adminsdk-xxxxx.json`) to `serviceAccountKey.json`.
4.  **Move** this newly renamed file to the `backend/config/` folder. The final path should be `backend/config/serviceAccountKey.json`.

---

## 🗄️ 3. Backend Configuration (.env)

1.  Navigate to the `backend/` folder.
2.  Create a new file named `.env`.
3.  Copy the following content into it:

```env
# Server Port
PORT=5000

# MongoDB Database (You can use this shared Dev DB or your own)
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/rigsense?retryWrites=true&w=majority

# JWT Secret (Can be anything)
JWT_SECRET=super_secret_key_123
```

> **Note:** If the MongoDB connection fails, you may need to whitelist your IP address in MongoDB Atlas, or use a local MongoDB URL (`mongodb://localhost:27017/rigsense`).

---

## 🐍 4. Python Setup (For AI Engine)

The AI engine requires a few Python libraries.

```bash
# Make sure you are in the root folder or backend folder
pip install pandas numpy
```

---

## 🚀 5. Run the Application

You need **Two Terminal Windows** running at the same time.

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
*You should see: "Server running on port 5000" and "MongoDB Connected"*

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```
*You should see: "Local: http://localhost:5173/"*

---

## 🎉 You're Done!
Open **http://localhost:5173** in your browser.
1.  Click **"Log In / Register"**.
2.  Sign in with Google.
3.  Create a username.
4.  Start building!
