# 🧠 The Node.js + Python Architecture (How it Thinks)

This diagram explains exactly how **Node.js (The Manager)** talks to **Python (The Brain)**.

---

## 🏗️ The Data Flow (Step-by-Step)

### Step 1: Node.js Prepares the "Briefcase" 💼
Node.js gathers all the necessary information into a JSON object.
It does **NOT** send raw database access. It sends a snapshot of data.

**The JSON Input (What Python Receives):**
```json
{
  "request": {
    "budget": 150000,
    "useCase": "Gaming",
    "monitorResolution": "1440p"
  },
  "database": [
    { "name": "RTX 4070", "price": 55000, "score": 12000, "type": "gpu" },
    { "name": "Ryzen 7 7800X3D", "price": 38000, "score": 9000, "type": "cpu" },
    { "name": "B650 WiFi", "price": 18000, "score": 100, "type": "motherboard" },
    // ... 700 more parts
  ]
}
```

---

### Step 2: The Handover (Child Process) 🤝
Node.js runs this command secretly:
`python3 backend/ai/optimizer.py`

It "pipes" (streams) the JSON above into the Python script's `stdin` (Standard Input).

---

### Step 3: Python Does the Math 🧮
The Python script wakes up, reads the JSON, and runs the **Knapsack Algorithm**.

1.  **Filter:** Removes incompatible parts.
2.  **Score:** Calculates Value = `Performance / Price` for every part.
3.  **Solve:** Finds the combination that gives the **Max Total Score** for < ₹1,50,000.

---

### Step 4: Python Returns the Result 📝
Python prints the result as a JSON string to `stdout` (Standard Output).

**The JSON Output (What Node.js Gets Back):**
```json
{
  "status": "success",
  "build": {
    "cpu": { "name": "Ryzen 7 7800X3D", "price": 38000 },
    "gpu": { "name": "RTX 4070", "price": 55000 },
    "ram": { "name": "32GB DDR5", "price": 12000 },
    "totalPrice": 145000,
    "performanceScore": 25000
  },
  "reasoning": "We picked the RTX 4070 because it offers 15% more value than the 4060 Ti.",
  "alternatives": [ ... ] 
}
```

---

### Step 5: Node.js Delivers the Package 📦
Node.js reads the output, parses it, and sends it to the Frontend.

---

## 🛠 Why this way?
1.  **Safety:** Python never touches the real database. It only sees what Node.js gives it.
2.  **Speed:** Node.js handles the user connection (fast), Python handles the math (smart).
3.  **Simplicity:** You can test the Python script manually by just feeding it a text file!
