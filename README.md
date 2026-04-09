🚀 AI Helper Chrome Extension

An AI-powered assistant integrated directly into coding platforms like maang.in to provide hints, explanations, and debugging help in real-time.

✨ Features
💬 In-page Chat UI

Seamlessly opens inside the problem page — no tab switching.

🧠 AI Assistance (Gemini API)

Ask doubts, get hints, explanations, and code help.

🔍 Automatic Hint Extraction

Intercepts internal API calls to fetch:

Hints
Solution approaches
Editorial code
🧾 Context-Aware Responses

AI receives:

Your code
Problem hints
Previous chat history
💾 Persistent Chat History

Chats are saved per problem using chrome.storage.

🧹 Clear Chat Option

Reset conversation anytime.

🏗️ Architecture
Website (maang.in)
        ↓
   inject.js  → Intercepts API calls (fetch/XHR)
        ↓
window.postMessage
        ↓
   content.js → UI + logic + storage
        ↓
chrome.runtime.sendMessage
        ↓
 background.js → Calls Gemini API
        ↓
   Response → UI
⚙️ How It Works
1. UI Injection
A button is injected into the problem page
Clicking it opens a chat interface
2. Network Interception

inject.js overrides:

fetch
XMLHttpRequest

Captures hidden API responses (hints, solutions)

3. Data Processing

Extracts:

hints
solution approach
editorial code

Stores in memory (Map)

4. AI Communication
User input + context → sent to background script
Background script calls Gemini API
Response is displayed in chat
📂 Project Structure
📦 AI-Helper-Extension
├── manifest.json
├── content.js        # UI + logic + storage
├── inject.js         # Network interception
├── background.js     # AI API handler
├── Images/
│   └── head.png
