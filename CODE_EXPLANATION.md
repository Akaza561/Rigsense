# RIGSENSE Code Explanation (Study Guide)

This guide breaks down the key parts of the project so you can explain it in your college presentation.

## 1. The "Brain" (Algorithm)
**File:** `src/utils/builderLogic.js`

This file contains the logic that picks the PC parts. It mimics a human expert.

### Key Concepts:
1.  **Platform Validation (The Safety Check):**
    *   Before picking anything, the code scans the `components.csv` file.
    *   It checks: *"Do we have DDR5 RAM?"*
    *   If NO, it automatically removes any Motherboard or CPU that requires DDR5.
    *   *Why?* This prevents the "Build Failed" error where the algorithm picks a CPU but can't find compatible RAM.

2.  **Use Case Mapping:**
    *   It translates user input (e.g., "Programming") into technical tags.
    *   `Programming` -> Looks for parts tagged `Productivity` or `General`.
    *   `Gaming` -> Looks for parts tagged `Gaming`.

3.  **Budget "Buckets":**
    *   It splits the total budget into percentages based on the Use Case.
    *   *Gaming:* 45% GPU, 15% CPU.
    *   *Programming:* 35% CPU, 10% GPU.

4.  **The Selection Loop (How it picks):**
    *   For each part (CPU, GPU, RAM...), it works like a funnel:
        1.  **Filter by Purpose:** Keeps only parts that match the `Use Case`.
        2.  **Filter by Budget:** Removes parts that are too expensive for that "bucket".
        3.  **Sort by Performance:** Picks the part with the **highest Performance Score** (from the CSV).

## 2. The "Face" (User Interface)
**File:** `src/pages/Builder.jsx`

This is a **React Component**. It manages what the user *sees*.

*   **State (`useState`):**
    *   `budget`: Stores the number (e.g., 50000).
    *   `useCase`: Stores the string (e.g., "Gaming").
    *   `buildResult`: Stores the final list of parts (or `null` if not built yet).
*   **The Flow:**
    *   When the user clicks "Get Rigged", it calls the `handleBuild` function.
    *   `handleBuild` calls the `generateBuild` function (from the "Brain").
    *   While waiting, it sets `isBuilding = true` to show "Building...".
    *   Once the result comes back, it displays the list of parts.

## 3. The "Beauty" (Shader Background)
**File:** `src/components/ui/animated-shader-background.jsx`

This creates the cool moving colors in the background. It uses **Three.js** and **GLSL** (Graphics Library Shader Language).

*   **What is a Shader?** It's a tiny program that runs on your Graphics Card (GPU), not your CPU.
*   **How it works:**
    *   It calculates the color of *every single pixel* on the screen 60 times a second.
    *   It uses math functions like `sin` and `cos` combined with `time` to create smooth, waving patterns that never repeat exactly.
    *   *Why use it?* It looks "premium" and modern compared to a static image.

## 5. The Entry Points (How it starts)
These two files are the "Front Door" of your application.

### `src/main.jsx` (The Foundation)
This is the very first file that runs when the website loads.
1.  **`createRoot`**: It finds the `<div id="root">` in your HTML file and tells React: *"Take control of this element."*
2.  **`BrowserRouter`**: It wraps your entire app in a "Router". This gives your app the ability to have different pages (URLs) without refreshing the browser.
3.  **`App`**: It renders the main component.

### `src/App.jsx` (The Traffic Controller)
This file decides **which page to show** based on the URL.
*   **`<Routes>`**: This acts like a switch.
*   **Route `/`**: Shows the `<Landing />` page (The nice intro screen).
*   **Route `/build`**: Shows the `<Builder />` page (The PC picking tool).

*Think of `main.jsx` as turning on the car, and `App.jsx` as the GPS telling it where to go.*
