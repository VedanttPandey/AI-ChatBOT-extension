const AIBOTIMG = chrome.runtime.getURL("Images/head.png");

let lastVisitedPage = "";
const problemDataMap = new Map();
window.problemDataMap = problemDataMap;
window.getCurrentProblemId = getCurrentProblemId;
// console.log("content.js running");
// console.log("Inject script added");

addInjectScript(); 

window.addEventListener("load", initUI); // ✅ UI after DOM ready

const observer = new MutationObserver(() => {
    handleContentChange();
});

function getCurrentProblemId() {
    const idMatch = window.location.pathname.match(/-(\d+)$/);
    return idMatch ? idMatch[1] : null;
}
function getProblemDatabyId(id){
    if(id && problemDataMap.has(id)){
        return problemDataMap.get(id);
    }
    return null;
}
// observer.observe(document.body, { childList: true, subtree: true });
function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) return callback(el);

    const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
            observer.disconnect();
            callback(el);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
// handleContentChange();


function isONTargetpage() {
    return window.location.pathname.startsWith("/problems/");
}

function isPageChange() {
    const currentPage = window.location.pathname;
    if (currentPage === lastVisitedPage) return false;
    lastVisitedPage = currentPage;
    return true;
}

function handleContentChange() {
    if (!isPageChange()) return;
    handlePageChange();
}

function handlePageChange() {
    if (!isONTargetpage()) return;
    addInjectScript();

   waitForElement(".font-rubik", (el) => {
    // console.log("FOUND ✅");
    showAIBOTbutton(el);
});
}
function initUI() {
    // console.log("🎨 UI init");

    const observer = new MutationObserver(() => {
        handleContentChange();
    });

    function startObserver() {
        if (!document.body) {
            setTimeout(startObserver, 50);
            return;
        }

        observer.observe(document.body, { childList: true, subtree: true });
    }

    startObserver();
    handleContentChange();
}

function addInjectScript() {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("inject.js");

    script.onload = () => script.remove();

    document.documentElement.appendChild(script);
}

let listenerAdded = false;


function showAIBOTbutton(parentElement) {
    if (document.getElementById("aibotimg")) return;

    const myButton = document.createElement("img");
    myButton.src = AIBOTIMG;
    myButton.id = "aibotimg";
    myButton.style.height = "40px";
    myButton.style.width = "40px";
    myButton.style.cursor = "pointer";

    parentElement.parentNode.insertAdjacentElement("afterend", myButton);

    myButton.addEventListener("click", toggleCHATbox);
}
let toggle = 0;

function toggleCHATbox() {
    toggle ^= 1;
    if (toggle) openChatBox();
    else closeChatBox();
}
window.addEventListener("message", (event) => {
    if (event.source !== window) return;

    const msg = event.data;

    if (!msg || msg.type !== "HINT_DATA") return;

    const data = msg.payload;

    // 🔥 VERY IMPORTANT FILTER
    if (!data.url || !data.url.includes("send_gamification_status")) return;

    // console.log("🎯 TARGET API FOUND:", data.url);

    try {
    const parsed = JSON.parse(data.response);

    const id = getCurrentProblemId();

    // console.log("📦 MAP:", problemDataMap);
    // console.log("📦 ID:", id);
    // console.log("🔥 PARSED:", parsed);

   const hintsObj = parsed?.data?.hints || {};

const hints = [
    hintsObj.hint1,
    hintsObj.hint2
].filter(Boolean);

// ✅ FIX: correct source
const solution = parsed?.data?.solution_approach || "";

// ✅ NEW: get code
const editorial = parsed?.data?.editorial_code || [];

let solutionCode = "";

// ✅ Prefer C++
const cppCode = editorial.find(e => 
    e.language?.toLowerCase().includes("cpp") ||
    e.language?.toLowerCase().includes("c++")
);

if (cppCode) {
    solutionCode = cppCode.code;
} else if (editorial.length > 0) {
    solutionCode = editorial[0]?.code || "";
}

    if (!problemDataMap.has(id)) {
        problemDataMap.set(id, {
        hints,
        solution,
        solutionCode
    });
    window.postMessage({
    type: "DEBUG_HINTS",
    data: problemDataMap.get(id)
}, "*");
    }

    // console.log("✅ CONTENT GOT HINTS:", hints);

} catch (e) {
    // console.log("❌ parse error", e);
}
});

function openChatBox() {
    if (document.getElementById("ai-chat-box")) return;

    const parentIMage = document.getElementsByClassName(
        "font-rubik text-fg-grey-primary text-xl leading-[130%] font-bold"
    );

    if (!parentIMage.length) return;

    const container = parentIMage[0].parentNode.parentNode;

    const chatBox = document.createElement("div");
    chatBox.id = "ai-chat-box";

    chatBox.style.width = "100%";
    chatBox.style.height = "250px";
    chatBox.style.background = "#2b2d31";
    chatBox.style.borderRadius = "10px";
    chatBox.style.marginTop = "10px";
    chatBox.style.display = "flex";
    chatBox.style.flexDirection = "column";
    chatBox.style.border = "1px solid #444";

    const header = document.createElement("div");
    header.innerText = "AI Helper";
    header.style.padding = "10px";
    header.style.color = "white";
    header.style.fontWeight = "bold";
    header.style.borderBottom = "1px solid #444";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";

    const messages = document.createElement("div");
    messages.style.flex = "1";
    messages.style.padding = "10px";
    messages.style.overflowY = "auto";
    messages.style.color = "white";

    const inputContainer = document.createElement("div");
    inputContainer.style.display = "flex";
    inputContainer.style.borderTop = "1px solid #444";

    const input = document.createElement("input");
    input.placeholder = "Type your message...";
    input.style.flex = "1";
    input.style.padding = "10px";
    input.style.border = "none";
    input.style.outline = "none";
    input.style.background = "#1e1e2f";
    input.style.color = "white";

    const sendBtn = document.createElement("button");
    sendBtn.innerText = "➤";
    sendBtn.style.padding = "10px";
    sendBtn.style.cursor = "pointer";
    sendBtn.style.background = "#5865f2";
    sendBtn.style.color = "white";
    sendBtn.style.border = "none";

    function deleteChat() {
    const key = getChatKey();

    chrome.storage.local.remove(key, () => {
        console.log("Chat deleted ✅");

        messages.innerHTML = ""; 
    });
}
    const dltBtn = document.createElement("button");
    dltBtn.innerText = "🗑️";
    dltBtn.style.padding = "10px";
    dltBtn.style.cursor = "pointer";
    dltBtn.style.background = "#f25858";
    dltBtn.style.color = "red";
    dltBtn.style.border = "none";
    dltBtn.addEventListener("click",deleteChat);
    header.appendChild(dltBtn);

   async function sendMessage() {
    if (!input.value.trim()) return;

    const text = input.value.trim();

    // 👉 show user message
    const userMsg = document.createElement("div");
    userMsg.innerText = "You: " + text;
    messages.appendChild(userMsg);

    // ✅ SAVE USER MESSAGE
    saveMessage({ role: "user", text });

    input.value = "";

    // 👉 show loading
    const aiMsg = document.createElement("div");
    aiMsg.innerText = "AI: thinking...";
    messages.appendChild(aiMsg);

    try {
        const problemId = getCurrentProblemId();

        // 🔥 get user code
        let code = "";
        const key = Object.keys(localStorage).find(k =>
            k.includes(`course_63988_${problemId}`)
        );
        if (key) code = localStorage.getItem(key) || "";

        // 🔥 get hints + solution
        async function waitForHints(id, timeout = 3000) {
            const start = Date.now();
            while (Date.now() - start < timeout) {
                if (problemDataMap.has(id)) {
                    return problemDataMap.get(id);
                }
                await new Promise(res => setTimeout(res, 100));
            }
            return { hints: [], solution: "", solutionCode: "" };
        }

        const data = await waitForHints(problemId);

        const hints = data.hints || [];
        const solution = data.solution || "";
        const solutionCode = data.solutionCode || "";

        // 🔥 OPTIONAL: include previous chats (context)
        function getChatHistory() {
            return new Promise((resolve) => {
                const key = "AI_CHAT_" + window.location.pathname;
                chrome.storage.local.get([key], (result) => {
                    resolve(result[key] || []);
                });
            });
        }

        const history = await getChatHistory();

        const historyText = history
            .map(msg => `${msg.role.toUpperCase()}: ${msg.text}`)
            .join("\n");

        // 🔥 final prompt
        const finalPrompt = `
You are a competitive programming assistant.

Rules:
- Prefer hints
- Be clear
- Give full solution only if asked

Previous Conversation:
${historyText || "No previous chat"}

User Question:
${text}

User Code:
${code || "No code"}

Hints:
${hints.join("\n") || "None"}

Solution:
${solution || "Not available"}

Reference Code:
${solutionCode || "Not available"}
`;

        // 🔥 call AI
        const reply = await askAI(finalPrompt);

        aiMsg.innerText = "AI: " + reply;

        // ✅ SAVE AI MESSAGE
        saveMessage({ role: "ai", text: reply });

    } catch (err) {
        // console.error(err);

        aiMsg.innerText = "AI: Failed to respond";

        saveMessage({ role: "ai", text: "Error: Failed to respond" });
    }
}
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    sendBtn.onclick = sendMessage;

    inputContainer.appendChild(input);
    inputContainer.appendChild(sendBtn);
    // inputContainer.appendChild(dltBtn);

    chatBox.appendChild(header);
    chatBox.appendChild(messages);
    chatBox.appendChild(inputContainer);

    container.appendChild(chatBox);
    loadChats(messages);
}

function closeChatBox() {
    const box = document.getElementById("ai-chat-box");
    if (box) box.remove();
}

function saveMessage(msg) {
    const key = getChatKey();
    chrome.storage.local.get([key], (result) => {
        const oldChats = result[key] || [];
        chrome.storage.local.set({ [key]: [...oldChats, msg] });
    });
}

function loadChats(messagesContainer) {
    messagesContainer.innerHTML = ""; // clear old messages

    const key = "AI_CHAT_" + window.location.pathname;

    chrome.storage.local.get([key], (result) => {
        const chats = result[key] || [];

        chats.forEach((msg) => {
            const div = document.createElement("div");

            // 🔥 FIX: access object fields
            if (typeof msg === "string") {
                div.innerText = msg; // old format
            } else {
                div.innerText =
                    (msg.role === "user" ? "You: " : "AI: ") + msg.text;
            }

            messagesContainer.appendChild(div);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
    // console.log("CHATS DATA:", chats);
}

function getChatKey() {
    return "AI_CHAT_" + window.location.pathname;
}

function askAI(prompt) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            { type: "ASK_AI", prompt },
            (response) => {
                if (chrome.runtime.lastError) {
                    // console.log("❌ Runtime error:", chrome.runtime.lastError);
                    resolve("AI unavailable (runtime error)");
                    return;
                }

                if (!response) {
                    resolve("AI unavailable (no response)");
                    return;
                }

                resolve(response);
            }
        );
    });
}


setTimeout(() => {
    // 🔥 get code from localStorage (for any problem + any language)
    function getMyCode() {
        const problemId = window.location.pathname.match(/-(\d+)/)?.[1];

        if (!problemId) return "";

        const key = Object.keys(localStorage).find(k =>
            k.includes(`course_63988_${problemId}`)
        );

        if (!key) {
            // console.log("No key found ❌");
            return "";
        }

        return localStorage.getItem(key) || "";
    }

    const code = getMyCode();

    if (!code) {
        // console.log("No code found ❌");
        return;
    }

    // console.log("Code Found ✅:", code);

    // 🔥 send to AI
    const prompt = `
You are a coding assistant.
Only answer what user asks.

User: what is wrong in my code?

Code:
${code}
`;

    chrome.runtime.sendMessage(
        {
            type: "ASK_AI",
            prompt: prompt
        },
        (response) => {
            // console.log("AI:", response);
        }
    );

}, 2000);


window.addEventListener("message", (e) => {
    if (e.data?.type === "DEBUG_HINTS") {
        // console.log("🔥 HINT DATA:", e.data.data);
    }
});

function getChatKey() {
    return "AI_CHAT_" + window.location.pathname;
}

function getChatHistory(callback) {
    const key = "AI_CHAT_" + window.location.pathname;

    chrome.storage.local.get([key], (result) => {
        callback(result[key] || []);
    });
}

getChatHistory((chats) => {
    console.log("Chats:", chats);
});