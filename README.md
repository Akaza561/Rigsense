# RIGSENSE - PC Builder (College Mini-Project)

**RIGSENSE** is an AI-Powered PC Configuration Assistant designed to help users build computers based on their specific budget and use cases (Gaming, Programming, Video Editing).

This project demonstrates the use of **Modern Web Technologies** to solve a real-world problem: the complexity of choosing compatible PC parts.

## 💻 Tech Stack (What we used)
*   **Frontend:** React (Vite)
*   **Language:** JavaScript (ES6+)
*   **Styling:** Styled Components & Vanilla CSS
*   **Graphics:** Three.js (for the animated background)
*   **Animation:** Framer Motion
*   **Logic:** Custom JavaScript Algorithm for part compatibility and budget optimization.

---

## 🚀 How to Run This Project (Step-by-Step)

If you are new to this, don't worry! Just follow these exact steps.

### Step 1: Install Node.js
We need a tool called **Node.js** to run the website code.
1.  Go to [nodejs.org](https://nodejs.org/).
2.  Download the **LTS Version** (Recommended for Most Users).
3.  Install it like any normal program.

### Step 2: Download the Code
1.  Click the Green **Code** button on GitHub.
2.  Click **Download ZIP**.
3.  Unzip the folder and open it.

### Step 3: Open in VS Code
1.  Right-click the folder and select **Open with Code** (or drag the folder into VS Code).
2.  In VS Code, open the **Terminal** (Click `Terminal` -> `New Terminal` in the top menu).

### Step 4: Install Libraries
In the terminal, type this command and press Enter:
```bash
npm install
```
This single command automatically installs **everything** listed in our project file, including:
*   **React** (The UI library)
*   **Three.js** (For 3D graphics)
*   **Framer Motion** (For smooth animations)
*   **Styled Components** (For CSS-in-JS)
*   **Tailwind CSS** (If configured)

*(You don't need to install them one by one. `npm install` does it all!)*

### Step 5: Start the Website!
Once the installation finishes, type this command:
```bash
npm run dev
```

You should see a message like:
`> Local: http://localhost:5173/`

**Control + Click** that link to open the website in your browser.

---

## 🛠 Troubleshooting (If something breaks)

*   **Error: 'npm' is not recognized:** You didn't install Node.js correctly. Restart your computer and try again.
*   **Website is blank?** Check the terminal for red error messages.
*   **Want to stop the server?** Click in the terminal and press `Ctrl + C`.

## 📁 Project Structure (Where things are)
*   **src/pages/Builder.jsx**: The main page where the PC building happens.
*   **src/utils/builderLogic.js**: The "Brain" that picks the parts.
*   **public/data/components.csv**: The list of all PC parts (prices, specs).
