# 🚀 AI Helper Chrome Extension

An AI-powered assistant integrated directly into coding platforms like **maang.in** to provide hints, explanations, and debugging help in real-time.

---

## ✨ Features

- 💬 In-page Chat UI (works inside problem page)
- 🧠 AI Assistance using Gemini API
- 🔍 Automatic Hint Extraction (fetch/XHR interception)
- 🧾 Context-aware responses (code + hints + history)
- 💾 Persistent chat history using chrome.storage
- 🧹 Clear chat option

---

## 🏗️ Architecture

Website (maang.in)
        ↓
   inject.js  → intercepts API calls
        ↓
window.postMessage
        ↓
   content.js → UI + logic + storage
        ↓
chrome.runtime.sendMessage
        ↓
 background.js → calls Gemini API
        ↓
   Response → UI

---

## ⚙️ How It Works

1. Injects a button into the problem page  
2. Opens chat UI inside the page  
3. Intercepts internal API calls (hints/solutions)  
4. Stores extracted data in memory  
5. Sends user query + context to AI  
6. Displays AI response in chat  

---

## 📂 Project Structure

AI-Helper-Extension/
├── manifest.json  
├── content.js  
├── inject.js  
├── background.js  
├── Images/  

---

## 🔧 Installation

1. Clone repo:
   git clone (https://github.com/VedanttPandey/AI-ChatBOT-extension.git)

2. Open Chrome → chrome://extensions/  
3. Enable Developer Mode  
4. Click "Load unpacked"  
5. Select project folder  

---

## 🔑 Setup

Add your Gemini API key in `background.js`:

const API_KEY = "YOUR_API_KEY";

⚠️ Do not expose your API key publicly

---

## 🧠 Tech Stack

- Chrome Extension (Manifest V3)
- JavaScript
- Chrome APIs (storage, runtime)
- Fetch/XHR interception
- Gemini API

---

## 🚨 Limitations

- Depends on website API structure  
- May break if site changes  
- API key exposed (needs backend for production)

---
